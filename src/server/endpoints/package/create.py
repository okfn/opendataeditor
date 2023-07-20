from __future__ import annotations

import json
import os
from typing import Optional

from fastapi import Request
from frictionless import Package, Resource
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


@router.post("/package/create")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Create package
    package = Package()
    config = cf.read()
    api_key = config.system.openaiApiKey
    if props.prompt and api_key:
        text = helpers.ask_chatgpt(
            project, type="package", path=props.path, prompt=props.prompt, api_key=api_key
        )
        paths = json.loads(text)
        for path in paths:
            record = helpers.read_record_or_raise(project, path=path)
            resource = Resource.from_descriptor(record.resource)
            resource.path = str(os.path.relpath(path, os.path.dirname(props.path)))
            package.add_resource(resource)

    # Save package
    path = helpers.write_json(
        project,
        path=props.path,
        data=package.to_descriptor(),
        deduplicate=props.deduplicate,
    )

    return Result(path=path)
