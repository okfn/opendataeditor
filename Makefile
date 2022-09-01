.PHONY: all list release version


VERSION := $(shell node -p -e "require('./package.json').version")
LEAD := $(shell head -n 1 LEAD.md)


all: list

list:
	@grep '^\.PHONY' Makefile | cut -d' ' -f2- | tr ' ' '\n'

install:
	pip install -r requirements.txt
	npm install

release:
	git checkout main && git pull origin && git fetch -p
	@git log --pretty=format:"%C(yellow)%h%Creset %s%Cgreen%d" --reverse -20
	@echo "\nReleasing v$(VERSION) in 10 seconds. Press <CTRL+C> to abort\n" && sleep 10
	npm test && git commit -a -m 'v$(VERSION)' && git tag -a v$(VERSION) -m 'v$(VERSION)'
	git push --follow-tags

version:
	@echo $(VERSION)
