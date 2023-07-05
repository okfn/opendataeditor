from __future__ import annotations

from typing import TYPE_CHECKING

from frictionless.resources import JsonResource

from .. import models

if TYPE_CHECKING:
    from ..project import Project


class Config:
    def __init__(self, project: Project):
        self.system = project.system / "config.json"
        if not self.system.exists():
            resource = JsonResource(data={})
            resource.write_json(path=str(self.system))

    # System

    def read_system(self):
        resource = JsonResource(path=str(self.system))
        config = models.Config(**resource.read_json())
        return config

    def write_system(self, config: models.Config):
        resource = JsonResource(data=config.dict())
        resource.write_json(path=str(self.system))
        return config
