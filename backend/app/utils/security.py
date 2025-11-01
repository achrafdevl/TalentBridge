# app/utils/security.py
# from passlib.context import CryptContext

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)
# app/utils/security.py
from passlib.context import CryptContext

# Create a password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# bcrypt supports passwords only up to 72 bytes.
MAX_PASSWORD_LENGTH = 72


def hash_password(password: str) -> str:
    """
    Hash a password safely using bcrypt.
    Truncate to 72 bytes to avoid bcrypt length errors.
    """
    if not isinstance(password, str):
        raise ValueError("Password must be a string")
    return pwd_context.hash(password[:MAX_PASSWORD_LENGTH])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    Truncate plain password to 72 bytes before comparison.
    """
    if not isinstance(plain_password, str):
        raise ValueError("Password must be a string")
    return pwd_context.verify(plain_password[:MAX_PASSWORD_LENGTH], hashed_password)
