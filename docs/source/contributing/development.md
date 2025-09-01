# Development

Open Data Editor is written in PySide6, the official Python module from the [Qt for Python project](https://wiki.qt.io/Qt_for_Python), which provides access to the complete Qt 6.9+ framework.

You can refer to the [Official Documentation](https://doc.qt.io/qtforpython-6/) to learn more about it. (And it's a handy documentation to bookmark!)

## Prerequisites

We are using 3.13. To start working on the project you need the following dependencies in your machine:

- Python 3.13
- python3.13-dev (For PyInstaller)

## Environment

As common practice with all python project, you should create a Virtual Environment (using your favorite tool!) to install all the requirements.

If using Python's default virtual env you can execute:

```bash
python -m venv venv
source venv/bin/activate
```

## Makefile

The project provides a `Makefile` with some usefull commands.

```bash
make help
```

:::{note}
All make commands that executes python commands (like `make start` or `make install`) requires a manually activated virtualenv to run.
:::

## Installation

To start working on the project install the dependencies:

```bash
make install
```

> Make install will also cd into the `portal` folder and install all the dependencies for the astro project.

## Codebase

To work on the application:

```bash
make start
```

## Documentation

Documentation is written with [Sphinx](https://www.sphinx-doc.org/en/master/) (in the `docs` directory). The source files are in the `docs/source/` directory. To locally build the documentation you can execute:

```bash
make docs
```

It will be automatically published on CloudFlare when merged to the `main` branch with previews available for pull requests.

## Making a release

To make a release follow the following checklist:
 - Check with the PO that `main` branch is code complete.
 - Check that the distributables built on main are working by installing them in your machine.
   - Sometimes PyInstaller cannot compile new dependencies and the application will fail at runtime.
 - Create a new PR bumping the version of the application (inside `ode/__init__.py` file.) and merge it to main.
 - Create a New Github Release with a new tag matching the new version number of the application.
 - Fill in the Release notes.
 - Create the Release.
 - Wait until the Github Action for the new tag finishes and then upload the distributable files to the new Release.
 - Notify the Communications Team to make the announcement and changes to the [OKFN's Website](https://okfn.org/en/projects/open-data-editor/).
