from pydantic import Field
from app.db.entities.system_setting_entity import SystemSetting
from app.models.base.app_base_model import AppBaseModel


class SystemSettingModel(AppBaseModel[SystemSetting]):
    key: str = Field(..., title="キー")
    value: str = Field(..., title="値")

    @staticmethod
    def to_model(entity: SystemSetting, session=None):
        assert entity.key is not None
        return SystemSettingModel(key=entity.key, value=entity.value)

    def to_entity(self) -> SystemSetting:
        return SystemSetting(key=self.key, value=self.value)
