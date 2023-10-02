from __future__ import annotations

import shutil
import tempfile
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import Request
from frictionless import Control, Package, Resource
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    # TODO: use IControl?
    control: Dict[str, Any]


class Result(BaseModel, extra="forbid"):
    url: Optional[str]


@router.post("/article/publish")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    from ... import endpoints

    fs = project.filesystem

    record = helpers.read_record_or_raise(project, path=props.path)
    resource = Resource.from_descriptor(record.resource)
    fullpath = fs.get_fullpath(props.path)

    with tempfile.TemporaryDirectory() as temp_dir:
        rendered_text = endpoints.article.render.action(
            project,
            endpoints.article.render.Props(
                path=props.path,
                text=fullpath.read_text(),
                asPage=True,
            ),
        )

        fullpath_md = shutil.copy(fullpath, f"{temp_dir}/index.md")
        fullpath_html = Path(fullpath_md).with_suffix(".html")
        fullpath_html.write_text(rendered_text.text)
        package = Package(resources=[resource], basepath=temp_dir)
        package.resources[0].path = "index.md"
        package.add_resource(Resource(path="index.html"))
        package.infer()

        control = Control.from_descriptor(props.control)
        if control.type == "github":
            control.enable_pages = True
        result = package.publish(control=control)

    return Result(url=result.url)
