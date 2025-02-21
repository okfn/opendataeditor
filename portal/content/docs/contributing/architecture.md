---
title: Architecture
sidebar:
  order: 1
---

This document describes the architecture of the Open Data Editor project.

## Components


## Metadata


## Weaknesses Analysis

Here are the list of some potential weaknesses of the Open Data Editor architecture:

### Python Dependency

Historically, the project relied on the `frictionless-py` framework for all tabular data operations. Although `frictionless-py` is a battle-tested library it has its own limitations regarding performance, maintenance and, generally speaking, legacy approaches that are used in its data-processing and data-modelling architecture. Using `frictionless-py` also brings the whole Python environment to be installed and used for Open Data Editor to work properly. This is a significant limitation for the project as it makes the project less portable and more complex to set up. 

