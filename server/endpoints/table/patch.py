from __future__ import annotations

from typing import Optional

import sqlalchemy as sa
from fastapi import Request
from frictionless import Schema
from frictionless.formats.sql import SqlControl
from frictionless.resources import TableResource
from pydantic import BaseModel

from ... import helpers, models, types
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    history: Optional[models.History] = None
    resource: Optional[types.IDescriptor] = None


class Result(BaseModel, extra="forbid"):
    path: str


@router.post("/table/patch")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    from ... import endpoints

    fs = project.filesystem
    db = project.database

    # Patch record
    record = helpers.patch_record(
        project,
        path=props.path,
        resource=props.resource,
    )

    # Patch table
    if props.history:
        table = db.metadata.tables[record.name]
        schema = Schema.from_descriptor(record.resource.get("schema", {}))

        # Patch database table
        with db.engine.begin() as conn:
            for change in props.history.changes:
                if change.type == "cell-update":
                    # Skip virtual extra cells
                    if change.fieldName.startswith("_"):
                        continue

                    # Prepare value
                    value = change.value
                    if schema.has_field(change.fieldName):
                        field = schema.get_field(change.fieldName)
                        value, _ = field.read_cell(value)

                    # Write value
                    conn.execute(
                        sa.update(table)
                        .where(table.c._rowNumber == change.rowNumber)
                        .values(**{change.fieldName: value})
                    )
                elif change.type == "multiple-cells-update":
                    for cell in change.cells:
                        # Skip virtual extra cells
                        if cell.fieldName.startswith("_"):
                            continue

                        # Prepare value
                        value = cell.value
                        if schema.has_field(cell.fieldName):
                            field = schema.get_field(cell.fieldName)
                            value, _ = field.read_cell(value)
                        # Write value
                        conn.execute(
                            sa.update(table)
                            .where(table.c._rowNumber == cell.rowNumber)
                            .values(**{cell.fieldName: value})
                        )

        # Export database table
        target = fs.get_fullpath(props.path)
        control = SqlControl(table=record.name, with_metadata=True)
        resource = TableResource(path=db.database_url, control=control)
        resource.write_table(path=str(target))

    # Reset record
    helpers.reset_record(project, path=props.path)

    # Index record
    endpoints.file.index.action(
        project, props=endpoints.file.index.Props(path=props.path)
    )

    return Result(path=record.path)
