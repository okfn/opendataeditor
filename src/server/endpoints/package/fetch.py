from __future__ import annotations

from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

from fastapi import Request
from frictionless import FrictionlessException, system
from pydantic import BaseModel

from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    url: str
    path: Optional[str] = None
    folder: Optional[str] = None
    deduplicate: Optional[bool] = None


class Result(BaseModel, extra="forbid"):
    path: str


@router.post("/package/fetch")
def server_file_read(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    from ... import endpoints

    # Create package
    adapter = system.create_adapter(props.url)
    if not adapter:
        raise FrictionlessException(f"Not supported remote dataset: {props.url}")
    package = adapter.read_package()

    # Process package
    for resource in package.resources:
        if resource.normpath:
            resource.path = resource.normpath

    # Save package
    # TODO: use here json/create or write_json when it supports folder
    parsed = urlparse(props.url)
    path = props.path or Path(parsed.path).name or "dataset.json"
    result = endpoints.file.create.action(
        project,
        endpoints.file.create.Props(
            path=path,
            bytes=package.to_json().encode("utf-8"),
            folder=props.folder,
            deduplicate=props.deduplicate,
        ),
    )

    return Result(path=result.path)
