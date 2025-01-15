.PHONY: all docs install start

all:
	@grep '^\.PHONY' Makefile | cut -d' ' -f2- | tr ' ' '\n'

## Runs Astro dev server to serve documentation.
docs:
	cd portal && npm start

## Install application and documentation npm dependencies.
install:
	echo "This will install Python Dependencies."

## Runs the React client (:8080) and the Uvicorn server (:4040) concurrently.
start:
	echo "This will run the application."

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
