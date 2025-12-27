from sqlmodel import Session
from app.db.cruds.base.base_crud import BaseCrud
from app.db.entities.guest_entity import Guest


class GuestCrud(BaseCrud[Guest]):
    def __init__(self, session: Session):
        super().__init__(Entity=Guest, session=session, primary_key="name")

    def update_score(self, id: str, score: int) -> Guest:
        item = self._get_one(id=id)
        item.score = score
        item = self.session.merge(self._validate_conflict(item))
        self.session.commit()
        return item

    def get_one(self, id: str) -> Guest:
        return super()._get_one(id=id)

    def get_items(self) -> list[Guest]:
        return super()._get_items()

    def upsert_one(self, item: Guest) -> Guest:
        return super()._upsert_one(item)

    def upsert_items(self, items: list[Guest]) -> list[Guest]:
        return super()._upsert_items(items)

    def delete_one(self, id: str) -> None:
        return super()._delete_one(id)

    def delete_items(self, ids: list[str] | None = None) -> None:
        return super()._delete_items(ids)
