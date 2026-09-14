.PHONY: help infra-up infra-down migrate seed api-dev api-build flutter-run admin-dev docs

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

## ---- Infrastructure ----

infra-up: ## Start MySQL + Redis via Docker
	docker compose up -d mysql redis

infra-down: ## Stop all services
	docker compose down

## ---- Database ----

migrate: ## Apply SQL migrations
	./scripts/migrate.sh

seed: ## Insert seed data
	./scripts/seed.sh

## ---- Backend (API) ----

api-dev: ## Run API in watch mode (http://localhost:3000)
	cd services/api/node_api && npm run dev

api-build: ## Build API for production
	cd services/api/node_api && npm run build

api-typecheck: ## TypeScript check
	cd services/api/node_api && npm run typecheck

api-test: ## Run API tests
	cd services/api/node_api && npm run test

## ---- Mobile (Flutter) ----

flutter-run: ## Run Flutter app
	cd apps/mobile/flutter_app && flutter run

flutter-test: ## Run Flutter tests
	cd apps/mobile/flutter_app && flutter test

## ---- Admin Web ----

admin-dev: ## Run admin web in watch mode (http://localhost:5173)
	cd apps/admin/web_admin && npm run dev

## ---- Docs ----

docs: ## Open Obsidian docs (docs/obsidian)
	@echo "Open docs/obsidian as a vault in Obsidian"