from __future__ import annotations

from pathlib import Path
from typing import Optional

import platformdirs
from frictionless.resources import TextResource

from . import settings
from .stores import Config, Database, Filesystem, Metadata


class Project:
    public: Path
    private: Path
    config: Config
    filesystem: Filesystem
    metadata: Metadata
    database: Database

    def __init__(self, basepath: Optional[str] = None):
        # Ensure structure
        self.system = platformdirs.user_config_path(appname=settings.APPNAME)
        self.public = Path(basepath or "")
        self.private = self.public / ".frictionless"
        self.system.mkdir(parents=True, exist_ok=True)
        self.public.mkdir(parents=True, exist_ok=True)
        self.private.mkdir(parents=True, exist_ok=True)

        # Ensure gitignore
        text = "config.json\ndatabase.db\n"
        path = str(self.private / ".gitignore")
        resource = TextResource(data=text)
        resource.write_text(path=path)

        # Create drivers
        self.config = Config(self)
        self.filesystem = Filesystem(self)
        self.metadata = Metadata(self)
        self.database = Database(self)
