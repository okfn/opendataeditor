from __future__ import annotations

import base64
from pathlib import Path
from typing import Any

import jinja2
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

    # Convert text
    markdown = marko.Markdown()
    markdown.use(GFM)
    text = markdown.convert(text)

    # Process text
    records = helpers.extract_records(project, text=text, ignore_missing=True)
    for record in records:
        if record.type == "image":
            format = record.resource.get("format", "png")
            data = base64.b64encode(fs.get_fullpath(record.path).read_bytes()).decode()
            part = render_template(
                "templates/image.html",
                id=record.name,
                format=format,
                data=data,
            )
            text = text.replace(f"@{record.name}", part)
        if record.type == "map":
            data = fs.get_fullpath(record.path).read_text()
            part = render_template(
                "templates/map.html",
                id=record.name,
                data=data,
            )
            text = text.replace(f"@{record.name}", part)

    # Wrap text
    record = helpers.read_record_or_raise(project, path=props.path)
    text = render_template(
        "templates/article.html",
        title=record.resource.get("title"),
        description=record.resource.get("description"),
        article=text,
    )

    return Result(text=text)


def render_template(path: str, **context: Any):
    environment = jinja2.Environment()
    raw_template = Path(__file__).parent.joinpath(path).read_text()
    template = environment.from_string(raw_template)
    return template.render(**context)
