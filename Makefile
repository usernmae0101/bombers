OS := $(shell uname)

# TARGET
# ------------------------------
# run-dev: [client|app-server|game-server|mongo]
# build: [application|game-server]
# ------------------------------

run-dev:
ifeq ($(TARGET), mongo)
	docker run --rm --name mongo -p 27017:27017 mongo
else 
ifeq ($(TARGET), client)
	bin/copy-assets
endif
	npm run dev:$(TARGET)
endif

install:
	chmod +x bin/copy-assets && \
		bin/copy-assets

	$(if $(findstring Linux,$(OS)), sudo) \
		npm install --global yarn
	
	yarn && yarn install
	
build:
	docker-compose -f ./docker/docker-compose-$(TARGET).yml up -d --build
