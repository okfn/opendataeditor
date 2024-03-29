from __future__ import annotations

from typing import List, Optional

import sqlalchemy as sa
from fastapi import Request
from pydantic import BaseModel

from ... import helpers, types
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    valid: Optional[bool] = None
    limit: Optional[int] = None
    offset: Optional[int] = None
    order: Optional[str] = None
    desc: Optional[bool] = None


class Result(BaseModel, extra="forbid"):
    rows: List[types.IRow]


@router.post("/table/read")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    db = project.database

    # Prepare query
    record = helpers.read_record_or_raise(project, path=props.path)
    table = db.metadata.tables[record.name]
    query = sa.select(table)
    if props.valid is not None:
        query = query.where(table.c._rowValid == props.valid)
    if props.limit:
        query = query.limit(props.limit)
    if props.offset:
        query = query.offset(props.offset)
    if props.order:
        column = table.c[props.order]
        if props.desc:
            column = sa.desc(column)
        query = query.order_by(column)

    # Execute query
    with db.engine.begin() as conn:
        result = conn.execute(query)
        rows = list(dict(item) for item in result.mappings())

    return Result(rows=rows)
