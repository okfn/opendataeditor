from __future__ import annotations

from fastapi import Request
from frictionless import FrictionlessException, Resource
from pydantic import BaseModel

from ... import helpers, models, types
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str


class Result(BaseModel, extra="forbid"):
    record: models.Record
    report: types.IDescriptor
    measure: types.IDescriptor


@router.post("/file/index")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    fs = project.filesystem
    md = project.metadata
    db = project.database

    # Read current state
    record = helpers.read_record(project, path=props.path)
    report = db.read_artifact(name=record.name, type="report") if record else None
    measure = db.read_artifact(name=record.name, type="measure") if record else None
    table = db.get_table(name=record.name) if record else None

    # Identify missing
    missing_record = not record
    missing_report = not report
    missing_measure = not measure
    missing_table = record and record.type == "table" and table is None

    # Ensure indexing
    if missing_record or missing_report or missing_measure or missing_table:
        # Ensure file exists
        fullpath = fs.get_fullpath(props.path)
        if not fullpath.is_file():
            raise FrictionlessException("file not found")

        # Index resource
        path, basepath = fs.get_path_and_basepath(props.path)
        name = helpers.name_record(project, path=path)
        resource_obj = (
            Resource(path=path, basepath=basepath)
            if missing_record
            else Resource.from_descriptor(
                record.resource,
                datatype=record.type,
                basepath=basepath,
            )
        )

        # Validate resource
        report_obj = helpers.index_resource(
            project, resource=resource_obj, table_name=name
        )
        report = report_obj.to_descriptor()

        # Ensure record
        if missing_record:
            record = models.Record(
                name=name,
                path=props.path,
                type=resource_obj.datatype,
                resource=resource_obj.to_descriptor(),
            )
        record.resource = resource_obj.to_descriptor()

        # Create measure
        measure_obj = models.Measure(
            errors=report_obj.stats["errors"],
        )
        measure = measure_obj.model_dump()

        # Write document/artifacts
        md.write_document(name=record.name, type="record", descriptor=record.model_dump())
        db.write_artifact(name=record.name, type="report", descriptor=report)
        db.write_artifact(name=record.name, type="measure", descriptor=measure)

    return Result(record=record, report=report, measure=measure)
