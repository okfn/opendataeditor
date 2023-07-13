from __future__ import annotations

from typing import Optional

from fastapi import Request
from frictionless import FrictionlessException
from pydantic import BaseModel

from ... import helpers, types
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    text: Optional[str]
    prompt: str | None
    resource: Optional[types.IDescriptor]
    toPath: Optional[str]


class Result(BaseModel, extra="forbid"):
    path: str


@router.post("/text/patch")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Forbid overwriting for export
    if props.toPath and helpers.test_file(project, path=props.toPath):
        raise FrictionlessException("file already exists")

    # Patch record
    record = helpers.patch_record(
        project,
        path=props.path,
        toPath=props.toPath,
        resource=props.resource,
        isDataChanged=props.text is not None,
    )

    # Write contents
    text = props.text
    if text is not None:
        config = cf.read()
        api_key = config.system.openaiApiKey
        if props.prompt and api_key:
            text = helpers.ask_chatgpt(
                project,
                type="text",
                path=props.path,
                prompt=f"{props.prompt}. Original contents: {text}",
                api_key=api_key,
            )
        helpers.write_text(project, path=record.path, text=text, overwrite=True)

    return Result(path=record.path)
