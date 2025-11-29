from app.services.keyword_service import (
    extract_keywords,
    find_common_keywords,
    get_keyword_coverage,
)


def test_extract_keywords_filters_stop_words():
    assert extract_keywords("and the or but in on") == []


def test_extract_keywords_prioritizes_technical_terms():
    text = "Python python leadership communication React analytics"
    keywords = extract_keywords(text, max_keywords=3)
    assert keywords[0] in {"python", "react"}
    assert "python" in keywords
    assert len(keywords) == 3


def test_extract_keywords_limits_max_keywords():
    text = " ".join(f"skill{i}" for i in range(20))
    keywords = extract_keywords(text, max_keywords=5)
    assert len(keywords) == 5


def test_extract_keywords_handles_empty_text():
    assert extract_keywords("") == []


def test_find_common_keywords_case_insensitive():
    result = find_common_keywords(["Python", "FastAPI"], ["python", "django"])
    assert result == ["python"]


def test_get_keyword_coverage_full_match():
    coverage = get_keyword_coverage(["python", "fastapi"], ["FastAPI", "Python"])
    assert coverage == 1.0


def test_get_keyword_coverage_partial_match():
    coverage = get_keyword_coverage(["python"], ["python", "fastapi", "docker"])
    assert coverage == round(1 / 3, 4)


def test_get_keyword_coverage_no_job_keywords():
    assert get_keyword_coverage(["python"], []) == 0.0

