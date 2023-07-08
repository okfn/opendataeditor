# type: ignore
import openai
from frictionless.resources import FileResource


def ask_dalle(*, prompt: str, api_key: str) -> bytes:
    response = openai.Image.create(prompt=prompt, n=1, size="512x512", api_key=api_key)
    resource = FileResource(path=response.data[0].url)
    bytes = resource.read_file()
    return bytes


def ask_chatgtp(*, type: str, prompt: str, api_key: str) -> str:
    response = openai.ChatCompletion.create(
        api_key=api_key,
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": INSTRUCTIONS.get(type, "")},
            {"role": "user", "content": prompt},
        ],
    )

    text = ""
    for choice in response.choices:
        text += choice.message.content

    return text


INSTRUCTIONS = {
    "article": """
        You are a Markdown document generation assistant.
        You will be given a text description on what needs to be written.
        Respond with only the document without explanation
    """,
}
