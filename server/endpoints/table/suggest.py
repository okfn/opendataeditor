from __future__ import annotations

from fastapi import Request
from frictionless import Schema
from pydantic import BaseModel

from ... import helpers
from ...project import Project
from ...router import router


class Props(BaseModel, extra="forbid"):
    path: str
    prompt: str
    apiKey: str


class Result(BaseModel, extra="forbid"):
    text: str


@router.post("/table/suggest")
def server_text_write(request: Request, props: Props) -> Result:
    return action(request.app.get_project(), props)


def action(project: Project, props: Props) -> Result:
    record = helpers.read_record_or_raise(project, path=props.path)

    schema = Schema.from_descriptor(record.resource.get("schema", {}))
    column_names = ",".join([field.name for field in schema.fields])

    text = helpers.ask_chatgpt_simple(
        api_key=props.apiKey,
        messages=[
            {"role": "system", "content": "Answer in Markdown with no outer quotes."},
            {"role": "system", "content": f"Current column names: {column_names}"},
            {"role": "user", "content": props.prompt},
        ],
    )

    return Result(text=text)
