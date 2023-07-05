from __future__ import annotations

from typing import TYPE_CHECKING

from frictionless.resources import JsonResource

from .. import models

if TYPE_CHECKING:
    from ..project import Project


class Config:
    def __init__(self, project: Project):
        self.fullpath = project.system / "config.json"
        if not self.fullpath.exists():
            resource = JsonResource(data={})
            resource.write_json(path=str(self.fullpath))

    # Values

    def read(self):
        resource = JsonResource(path=str(self.fullpath))
        config = models.Config(**resource.read_json())
        return config

    def write(self, *, config: models.Config):
        resource = JsonResource(data=config.json())
        resource.write_json(path=str(self.fullpath))
