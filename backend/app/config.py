from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGODB_URI: str
    MONGO_DB_NAME: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    PROJECT_NAME: str = "TalentBridge"

    # Ollama-related
    OLLAMA_API_URL: str
    OLLAMA_MODEL: str
    MONGODB_URL: str
    DATABASE_NAME: str

    model_config = {
        "env_file": ".env",
        "extra": "forbid" 
    }

settings = Settings()
