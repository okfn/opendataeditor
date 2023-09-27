from __future__ import annotations

import sqlalchemy as sa
from fastapi import Request
from frictionless import Schema
from pydantic import BaseModel

from ... import models
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    query: str


class Result(BaseModel, extra="forbid"):
    table: models.Table


@router.post("/table/query")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    db = project.database

    with db.engine.begin() as conn:
        result = conn.execute(sa.text(props.query))
        rows = list(dict(item) for item in result.mappings())
        header = list(result.keys())
        schema = Schema.describe(rows).to_descriptor()
        table = models.Table(tableSchema=schema, header=header, rows=rows)

    return Result(table=table)
