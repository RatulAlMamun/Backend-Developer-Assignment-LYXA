.PHONY: up start stop down logs auth product rabbitmq clean rebuild

up:
	docker-compose up --build --detach

start:
	docker-compose up --detach

stop:
	docker-compose stop

down:
	docker-compose down

logs:
	docker-compose logs -f

auth:
	docker-compose exec auth-service sh

auth-logs:
	docker-compose logs --follow auth-service

product:
	docker-compose exec product-service sh

product-logs:
	docker-compose logs --follow product-service

clean:
	docker-compose down -v --remove-orphans

