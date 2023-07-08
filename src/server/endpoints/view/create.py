from __future__ import annotations

import json
from typing import Optional

from fastapi import Request
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    prompt: str | None
    deduplicate: Optional[bool] = None


class Result(BaseModel, extra="forbid"):
    path: str


@router.post("/view/create")
def endpoint(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    cf = project.config

    # Create query
    query = ""
    config = cf.read()
    api_key = config.system.openaiApiKey
    if props.prompt and api_key:
        schemas = helpers.extract_schemas(project, prompt=props.prompt)
        instructions: list[str] = []
        for path, schema in schemas.items():
            instruction = f'The "{path}" table has Table Schema "{json.dumps(schema)}"'
            instructions.append(instruction)
        query = helpers.ask_chatgtp(
            type="view",
            api_key=api_key,
            prompt=props.prompt,
            instructions=instructions,
        )

    # Write text
    path = helpers.write_json(
        project, path=props.path, data={"query": query}, deduplicate=props.deduplicate
    )

    return Result(path=path)
