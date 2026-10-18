# Crazy Lineup

Ein Minigame für jeden aus der Klasse. Reines HTML/CSS/JS ohne Build:
`python3 -m http.server` im Ordner starten und `http://localhost:8000` öffnen.
Auf Render läuft es als Web Service: `node server.js` (kleiner Server ohne Abhängigkeiten,
siehe `render.yaml`) oder per Docker (`Dockerfile`, nginx).

## Minigames

| Person | Minigame | Stil |
|--------|----------|------|
| Matteo | Meinungen ablehnen – Kanzler Matteo stempelt fremde Meinungen ab | 2D-Pixel (Canvas) |
| Timo | Bootfahren – Flussfahrt zur blauen Stunde | 3D (three.js, Bloom) |
| Leon | Der lange Hals – Snacks im Klassenzimmer schnappen, ohne erwischt zu werden | 3D (three.js) |
| Omar | Sahara Express – mit dem Kamel Waren durch Marokko liefern, Wasser, Tag/Nacht, Sandstürme | 3D (three.js) |
| Mo | Ganz klein – Jump'n'Run/Escape-Room in 3 Levels: Schreibtisch, Bücherregal, unter der Tür durch | 2D-Pixel (Canvas) |
| Felix | Genosse Felix – als Chef der UdSSR alles aufessen, was kleiner ist, und wachsen: vom Brot bis zum Kreml | 3D (three.js) |
| Julian | Reagenzbecken – im Becherglas kraulen, Atome sammeln, Moleküle bauen; Natrium knallt, Ashley zieht ihn magisch an | 3D (three.js) |
| Damon & Moritz | Chaos-Dinner – die beiden auf einem Date: Fragen beantworten, Pannen abwenden, beide Herzen über drei Gänge oben halten | 2D-Pixel (Canvas) |
| Ecki | Ecki muss mal! – Laufspiel: springen, ducken, Kamillentee schnappen und rechtzeitig die einzige FREIE Toilette finden | 2D-Pixel (Canvas) |
| Philipp | Lernt nie (angeblich) – heimlich lernen, solange keiner der Jungs guckt; bei jedem Blick sofort chillen und „Digga, ich lern nie“ | 2D-Pixel (Canvas) |
| Saro | Goldmine Frankfurt – Klick-/Idle-Spiel: graben, Erze von Kupfer bis Aro-Kristall, Fake-Gangster-Business und Looksmaxx-Upgrades kaufen, Schatzi schnell antworten; Handy mit LooksMax (Mewing, Locken, Drip, Aura) und Mog-Offs gegen die ganze Klasse bis Boss Aro; Spielstand bleibt gespeichert | 2D-Pixel (Canvas) |

## Aufbau

| Datei | Inhalt |
|---|---|
| `js/app.js` | Menü (Gegenüberstellung) und Katalog; lädt die Skripte eines Spiels erst beim Start |
| `js/pixel.js` | Pixel-Sprites, 3x5-Pixelschrift, Soundeffekte, Speicher |
| `js/sprites.js` | Pixel-Charaktere der Klasse |
| `js/games/<id>.js` | Ein Minigame, registriert sich als `window.CLGames[id] = { start(root, onExit) }` |
| `js/modelle/` | 3D-Modelle aus Claude Design (`kamel.js`, `boot.js`) und `werkzeug.js` zum Zusammenfassen der Teile |
| `vendor/` | three.js r128 + Nachbearbeitung, Schriften (alle mit Lizenzdatei) |

## Neues Minigame hinzufügen

1. Pixel-Charakter in `js/sprites.js` ergänzen.
2. `js/games/<id>.js` anlegen; `start` gibt eine `stop()`-Funktion zurück.
3. Eintrag im Katalog in `js/app.js` mit `scripts` und `best` (localStorage-Schlüssel für den Rekord).
