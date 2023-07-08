# type: ignore
import openai


def ask_chatai(*, type: str, prompt: str, api_key: str) -> str:
    openai.api_key = api_key

    response = openai.ChatCompletion.create(
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
