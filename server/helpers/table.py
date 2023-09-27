from __future__ import annotations

from typing import TYPE_CHECKING, List, Optional

from frictionless import FrictionlessException, Schema
from frictionless.resources import TableResource

from .. import types

if TYPE_CHECKING:
    from ..project import Project


def write_table(
    project: Project,
    *,
    path: str,
    rows: List[types.IRow],
    schema: types.IDescriptor,
    overwrite: Optional[bool] = None,
    deduplicate: Optional[bool] = None,
):
    fs = project.filesystem

    # Write
    fullpath = fs.get_fullpath(path, deduplicate=deduplicate)
    if not overwrite and fullpath.exists():
        raise FrictionlessException("table already exists")
    resource = TableResource(data=rows, schema=Schema.from_descriptor(schema))
    resource.write_table(path=str(fullpath))
    path = fs.get_path(fullpath)

    return path


# TODO: remove if not used
def extract_schemas(project: Project, *, prompt: str):
    md = project.metadata

    schemas: dict[str, types.IDescriptor] = {}
    for descriptor in md.iter_documents(type="record"):
        path = descriptor["path"]
        if path in prompt:
            schema = descriptor["resource"].get("schema")
            if schema:
                schemas[path] = schema

    return schemas
