from pydantic import Field
from sqlmodel import Session
from app.db.entities.guest_entity import Guest
from app.models.base.app_base_model import AppBaseModel, UpdateBaseBody


class GuestModel(AppBaseModel[Guest]):
    name: str = Field(..., title="名前")
    team_name: str = Field(..., title="チーム名")
    score: int = Field(..., title="スコア")

    @staticmethod
    def to_model(entity: Guest, session: Session | None = None) -> "GuestModel":
        return GuestModel(
            name=entity.name,
            team_name=entity.team_name,
            score=entity.score,
        )

    def to_entity(self) -> Guest:
        return Guest(name=self.name, team_name=self.team_name, score=self.score)
