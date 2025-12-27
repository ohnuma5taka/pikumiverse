from typing import Annotated

from fastapi import Depends
from sqlmodel import Session
from app.db.cruds.system_setting_crud import SystemSettingCrud
from app.db.db import SessionDependency
from app.db.entities.system_setting_entity import SystemSetting
from app.models.base.app_base_model import UpdateBaseBody
from app.models.system_setting_model import SystemSettingModel
from app.services.base.base_service import BaseService


class SystemSettingService(BaseService[SystemSettingModel, SystemSetting]):
    def __init__(self, session: Session):
        super().__init__(
            session=session,
            primary_key="key",
        )
        self.Model = SystemSettingModel
        self.crud = SystemSettingCrud(session=self.session)

    def get_one(self, id: str) -> SystemSettingModel:
        return super()._get_one(id)

    def get_items(self) -> list[SystemSettingModel]:
        return super()._get_items()

    def create_one(self, item: SystemSettingModel) -> SystemSettingModel:
        return super()._create_one(item)

    def create_items(self, items: list[SystemSettingModel]) -> list[SystemSettingModel]:
        return super()._create_items(items)

    def update_one(
        self, body: UpdateBaseBody[SystemSettingModel, SystemSetting]
    ) -> SystemSettingModel:
        return super()._update_one(body)

    def update_items(self, items: list[SystemSettingModel]) -> list[SystemSettingModel]:
        return super()._update_items(items)

    def delete_one(self, id: str) -> None:
        return super()._delete_one(id)

    def delete_items(self, ids: list[str] | None = None) -> None:
        return super()._delete_items(ids)


def get_system_setting_service(session: SessionDependency) -> SystemSettingService:
    return SystemSettingService(session=session)


SystemSettingServiceDependency = Annotated[
    SystemSettingService, Depends(get_system_setting_service)
]
