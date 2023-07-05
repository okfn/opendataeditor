from pydantic import BaseModel


class SystemConfig(BaseModel):
    openaiApiKey: str | None


class ProjectConfig(BaseModel):
    pass


class Config(BaseModel):
    system: SystemConfig
    project: ProjectConfig
