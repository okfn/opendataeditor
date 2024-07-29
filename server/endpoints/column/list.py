from __future__ import annotations

from typing import List

from fastapi import Request
from frictionless import Schema
from pydantic import BaseModel

from ... import models
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    pass


class Result(BaseModel, extra="forbid"):
    columns: List[models.Column]


@router.post("/column/list")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    md = project.metadata

    result = Result(columns=[])
    for descriptor in md.iter_documents(type="record"):
        name = descriptor["name"]
        type = descriptor["type"]
        path = descriptor["path"]
        schema = None

        if type == "table":
            descriptor = descriptor["resource"].get("schema")
            schema = Schema.from_descriptor(descriptor) if descriptor else Schema()

        if schema:
            for field in schema.fields:
                result.columns.append(
                    models.Column(
                        name=field.name,
                        type=field.type,
                        tableName=name,
                        tablePath=path,
                    )
                )

    return result
