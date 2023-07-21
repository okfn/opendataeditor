from __future__ import annotations

import base64

import marko
from fastapi import Request
from marko.ext.gfm import GFM
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    text: str


class Result(BaseModel, extra="forbid"):
    text: str


@router.post("/article/render")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    fs = project.filesystem
    text = props.text

    # Process text
    records = helpers.extract_records(project, text=text)
    for record in records:
        if record.type == "image":
            format = record.resource.get("format", "png")
            contents = base64.b64encode(fs.get_fullpath(record.path).read_bytes())
            src = f"data:image/{format};base64,{contents.decode()}"
            tag = f'<img src="{src}" style="max-width: 100%" />'
            text = text.replace(f"@{record.name}", tag)

    # Convert text
    markdown = marko.Markdown()
    markdown.use(GFM)
    text = markdown.convert(text)

    return Result(text=text)
