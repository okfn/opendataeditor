from __future__ import annotations

import json

from fastapi import Request
from pydantic import BaseModel

from ... import helpers, types
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    chart: types.IChart
    prompt: str


class Result(BaseModel, extra="forbid"):
    chart: types.IChart


@router.post("/chart/edit")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Edit contents
    chart = props.chart
    config = cf.read()
    api_key = config.system.openaiApiKey
    if api_key:
        text = helpers.ask_chatgpt(
            project,
            type="chart",
            path=props.path,
            prompt=f"{props.prompt} for the following Vega Lite in JSON: {json.dumps(chart)}",
            api_key=api_key,
        )
        chart = json.loads(text)

    return Result(chart=chart)
