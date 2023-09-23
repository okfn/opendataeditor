from __future__ import annotations

from fastapi import Request
from pydantic import BaseModel

from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    fullpath: str


class Result(BaseModel, extra="forbid"):
    pass


@router.post("/project/open")
def endpoint(request: Request, props: Props) -> Result:
    request.app.set_project(props.fullpath)
    return action(request.app.get_project())


def action(project: Project) -> Result:
    return Result()
