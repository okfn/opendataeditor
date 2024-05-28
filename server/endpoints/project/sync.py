from __future__ import annotations

from typing import List

from fastapi import Request
from pydantic import BaseModel

from ... import helpers, models
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    pass


class Result(BaseModel, extra="forbid"):
    files: List[models.File]


@router.post("/project/sync")
def endpoint(request: Request, _: Props) -> Result:
    return action(request.app.get_project())


def action(project: Project) -> Result:
    md = project.metadata
    from ... import endpoints

    # Get all the project's file paths that actually exist on the disc at this moment
    paths: List[str] = []
    result = endpoints.file.list.action(project)
    for file in result.files:
        paths.append(file.path)

    # Delete all the records that are not in the list of the paths
    # e.g. they were deleted by a user outside of the app
    for descriptor in md.iter_documents(type="record"):
        path = descriptor["path"]
        if path not in paths:
            helpers.delete_record(project, path=path)

    return Result(files=result.files)
