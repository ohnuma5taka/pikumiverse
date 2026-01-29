from sqlalchemy import Column, String
from sqlmodel import Field, SQLModel

from app.core.env import env


class SystemSetting(SQLModel, table=True):
    __tablename__ = "system_settings"  # type: ignore[assignment]
    __table_args__ = {"schema": env.POSTGRES_SCHEMA}

    key: str = Field(
        title="キー",
        sa_column=Column(String, primary_key=True),
    )
    value: str = Field(title="値")
