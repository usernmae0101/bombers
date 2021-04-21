OS := $(shell uname)

run-dev:
ifeq ($(TARGET), mongo)
	docker run --rm --name mongo -p 27017:27017 mongo
else 
	npm run dev:$(TARGET)
endif

install:
	$(if $(findstring Linux,$(OS)), sudo) npm install --global yarn
	
	# cd pack... is not necessary
	# idk why, but colyseus.js is not installed via yarn
	# IDE bug maybe, but anyway
	yarn && yarn install && cd packages/client && npm i colyseus.js
	
build:
	docker-compose up -d --build
