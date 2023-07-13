from __future__ import annotations

from fastapi import Request
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    text: str
    prompt: str


class Result(BaseModel, extra="forbid"):
    text: str


@router.post("/text/edit")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Edit contents
    text = props.text
    config = cf.read()
    api_key = config.system.openaiApiKey
    if api_key:
        text = helpers.ask_chatgpt(
            project,
            type="text",
            path=props.path,
            prompt=f"{props.prompt}. Original contents: {props.text}",
            api_key=api_key,
        )

    return Result(text=text)
