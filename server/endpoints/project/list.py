from __future__ import annotations

import os
from pathlib import Path
from typing import List

from fastapi import Request
from pydantic import BaseModel

from ... import models, settings
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    pass


class Result(BaseModel, extra="forbid"):
    projects: List[models.Project]


@router.post("/project/list")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    projects: List[models.Project] = []

    for root, folders, _ in os.walk(settings.HOME):
        print(root)
        root = Path(root)
        for folder in list(folders):
            if folder.startswith(".") or folder in settings.IGNORED_FOLDERS:
                folders.remove(folder)
                continue
            projects.append(models.Project(path=str(root / folder)))

    return Result(projects=projects)
