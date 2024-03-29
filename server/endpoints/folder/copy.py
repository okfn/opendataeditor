from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import Request
from frictionless import FrictionlessException
from pydantic import BaseModel

from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    toPath: Optional[str] = None
    deduplicate: Optional[bool] = None


class Result(BaseModel, extra="forbid"):
    path: str


@router.post("/folder/copy")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    fs = project.filesystem
    from ... import endpoints

    # Get source
    source = fs.get_fullpath(props.path)
    if not source.is_dir():
        raise FrictionlessException("Source doesn't exist")

    # Get target
    target = fs.get_fullpath(props.toPath) if props.toPath else fs.basepath
    if target.is_dir():
        target = target / source.name
    if props.deduplicate:
        target = fs.deduplicate_fullpath(target, suffix="copy")
    if target.exists():
        raise FrictionlessException("Target already exists")

    # List files inside
    result = endpoints.file.list.action(
        project,
        endpoints.file.list.Props(folder=props.path),
    )

    # Copy files inside
    for file in result.files:
        if file.type != "folder":
            # Replace source folder by target folder
            toPath = str(target / Path(file.path).relative_to(props.path))
            endpoints.file.copy.action(
                project,
                endpoints.file.copy.Props(path=file.path, toPath=toPath),
            )

    # Create folder (if no files inside)
    if not result.files:
        target.mkdir(parents=True)

    toPath = fs.get_path(target)
    return Result(path=toPath)
