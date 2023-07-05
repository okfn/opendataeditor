from __future__ import annotations

from fastapi import Request
from pydantic import BaseModel

from ... import models
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    config: models.Config


class Result(BaseModel, extra="forbid"):
    config: models.Config


@router.post("/config/write")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    config = cf.write(props.config)
    return Result(config=config)
