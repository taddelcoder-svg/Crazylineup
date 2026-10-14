# Crazy Lineup

Ein Minigame für jeden aus der Klasse. Reines HTML/CSS/JS, kein Build nötig:
`index.html` im Browser öffnen oder z. B. `python3 -m http.server` starten.

## Minigames

| Person | Minigame |
|--------|----------|
| Matteo | Meinungen ablehnen |
| Timo | Bootfahren |

## Neues Minigame hinzufügen

1. Datei `js/minigames/<name>.js` anlegen und `window.Minigames.push({ id, person, title, blurb, start(root, onExit) })` aufrufen. `start` gibt eine `stop()`-Funktion zurück.
2. Das Script in `index.html` vor `js/app.js` einbinden.
