from abc import ABC, abstractmethod
from typing import Generic, TypeVar

from pydantic import BaseModel
from sqlmodel import SQLModel, Session

E = TypeVar("E", bound=SQLModel)  # Entity


class AppBaseModel(BaseModel, Generic[E], ABC):
    model_config = {"from_attributes": True}

    @staticmethod
    @abstractmethod
    def to_model(entity: E, session: Session | None) -> "AppBaseModel[E]": ...

    @abstractmethod
    def to_entity(self) -> E: ...


M = TypeVar("M", bound=AppBaseModel)  # Model


class UpdateBaseBody(BaseModel, Generic[M, E], ABC):
    model_config = {"from_attributes": True}

    @abstractmethod
    def to_entity(self, model: M) -> E: ...
