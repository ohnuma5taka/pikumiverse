import json
import os

from app.db.cruds.system_setting_crud import SystemSettingCrud
from app.db.db import SessionDependency
from app.db.entities.system_setting_entity import SystemSetting
from app.db.seeds import base_seed


def seed(session: SessionDependency):
    table_name = "system_settings"
    base_dir = os.path.dirname(__file__)
    json_path = os.path.join(base_dir, "data", f"{table_name}.json")
    items = [
        SystemSetting(
            key=row["key"],
            value=row["value"],
        )
        for row in json.load(open(json_path))
    ]
    base_seed.truncate(session, table_name)
    SystemSettingCrud(session=session).upsert_items(items)
    print(f"{table_name}: {len(items)} records")


def init(session: SessionDependency):
    table_name = "system_settings"
    base_seed.truncate(session, table_name)
    print(f"{table_name}: initialized")
