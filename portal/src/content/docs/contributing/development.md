---
title: Development
sidebar:
  order: 1
---

Open Data Editor uses a client/server architecture. As a server, we use a Python codebase that uses [frictionless-py](https://framework.frictionlessdata.io/) for data and metadata processing. As a client, we use this codebase written in TypeScript that uses React for components and Zustand for state management.

## Prerequisites

To start working on the project:

- Python 3.10+
- Node 16+

## Enviroment

:::tip
For development orchestration we use [Hatch](https://github.com/pypa/hatch) for Python (defined in `pyproject.toml`) and [NPM](https://docs.npmjs.com/cli/) for JavaScript (defined in `package.json`). We use `make` to run joint commands (defined in `Makefile`)
:::

NPM is included into the Node distribution so we just need to install `hatch`:

```bash
pip3 install hatch
```

### Python

Before starting with the project we recommend configuring `hatch`. The following line will ensure that all the virtual environments will be stored in the `.python` directory in project root:

```bash
hatch config set 'dirs.env.virtual' '.python'
hatch shell # Enter the venv
```

Now you can setup you IDE to use a proper Python path:

```bash
.python/fdapp/bin/python
```

## Installation

To start working on the project install the dependencies:

```bash
make install
```

### JavaScript

We highly recommend enabling TypeScript checks for your IDE.

## Codebase

### Application

To work on the whole application:

```bash
make start
```

Note that there are few CSV files in the `data` folder to test the app. You can find more in the internet (it's good to test it using different files).

### Server

Running the server in isolation:

```bash
make server # default folder
# OR
python -m src.server <data-folder> # select project folder
```

### Client

Running the client in isolation:

```bash
make client
```

### Components

To work on individual components (StoryBook):

```bash
make components
```

## Documentation

Documentation is written with Mkdocs (defined in `mkdocs.yaml`). The source articles are in the `docs` directory. To start a live-reload server:

```bash
make write
```

Building the docs:

```bash
make docs
```
