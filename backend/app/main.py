import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app import models  # noqa: F401
from app.api.router import api_router
from app.core.config import settings

from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError



def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        description="IHEC Connect — Plateforme académique & entrepreneuriale",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request, exc):
        return JSONResponse(
            status_code=422,
            content={"detail": "Données invalides", "errors": exc.errors()}
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request, exc):
        return JSONResponse(
            status_code=500,
            content={"detail": "Erreur interne du serveur"}
        )

    # Serve uploaded files
    os.makedirs(settings.upload_dir, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

    @app.get("/health", tags=["health"])
    async def healthcheck() -> dict[str, str]:
        return {"status": "ok", "version": "1.0.0"}

    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_application()
