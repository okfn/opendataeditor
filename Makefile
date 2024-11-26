.PHONY: all build client desktop dist docs format install lint preview release server start test type version


VERSION := $(shell node -p -e "require('./package.json').version")


all:
	@grep '^\.PHONY' Makefile | cut -d' ' -f2- | tr ' ' '\n'

build:
	hatch run build
	npm run build

## Runs the React client in isolation (:8080)
client:
	npm run start

## Runs the Electron application with live reload (requires a running server).
desktop:
	npm run desktop

## Runs electron-builder to package and build a ready for distribution app.
dist:
	npm run dist

## Runs Astro dev server to serve documentation.
docs:
	cd portal && npm start

## Runs ruff linter (including imports), ruff formater, prettier and eslint.
format:
	hatch run format
	npm run format

## Install application and documentation npm dependencies.
install:
	npm install
	cd portal && npm install

## Checks ruff linter (including imports), ruff formater, prettier and eslint.
lint:
	hatch run lint
	npm run lint

## Runs the Electron application with live reload (requires a running server).
preview:
	npm run preview

## Runs electron-builder to release the app.
release:
	npm run release

## Runs the FastAPI server in isolation (:4040).
server:
	hatch run start

## Runs the React client (:8080) and the Uvicorn server (:4040) concurrently.
start:
	npx concurrently 'hatch run start' 'npm run start'

## Runs the whole suit of tests for server and client.
test:
	hatch run test
	npm run test

## Runs the E2E suite of tests (requires make dist for an application bundle)
test-e2e:
	npm run wdio

## Checks types with pyright and typescript
type:
	hatch run type
	npm run type

version:
	@echo $(VERSION)


## Show help
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)
TARGET_MAX_CHAR_NUM := 20

help:
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
	  helpMessage = match(lastLine, /^## (.*)/); \
	  if (helpMessage) { \
	    helpCommand = substr($$1, 0, index($$1, ":")-1); \
	    helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
	    printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
	  } \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
