from __future__ import annotations

from pathlib import Path
from typing import Optional

from frictionless.resources import TextResource

from server import settings
from server.stores import Config, Database, Filesystem, Metadata


class Project:
    public: Path
    private: Path
    config: Config
    filesystem: Filesystem
    metadata: Metadata
    database: Database

    def __init__(self, basepath: Optional[str] = None):
        # Ensure structure
        self.system = Path(settings.APP_HOME)
        self.public = Path(basepath or "")
        self.private = self.public / f".{settings.APP_NAME}"
        self.system.mkdir(parents=True, exist_ok=True)
        self.public.mkdir(parents=True, exist_ok=True)
        self.private.mkdir(parents=True, exist_ok=True)

        # Ensure gitignore
        fullpath = self.private / ".gitignore"
        contents = "config.json\ndatabase.db\n"
        if not fullpath.exists():
            resource = TextResource(data=contents)
            resource.write_text(path=str(fullpath))

        # Create drivers
        self.config = Config(self)
        self.filesystem = Filesystem(self)
        self.metadata = Metadata(self)
        self.database = Database(self)
