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


@router.post("/map/create")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Create map
    text = ""
    config = cf.read()
    api_key = config.system.openaiApiKey
    if props.prompt and api_key:
        text = helpers.ask_chatgpt(
            project, type="map", path=props.path, prompt=props.prompt, api_key=api_key
        )

    # Write map
    path = helpers.write_text(
        project, path=props.path, text=text, deduplicate=props.deduplicate
    )

    return Result(path=path)
