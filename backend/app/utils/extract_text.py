
import logging
from pathlib import Path

from fastapi import HTTPException

try:
    import fitz  # type: ignore
except ImportError:  # pragma: no cover
    fitz = None

try:
    import pdfplumber  # type: ignore
except ImportError:  # pragma: no cover
    pdfplumber = None

try:
    from docx import Document
except ImportError:  # pragma: no cover
    Document = None  # type: ignore

logger = logging.getLogger(__name__)

def extract_text_from_file(file_path: Path) -> str:
    """
    Extract text from PDF or DOCX using PyMuPDF (fast) with pdfplumber fallback.
    """
    ext = file_path.suffix.lower()

    # --- PDF files ---
    if ext == ".pdf":
        if fitz is None and pdfplumber is None:
            raise HTTPException(status_code=500, detail="PDF extraction requires PyMuPDF or pdfplumber")

        try:
            text = ""
            if fitz is None:
                raise RuntimeError("PyMuPDF not available")

            with fitz.open(file_path) as pdf:  # type: ignore[operator]
                for page in pdf:
                    text += page.get_text("text") + "\n"

            # If PyMuPDF returns almost empty text, use fallback
            if not text.strip():
                raise ValueError("Empty text from PyMuPDF")

            return text.strip()

        except Exception as e:
            logger.warning(f"PyMuPDF failed on {file_path.name}, falling back to pdfplumber: {e}")
            try:
                if pdfplumber is None:
                    raise RuntimeError("pdfplumber not available")
                text = ""
                with pdfplumber.open(file_path) as pdf:  # type: ignore[operator]
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                return text.strip()
            except Exception as e2:
                logger.error(f"Both PyMuPDF and pdfplumber failed: {e2}")
                raise HTTPException(status_code=500, detail="Failed to extract text from PDF")

    # --- DOCX files ---
    elif ext == ".docx":
        if Document is None:
            raise HTTPException(status_code=500, detail="python-docx is required for DOCX extraction")

        try:
            doc = Document(file_path)
            return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
        except Exception as e:
            logger.error(f"Failed to extract DOCX text: {e}")
            raise HTTPException(status_code=500, detail="Failed to read DOCX file")

    # --- TXT files ---
    elif ext == ".txt":
        try:
            return file_path.read_text(encoding="utf-8").strip()
        except Exception as e:
            logger.error(f"Failed to read TXT file: {e}")
            raise HTTPException(status_code=500, detail="Failed to read TXT file")

    # --- Unsupported ---
    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format (PDF/DOCX/TXT only)"
        )
