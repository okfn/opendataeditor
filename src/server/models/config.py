from pydantic import BaseModel


class Config(BaseModel):
    openaiApiKey: str | None
