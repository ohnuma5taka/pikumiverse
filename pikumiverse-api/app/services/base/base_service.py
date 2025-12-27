from abc import ABC, abstractmethod
from typing import Any, Generic, cast
from fastapi import HTTPException
from sqlmodel import Session

from app.db.cruds.base.base_crud import BaseCrud
from app.models.base.app_base_model import E, M, AppBaseModel, UpdateBaseBody


class BaseService(Generic[M, E], ABC):
    crud: BaseCrud[E]
    Model: type[M]

    def __init__(
        self,
        session: Session,
        primary_key: str = "id",
    ) -> None:
        self.session = session
        self.primary_key = primary_key

    def cast(self, item: AppBaseModel[E]) -> M:
        return cast(M, item)

    def _get_one(self, id: int | str | None) -> M:
        try:
            entity = self.crud._get_one(id=id)
            return self.cast(self.Model.to_model(entity=entity, session=self.session))
        except Exception as e:
            print(f"Error: {e}, table: {self.crud.Entity}, id: {id}")
            raise HTTPException(
                404, f"Record Not Found, table: {self.crud.Entity}, id: {id}"
            )

    def _get_items(self) -> list[M]:
        entities = self.crud._get_items()
        return [
            self.cast(self.Model.to_model(entity=entity, session=self.session))
            for entity in entities
        ]

    def _create_one(self, model: M) -> M:
        entity: E = self.crud._upsert_one(item=model.to_entity())
        return self.cast(self.Model.to_model(entity=entity, session=self.session))

    def _create_items(self, models: list[M]) -> list[M]:
        entities: list[E] = [x.to_entity() for x in models]
        _entities: list[E] = self.crud._upsert_items(items=entities)
        return [
            self.cast(self.Model.to_model(entity=entity, session=self.session))
            for entity in _entities
        ]

    def _update_one(self, body: Any) -> M:
        model: M = self.get_one(id=getattr(body, self.primary_key))
        entity: E = self.crud._upsert_one(item=body.to_entity(model))
        return self.cast(self.Model.to_model(entity=entity, session=self.session))

    def _update_items(self, models: list[M]) -> list[M]:
        for item in models:
            _ = self.get_one(id=getattr(item, self.primary_key))
        entities: list[E] = [x.to_entity() for x in models]
        _entities: list[E] = self.crud._upsert_items(items=entities)
        return [
            self.cast(self.Model.to_model(entity=entity, session=self.session))
            for entity in _entities
        ]

    def _delete_one(self, id: int | str) -> None:
        _ = self.get_one(id=id)
        self.crud._delete_one(id=id)

    def _delete_items(self, ids: list[int] | list[str] | None = None) -> None:
        self.crud._delete_items(ids=ids)

    @abstractmethod
    def get_one(self, id) -> M: ...

    @abstractmethod
    def get_items(self) -> list[M]: ...

    @abstractmethod
    def create_one(self, item: M) -> M: ...

    @abstractmethod
    def create_items(self, items: list[M]) -> list[M]: ...

    @abstractmethod
    def update_one(self, body: Any) -> M: ...

    @abstractmethod
    def update_items(self, items: list[M]) -> list[M]: ...

    @abstractmethod
    def delete_one(self, id) -> None: ...

    @abstractmethod
    def delete_items(self, ids) -> None: ...
