from abc import ABC, abstractmethod
from typing import Generic, TypeVar, cast
from fastapi import HTTPException
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlmodel import Session, delete, select
from sqlmodel.sql.expression import SelectOfScalar
from app.models.base.app_base_model import E

T = TypeVar("T")


class BaseCrud(Generic[E], ABC):
    def __init__(
        self,
        Entity: type[E],
        session: Session,
        primary_key: str = "id",
        unique_keys: list[str] | None = None,
    ):
        self.session = session
        self.Entity = Entity
        self.primary_key = primary_key
        self.unique_keys = unique_keys
        self.not_found_message = f"{self.Entity.__name__} not found"

    def _validate_conflict(self, item: E) -> E:
        if not self.unique_keys:
            return item

        statement = select(self.Entity)
        for key in self.unique_keys:
            column = self.cast_column(getattr(self.Entity, key))
            statement = statement.where(column == getattr(item, key))
        _item = self.session.exec(statement).one_or_none()

        if _item is not None:
            if getattr(item, self.primary_key) != getattr(_item, self.primary_key):
                raise HTTPException(status_code=409, detail="item conflicted")

        return item

    def cast_column(self, column: T) -> InstrumentedAttribute[T]:
        return cast(InstrumentedAttribute[T], column)

    def select_all(self, statement: SelectOfScalar[E]) -> list[E]:
        return list(self.session.exec(statement).all())

    def select_one(self, statement: SelectOfScalar[E]) -> E:
        return self._validate(self.session.exec(statement).one_or_none())

    def _validate(self, item: E | None) -> E:
        if item is None:
            raise HTTPException(status_code=404, detail=self.not_found_message)
        return item

    def _get_one(self, id) -> E:
        return self._validate(self.session.get(self.Entity, id))

    def _get_items(self) -> list[E]:
        id_column = getattr(self.Entity, self.primary_key)
        statement = select(self.Entity).order_by(id_column)
        return self.select_all(statement)

    def _upsert_one(self, item: E) -> E:
        item = self.session.merge(self._validate_conflict(item))
        self.session.commit()
        return item

    def _upsert_items(self, items: list[E]) -> list[E]:
        merged_items = [
            self.session.merge(self._validate_conflict(item)) for item in items
        ]
        self.session.commit()
        return merged_items

    def _delete_one(self, id) -> None:
        item = self._get_one(id)
        self.session.delete(item)
        self.session.commit()

    def _delete_items(self, ids) -> None:
        statement = delete(self.Entity)
        if ids:
            primary_key_field = self.cast_column(getattr(self.Entity, self.primary_key))
            statement = statement.where(primary_key_field.in_(ids))
        self.session.exec(statement)
        self.session.commit()

    @abstractmethod
    def get_one(self, id) -> E: ...

    @abstractmethod
    def get_items(self) -> list[E]: ...

    @abstractmethod
    def upsert_one(self, item: E) -> E: ...

    @abstractmethod
    def upsert_items(self, items: list[E]) -> list[E]: ...

    @abstractmethod
    def delete_one(self, id) -> None: ...

    @abstractmethod
    def delete_items(self, ids) -> None: ...
