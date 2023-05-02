# Makefile for building a Docker image locally and for GCP

# Docker image settings
IMAGE_NAME = archive-service
TAG = latest

# Google Cloud settings
GCP_PROJECT_ID = ${GOOGLE_PROJECT}
GCR_HOSTNAME = gcr.io
GCR_IMAGE_PATH = $(GCR_HOSTNAME)/$(GCP_PROJECT_ID)/$(IMAGE_NAME)

.PHONY: compile build run--local run--docker

compile:
	npx tsc

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

run--local: compile
	node dist/index.js

run--docker: build
	docker run \
		-p 8080:8080 \
		--pid=host \
		-e NOTION_API_KEY=${NOTION_API_KEY} \
		-e NOTION_DATABASE_ID=${NOTION_DATABASE_ID} \
		$(IMAGE_NAME):$(TAG)
