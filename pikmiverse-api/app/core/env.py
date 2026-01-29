from functools import lru_cache
from pathlib import Path
import os
from typing import Literal, cast

from pydantic import (
    PostgresDsn,
    computed_field,
)
from pydantic_settings import BaseSettings, SettingsConfigDict


class Env(BaseSettings):
    APP_NAME: str = "pikmiverse-api"
    APP_MODE: Literal["prod", "stg", "dev", "local", "__APP_MODE__"]
    APP_VERSION: str = "__APP_VERSION__"
    APP_LOG_PREFIX: str = "PIKUMIVERSE"
    API_PATH_PREFIX: str = ""

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DATABASE: str = "postgres"
    POSTGRES_SCHEMA: str = "pikmiverse"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_USERNAME: str = ""
    REDIS_PASSWORD: str = ""
    REDIS_SSL_CONNECTION: bool = False
    REDIS_DATA_EXPIRY_SECOND: int = 1

    MQTT_HOST: str = "localhost"
    MQTT_PORT: int = 8883
    MQTT_CA_CERT: str = "./mqtt_certs/ca.crt"

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        url = PostgresDsn.build(
            scheme="postgresql+psycopg2",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DATABASE,
        )
        return str(url)

    model_config = SettingsConfigDict(
        env_file=None,
        env_file_encoding="utf-8",
        env_ignore_empty=True,
        extra="ignore",
    )


def _files_for_local() -> list[str]:
    return [".env.local", ".env.db"]


def _files_for_server() -> list[str]:
    return [".env", ".env.db"]


@lru_cache
def get_env() -> Env:
    mode = os.getenv("APP_MODE", "local")
    files = _files_for_local() if mode == "local" else _files_for_server()

    existing = [p for p in files if Path(p).is_file()]
    config_dict = dict(Env.model_config)
    config_dict["env_file"] = existing or None
    Env.model_config = cast(SettingsConfigDict, config_dict)
    return Env()  # type: ignore[call-arg]


env = get_env()
