from datetime import datetime
from zoneinfo import ZoneInfo

from sqlmodel import Field, SQLModel

TOKYO_TZ = ZoneInfo("Asia/Tokyo")


class AppBaseEntity(SQLModel):
    created_at: datetime = Field(
        title="作成日時",
        default_factory=lambda: datetime.now(TOKYO_TZ),
        nullable=False,
    )
    updated_at: datetime = Field(
        title="最終更新日時",
        default_factory=lambda: datetime.now(TOKYO_TZ),
        nullable=False,
        sa_column_kwargs={"onupdate": lambda: datetime.now(TOKYO_TZ)},
    )
