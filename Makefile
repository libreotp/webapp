.PHONY: build

DOCKER_IMAGE := libreotp/webapp

build:
	docker build -t $(DOCKER_IMAGE) .
	docker build --target build -t $(DOCKER_IMAGE)/dev .

run:
	docker run -it --rm $(DOCKER_IMAGE)

dev:
	docker run -it --rm \
		--volume $(PWD):/app/dev/ \
		--workdir /app/dev/ \
		--publish 3000:3000 \
		--entrypoint sh $(DOCKER_IMAGE)/dev