"""
Export Routes: Handle exporting CV extraction data as tables.
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, UTC
from bson import ObjectId
import logging
from typing import Dict, Any, List

from app.database import exports_collection, cvs_collection
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/export", tags=["Export"])
logger = logging.getLogger(__name__)


@router.post("/cv/{cv_id}")
async def export_cv_data(
    cv_id: str,
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Export CV extraction data as a table format and save to database.
    Returns the exported data structure.
    """
    try:
        # Get CV document
        cv = await cvs_collection.find_one({"_id": ObjectId(cv_id)})
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")
        
        if str(cv.get("user_id")) != str(current_user["_id"]):
            raise HTTPException(
                status_code=403,
                detail="Forbidden: You do not own this CV"
            )

        # Extract all data and format as table (rows and columns)
        table_data = _format_cv_data_as_table(cv)

        # Save export to database
        export_document = {
            "cv_id": cv_id,
            "filename": cv.get("filename", "unknown"),
            "user_id": str(current_user["_id"]),
            "export_date": datetime.now(UTC),
            "table_data": table_data,
            "metadata": {
                "total_rows": len(table_data.get("rows", [])),
                "total_columns": len(table_data.get("columns", [])),
                "cv_filename": cv.get("filename", "unknown"),
                "upload_date": cv.get("upload_date")
            }
        }

        result = await exports_collection.insert_one(export_document)
        export_id = str(result.inserted_id)

        logger.info(f"Export created: {export_id} for CV: {cv_id}")

        return {
            "export_id": export_id,
            "cv_id": cv_id,
            "filename": cv.get("filename", "unknown"),
            "export_date": export_document["export_date"].isoformat(),
            "table_data": table_data,
            "message": "Export saved successfully"
        }

    except ValueError as e:
        logger.error(f"Invalid CV ID format: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid CV ID: {str(e)}")
    except Exception as e:
        logger.error(f"Failed to export CV data: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to export CV data: {str(e)}"
        )


