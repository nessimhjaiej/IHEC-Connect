from fastapi import APIRouter, Depends, Form, Query, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user
from app.modules.documents.repository import DocumentRepository
from app.modules.documents.schema import DocumentCreate, DocumentRead
from app.modules.documents.service import DocumentService
from app.modules.users.model import User

router = APIRouter(prefix="/documents", tags=["documents"])



def get_document_service(session: AsyncSession = Depends(get_db_session)) -> DocumentService:
    return DocumentService(DocumentRepository(session))


@router.get("", response_model=list[DocumentRead])
async def list_documents(
    session_id: int | None = Query(default=None),
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentRead]:
    return await service.list_documents(session_id=session_id)


@router.get("/mine", response_model=list[DocumentRead])
async def list_my_documents(
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> list[DocumentRead]:
    return await service.list_my_documents(current_user)


@router.post("", response_model=DocumentRead, status_code=201)
async def upload_document(
    title: str = Form(...),
    session_id: int | None = Form(default=None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> DocumentRead:
    payload = DocumentCreate(title=title, session_id=session_id)
    return await service.upload_document(current_user, payload, file)


@router.get("/{doc_id}/download")
async def download_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> FileResponse:
    doc = await service.get_document(doc_id)
    return FileResponse(
        path=doc.file_path,
        filename=doc.file_name,
        media_type=doc.mime_type,
    )


@router.delete("/{doc_id}", status_code=204)
async def delete_document(
    doc_id: int,
    current_user: User = Depends(get_current_user),
    service: DocumentService = Depends(get_document_service),
) -> None:
    await service.delete_document(doc_id, current_user)
