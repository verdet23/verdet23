# Executables (local)
DOCKER_COMP = docker-compose

# Docker containers
CONT = $(DOCKER_COMP) exec gh_pages
#Misc
.DEFAULT_GOAL = help

.PHONY: help js-lint html-lint json-lint lint
.PHONY: build up down sh

help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Project 🐳 ————————————————————————————————————————————————————————————————

js-lint: ## Lint JS
	eslint "js/*.js" --ext .js

html-validate: ## Validate HTML
	html5validator --config html5validation.yml

json-validate: ## Validate JSON files by schema
	ajv validate -s data/schema/data.json -d data/*.json

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
build: ## Builds the Docker images
	@$(DOCKER_COMP) -f docker-compose.yml build --pull --no-cache

up: ## Start the docker hub
	@$(DOCKER_COMP) -f docker-compose.yml up -d

down: ## Stop the docker hub
	@$(DOCKER_COMP) down --remove-orphans

sh: ## Connect to the PHP FPM container
	@$(CONT) sh
