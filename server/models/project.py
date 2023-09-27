from pydantic import BaseModel


class Project(BaseModel):
    path: str
