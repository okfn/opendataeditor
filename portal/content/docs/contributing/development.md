---
title: Development
sidebar:
  order: 3
---

Open Data Editor uses a client/server architecture wrapped into a desktop application. As a server, we use a Python codebase that uses [frictionless-py](https://framework.frictionlessdata.io/) for data and metadata processing. As a client, we use this codebase written in TypeScript that uses React for components and Zustand for state management. As a desktop wrapper, we use Electron for NodeJS.

## Prerequisites

To start working on the project you need the following dependencies in your machine:

- Python 3.11+
- Node 20+
- python3.11-dev (For PyInstaller)

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
.python/opendataeditor/bin/python
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
hatch run start <data-folder> # optionally provide a data folder path
```

### Client

> It requires the server to be running

Running the client in isolation:

```bash
make client
# OR
npm run start
```

### Desktop

> It requires the server to be running

Running desktop application:

```bash
make desktop
# OR
npm run desktop
```

## Documentation

Documentation is written with [Starlight](https://starlight.astro.build/) (in the `portal` directory). The source articles are in the `portal/content/docs` directory. To start a live-reload server and work on the docs:

```bash
make docs
```

It will be automatically published on CloudFlare when merged to the `main` branch with previews available for pull requests.

## Releasing

> You need to be a maintainer to release a new version

- Update the version in `package.json` according to SemVer
- Create a pull request with the change and get it approved and merged
- GitHub Actions will automatically create a [release draft](https://github.com/okfn/opendataeditor/releases) with build artifacts to be tested and published
- Until the draft realease is published, every new pull request merged will update the draft with new artifacts
- Review, edit, and publish the draft release when it is ready
