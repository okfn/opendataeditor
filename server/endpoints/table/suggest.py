from __future__ import annotations

from fastapi import Request
from pydantic import BaseModel

from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    prompt: str
    apiKey: str


class Result(BaseModel, extra="forbid"):
    text: str


@router.post("/table/suggest")
def server_text_write(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    return Result(text="Hello, World!")
