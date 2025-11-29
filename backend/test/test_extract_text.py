from pathlib import Path

import pytest

from app.utils import extract_text
from app.utils.extract_text import extract_text_from_file


def test_extract_text_from_txt(tmp_path):
    file_path = tmp_path / "sample.txt"
    file_path.write_text("hello world\n")
    assert extract_text_from_file(file_path) == "hello world"


def test_extract_text_pdf_fallback(monkeypatch, tmp_path):
    if extract_text.fitz is None or extract_text.pdfplumber is None:
        pytest.skip("PyMuPDF or pdfplumber not available in this environment")

    file_path = tmp_path / "sample.pdf"
    file_path.write_bytes(b"%PDF-1.4")

    def mock_fitz_open(_):
        raise RuntimeError("fitz failure")

    class DummyPage:
        def extract_text(self):
            return "fallback text"

    class DummyPdf:
        def __enter__(self):
            self.pages = [DummyPage()]
            return self

        def __exit__(self, exc_type, exc, tb):
            return False

    monkeypatch.setattr("app.utils.extract_text.fitz.open", mock_fitz_open)
    monkeypatch.setattr("app.utils.extract_text.pdfplumber.open", lambda _: DummyPdf())

    assert extract_text_from_file(file_path) == "fallback text"


def test_extract_text_unsupported_extension(tmp_path):
    file_path = tmp_path / "sample.md"
    file_path.write_text("content")
    with pytest.raises(Exception):
        extract_text_from_file(file_path)

