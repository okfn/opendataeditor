from __future__ import annotations

import json
from typing import Any

from fastapi import Request
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    data: Any
    prompt: str


class Result(BaseModel, extra="forbid"):
    data: Any


@router.post("/json/edit")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Edit contents
    data = props.data
    config = cf.read()
    api_key = config.system.openaiApiKey
    if api_key:
        text = helpers.ask_chatgpt(
            project,
            type="chart",
            path=props.path,
            prompt=f"{props.prompt} for the following JSON: {json.dumps(data)}",
            api_key=api_key,
        )
        data = json.loads(text)

    return Result(data=data)
