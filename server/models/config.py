from pydantic import BaseModel


class SystemConfig(BaseModel):
    openaiApiKey: str | None = None


class ProjectConfig(BaseModel):
    name: str | None = None


class Config(BaseModel):
    system: SystemConfig
    project: ProjectConfig
    folder: str
    hideWelcomeScreen: bool
