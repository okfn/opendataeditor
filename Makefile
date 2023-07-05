.PHONY: all build client components docs format install lint list release server start test version write


VERSION := $(shell node -p -e "require('./package.json').version")


all: list

build:
	npm run build

client:
	npm run start

components:
	npm run component

docs:
	hatch run docs

format:
	hatch run format
	npm run format

install:
	npm install

lint:
	hatch run lint
	npm run lint

list:
	@grep '^\.PHONY' Makefile | cut -d' ' -f2- | tr ' ' '\n'

release:
	git checkout main && git pull origin && git fetch -p
	@git log --pretty=format:"%C(yellow)%h%Creset %s%Cgreen%d" --reverse -20
	@echo "\nReleasing v$(VERSION) in 10 seconds. Press <CTRL+C> to abort\n" && sleep 10
	npm test && git commit -a -m 'v$(VERSION)' && git tag -a v$(VERSION) -m 'v$(VERSION)'
	git push --follow-tags

server:
	hatch run start

start:
	npx concurrently 'hatch run start' 'npm run start'

test:
	hatch run test
	npm run test

version:
	@echo $(VERSION)

write:
	hatch run write
