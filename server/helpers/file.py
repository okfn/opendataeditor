from __future__ import annotations

from typing import TYPE_CHECKING, Callable, Optional

from frictionless import FrictionlessException
from frictionless.resources import FileResource
from gitignore_parser import parse_gitignore  # type: ignore

if TYPE_CHECKING:
    from ..project import Project


def test_file(project: Project, *, path: str):
    fs = project.filesystem

    fullpath = fs.get_fullpath(path)
    return fullpath.exists()


def read_file(project: Project, *, path: str):
    fs = project.filesystem

    fullpath = fs.get_fullpath(path)
    resource = FileResource(path=str(fullpath))
    bytes = resource.read_file()

    return bytes


def write_file(
    project: Project,
    *,
    path: str,
    bytes: bytes,
    overwrite: Optional[bool] = None,
    deduplicate: Optional[bool] = None,
):
    fs = project.filesystem

    fullpath = fs.get_fullpath(path, deduplicate=deduplicate)
    if not overwrite and fullpath.exists():
        raise FrictionlessException("file already exists")
    source = FileResource(data=bytes)
    target = FileResource(path=str(fullpath))
    source.write_file(target)
    path = fs.get_path(fullpath)

    return path


def get_file_updated_at(project: Project, *, path: str):
    fs = project.filesystem
    fullpath = fs.get_fullpath(path)
    return fullpath.stat().st_mtime


def create_file_filter(project: Project) -> Callable[[str], bool]:
    fs = project.filesystem
    fullpath = fs.get_fullpath(".gitignore")
    if not fullpath.exists():
        return lambda _: False

    matches = parse_gitignore(fullpath)  # type:ignore

    def ignore_path(path: str) -> bool:
        #  fullpath = fs.get_fullpath(path)
        return True if matches(path) else False

    return ignore_path
