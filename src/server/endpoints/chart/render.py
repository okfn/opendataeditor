from __future__ import annotations

from copy import deepcopy
from pathlib import Path

import sqlalchemy as sa
from fastapi import Request
from pydantic import BaseModel

from ... import types
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    chart: types.IChart


class Result(BaseModel, extra="forbid"):
    chart: types.IChart


@router.post("/chart/render")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    from ... import endpoints

    db = project.database
    chart = deepcopy(props.chart)

    # Return if no path
    relpath = chart.get("data", {}).pop("url", None)
    if not relpath:
        return Result(chart=chart)

    # Ensure record
    path = str(Path(props.path).parent / Path(relpath))
    record = endpoints.file.index.action(
        project, endpoints.file.index.Props(path=path)
    ).record

    # TODO: cherry-pick fields based on presense in the chart
    # TODO: check if some data types need to be stringified
    with db.engine.begin() as conn:
        table = db.get_table(name=record.name)
        result = conn.execute(sa.select(table))
        values = list(dict(item) for item in result.mappings())
        chart["data"]["values"] = values

    return Result(chart=chart)
