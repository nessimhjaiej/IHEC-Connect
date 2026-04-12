import os
import uuid
import aiofiles
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings
from app.modules.documents.model import Document
from app.modules.documents.repository import DocumentRepository
from app.modules.documents.schema import DocumentCreate, DocumentRead
from app.modules.users.model import User, UserRole

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "text/plain",
}


class DocumentService:
    def __init__(self, repository: DocumentRepository) -> None:
        self.repository = repository

    async def upload_document(
        self, current_user: User, payload: DocumentCreate, file: UploadFile
    ) -> DocumentRead:
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"File type '{file.content_type}' not allowed.",
            )
        contents = await file.read()
        max_bytes = settings.max_upload_size_mb * 1024 * 1024
        if len(contents) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds {settings.max_upload_size_mb}MB limit.",
            )

        upload_dir = os.path.join(settings.upload_dir, str(current_user.id))
        os.makedirs(upload_dir, exist_ok=True)
        unique_name = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_name)

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(contents)

        doc = Document(
            title=payload.title,
            file_name=file.filename or unique_name,
            file_path=file_path,
            file_size=len(contents),
            mime_type=file.content_type or "application/octet-stream",
            uploader_id=current_user.id,
            session_id=payload.session_id,
        )
        created = await self.repository.create(doc)
        return DocumentRead.model_validate(created)

    async def list_documents(self, session_id: int | None = None) -> list[DocumentRead]:
        if session_id:
            docs = await self.repository.list_by_session(session_id)
        else:
            docs = await self.repository.list_all()
        return [DocumentRead.model_validate(d) for d in docs]

    async def list_my_documents(self, current_user: User) -> list[DocumentRead]:
        docs = await self.repository.list_by_uploader(current_user.id)
        return [DocumentRead.model_validate(d) for d in docs]

    async def get_document(self, doc_id: int) -> Document:
        doc = await self.repository.get_by_id(doc_id)
        if doc is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
        return doc

    async def delete_document(self, doc_id: int, current_user: User) -> None:
        doc = await self.repository.get_by_id(doc_id)
        if doc is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
        if doc.uploader_id != current_user.id and current_user.role != UserRole.admin:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")
        if os.path.exists(doc.file_path):
            os.remove(doc.file_path)
        await self.repository.delete(doc)
