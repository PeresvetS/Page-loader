install: 
	npm install

run:
	npm run babel-node -- src/bin/pageLoader.js $(1)

build:
		rm -rf dist
		npm run build

publish:
	npm publish

lint:
	npm run eslint -- src/ __tests__

test:
		npm test

.PHONY: test
