from __future__ import annotations

import base64
import json
import re
from pathlib import Path
from typing import Any, Optional

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
    asPage: Optional[bool] = None


class Result(BaseModel, extra="forbid"):
    text: str


@router.post("/article/render")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    from ... import endpoints

    fs = project.filesystem
    text = props.text

    # Convert text
    markdown = marko.Markdown()
    markdown.use(GFM)
    text = markdown.convert(text)

    # Process text (native images)
    matches = re.finditer(r"<img.*?src=\"(.*?)\".*?/>", text)
    for match in matches:
        element = match.group(0)
        relpath = match.group(1)
        fullpath = fs.get_fullpath(props.path).parent / relpath
        if fullpath.is_file():
            data = base64.b64encode(fullpath.read_bytes()).decode()
            markup = render_template(
                "templates/image.html",
                format=fullpath.suffix[1:],
                data=data,
            )
            text = text.replace(element, markup)

    # Process text (mentions)
    records = helpers.extract_records(project, text=text, ignore_missing=True)
    for record in records:
        if record.type == "image":
            format = record.resource.get("format", "png")
            data = base64.b64encode(fs.get_fullpath(record.path).read_bytes()).decode()
            markup = render_template(
                "templates/image.html",
                format=format,
                data=data,
            )
            text = text.replace(f"@{record.name}", markup)
        if record.type == "map":
            data = fs.get_fullpath(record.path).read_text()
            markup = render_template(
                "templates/map.html",
                id=record.name,
                data=data,
            )
            text = text.replace(f"@{record.name}", markup)
        if record.type == "chart":
            chart = helpers.read_json(project, path=record.path)
            result = endpoints.chart.render.action(
                project, endpoints.chart.render.Props(path=record.path, chart=chart)
            )
            data = json.dumps(result.chart)
            markup = render_template(
                "templates/chart.html",
                id=record.name,
                data=data,
            )
            text = text.replace(f"@{record.name}", markup)

    # Compose article
    if props.asPage:
        text = render_template("templates/page.html", html=text)

    return Result(text=text)


def render_template(path: str, **context: Any):
    environment = jinja2.Environment()
    raw_template = Path(__file__).parent.joinpath(path).read_text()
    template = environment.from_string(raw_template)
    return template.render(**context)
