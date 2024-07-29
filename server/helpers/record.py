from __future__ import annotations

import re
from pathlib import Path
from typing import TYPE_CHECKING, List, Optional

from frictionless import FrictionlessException
from slugify.slugify import slugify
from tinydb import Query

from .. import models, types

if TYPE_CHECKING:
    from ..project import Project


# TODO: update all the project's packages/resources as well
def patch_record(
    project: Project,
    *,
    path: str,
    name: Optional[str] = None,
    type: Optional[str] = None,
    resource: Optional[types.IDescriptor] = None,
    toPath: Optional[str] = None,
):
    md = project.metadata

    # Update record
    updated = False
    fromName = None
    record = read_record_or_raise(project, path=path)
    if name:
        updated = True
        fromName = record.name
        record.name = name
    if type:
        updated = True
        record.type = type
        record.resource.pop("type", None)
        record.resource.pop("dialect", None)
        record.resource.pop("schema", None)
    if resource:
        updated = True
        record.resource = resource
    if toPath:
        updated = True
        record.name = name_record(project, path=toPath)
        record.path = toPath
        record.resource["path"] = toPath

    # Write record
    if updated:
        if fromName:
            md.delete_document(name=fromName, type="record")
        md.write_document(name=record.name, type="record", descriptor=record.model_dump())

    # Clear database
    # TODO: use smarter logic to delete only if needed
    if updated and not toPath:
        delete_record(project, path=path, onlyFromDatabase=True)

    return record


def delete_record(project: Project, *, path: str, onlyFromDatabase: bool = False):
    md = project.metadata
    db = project.database

    # Read record
    record = read_record(project, path=path)
    if not record:
        return None

    # Delete from database
    db.delete_artifact(name=record.name, type="report")
    db.delete_artifact(name=record.name, type="measure")
    if record.type == "table":
        db.delete_table(name=record.name)

    # Delete from metadata
    if not onlyFromDatabase:
        md.delete_document(name=record.name, type="record")


def read_record_or_raise(project: Project, *, path: str):
    record = read_record(project, path=path)
    if not record:
        raise FrictionlessException(f"record not found: {path}")
    return record


def read_record(project: Project, *, path: str):
    md = project.metadata

    descriptor = md.find_document(type="record", query=Query().path == path)
    if not descriptor:
        return None
    return models.Record(**descriptor)


def name_record(project: Project, *, path: str) -> str:
    md = project.metadata

    # Make slugified
    name = convert_path_to_record_name(path)

    # Make unique
    names: List[str] = []
    found = False
    template = f"{name}%s"
    for item in md.iter_documents(type="record"):
        item_name: str = item["name"]
        names.append(item_name)
        if item["path"] == path:
            name = item_name
            found = True
    if not found:
        suffix = 1
        while name in names:
            name = template % suffix
            suffix += 1

    return name  # type: ignore


def convert_path_to_record_name(path: str):
    name = Path(path).stem
    name = slugify(name, separator="_")
    name = re.sub(r"[^a-zA-Z0-9_]+", "", name)
    return name


def extract_records(project: Project, *, text: str, ignore_missing: bool = False):
    md = project.metadata

    records: list[models.Record] = []
    names = extract_record_names(text=text)
    for name in names:
        descriptor = md.read_document(type="record", name=name)
        if not descriptor:
            if ignore_missing:
                continue
            raise FrictionlessException(f"record not found: @{name}")
        record = models.Record(**descriptor)
        records.append(record)

    return records


def extract_record_names(*, text: str):
    return re.findall(r"\@([a-zA-Z0-9_]+)", text)
