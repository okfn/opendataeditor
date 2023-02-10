# Development

Frictionless Application uses a client/server architecture. As a server, we use and API provided by [Frictionless Framework](https://framework.frictionlessdata.io/) (a Python library). As a client, we use this codebase written in TypeScript that uses React for components and Zustand for state management.

## Prerequisites

It's highly recommended to setup your IDE with TypeScript support so you can see type errors and suggestion in the real-time.

## Installation

To start working on the project you might create a virtual environment for the server:

> This step is optional

```bash
python3.10 -m venv .python
source .python/bin/activate
pip install wheel
```

And then install Python and JavaScript dependencies:

```bash
make install
```

## Application

To work on the whole application:

```bash
npm run application
```

Note that there are few CSV files in the `data` folder to test the app. You can find more in the internet (it's good to test it using different files).

## Components

To work on individual components (StoryBook):

```bash
npm run components
```

## Server

If you want to edit also the server you can install a live copy as:

```bash
pip install -e ../framework # points to the framework directory
```

## Documentation

Documentation is written in Livemark (see `livemark.yaml`). The source articles are in the `docs` directory. To start a live-reload server:

```bash
livemark start
```

## Project

Read configuration files to better understand the project:
- `package.json`
- `webpack.config.js`
- etc
