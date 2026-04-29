import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.documents.model import Document


class DocumentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_all(self) -> list[Document]:
        result = await self.session.execute(select(Document).order_by(Document.created_at.desc()))
        return list(result.scalars().all())

    async def list_by_session(self, session_id: int) -> list[Document]:
        result = await self.session.execute(
            select(Document).where(Document.session_id == session_id).order_by(Document.created_at.desc())
        )
        return list(result.scalars().all())

    async def list_by_uploader(self, uploader_id: uuid.UUID) -> list[Document]:
        result = await self.session.execute(
            select(Document).where(Document.uploader_id == uploader_id).order_by(Document.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, doc_id: int) -> Document | None:
        result = await self.session.execute(select(Document).where(Document.id == doc_id))
        return result.scalar_one_or_none()

    async def create(self, doc: Document) -> Document:
        self.session.add(doc)
        await self.session.commit()
        await self.session.refresh(doc)
        return doc

    async def delete(self, doc: Document) -> None:
        await self.session.delete(doc)
        await self.session.commit()
