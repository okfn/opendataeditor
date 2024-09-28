from __future__ import annotations

from typing import TYPE_CHECKING

from frictionless import FrictionlessException, Indexer, Report
from frictionless.resources import PackageResource, ResourceResource, TableResource

if TYPE_CHECKING:
    from frictionless import Resource

    from ..project import Project


def index_resource(project: Project, resource: Resource, table_name: str):
    db = project.database

    # Table resource
    report = None
    if isinstance(resource, TableResource):
        indexer = Indexer(
            resource=resource,
            database=db.engine,
            table_name=table_name,
            with_metadata=True,
            ignore_constraints=True,
        )
        report = indexer.index()

    # Container resource
    if isinstance(resource, (ResourceResource, PackageResource)):
        try:
            errors = []
            resource.read_metadata()
        except FrictionlessException as exception:
            errors = exception.to_errors()
        report = Report.from_validation(errors=errors)

    # General resource
    if not report:
        report = resource.validate()

    return report
