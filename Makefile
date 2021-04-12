OS := $(shell uname)

run-dev:
ifeq ($(TARGET), mongo)
	docker run --rm --name mongo -p 27017:27017 mongo
else 
	npm run dev:$(TARGET)
endif

install:
	$(if $(findstring Linux,$(OS)), sudo) npm install --global yarn

	yarn && yarn install && cd packages/client && npm i colyseus.js
	