from typing import Optional

from pydantic import AwareDatetime, BaseModel

from .. import types


class Record(BaseModel):
    name: str
    type: str
    path: str
    resource: types.IDescriptor
    dataLastUpdated: Optional[AwareDatetime] = None
