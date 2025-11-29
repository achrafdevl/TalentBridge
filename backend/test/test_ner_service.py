import json

import pytest
import requests
from fastapi import HTTPException

from app.services import ner_service


class DummyResponse:
    def __init__(self, status_code=200, json_data=None, text=""):
        self.status_code = status_code
        self._json_data = json_data
        self.text = text or ""

    def json(self):
        if self._json_data is None:
            raise json.JSONDecodeError("Invalid", self.text, 0)
        return self._json_data

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError(f"HTTP {self.status_code}")


def test_parse_ollama_response_direct_json():
    response = DummyResponse(json_data={"message": {"content": '{"ok": true}'}})
    content = ner_service._parse_ollama_response(response)
    assert content == '{"ok": true}'


def test_parse_ollama_response_line_fallback():
    text = '{"response": "value"}'
    response = DummyResponse(json_data=None, text=text)
    content = ner_service._parse_ollama_response(response)
    assert content == "value"


def test_parse_ollama_response_error_status():
    response = DummyResponse(status_code=500, json_data={"error": "boom"})
    with pytest.raises(HTTPException):
        ner_service._parse_ollama_response(response)


def test_clean_json_content_strips_markdown():
    raw = "```json\n{\"key\": \"value\"}\n```"
    cleaned = ner_service._clean_json_content(raw)
    assert cleaned == '{"key": "value"}'


def test_validate_entities_fills_missing_types():
    entities = {"PERSON": ["Alice"], "SKILLS": "python"}
    validated = ner_service._validate_entities(entities)
    assert validated["PERSON"] == ["Alice"]
    assert validated["SKILLS"] == []
    assert set(validated) == set(ner_service.ENTITY_TYPES)


def test_organize_entities_creates_blocks():
    entities = {
        "EXPERIENCE": ["Engineer"],
        "ORGANIZATION": ["ACME"],
        "DATE": ["2020"],
        "LOCATION": ["Paris"],
        "EDUCATION": ["MSc"],
    }
    text = "Engineer at ACME in Paris during 2020. MSc from ACME."
    structured = ner_service.organize_entities(entities, text)
    assert structured["EXPERIENCE_BLOCKS"][0]["company"] == "ACME"
    assert structured["EDUCATION_BLOCKS"][0]["school"] == "ACME"


def test_extract_entities_safe_handles_exceptions(monkeypatch):
    def boom(_):
        raise RuntimeError("fail")

    monkeypatch.setattr(ner_service, "extract_and_structure_entities", boom)
    result = ner_service.extract_entities_safe("text")
    assert result == {"raw": {}, "structured": {}}

