.PHONY: install dev build start test clean run

install:
	cd frontend && npm install

dev:
	cd frontend && npm run dev

build:
	cd frontend && npm run build

start:
	cd frontend && npm run start

run:
	./start.sh

test:
	cd frontend && npm run build

clean:
	rm -rf frontend/.next frontend/node_modules


