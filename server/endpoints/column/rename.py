from __future__ import annotations

import sqlalchemy as sa
from fastapi import Request
from frictionless.formats.sql import SqlControl
from frictionless.resources import TableResource
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    oldName: str
    newName: str


class Result(BaseModel, extra="forbid"):
    pass


@router.post("/column/rename")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    fs = project.filesystem
    db = project.database

    record = helpers.read_record_or_raise(project, path=props.path)

    # Rename column
    with db.engine.begin() as conn:
        # Escape column names
        oldName = escape_column_name(props.oldName)
        newName = escape_column_name(props.newName)

        # Alter table
        query = f'ALTER TABLE "{record.name}" RENAME COLUMN "{oldName}" TO "{newName}"'
        conn.execute(sa.text(query))
        db.metadata.reflect(conn)

        # Export table
        target = fs.get_fullpath(props.path)
        control = SqlControl(table=record.name, with_metadata=True)
        resource = TableResource(path=db.database_url, control=control)
        resource.write_table(path=str(target))

    # Reset record
    helpers.reset_record(project, path=props.path)

    return Result()


# https://stackoverflow.com/questions/41383538/how-to-escape-double-quote-in-string-in-sqlite-query
def escape_column_name(name: str):
    return name.replace('"', '""')
