include .env

install:
	@$(MAKE) -s down
	@$(MAKE) -s docker-build

docker-build: \
	docker-build-nginx \

up:
	@docker-compose up -d ${NGINX_CONTAINER_NAME}

down:
	@docker-compose down --remove-orphans

restart: down up

docker-build-nginx:
	@docker build -t ${REGISTRY}/${NGINX_CONTAINER_NAME}:${IMAGE_TAG} ./docker/nginx

docker-logs:
	@docker-compose logs -f