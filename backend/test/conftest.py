import os
import sys
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))


DEFAULT_ENV = {
    "MONGODB_URI": "mongodb://localhost:27017",
    "MONGO_DB_NAME": "talentbridge_test",
    "JWT_SECRET": "test-secret",
    "JWT_ALGORITHM": "HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES": "60",
    "OLLAMA_API_URL": "http://localhost:11434",
    "OLLAMA_MODEL": "test-model",
    "MONGODB_URL": "mongodb://localhost:27017",
    "DATABASE_NAME": "talentbridge_test",
}

for key, value in DEFAULT_ENV.items():
    os.environ.setdefault(key, value)

