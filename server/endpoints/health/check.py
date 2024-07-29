from __future__ import annotations

from fastapi import Request
from pydantic import BaseModel

from ...project import Project
from ...router import router


class Result(BaseModel, extra="forbid"):
    healthy: bool


@router.get("/health")
def endpoint(request: Request) -> Result:
    return action(request.app.get_project())


def action(project: Project) -> Result:
    return Result(healthy=True)
