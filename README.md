
[![Build](https://img.shields.io/github/actions/workflow/status/frictionlessdata/application/general.yaml?branch=main)](https://github.com/frictionlessdata/application/actions)
[![Codebase](https://img.shields.io/badge/codebase-github-brightgreen)](https://github.com/frictionlessdata/application)

![ODE-landscape-full-rgb@3x](https://github.com/okfn/opendataeditor/assets/20649846/01ae62e8-87f6-4e44-9487-790b8111e321)

# Open Data Editor (beta)

### Welcome to our Readme

The Open Data Editor (ODE) is a **no-code application** to **explore, validate and publish data** in a simple way. Forever free and **open source project** powered by the **Frictionless Framework**.

 📩 [Send us feedback/Report a problem (email)](mailto:info@okfn.org)
 🪲 [Create an issue on GitHub](https://github.com/okfn/opendataeditor/issues)
 🤔 [Suggest a new feature](https://github.com/okfn/opendataeditor/issues)

# Useful links

🔵 [Development guide](https://opendataeditor.okfn.org/contributing/development/)

🔵 [Open Data Editor User Guide and Project Documentation](https://opendataeditor.okfn.org/)

🔵 [Frictionless Framework](https://framework.frictionlessdata.io/)

🔵 [Frictionless Data](https://frictionlessdata.io/)

🔵 [Contributing Guidelines](https://opendataeditor.okfn.org/contributing/contribution-guidelines)

🔵 [Open Data Editor Concept Note](https://opendataeditor.okfn.org/ode-concept-note.pdf)

🔵 For all contributions: [Code of conduct](https://frictionlessdata.io/code-of-conduct/)

# How to download the ODE

You can download the latest version from the [ODE website](https://okfn.org/en/projects/open-data-editor/)

For previous releases, you can download them from Github [RELEASE](https://github.com/okfn/opendataeditor/releases)

* For **Windows**:Download the most recent **EXE** file.
* For **MacOS**:Download the most recent **DMG** file.
* For **Linux**:Download the most recent **AppImage** or **DEB** file.

# Environment Variables

The Open Data Editor supports the following environment variables to customize AI model configuration:

| Variable | Description |
|----------|-------------|
| `ODE_AI_MODEL_NAME` | The display name of the AI model |
| `ODE_AI_MODEL_URL` | The download URL for the AI model GGUF file |
| `ODE_AI_MODEL_FILENAME` | The filename to save the model as |

All three variables must be set together to override the default model. If not set, the default [Apertus 8B model](https://huggingface.co/collections/swiss-ai/apertus-llm) (Apache 2.0 license) is used in the [Q5_K_M quantization](https://huggingface.co/bartowski/swiss-ai_Apertus-8B-Instruct-2509-GGUF) that requires at least 6GB of video memory.
