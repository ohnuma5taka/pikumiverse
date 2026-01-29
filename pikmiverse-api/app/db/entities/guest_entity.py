from sqlalchemy import Column, ForeignKey, String
from sqlmodel import Field

from app.core.env import env
from app.db.entities.base.app_base_entity import AppBaseEntity


class Guest(AppBaseEntity, table=True):
    __tablename__ = "guests"  # type: ignore[assignment]
    __table_args__ = {"schema": env.POSTGRES_SCHEMA}

    name: str = Field(
        title="名前",
        sa_column=Column(String, primary_key=True),
    )
    team_name: str = Field(
        title="チーム名",
        sa_column=Column(
            "team_name",
            String,
            ForeignKey(f"{env.POSTGRES_SCHEMA}.teams.name", ondelete="CASCADE"),
        ),
    )
    score: int = Field(title="スコア", default=0)
