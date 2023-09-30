from __future__ import annotations

import sqlalchemy as sa
from fastapi import Request
from frictionless import Schema
from pydantic import BaseModel

from ... import helpers, types
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str


class Result(BaseModel, extra="forbid"):
    tableSchema: types.IDescriptor


@router.post("/table/infer")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    db = project.database

    # Prepare query
    record = helpers.read_record_or_raise(project, path=props.path)
    table = db.metadata.tables[record.name]
    query = sa.select(table).limit(100)

    # Execute query
    with db.engine.begin() as conn:
        result = conn.execute(query)
        rows = list(dict(item) for item in result.mappings())

    # Infer schema
    schema = Schema.describe(rows).to_descriptor()

    return Result(tableSchema=schema)
