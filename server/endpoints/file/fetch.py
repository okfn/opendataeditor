from __future__ import annotations

import re
import tempfile
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

from fastapi import Request
from frictionless.resources import FileResource, TableResource
from pydantic import BaseModel

from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    url: str
    path: Optional[str] = None
    folder: Optional[str] = None
    deduplicate: Optional[bool] = None


class Result(BaseModel, extra="forbid"):
    path: str
    size: int


@router.post("/file/fetch")
def server_file_read(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


# TODO: implement proper cleanup in case of failed uploading
# currently, it only cleanups if the file is not a table


def action(project: Project, props: Props) -> Result:
    from ... import endpoints

    # Prepare resource
    resource = FileResource(path=props.url)

    # Handle Googel Sheets
    if resource.format == "gsheets":
        path = read_google_sheets_path(props.url)
        bytes = read_google_sheets_bytes(props.url)

    # Handle regular files
    else:
        path = Path(urlparse(props.url).path).name or "file"
        bytes = resource.read_file()

    # Save file
    path = endpoints.file.create.action(
        project,
        endpoints.file.create.Props(
            path=props.path or path,
            bytes=bytes,
            folder=props.folder,
            deduplicate=props.deduplicate,
        ),
    ).path

    # Index file
    # TODO: it's a temporary solution; we should not index files here
    record = endpoints.file.index.action(
        project, endpoints.file.index.Props(path=path)
    ).record

    # Ensure tabular
    if record.type != "table":
        endpoints.file.delete.action(project, endpoints.file.delete.Props(path=path))
        # TODO: currently, we just use a tranlation key here
        # later it might need to be migrated to proper error codes
        raise Exception("error-url-not-table")

    return Result(path=path, size=len(bytes))


# We export Google Sheets to a temporary CSV file and read it
def read_google_sheets_bytes(url: str):
    table = TableResource(path=url)
    with tempfile.NamedTemporaryFile(suffix=".csv") as file:
        table.write(file.name)
        resource = FileResource(path=file.name)
        bytes = resource.read_file()
        return bytes


# We use public HTML to extract the title of the document
def read_google_sheets_path(url: str):
    file = FileResource(path=url)
    text = file.read_text(size=10000)
    match = re.search(r"<title>(.*?)</title>", text)
    path = "google-sheets.csv"
    if match:
        title = match.group(1)
        title = title.rsplit("- Google", 1)[0].strip()
        path = f"{title}.csv"
    return path
