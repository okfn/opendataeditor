---
title: Architecture
sidebar:
  order: 1
---

This document describes the architecture of the Open Data Editor project.

## Components

High-level design of the Open Data Editor project is shown in the diagram below. The project consists of the following components:

- **Desktop**: The desktop app component is responsible for providing a desktop application for the Open Data Editor project.
- **Client**: The client component is responsible for rendering the user interface and sending requests to the server.
- **Server**: The server component is responsible for handling requests from the client and interacting with the file system, database, and local or remote services.

![Design](./assets/design.png)

### Desktop

The desktop component is built using the Electron framework. It provides a desktop application for the Open Data Editor project. The desktop component is responsible for starting the client and server components and managing their lifecycle, as well as environment management i.e. installing Python dependencies. This component is the tiniest part of the project and it is not required to be used for local development as the client and server components can be run independently.

The main technologies used in the client component are:

- TypeScript
- Electron
- Electron Builder

#### Components

The desktop component consists of the classical Electron architecture with the main process, renderer process, and context bridge:

##### Main Process

The main process is responsible for starting the client and server components and managing their lifecycle. It is also responsible for environment management i.e. installing Python dependencies. As in any Electron app, the main process is the entry point of the application and is responsible for creating the application window.

##### Renderer Process

The renderer process is responsible for rendering the user interface and sending requests to the server. It is built using React and communicates with the server using REST APIs.

##### Context Bridge

The context bridge is a feature of Electron that allows the renderer process to securely communicate with the main process. It is used to send messages between the renderer process and the main process. The only functionality that the client uses from the Electron native interfaces:

- getting a server port
- opening a project directory
- communicating fatal errors

#### Testing

Currently, the desktop component is not tested. The main reason for this is that the desktop component is a thin layer that starts the client and server components and does not contain any business logic. The client and server components are tested independently.

On the other hand, once [Bootstrap e2e testing](https://github.com/okfn/opendataeditor/issues/131) is setup it will be great to add at least some basic e2e coverage. The best case scinario would be having some unit testings as well for the main process and context bridge. In-general, the testing will require seting up a testing environment for the Electron app in different OS.

### Client

The client component is responsible for rendering the user interface and sending requests to the server. It is built using React and communicates with the server using REST APIs.

The main technologies used in the client component are:

- TypeScript
- React
- MaterialUI
- Zustand
- Inovua
- Monaco
- Leaflet
- Vega

#### Components

The client uses a component-based architecture. Each component is responsible for rendering a specific part of the user interface. The components are nested and have different level of abstraction. Most of high-level components uses `Zustand` for shared state management while low-level components are stateless or use local `React.useState` and `React.useEffect`.

Components that are required to have access to the server use the `Client` class singletone to access the server. The `Client` class is a wrapper around the `fetch` function that is used to send requests to the API. The `Client` class is responsible for providing client-side types information and error handling.

##### Application

> Application USE `Zustand` for shared state management

The `Application` component is the root component of the application. It is responsible for rendering the main layout of the application and managing the routing and controllers. The underlaying component are described in the sections belows and here is an examplar structure of the `Application` component for a tabular data source:

![Layout](./assets/layout.png)

##### Controllers

> Controllers usually USE `Zustand` for shared state management

In the `components/controllers` folder there are components that are responsible for rendering a full data source representation including all the underlaying editors, views, and parts. Controllers are split by the file type e.g.:

- table
- text
- chart
- etc

##### Editors

> Editors usually USE `Zustand` for shared state management

In the `components/Editors` folder there are components that are responsible for editing different data and metadata sources. It includes editors for tables, texts, Data Package metadata entities, and more.

##### Views

> Views usually DON'T USE `Zustand` for shared state management

In the `components/views` folder there are components that are responsible for rendering different data and metadata sources without an ability to edit the source. The most promenent example of a view is a `Report` that takes a [Frictionless Validation Report](https://framework.frictionlessdata.io/docs/framework/report.html) as one of the props and renders it to a visual representation.

##### Parts

> Parts usually DON'T USE `Zustand` for shared state management

In the `components/parts` folder there are components that are used in multiple places in the application. They are usually low-level components such as dialogs or buttons that are used to build more complex components. Parts are basically a application-specific library of components that mostly based on `MUI` primitives.

#### Testing

A testing system hasn't been set up yet. Here is a list of issue for hadnling it:

- [Bootstrap unit testing for client](https://github.com/okfn/opendataeditor/issues/130)
- [Bootstrap e2e testing](https://github.com/okfn/opendataeditor/issues/131)
- [Recover Storybooks](https://github.com/okfn/opendataeditor/issues/360)

### Server

The server component is responsible for handling requests from the client and interacting with the file system, database, and local or remote services. It is built using FastAPI and communicates with the client using REST APIs.

The main technologies used in the server component are:

- Python
- FastAPI
- SQLAlchemy
- TinyDB
- Frictionless
- OpenAPI

#### Components

##### Endpoints

##### Metadata

##### Database

##### Frictionless

##### OpenAPI

## Workflows

## Problems
