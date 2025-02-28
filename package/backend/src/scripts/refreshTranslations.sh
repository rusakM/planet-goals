#!/bin/bash

set -e

show_usage() {
    echo "Użycie: $0 --authkey abcd"
    exit 1
}

AUTHKEY=""
CATALOGLOCATION=""
while [ "$#" -gt 0 ]; do
    case $1 in
        --authkey) AUTHKEY="$2"; shift ;;
        --location) CATALOGLOCATION="$2"; shift ;;
        *) echo "Nieznany parametr: $1"; show_usage ;;
    esac
    shift
done

echo "Pobieranie tłumaczeń..."
echo "$CATALOGLOCATION"
echo "$AUTHKEY"
curl --location 'https://pgtranslate.toadres.pl/v2/projects/34/export?format=JSON' --header "Accept: application/json" --header "x-api-key: $AUTHKEY" -o "translations.zip"
ls -lah "$CATALOGLOCATION"
rm "$CATALOGLOCATION"/*
echo "Rozpakowywanie pliku..."
unzip -o translations.zip -d "$CATALOGLOCATION"
rm translations.zip
