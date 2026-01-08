# Variables
DOCKER_REPO := ghcr.io/qnton
DOCKER_TAG := latest

# Docker commands
docker-build:
	DOCKER_BUILDKIT=0 docker build --platform linux/amd64	 -t otterbot:$(DOCKER_TAG) -f dockerfile .

docker-push:
	docker tag otterbot:$(DOCKER_TAG) $(DOCKER_REPO)/otterbot:$(DOCKER_TAG)
	docker push $(DOCKER_REPO)/otterbot:$(DOCKER_TAG)

push: docker-build docker-push

clean:
	docker rmi otterbot:$(DOCKER_TAG)