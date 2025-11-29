import pytest

from app.utils.security import MAX_PASSWORD_LENGTH, hash_password, verify_password


def test_hash_password_returns_bcrypt_hash():
    password = "SecureP@ssw0rd"
    hashed = hash_password(password)
    assert hashed != password
    assert hashed.startswith("$2b$")


def test_hash_password_rejects_non_string():
    with pytest.raises(ValueError):
        hash_password(123)  


def test_verify_password_accepts_valid_password():
    password = "another-password"
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True


def test_verify_password_handles_long_passwords():
    long_password = "a" * (MAX_PASSWORD_LENGTH + 20)
    hashed = hash_password(long_password)
    assert verify_password(long_password, hashed) is True


def test_verify_password_rejects_non_string():
    hashed = hash_password("valid")
    with pytest.raises(ValueError):
        verify_password(456, hashed)  

