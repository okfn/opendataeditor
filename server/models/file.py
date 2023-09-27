from typing import Optional

from pydantic import BaseModel


# If file is indexed it will have name, refined type, and errors
class File(BaseModel):
    name: Optional[str] = None
    type: str
    path: str
    errors: Optional[int] = None
