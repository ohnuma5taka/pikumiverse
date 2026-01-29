from pydantic import Field
from sqlmodel import Session
from app.db.entities.team_entity import Team
from app.models.base.app_base_model import AppBaseModel, UpdateBaseBody


class TeamModel(AppBaseModel[Team]):
    name: str = Field(..., title="名前")
    score: int = Field(..., title="スコア")

    @staticmethod
    def to_model(entity: Team, session: Session | None = None) -> "TeamModel":
        return TeamModel(
            name=entity.name,
            score=entity.score,
        )

    def to_entity(self) -> Team:
        return Team(name=self.name, score=self.score)
