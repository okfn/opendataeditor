from __future__ import annotations

from typing import TYPE_CHECKING

from frictionless.resources import JsonResource

from .. import models

if TYPE_CHECKING:
    from ..project import Project


class Config:
    def __init__(self, project: Project):
        self.system = project.system / "config.json"
        self.project = project.private / "config.json"
        self.hideWelcomeScreen = "config.json"
        self.folder = project.public.resolve()
        for fullpath in [self.system, self.project]:
            if not fullpath.exists():
                JsonResource(data={}).write_json(path=str(fullpath))

    # System

    def read(self):
        system = JsonResource(path=str(self.system)).read_json()
        project = JsonResource(path=str(self.project)).read_json()
        config = models.Config(system=system, project=project, folder=str(self.folder), hideWelcomeScreen=bool(self.hideWelcomeScreen))
        return config

    def write(self, config: models.Config):
        system = config.system.model_dump()
        project = config.project.model_dump()
        JsonResource(data=system).write_json(path=str(self.system))
        JsonResource(data=project).write_json(path=str(self.project))
        return config
