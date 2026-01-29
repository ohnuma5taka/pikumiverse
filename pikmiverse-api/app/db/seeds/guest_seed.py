import json
import os

from app.db.cruds.guest_crud import GuestCrud
from app.db.db import SessionDependency
from app.db.entities.guest_entity import Guest
from app.db.seeds import base_seed


def seed(session: SessionDependency):
    table_name = "guests"
    base_dir = os.path.dirname(__file__)
    json_path = os.path.join(base_dir, "data", f"{table_name}.json")
    items = [
        Guest(
            name=row["name"],
            team_name=row["team_name"],
            score=0,
        )
        for row in json.load(open(json_path))
    ]
    base_seed.truncate(session, table_name)
    GuestCrud(session=session).upsert_items(items)
    print(f"{table_name}: {len(items)} records")


def init(session: SessionDependency):
    table_name = "guests"
    base_seed.truncate(session, table_name)
    print(f"{table_name}: initialized")
