#!/bin/bash

# Załaduj zmienne środowiskowe użytkownika
source ~/.bashrc

# Użyj nvm jeśli jest zainstalowany
if [ -f ~/.nvm/nvm.sh ]; then
    source ~/.nvm/nvm.sh
    nvm use node || nvm use default
fi

# Sprawdź czy npm jest dostępny
if ! command -v npm &> /dev/null; then
    echo "npm nie jest dostępny. Sprawdź instalację Node.js"
    exit 1
fi

# Wyświetl wersje dla celów diagnostycznych
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

cd package/planet-goals || exit 1
npm install
npm run build

cd ../backend || exit 1
docker compose down
npm install
docker compose --env-file .env build
docker compose --env-file .env up -d
