from __future__ import annotations

from typing import List

from fastapi import Request
from pydantic import BaseModel

from ... import models, settings
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    pass


class Result(BaseModel, extra="forbid"):
    projects: List[models.Project]


@router.post("/project/list")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    print(settings.HOME)

    return Result(projects=[])
