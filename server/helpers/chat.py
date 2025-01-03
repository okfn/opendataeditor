# type: ignore
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import TYPE_CHECKING, Any, List

import openai
from frictionless.resources import FileResource

from .record import extract_records

if TYPE_CHECKING:
    from ..project import Project


def ask_chatgpt_simple(*, api_key: str, messages: List[Any]) -> str:
    # Get response
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        api_key=api_key,
        messages=messages,
    )

    # Get text
    text = ""
    for choice in response.choices:
        text += choice.message.content

    return text


# Legacy


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
    records = extract_records(project, text=prompt)
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
    "text": """
        You are a text file generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only valid file content for this file format without explanation.
    """,
}
