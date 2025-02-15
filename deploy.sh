#!/bin/bash

cd package/planet-goals
npm install
npm run build

cd ../backend
docker compose down
npm install
docker compose --env-file .env up -d
