import json
import os

from app.db.cruds.team_crud import TeamCrud
from app.db.db import SessionDependency
from app.db.entities.team_entity import Team
from app.db.seeds import base_seed


def seed(session: SessionDependency):
    table_name = "teams"
    base_dir = os.path.dirname(__file__)
    json_path = os.path.join(base_dir, "data", f"{table_name}.json")
    items = [
        Team(
            name=row["name"],
            score=0,
        )
        for row in json.load(open(json_path))
    ]
    base_seed.truncate(session, table_name)
    TeamCrud(session=session).upsert_items(items)
    print(f"{table_name}: {len(items)} records")


def init(session: SessionDependency):
    table_name = "teams"
    base_seed.truncate(session, table_name)
    print(f"{table_name}: initialized")
