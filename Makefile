REPORTER = spec

test:
		@./node_modules/.bin/mocha \
			--reporter $(REPORTER) \
			./test/cortex-scaffold-generator.js

.PHONY: test
