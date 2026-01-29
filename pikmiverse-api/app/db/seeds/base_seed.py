from sqlalchemy import text
from sqlmodel import Session

from app.core.env import env


def truncate(session: Session, table_name: str) -> None:
    query = f"TRUNCATE {env.POSTGRES_SCHEMA}.{table_name} RESTART IDENTITY CASCADE"
    session.connection().execute(text(query))
    session.commit()


def reset_sequence(session: Session, table_name: str) -> None:
    query = f"SELECT setval('{env.POSTGRES_SCHEMA}.{table_name}_id_seq', (SELECT MAX(id) FROM {env.POSTGRES_SCHEMA}.{table_name}))"
    session.connection().execute(text(query))
    session.commit()
