.PHONY: all build client dist docs format install lint release server start test version


VERSION := $(shell node -p -e "require('./package.json').version")


all:
	@grep '^\.PHONY' Makefile | cut -d' ' -f2- | tr ' ' '\n'

build:
	hatch run build
	npm run build

client:
	npm run start

dist:
	npm run dist

docs:
	cd portal && npm start

format:
	hatch run format
	npm run format

install:
	npm install

lint:
	hatch run lint
	npm run lint

release:
	git checkout main && git pull origin && git fetch -p
	@git log --pretty=format:"%C(yellow)%h%Creset %s%Cgreen%d" --reverse -20
	@echo "\nReleasing v$(VERSION) in 10 seconds. Press <CTRL+C> to abort\n" && sleep 10
	npm test && git commit -a -m 'v$(VERSION)' && git tag -a v$(VERSION) -m 'v$(VERSION)'
	git push --follow-tags --no-verify

server:
	hatch run start

start:
	npx concurrently 'hatch run start' 'npm run start'

test:
	hatch run test
	npm run test

version:
	@echo $(VERSION)
