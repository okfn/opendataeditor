from __future__ import annotations

from typing import Optional

from fastapi import Request
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    prompt: str | None = None
    deduplicate: Optional[bool] = None


class Result(BaseModel, extra="forbid"):
    path: str


@router.post("/image/create")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Create image
    bytes = b""
    config = cf.read()
    api_key = config.system.openaiApiKey
    if props.prompt and api_key:
        bytes = helpers.ask_dalle(project, prompt=props.prompt, api_key=api_key)

    # Write file
    path = helpers.write_file(
        project, path=props.path, bytes=bytes, deduplicate=props.deduplicate
    )

    return Result(path=path)
