from sqlmodel import Session
from app.db.cruds.base.base_crud import BaseCrud
from app.db.entities.system_setting_entity import SystemSetting


class SystemSettingCrud(BaseCrud[SystemSetting]):
    def __init__(self, session: Session):
        super().__init__(Entity=SystemSetting, session=session, primary_key="key")

    def get_one(self, id: str) -> SystemSetting:
        return super()._get_one(id=id)

    def get_items(self) -> list[SystemSetting]:
        return super()._get_items()

    def upsert_one(self, item: SystemSetting) -> SystemSetting:
        return super()._upsert_one(item)

    def upsert_items(self, items: list[SystemSetting]) -> list[SystemSetting]:
        return super()._upsert_items(items)

    def delete_one(self, id: str) -> None:
        return super()._delete_one(id)

    def delete_items(self, ids: list[str] | None = None) -> None:
        return super()._delete_items(ids)
