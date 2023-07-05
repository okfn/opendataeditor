from __future__ import annotations

from fastapi import Request
from pydantic import BaseModel

from ... import models
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    config: models.Config | None


class Result(BaseModel, extra="forbid"):
    config: models.Config


@router.post("/system/config")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    config = cf.read_system()
    if props.config:
        config = cf.write_system(props.config)
    return Result(config=config)
