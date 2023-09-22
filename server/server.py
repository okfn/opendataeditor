from __future__ import annotations

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import Config
from .project import Project
from .router import router

# TODO: handle errors
# TODO: rebase on async endpoints
# TODO: review endpoints to use proper imports (use platform)


class Server(FastAPI):
    config: Config

    @staticmethod
    def create(config: Config):
        server = Server(
            title="Frictionless Server",
            debug=config.debug,
        )

        # TODO: review
        server.add_middleware(
            CORSMiddleware,
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
            self,
            workers=1,
            port=self.config.port,
            log_level=log_level,
        )

    # Context

    def get_project(self):
        return Project(self.config.folder)
