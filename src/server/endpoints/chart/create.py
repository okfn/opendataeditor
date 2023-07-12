from __future__ import annotations

import json
from typing import Optional

from fastapi import Request
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    prompt: str | None
    deduplicate: Optional[bool] = None


class Result(BaseModel, extra="forbid"):
    path: str


@router.post("/chart/create")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Create chart
    chart = {"mark": "bar"}
    config = cf.read()
    api_key = config.system.openaiApiKey
    if props.prompt and api_key:
        text = helpers.ask_chatgtp(
            project, type="chart", path=props.path, prompt=props.prompt, api_key=api_key
        )
        chart = json.loads(text)

    # Write text
    path = helpers.write_json(
        project, path=props.path, data=chart, deduplicate=props.deduplicate
    )

    return Result(path=path)
