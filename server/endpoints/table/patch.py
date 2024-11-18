from __future__ import annotations

from typing import List, Optional

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

    # This data will help us to reconstruct the error report
    # https://github.com/okfn/opendataeditor/issues/614
    prev_report = db.read_artifact(name=record.name, type="report") or {}
    updated_cells: List[models.Cell] = []

    # Patch table
    if props.history:
        table = db.metadata.tables[record.name]
        schema = Schema.from_descriptor(record.resource.get("schema", {}))

        # Collect updated cells
        for change in props.history.changes:
            if change.type == "cell-update":
                # TODO: it's better to sync types of "cell-update" and "multiple-cells-update"
                updated_cells.append(models.Cell(**change.model_dump()))
            elif change.type == "multiple-cells-update":
                for cell in change.cells:
                    updated_cells.append(cell)

        # Patch database table
        with db.engine.begin() as trx:
            for cell in updated_cells:
                # Skip virtual extra cells
                if cell.fieldName.startswith("_"):
                    continue

                # Prepare value
                value = cell.value
                if schema.has_field(cell.fieldName):
                    field = schema.get_field(cell.fieldName)
                    value, _ = field.read_cell(cell.value)

                # Write value
                trx.execute(
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

    # Reconstruct previous errors
    # Currently, we only recover errors if no metadata is changed
    # otherwise it's basically not possible to reconstruct errors
    # The data/metadata separation needs to be properly implemeted as per:
    # https://github.com/okfn/opendataeditor/issues/494
    if updated_cells and not props.resource:
        next_report = db.read_artifact(name=record.name, type="report") or {}
        not_fixed_errors_count = 0

        prev_task = prev_report["tasks"][0]
        next_task = next_report["tasks"][0]

        for error in prev_task["errors"]:
            type = error["type"]
            if type not in ["type-error"]:
                continue

            rowNumber = error["rowNumber"]
            fieldName = error["fieldName"]

            fixed = False
            for cell in updated_cells:
                # The error was fixed so we don't need to recover it
                if cell.rowNumber == rowNumber and cell.fieldName == fieldName:
                    fixed = True
                    break

            if not fixed:
                not_fixed_errors_count += 1
                next_task["errors"].append(error)  # type: ignore

        if not_fixed_errors_count:
            next_task["valid"] = False
            next_task["stats"]["errors"] += not_fixed_errors_count
            next_report["valid"] = False
            next_report["stats"]["errors"] += not_fixed_errors_count
            db.write_artifact(name=record.name, type="report", descriptor=next_report)

    return Result(path=record.path)
