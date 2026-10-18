// Saro: Goldmine Frankfurt – Klick-/Idle-Spiel (2D-Pixel).
// Saro erzählt, er geht in Frankfurt Gold graben. Hier beweist er es: Klicken/Tippen/Leertaste = graben.
// Para ausgeben für Crew, Business und Upgrades (Möchtegern-Gangster, Fake-Looksmaxxing, Schatzi).
// Schacht vertiefen schaltet neue Erze frei. Schatzi schreibt zwischendurch: antippen, sonst Eifersucht.
// Der Spielstand bleibt gespeichert (auch offline wird weitergegraben); Rekord = tiefste Sohle in Metern.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.saro.best', SAVE_KEY = 'crazylineup.saro.spiel';
  // Bühne 130 breit (passt auf 390-px-Handys dreifach): Schacht links, Stollen, Erzwand rechts
  var SW0 = 130, SH0 = 122, GRAS = 30, DECKE = 80, BODEN = 112, SCH = 4, TL = 13, SX = 58, WAND = 80;

  var ERZE = [
    { id: 'kies', name: 'Main-Kies', wert: 1, sohle: 0, farbe: '#c8c0b0', text: 'Glitzert ein bisschen. Zählt.' },
    { id: 'kohle', name: 'Kohle', wert: 4, sohle: 0, farbe: '#141418', text: 'Kohle ist Kohle, Bruder.' },
    { id: 'kupfer', name: 'Kupfer', wert: 15, sohle: 1, farbe: '#e8843a', text: 'Wie Gold. Nur in Braun.' },
    { id: 'eisen', name: 'Eisen', wert: 50, sohle: 2, farbe: '#a8b4c4', text: 'Wird zur Hantelscheibe. Für die Spiegel-Selfies.' },
    { id: 'silber', name: 'Silber', wert: 180, sohle: 3, farbe: '#f4f8fc', text: 'Endlich eine Kette, die nicht grün abfärbt.' },
    { id: 'gold', name: 'Gold', wert: 700, sohle: 4, farbe: '#ffd23f', text: 'ER HATTE RECHT. Gold in Frankfurt. Irgendwie.' },
    { id: 'pyrit', name: 'Katzengold', wert: 6, sohle: 4, farbe: '#b8a048', gewicht: 1.5, text: 'Saro: „Echtes Gold, schwör.“ Ist es nicht.' },
    { id: 'smaragd', name: 'Grüne-Soße-Smaragd', wert: 2600, sohle: 5, farbe: '#3ad87a', text: 'Sieben Kräuter, ein Edelstein. Frankfurter Spezialität.' },
    { id: 'bernstein', name: 'Ebbelwoi-Bernstein', wert: 10000, sohle: 6, farbe: '#f0a020', text: 'Riecht leicht nach Sachsenhausen.' },
    { id: 'diamant', name: 'Diamant', wert: 40000, sohle: 7, farbe: '#a8f4ff', text: 'Einer für den Grill, einer für Schatzi.' },
    { id: 'barren', name: 'Bundesbank-Barren', wert: 160000, sohle: 8, farbe: '#ffe070', text: 'Lag da einfach so rum. Ehrlich.' },
    { id: 'aro', name: 'Aro-Kristall', wert: 700000, sohle: 9, farbe: '#d24af0', text: 'Aro sagt, der gehört eigentlich ihm.' }
  ];
  var SOHLEN = [
    { m: 10, preis: 0, fels: '#8a6a4a' }, { m: 60, preis: 150, fels: '#7a5a40' }, { m: 150, preis: 2000, fels: '#6a5a52' },
    { m: 300, preis: 25000, fels: '#5a5a66' }, { m: 500, preis: 300000, fels: '#6a5232' }, { m: 800, preis: 4e6, fels: '#3e5240' },
    { m: 1200, preis: 5e7, fels: '#6a4022' }, { m: 1800, preis: 7e8, fels: '#34344a' }, { m: 2500, preis: 1e10, fels: '#4a3030' },
    { m: 3333, preis: 1.5e11, fels: '#2e2040' }
  ];
  var LETZTE = SOHLEN.length - 1;

  // Crew & Business: graben automatisch (Para/s), Preis steigt pro Stück um 15 %
  var PROD = [
    { id: 'selfie', ic: '🤳', name: 'Spiegel-Selfie', preis: 15, pps: 0.1, text: 'Kinn hoch, Licht von oben. Jedes Like = Para.',
      up: [['Ringlicht', 'Jawline wie gemeißelt. (Filter.)'], ['Filter „Natural Look“', 'Kein Filter, schwört er. Drei Filter.']] },
    { id: 'cousin', ic: '⛏️', name: 'Kleiner Cousin', preis: 100, pps: 1, text: 'Gräbt für einen Döner am Tag.',
      up: [['Döner mit alles', 'Satte Cousins graben doppelt.'], ['Cousin-Gruppenchat', 'Einer schreibt, zwölf kommen.']] },
    { id: 'story', ic: '🗣️', name: 'Pausen-Story', preis: 1100, pps: 8, text: '„Ich war gestern Gold graben in Frankfurt.“ Irgendwer glaubt es.',
      up: [['Story mit Beweisfoto', 'Unscharf. Aus Google. Wirkt aber.'], ['Highlight „FFM GOLD“', 'Jetzt fest angepinnt im Profil.']] },
    { id: 'rolex', ic: '⌚', name: 'Fake-Rolex-Stand', preis: 12000, pps: 47, text: 'Original, Bruder. Steht doch drauf: ROLLEX.',
      up: [['ROLLEX mit Doppel-L', 'Markenrechtlich unangreifbar.'], ['Echtheits-Zertifikat', 'Gestempelt von „Swiss Uhren GmbH, Offenbach“.']] },
    { id: 'coach', ic: '🗿', name: 'Looksmaxx-Coaching', preis: 130000, pps: 260, text: 'Mewing-Kurs für 99,99 €. Ergebnis: Nackenschmerzen.',
      up: [['Vorher/Nachher-Fotos', 'Nachher: gleiches Foto, anderes Licht.'], ['Looksmaxx-Podcast', 'Drei Stunden über Kieferknochen.']] },
    { id: 'barber', ic: '💈', name: 'Barbershop am Main', preis: 1.4e6, pps: 1400, text: 'Locken-Definition, Augenbrauen-Schlitz, Gesichtsmaske.',
      up: [['Lockenkur Deluxe', 'Jede Locke einzeln definiert.'], ['Doppelter Augenbrauen-Schlitz', 'Doppelt geschlitzt = doppelt Gangster.']] },
    { id: 'aro', ic: '🐻', name: 'Aros Berlin-Connection', preis: 2e7, pps: 7800, text: 'Großer Bruder in Berlin. Ober-Gangster. Angeblich kennt er jeden.',
      up: [['Wochenende bei Aro', 'Aro holt ihn am Bahnhof ab. Angeblich im Bentley.'], ['Aros Kontakte', 'Kennt einen, der mal neben einem Rapper geparkt hat.']] },
    { id: 'boerse', ic: '📈', name: 'Frankfurter Börse', preis: 3.3e8, pps: 44000, text: 'Saro schreit „KAUFEN!“ in den Handelssaal.',
      up: [['Gold-Telegram-Gruppe', 'Signal: immer KAUFEN.'], ['Saro-Coin', 'Ein Krypto-Bruder hat ihn programmiert. Steigt nur.']] },
    { id: 'paar', ic: '💑', name: 'Pärchen-Imperium', preis: 5.1e9, pps: 260000, text: 'Gemeinsamer Insta-Account, Partnerlook, gemeinsame Mine.',
      up: [['Pärchen-Podcast', 'Thema jeder Folge: wir zwei.'], ['Gemeinsames Konto', 'Ihr Name steht zuerst.']] }
  ];

  // Einmal-Upgrades: k = Klick ×, a = Klick +Anteil der Para/s, herz* = Schatzi-Effekte
  var UPGS = [
    { id: 'hacke', ic: '⛏️', name: 'Spitzhacke vom Baumarkt', preis: 100, eff: 'Klick ×2', text: 'Vorher hat er mit dem Handy gegraben.', k: 2, wann: function (g) { return g.klicks >= 15; } },
    { id: 'kette', ic: '📿', name: 'Goldkette (Fake)', preis: 1000, eff: 'Klick ×2', text: 'Glänzt wie echt. Messing. Färbt grün ab.', k: 2, wann: function (g) { return g.gesamt >= 400; } },
    { id: 'mewing', ic: '😤', name: 'Mewing beim Graben', preis: 12000, eff: 'Klick +1 % der Para/s', text: 'Zunge an den Gaumen, Kinn raus, Hacke runter.', a: 0.01, wann: function (g) { return g.tiefe >= 2; } },
    { id: 'gym', ic: '💪', name: 'Gym-Selfie-Arme', preis: 150000, eff: 'Klick ×3', text: 'Nur Bizeps. Beine sind optional.', k: 3, wann: function (g) { return g.gesamt >= 50000; } },
    { id: 'brille', ic: '🕶️', name: 'Sonnenbrille unter Tage', preis: 2e6, eff: 'Klick +2 % der Para/s', text: 'Sieht nichts mehr. Sieht aber gut aus.', a: 0.02, wann: function (g) { return g.tiefe >= 4; } },
    { id: 'grillz', ic: '😁', name: 'Grillz (Zirkonia)', preis: 6e7, eff: 'Klick ×5', text: 'Jedes Lächeln blendet die halbe Mine.', k: 5, wann: function (g) { return g.gesamt >= 2e7; } },
    { id: 'hustle', ic: '⏰', name: 'Hustler-Mindset', preis: 2e9, eff: 'Klick +3 % der Para/s', text: 'Aufstehen um 5. Posten um 5:01.', a: 0.03, wann: function (g) { return g.gesamt >= 5e8; } },
    { id: 'name', ic: '📱', name: 'Ihr Name als Hintergrund', preis: 5000, eff: 'Schatzi schreibt öfter', text: 'Und als Sperrbildschirm. Und als Klingelton.', herzOft: true, wann: function (g) { return g.herzen >= 1; } },
    { id: 'ring', ic: '💍', name: 'Pärchen-Ring vom Kiosk', preis: 300000, eff: 'Klebe-Modus dauert doppelt', text: '4,99 €. Verfärbt den Finger. Für immer.', klebeLang: true, wann: function (g) { return g.herzen >= 3; } },
    { id: 'hand', ic: '🤝', name: 'Händchenhalten 24/7', preis: 3e7, eff: 'Herz-Belohnungen ×2, sie ist immer dabei', text: 'Beide Hände belegt. Gegraben wird mit dem Kinn.', herzX: 2, immer: true, wann: function (g) { return g.herzen >= 6; } },
    { id: 'medaillon', ic: '🧿', name: 'Ihr Selfie im Kettenanhänger', preis: 1e9, eff: 'Keine Eifersucht mehr', text: 'Sie ist jetzt immer dabei. Immer.', keineEifer: true, wann: function (g) { return g.herzen >= 10; } }
  ];
  PROD.forEach(function (p) {
    UPGS.push({ id: p.id + '1', ic: p.ic, name: p.up[0][0], preis: p.preis * 15, eff: p.name + ' ×2', text: p.up[0][1], p: p.id, wann: function (g) { return (g.prod[p.id] || 0) >= 3; } });
    UPGS.push({ id: p.id + '2', ic: p.ic, name: p.up[1][0], preis: p.preis * 400, eff: p.name + ' ×2', text: p.up[1][1], p: p.id, wann: function (g) { return (g.prod[p.id] || 0) >= 20; } });
  });

  var SPRUECHE = ['Gold graben in Frankfurt, Digga. Ganz normal.', 'Mein Bruder Aro kennt jeden in Berlin.', 'Natural, Bruder. Kein Filter.', 'Ich bin basically schon Millionär.',
    'Jawline wie ein Diamant.', 'Muss gleich zu Aro nach Berlin. Business.', 'Schatzi, ich grab nur kurz.', 'Die Kette ist echt. Fass nicht an.',
    'Ich hab Connections, Bruder.', 'Mewing seit drei Wochen. Sieht man, oder?', 'Ich und Schatzi – unzertrennlich.', 'Locken sitzen. Auch unter Tage.',
    'Wenn Aro das sieht …', 'Gangster graben selber, Bruder.'];
  var NACHRICHTEN = ['„wo bist du 🥺“', '„vermiss dich“', '„ruf mich an!!“', '„wer ist die im Stollen?!“', '„Partnerlook morgen?“', '„bist du noch unter Tage?“', '„antworte 😤“'];
  // Handy-App LooksMax: vier Looks-Werte (Level 0–10), jedes Level gibt +3 % auf alles
  var LOOKS = [
    { id: 'jaw', ic: '🗿', name: 'Jawline', app: 'Mewing', text: 'Zunge an den Gaumen. Kinn raus. Nicht reden.',
      ok: ['Kinnlinie +1. Im richtigen Licht.', 'Man könnte damit Brot schneiden. Fast.'], fail: ['Kiefer verkrampft.', 'Zu doll gemewt – Zunge eingeschlafen.'] },
    { id: 'locken', ic: '🌀', name: 'Locken', app: 'Lockenpflege', text: 'Curl-Cream, Diffusor, 45 Minuten im Bad.',
      ok: ['Jede Locke sitzt.', 'Locken-Definition: Hollywood.'], fail: ['Frizz. Überall Frizz.', 'Diffusor zu heiß. Riecht verbrannt.'] },
    { id: 'drip', ic: '🧥', name: 'Drip', app: 'Drip-Check', text: 'Neue Fits. „Original“ vom Flohmarkt in Offenbach.',
      ok: ['Fit sitzt. Preis: geheim.', 'Sieht teuer aus. War es nicht.'], fail: ['Das Logo ist falsch rum.', '„Guci“ mit einem C.'] },
    { id: 'aura', ic: '✨', name: 'Aura', app: 'Aura farmen', text: 'Sigma-Blick im Spiegel üben. 200 Mal.',
      ok: ['Aura +1000. Angeblich.', 'Der Spiegel hat weggeschaut.'], fail: ['Hat gelacht. Aura weg.', 'Schatzi hat reingeguckt.'] }
  ];
  // Handy-App Mog-Off: der Reihe nach gegen die Klasse, am Ende Aro. s = Looks-Level [Jawline, Locken, Drip, Aura]
  var GEGNER = [
    { id: 'mo', name: 'Mo', s: [1, 1, 1, 3], spr: function () { return Sprites.mo('steh'); },
      intro: 'Ich bin 3 cm groß. Du siehst mich gar nicht.', verliert: 'Von hier unten sieht halt alles groß aus.', gewinnt: 'Klein, aber moggt.' },
    { id: 'matteo', name: 'Matteo', s: [2, 2, 3, 3], spr: function () { return Sprites.matteo('angry'); },
      intro: 'Ich lehne dein Gesicht ab.', verliert: 'Abgelehnt … meine eigene Niederlage.', gewinnt: 'Antrag auf Aura: ABGELEHNT.' },
    { id: 'ecki', name: 'Ecki', s: [2, 3, 3, 3], spr: function () { return Sprites.ecki('steh'); },
      intro: 'Schnell, ich muss gleich aufs Klo.', verliert: 'Egal, ich muss eh los!', gewinnt: 'Gemoggt. Und jetzt Klo.' },
    { id: 'philipp', name: 'Philipp', s: [3, 4, 4, 4], spr: function () { return Sprites.philipp('cool'); },
      intro: 'Digga, ich mogge nie. Angeblich.', verliert: 'Hab eh nicht geübt.', gewinnt: 'Hab null geübt. Ehrlich.' },
    { id: 'timo', name: 'Timo', s: [4, 5, 4, 5], spr: function () { return Sprites.timo('happy'); },
      intro: 'Chill, Bro. Ich mogge auch bei 40 Knoten.', verliert: 'Alles entspannt, Bro.', gewinnt: 'Der Kapitän moggt immer.' },
    { id: 'julian', name: 'Julian', s: [5, 4, 5, 6], spr: function () { return Sprites.julian(); },
      intro: 'Mein Gesicht ist chemisch ausbalanciert.', verliert: 'Reaktion fehlgeschlagen.', gewinnt: 'Ashley hat für mich abgestimmt.' },
    { id: 'omar', name: 'Omar', s: [6, 6, 5, 6], spr: function () { return Sprites.omar('happy'); },
      intro: 'Selbst mein Kamel moggt dich.', verliert: 'Das Kamel ist enttäuscht.', gewinnt: 'Lieferung zugestellt: eine Niederlage.' },
    { id: 'felix', name: 'Felix', s: [6, 5, 7, 7], spr: function () { return Sprites.felix(); },
      intro: 'Im Kommunismus gehört deine Jawline allen.', verliert: 'Das Volk hat entschieden …', gewinnt: 'Genosse, du bist gemoggt.' },
    { id: 'doppeldate', name: 'Damon & Moritz', s: [7, 7, 7, 7], spr: function () { return Sprites.doppeldate(); },
      intro: 'Zwei gegen einen, Bruder.', verliert: 'Okay, zurück zum Date.', gewinnt: 'Doppelt gemoggt.' },
    { id: 'leon', name: 'Leon', s: [8, 7, 7, 8], spr: function () { return Sprites.leon('happy'); },
      intro: '1,95 m. Ich mogge dich von oben.', verliert: 'Von hier oben sah das anders aus.', gewinnt: 'Längerer Hals, längere Aura.' },
    { id: 'aro', name: 'Aro (Boss)', s: [9, 9, 9, 10], spr: function () { return Sprites.aro(); },
      intro: 'Kleiner Bruder … du willst MICH moggen?', verliert: 'Respekt, Kleiner. Berlin ist stolz.', gewinnt: 'Komm wieder, wenn du Bart hast.' }
  ];
  var MOG_SIEG = ['Kinn hoch, Licht von oben.', 'Die Locken haben entschieden.', 'Filter auf Maximum.', 'Aura: unfassbar (sagt er).'];
  var MOG_NIEDERLAGE = ['Filter war aus.', 'Licht von unten. Fatal.', 'Locken sitzen nicht.', 'Schatzi findet ihn trotzdem gut.'];
  var SKYLINE = [[2, 8, 10], [11, 6, 14], [18, 10, 22, 'messe'], [30, 7, 12], [38, 9, 18, 'antenne'], [49, 6, 9], [56, 11, 24, 'antenne'], [69, 7, 13],
    [78, 8, 16], [88, 6, 10], [96, 10, 20, 'messe'], [108, 7, 11], [117, 9, 15, 'antenne'], [128, 6, 8], [136, 10, 17], [148, 8, 12]];

  var CSS = [
    '.sa{position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;background:#120e18;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none}',
    '.sa-szene{position:relative;flex:0 0 48%;min-height:0;overflow:hidden;cursor:pointer;touch-action:manipulation}',
    '.sa canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.sa-shop{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;touch-action:pan-y;background:#1e1a26;border-top:4px solid #000;',
    ' padding:10px 10px calc(18px + env(safe-area-inset-bottom))}',
    '@media (min-width:760px) and (min-aspect-ratio:1/1){.sa{flex-direction:row}.sa-szene{flex:1}.sa-shop{flex:0 0 min(420px,42vw);border-top:0;border-left:4px solid #000;padding-top:calc(10px + env(safe-area-inset-top))}}',
    '.sa-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.sa-top button{pointer-events:auto}',
    '.sa-hud{flex:1;text-align:center;padding:0 8px;text-shadow:2px 2px 0 #000}',
    '.sa-hud b{display:block;font:clamp(13px,3.6vw,20px)/1.2 "Press Start 2P",monospace;color:#ffd23f}',
    '.sa-hud small{display:block;font-size:15px;margin-top:3px}',
    '.sa-buff{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-top:4px}',
    '.sa-buff span{font:8px/1 "Press Start 2P",monospace;padding:4px 6px;border:2px solid #000;background:#ff5a8a;color:#fff;text-shadow:none}',
    '.sa-buff span.boese{background:#6a6a7a}.sa-buff span.power{background:#e8a020}',
    '.sa-herz{position:absolute;z-index:25;transform:translate(-50%,-50%);background:#fff;color:#241a12;border:3px solid #000;padding:6px 10px;font-size:15px;white-space:nowrap;',
    ' box-shadow:4px 4px 0 #ff5a8a;cursor:pointer;animation:saWackel .45s infinite alternate}',
    '.sa-herz small{display:block;font-size:12px;opacity:.65}',
    '@keyframes saWackel{from{transform:translate(-50%,-50%) rotate(-3deg)}to{transform:translate(-50%,-56%) rotate(3deg)}}',
    '.sa-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:4px 8px;font-size:14px;white-space:nowrap;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:saPop .15s}',
    '.sa-blase.rosa{background:#ffe0ec}',
    '.sa-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:inherit;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes saPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.sa-meldung{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;z-index:19;width:92%}',
    '.sa-meldung b{display:block;font:clamp(12px,3.4vw,20px)/1.3 "Press Start 2P",monospace;color:#ffd23f;text-shadow:3px 3px 0 #000}',
    '.sa-meldung small{display:block;font-size:16px;text-shadow:2px 2px 0 #000;margin-top:6px}',
    '.sa-meldung.zeigen{animation:saMeld 2.4s ease-out}',
    '@keyframes saMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}10%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}82%{opacity:1}100%{opacity:0}}',
    '.sa-shop h3{margin:14px 2px 8px;font:9px/1.4 "Press Start 2P",monospace;color:#ffd23f;display:flex;justify-content:space-between;align-items:center;gap:8px}',
    '.sa-shop h3:first-child{margin-top:2px}',
    '.sa-menge{display:flex;gap:4px}',
    '.sa-menge button{font:8px "Press Start 2P",monospace;padding:5px 6px;border:2px solid #000;background:#3b3746;color:#fff;cursor:pointer}',
    '.sa-menge button.an{background:#ffd23f;color:#241a12}',
    '.sa-row{display:flex;gap:8px;align-items:center;width:100%;text-align:left;background:#f4ecd8;color:#241a12;border:3px solid #000;padding:6px 8px;margin:0 0 6px;',
    ' font:inherit;cursor:pointer;box-shadow:3px 3px 0 rgba(0,0,0,.45)}',
    '.sa-row:active{transform:translateY(2px);box-shadow:1px 1px 0 rgba(0,0,0,.45)}',
    '.sa-row:not(.kann){opacity:.62}',
    '.sa-row.zu{background:#3b3746;color:#8a8698;cursor:default;opacity:1}',
    '.sa-row .ic{font-size:22px;width:30px;text-align:center;flex:none}',
    '.sa-row .mid{flex:1;min-width:0}',
    '.sa-row .mid>span{display:block}',
    '.sa-row .nm{font-weight:700;font-size:16px;line-height:1.15}',
    '.sa-row .ef{font-size:13px;color:#1e6a3c;line-height:1.2}',
    '.sa-row .tx{font-size:13px;opacity:.72;line-height:1.2}',
    '.sa-row .rechts{text-align:right;flex:none}',
    '.sa-row .pr{font:8px/1.5 "Press Start 2P",monospace;white-space:nowrap;color:#b03030}',
    '.sa-row.kann .pr{color:#1e6a3c}',
    '.sa-row .anz{font:15px/1.2 "Press Start 2P",monospace;color:rgba(36,26,18,.4)}',
    '.sa-row.tief{background:#ffd23f}',
    '.sa-leer{font-size:14px;opacity:.6;margin:0 2px 6px}',
    '.sa-erze{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px}',
    '.sa-erz{display:flex;gap:6px;align-items:center;background:#2c2836;border:2px solid #000;padding:5px 6px;font-size:13px;line-height:1.15}',
    '.sa-erz i{flex:none;width:14px;height:14px;border:2px solid #000}',
    '.sa-erz b{display:block;font-size:14px}',
    '.sa-erz.neu{opacity:.45}',
    '.sa-stat{font-size:14px;opacity:.75;line-height:1.5;margin:0 2px}',
    '.sa-reset{margin-top:12px;font:8px "Press Start 2P",monospace;padding:8px;border:2px solid #000;background:#3b3746;color:#c8c4d4;cursor:pointer;width:100%}',
    '.sa-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,14,.6);z-index:40;padding:16px;overflow:auto}',
    '.sa-ovl.aus{display:none}',
    '.sa-karte{width:min(460px,100%);background:#f4ecd8;color:#241a12;border:4px solid #241a12;box-shadow:8px 8px 0 #8a3b12;padding:16px 18px;text-align:center;margin:auto}',
    '.sa-karte h1{margin:4px 0;font:clamp(15px,4.4vw,22px)/1.3 "Press Start 2P",monospace;color:#8a3b12}',
    '.sa-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.sa-karte canvas{position:static;width:80px;height:auto;margin:4px auto}',
    '.sa-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.sa-karte li{margin-bottom:4px}',
    '.sa-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(36,26,18,.3);padding:6px 0;font-size:17px}',
    '.sa-karte .zeile b{font:11px/1.6 "Press Start 2P",monospace;color:#8a3b12}',
    '.sa-karte .px-btn{width:100%;margin-top:8px}',
    // Handy
    '.sa-handyknopf{position:absolute;left:10px;bottom:10px;z-index:21;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 8px 5px;border:3px solid #000;background:#ffd23f;color:#241a12;cursor:pointer;box-shadow:3px 3px 0 rgba(0,0,0,.45)}',
    '.sa-handyknopf span{font:24px/1 sans-serif}.sa-handyknopf b{font:8px/1 "Press Start 2P",monospace}',
    '.sa-handyknopf.neu{animation:saPuls 1s infinite}',
    '@keyframes saPuls{50%{transform:scale(1.12)}}',
    '.sa-hovl{position:absolute;inset:0;z-index:45;background:rgba(10,8,14,.72);display:flex;align-items:center;justify-content:center;padding:12px}',
    '.sa-hovl.aus{display:none}',
    '.sa-handy{position:relative;width:min(350px,100%);height:min(680px,100%);background:#0c0a12;border:6px solid #000;outline:3px solid #3b3746;border-radius:30px;',
    ' display:flex;flex-direction:column;overflow:hidden;box-shadow:8px 8px 0 rgba(0,0,0,.5)}',
    '.sa-h-status{display:flex;justify-content:space-between;padding:9px 20px 5px;font:8px "Press Start 2P",monospace;color:#c8c4d4}',
    '.sa-h-screen{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;touch-action:pan-y;padding:4px 12px 12px;background:linear-gradient(#2a1e3a,#15111c)}',
    '.sa-h-home{flex:none;height:24px;border:0;background:#0c0a12;cursor:pointer;position:relative}',
    '.sa-h-home:after{content:"";position:absolute;left:35%;right:35%;top:9px;height:5px;border-radius:3px;background:#8a8698}',
    '.sa-h-kopf{display:flex;align-items:center;justify-content:space-between;margin:2px 0 10px;gap:6px}',
    '.sa-h-kopf b{font:10px/1.4 "Press Start 2P",monospace;color:#ffd23f;text-align:center;flex:1}',
    '.sa-h-kopf button,.sa-h-kopf span{width:34px;flex:none}',
    '.sa-h-kopf button{height:34px;border:2px solid #000;background:#3b3746;color:#fff;font-size:18px;cursor:pointer}',
    '.sa-h-uhr{text-align:center;font:30px/1.2 "Press Start 2P",monospace;margin:18px 0 4px}',
    '.sa-h-wall{text-align:center;font-size:14px;opacity:.75}',
    '.sa-h-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px 8px;margin:18px 0}',
    '.sa-h-grid button{border:0;background:none;color:#fff;font:13px "Pixelify Sans",sans-serif;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px}',
    '.sa-h-grid i{font-style:normal;font-size:28px;width:60px;height:60px;display:flex;align-items:center;justify-content:center;border-radius:14px;border:3px solid #000;background:#ffd23f;box-shadow:3px 3px 0 rgba(0,0,0,.4)}',
    '.sa-h-grid button:nth-child(2) i{background:#e8343f}.sa-h-grid button:nth-child(3) i{background:#3fae5a}.sa-h-grid button:nth-child(4) i{background:#3b3746}',
    '.sa-h-widget{background:rgba(255,255,255,.08);border:2px solid #000;padding:10px;text-align:center;font-size:14px;line-height:1.4}',
    '.sa-h-widget b{display:block;font:15px/1.5 "Press Start 2P",monospace;color:#ffd23f}',
    '.sa-handy canvas{position:static;height:56px;width:auto;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.sa-h-karte{display:flex;gap:10px;align-items:center;background:#f4ecd8;color:#241a12;border:3px solid #000;padding:8px 10px;margin-bottom:10px;box-shadow:3px 3px 0 rgba(0,0,0,.4);font-size:14px;line-height:1.35}',
    '.sa-h-karte b{font:13px/1.5 "Press Start 2P",monospace;color:#8a3b12}',
    '.sa-h-row{display:flex;gap:8px;align-items:center;width:100%;text-align:left;background:#f4ecd8;color:#241a12;border:3px solid #000;padding:6px 8px;margin:0 0 6px;font:inherit;cursor:pointer;box-shadow:3px 3px 0 rgba(0,0,0,.4)}',
    '.sa-h-row.zu{background:#3b3746;color:#8a8698;cursor:default}',
    '.sa-h-row .ic{font-size:22px;width:28px;text-align:center;flex:none}',
    '.sa-h-row .mid{flex:1;min-width:0}.sa-h-row .mid>span{display:block}',
    '.sa-h-row .nm{font-weight:700;font-size:15px}',
    '.sa-h-row .tx{font-size:12px;opacity:.75}',
    '.sa-h-row .pr{font:8px/1.5 "Press Start 2P",monospace;white-space:nowrap;text-align:right}',
    '.sa-h-row canvas{height:40px}',
    '.sa-lv{display:flex;gap:2px;margin-top:3px}.sa-lv i{width:10px;height:7px;background:#c8c0b0;border:1px solid #241a12}.sa-lv i.an{background:#e8343f}',
    '.sa-h-btn{display:block;width:100%;font:11px/1.3 "Press Start 2P",monospace;padding:12px;border:3px solid #000;background:#ffd23f;color:#241a12;cursor:pointer;margin-top:8px;box-shadow:3px 3px 0 rgba(0,0,0,.45)}',
    '.sa-h-btn.alt{background:#d8cfb8}.sa-h-btn:disabled{opacity:.5;cursor:default}',
    '.sa-h-info{font-size:14px;opacity:.85;margin:4px 0 8px;line-height:1.35}',
    '.sa-tim{position:relative;height:36px;background:#2c2836;border:3px solid #000;margin:14px 0 4px;overflow:hidden}',
    '.sa-tim .z{position:absolute;top:0;bottom:0;background:#3fae5a}',
    '.sa-tim .p{position:absolute;left:33%;width:34%;top:0;bottom:0;background:#ffd23f}',
    '.sa-tim .n{position:absolute;top:0;bottom:0;width:4px;margin-left:-2px;background:#fff;box-shadow:0 0 0 2px #000}',
    '.sa-tap{font-size:15px;padding:18px}',
    '.sa-h-fb{min-height:46px;text-align:center;margin-top:8px;font-size:14px}',
    '.sa-h-fb b{display:block;font:12px/1.5 "Press Start 2P",monospace;color:#ffd23f}',
    '.sa-h-fb b.rot{color:#ff6a6a}.sa-h-fb b.gruen{color:#5ae87a}',
    '.sa-h-vs{display:flex;align-items:flex-end;justify-content:center;gap:14px;margin:6px 0}',
    '.sa-h-vs b{font:14px "Press Start 2P",monospace;color:#e8343f;align-self:center}',
    '.sa-h-vs canvas{height:84px}',
    '.sa-h-quip{background:#fff;color:#14141a;border:3px solid #14141a;padding:6px 8px;font-size:14px;margin:6px 0 10px;text-align:center}',
    '.sa-h-tab{width:100%;border-collapse:collapse;font-size:14px;margin:4px 0}',
    '.sa-h-tab td{padding:4px;border-top:1px dashed rgba(255,255,255,.2)}',
    '.sa-h-tab td+td{text-align:center;font:9px "Press Start 2P",monospace}',
    '.sa-h-score{text-align:center;font:12px/1.6 "Press Start 2P",monospace;margin:4px 0}',
    '.sa-h-chat{margin-bottom:14px}.sa-h-chat h4{margin:0 0 6px;font:9px "Press Start 2P",monospace;color:#ffd23f}',
    '.sa-h-msg{width:fit-content;max-width:80%;padding:5px 8px;margin:4px 0;font-size:14px;border:2px solid #000;background:#f4ecd8;color:#241a12}',
    '.sa-h-msg.ich{margin-left:auto;background:#5ac8f0}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var GROSS = [[1e18, 'Trio'], [1e15, 'Brd'], [1e12, 'Bio'], [1e9, 'Mrd'], [1e6, 'Mio']];
  function fmt(n) {
    n = Math.floor(n);
    if (n < 1e6) return n.toLocaleString('de-DE');
    if (n >= 1e21) return n.toExponential(2).replace('.', ',');
    for (var i = 0; i < GROSS.length; i++) if (n >= GROSS[i][0]) return (n / GROSS[i][0]).toFixed(2).replace('.', ',') + ' ' + GROSS[i][1];
  }
  function fmtPS(n) { return n < 100 ? (Math.round(n * 10) / 10).toLocaleString('de-DE') : fmt(n); }
  // für die Pixelschrift im Canvas (nur Großbuchstaben, Ziffern, Punkt)
  function kurz(n) {
    if (n < 1000) return String(Math.floor(n));
    var E = [[1e15, 'Q'], [1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'K']];
    for (var i = 0; i < E.length; i++) if (n >= E[i][0]) { var v = n / E[i][0]; return (v < 10 ? v.toFixed(1) : String(Math.floor(v))) + E[i][1]; }
  }
  function meter(t) { return t <= LETZTE ? SOHLEN[t].m : SOHLEN[LETZTE].m + (t - LETZTE) * 500; }
  function fels(t) { return SOHLEN[Math.min(t, LETZTE)].fels; }
  function tiefPreis(t) { return t + 1 <= LETZTE ? SOHLEN[t + 1].preis : SOHLEN[LETZTE].preis * Math.pow(6, t + 1 - LETZTE); }
  function tiefMult(t) { return Math.pow(1.5, Math.min(t, LETZTE)) * Math.pow(1.15, Math.max(0, t - LETZTE)); }
  function erzMult(t) { return Math.pow(1.15, Math.max(0, t - LETZTE)); }
  function erz(id) { for (var i = 0; i < ERZE.length; i++) if (ERZE[i].id === id) return ERZE[i]; }
  function prodPreis(p, hat, n) { return Math.ceil(p.preis * Math.pow(1.15, hat) * (Math.pow(1.15, n) - 1) / 0.15); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="sa"><div class="sa-szene" data-el="szene"><canvas></canvas>' +
        '<div class="sa-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
          '<div class="sa-hud"><b data-el="para">0 PARA</b><small data-el="pps">0 Para/s</small><div class="sa-buff" data-el="buff"></div></div>' +
          '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
        '<div class="sa-meldung" data-el="meldung"></div>' +
        '<div class="sa-herz" data-act="herz" data-el="herz" hidden></div>' +
        '<button class="sa-handyknopf" data-act="handy" data-el="handyknopf" aria-label="Handy"><span>📱</span><b>HANDY</b></button>' +
      '</div><div class="sa-shop" data-el="shop"></div>' +
      '<div class="sa-hovl aus" data-el="handy"><div class="sa-handy"><div class="sa-h-status"><span data-el="uhr"></span><span>5G ▮▮▮ 🔋</span></div>' +
        '<div class="sa-h-screen" data-el="app"></div><button class="sa-h-home" data-h="home" aria-label="Home"></button></div></div>' +
      '<div class="sa-ovl aus" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.sa'), szeneEl = root.querySelector('[data-el=szene]'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), shop = $('shop'), herzEl = $('herz'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now(), meldT = 0, saveT = 0, shopT = 0, sigT = 0, sig = '';

    // ---------- Layout ----------
    var S = 3, IW = 0, IH = 0, OX = 0, OY = 0;
    function resize() {
      var W = szeneEl.clientWidth, H = szeneEl.clientHeight;
      S = Math.max(2, Math.floor(Math.min(W / SW0, H / SH0)));
      IW = Math.ceil(W / S); IH = Math.ceil(H / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      OX = Math.floor((IW - SW0) / 2);
      OY = clamp(IH - SH0 - 4, 0, Math.max(0, Math.floor((IH - SH0) / 2) + 20));
    }

    // ---------- Spielstand ----------
    var g, r, d;
    function neu() { return { para: 0, gesamt: 0, klicks: 0, prod: {}, upg: {}, tiefe: 0, erze: {}, herzen: 0, looks: {}, mog: {}, t: Date.now() }; }
    function laden() {
      var s = null;
      try { s = JSON.parse(Pixel.get(SAVE_KEY, 'null')); } catch (e) {}
      var n = neu();
      if (s && typeof s === 'object') Object.keys(n).forEach(function (k) { if (typeof s[k] === typeof n[k]) n[k] = s[k]; });
      return n;
    }
    function speichern() { g.t = Date.now(); Pixel.set(SAVE_KEY, JSON.stringify(g)); }
    function rechnen() {
      d = { klick: 1, anteil: 0, prodM: {}, herzOft: false, klebeLang: false, herzX: 1, immer: false, keineEifer: false };
      PROD.forEach(function (p) { d.prodM[p.id] = 1; });
      UPGS.forEach(function (u) {
        if (!g.upg[u.id]) return;
        if (u.k) d.klick *= u.k;
        if (u.a) d.anteil += u.a;
        if (u.p) d.prodM[u.p] *= 2;
        if (u.herzOft) d.herzOft = true;
        if (u.klebeLang) d.klebeLang = true;
        if (u.herzX) d.herzX = u.herzX;
        if (u.immer) d.immer = true;
        if (u.keineEifer) d.keineEifer = true;
      });
    }
    function ppsBasis() {
      var s = 0;
      PROD.forEach(function (p) { s += (g.prod[p.id] || 0) * p.pps * d.prodM[p.id]; });
      return s * tiefMult(g.tiefe) * lookMult();
    }
    // Looks und gewonnene Mog-Offs geben einen Bonus auf alles
    function lv(id) { return g.looks[id] || 0; }
    function lookSumme() { return LOOKS.reduce(function (s, l) { return s + lv(l.id); }, 0); }
    function gemoggt() { return GEGNER.filter(function (x) { return g.mog[x.id]; }).length; }
    function lookMult() { return 1 + 0.03 * lookSumme() + 0.05 * gemoggt(); }
    function ppsJetzt() { return ppsBasis() * (r.klebe > 0 ? 7 : 1) * (r.eifer > 0 ? 0.5 : 1); }

    // ---------- Erze in der Wand ----------
    function erzZiehen() {
      var los = [], summe = 0;
      ERZE.forEach(function (e) {
        if (e.sohle > g.tiefe) return;
        var w = e.gewicht || (e.sohle === g.tiefe ? 3 : e.sohle === g.tiefe - 1 ? 2 : 1);
        los.push([e, w]); summe += w;
      });
      var x = Math.random() * summe;
      for (var i = 0; i < los.length; i++) { x -= los[i][1]; if (x <= 0) return los[i][0]; }
      return los[los.length - 1][0];
    }
    function wandFuellen() {
      r.kacheln = [];
      for (var i = 0; i < 18; i++) r.kacheln.push({ erz: erzZiehen(), weg: 0, muster: Math.floor(Math.random() * 4) });
    }

    // ---------- Meldungen & Sprechblasen ----------
    function melde(txt, klein) {
      var el = $('meldung'); el.className = 'sa-meldung'; el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 2400);
    }
    function sag(wer, txt, dauer) {
      r.blasen.forEach(function (b) { b.el.remove(); }); r.blasen = [];
      var el = document.createElement('div'); el.className = 'sa-blase' + (wer === 'schatzi' ? ' rosa' : ''); el.textContent = txt; szeneEl.appendChild(el);
      r.blasen.push({ wer: wer, el: el, t: dauer || 2.2 });
    }
    function blasenPos(b) {
      var x = b.wer === 'schatzi' ? SX - 8 : SX + 8, y = DECKE + 2;
      var hb = b.el.offsetWidth / 2 + 4;
      b.el.style.left = clamp((OX + x) * S, hb, szeneEl.clientWidth - hb) + 'px';
      b.el.style.top = Math.max(b.el.offsetHeight + 70, (OY + y) * S) + 'px';
    }
    function schatziDa() { return d.immer || r.klebe > 0 || r.eifer > 0; }

    // ---------- Graben ----------
    function graben() {
      if (r.modus !== 'spiel') return;
      var frei = [];
      r.kacheln.forEach(function (k, i) { if (k.weg <= 0) frei.push(i); });
      var i = frei.length ? pick(frei) : Math.floor(Math.random() * 18), k = r.kacheln[i], e = k.erz;
      var wert = e.wert * erzMult(g.tiefe) * d.klick * (r.power > 0 ? 17 : 1) * lookMult() + d.anteil * ppsJetzt();
      g.para += wert; g.gesamt += wert; g.klicks++;
      g.erze[e.id] = (g.erze[e.id] || 0) + 1;
      if (g.erze[e.id] === 1 && e.id !== 'kies') {
        melde('Neues Erz: ' + e.name, e.text); r.stolz = 1.6;
        if (e.id === 'pyrit') sag('saro', 'Echtes Gold, schwör!', 2);
        if (e.id === 'gold') sag('saro', 'SEHT IHR?! Gold in Frankfurt!', 2.4);
        Pixel.sfx.tone(784, 0.1, 'square', 0.05); Pixel.sfx.tone(1047, 0.18, 'square', 0.05, null, 0.1);
        sig = '';
      }
      k.weg = 0.45; r.hack = 0.12;
      var kx = WAND + 2 + (i % 6) * 8 + 4, ky = DECKE + 4 + Math.floor(i / 6) * 8 + 4;
      for (var n = 0; n < 4; n++) r.partikel.push({ x: kx, y: ky, vx: rnd(-40, -8), vy: rnd(-50, -15), t: 0, max: 0.7, farbe: e.farbe });
      var texte = r.partikel.filter(function (p) { return p.txt; });
      if (texte.length >= 5) r.partikel.splice(r.partikel.indexOf(texte[0]), 1);
      r.partikel.push({ x: kx - 10, y: ky - 6, vx: 0, vy: -18, t: 0, max: 1, txt: '+' + kurz(wert), farbe: e.farbe });
      if (r.partikel.length > 80) r.partikel.splice(0, r.partikel.length - 80);
      Pixel.sfx.noise(0.05, 0.1, 700 + Math.min(e.wert, 1e6) / 1e6 * 2000);
      Pixel.sfx.tone(clamp(180 + Math.log(e.wert + 1) * 60, 180, 1400), 0.05, 'square', 0.025);
    }

    // ---------- Kaufen ----------
    function kaufen(code) {
      if (r.modus !== 'spiel') return;
      if (code === 'tiefer') {
        var tp = tiefPreis(g.tiefe); if (g.para < tp) return nein();
        g.para -= tp; g.tiefe++;
        var m = meter(g.tiefe), neue = ERZE.filter(function (e) { return e.sohle === g.tiefe; }).map(function (e) { return e.name; });
        if (m > +Pixel.get(BEST_KEY, 0)) Pixel.set(BEST_KEY, m);
        melde('Sohle ' + m + ' m', neue.length ? 'Hier unten gibt es: ' + neue.join(', ') : 'Noch tiefer. Crew +15 %');
        sag('saro', pick(['Tiefer, Bruder. Immer tiefer.', 'Aro wäre stolz.', 'Wer zweifelt jetzt noch?']), 2);
        wandFuellen(); r.beben = 0.6;
        Pixel.sfx.noise(0.6, 0.25, 300); Pixel.sfx.tone(196, 0.12, 'square', 0.05, null, 0.3); Pixel.sfx.tone(262, 0.12, 'square', 0.05, null, 0.42); Pixel.sfx.tone(392, 0.22, 'square', 0.05, null, 0.54);
      } else if (code.indexOf('p:') === 0) {
        var p = PROD.filter(function (x) { return x.id === code.slice(2); })[0]; if (!p) return;
        var hat = g.prod[p.id] || 0, pr = prodPreis(p, hat, r.menge); if (g.para < pr) return nein();
        g.para -= pr; g.prod[p.id] = hat + r.menge;
        if (hat === 0) sag('saro', p.id === 'aro' ? 'Aro ist dabei. Jetzt wird es ernst.' : p.id === 'paar' ? 'Schatzi und ich – ein Imperium.' : 'Mein Business wächst, Bruder.', 1.8);
        Pixel.sfx.tone(660, 0.06, 'square', 0.04); Pixel.sfx.tone(880, 0.08, 'square', 0.04, null, 0.06);
      } else if (code.indexOf('u:') === 0) {
        var u = UPGS.filter(function (x) { return x.id === code.slice(2); })[0]; if (!u || g.upg[u.id]) return;
        if (g.para < u.preis) return nein();
        g.para -= u.preis; g.upg[u.id] = 1; rechnen();
        Pixel.sfx.tone(523, 0.06, 'square', 0.04); Pixel.sfx.tone(784, 0.06, 'square', 0.04, null, 0.06); Pixel.sfx.tone(1047, 0.12, 'square', 0.04, null, 0.12);
      }
      shopBauen(); speichern();
    }
    function nein() { Pixel.sfx.tone(140, 0.1, 'square', 0.04); }

    // ---------- Schatzi ----------
    function herzAbstand() { return rnd(55, 110) * (d.herzOft ? 0.6 : 1); }
    function herzZeigen() {
      if (r.modus !== 'spiel' || r.herz) return;
      r.herz = { t: 11 };
      herzEl.innerHTML = '💛 Schatzi: ' + pick(NACHRICHTEN) + '<small>Schnell antippen!</small>';
      herzEl.style.left = rnd(22, 72) + '%'; herzEl.style.top = rnd(40, 66) + '%';
      herzEl.hidden = false;
      Pixel.sfx.tone(988, 0.08, 'sine', 0.06); Pixel.sfx.tone(1319, 0.12, 'sine', 0.06, null, 0.1);
    }
    function herzWeg() { r.herz = null; herzEl.hidden = true; r.herzAb = herzAbstand(); }
    function herzAntworten() {
      if (!r.herz) return;
      herzWeg(); g.herzen++; r.eifer = 0;
      var x = Math.random();
      if (x < 0.55) {
        r.klebe = (d.klebeLang ? 60 : 30) * d.herzX;
        melde('Klebe-Modus!', 'Schatzi gräbt mit: Crew ×7 für ' + Math.round(r.klebe) + ' s');
        sag('schatzi', 'Ich helf dir, Schatz!', 2); setTimeout(function () { if (alive) sag('saro', 'Wir zwei gegen die Welt.', 2); }, 900);
      } else if (x < 0.85) {
        var plus = (Math.min(g.para * 0.15, ppsBasis() * 900) + 20 * Math.pow(4, g.tiefe)) * d.herzX;
        g.para += plus; g.gesamt += plus;
        melde('+' + fmt(plus) + ' Para', 'Herzchen-Überweisung von Schatzi');
        sag('schatzi', 'Für meinen Gangster 💕', 2);
      } else {
        r.power = 12 * d.herzX;
        melde('Pärchen-Power!', 'Klicks ×17 für ' + Math.round(r.power) + ' s');
        sag('saro', 'Für Schatzi grab ich alles weg!', 2);
      }
      for (var i = 0; i < 8; i++) r.herzchen.push({ x: SX - 6 + rnd(-10, 14), y: DECKE + rnd(6, 20), t: -i * 0.12 });
      Pixel.sfx.tone(659, 0.1, 'triangle', 0.06); Pixel.sfx.tone(880, 0.1, 'triangle', 0.06, null, 0.1); Pixel.sfx.tone(1175, 0.2, 'triangle', 0.06, null, 0.2);
      sig = '';
    }
    function herzVerpasst() {
      herzWeg();
      if (d.keineEifer) return;
      r.eifer = 20;
      melde('Eifersucht!', 'Nicht geantwortet. Crew ×0,5 für 20 s');
      sag('schatzi', 'Warum liest du nicht?!', 2.2); setTimeout(function () { if (alive) sag('saro', 'Schatz, ich war unter Tage!', 2); }, 1000);
      Pixel.sfx.tone(220, 0.2, 'sawtooth', 0.05, 160);
    }

    // ---------- Update ----------
    function update(dt) {
      r.t += dt;
      r.blasen = r.blasen.filter(function (b) { b.t -= dt; if (b.t <= 0) { b.el.remove(); return false; } return true; });
      r.partikel = r.partikel.filter(function (p) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; if (!p.txt) p.vy += 140 * dt; return p.t < p.max; });
      r.herzchen = r.herzchen.filter(function (h) { h.t += dt; return h.t < 1.6; });
      r.kacheln.forEach(function (k) { if (k.weg > 0) { k.weg -= dt; if (k.weg <= 0) { k.erz = erzZiehen(); k.muster = Math.floor(Math.random() * 4); } } });
      r.hack = Math.max(0, r.hack - dt); r.stolz = Math.max(0, r.stolz - dt); r.beben = Math.max(0, r.beben - dt);
      var tm = r.timing;
      if (tm) {
        tm.pos += tm.dir * tm.speed * dt;
        if (tm.pos > 1) { tm.pos = 1; tm.dir = -1; } else if (tm.pos < 0) { tm.pos = 0; tm.dir = 1; }
        tm.el.style.left = (tm.pos * 100) + '%';
      }
      if (r.modus !== 'spiel') return;
      if (r.klebe > 0) { r.klebe = Math.max(0, r.klebe - dt); if (Math.random() < dt * 3) r.herzchen.push({ x: SX - 6 + rnd(-6, 10), y: DECKE + rnd(4, 14), t: 0 }); }
      r.eifer = Math.max(0, r.eifer - dt); r.power = Math.max(0, r.power - dt);
      var plus = ppsJetzt() * dt; g.para += plus; g.gesamt += plus;
      if (r.handy) { /* Schatzi wartet, solange das Handy offen ist */ }
      else if (r.herz) { r.herz.t -= dt; if (r.herz.t <= 0) herzVerpasst(); }
      else { r.herzAb -= dt; if (r.herzAb <= 0) herzZeigen(); }
      r.spruchAb -= dt; if (r.spruchAb <= 0) { r.spruchAb = rnd(14, 24); if (!r.blasen.length) sag('saro', pick(SPRUECHE), 2.6); }
      saveT += dt; if (saveT > 10) { saveT = 0; speichern(); }
      shopT += dt; if (shopT > 0.2) { shopT = 0; shopAktualisieren(); }
    }

    // ---------- Zeichnen ----------
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x), Math.round(OY + y), Math.round(w), Math.round(h)); }
    function hash(n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
    function dunkler(hex, f) {
      var n = parseInt(hex.slice(1), 16), rr = (n >> 16) & 255, gg = (n >> 8) & 255, bb = n & 255;
      return 'rgb(' + Math.round(rr * f) + ',' + Math.round(gg * f) + ',' + Math.round(bb * f) + ')';
    }
    function himmel(t) {
      ctx.fillStyle = '#4ab8e8'; ctx.fillRect(0, 0, IW, OY + 12);
      ctx.fillStyle = '#6ac8f0'; ctx.fillRect(0, OY + 12, IW, 10);
      ctx.fillStyle = '#9ae0f8'; ctx.fillRect(0, OY + 22, IW, 8);
      for (var c = 0; c < 4; c++) {
        var cx = ((c * 61 + t * 3) % (IW + 40)) - 20 - OX, cy = 4 + c * 5 % 12;
        R(cx, cy, 14, 3, '#ffffff'); R(cx + 3, cy - 2, 7, 2, '#ffffff');
      }
      for (var off = -160 * Math.ceil(OX / 160 + 1); off < IW - OX; off += 160) {
        SKYLINE.forEach(function (b, i) {
          var x = off + b[0], y = GRAS - b[2];
          R(x, y, b[1], b[2], '#3e4c6e');
          if (b[3] === 'messe') { R(x + 1, y - 2, b[1] - 2, 2, '#3e4c6e'); R(x + 3, y - 4, b[1] - 6, 2, '#3e4c6e'); R(x + b[1] / 2 - 1, y - 6, 1, 2, '#3e4c6e'); }
          if (b[3] === 'antenne') { R(x + Math.floor(b[1] / 2), y - 5, 1, 5, '#3e4c6e'); if (Math.floor(t * 2) % 2) R(x + Math.floor(b[1] / 2), y - 6, 1, 1, '#ff4040'); }
          for (var wy = y + 2; wy < GRAS - 2; wy += 3) for (var wx = x + 1; wx < x + b[1] - 1; wx += 2)
            if (hash(i * 97 + wx * 7 + wy * 13) > 0.62) R(wx, wy, 1, 1, '#f8e08a');
        });
      }
    }
    function oberflaeche(t) {
      var n = (g.prod.rolex || 0), b = (g.prod.barber || 0);
      // Förderturm über dem Schacht
      R(SCH - 2, 14, 1, 16, '#5a3a2a'); R(SCH + 10, 14, 1, 16, '#5a3a2a'); R(SCH - 2, 14, 13, 1, '#5a3a2a'); R(SCH, 20, 9, 1, '#5a3a2a');
      R(SCH + 2, 10, 5, 5, '#2a2a2a'); R(SCH + 3, 11, 3, 3, '#8a8a8a'); R(SCH + 4, 12, 1, 1, Math.floor(t * 6) % 2 ? '#2a2a2a' : '#c8c8c8');
      R(16, 20, 43, 9, '#241a12'); R(17, 21, 41, 7, '#ffd23f'); Pixel.text(ctx, 'SAROS', OX + 19, OY + 22, 1, '#241a12'); Pixel.text(ctx, 'MINE', OX + 41, OY + 22, 1, '#8a3b12'); R(37, 29, 1, 1, '#241a12');
      if (n) { R(62, 24, 14, 2, '#8a5a3a'); R(63, 26, 1, 4, '#5a3a2a'); R(74, 26, 1, 4, '#5a3a2a'); for (var i = 0; i < 4; i++) R(64 + i * 3, 23, 2, 1, i % 2 ? '#f4f8fc' : '#ffd23f'); }
      if (b) { R(80, 20, 3, 10, '#ffffff'); for (var s = 0; s < 4; s++) R(80, 20 + ((s * 3 + Math.floor(t * 8)) % 10), 3, 1, '#e83a3a'); R(79, 19, 5, 1, '#8a8a8a'); }
      if (g.prod.aro) { R(114, 25, 1, 5, '#6a4a2a'); R(103, 18, 24, 7, '#f4f4f0'); Pixel.text(ctx, 'BERLIN', OX + 104, OY + 19, 1, '#241a12'); }
      if (g.prod.boerse) { R(84, 8, 20, 9, '#14141a'); Pixel.text(ctx, 'DAX', OX + 86, OY + 10, 1, '#3ad87a'); Pixel.text(ctx, '+', OX + 99, OY + 10, 1, Math.floor(t * 3) % 2 ? '#3ad87a' : '#14141a'); }
      if (g.prod.paar) { R(106, 8, 3, 2, '#ff5a8a'); R(110, 8, 3, 2, '#ff5a8a'); R(105, 10, 9, 3, '#ff5a8a'); R(107, 13, 5, 2, '#ff5a8a'); R(109, 15, 1, 1, '#ff5a8a'); }
      ctx.fillStyle = '#5aa83a'; ctx.fillRect(0, OY + GRAS, IW, 2);
    }
    function erdreich() {
      var n = Math.min(g.tiefe + 1, 10), von = g.tiefe + 1 - n, h = (DECKE - GRAS - 2) / n;
      for (var i = 0; i < n; i++) {
        var y0 = Math.round(OY + GRAS + 2 + i * h), y1 = Math.round(OY + GRAS + 2 + (i + 1) * h);
        ctx.fillStyle = fels(von + i); ctx.fillRect(0, y0, IW, y1 - y0);
        ctx.fillStyle = dunkler(fels(von + i), 0.8);
        for (var x = 0; x < IW; x += 5) if (hash((von + i) * 31 + x) > 0.5) ctx.fillRect(x, y0 + Math.floor(hash(x + i) * Math.max(1, y1 - y0 - 1)), 2, 1);
      }
      // Unterhalb des Stollens: aktuelles Gestein
      ctx.fillStyle = dunkler(fels(g.tiefe), 0.75); ctx.fillRect(0, OY + BODEN, IW, IH);
      // Schacht
      R(SCH, GRAS, 9, BODEN - GRAS, '#1a1210');
      for (var y = GRAS + 3; y < BODEN; y += 4) R(SCH + 1, y, 7, 1, '#5a3a2a');
      R(SCH + 4, GRAS, 1, DECKE - GRAS + 6, '#8a8a8a');
    }
    function stollen(t) {
      var f = fels(g.tiefe), bx = r.beben > 0 ? Math.round(rnd(-1, 1)) : 0;
      R(TL, DECKE, WAND - TL, BODEN - DECKE, dunkler(f, 0.45));
      R(-OX, DECKE, SCH + OX, BODEN - DECKE, f);
      for (var x = TL + 10; x < WAND - 4; x += 24) { R(x, DECKE, 2, BODEN - DECKE, '#7a4a2a'); R(x - 4, DECKE, 10, 2, '#8a5a32'); }
      for (x = TL + 22; x < WAND; x += 24) {
        var an = hash(Math.floor(t * 4) + x) > 0.08;
        R(x, DECKE + 2, 1, 3, '#2a2a2a'); R(x - 1, DECKE + 5, 3, 2, an ? '#ffe08a' : '#8a7a4a');
        if (an) { ctx.fillStyle = 'rgba(255,224,138,.12)'; ctx.fillRect(OX + x - 6, OY + DECKE + 4, 13, 10); }
      }
      R(TL, BODEN, WAND - TL, 1, '#3a2a1a'); R(TL, BODEN + 2, WAND - TL, 1, '#6a6a6a'); R(TL, BODEN + 5, WAND - TL, 1, '#6a6a6a');
      for (x = TL + 2; x < WAND; x += 5) R(x, BODEN + 1, 2, 6, '#5a3a22');
      // Wand mit Erzen
      R(WAND + bx, DECKE, IW, BODEN - DECKE, f);
      R(WAND + bx, DECKE, 1, BODEN - DECKE, dunkler(f, 0.6));
      r.kacheln.forEach(function (k, i) {
        var kx = WAND + 2 + (i % 6) * 8 + bx, ky = DECKE + 4 + Math.floor(i / 6) * 8;
        if (k.weg > 0) { R(kx, ky, 8, 8, dunkler(f, 0.35)); return; }
        R(kx, ky, 8, 8, dunkler(f, 0.9 + (i % 3) * 0.05));
        var e = k.erz, c = e.farbe, m = k.muster;
        if (e.id === 'kies') { R(kx + 1 + m, ky + 2, 2, 1, c); R(kx + 4, ky + 5 - (m % 2), 2, 1, c); return; }
        if (e.id === 'barren') { R(kx + 1, ky + 3, 6, 3, c); R(kx + 2, ky + 2, 4, 1, '#fff2b0'); R(kx + 1, ky + 5, 6, 1, '#c8a030'); return; }
        if (e.id === 'diamant' || e.id === 'aro' || e.id === 'smaragd') {
          R(kx + 3, ky + 1, 2, 1, c); R(kx + 2, ky + 2, 4, 3, c); R(kx + 3, ky + 5, 2, 2, c); R(kx + 3, ky + 2, 1, 1, '#ffffff');
          if (Math.floor(t * 3 + i) % 5 === 0) R(kx + 6, ky + 1, 1, 1, '#ffffff');
          return;
        }
        R(kx + 1 + (m & 1), ky + 1, 3, 2, c); R(kx + 4, ky + 3 + (m >> 1), 3, 2, c); R(kx + 1, ky + 5, 2, 2, c);
        if (e.wert >= 180) R(kx + 2 + (m & 1), ky + 1, 1, 1, '#ffffff');
      });
    }
    function cousins(t) {
      var n = Math.min(g.prod.cousin || 0, 5), farben = ['#c83a3a', '#3a6ac8', '#3aa85a', '#e8a82a', '#8a4ac8'];
      for (var i = 0; i < n; i++) {
        var x = TL + 3 + i * 8, hoch = Math.floor(t * 4 + i * 1.7) % 2;
        R(x, BODEN - 10, 4, 1, '#24160e'); R(x, BODEN - 9, 4, 3, '#c8946e'); R(x, BODEN - 6, 4, 4, farben[i]); R(x, BODEN - 2, 1, 2, '#2e3654'); R(x + 3, BODEN - 2, 1, 2, '#2e3654');
        if (hoch) { R(x + 4, BODEN - 10, 1, 5, '#8a5a32'); R(x + 3, BODEN - 11, 3, 1, '#9aa8b8'); }
        else { R(x + 4, BODEN - 5, 3, 1, '#8a5a32'); R(x + 7, BODEN - 6, 1, 3, '#9aa8b8'); }
      }
    }
    function figuren(t) {
      var mood = r.eifer > 0 ? 'schock' : (r.klebe > 0 || (d.immer && Math.floor(t / 4) % 3 === 0)) ? 'verliebt' : r.stolz > 0 ? 'stolz' : 'cool';
      var dy = r.hack > 0 ? 1 : 0;
      if (schatziDa()) Pixel.draw(ctx, Sprites.schatzi(r.eifer > 0 ? 'sauer' : 'verliebt'), OX + SX - 13, OY + DECKE + 4, 1);
      Pixel.draw(ctx, Sprites.saro(mood), OX + SX, OY + DECKE + 4 + dy, 1);
      if (r.hack > 0) { R(SX + 13, DECKE + 23, 9, 1, '#8a5a32'); R(SX + 21, DECKE + 16, 1, 13, '#9aa8b8'); R(SX + 20, DECKE + 16, 1, 2, '#9aa8b8'); R(SX + 20, DECKE + 27, 1, 2, '#9aa8b8'); }
      else { for (var i = 0; i < 7; i++) R(SX + 14 + i, DECKE + 24 - i * 1.4, 1, 1, '#8a5a32'); R(SX + 16, DECKE + 14, 9, 1, '#9aa8b8'); R(SX + 16, DECKE + 15, 1, 1, '#9aa8b8'); R(SX + 24, DECKE + 15, 1, 1, '#9aa8b8'); }
      r.herzchen.forEach(function (h) {
        if (h.t < 0) return;
        var x = h.x + Math.sin(h.t * 5 + h.x) * 2, y = h.y - h.t * 14;
        ctx.globalAlpha = Math.max(0, 1 - h.t / 1.6);
        R(x, y, 1, 1, '#ff5a8a'); R(x + 2, y, 1, 1, '#ff5a8a'); R(x, y + 1, 3, 1, '#ff5a8a'); R(x + 1, y + 2, 1, 1, '#ff5a8a');
        ctx.globalAlpha = 1;
      });
    }
    function render(t) {
      ctx.imageSmoothingEnabled = false;
      himmel(t); erdreich(); oberflaeche(t); stollen(t); cousins(t); figuren(t);
      Pixel.text(ctx, 'SOHLE ' + meter(g.tiefe) + ' M', OX + TL + 1, OY + DECKE - 7, 1, '#000');
      Pixel.text(ctx, 'SOHLE ' + meter(g.tiefe) + ' M', OX + TL, OY + DECKE - 8, 1, '#fff');
      r.partikel.forEach(function (p) {
        ctx.globalAlpha = Math.max(0, 1 - p.t / p.max);
        if (p.txt) { Pixel.text(ctx, p.txt, OX + p.x + 1, OY + p.y + 1, 1, '#000'); Pixel.text(ctx, p.txt, OX + p.x, OY + p.y, 1, p.farbe === '#141418' ? '#ffffff' : p.farbe); }
        else R(p.x, p.y, 2, 2, p.farbe);
        ctx.globalAlpha = 1;
      });
      if (g.klicks < 5 && r.modus === 'spiel' && Math.floor(t * 2) % 2) {
        Pixel.text(ctx, 'TIPPEN ZUM GRABEN', OX + SW0 / 2 + 1, OY + GRAS + 7, 1, '#000', 'center');
        Pixel.text(ctx, 'TIPPEN ZUM GRABEN', OX + SW0 / 2, OY + GRAS + 6, 1, '#ffd23f', 'center');
      }
    }
    function hud() {
      $('para').textContent = fmt(g.para) + ' PARA';
      $('pps').textContent = fmtPS(ppsJetzt()) + ' Para/s · Sohle ' + meter(g.tiefe) + ' m';
      var b = '';
      if (r.klebe > 0) b += '<span>💑 KLEBE ×7 ' + Math.ceil(r.klebe) + 'S</span>';
      if (r.power > 0) b += '<span class="power">⚡ KLICK ×17 ' + Math.ceil(r.power) + 'S</span>';
      if (r.eifer > 0) b += '<span class="boese">😤 EIFERSUCHT ' + Math.ceil(r.eifer) + 'S</span>';
      if (b !== r.buffHtml) { $('buff').innerHTML = b; r.buffHtml = b; }
      $('handyknopf').classList.toggle('neu', !lookSumme() && !gemoggt() && g.klicks >= 30);
      r.blasen.forEach(blasenPos);
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.1, (now - last) / 1000); last = now;
      update(dt); render(r.t); hud();
      sigT += dt; if (sigT > 0.5) { sigT = 0; if (signatur() !== sig) shopBauen(); }
      raf = requestAnimationFrame(tick);
    }

    // ---------- Shop ----------
    function prodSichtbar() {
      var n = 0;
      for (var i = 0; i < PROD.length; i++) {
        var p = PROD[i];
        if (i === 0 || (g.prod[PROD[i - 1].id] || 0) > 0 || g.gesamt >= p.preis * 0.3 || (g.prod[p.id] || 0) > 0) n = i + 1; else break;
      }
      return n;
    }
    function upgsOffen() { return UPGS.filter(function (u) { return !g.upg[u.id] && u.wann(g); }).sort(function (a, b) { return a.preis - b.preis; }); }
    function signatur() {
      return [prodSichtbar(), upgsOffen().map(function (u) { return u.id; }).join(','), g.tiefe, r.menge, Object.keys(g.erze).length].join('|');
    }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
    function shopBauen() {
      sig = signatur();
      var h = '', tp = tiefPreis(g.tiefe), naechste = ERZE.filter(function (e) { return e.sohle === g.tiefe + 1; });
      h += '<h3>⬇ Schacht</h3>';
      h += '<button class="sa-row tief" data-kauf="tiefer"><span class="ic">⛏️</span><span class="mid"><span class="nm">Tiefer graben: ' + meter(g.tiefe + 1) + ' m</span>' +
        '<span class="ef">' + (naechste.length ? 'Neu: ' + naechste.map(function (e) { return esc(e.name); }).join(', ') + ' · Crew ×1,5' : 'Crew +15 %, Erze +15 %') + '</span>' +
        '<span class="tx">Jetzt: Sohle ' + meter(g.tiefe) + ' m</span></span><span class="rechts"><span class="pr" data-pr>' + fmt(tp) + ' P</span></span></button>';
      var offen = upgsOffen();
      h += '<h3>✨ Upgrades</h3>';
      if (!offen.length) h += '<div class="sa-leer">Gerade nichts im Angebot. Weiter graben, Bruder.</div>';
      offen.forEach(function (u) {
        h += '<button class="sa-row" data-kauf="u:' + u.id + '"><span class="ic">' + u.ic + '</span><span class="mid"><span class="nm">' + esc(u.name) + '</span>' +
          '<span class="ef">' + esc(u.eff) + '</span><span class="tx">' + esc(u.text) + '</span></span><span class="rechts"><span class="pr" data-pr>' + fmt(u.preis) + ' P</span></span></button>';
      });
      h += '<h3><span>💼 Crew &amp; Business</span><span class="sa-menge"><button data-menge="1"' + (r.menge === 1 ? ' class="an"' : '') + '>×1</button>' +
        '<button data-menge="10"' + (r.menge === 10 ? ' class="an"' : '') + '>×10</button></span></h3>';
      var n = prodSichtbar();
      PROD.forEach(function (p, i) {
        if (i < n) {
          h += '<button class="sa-row" data-kauf="p:' + p.id + '"><span class="ic">' + p.ic + '</span><span class="mid"><span class="nm">' + esc(p.name) + '</span>' +
            '<span class="ef" data-ef></span><span class="tx">' + esc(p.text) + '</span></span>' +
            '<span class="rechts"><span class="anz" data-anz></span><br><span class="pr" data-pr></span></span></button>';
        } else if (i === n) {
          h += '<div class="sa-row zu"><span class="ic">❔</span><span class="mid"><span class="nm">???</span><span class="tx">Mehr Para, dann sehen wir weiter.</span></span></div>';
        }
      });
      h += '<h3>💎 Erz-Sammlung</h3><div class="sa-erze">';
      ERZE.forEach(function (e) {
        var anz = g.erze[e.id] || 0;
        h += anz ? '<div class="sa-erz" title="' + esc(e.text) + '"><i style="background:' + e.farbe + '"></i><span><b>' + esc(e.name) + '</b>' + fmt(anz) + ' × · ' + fmt(e.wert) + ' P</span></div>'
          : '<div class="sa-erz neu"><i style="background:#3b3746"></i><span><b>???</b>ab ' + SOHLEN[e.sohle].m + ' m</span></div>';
      });
      h += '</div><h3>📊 Statistik</h3><div class="sa-stat" data-el="stat"></div>';
      h += '<button class="sa-reset" data-act="reset">Spielstand löschen</button>';
      var top = shop.scrollTop; shop.innerHTML = h; shop.scrollTop = top;
      shopAktualisieren();
    }
    function shopAktualisieren() {
      shop.querySelectorAll('[data-kauf]').forEach(function (b) {
        var c = b.getAttribute('data-kauf'), preis;
        if (c === 'tiefer') preis = tiefPreis(g.tiefe);
        else if (c.indexOf('u:') === 0) preis = UPGS.filter(function (u) { return u.id === c.slice(2); })[0].preis;
        else {
          var p = PROD.filter(function (x) { return x.id === c.slice(2); })[0], hat = g.prod[p.id] || 0;
          preis = prodPreis(p, hat, r.menge);
          b.querySelector('[data-pr]').textContent = fmt(preis) + ' P';
          b.querySelector('[data-anz]').textContent = hat || '';
          b.querySelector('[data-ef]').textContent = '+' + fmtPS(p.pps * d.prodM[p.id] * tiefMult(g.tiefe)) + ' Para/s je Stück' + (hat ? ' · gesamt ' + fmtPS(hat * p.pps * d.prodM[p.id] * tiefMult(g.tiefe)) : '');
        }
        b.classList.toggle('kann', g.para >= preis);
      });
      var st = shop.querySelector('[data-el=stat]');
      if (st) st.innerHTML = 'Insgesamt gegraben: ' + fmt(g.gesamt) + ' Para<br>Klicks: ' + fmt(g.klicks) + ' · pro Klick ca. ' + fmt(klickSchnitt()) + ' Para<br>Schatzi geantwortet: ' + g.herzen + '×' +
        '<br>Rekord-Tiefe: ' + Math.max(+Pixel.get(BEST_KEY, 0), meter(g.tiefe)) + ' m' +
        '<br>Looks-Bonus: +' + Math.round((lookMult() - 1) * 100) + ' % · Gemoggt: ' + gemoggt() + '/' + GEGNER.length;
    }
    function klickSchnitt() {
      var s = 0, w = 0;
      ERZE.forEach(function (e) { if (e.sohle > g.tiefe) return; var x = e.gewicht || (e.sohle === g.tiefe ? 3 : e.sohle === g.tiefe - 1 ? 2 : 1); s += e.wert * x; w += x; });
      return s / w * erzMult(g.tiefe) * d.klick * lookMult() + d.anteil * ppsBasis();
    }

    // ---------- Bildschirme ----------
    function figur(mood) { var img = Sprites.saro(mood), c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); return c; }
    function intro(offline, sek) {
      ovl.classList.remove('aus');
      var neuStart = g.klicks === 0 && g.gesamt === 0;
      if (neuStart) {
        ovl.innerHTML = '<div class="sa-karte"><h1>Goldmine Frankfurt</h1><div class="unter">Saro sagt, er geht in Frankfurt Gold graben. Heute beweist er es. Angeblich.</div><div data-el="fig"></div>' +
          '<ul><li>⛏️ <b>Tippen/Klicken</b> auf die Mine (oder Leertaste) = graben.</li>' +
          '<li>💼 Para ausgeben: Crew &amp; Business graben für dich weiter – auch wenn du weg bist.</li>' +
          '<li>⬇️ <b>Tiefer graben</b> = neue Erze. Ganz unten wartet Gold. Und noch mehr.</li>' +
          '<li>💛 Schatzi schreibt? <b>Schnell antippen!</b> Ignorieren = Eifersucht.</li>' +
          '<li>📱 <b>Handy</b>: Looksmaxxing trainieren und Mog-Offs gegen die ganze Klasse. Bringt Bonus auf alles.</li></ul>' +
          '<button class="px-btn" data-act="los">Los, graben</button></div>';
      } else {
        ovl.innerHTML = '<div class="sa-karte"><h1>Willkommen zurück</h1><div class="unter">' +
          (offline > 0 ? 'Während du weg warst (' + Math.round(sek / 60) + ' min), hat die Crew weitergegraben:' : 'Die Mine wartet schon, Bruder.') + '</div><div data-el="fig"></div>' +
          (offline > 0 ? '<div class="zeile"><span>Offline gegraben</span><b>+' + fmt(offline) + '</b></div>' : '') +
          '<div class="zeile"><span>Para</span><b>' + fmt(g.para) + '</b></div><div class="zeile"><span>Sohle</span><b>' + meter(g.tiefe) + ' m</b></div>' +
          '<button class="px-btn" data-act="los">Weiter graben</button></div>';
      }
      ovl.querySelector('[data-el=fig]').appendChild(figur('cool'));
    }
    function los() {
      ovl.classList.add('aus'); r.modus = 'spiel';
      setTimeout(function () { if (alive) sag('saro', g.klicks ? 'Zurück im Business.' : 'Gold graben in Frankfurt. Ganz normal.', 2.4); }, 500);
      Pixel.sfx.tone(392, 0.08, 'square', 0.05); Pixel.sfx.tone(523, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(659, 0.15, 'square', 0.05, null, 0.18);
    }
    function zuruecksetzen() {
      if (!window.confirm('Wirklich alles löschen? Die Mine wird zugeschüttet.')) return;
      g = neu(); rechnen(); handyZu(); r.klebe = r.eifer = r.power = 0; herzWeg(); r.herzAb = 25; wandFuellen(); speichern(); sig = ''; shopBauen(); intro(0, 0); r.modus = 'intro';
    }

    // ---------- Handy: LooksMax, Mog-Off, Chats ----------
    var handyEl = $('handy'), appEl = $('app');
    function handyAuf() {
      if (r.modus !== 'spiel') return;
      r.handy = true; handyEl.classList.remove('aus');
      var j = new Date(); $('uhr').textContent = String(j.getHours()).padStart(2, '0') + ':' + String(j.getMinutes()).padStart(2, '0');
      handyNav('home');
      Pixel.sfx.tone(1200, 0.04, 'sine', 0.04); Pixel.sfx.tone(1600, 0.05, 'sine', 0.04, null, 0.05);
    }
    function handyZu() { r.handy = false; r.timing = null; handyEl.classList.add('aus'); }
    function bild(img) {
      var c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0); return c;
    }
    // zeigt eine App-Seite; Platzhalter <span data-spr="saro:mood"> / <span data-spr="g:3"> werden zu Pixel-Figuren
    function zeige(h) {
      appEl.innerHTML = h; appEl.scrollTop = 0;
      appEl.querySelectorAll('[data-spr]').forEach(function (el) {
        var t = el.getAttribute('data-spr').split(':');
        el.appendChild(bild(t[0] === 'g' ? GEGNER[+t[1]].spr() : Sprites.saro(t[1])));
      });
    }
    function kopf(titel, zurueck) {
      return '<div class="sa-h-kopf">' + (zurueck ? '<button data-h="' + zurueck + '" aria-label="Zurück">‹</button>' : '<span></span>') + '<b>' + titel + '</b><span></span></div>';
    }
    function lvBalken(n) { var h = '<span class="sa-lv">'; for (var i = 0; i < 10; i++) h += '<i' + (i < n ? ' class="an"' : '') + '></i>'; return h + '</span>'; }
    function psl(filter) { return Math.min(10, 2 + lookSumme() / 40 * 6 + (filter ? 2.5 : 0)).toFixed(1).replace('.', ','); }
    function trainPreis(id) { return Math.round(200 * Math.pow(4, lv(id))); }
    function look(id) { return LOOKS.filter(function (l) { return l.id === id; })[0]; }
    function handyNav(ziel) {
      if (ziel === 'tap') return tap();
      r.timing = null;
      var t = ziel.split(':');
      if (t[0] === 'zu') return handyZu();
      if (t[0] === 'home') return homeScreen();
      if (t[0] === 'looks') return looksApp();
      if (t[0] === 'train') return training(t[1]);
      if (t[0] === 'trainlos') return trainLos(t[1]);
      if (t[0] === 'mog') return mogApp();
      if (t[0] === 'gegner') return gegnerSeite(+t[1]);
      if (t[0] === 'moglos') return mogLos(+t[1]);
      if (t[0] === 'chats') return chats();
    }
    function homeScreen() {
      var wall = g.upg.name ? 'Hintergrund: Schatzi 💛' : 'Hintergrund: Spiegel-Selfie (Kinn hoch)';
      zeige('<div class="sa-h-uhr">' + $('uhr').textContent + '</div><div class="sa-h-wall">' + wall + '</div>' +
        '<div class="sa-h-grid"><button data-h="looks"><i>🗿</i>LooksMax</button><button data-h="mog"><i>⚔️</i>Mog-Off</button>' +
        '<button data-h="chats"><i>💬</i>Chats</button><button data-h="zu"><i>✕</i>Weglegen</button></div>' +
        '<div class="sa-h-widget">PSL-Rating<b>' + psl(false) + '</b>mit Filter: ' + psl(true) + '<br>Bonus auf alles: +' + Math.round((lookMult() - 1) * 100) + ' %<br>Gemoggt: ' + gemoggt() + '/' + GEGNER.length + '</div>');
    }
    function looksApp() {
      var h = kopf('LooksMax', 'home') +
        '<div class="sa-h-karte"><span data-spr="saro:' + (lookSumme() >= 20 ? 'stolz' : 'cool') + '"></span><span>PSL <b>' + psl(false) + '</b><br>mit Filter: ' + psl(true) +
        '<br>Jedes Level: +3 % Para</span></div>';
      LOOKS.forEach(function (l) {
        var n = lv(l.id);
        h += '<button class="sa-h-row" data-h="train:' + l.id + '"><span class="ic">' + l.ic + '</span><span class="mid"><span class="nm">' + l.name + ' · Lv ' + n + '</span>' +
          '<span class="tx">' + l.app + '</span>' + lvBalken(n) + '</span><span class="pr">' + (n >= 10 ? 'MAX' : fmt(trainPreis(l.id)) + ' P') + '</span></button>';
      });
      zeige(h);
    }
    function training(id) {
      var l = look(id), n = lv(id), pr = trainPreis(id);
      if (n >= 10) {
        zeige(kopf(l.app, 'looks') + '<div class="sa-h-info">' + l.name + ' ist auf Level 10. Mehr geht nicht. Sagt sogar der Filter.</div>' +
          '<button class="sa-h-btn alt" data-h="looks">Zurück</button>');
        return;
      }
      zeige(kopf(l.app, 'looks') + '<div class="sa-h-karte"><span class="ic" style="font-size:30px">' + l.ic + '</span><span>' + l.text + '</span></div>' +
        '<div class="sa-h-info"><b>' + l.name + ' Lv ' + n + ' → ' + (n + 1) + '</b><br>3 Versuche: Tipp auf STOP (oder Leertaste), wenn die Nadel im grünen Feld ist. Gelb = perfekt (zählt doppelt). ' +
        'Du brauchst 3 Punkte. Je höher das Level, desto schneller und kleiner.</div>' +
        '<button class="sa-h-btn" data-h="trainlos:' + id + '"' + (g.para < pr ? ' disabled' : '') + '>Training starten · ' + fmt(pr) + ' P</button>' +
        (g.para < pr ? '<div class="sa-h-info">Zu wenig Para. Erst graben, dann glänzen.</div>' : ''));
    }
    function timingHtml(f) {
      return '<div class="sa-tim"><div class="z" style="left:' + (f.a * 100) + '%;width:' + (f.w * 100) + '%"><div class="p"></div></div><div class="n"></div></div>' +
        '<button class="sa-h-btn sa-tap" data-h="tap">STOP!</button><div class="sa-h-fb" data-el="fb"></div>';
    }
    // startet eine Timing-Runde: Seite zeigen, dann Nadel laufen lassen
    function timingRunde(h, breite, tempo, fertig) {
      var t = { pos: 0, dir: 1, speed: tempo, a: rnd(0.08, 0.92 - breite), w: breite, fertig: fertig };
      zeige(h + timingHtml(t));
      t.el = appEl.querySelector('.sa-tim .n'); r.timing = t;
    }
    function tap() {
      var t = r.timing; if (!t) return;
      r.timing = null;
      var mitte = t.a + t.w / 2, ab = Math.abs(t.pos - mitte), q = ab <= t.w * 0.17 ? 2 : ab <= t.w / 2 ? 1 : 0;
      var fb = appEl.querySelector('[data-el=fb]');
      if (fb) fb.innerHTML = q === 2 ? '<b>PERFEKT!</b>' : q === 1 ? '<b class="gruen">GUT</b>' : '<b class="rot">DANEBEN</b>';
      appEl.querySelectorAll('[data-h=tap]').forEach(function (b) { b.disabled = true; });
      if (q === 2) { Pixel.sfx.tone(880, 0.06, 'square', 0.05); Pixel.sfx.tone(1320, 0.1, 'square', 0.05, null, 0.06); }
      else if (q === 1) Pixel.sfx.tone(660, 0.08, 'square', 0.05);
      else Pixel.sfx.tone(150, 0.15, 'sawtooth', 0.05, 110);
      t.fertig(q);
    }
    function spaeter(fn, ms) { setTimeout(function () { if (alive && r.handy) fn(); }, ms); }
    function trainLos(id) {
      var pr = trainPreis(id); if (g.para < pr || lv(id) >= 10) return training(id);
      g.para -= pr; r.training = { id: id, versuch: 0, punkte: 0 };
      trainRunde();
    }
    function trainRunde() {
      var tr = r.training, l = look(tr.id), n = lv(tr.id);
      timingRunde(kopf(l.app, '') + '<div class="sa-h-score">VERSUCH ' + (tr.versuch + 1) + '/3 · PUNKTE ' + tr.punkte + '/3</div><div class="sa-h-info" style="text-align:center">' + l.text + '</div>',
        Math.max(0.1, 0.3 - n * 0.02), 0.9 + n * 0.13,
        function (q) { tr.punkte += q; tr.versuch++; spaeter(tr.versuch < 3 ? trainRunde : trainEnde, 750); });
    }
    function trainEnde() {
      var tr = r.training, l = look(tr.id), ok = tr.punkte >= 3;
      if (ok) { g.looks[tr.id] = lv(tr.id) + 1; speichern(); sig = ''; }
      zeige(kopf(l.app, 'looks') + '<div style="text-align:center"><span data-spr="saro:' + (ok ? 'stolz' : 'schock') + '"></span></div>' +
        '<div class="sa-h-fb">' + (ok ? '<b class="gruen">LEVEL UP! ' + l.name.toUpperCase() + ' ' + lv(tr.id) + '</b>' + pick(l.ok) : '<b class="rot">FEHLGESCHLAGEN</b>' + pick(l.fail) + ' (' + tr.punkte + '/3 Punkte)') + '</div>' +
        (lv(tr.id) < 10 ? '<button class="sa-h-btn" data-h="train:' + tr.id + '">Nochmal · ' + fmt(trainPreis(tr.id)) + ' P</button>' : '') +
        '<button class="sa-h-btn alt" data-h="looks">Zurück zu LooksMax</button>');
      if (ok) { Pixel.sfx.tone(523, 0.08, 'square', 0.05); Pixel.sfx.tone(784, 0.08, 'square', 0.05, null, 0.08); Pixel.sfx.tone(1047, 0.16, 'square', 0.05, null, 0.16); }
    }
    function frei(i) { return i === 0 || !!g.mog[GEGNER[i - 1].id]; }
    function mogApp() {
      var h = kopf('Mog-Off', 'home') + '<div class="sa-h-info">Leg dich mit der Klasse an: drei Runden, zufällige Kategorie, Pose im richtigen Moment. Wer zuerst 2 Runden holt, moggt. ' +
        'Erster Sieg gegen jemanden: +5 % auf alles.</div>';
      GEGNER.forEach(function (x, i) {
        var ok = frei(i), siege = g.mog[x.id] || 0, schnitt = (x.s.reduce(function (a, b) { return a + b; }, 0) / 4).toFixed(1).replace('.', ',');
        h += ok ? '<button class="sa-h-row" data-h="gegner:' + i + '"><span data-spr="g:' + i + '"></span><span class="mid"><span class="nm">' + x.name + '</span>' +
            '<span class="tx">Ø Looks-Level ' + schnitt + '</span></span><span class="pr">' + (siege ? '✓ ×' + siege : 'Fordern') + '</span></button>'
          : '<div class="sa-h-row zu"><span class="ic">🔒</span><span class="mid"><span class="nm">???</span><span class="tx">Erst ' + GEGNER[i - 1].name + ' moggen</span></span></div>';
      });
      zeige(h);
    }
    function gegnerSeite(i) {
      var x = GEGNER[i], cd = (r.mogCd[x.id] || 0) - r.t, h = kopf(x.name, 'mog') +
        '<div class="sa-h-vs"><span data-spr="saro:cool"></span><b>VS</b><span data-spr="g:' + i + '"></span></div>' +
        '<div class="sa-h-quip">' + x.name.replace(' (Boss)', '') + ': „' + x.intro + '“</div><table class="sa-h-tab"><tr><td></td><td>SARO</td><td>' + x.name.split(' ')[0].toUpperCase() + '</td></tr>';
      LOOKS.forEach(function (l, k) { h += '<tr><td>' + l.ic + ' ' + l.name + '</td><td>' + lv(l.id) + '</td><td>' + x.s[k] + '</td></tr>'; });
      h += '</table><div class="sa-h-info">' + (g.mog[x.id] ? (cd > 0 ? 'Revanche-Preis wieder in ' + Math.ceil(cd) + ' s.' : 'Revanche-Preis: etwas Para.') : 'Erster Sieg: +5 % auf alles und ein dicker Para-Preis.') + '</div>' +
        '<button class="sa-h-btn" data-h="moglos:' + i + '">MOG-OFF!</button>';
      zeige(h);
    }
    function mogLos(i) {
      var k = [0, 1, 2, 3].sort(function () { return Math.random() - 0.5; });
      r.mog = { i: i, runde: 0, sw: 0, gw: 0, kats: k };
      Pixel.sfx.tone(220, 0.1, 'square', 0.05); Pixel.sfx.tone(330, 0.1, 'square', 0.05, null, 0.1);
      mogRunde();
    }
    function mogRunde() {
      var m = r.mog, x = GEGNER[m.i], k = m.kats[m.runde % 4], l = LOOKS[k];
      timingRunde(kopf('Runde ' + (m.runde + 1), '') + '<div class="sa-h-vs"><span data-spr="saro:cool"></span><b>VS</b><span data-spr="g:' + m.i + '"></span></div>' +
        '<div class="sa-h-score">SARO ' + m.sw + ' : ' + m.gw + ' ' + x.name.split(' ')[0].toUpperCase() + '</div>' +
        '<div class="sa-h-info" style="text-align:center">Kategorie: <b>' + l.ic + ' ' + l.name + '</b> (Lv ' + lv(l.id) + ' gegen ' + x.s[k] + ')<br>Pose im richtigen Moment!</div>',
        Math.max(0.12, 0.26 - m.i * 0.01), 1.1 + m.i * 0.09,
        function (q) {
          var saro = lv(l.id) * 10 + [0, 9, 18][q] + rnd(0, 6), geg = x.s[k] * 10 + rnd(0, 10), sieg = saro > geg;
          if (sieg) m.sw++; else m.gw++;
          var fb = appEl.querySelector('[data-el=fb]');
          if (fb) fb.innerHTML += sieg ? '<b class="gruen">SARO MOGGT!</b>' + pick(MOG_SIEG) : '<b class="rot">GEMOGGT …</b>' + pick(MOG_NIEDERLAGE);
          m.runde++;
          spaeter(m.sw >= 2 || m.gw >= 2 ? mogEnde : mogRunde, 1500);
        });
    }
    function mogEnde() {
      var m = r.mog, x = GEGNER[m.i], sieg = m.sw > m.gw, erst = sieg && !g.mog[x.id], preis = 0;
      if (sieg) {
        if (erst) preis = Math.max(500, ppsBasis() * 120) * (m.i + 1);
        else if ((r.mogCd[x.id] || 0) <= r.t) { preis = ppsBasis() * 20 + 100; r.mogCd[x.id] = r.t + 60; }
        g.mog[x.id] = (g.mog[x.id] || 0) + 1; g.para += preis; g.gesamt += preis; speichern(); sig = '';
        Pixel.sfx.tone(523, 0.1, 'square', 0.05); Pixel.sfx.tone(659, 0.1, 'square', 0.05, null, 0.1); Pixel.sfx.tone(784, 0.1, 'square', 0.05, null, 0.2); Pixel.sfx.tone(1047, 0.25, 'square', 0.05, null, 0.3);
      } else Pixel.sfx.tone(330, 0.25, 'triangle', 0.05, 220);
      var name = x.name.replace(' (Boss)', '');
      zeige(kopf(sieg ? 'Gemoggt!' : 'Verloren', 'mog') + '<div class="sa-h-vs"><span data-spr="saro:' + (sieg ? 'stolz' : 'schock') + '"></span><b>' + m.sw + ':' + m.gw + '</b><span data-spr="g:' + m.i + '"></span></div>' +
        '<div class="sa-h-quip">' + name + ': „' + (sieg ? x.verliert : x.gewinnt) + '“</div>' +
        '<div class="sa-h-fb">' + (sieg ? '<b class="gruen">' + (x.id === 'aro' ? 'BOSS GEMOGGT!' : 'SARO MOGGT ' + name.toUpperCase() + '!') + '</b>' +
          (preis ? '+' + fmt(preis) + ' Para' : 'Revanche-Preis noch nicht bereit.') + (erst ? '<br>+5 % auf alles, dauerhaft.' : '')
          : '<b class="rot">GEMOGGT VON ' + name.toUpperCase() + '</b>Tipp: in LooksMax trainieren.') + '</div>' +
        '<button class="sa-h-btn" data-h="gegner:' + m.i + '">Revanche</button>' +
        (sieg && GEGNER[m.i + 1] ? '<button class="sa-h-btn" data-h="gegner:' + (m.i + 1) + '">Nächster: ' + GEGNER[m.i + 1].name + '</button>' : '') +
        '<button class="sa-h-btn alt" data-h="mog">Zur Liste</button>');
      if (sieg && erst) sag('saro', x.id === 'aro' ? 'ICH HAB ARO GEMOGGT!' : 'Hab ' + name + ' gemoggt. Easy.', 2.4);
    }
    function chats() {
      function chat(wer, zeilen) {
        return '<div class="sa-h-chat"><h4>' + wer + '</h4>' + zeilen.map(function (z) { return '<div class="sa-h-msg' + (z[0] ? ' ich' : '') + '">' + esc(z[1]) + '</div>'; }).join('') + '</div>';
      }
      var m = meter(g.tiefe);
      zeige(kopf('Chats', 'home') +
        chat('💛 Schatzi', [[0, 'vermiss dich 🥺'], [1, 'bin unter tage schatz'], [0, 'schon wieder??'], [1, 'für uns 💍'], [0, 'partnerlook morgen?']]) +
        chat('🐻 Aro (Berlin)', [[0, 'Kleiner, wie läuft die Mine?'], [1, 'Läuft. Bin bei ' + m + ' m.'], [0, 'In Berlin wären das doppelt so viele.'], [1, 'Glaub ich dir, Bruder.'],
          [0, gemoggt() >= GEGNER.length ? 'Okay. Du hast mich gemoggt. Respekt.' : 'Komm mal moggen, wenn du dich traust.']]) +
        chat('👥 Die Jungs', [[0, 'Bro, zeig mal das Gold.'], [1, 'Kommt, kommt.'], [0, g.erze.gold ? 'Ist das … echt?' : 'Das ist Kies, Saro.'], [1, g.erze.gold ? 'Gold aus Frankfurt, Digga.' : 'Das ist Rohgold.'], [0, 'Wir glauben dir nicht.']]));
    }

    // ---------- Eingabe ----------
    szeneEl.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-act]')) return;
      if (e.button !== undefined && e.button > 0) return;
      e.preventDefault(); graben();
    });
    function kd(e) {
      if (e.key === 'Escape') { if (r.handy) { handyZu(); return; } stop(); onExit(); return; }
      if (r.handy) { if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) { e.preventDefault(); tap(); } return; }
      if (r.modus !== 'spiel') { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } } return; }
      if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat) { e.preventDefault(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); graben(); }
    }
    function onClick(e) {
      if (e.target === handyEl) { handyZu(); return; }
      var hn = e.target.closest && e.target.closest('[data-h]');
      if (hn) { handyNav(hn.getAttribute('data-h')); return; }
      var k = e.target.closest && e.target.closest('[data-kauf]');
      if (k) { kaufen(k.getAttribute('data-kauf')); return; }
      var m = e.target.closest && e.target.closest('[data-menge]');
      if (m) { r.menge = +m.getAttribute('data-menge'); shopBauen(); return; }
      var b = e.target.closest && e.target.closest('[data-act]');
      if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'los') los();
      if (a === 'herz') herzAntworten();
      if (a === 'handy') handyAuf();
      if (a === 'reset') zuruecksetzen();
      if (a === 'exit') { stop(); onExit(); }
      if (a === 'ton') { Pixel.setMuted(!Pixel.isMuted()); tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊'; }
    }
    function sichtbar() { if (document.hidden) speichern(); }
    function stop() {
      if (!alive) return;
      alive = false; cancelAnimationFrame(raf); clearTimeout(meldT);
      speichern();
      window.removeEventListener('keydown', kd); window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', sichtbar); window.removeEventListener('pagehide', speichern);
      root.removeEventListener('click', onClick);
    }

    // ---------- Start ----------
    g = laden(); rechnen();
    r = { modus: 'intro', t: 0, kacheln: [], partikel: [], herzchen: [], blasen: [], hack: 0, stolz: 0, beben: 0, klebe: 0, eifer: 0, power: 0,
      herz: null, herzAb: g.herzen ? herzAbstand() : 25, spruchAb: 8, menge: 1, buffHtml: '', handy: false, timing: null, training: null, mog: null, mogCd: {} };
    if (typeof g.looks !== 'object' || !g.looks) g.looks = {};
    if (typeof g.mog !== 'object' || !g.mog) g.mog = {};
    var sek = clamp((Date.now() - g.t) / 1000, 0, 8 * 3600), offline = sek > 60 ? ppsBasis() * sek * 0.5 : 0;
    if (offline > 0) { g.para += offline; g.gesamt += offline; }
    wandFuellen();
    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', sichtbar); window.addEventListener('pagehide', speichern);
    root.addEventListener('click', onClick);
    resize(); shopBauen(); intro(offline, sek); speichern();
    window.__saro = { g: function () { return g; }, r: function () { return r; }, graben: graben, kaufen: kaufen, herz: herzZeigen, antworten: herzAntworten, handy: handyNav, tap: tap };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.saro = { start: start };
})();
