#!/bin/bash

# Debugowanie
echo "Sprawdzanie środowiska przed konfiguracją:"
echo "Użytkownik: $(whoami)"
echo "Katalog domowy: $HOME"
echo "Początkowy PATH: $PATH"

# Załaduj nvm
[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"

# Aktywuj node
nvm use default || nvm use --lts || nvm use node

# Ustaw ścieżkę do npm
NPM_PATH="$HOME/.nvm/versions/node/$(node -v)/bin/npm"

# Sprawdź czy npm istnieje
if [ ! -f "$NPM_PATH" ]; then
    echo "BŁĄD: Nie znaleziono npm w: $NPM_PATH"
    exit 1
fi

echo "Używam npm z: $NPM_PATH"
echo "Node version: $(node -v)"
echo "$NPM_PATH -v"

cd package/planet-goals || exit 1
npm install
npm run build

cd ../backend || exit 1
docker compose down
npm install
docker compose --env-file .env build
docker compose --env-file .env up -d
