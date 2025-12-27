from typing import Annotated

from fastapi import Depends
from sqlmodel import Session
from app.db.cruds.team_crud import TeamCrud
from app.db.db import SessionDependency
from app.db.entities.team_entity import Team
from app.models.base.app_base_model import UpdateBaseBody
from app.models.team_model import TeamModel
from app.services.base.base_service import BaseService


class TeamService(BaseService[TeamModel, Team]):
    def __init__(self, session: Session):
        super().__init__(
            session=session,
            primary_key="name",
        )
        self.Model = TeamModel
        self.crud = TeamCrud(session=session)

    def update_score(self, id: str, score: int) -> TeamModel:
        crud = TeamCrud(session=self.session)
        item = crud.update_score(id, score)
        return TeamModel.to_model(item)

    def get_one(self, id) -> TeamModel:
        return super()._get_one(id)

    def get_items(self) -> list[TeamModel]:
        return super()._get_items()

    def create_one(self, item: TeamModel) -> TeamModel:
        return super()._create_one(item)

    def create_items(self, items: list[TeamModel]) -> list[TeamModel]:
        return super()._create_items(items)

    def update_one(self, body: UpdateBaseBody[TeamModel, Team]) -> TeamModel:
        return super()._update_one(body)

    def update_items(self, items: list[TeamModel]) -> list[TeamModel]:
        return super()._update_items(items)

    def delete_one(self, id) -> None:
        return super()._delete_one(id)

    def delete_items(self, ids) -> None:
        return super()._delete_items(ids)


def get_team_service(session: SessionDependency) -> TeamService:
    return TeamService(session=session)


TeamServiceDependency = Annotated[TeamService, Depends(get_team_service)]
