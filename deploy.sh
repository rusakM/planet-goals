#!/bin/bash

set -e

show_usage() {
    echo "Użycie: $0 --env <PROD|TEST> --authkey abcd"
    echo "Przykład: $0 --env PROD --authkey abcd"
    exit 1
}

# Parsowanie parametrów
ENVIRONMENT=""
AUTHKEY=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --env) ENVIRONMENT="$2"; shift ;;
        --authkey) AUTHKEY="$2"; shift ;;
        *) echo "Nieznany parametr: $1"; show_usage ;;
    esac
    shift
done

if [[ -z "$ENVIRONMENT" ]]; then
    echo "Błąd: Nie podano środowiska"
    show_usage
fi

if [[ "$ENVIRONMENT" != "PROD" && "$ENVIRONMENT" != "TEST" ]]; then
    echo "Błąd: Nieprawidłowe środowisko. Dozwolone wartości: PROD lub TEST"
    show_usage
fi

if [[ "$ENVIRONMENT" == "PROD" ]]; then
    DEPLOY_PATH="/var/app/planet-goals/prod"
else
    DEPLOY_PATH="/var/app/planet-goals/test"
fi

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
rm -rf "$DEPLOY_PATH"
cp -r dist "$DEPLOY_PATH"
chown -R www-data "$DEPLOY_PATH"

cd ../backend || exit 1
docker compose down
npm install
docker compose --env-file .env build
docker compose --env-file .env up -d

#pobranie tłumaczeń
if [[ -z "$AUTHKEY" ]]; then
    echo "Błąd: Nie podano środowiska"
    show_usage
fi

cd ../..
echo "Pobieranie tłumaczeń..."
curl --location 'https://pgtranslate.toadres.pl/v2/projects/34/export?format=JSON' --header "Accept: application/json" --header "x-api-key: $AUTHKEY" -o "translations.zip"
rm /var/app/planet-goals/translations/translations/*
echo "Rozpakowywanie pliku..."
unzip -o translations.zip -d /var/app/planet-goals/translations/translations
rm translations.zip
