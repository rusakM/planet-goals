#!/bin/bash


# Debugowanie
echo "Sprawdzanie środowiska przed konfiguracją:"
echo "Użytkownik: $(whoami)"
echo "Katalog domowy: $HOME"
echo "Początkowy PATH: $PATH"

# Załaduj nvm bezpośrednio (spróbuj różne możliwe lokalizacje)
[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"  # This loads nvm
[ -s "/root/.nvm/nvm.sh" ] && \. "/root/.nvm/nvm.sh"  # If running as root

# Debugowanie po załadowaniu nvm
echo "Sprawdzanie czy nvm jest dostępny:"
command -v nvm

# Jeśli nvm jest dostępny, użyj odpowiedniej wersji node
if command -v nvm &> /dev/null; then
    echo "NVM znaleziony, aktywuję node"
    nvm use default || nvm use --lts || nvm use node
else
    echo "BŁĄD: NVM nie jest dostępny!"
    echo "Sprawdź czy nvm jest zainstalowany w: $HOME/.nvm lub /root/.nvm"
    exit 1
fi

# Sprawdź czy npm jest dostępny
if ! command -v npm &> /dev/null; then
    echo "BŁĄD: npm nie jest dostępny mimo załadowania nvm!"
    echo "Aktualna ścieżka PATH: $PATH"
    exit 1
fi

cd package/planet-goals || exit 1
npm install
npm run build

cd ../backend || exit 1
docker compose down
npm install
docker compose --env-file .env build
docker compose --env-file .env up -d
