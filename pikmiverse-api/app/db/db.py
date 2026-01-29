from collections.abc import Generator
from typing import Annotated
from fastapi import Depends
from sqlalchemy import text
from sqlmodel import Session, create_engine

from app.core.env import env

engine = create_engine(
    env.SQLALCHEMY_DATABASE_URI,
    echo=False,
    pool_size=10,
    max_overflow=20,
)

# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_schema() -> None:
    with engine.begin() as conn:
        conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {env.POSTGRES_SCHEMA}"))
        conn.execute(text("SET TIME ZONE 'Asia/Tokyo'"))


def create_tables() -> None:
    #! importの順番は外部制約を考慮する
    from sqlmodel import SQLModel
    from app.db.entities.system_setting_entity import SystemSetting
    from app.db.entities.team_entity import Team
    from app.db.entities.guest_entity import Guest

    SQLModel.metadata.create_all(engine)


def get_db_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDependency = Annotated[Session, Depends(get_db_session)]


if __name__ == "__main__":
    init_schema()
    create_tables()
