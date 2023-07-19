# type: ignore
from __future__ import annotations

import json
import os
from pathlib import Path
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


def ask_chatgpt(
    project: Project,
    *,
    type: str,
    path: str,
    prompt: str,
    api_key: str,
) -> str:
    md = project.metadata

    # Default system messages
    messages = [
        {"role": "system", "content": INSTRUCTIONS.get(type, "")},
    ]

    # Mention-based system messages
    records = extract_records(project, prompt=prompt)
    for record in records:
        path = str(os.path.relpath(record.path, os.path.dirname(path)))
        prompt = prompt.replace(f"@{record.name}", path)
        if record.type == "table":
            schema = json.dumps(record.resource.get("schema", {}))
            instruction = f"The {path} table has Table Schema {schema}"
            messages.append({"role": "system", "content": instruction})

    # Package type system messages
    if type == "package":
        paths = [descriptor["path"] for descriptor in md.iter_documents(type="record")]
        messages.append(
            {"role": "system", "content": f"Filter this file list: {json.dumps(paths)}"},
        )

    # Text type system messages
    if type == "text":
        format = Path(path).suffix
        messages.append(
            {"role": "system", "content": f"Use this file format: {format}"},
        )

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
    "json": """
        You are a JSON file generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only JSON content without explanation.
    """,
    "map": """
        You are a GeoJSON document generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only the GeoJSON code in valid JSON notation without explanation.
    """,
    "package": """
        You are a JSON generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only the JSON list without explanation.
    """,
    "script": """
        You are a Python code generation assistant.
        You will be given a text description on what needs to be written.
        You can use pandas and frictionless libraries.
        Respond with only the Python code without explanation.
    """,
    "text": """
        You are a text file generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only valid file content for this file format without explanation.
    """,
    "view": """
        You are a SQL code generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only the SQL code without explanation.
    """,
}