def _format_cv_data_as_table(cv: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format CV extraction data as a table with columns and rows.
    Every property and its value is included.
    """
    columns = []
    rows = []

    # Extract basic CV info
    rows.append({
        "Property": "CV ID",
        "Value": str(cv.get("_id", "")),
        "Category": "Metadata"
    })
    rows.append({
        "Property": "Filename",
        "Value": cv.get("filename", ""),
        "Category": "Metadata"
    })
    rows.append({
        "Property": "Upload Date",
        "Value": cv.get("upload_date").isoformat() if cv.get("upload_date") else "",
        "Category": "Metadata"
    })
    rows.append({
        "Property": "User ID",
        "Value": cv.get("user_id", ""),
        "Category": "Metadata"
    })

    # Extract raw text (truncated for table)
    raw_text = cv.get("raw_text", "")
    if raw_text:
        rows.append({
            "Property": "Raw Text (Preview)",
            "Value": raw_text[:500] + "..." if len(raw_text) > 500 else raw_text,
            "Category": "Content"
        })
        rows.append({
            "Property": "Raw Text Length",
            "Value": str(len(raw_text)),
            "Category": "Content"
        })

    # Extract entities
    entities = cv.get("entities", {})
    if entities:
        # Check if it's structured format
        if isinstance(entities, dict) and ("raw" in entities or "structured" in entities):
            # Structured format
            raw_entities = entities.get("raw", {})
            structured = entities.get("structured", {})
            
            # Process raw entities
            if raw_entities:
                for entity_type, values in raw_entities.items():
                    if isinstance(values, list):
                        for idx, value in enumerate(values):
                            rows.append({
                                "Property": f"{entity_type}",
                                "Value": str(value),
                                "Category": "Entity",
                                "Index": idx + 1
                            })
                    else:
                        rows.append({
                            "Property": f"{entity_type}",
                            "Value": str(values),
                            "Category": "Entity"
                        })
            
            # Process structured blocks
            experience_blocks = structured.get("EXPERIENCE_BLOCKS", [])
            if experience_blocks:
                for idx, block in enumerate(experience_blocks):
                    if isinstance(block, dict):
                        rows.append({
                            "Property": "Experience Block - Title",
                            "Value": block.get("title", ""),
                            "Category": "Structured Experience",
                            "Block Index": idx + 1
                        })
                        rows.append({
                            "Property": "Experience Block - Company",
                            "Value": block.get("company", ""),
                            "Category": "Structured Experience",
                            "Block Index": idx + 1
                        })
                        rows.append({
                            "Property": "Experience Block - Date",
                            "Value": block.get("date", ""),
                            "Category": "Structured Experience",
                            "Block Index": idx + 1
                        })
                        rows.append({
                            "Property": "Experience Block - Location",
                            "Value": block.get("location", ""),
                            "Category": "Structured Experience",
                            "Block Index": idx + 1
                        })
            
            education_blocks = structured.get("EDUCATION_BLOCKS", [])
            if education_blocks:
                for idx, block in enumerate(education_blocks):
                    if isinstance(block, dict):
                        rows.append({
                            "Property": "Education Block - Degree",
                            "Value": block.get("degree", ""),
                            "Category": "Structured Education",
                            "Block Index": idx + 1
                        })
                        rows.append({
                            "Property": "Education Block - School",
                            "Value": block.get("school", ""),
                            "Category": "Structured Education",
                            "Block Index": idx + 1
                        })
                        rows.append({
                            "Property": "Education Block - Date",
                            "Value": block.get("date", ""),
                            "Category": "Structured Education",
                            "Block Index": idx + 1
                        })
                        rows.append({
                            "Property": "Education Block - Location",
                            "Value": block.get("location", ""),
                            "Category": "Structured Education",
                            "Block Index": idx + 1
                        })
        else:
            # Simple entities format
            for entity_type, values in entities.items():
                if isinstance(values, list):
                    for idx, value in enumerate(values):
                        rows.append({
                            "Property": f"{entity_type}",
                            "Value": str(value),
                            "Category": "Entity",
                            "Index": idx + 1
                        })
                else:
                    rows.append({
                        "Property": f"{entity_type}",
                        "Value": str(values),
                        "Category": "Entity"
                    })

    # Define columns based on what we have
    columns = ["Property", "Value", "Category"]
    if any("Index" in row for row in rows):
        columns.append("Index")
    if any("Block Index" in row for row in rows):
        columns.append("Block Index")

    return {
        "columns": columns,
        "rows": rows,
        "total_rows": len(rows),
        "total_columns": len(columns)
    }


@router.get("/{export_id}")
async def get_export(
    export_id: str,
    current_user: dict = Depends(get_current_user)
) -> dict:
    """Retrieve export by ID (only owner can access)"""
    try:
        export = await exports_collection.find_one({"_id": ObjectId(export_id)})
        if not export:
            raise HTTPException(status_code=404, detail="Export not found")
        
        if str(export.get("user_id")) != str(current_user["_id"]):
            raise HTTPException(
                status_code=403,
                detail="Forbidden: You do not own this export"
            )
        
        export["_id"] = str(export["_id"])
        return export
    except ValueError as e:
        logger.error(f"Invalid export ID format: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid export ID: {str(e)}")
    except Exception as e:
        logger.error(f"Failed to get export: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving export: {str(e)}")


@router.get("/user/exports")
async def get_user_exports(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """Get all exports for the current user"""
    try:
        user_id = str(current_user["_id"])
        exports = await exports_collection.find(
            {"user_id": user_id}
        ).sort("export_date", -1).to_list(length=100)
        
        for export in exports:
            export["_id"] = str(export["_id"])
        
        return {
            "exports": exports,
            "total": len(exports)
        }
    except Exception as e:
        logger.error(f"Failed to get user exports: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving exports: {str(e)}"
        )

