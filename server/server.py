from __future__ import annotations

from typing import Any

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from .config import Config
from .project import Project
from .router import router

# TODO: refactor
# TODO: rebase on async endpoints
# TODO: review endpoints to use proper imports (use platform)


class Server(FastAPI):
    config: Config
    asgi_app: Any

    @staticmethod
    def create(config: Config):
        server = Server(
            title="Frictionless Server",
            debug=config.debug,
        )

        # TODO: review
        # https://github.com/tiangolo/fastapi/discussions/8027
        server.asgi_app = CORSMiddleware(
            app=server,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

        @server.exception_handler(Exception)  # type: ignore
        async def exception_handler(request: Request, exception: Exception):  # type: ignore
            return JSONResponse(
                status_code=400,
                content={"detail": str(exception)},
            )

        server.config = config or Config()
        server.include_router(router)  # type: ignore
        return server

    # Run

    def run(self):
        log_level = "debug" if self.config.debug else None
        uvicorn.run(  # type: ignore
            self.asgi_app,
            workers=1,
            port=self.config.port,
            log_level=log_level,
        )

    # Context

    def get_project(self):
        return Project(self.config.folder)

    def set_project(self, fullpath: str):
        self.config.folder = fullpath
