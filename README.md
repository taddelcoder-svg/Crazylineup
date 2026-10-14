# Crazy Lineup

Ein Minigame für jeden aus der Klasse. Reines HTML/CSS/JS ohne Build:
`python3 -m http.server` im Ordner starten und `http://localhost:8000` öffnen.
Auf Render läuft es als Docker-Dienst (nginx, siehe `Dockerfile`).

## Minigames

| Person | Minigame | Stil |
|--------|----------|------|
| Matteo | Meinungen ablehnen – Kanzler Matteo stempelt fremde Meinungen ab | 2D-Pixel (Canvas) |
| Timo | Bootfahren – Flussfahrt zur blauen Stunde | 3D (three.js, Bloom) |
| Leon | Der lange Hals – Snacks im Klassenzimmer schnappen, ohne erwischt zu werden | 3D (three.js) |
| Mo | Ganz klein – Jump'n'Run/Escape-Room in 3 Levels: Schreibtisch, Bücherregal, unter der Tür durch | 2D-Pixel (Canvas) |

## Aufbau

| Datei | Inhalt |
|---|---|
| `js/app.js` | Menü (Gegenüberstellung) und Katalog; lädt die Skripte eines Spiels erst beim Start |
| `js/pixel.js` | Pixel-Sprites, 3x5-Pixelschrift, Soundeffekte, Speicher |
| `js/sprites.js` | Pixel-Charaktere der Klasse |
| `js/games/<id>.js` | Ein Minigame, registriert sich als `window.CLGames[id] = { start(root, onExit) }` |
| `vendor/` | three.js r128 + Nachbearbeitung, Schriften (alle mit Lizenzdatei) |

## Neues Minigame hinzufügen

1. Pixel-Charakter in `js/sprites.js` ergänzen.
2. `js/games/<id>.js` anlegen; `start` gibt eine `stop()`-Funktion zurück.
3. Eintrag im Katalog in `js/app.js` mit `scripts` und `best` (localStorage-Schlüssel für den Rekord).
