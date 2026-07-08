from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/mkt_db"

    JWT_SECRET: str = "changeme-use-a-long-random-secret-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    COMETCHAT_APP_ID: str = ""
    COMETCHAT_API_KEY: str = ""
    COMETCHAT_REGION: str = "us"

    APP_ENV: str = "development"
    APP_PORT: int = 8000


settings = Settings()
