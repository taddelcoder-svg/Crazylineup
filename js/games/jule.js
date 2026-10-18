// Jule: Wo bin ich?! – 2D-Pixel-Spiel, jeder Tag in drei Phasen.
// 1. Outfit: passend zum Anlass anziehen – aber Jule vergisst nach ein paar Sekunden, wohin sie will (nachschauen kostet Zeit).
// 2. Einpacken: Liste kurz merken, Sachen im Zimmer einsammeln. Jule ist klein: Hocker schieben, klettern, auf Zehenspitzen strecken.
// 3. Weg finden: Stadt von oben. Jule sieht kaum über Hecken (klein) und vergisst Gesehenes gleich wieder. HALLOOO! zeigt kurz den Weg.
// Ankunft: Check, was fehlt. 3 Herzen: zu spät oder Mode-Fail kostet eins.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.jule.best';
  var W0 = 160, H0 = 112;
  // Zimmer (Phase 2): Plattformen, auf die man von oben landet
  var BODEN = 100, HOCKER_Y = 88, HOCKER_W = 12;
  var MOEBEL = [{ x0: 6, x1: 50, y: 86 }, { x0: 92, x1: 124, y: 74 }, { x0: 104, x1: 130, y: 58 }, { x0: 134, x1: 158, y: 38 }];
  var PLAETZE = [{ x: 24, y: 100 }, { x: 70, y: 100 }, { x: 146, y: 100 }, { x: 14, y: 86 }, { x: 36, y: 86 }, { x: 96, y: 74 }, { x: 114, y: 74 },
    { x: 108, y: 58 }, { x: 121, y: 58 }, { x: 139, y: 38 }, { x: 150, y: 38 }];
  // Stadt (Phase 3): Labyrinth aus 6x4 Zellen = 13x9 Kacheln à 12 px
  var GW = 13, GH = 9, KA = 12, MX = 2, MY = 2;

  var ANLAESSE = [
    { id: 'schule', name: 'Schule', will: 'alltag', bonus: 'cozy', ziel: 'SCHULE', farbe: '#c8643a' },
    { id: 'party', name: 'Geburtstagsparty', will: 'party', ziel: 'PARTY', farbe: '#a84ae8' },
    { id: 'sport', name: 'Sportunterricht', will: 'sport', ziel: 'HALLE', farbe: '#3a8ae8' },
    { id: 'oma', name: 'Essen mit Oma', will: 'schick', ziel: 'OMA', farbe: '#e8a03a' },
    { id: 'film', name: 'Filmabend bei Freunden', will: 'cozy', ziel: 'FILM', farbe: '#3aae7a' },
    { id: 'stadt', name: 'Stadtbummel', will: 'alltag', bonus: 'schick', ziel: 'CITY', farbe: '#e83a6a' }
  ];
  var TEILE = [
    { id: 'T', name: 'Oberteil', opt: [
      { name: 'Schwarzer Cardigan', farbe: '#1c1c22', tags: ['schick', 'cozy', 'alltag'] },
      { name: 'Oversize-Hoodie', farbe: '#b8a8d8', tags: ['cozy', 'sport', 'alltag'] },
      { name: 'Glitzer-Top', farbe: '#e8a8e0', tags: ['party'] },
      { name: 'Weiße Bluse', farbe: '#f4f4ee', tags: ['schick', 'alltag'] },
      { name: 'Sport-Shirt', farbe: '#3ab0e8', tags: ['sport'] }] },
    { id: 'B', name: 'Unten', opt: [
      { name: 'Jeans', farbe: '#4a5a8a', tags: ['alltag', 'cozy'] },
      { name: 'Schwarzer Rock', farbe: '#24242a', tags: ['schick', 'party'] },
      { name: 'Jogginghose', farbe: '#9a9aa8', tags: ['sport', 'cozy'] },
      { name: 'Lederhose', farbe: '#3a2a22', tags: ['party', 'schick'] },
      { name: 'Shorts', farbe: '#e8d8b8', tags: ['sport', 'alltag'] }] },
    { id: 'K', name: 'Schuhe', opt: [
      { name: 'Weiße Sneaker', farbe: '#f2f2f2', tags: ['alltag', 'sport'] },
      { name: 'Boots', farbe: '#3a2418', tags: ['schick', 'cozy', 'alltag'] },
      { name: 'Rote Heels', farbe: '#c83a4a', tags: ['party', 'schick'] },
      { name: 'Laufschuhe', farbe: '#e8643a', tags: ['sport'] },
      { name: 'Hausschuhe', farbe: '#f0c8d8', tags: ['cozy'] }] },
    { id: 'A', name: 'Accessoire', opt: [
      { name: 'Mini-Bag', id: 'tasche', tags: ['schick', 'party', 'alltag'] },
      { name: 'Haarspange', id: 'spange', tags: ['alltag', 'party'] },
      { name: 'Sonnenbrille', id: 'brille', tags: ['party', 'alltag'] },
      { name: 'Beanie', id: 'muetze', tags: ['cozy', 'sport'] },
      { name: 'Nichts', id: 'nichts', tags: [] }] }
  ];
  // Sachen zum Einpacken; px = kleines 7x7-Pixelbild [dx, dy, w, h, Farbe]
  var SACHEN = [
    { id: 'handy', name: 'Handy', px: [[1, 0, 5, 7, '#1a1a22'], [2, 1, 3, 4, '#5ac8f0']] },
    { id: 'schluessel', name: 'Schlüssel', px: [[0, 1, 3, 3, '#e8c040'], [3, 2, 4, 1, '#e8c040'], [5, 3, 1, 2, '#e8c040'], [1, 2, 1, 1, '#8a6a20']] },
    { id: 'geld', name: 'Geldbeutel', px: [[0, 2, 7, 5, '#c84a7a'], [0, 2, 7, 1, '#e86a9a'], [3, 4, 1, 1, '#e8c040']] },
    { id: 'hausi', name: 'Hausaufgaben', px: [[0, 0, 6, 7, '#3a6ac8'], [1, 1, 4, 1, '#ffffff'], [1, 3, 4, 1, '#ffffff'], [1, 5, 3, 1, '#ffffff']] },
    { id: 'lipgloss', name: 'Lipgloss', px: [[2, 0, 3, 3, '#e83a6a'], [2, 3, 3, 4, '#d8d8e0']] },
    { id: 'kopfhoerer', name: 'Kopfhörer', px: [[1, 0, 5, 1, '#f2f2f2'], [0, 1, 1, 4, '#f2f2f2'], [6, 1, 1, 4, '#f2f2f2'], [0, 4, 2, 3, '#d8d8e0'], [5, 4, 2, 3, '#d8d8e0']] },
    { id: 'brotdose', name: 'Brotdose', px: [[0, 2, 7, 5, '#3aae5a'], [0, 2, 7, 1, '#6ad88a']] },
    { id: 'schirm', name: 'Regenschirm', px: [[1, 0, 5, 1, '#8a4ae8'], [0, 1, 7, 2, '#8a4ae8'], [3, 3, 1, 4, '#3a3a3a'], [2, 6, 1, 1, '#3a3a3a']] },
    { id: 'kabel', name: 'Ladekabel', px: [[0, 5, 5, 1, '#f2f2f2'], [4, 2, 1, 4, '#f2f2f2'], [3, 0, 3, 2, '#d8d8e0']] },
    { id: 'gummi', name: 'Haargummi', px: [[1, 2, 5, 1, '#ff7ab0'], [1, 5, 5, 1, '#ff7ab0'], [1, 2, 1, 4, '#ff7ab0'], [5, 2, 1, 4, '#ff7ab0']] },
    { id: 'flasche', name: 'Trinkflasche', px: [[2, 0, 3, 1, '#3a3a3a'], [1, 1, 5, 6, '#5ac8f0'], [1, 3, 5, 1, '#f2f2f2']] },
    { id: 'ausweis', name: 'Schülerausweis', px: [[0, 1, 7, 5, '#f2f2f2'], [1, 2, 2, 2, '#e8a888'], [4, 2, 2, 1, '#3a6ac8'], [4, 4, 2, 1, '#3a6ac8']] },
    { id: 'beutel', name: 'Sportbeutel', px: [[1, 1, 5, 6, '#e8643a'], [2, 0, 1, 1, '#3a3a3a'], [4, 0, 1, 1, '#3a3a3a']] }
  ];
  var NICHTS_ANZ = ['Ich hab NICHTS zum Anziehen!', 'Wohin wollte ich nochmal?', 'Passt das zusammen?', 'Ich brauch noch fünf Minuten!'];
  var VERGESSEN = ['Moment … wohin wollte ich?', 'Wofür zieh ich mich nochmal an?', 'Äh … wo geh ich hin?'];
  var ZU_KLEIN = ['Zu hoch!!', 'Wer stellt das so hoch?!', 'Ich komm nicht ran!', 'Bin doch nicht 1,90!'];
  var HANDY_WO = ['Wo ist mein Handy?!', 'Hat wer mein Handy gesehen?', 'Mein Handy ist weg!!'];
  var HALLO = ['HALLOOOO?!', 'IST DA WER?!', 'WO BIN ICH?!', 'HILFEEE!'];
  var AUA = ['Aua, meine Ohren!', 'Ganz schön hoch, die Stimme.', 'Das Glas hat gewackelt!', 'Wuff! Wuff!'];

  var CSS = [
    '.ju{position:absolute;inset:0;overflow:hidden;background:#1a1620;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.ju canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.ju-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.ju-top button{pointer-events:auto}',
    '.ju-hud{flex:1;text-align:center;text-shadow:2px 2px 0 #000;opacity:0;transition:opacity .3s}',
    '.ju-hud.an{opacity:1}',
    '.ju-hud b{display:block;font:clamp(10px,3vw,14px)/1.4 "Press Start 2P",monospace;color:#ffb8d8}',
    '.ju-hud small{display:block;font-size:15px;margin-top:2px}',
    '.ju-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:3px 8px;font-size:14px;white-space:nowrap;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:juPop .15s}',
    '.ju-blase.rosa{background:#ffe0ee}',
    '.ju-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:inherit;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes juPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.ju-meldung{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;z-index:19;width:92%}',
    '.ju-meldung b{display:block;font:clamp(12px,3.6vw,20px)/1.3 "Press Start 2P",monospace;color:#ffb8d8;text-shadow:3px 3px 0 #000}',
    '.ju-meldung small{display:block;font-size:17px;text-shadow:2px 2px 0 #000;margin-top:6px}',
    '.ju-meldung.zeigen{animation:juMeld 2s ease-out}',
    '@keyframes juMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0}}',
    '.ju-panel{position:absolute;left:50%;bottom:calc(10px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(440px,94vw);z-index:22;display:none;',
    ' background:#fdf2f6;color:#2a1a24;border:4px solid #2a1a24;box-shadow:6px 6px 0 #c84a7a;padding:8px 10px}',
    '.ju-panel.an{display:block}',
    '.ju-anlass{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}',
    '.ju-anlass span{font-size:17px}.ju-anlass b{font:10px/1.5 "Press Start 2P",monospace;color:#c84a7a}',
    '.ju-anlass button{font:8px/1.3 "Press Start 2P",monospace;padding:7px 8px;border:3px solid #2a1a24;background:#ffd23f;cursor:pointer;flex:none}',
    '.ju-teil{display:flex;align-items:center;gap:6px;margin:4px 0}',
    '.ju-teil small{width:84px;flex:none;font:8px "Press Start 2P",monospace;opacity:.7}',
    '.ju-teil span{flex:1;text-align:center;font-size:16px}',
    '.ju-teil button{width:42px;height:36px;border:3px solid #2a1a24;background:#fff;font:16px "Press Start 2P",monospace;cursor:pointer;flex:none}',
    '.ju-teil button:active{background:#ffd0e0}',
    '.ju-panel .px-btn{width:100%;margin-top:6px}',
    '.ju-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;align-items:flex-end;padding:0 12px calc(12px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.ju-pad.an{display:flex}',
    '.ju-pad div{display:flex;gap:8px;align-items:flex-end}',
    '.ju-pad button{pointer-events:auto;width:70px;height:70px;border-radius:50%;border:3px solid rgba(255,255,255,.75);background:rgba(20,20,26,.5);color:#fff;font:10px/1.2 "Press Start 2P",monospace;touch-action:none}',
    '.ju-pad button.gross{width:84px;height:84px}',
    '.ju-pad button.gedrueckt{background:rgba(232,90,150,.6)}',
    '.ju-pad .kreuz{display:grid;grid-template-columns:repeat(3,58px);grid-template-rows:repeat(3,58px);gap:2px}',
    '.ju-pad .kreuz button{width:58px;height:58px;border-radius:10px}',
    '.ju-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,8,14,.6);z-index:40;padding:16px;overflow:auto}',
    '.ju-ovl.aus{display:none}',
    '.ju-karte{width:min(460px,100%);background:#fdf2f6;color:#2a1a24;border:4px solid #2a1a24;box-shadow:8px 8px 0 #c84a7a;padding:16px 18px;text-align:center;margin:auto}',
    '.ju-karte h1{margin:4px 0;font:clamp(15px,4.4vw,22px)/1.3 "Press Start 2P",monospace;color:#c84a7a}',
    '.ju-karte h1.rot{color:#d83a3a}',
    '.ju-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.ju-karte canvas{position:static;height:76px;width:auto;margin:4px auto}',
    '.ju-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.ju-karte li{margin-bottom:4px}',
    '.ju-karte .zeile{display:flex;justify-content:space-between;gap:8px;border-top:2px dashed rgba(42,26,36,.3);padding:6px 0;font-size:17px;text-align:left}',
    '.ju-karte .zeile b{font:10px/1.7 "Press Start 2P",monospace;color:#c84a7a;white-space:nowrap}',
    '.ju-karte .zitat{font-size:17px;margin:6px 0}.ju-karte .zitat i{color:#6a5a64}',
    '.ju-karte .px-btn{width:100%;margin-top:8px}',
    '.ju-liste{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;text-align:left;font-size:16px;margin:8px 0}',
    '.ju-liste .nein{color:#d83a3a}.ju-liste .ja{color:#2a8a4a}.ju-liste .extra{color:#a87a2a}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function mischen(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function hash(n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="ju"><canvas></canvas>' +
      '<div class="ju-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="ju-hud" data-el="hud"><b data-el="titel"></b><small data-el="info"></small></div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="ju-meldung" data-el="meldung"></div>' +
      '<div class="ju-panel" data-el="panel"></div>' +
      '<div class="ju-pad" data-el="pad"></div>' +
      '<div class="ju-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.ju'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), panel = $('panel'), pad = $('pad'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now(), meldT = 0;
    var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;

    // ---------- Layout ----------
    var S = 3, IW = 0, IH = 0, OX = 0, OY = 0;
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight, unten = g && g.phase === 'outfit' ? (panel.offsetHeight || 300) + 20 : touch ? 170 : 20;
      S = Math.min(SW / W0, Math.max(120, SH - 70 - unten) / H0);
      S = S >= 3 ? Math.floor(S) : Math.max(1.5, S);
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      OX = Math.floor((IW - W0) / 2);
      OY = clamp(Math.ceil(66 / S), 0, Math.max(0, IH - H0));
      if (!touch && (!g || g.phase !== 'outfit')) OY = Math.max(OY, Math.floor((IH - H0) / 2));
    }

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = { tag: 0, herzen: 3, punkte: 0, phase: 'intro', t: 0, rest: 0, blasen: [], partikel: [], ende: false,
        anlass: null, wahl: [0, 0, 0, 0], sichtbar: 0, nachgeschaut: 0, vergessen: false, outfitProz: 0,
        liste: [], dinge: [], dabei: [], j: null, hocker: 70, streck: 0, kleinT: 0, handyT: 0, verlorenT: 0,
        karte: null, pos: null, ziel: null, gesehen: null, rufCd: 0, rufT: 0, pfad: null, verwirrt: 0, verwirrtAb: 0, mov: 0, wackeln: 0, ankunft: null };
    }
    function melde(txt, klein) {
      var el = $('meldung'); el.className = 'ju-meldung'; el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 2000);
    }
    // Sprechblase an Bühnen-Koordinaten (x Mitte, y Oberkante)
    function sag(txt, x, y, dauer, andere) {
      g.blasen.forEach(function (b) { b.el.remove(); }); g.blasen = [];
      var el = document.createElement('div'); el.className = 'ju-blase' + (andere ? '' : ' rosa'); el.textContent = txt; wrap.appendChild(el);
      g.blasen.push({ el: el, x: x, y: y, t: dauer || 1.8 });
    }
    function sagJule(txt, dauer) {
      var x = 80, y = 10;
      if (g.phase === 'packen') { x = g.j.x; y = g.j.y - 26; }
      else if (g.phase === 'weg') { x = MX + (g.pos.x + 0.5) * KA; y = MY + g.pos.y * KA - 2; }
      sag(txt, x, y, dauer);
    }
    function blasenPos(b) {
      var hb = b.el.offsetWidth / 2 + 4;
      b.el.style.left = clamp((OX + b.x) * S, hb, wrap.clientWidth - hb) + 'px';
      b.el.style.top = Math.max(b.el.offsetHeight + 66, (OY + b.y) * S) + 'px';
    }
    function farben() { return { T: TEILE[0].opt[g.wahl[0]].farbe, B: TEILE[1].opt[g.wahl[1]].farbe, K: TEILE[2].opt[g.wahl[2]].farbe }; }
    function sachen(id) { for (var i = 0; i < SACHEN.length; i++) if (SACHEN[i].id === id) return SACHEN[i]; }

    // ---------- Phase 1: Outfit ----------
    function outfitStart() {
      g.phase = 'outfit'; g.anlass = pick(ANLAESSE.filter(function (a) { return !g.letzter || a.id !== g.letzter; })); g.letzter = g.anlass.id;
      g.wahl = [0, 1, 2, 3].map(function (i) { return Math.floor(Math.random() * TEILE[i].opt.length); });
      g.rest = 22; g.sichtbar = Math.max(2.5, 4.5 - g.tag * 0.4); g.nachgeschaut = 0; g.vergessen = false;
      panel.classList.add('an'); pad.classList.remove('an'); panelBauen(); resize();
      melde('Tag ' + (g.tag + 1), 'Erst mal anziehen …');
      setTimeout(function () { if (alive && g.phase === 'outfit') sagJule(pick(NICHTS_ANZ), 1.8); }, 700);
    }
    function panelBauen() {
      var h = '<div class="ju-anlass"><span>Heute: <b data-el="anlass"></b></span><button data-act="nachschauen">📱 Nachschauen −3 s</button></div>';
      TEILE.forEach(function (t, i) {
        h += '<div class="ju-teil"><small>' + t.name.toUpperCase() + '</small><button data-teil="' + i + '" data-d="-1" aria-label="zurück">‹</button>' +
          '<span data-el="teil' + i + '"></span><button data-teil="' + i + '" data-d="1" aria-label="weiter">›</button></div>';
      });
      h += '<button class="px-btn" data-act="fertig">Fertig angezogen</button>';
      panel.innerHTML = h; panelAktualisieren();
    }
    function panelAktualisieren() {
      var a = $('anlass'); if (!a) return;
      a.textContent = g.sichtbar > 0 ? g.anlass.name : '??? (vergessen)';
      TEILE.forEach(function (t, i) { $('teil' + i).textContent = t.opt[g.wahl[i]].name; });
    }
    function teilWechseln(i, dlt) {
      if (g.phase !== 'outfit') return;
      var n = TEILE[i].opt.length; g.wahl[i] = (g.wahl[i] + dlt + n) % n; panelAktualisieren();
      Pixel.sfx.tone(700 + i * 80, 0.04, 'square', 0.03);
    }
    function nachschauen() {
      if (g.phase !== 'outfit') return;
      g.rest = Math.max(1, g.rest - 3); g.sichtbar = 1.6; g.nachgeschaut++; panelAktualisieren();
      sagJule(pick(['Ach ja, genau!', 'Stimmt ja!', 'Ohh, DAS war es.']), 1.4);
      Pixel.sfx.tone(1200, 0.05, 'sine', 0.04);
    }
    function outfitWertung() {
      var a = g.anlass, s = 0;
      TEILE.forEach(function (t, i) { var tg = t.opt[g.wahl[i]].tags; if (tg.indexOf(a.will) >= 0) s += 25; else if (a.bonus && tg.indexOf(a.bonus) >= 0) s += 12; });
      return s;
    }
    function outfitFertig() {
      if (g.phase !== 'outfit') return;
      g.outfitProz = outfitWertung(); panel.classList.remove('an');
      var p = g.outfitProz;
      melde(p >= 75 ? 'Outfit: ' + p + ' % ✨' : p >= 40 ? 'Outfit: ' + p + ' %' : 'Outfit: ' + p + ' % 😬', p >= 75 ? 'Sitzt perfekt.' : p >= 40 ? 'Geht so.' : 'Für ' + g.anlass.name + '?! Mutig.');
      Pixel.sfx.tone(p >= 75 ? 880 : 440, 0.12, 'triangle', 0.05); Pixel.sfx.tone(p >= 75 ? 1320 : 330, 0.18, 'triangle', 0.05, null, 0.12);
      setTimeout(function () { if (alive && !g.ende) packenStart(); }, 900);
    }

    // ---------- Phase 2: Einpacken ----------
    function packenStart() {
      g.phase = 'packen'; resize();
      var n = Math.min(3 + g.tag, 8), pool = mischen(SACHEN.filter(function (s) { return s.id !== 'handy'; }));
      g.liste = ['handy'].concat(pool.slice(0, n - 1).map(function (s) { return s.id; }));
      var falsch = pool.slice(n - 1, n - 1 + 2 + Math.floor(g.tag / 2)).map(function (s) { return s.id; });
      var plaetze = mischen(PLAETZE);
      // das Handy liegt nicht im Zimmer – Jule hat es die ganze Zeit in der Hand
      g.dinge = g.liste.slice(1).concat(falsch).map(function (id, i) { var p = plaetze[i % plaetze.length]; return { id: id, x: p.x, y: p.y, weg: false }; });
      g.karte = null; g.dabei = []; g.hocker = rnd(54, 76); g.streck = 0; g.kleinT = 0; g.handyT = rnd(6, 10); g.verlorenT = g.tag >= 1 ? rnd(12, 18) : 999;
      g.j = { x: 24, y: BODEN, vx: 0, vy: 0, auf: true, dir: 1 };
      g.rest = 34 + g.liste.length * 2; g.zeigeListe = Math.max(3, 5 - g.tag * 0.3);
      padBauen('packen');
      melde('Einpacken!', 'Merk dir die Liste …');
    }
    function plattformen() { return MOEBEL.concat([{ x0: g.hocker, x1: g.hocker + HOCKER_W, y: HOCKER_Y }]); }
    function reichweite() { return 1 + g.streck * 7; }
    function erreichbar(d) {
      var j = g.j;
      return !d.weg && j.auf && Math.abs(d.x + 3.5 - j.x) < 13 && d.y - 7 <= j.y && d.y >= j.y - 24 - reichweite();
    }
    function nehmen() {
      if (g.phase !== 'packen') return;
      var j = g.j;
      if (j.x < 16 && j.auf && j.y >= BODEN) return losgehen();
      var beste = null;
      g.dinge.forEach(function (d) { if (erreichbar(d) && (!beste || Math.abs(d.x - j.x) < Math.abs(beste.x - j.x))) beste = d; });
      if (beste) {
        beste.weg = true; g.dabei.push(beste.id);
        var s = sachen(beste.id); g.partikel.push({ txt: s.name.toUpperCase(), x: beste.x - 4, y: beste.y - 10, t: 0 });
        Pixel.sfx.tone(988, 0.05, 'square', 0.04); Pixel.sfx.tone(1319, 0.07, 'square', 0.04, null, 0.05);
        return;
      }
      // gibt's etwas über ihr, das sie nicht erreicht? → zu klein
      var drueber = g.dinge.some(function (d) { return !d.weg && Math.abs(d.x + 3.5 - j.x) < 11 && d.y < j.y - 24 - reichweite(); });
      if (drueber) { sagJule(pick(ZU_KLEIN) + (g.streck < 0.5 ? ' (↑ = strecken)' : ''), 1.6); Pixel.sfx.tone(300, 0.1, 'square', 0.04, 220); }
    }
    function losgehen() {
      if (g.phase !== 'packen') return;
      g.phase = 'zwischen'; pad.classList.remove('an'); allesLos();
      sagJule(pick(['Hab alles! Glaub ich.', 'Los geht\'s!', 'Was vergessen? Nee.']), 1.4);
      Pixel.sfx.noise(0.15, 0.08, 800);
      setTimeout(function () { if (alive && !g.ende) wegStart(); }, 900);
    }
    function packenUpdate(dt) {
      var j = g.j, links = halten.links, rechts = halten.rechts;
      g.zeigeListe = Math.max(0, g.zeigeListe - dt);
      j.vx = (rechts ? 1 : 0) - (links ? 1 : 0);
      if (j.vx) j.dir = j.vx;
      var strecken = halten.hoch && j.auf && !j.vx;
      g.streck = strecken ? Math.min(1, g.streck + dt * 2.5) : Math.max(0, g.streck - dt * 5);
      var x0 = j.x; j.x = clamp(j.x + j.vx * 56 * dt, 8, 154);
      // Hocker schieben, wenn sie am Boden dagegenläuft
      if (j.y >= BODEN - 0.5 && j.x + 5 > g.hocker && j.x - 5 < g.hocker + HOCKER_W) {
        if (j.vx > 0 && x0 + 5 <= g.hocker + 1) { g.hocker = clamp(j.x + 5, 52, 154 - HOCKER_W); j.x = g.hocker - 5; }
        else if (j.vx < 0 && x0 - 5 >= g.hocker + HOCKER_W - 1) { g.hocker = clamp(j.x - 5 - HOCKER_W, 52, 154 - HOCKER_W); j.x = g.hocker + HOCKER_W + 5; }
      }
      if (halten.sprung && j.auf) { j.vy = -150; j.auf = false; Pixel.sfx.tone(520, 0.06, 'square', 0.03, 780); }
      halten.sprung = false;
      var y0 = j.y; j.vy += 600 * dt; j.y += j.vy * dt; j.auf = false;
      if (j.y >= BODEN) { j.y = BODEN; j.vy = 0; j.auf = true; }
      else if (j.vy >= 0) plattformen().forEach(function (p) {
        if (y0 <= p.y + 0.5 && j.y >= p.y && j.x + 4 > p.x0 && j.x - 4 < p.x1) { j.y = p.y; j.vy = 0; j.auf = true; }
      });
      if (g.streck > 0.9) { g.kleinT -= dt; if (g.kleinT <= 0) { g.kleinT = 3; if (!g.dinge.some(erreichbar)) sagJule(pick(['Nngh … Zehenspitzen!', 'Noch ein bisschen …', 'Warum bin ich so klein?!']), 1.2); } }
      g.handyT -= dt;
      if (g.handyT <= 0) { g.handyT = 999; sagJule(pick(HANDY_WO), 1.6); setTimeout(function () { if (alive && g.phase === 'packen') sag('Jule … es ist in deiner HAND.', 80, 20, 1.8, true); }, 1700); }
      g.verlorenT -= dt;
      if (g.verlorenT <= 0) {
        g.verlorenT = 999;
        var richtig = g.dabei.filter(function (id) { return g.liste.indexOf(id) >= 0; });
        if (richtig.length) {
          var id = pick(richtig), d = g.dinge.filter(function (x) { return x.id === id; })[0], p = pick(PLAETZE);
          g.dabei.splice(g.dabei.indexOf(id), 1); d.weg = false; d.x = p.x; d.y = p.y;
          sagJule('Moment … hatte ich ' + (sachen(id).name === 'Schlüssel' ? 'den Schlüssel' : 'das ' + sachen(id).name) + '?', 2); melde('Verlegt!', sachen(id).name + ' liegt wieder irgendwo');
          Pixel.sfx.tone(330, 0.2, 'triangle', 0.05, 220);
        }
      }
      g.rest -= dt; if (g.rest <= 0) { g.rest = 0; losgehen(); }
    }

    // ---------- Phase 3: Weg finden ----------
    function labyrinth() {
      var k = [], x, y;
      for (y = 0; y < GH; y++) { k.push([]); for (x = 0; x < GW; x++) k[y].push(1); }
      var stapel = [[1, 1]]; k[1][1] = 0;
      while (stapel.length) {
        var c = stapel[stapel.length - 1], nb = [];
        [[2, 0], [-2, 0], [0, 2], [0, -2]].forEach(function (d) { var nx = c[0] + d[0], ny = c[1] + d[1]; if (nx > 0 && ny > 0 && nx < GW - 1 && ny < GH - 1 && k[ny][nx]) nb.push([nx, ny, d]); });
        if (!nb.length) { stapel.pop(); continue; }
        var n = pick(nb); k[c[1] + n[2][1] / 2][c[0] + n[2][0] / 2] = 0; k[n[1]][n[0]] = 0; stapel.push([n[0], n[1]]);
      }
      // ein paar Abkürzungen, damit es nicht nur Sackgassen gibt
      for (var i = 0; i < 4; i++) { x = 1 + Math.floor(Math.random() * (GW - 2)); y = 1 + Math.floor(Math.random() * (GH - 2)); if ((x + y) % 2 === 1) k[y][x] = 0; }
      return k;
    }
    function bfs(von, nach) {
      var vor = {}, q = [von], key = function (p) { return p.x + ',' + p.y; }; vor[key(von)] = null;
      while (q.length) {
        var p = q.shift(); if (p.x === nach.x && p.y === nach.y) break;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) {
          var n = { x: p.x + d[0], y: p.y + d[1] };
          if (n.x < 0 || n.y < 0 || n.x >= GW || n.y >= GH || g.karte[n.y][n.x] || key(n) in vor) return;
          vor[key(n)] = p; q.push(n);
        });
      }
      var weg = [], c = nach; if (!(key(nach) in vor)) return null;
      while (c) { weg.unshift(c); c = vor[key(c)]; }
      return weg;
    }
    function wegStart() {
      g.phase = 'weg'; g.karte = labyrinth(); g.pos = { x: 1, y: 1 }; g.zeigPos = { x: 1, y: 1 };
      var best = null, bl = 0;
      for (var y = 1; y < GH; y += 2) for (var x = 1; x < GW; x += 2) { var w = bfs(g.pos, { x: x, y: y }); if (w && w.length > bl) { bl = w.length; best = { x: x, y: y }; } }
      g.ziel = best; g.gesehen = {}; g.rufCd = 0; g.rufT = 0; g.pfad = null; g.verwirrt = 0; g.verwirrtAb = g.tag >= 1 ? rnd(8, 12) : rnd(14, 18); g.mov = 0;
      g.rest = Math.round(bl * 0.55 + 12); g.vergessenNach = Math.max(1.2, 2.6 - g.tag * 0.25);
      padBauen('weg'); resize();
      melde('Zum Ziel: ' + g.anlass.name, 'Jule sieht nicht über die Hecken …');
      setTimeout(function () { if (alive && g.phase === 'weg') sagJule(pick(['Wo bin ich?!', 'Das war doch hier links … oder?', 'Ich kenn den Weg! Glaub ich.']), 1.8); }, 900);
    }
    function rufen() {
      if (g.phase !== 'weg' || g.rufCd > 0) return;
      g.rufCd = 5; g.rufT = 1.6; g.pfad = bfs(g.pos, g.ziel); g.wackeln = 0.5;
      sagJule(pick(HALLO), 1.3);
      setTimeout(function () { if (alive && g.phase === 'weg') sag(pick(AUA), MX + (g.ziel.x + 0.5) * KA, MY + g.ziel.y * KA - 2, 1.4, true); }, 900);
      Pixel.sfx.tone(1760, 0.25, 'sine', 0.05, 2200); Pixel.sfx.tone(2093, 0.3, 'sine', 0.04, 2637, 0.2);
    }
    function schritt(dx, dy) {
      if (g.verwirrt > 0) dx = -dx;
      var nx = g.pos.x + dx, ny = g.pos.y + dy;
      if (nx < 0 || ny < 0 || nx >= GW || ny >= GH || g.karte[ny][nx]) { Pixel.sfx.tone(120, 0.04, 'square', 0.02); return; }
      g.pos = { x: nx, y: ny }; Pixel.sfx.tone(240 + (nx + ny) % 3 * 20, 0.03, 'square', 0.015);
      if (nx === g.ziel.x && ny === g.ziel.y) ankunft(true);
    }
    function wegUpdate(dt) {
      g.rufCd = Math.max(0, g.rufCd - dt); g.rufT = Math.max(0, g.rufT - dt); g.wackeln = Math.max(0, g.wackeln - dt);
      g.zeigPos.x += (g.pos.x - g.zeigPos.x) * Math.min(1, dt * 18); g.zeigPos.y += (g.pos.y - g.zeigPos.y) * Math.min(1, dt * 18);
      // Jule sieht nur direkt um sich herum – und vergisst es gleich wieder
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) g.gesehen[(g.pos.x + dx) + ',' + (g.pos.y + dy)] = g.t;
      if (g.verwirrt > 0) { g.verwirrt -= dt; if (g.verwirrt <= 0) { g.verwirrtAb = rnd(9, 15); melde('Links ist wieder links', ''); } }
      else { g.verwirrtAb -= dt; if (g.verwirrtAb <= 0) { g.verwirrt = 4; melde('Links? Rechts?!', 'Jule verwechselt die Seiten (4 s)'); sagJule('Wo ist nochmal links?', 1.5); Pixel.sfx.tone(440, 0.1, 'triangle', 0.05, 300); } }
      g.mov -= dt;
      var r = halten.rechts ? 1 : halten.links ? -1 : 0, u = halten.runter ? 1 : halten.hoch ? -1 : 0;
      if ((r || u) && g.mov <= 0) { g.mov = 0.14; if (r) schritt(r, 0); else schritt(0, u); }
      if (!r && !u) g.mov = 0;
      if (g.phase !== 'weg') return;
      g.rest -= dt; if (g.rest <= 0) { g.rest = 0; ankunft(false); }
    }

    // ---------- Ankunft ----------
    function ankunft(geschafft) {
      if (g.phase !== 'weg') return;
      g.phase = 'ankunft'; pad.classList.remove('an'); allesLos();
      var richtig = g.liste.filter(function (id) { return id === 'handy' || g.dabei.indexOf(id) >= 0; });
      var fehlt = g.liste.filter(function (id) { return richtig.indexOf(id) < 0; });
      var extra = g.dabei.filter(function (id) { return g.liste.indexOf(id) < 0; });
      var p = g.outfitProz * 3 + richtig.length * 80 - fehlt.length * 40 - extra.length * 30 + (geschafft ? Math.round(g.rest * 10) + 100 : 0);
      p = Math.max(0, p); g.punkte += p;
      var verloren = [];
      if (!geschafft) verloren.push('zu spät');
      if (g.outfitProz < 40) verloren.push('Mode-Fail');
      g.herzen = Math.max(0, g.herzen - verloren.length);
      g.ankunft = { geschafft: geschafft, richtig: richtig, fehlt: fehlt, extra: extra, p: p, verloren: verloren };
      if (geschafft) { Pixel.sfx.tone(523, 0.1, 'square', 0.05); Pixel.sfx.tone(659, 0.1, 'square', 0.05, null, 0.1); Pixel.sfx.tone(784, 0.2, 'square', 0.05, null, 0.2); }
      else Pixel.sfx.tone(330, 0.3, 'triangle', 0.05, 200);
      setTimeout(function () { if (alive) ergebnis(); }, geschafft ? 600 : 1000);
    }
    function figur(mood) {
      var img = Sprites.jule(mood, g && g.anlass ? farben() : null), c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      var x = c.getContext('2d'); x.drawImage(img, 0, 0); return c;
    }
    function ergebnis() {
      var a = g.ankunft, sz = function (id) { return sachen(id).name; };
      var kommentar = !a.geschafft ? 'Jule hat sich verlaufen. Wieder mal.' : a.fehlt.length ? 'Jule … wo ist ' + (a.fehlt[0] === 'schluessel' ? 'dein Schlüssel' : 'dein ' + sz(a.fehlt[0])) + '?' :
        g.outfitProz >= 75 ? 'Pünktlich, alles dabei UND gut angezogen?! Wer bist du?' : 'Alles dabei. Respekt.';
      var h = '<div class="ju-karte"><h1' + (a.geschafft ? '' : ' class="rot"') + '>' + (a.geschafft ? 'Angekommen!' : 'Zu spät!') + '</h1>' +
        '<div class="unter">Tag ' + (g.tag + 1) + ': ' + g.anlass.name + '</div><div data-el="fig"></div>' +
        '<div class="ju-liste">' + a.richtig.map(function (id) { return '<span class="ja">✓ ' + sz(id) + (id === 'handy' ? ' (in der Hand)' : '') + '</span>'; }).join('') +
        a.fehlt.map(function (id) { return '<span class="nein">✗ ' + sz(id) + '</span>'; }).join('') +
        a.extra.map(function (id) { return '<span class="extra">? ' + sz(id) + ' (unnötig)</span>'; }).join('') + '</div>' +
        '<div class="zitat"><i>„' + kommentar + '“</i></div>' +
        '<div class="zeile"><span>Outfit</span><b>' + g.outfitProz + ' %</b></div>' +
        '<div class="zeile"><span>Punkte heute</span><b>+' + a.p + '</b></div>' +
        '<div class="zeile"><span>Herzen' + (a.verloren.length ? ' (−' + a.verloren.join(', −') + ')' : '') + '</span><b>' + herzenText() + '</b></div>' +
        '<button class="px-btn" data-act="weiter">' + (g.herzen > 0 ? 'Nächster Tag' : 'Weiter') + '</button></div>';
      ovl.innerHTML = h; ovl.classList.remove('aus');
      ovl.querySelector('[data-el=fig]').appendChild(figur(a.geschafft && !a.fehlt.length ? 'happy' : a.geschafft ? 'verwirrt' : 'traurig'));
    }
    function herzenText() { var s = ''; for (var i = 0; i < 3; i++) s += i < g.herzen ? '♥' : '♡'; return s; }
    function weiter() {
      if (g.phase !== 'ankunft') return;
      if (g.herzen <= 0) return spielEnde();
      ovl.classList.add('aus'); g.tag++; outfitStart();
    }
    function spielEnde() {
      g.phase = 'ende'; g.ende = true;
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best; if (neu) Pixel.set(BEST_KEY, g.punkte);
      ovl.innerHTML = '<div class="ju-karte"><h1 class="rot">Feierabend!</h1><div class="unter">Jule hat für heute genug vergessen.</div><div data-el="fig"></div>' +
        '<div class="zeile"><span>Punkte</span><b>' + g.punkte + (neu ? ' ★' : '') + '</b></div>' +
        '<div class="zeile"><span>Tage geschafft</span><b>' + (g.tag + 1) + '</b></div>' +
        '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte) + '</b></div>' +
        '<button class="px-btn" data-act="los">Nochmal (wenn sie den Weg findet)</button><button class="px-btn alt" data-act="exit">Menü</button></div>';
      ovl.classList.remove('aus'); ovl.querySelector('[data-el=fig]').appendChild(figur('traurig'));
      $('hud').classList.remove('an');
    }

    // ---------- Eingabe ----------
    var halten = { links: false, rechts: false, hoch: false, runter: false, sprung: false };
    function allesLos() { halten = { links: false, rechts: false, hoch: false, runter: false, sprung: false }; pad.querySelectorAll('.gedrueckt').forEach(function (b) { b.classList.remove('gedrueckt'); }); }
    function padBauen(art) {
      pad.innerHTML = art === 'packen'
        ? '<div><button data-pad="links" aria-label="links">◀</button><button data-pad="rechts" aria-label="rechts">▶</button></div>' +
          '<div><button data-pad="hoch" aria-label="strecken">STRE-<br>CKEN</button><button data-pad="sprung" aria-label="springen">SPRUNG</button><button class="gross" data-pad="aktion" aria-label="nehmen">NEH-<br>MEN</button></div>'
        : '<div class="kreuz"><span></span><button data-pad="hoch" aria-label="hoch">▲</button><span></span><button data-pad="links" aria-label="links">◀</button><span></span>' +
          '<button data-pad="rechts" aria-label="rechts">▶</button><span></span><button data-pad="runter" aria-label="runter">▼</button><span></span></div>' +
          '<div><button class="gross" data-pad="aktion" aria-label="rufen">HAL-<br>LOOO!</button></div>';
      if (touch) pad.classList.add('an');
      allesLos();
    }
    function aktion() { if (g.phase === 'packen') nehmen(); else if (g.phase === 'weg') rufen(); }
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-pad]'); if (!b) return; e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (x) {}
      b.classList.add('gedrueckt');
      var a = b.getAttribute('data-pad');
      if (a === 'aktion') aktion(); else if (a === 'sprung') halten.sprung = true; else halten[a] = true;
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) {
      pad.addEventListener(n, function (e) { var b = e.target.closest('[data-pad]'); if (!b) return; b.classList.remove('gedrueckt'); var a = b.getAttribute('data-pad'); if (halten[a] !== undefined && a !== 'sprung') halten[a] = false; });
    });
    var TASTEN = { ArrowLeft: 'links', KeyA: 'links', ArrowRight: 'rechts', KeyD: 'rechts', ArrowUp: 'hoch', KeyW: 'hoch', ArrowDown: 'runter', KeyS: 'runter' };
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (!ovl.classList.contains('aus')) { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los],[data-act=weiter]'); if (b) { e.preventDefault(); b.click(); } } return; }
      if (g.phase === 'outfit') {
        if (e.key === 'Enter') { e.preventDefault(); outfitFertig(); }
        return;
      }
      var a = TASTEN[e.code];
      if (a) { e.preventDefault(); halten[a] = true; return; }
      if (e.code === 'Space') { e.preventDefault(); if (g.phase === 'weg') { if (!e.repeat) rufen(); } else if (!e.repeat) halten.sprung = true; return; }
      if ((e.code === 'KeyE' || e.code === 'Enter') && !e.repeat) { e.preventDefault(); aktion(); }
    }
    function ku(e) { var a = TASTEN[e.code]; if (a) halten[a] = false; }

    // ---------- Update ----------
    function update(dt) {
      g.t += dt;
      g.blasen = g.blasen.filter(function (b) { b.t -= dt; if (b.t <= 0) { b.el.remove(); return false; } return true; });
      g.partikel = g.partikel.filter(function (p) { p.t += dt; p.y -= dt * 12; return p.t < 1.2; });
      if (!ovl.classList.contains('aus')) return;
      if (g.phase === 'outfit') {
        var vorher = g.sichtbar > 0; g.sichtbar -= dt;
        if (vorher && g.sichtbar <= 0) { panelAktualisieren(); if (!g.vergessen) { g.vergessen = true; sagJule(pick(VERGESSEN), 1.8); } }
        g.rest -= dt; if (g.rest <= 0) { g.rest = 0; outfitFertig(); }
      } else if (g.phase === 'packen') packenUpdate(dt);
      else if (g.phase === 'weg') wegUpdate(dt);
    }

    // ---------- Zeichnen ----------
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x), Math.round(OY + y), Math.round(w), Math.round(h)); }
    function zimmer(t) {
      ctx.fillStyle = '#e8d8e8'; ctx.fillRect(0, 0, IW, OY + BODEN);
      ctx.fillStyle = '#b89a7a'; ctx.fillRect(0, OY + BODEN, IW, IH);
      for (var x = -OX; x < IW - OX; x += 10) R(x, BODEN, 1, IH, 'rgba(0,0,0,.08)');
      R(-OX, BODEN - 2, IW, 2, '#d8c8d8');
      // Dachschräge (wie auf dem Foto) und Fenster
      for (var y = 0; y < 34; y++) R(-OX, y, Math.max(0, 60 - y * 1.7 + OX), 1, 'rgba(160,150,170,.35)');
      R(60, 10, 26, 22, '#f4f4f4'); R(62, 12, 22, 18, '#9ad0f2'); R(72, 12, 1, 18, '#f4f4f4'); R(62, 20, 22, 1, '#f4f4f4');
      // Fotowand mit Bändern
      R(20, 30, 18, 26, '#e8c8a8'); for (var i = 0; i < 6; i++) R(21 + i * 3, 32 + (i % 2) * 3, 2, 18 - (i % 3) * 3, ['#e83a4a', '#f2f2f2', '#c8a8e8', '#1c1c22', '#f0c8d8', '#a8d8c8'][i]);
      // Tür
      R(1, 70, 12, 30, '#a87a5a'); R(2, 71, 10, 29, '#c8946e'); R(9, 86, 2, 2, '#e8c040'); Pixel.text(ctx, 'RAUS', OX + 0, OY + 64, 1, '#8a5a6a');
      // Bett
      R(6, 86, 44, 14, '#f4f0f4'); R(6, 84, 44, 3, '#e8a8c8'); R(8, 80, 12, 5, '#ffffff'); R(4, 76, 3, 24, '#a87a5a');
      // Schreibtisch + Lampe
      R(92, 74, 32, 3, '#c8946e'); R(94, 77, 2, 23, '#a87a5a'); R(120, 77, 2, 23, '#a87a5a'); R(106, 68, 1, 6, '#3a3a3a'); R(103, 66, 7, 3, '#f0d870');
      // Regale
      R(104, 58, 26, 2, '#a87a5a'); R(134, 38, 24, 2, '#a87a5a'); R(105, 60, 2, 3, '#8a5a3a'); R(127, 60, 2, 3, '#8a5a3a'); R(135, 40, 2, 3, '#8a5a3a'); R(155, 40, 2, 3, '#8a5a3a');
      // Hocker
      R(g.hocker, HOCKER_Y, HOCKER_W, 3, '#e8643a'); R(g.hocker + 1, HOCKER_Y + 3, 2, 9, '#a84a2a'); R(g.hocker + HOCKER_W - 3, HOCKER_Y + 3, 2, 9, '#a84a2a');
    }
    function sache(id, x, y, blink) {
      var s = sachen(id); s.px.forEach(function (p) { R(x + p[0], y - 7 + p[1], p[2], p[3], p[4]); });
      if (blink) R(x + 3, y - 10, 1, 1, '#ffffff');
    }
    function accessoire(id, x, y, s, flip) {
      function P(dx, dy, w, h, c) { if (flip) dx = 16 - dx - w; ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x + dx * s), Math.round(OY + y + dy * s), Math.round(w * s), Math.round(h * s)); }
      if (id === 'tasche') { P(13, 12, 1, 4, '#3a2a22'); P(13, 15, 4, 4, '#c84a7a'); P(13, 15, 4, 1, '#e86a9a'); }
      if (id === 'spange') { P(4, 2, 3, 1, '#ff7ab0'); P(5, 1, 1, 1, '#ffffff'); }
      if (id === 'brille') { P(4, 5, 3, 1, '#14141a'); P(9, 5, 3, 1, '#14141a'); P(7, 5, 2, 1, '#14141a'); }
      if (id === 'muetze') { P(3, 0, 10, 3, '#e8643a'); P(3, 2, 10, 1, '#c84a2a'); P(7, -1, 2, 1, '#f2f2f2'); }
    }
    function juleZeichnen(x, y, s, mood, flip, handy) {
      var img = Sprites.jule(mood, farben());
      Pixel.draw(ctx, img, OX + x, OY + y, s, flip);
      accessoire(TEILE[3].opt[g.wahl[3]].id, x, y, s, flip);
      if (handy) { var hx = flip ? x + 0 * s : x + 14 * s; ctx.fillStyle = '#1a1a22'; ctx.fillRect(Math.round(OX + hx), Math.round(OY + y + 12 * s), 2 * s, 3 * s); ctx.fillStyle = '#5ac8f0'; ctx.fillRect(Math.round(OX + hx), Math.round(OY + y + 12 * s), s, s); }
    }
    function renderOutfit(t) {
      zimmer(t);
      ctx.fillStyle = 'rgba(30,20,30,.35)'; ctx.fillRect(0, 0, IW, IH);
      // großer Spiegel
      R(48, 2, 64, 96, '#c8a87a'); R(51, 5, 58, 90, '#cfe8f4'); R(51, 5, 58, 90, 'rgba(255,255,255,.15)');
      for (var i = 0; i < 4; i++) R(56 + i * 14, 8 + i * 6, 2, 10, 'rgba(255,255,255,.5)');
      juleZeichnen(56, 18, 3, g.sichtbar > 0 ? 'neutral' : 'verwirrt', false, true);
      if (g.sichtbar <= 0 && Math.floor(t * 2) % 2) Pixel.text(ctx, '?', OX + 103, OY + 10, 3, '#c84a7a');
    }
    function renderPacken(t) {
      zimmer(t);
      g.dinge.forEach(function (d, i) { if (!d.weg) sache(d.id, d.x, d.y, Math.floor(t * 2 + i) % 4 === 0); });
      var j = g.j, mood = g.streck > 0.5 ? 'schock' : 'neutral', lauf = j.vx && j.auf ? Math.floor(t * 8) % 2 : 0;
      juleZeichnen(j.x - 8, j.y - 24 - g.streck * 2 - lauf, 1, mood, j.dir < 0, true);
      if (g.streck > 0.5) { R(j.x - 7, j.y - 31, 1, 6, '#f2d0b8'); R(j.x + 6, j.y - 31, 1, 6, '#f2d0b8'); }
      var nah = g.dinge.filter(erreichbar)[0];
      if (nah && Math.floor(t * 4) % 2) Pixel.text(ctx, 'E', OX + nah.x + 2, OY + nah.y - 15, 1, '#c84a7a');
      if (j.x < 16 && j.y >= BODEN && Math.floor(t * 3) % 2) Pixel.text(ctx, 'E', OX + 5, OY + 58, 1, '#c84a7a');
      // Merkliste (nur am Anfang zu sehen)
      if (g.zeigeListe > 0) {
        var h = 10 + g.liste.length * 7; R(30, 4, 70, h, '#fffbe8'); R(30, 4, 70, 1, '#c8a040');
        Pixel.text(ctx, 'MITNEHMEN:', OX + 34, OY + 7, 1, '#c84a7a');
        g.liste.forEach(function (id, i) { Pixel.text(ctx, asciiName(sachen(id).name), OX + 34, OY + 14 + i * 7, 1, '#2a1a24'); });
      }
      g.partikel.forEach(function (p) { ctx.globalAlpha = Math.max(0, 1 - p.t / 1.2); Pixel.text(ctx, asciiName(p.txt), OX + p.x, OY + p.y, 1, '#c84a7a'); ctx.globalAlpha = 1; });
    }
    function asciiName(s) { return s.toUpperCase().replace(/Ä/g, 'AE').replace(/Ö/g, 'OE').replace(/Ü/g, 'UE').replace(/ß/g, 'SS'); }
    function renderWeg(t) {
      ctx.fillStyle = '#14121a'; ctx.fillRect(0, 0, IW, IH);
      var wx = g.wackeln > 0 ? Math.round(rnd(-1, 1)) : 0;
      for (var y = 0; y < GH; y++) for (var x = 0; x < GW; x++) {
        var px = MX + x * KA + wx, py = MY + y * KA, alt = g.gesehen[x + ',' + y], sicht = alt !== undefined ? 1 - (g.t - alt) / g.vergessenNach : 0;
        if (sicht <= 0 && !(x === 1 && y === 1)) { R(px, py, KA, KA, (x + y) % 2 ? '#1a1822' : '#18161f'); continue; }
        if (g.karte[y][x]) {
          var art = hash(x * 13 + y * 7 + g.tag * 31);
          if (art < 0.45) { R(px, py, KA, KA, '#3a7a3a'); R(px + 1, py + 1, KA - 2, KA - 2, '#4a9a48'); R(px + 3, py + 3, 2, 2, '#6aba5a'); R(px + 7, py + 6, 2, 2, '#6aba5a'); }
          else { var dach = ['#c84a4a', '#4a6ac8', '#c8a03a', '#8a5ac8'][Math.floor(art * 40) % 4]; R(px, py, KA, KA, '#d8c8b0'); R(px, py, KA, 4, dach); R(px + 3, py + 6, 2, 3, g.wackeln > 0 ? '#ffffff' : '#9ad0f2'); R(px + 7, py + 6, 2, 3, '#9ad0f2'); }
        } else {
          R(px, py, KA, KA, '#6a6a72'); if ((x + y) % 2 === 0) R(px + 5, py + 5, 2, 2, '#8a8a92');
        }
        if (sicht < 1 && sicht > 0) { ctx.globalAlpha = 1 - sicht; R(px, py, KA, KA, '#14121a'); ctx.globalAlpha = 1; }
      }
      // Zuhause
      R(MX + KA + 2, MY + KA + 1, 8, 3, '#e86a9a');
      // Ziel nur sichtbar, wenn in der Nähe oder beim Rufen
      var zx = MX + g.ziel.x * KA, zy = MY + g.ziel.y * KA, nah = Math.abs(g.ziel.x - g.pos.x) <= 1 && Math.abs(g.ziel.y - g.pos.y) <= 1;
      if (nah || g.rufT > 0) {
        R(zx, zy, KA, KA, g.anlass.farbe); R(zx + 1, zy + 1, KA - 2, KA - 2, '#fdf2f6');
        Pixel.text(ctx, '!', OX + zx + 5, OY + zy + 3, 1, g.anlass.farbe);
        Pixel.text(ctx, g.anlass.ziel, OX + zx + KA / 2, OY + zy - 6, 1, '#ffffff', 'center');
      }
      if (g.rufT > 0 && g.pfad) {
        ctx.globalAlpha = Math.min(1, g.rufT); var n = Math.floor((1.6 - g.rufT) * 30);
        g.pfad.forEach(function (p, i) { if (i <= n) R(MX + p.x * KA + 5, MY + p.y * KA + 5, 2, 2, '#ffb8d8'); });
        ctx.globalAlpha = 1;
      }
      // Jule (winzig) – mit Handy in der Hand
      var jx = MX + g.zeigPos.x * KA + 2, jy = MY + g.zeigPos.y * KA - 2;
      Pixel.draw(ctx, Sprites.jule(g.verwirrt > 0 ? 'verwirrt' : 'neutral', farben()), OX + jx, OY + jy, 0.5);
      if (g.verwirrt > 0 && Math.floor(t * 3) % 2) Pixel.text(ctx, '?', OX + jx + 3, OY + jy - 6, 1, '#ffb8d8');
    }
    function render(t) {
      ctx.imageSmoothingEnabled = false;
      if (g.phase === 'outfit') renderOutfit(t);
      else if (g.phase === 'packen' || g.phase === 'zwischen') renderPacken(t);
      else if (g.phase === 'weg' || g.phase === 'ankunft') renderWeg(t);
      else { ctx.fillStyle = '#1a1620'; ctx.fillRect(0, 0, IW, IH); }
    }
    function hud() {
      var on = ovl.classList.contains('aus') && ['outfit', 'packen', 'weg'].indexOf(g.phase) >= 0;
      $('hud').classList.toggle('an', on);
      if (!on) { g.blasen.forEach(blasenPos); return; }
      var titel = { outfit: 'ANZIEHEN', packen: 'EINPACKEN', weg: 'WEG FINDEN' }[g.phase];
      $('titel').textContent = 'TAG ' + (g.tag + 1) + ' · ' + titel + ' · ' + Math.ceil(g.rest) + 'S';
      var info = herzenText() + ' · ' + g.punkte + ' Pkt';
      if (g.phase === 'packen') info += ' · eingepackt: ' + g.dabei.length;
      if (g.phase === 'weg') info += g.rufCd > 0 ? ' · Rufen in ' + Math.ceil(g.rufCd) + ' s' : ' · HALLOOO bereit (Leertaste)';
      $('info').textContent = info;
      g.blasen.forEach(blasenPos);
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render(g.t); hud();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function intro() {
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="ju-karte"><h1>Wo bin ich?!</h1><div class="unter">Jule muss nur kurz los. Was soll da schon schiefgehen?</div><div data-el="fig"></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>👗 <b>Anziehen</b>: passend zum Anlass. Aber Jule vergisst nach ein paar Sekunden, wohin sie will – 📱 Nachschauen kostet Zeit.</li>' +
        '<li>🎒 <b>Einpacken</b>: Liste kurz merken, dann einsammeln (<b>E</b>/NEHMEN). Jule ist klein: auf Möbel klettern (<b>Leertaste</b>), Hocker schieben, <b>↑</b> = auf Zehenspitzen strecken. Raus durch die Tür.</li>' +
        '<li>🗺️ <b>Weg finden</b>: Jule sieht nicht über die Hecken und vergisst den Weg sofort wieder. <b>HALLOOO!</b> (Leertaste) zeigt kurz den Weg – sehr laut.</li>' +
        '<li>❤️ Zu spät oder Mode-Fail kostet ein Herz.</li></ul>' +
        '<button class="px-btn" data-act="los">Los (Handy hab ich!)</button></div>';
      ovl.classList.remove('aus');
      var c = document.createElement('canvas'), img = Sprites.jule('happy'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0);
      ovl.querySelector('[data-el=fig]').appendChild(c);
    }
    function los() {
      g.blasen.forEach(function (b) { b.el.remove(); });
      reset(); ovl.classList.add('aus'); outfitStart();
      Pixel.sfx.tone(523, 0.08, 'square', 0.05); Pixel.sfx.tone(659, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(784, 0.15, 'square', 0.05, null, 0.18);
    }

    function onClick(e) {
      var tb = e.target.closest && e.target.closest('[data-teil]');
      if (tb) { teilWechseln(+tb.getAttribute('data-teil'), +tb.getAttribute('data-d')); return; }
      var b = e.target.closest && e.target.closest('[data-act]');
      if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'los') los();
      if (a === 'weiter') weiter();
      if (a === 'fertig') outfitFertig();
      if (a === 'nachschauen') nachschauen();
      if (a === 'exit') { stop(); onExit(); }
      if (a === 'ton') { Pixel.setMuted(!Pixel.isMuted()); tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊'; }
    }
    function stop() {
      if (!alive) return;
      alive = false; cancelAnimationFrame(raf); clearTimeout(meldT);
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
      window.removeEventListener('resize', resize); window.removeEventListener('blur', allesLos);
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize); window.addEventListener('blur', allesLos);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__jule = { g: function () { return g; }, halten: function () { return halten; }, nehmen: nehmen, rufen: rufen, fertig: outfitFertig, losgehen: losgehen, ankunft: ankunft };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.jule = { start: start };
})();
