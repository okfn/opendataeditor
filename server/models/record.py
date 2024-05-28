from typing import Optional

from pydantic import BaseModel

from .. import types


class Record(BaseModel):
    name: str
    """
    Unique file name/identifier across the project.
    """

    type: str
    """
    File type e.g. "text" or "table".
    """

    path: str
    """
    Path to the file relative to the project root.
    """

    dataUpdatedAt: Optional[float] = None
    """
    UNIX timestamp of the last file update.
    It's used to detect changes that were made outside of the app.
    """

    resource: types.IDescriptor
    """
    Data Resource descriptor as per the Data Package Standard:
    https://datapackage.org/specifications/data-resource/
    """
