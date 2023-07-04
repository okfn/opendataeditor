.PHONY: all list docs write install format lint server client start test components release version


VERSION := $(shell node -p -e "require('./package.json').version")


all: list

list:
	@grep '^\.PHONY' Makefile | cut -d' ' -f2- | tr ' ' '\n'

docs:
	hatch run docs

write:
	hatch run write

install:
	pip3 install hatch
	npm install

format:
	hatch run format
	npm run format

lint:
	hatch run lint
	npm run lint

server:
	hatch run start

client:
	npm run start

start:
	npx concurrently 'hatch run start' 'npm run start'

test:
	hatch run test
	npm run test

components:
	npm run component

release:
	git checkout main && git pull origin && git fetch -p
	@git log --pretty=format:"%C(yellow)%h%Creset %s%Cgreen%d" --reverse -20
	@echo "\nReleasing v$(VERSION) in 10 seconds. Press <CTRL+C> to abort\n" && sleep 10
	npm test && git commit -a -m 'v$(VERSION)' && git tag -a v$(VERSION) -m 'v$(VERSION)'
	git push --follow-tags

version:
	@echo $(VERSION)
