from typing import Annotated

from fastapi import Depends
from sqlmodel import Session
from app.db.cruds.guest_crud import GuestCrud
from app.db.db import SessionDependency
from app.db.entities.guest_entity import Guest
from app.models.base.app_base_model import UpdateBaseBody
from app.models.guest_model import GuestModel
from app.services.base.base_service import BaseService


class GuestService(BaseService[GuestModel, Guest]):
    def __init__(self, session: Session):
        super().__init__(
            session=session,
            primary_key="name",
        )
        self.Model = GuestModel
        self.crud = GuestCrud(session=session)

    def update_score(self, id: str, score: int) -> GuestModel:
        crud = GuestCrud(session=self.session)
        item = crud.update_score(id, score)
        return GuestModel.to_model(item)

    def get_one(self, id) -> GuestModel:
        return super()._get_one(id)

    def get_items(self) -> list[GuestModel]:
        return super()._get_items()

    def create_one(self, item: GuestModel) -> GuestModel:
        return super()._create_one(item)

    def create_items(self, items: list[GuestModel]) -> list[GuestModel]:
        return super()._create_items(items)

    def update_one(self, body: UpdateBaseBody[GuestModel, Guest]) -> GuestModel:
        return super()._update_one(body)

    def update_items(self, items: list[GuestModel]) -> list[GuestModel]:
        return super()._update_items(items)

    def delete_one(self, id) -> None:
        return super()._delete_one(id)

    def delete_items(self, ids) -> None:
        return super()._delete_items(ids)


def get_guest_service(session: SessionDependency) -> GuestService:
    return GuestService(session=session)


GuestServiceDependency = Annotated[GuestService, Depends(get_guest_service)]
