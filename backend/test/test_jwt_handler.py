from datetime import timedelta

import pytest
from jose import jwt

from app.auth.jwt_handler import create_access_token, verify_access_token
from app.config import settings


def test_create_and_verify_access_token_roundtrip():
    token = create_access_token({"sub": "123"})
    payload = verify_access_token(token)
    assert payload["sub"] == "123"


def test_create_access_token_honors_expiry_delta():
    delta = timedelta(minutes=5)
    token = create_access_token({"sub": "user"}, expires_delta=delta)
    payload = jwt.decode(
        token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
    )
    assert payload["sub"] == "user"
    assert payload["exp"]


def test_verify_access_token_returns_none_on_invalid_token():
    assert verify_access_token("invalid.token.value") is None

