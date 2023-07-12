# type: ignore
from __future__ import annotations

import json
from typing import TYPE_CHECKING

import openai
from frictionless.resources import FileResource

from .record import extract_records

if TYPE_CHECKING:
    from ..project import Project


def ask_dalle(project: Project, *, prompt: str, api_key: str) -> bytes:
    response = openai.Image.create(prompt=prompt, n=1, size="512x512", api_key=api_key)
    resource = FileResource(path=response.data[0].url)
    bytes = resource.read_file()
    return bytes


def ask_chatgtp(project: Project, *, type: str, prompt: str, api_key: str) -> str:
    # Default system messages
    messages = [
        {"role": "system", "content": INSTRUCTIONS.get(type, "")},
    ]

    # Mention-based system messages
    records = extract_records(project, prompt=prompt)
    for record in records:
        prompt = prompt.replace(f"@{record.name}", record.path)
        if record.type == "table":
            schema = json.dumps(record.resource.get("schema", {}))
            instruction = f"The {record.path} table has Table Schema {schema}"
            messages.append({"role": "system", "content": instruction})

    # User messages
    messages.append(
        {"role": "user", "content": prompt},
    )

    # Get response
    response = openai.ChatCompletion.create(
        api_key=api_key,
        model="gpt-3.5-turbo",
        messages=messages,
    )

    # Get text
    text = ""
    for choice in response.choices:
        text += choice.message.content

    return text


INSTRUCTIONS = {
    "article": """
        You are a Markdown document generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only the document without explanation.
    """,
    "chart": """
        You are a Vega Lite chart generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only the JSON chart without explanation.
    """,
    "script": """
        You are a Python code generation assistant.
        You will be given a text description on what needs to be written.
        You can use pandas and frictionless libraries.
        Respond with only the Python code without explanation.
    """,
    "view": """
        You are a SQL code generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only the SQL code without explanation.
    """,
}
