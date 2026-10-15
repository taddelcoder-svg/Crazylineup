// Ecki: Ecki muss mal! – 2D-Pixel-Laufspiel.
// Ecki rennt automatisch und muss DRINGEND. Das Druck-Meter steigt; an den WC-Türen
// muss er die freie erwischen (BESETZT, DEFEKT, PUTZDIENST … oder FREI).
// Springen: Leertaste/W/↑ · Ducken = Zusammenkneifen (Druck steigt langsamer): S/↓ halten · Tür: E/Enter.
// Unterwegs: Kamillentee (Druck runter), Öko-Grünmobil (kurz unverwundbar), Fußball (kickt ein Hindernis weg).
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.ecki.best';
  var G = 760, SPRUNG = 255;
  var ORTE = [
    { id: 'flur', name: 'Schulflur' }, { id: 'hof', name: 'Schulhof' }, { id: 'platz', name: 'Fußballplatz' },
    { id: 'stadt', name: 'Innenstadt' }, { id: 'zuhause', name: 'Zuhause' }
  ];
  var TUEREN = [
    { art: 'besetzt', txt: 'BESETZT', farbe: '#d83a3a', spruch: ['Besetzt!!', 'EY! Klopfen?!', 'Dauert noch!'] },
    { art: 'defekt', txt: 'DEFEKT', farbe: '#7a7a80', spruch: ['Außer Betrieb?!', 'Neeeein!'] },
    { art: 'putzen', txt: 'PUTZDIENST', farbe: '#e8b830', spruch: ['Wird geputzt!', 'Nicht jetzt!'] }
  ];
  var SPRUECHE = ['Muss … mal …', 'Wo ist das Klo?!', 'Nur noch kurz durchhalten!', 'Warum ist die Schule so groß?!', 'Bitte frei, bitte frei …'];
  var LEHRER = ['Ecki! Nicht rennen!', 'Ecki, kurz zu deinen Hausaufgaben …', 'Langsam, junger Mann!', 'Hast du kurz Zeit?'];

  var CSS = [
    '.ek{position:absolute;inset:0;overflow:hidden;background:#1a1a20;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.ek canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.ek-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.ek-top button{pointer-events:auto}',
    '.ek-hud{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:0 8px;opacity:0;transition:opacity .4s}',
    '.ek-hud.an{opacity:1}',
    '.ek-druck{width:min(70vw,360px);background:rgba(20,20,26,.85);border:3px solid #fff;padding:4px 8px 6px;box-shadow:3px 3px 0 rgba(0,0,0,.4)}',
    '.ek-druck small{display:flex;justify-content:space-between;font:8px/1 "Press Start 2P",monospace;margin-bottom:4px}',
    '.ek-druck div{height:12px;background:#2a2a32;border:2px solid #000}',
    '.ek-druck div span{display:block;height:100%;width:0;background:linear-gradient(90deg,#4ad86a,#f2c84a 60%,#e8304a)}',
    '.ek-druck.knapp{animation:ekWackel .12s infinite alternate}',
    '@keyframes ekWackel{from{transform:translateX(-2px)}to{transform:translateX(2px)}}',
    '.ek-info{font:9px/1.3 "Press Start 2P",monospace;text-shadow:2px 2px 0 #000;text-align:center}',
    '.ek-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:5px 8px;font-size:15px;white-space:nowrap;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:ekPop .15s}',
    '.ek-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:#fff;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes ekPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.ek-meldung{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;white-space:nowrap;z-index:19}',
    '.ek-meldung b{display:block;font:clamp(16px,4.5vw,28px)/1.2 "Press Start 2P",monospace;color:#4ad86a;text-shadow:3px 3px 0 #000}',
    '.ek-meldung small{display:block;font-size:18px;text-shadow:2px 2px 0 #000;margin-top:8px}',
    '.ek-meldung.rot b{color:#e8304a}',
    '.ek-meldung.zeigen{animation:ekMeld 1.7s ease-out}',
    '@keyframes ekMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0}}',
    '.ek-rein{position:absolute;transform:translate(-50%,-100%);z-index:21;background:#4ad86a;color:#0e2a14;border:3px solid #fff;font:12px/1 "Press Start 2P",monospace;',
    ' padding:9px 10px;cursor:pointer;box-shadow:3px 3px 0 rgba(0,0,0,.45);display:none;animation:ekHuepf .35s infinite alternate}',
    '@keyframes ekHuepf{to{transform:translate(-50%,-112%)}}',
    '.ek-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;padding:0 14px calc(14px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.ek-pad.an{display:flex}',
    '.ek-pad button{pointer-events:auto;width:96px;height:96px;border-radius:50%;border:3px solid rgba(255,255,255,.75);background:rgba(20,20,26,.45);color:#fff;',
    ' font:10px/1.3 "Press Start 2P",monospace;touch-action:none}',
    '.ek-pad button.gedrueckt{background:rgba(74,216,106,.55)}',
    '.ek-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,14,.55);z-index:40;padding:16px}',
    '.ek-ovl.aus{display:none}',
    '.ek-karte{width:min(460px,100%);background:#f4f2ea;color:#14141a;border:4px solid #14141a;box-shadow:8px 8px 0 #3ab0e8;padding:16px 18px;text-align:center}',
    '.ek-karte h1{margin:4px 0 4px;font:clamp(18px,5vw,26px)/1.25 "Press Start 2P",monospace;color:#2a8a4a}',
    '.ek-karte h1.rot{color:#d83a3a}',
    '.ek-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.ek-karte canvas{position:static;width:64px;height:auto;margin:4px auto}',
    '.ek-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.ek-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(20,20,26,.3);padding:6px 0;font-size:18px}',
    '.ek-karte .zeile b{font:12px/1.5 "Press Start 2P",monospace;color:#2a8a4a}',
    '.ek-karte .px-btn{width:100%;margin-top:8px}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="ek"><canvas></canvas>' +
      '<div class="ek-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="ek-hud" data-el="hud"><div class="ek-druck" data-el="druckBox"><small><span>DRUCK</span><span data-el="ort">SCHULFLUR</span></small><div><span data-el="druck"></span></div></div>' +
        '<div class="ek-info" data-el="info"></div></div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<button class="ek-rein" data-el="rein">REIN!</button>' +
      '<div class="ek-meldung" data-el="meldung"></div>' +
      '<div class="ek-pad"><button data-pad="kneifen" aria-label="Ducken und zusammenkneifen">KNEI-<br>FEN</button><button data-pad="sprung" aria-label="Springen">SPRUNG</button></div>' +
      '<div class="ek-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.ek'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), reinBtn = $('rein'), pad = root.querySelector('.ek-pad'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now();

    // ---------- Layout ----------
    var S = 3, IW = 0, IH = 0, BODEN = 0, EX = 0, bgCache = {};
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight;
      S = Math.max(2, Math.floor(Math.min(SH / 170, SW / 190)));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      BODEN = IH - Math.max(26, Math.round(IH * 0.2));
      if (window.matchMedia && matchMedia('(pointer: coarse)').matches) BODEN = Math.min(BODEN, IH - Math.round(118 / S));
      EX = Math.round(Math.min(IW * 0.28, 90));
      bgCache = {};
    }

    // ---------- Hintergründe (Kachel je Ort, vorgerendert) ----------
    function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
    function kachel(ort) {
      if (bgCache[ort]) return bgCache[ort];
      var W = 240, c0 = document.createElement('canvas'); c0.width = W; c0.height = IH; var c = c0.getContext('2d'), b = BODEN;
      if (ort === 'flur') {
        R(c, 0, 0, W, b, '#e8e0c8'); R(c, 0, b - 40, W, 40, '#c8d8e0');
        for (var x = 6; x < W; x += 20) { R(c, x, b - 52, 16, 52, '#3a7ac8'); R(c, x + 1, b - 51, 14, 50, '#4a8ad8'); for (var v = 0; v < 4; v++) R(c, x + 4, b - 48 + v * 3, 8, 1, '#2a5a98'); R(c, x + 12, b - 30, 2, 5, '#c8d0d8'); }
        R(c, 0, 0, W, 8, '#d0c8b0'); R(c, 60, b - 80, 30, 20, '#f2f2ea'); R(c, 62, b - 78, 26, 4, '#d83a3a'); R(c, 62, b - 72, 20, 2, '#888'); R(c, 62, b - 68, 22, 2, '#888');
        R(c, 170, b - 82, 26, 22, '#fff8d8'); R(c, 172, b - 80, 22, 18, '#4ad86a');
        for (x = 0; x < W; x += 8) R(c, x, b, 8, IH - b, (x / 8) % 2 ? '#b8b0a0' : '#a8a090');
      } else if (ort === 'hof') {
        R(c, 0, 0, W, b, '#8ac8f0'); R(c, 0, b - 70, W, 70, '#c88a5a');
        for (x = 4; x < W; x += 22) { R(c, x, b - 60, 14, 12, '#a8d0e8'); R(c, x, b - 36, 14, 12, '#a8d0e8'); }
        R(c, 0, b - 72, W, 4, '#8a5a3a');
        [30, 150].forEach(function (tx) { R(c, tx, b - 30, 6, 30, '#6a4a2a'); R(c, tx - 14, b - 56, 34, 28, '#4a9a4a'); R(c, tx - 8, b - 64, 22, 12, '#5aaa5a'); });
        R(c, 0, b, W, IH - b, '#6a6a70'); for (x = 0; x < W; x += 30) R(c, x, b + 6, 16, 2, '#f2f2ea');
      } else if (ort === 'platz') {
        R(c, 0, 0, W, b, '#9ad0f2'); R(c, 0, b - 46, W, 30, '#8a8a92');
        for (x = 0; x < W; x += 3) for (var r2 = 0; r2 < 5; r2++) R(c, x, b - 44 + r2 * 6, 2, 3, ['#d83a3a', '#f2f2ea', '#3a7ac8', '#f2c84a', '#4a9a4a'][(x * 7 + r2 * 3) % 5]);
        R(c, 0, b - 16, W, 16, '#4aaa4a'); R(c, 100, b - 34, 2, 18, '#fff'); R(c, 140, b - 34, 2, 18, '#fff'); R(c, 100, b - 34, 42, 2, '#fff');
        for (x = 0; x < W; x += 16) R(c, x, b, 8, IH - b, '#3a9a3a'); for (x = 8; x < W; x += 16) R(c, x, b, 8, IH - b, '#46a646');
      } else if (ort === 'stadt') {
        R(c, 0, 0, W, b, '#f2b878'); var farben = ['#c86a4a', '#e8c86a', '#6a9ac8', '#a86ac8', '#6ac88a'];
        for (x = 0; x < W; x += 48) { var h = 50 + ((x * 13) % 40); R(c, x, b - h, 46, h, farben[(x / 48) % 5]); for (var wy = b - h + 6; wy < b - 20; wy += 12) for (var wx = x + 5; wx < x + 40; wx += 12) R(c, wx, wy, 7, 7, '#f2f2d8'); R(c, x + 6, b - 18, 34, 18, '#3a3a48'); R(c, x + 4, b - 22, 38, 4, '#d83a3a'); }
        R(c, 0, b, W, IH - b, '#b0aca4'); for (x = 0; x < W; x += 12) R(c, x, b, 1, IH - b, '#8a8680');
      } else {
        R(c, 0, 0, W, b, '#e8d0d8'); for (x = 0; x < W; x += 12) R(c, x, 0, 6, b, '#f0dce2');
        R(c, 20, b - 70, 30, 24, '#8a5a3a'); R(c, 22, b - 68, 26, 20, '#8ac8e8'); R(c, 140, b - 66, 24, 18, '#8a5a3a'); R(c, 142, b - 64, 20, 14, '#f2c84a');
        R(c, 70, b - 26, 60, 26, '#4a6aa8'); R(c, 66, b - 34, 8, 34, '#3a5a98'); R(c, 126, b - 34, 8, 34, '#3a5a98'); R(c, 70, b - 36, 60, 10, '#3a5a98');
        R(c, 0, b, W, IH - b, '#a87a5a'); for (x = 0; x < W; x += 20) R(c, x, b, 19, IH - b, '#b8886a');
      }
      // hohe Bildschirme (Handy hochkant): oben Decke mit Lampen bzw. Himmel mit Wolken
      var drinnen = ort === 'flur' || ort === 'zuhause';
      if (drinnen) { R(c, 0, 0, W, 8, 'rgba(0,0,0,.08)'); for (x = 40; x < W; x += 120) { R(c, x + 9, 0, 2, Math.max(10, b - 150), '#8a8a8a'); R(c, x, Math.max(10, b - 150), 20, 5, '#f2f2d8'); R(c, x + 2, Math.max(15, b - 145), 16, 2, 'rgba(255,255,200,.6)'); } }
      else for (x = 20; x < W; x += 110) { var wy0 = Math.max(12, b - 120 - (x % 3) * 18); R(c, x, wy0, 30, 8, '#fff'); R(c, x + 6, wy0 - 5, 16, 6, '#fff'); R(c, x + 4, wy0 + 6, 26, 2, '#e0eef8'); }
      R(c, 0, b, W, 2, 'rgba(0,0,0,.25)');
      bgCache[ort] = c0; return c0;
    }

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = {
        modus: 'intro', t: 0, cam: 0, stufe: 0, v: 72, y: 0, vy: 0, amBoden: true, duck: false, druck: 18, punkte: 0, rollen: 0, klos: 0, strecke: 0,
        objekte: [], naechst: 160, stationAb: 900, stationAktiv: false, schutz: 0, mobil: 0, ball: 0, stopp: 0, rutsch: 0, puh: 0, ende: false,
        blase: null, spruchT: 4, grummelT: 0, ort: 0, wechselX: 0
      };
    }
    var meldT = 0;
    function melde(txt, klein, rot) {
      var el = $('meldung'); el.className = 'ek-meldung' + (rot ? ' rot' : ''); el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1700);
    }
    function sag(txt, dauer, x, y) {
      if (g.blase) g.blase.el.remove();
      var el = document.createElement('div'); el.className = 'ek-blase'; el.textContent = txt; wrap.appendChild(el);
      g.blase = { el: el, t: dauer || 1.6, x: x, y: y };
    }

    // ---------- Welt erzeugen ----------
    function spawn(x) {
      var ort = ORTE[g.ort].id, r = Math.random(), o;
      if (r < 0.62) {
        var arten = ['tonne', 'ranzen', 'pfuetze', 'taube', 'ball'];
        if (ort === 'flur' || ort === 'hof') arten.push('lehrer');
        if (ort === 'zuhause') arten.push('robo', 'robo');
        if (ort === 'platz') arten.push('ball', 'huetchen');
        var a = pick(arten), def = {
          tonne: [11, 14, 0], ranzen: [14, 10, 0], huetchen: [8, 10, 0], pfuetze: [22, 2, 0], taube: [10, 7, 23], ball: [8, 8, 21], lehrer: [12, 32, 0], robo: [14, 6, 0]
        }[a];
        o = { typ: 'hin', art: a, x: x, w: def[0], h: def[1], hoch: def[2], vx: a === 'robo' ? -22 : a === 'taube' ? -18 : 0, getroffen: false };
      } else if (r < 0.86) {
        o = { typ: 'item', art: 'rolle', x: x, w: 8, h: 8, hoch: Math.random() < 0.5 ? 4 : 28 };
      } else {
        o = { typ: 'item', art: pick(['tee', 'tee', 'mobil', 'fussball']), x: x, w: 10, h: 10, hoch: 6 };
      }
      g.objekte.push(o);
    }
    function station(x) {
      var n = 3 + Math.min(2, Math.floor(g.stufe / 2)), frei = Math.floor(rnd(0, n));
      if (Math.random() < 0.15 + g.stufe * 0.04) frei = -1; // manchmal ist gar keins frei → nächste Station
      for (var i = 0; i < n; i++) {
        var t = i === frei ? { art: 'frei', txt: 'FREI', farbe: '#2aa84a' } : pick(TUEREN);
        g.objekte.push({ typ: 'tuer', x: x + i * 64, w: 22, art: t.art, txt: t.txt, farbe: t.farbe, spruch: t.spruch, offen: 0 });
      }
      return x + n * 64;
    }
    function weltFuellen() {
      var rechts = g.cam + IW + 60;
      while (g.naechst < rechts) {
        if (g.naechst >= g.stationAb) {
          var ende = station(g.naechst + 30);
          g.naechst = ende + 70; g.stationAb = g.naechst + 520 + g.stufe * 40;
        } else {
          spawn(g.naechst);
          g.naechst += rnd(70, 140) - Math.min(30, g.stufe * 5);
        }
      }
      g.objekte = g.objekte.filter(function (o) { return o.x + (o.w || 0) > g.cam - 40; });
    }

    // ---------- Eingabe ----------
    var tasten = {};
    function springen() {
      if (g.modus !== 'spiel' || g.stopp > 0 || g.puh > 0) return;
      if (g.amBoden) { g.vy = -SPRUNG * (g.mobil > 0 ? 1.1 : 1); g.amBoden = false; Pixel.sfx.tone(440, 0.08, 'square', 0.04, 660); }
    }
    function tuerVorMir() {
      return g.objekte.filter(function (o) { return o.typ === 'tuer' && !o.benutzt && g.cam + EX + 8 > o.x - 6 && g.cam + EX + 8 < o.x + o.w + 6; })[0];
    }
    function rein() {
      if (g.modus !== 'spiel' || g.puh > 0) return;
      var t = tuerVorMir(); if (!t) return;
      t.benutzt = true; t.offen = 1;
      if (t.art === 'frei') {
        g.puh = 2.2; g.klos++; var bonus = 200 + Math.round((100 - g.druck) * 3); g.punkte += bonus;
        melde('PUH!', 'Gerade noch geschafft. +' + bonus, false);
        Pixel.sfx.tone(523, 0.1, 'triangle', 0.06); Pixel.sfx.tone(659, 0.1, 'triangle', 0.06, null, 0.12); Pixel.sfx.tone(784, 0.25, 'triangle', 0.06, null, 0.24);
        setTimeout(function () { Pixel.sfx.noise(0.7, 0.12, 900); }, 700);
      } else {
        g.druck = Math.min(100, g.druck + 6); g.stopp = 0.45;
        sag(pick(t.spruch), 1.2, t.x + 11, BODEN - 36);
        Pixel.sfx.tone(160, 0.12, 'square', 0.05); Pixel.sfx.tone(120, 0.15, 'square', 0.05, null, 0.12);
      }
    }
    var CODES = { Space: 'sprung', KeyW: 'sprung', ArrowUp: 'sprung', KeyS: 'kneifen', ArrowDown: 'kneifen', KeyE: 'rein', Enter: 'rein' };
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel') { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } } return; }
      var a = CODES[e.code]; if (!a) return; e.preventDefault();
      if (a === 'sprung' && !e.repeat) springen();
      if (a === 'kneifen') tasten.kneifen = true;
      if (a === 'rein' && !e.repeat) rein();
    }
    function ku(e) { if (CODES[e.code] === 'kneifen') tasten.kneifen = false; }
    function allesLos() { tasten = {}; }
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-pad]'); if (!b) return; e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (x) {}
      b.classList.add('gedrueckt');
      if (b.getAttribute('data-pad') === 'sprung') springen(); else tasten.kneifen = true;
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) {
      pad.addEventListener(n, function (e) { var b = e.target.closest('[data-pad]'); if (!b) return; b.classList.remove('gedrueckt'); if (b.getAttribute('data-pad') === 'kneifen') tasten.kneifen = false; });
    });
    reinBtn.addEventListener('pointerdown', function (e) { e.preventDefault(); rein(); });
    cv.addEventListener('pointerdown', function (e) { if (g.modus === 'spiel') { e.preventDefault(); springen(); } });
    if (window.matchMedia && matchMedia('(pointer: coarse)').matches) pad.classList.add('an');

    // ---------- Schleife ----------
    function update(dt) {
      g.t += dt;
      if (g.blase) { g.blase.t -= dt; if (g.blase.t <= 0) { g.blase.el.remove(); g.blase = null; } }
      if (g.modus !== 'spiel') return;
      g.duck = !!tasten.kneifen && g.amBoden;
      // Erleichterung nach einem freien Klo
      if (g.puh > 0) {
        reinBtn.style.display = 'none';
        g.puh -= dt; g.druck = Math.max(0, g.druck - dt * 60);
        if (g.puh <= 0) {
          g.stufe++; g.ort = g.stufe % ORTE.length; g.druck = 8;
          g.objekte = g.objekte.filter(function (o) { return o.x < g.cam + EX - 20; });
          g.naechst = g.cam + IW + 20; g.stationAb = g.naechst + 700 + g.stufe * 60;
          melde(ORTE[g.ort].name, 'Und … er muss SCHON WIEDER.');
          sag(pick(['Oh nein. Nicht schon wieder.', 'Zu viel Kamillentee …', 'Schon wieder?!']), 1.8);
        }
        return;
      }
      // Tempo
      var ziel = 72 + g.stufe * 9;
      if (g.mobil > 0) ziel *= 1.7; else if (g.duck) ziel *= 0.7;
      if (g.rutsch > 0) { ziel *= 0.55; g.rutsch -= dt; }
      if (g.stopp > 0) { g.stopp -= dt; ziel = 0; }
      g.v += (ziel - g.v) * Math.min(1, dt * 5);
      g.cam += g.v * dt; g.strecke += g.v * dt;
      g.punkte += Math.round(g.v * dt * 0.1 * 10) / 10;
      // Springen
      if (!g.amBoden) { g.vy += G * dt; g.y += g.vy * dt; if (g.y >= 0) { g.y = 0; g.vy = 0; g.amBoden = true; } }
      // Druck
      var rate = 3.1 + g.stufe * 0.55;
      if (g.duck) rate *= 0.45; if (g.mobil > 0) rate *= 0.5;
      g.druck = Math.min(100, g.druck + rate * dt);
      if (g.druck > 75) { g.grummelT -= dt; if (g.grummelT <= 0) { g.grummelT = rnd(1.2, 2); Pixel.sfx.tone(70, 0.35, 'triangle', 0.05, 50); } }
      if (g.druck >= 100) { ende(); return; }
      g.schutz = Math.max(0, g.schutz - dt); g.mobil = Math.max(0, g.mobil - dt);
      g.spruchT -= dt; if (g.spruchT <= 0) { g.spruchT = rnd(5, 9); if (!g.blase) sag(pick(SPRUECHE), 1.6); }
      weltFuellen();
      // Kollisionen
      var ex0 = g.cam + EX + 3, ex1 = ex0 + 10, eHoehe = g.duck ? 22 : 30, ey0 = -g.y, ey1 = -g.y + eHoehe; // y nach oben, 0 = Boden
      g.objekte.forEach(function (o) {
        if (o.vx) o.x += o.vx * dt;
        if (o.typ === 'tuer' || o.weg) return;
        var ox0 = o.x, ox1 = o.x + o.w, oy0 = o.hoch, oy1 = o.hoch + o.h;
        if (ex1 < ox0 || ex0 > ox1 || ey1 < oy0 || ey0 > oy1) return;
        if (o.typ === 'item') {
          o.weg = true;
          if (o.art === 'rolle') { g.rollen++; g.punkte += 10; Pixel.sfx.tone(988, 0.05, 'square', 0.035); }
          else if (o.art === 'tee') { g.druck = Math.max(0, g.druck - 25); melde('Kamillentee!', 'Druck −25'); Pixel.sfx.tone(523, 0.08, 'triangle', 0.05); Pixel.sfx.tone(784, 0.12, 'triangle', 0.05, null, 0.08); }
          else if (o.art === 'mobil') { g.mobil = 5; melde('Öko-Grünmobil!', '5 Sekunden Vollgas – elektrisch.'); Pixel.sfx.tone(330, 0.3, 'sawtooth', 0.04, 660); }
          else if (o.art === 'fussball') { g.ball++; melde('Fußball!', 'Kickt das nächste Hindernis weg.'); Pixel.sfx.tone(660, 0.06, 'square', 0.05); }
          return;
        }
        if (o.art === 'pfuetze') { if (g.amBoden && !o.getroffen) { o.getroffen = true; g.rutsch = 0.9; sag('Rutschig!!', 1); Pixel.sfx.noise(0.15, 0.08, 1500); } return; }
        if (o.getroffen || g.schutz > 0) return;
        if (g.mobil > 0) { o.weg = true; o.flug = 1; g.punkte += 15; Pixel.sfx.noise(0.1, 0.1, 700); return; }
        if (g.ball > 0) { g.ball--; o.weg = true; o.flug = 1; melde('TOOOR!', 'Ecki kickt das Hindernis weg.'); Pixel.sfx.tone(784, 0.1, 'square', 0.05); return; }
        o.getroffen = true; g.schutz = 1; g.druck = Math.min(100, g.druck + 9);
        if (o.art === 'lehrer') { g.stopp = 1.1; sag(pick(LEHRER), 1.4, o.x + 6, BODEN - 40); }
        else { g.stopp = 0.25; Pixel.sfx.tone(140, 0.15, 'square', 0.05, 90); }
      });
      // Tür-Knopf
      var t = tuerVorMir();
      if (t) { reinBtn.style.display = 'block'; reinBtn.style.left = (EX + 8) * S + 'px'; reinBtn.style.top = (BODEN - 58) * S + 'px'; reinBtn.textContent = pad.classList.contains('an') ? 'REIN!' : 'REIN! (E)'; }
      else reinBtn.style.display = 'none';
    }

    // ---------- Zeichnen ----------
    function zeichneObjekt(o, x, t) {
      var b = BODEN, y = b - o.hoch - o.h, R2 = function (a, bb, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x + a), Math.round(bb), w, h); };
      if (o.flug) { y -= (o.flug = o.flug + 0.25) * 4; }
      if (o.typ === 'tuer') {
        var ty = b - 34;
        R2(-2, ty - 2, 26, 36, '#5a3a22'); R2(0, ty, 22, 34, o.offen ? '#2a1a10' : '#a87a4a');
        if (!o.offen) { R2(2, ty + 2, 18, 13, '#b88a5a'); R2(2, ty + 17, 18, 15, '#b88a5a'); R2(17, ty + 18, 2, 3, '#f2c84a'); }
        R2(3, ty - 12, 16, 8, '#f2f2ea'); Pixel.text(ctx, 'WC', Math.round(x + 5), ty - 10, 1, '#14141a');
        var w = Pixel.textWidth(o.txt, 1) + 4; ctx.fillStyle = o.farbe; ctx.fillRect(Math.round(x + 11 - w / 2), ty + 8, w, 8); Pixel.text(ctx, o.txt, Math.round(x + 11 - w / 2 + 2), ty + 9, 1, '#fff');
        return;
      }
      if (o.weg && !o.flug) return;
      if (o.typ === 'item') {
        var hop = Math.round(Math.sin(t * 5 + o.x) * 1.5);
        if (o.art === 'rolle') { R2(0, y + hop, 8, 8, '#f8f8f4'); R2(2, y + 2 + hop, 4, 4, '#c8c4bc'); R2(0, y + 6 + hop, 8, 2, '#e0dcd4'); }
        else if (o.art === 'tee') { R2(1, y + hop, 8, 9, '#f2f2ea'); R2(2, y + 2 + hop, 6, 5, '#e8b830'); R2(9, y + 2 + hop, 2, 4, '#f2f2ea'); R2(4, y - 3 + hop, 1, 3, '#c8c8c8'); }
        else if (o.art === 'mobil') { R2(0, y + 3 + hop, 10, 5, '#4ad86a'); R2(2, y + hop, 6, 4, '#6ae88a'); R2(3, y + 1 + hop, 4, 2, '#a8e0f8'); R2(1, y + 8 + hop, 2, 2, '#222'); R2(7, y + 8 + hop, 2, 2, '#222'); }
        else { R2(0, y + hop, 9, 9, '#f2f2f2'); R2(3, y + 3 + hop, 3, 3, '#141418'); R2(0, y + 4 + hop, 2, 2, '#141418'); R2(7, y + 1 + hop, 2, 2, '#141418'); }
        return;
      }
      var a = o.art;
      if (a === 'tonne') { R2(0, y, 11, 14, '#3a7a4a'); R2(-1, y, 13, 3, '#2a5a38'); R2(2, y + 5, 1, 7, '#4a9a5a'); R2(6, y + 5, 1, 7, '#4a9a5a'); }
      else if (a === 'ranzen') { R2(0, y, 14, 10, '#d84a8a'); R2(2, y + 2, 10, 4, '#f2c84a'); R2(5, y - 2, 4, 2, '#8a2a5a'); }
      else if (a === 'huetchen') { R2(3, y, 2, 2, '#f28a2a'); R2(2, y + 2, 4, 3, '#f28a2a'); R2(1, y + 5, 6, 3, '#f28a2a'); R2(0, y + 8, 8, 2, '#d86a1a'); R2(2, y + 4, 4, 1, '#fff'); }
      else if (a === 'pfuetze') { R2(0, b - 2, 22, 2, '#5aa8e8'); R2(3, b - 3, 14, 1, '#8ac8f8'); }
      else if (a === 'taube') { var fl = Math.floor(t * 10) % 2; R2(0, y + 2, 9, 4, '#8a8a98'); R2(7, y, 3, 3, '#6a6a78'); R2(10, y + 1, 1, 1, '#e8a830'); R2(2, y + (fl ? -2 : 3), 5, 2, '#9a9aa8'); }
      else if (a === 'ball') { R2(0, y, 8, 8, '#e8782a'); R2(3, y, 1, 8, '#7a3a10'); R2(0, y + 3, 8, 1, '#7a3a10'); }
      else if (a === 'lehrer') {
        R2(2, y + 18, 3, 14, '#3a3a48'); R2(7, y + 18, 3, 14, '#3a3a48'); R2(0, y + 6, 12, 13, '#8a5a3a'); R2(2, y, 8, 7, '#e8b896'); R2(2, y - 1, 8, 2, '#8a8a8a');
        R2(3, y + 2, 2, 1, '#222'); R2(7, y + 2, 2, 1, '#222'); R2(-3, y + 8, 3, 2, '#8a5a3a'); R2(-5, y + 8, 2, 2, '#e8b896');
      }
      else if (a === 'robo') { R2(0, y + 1, 14, 5, '#3a3a40'); R2(2, y, 10, 2, '#5a5a62'); R2(6, y + 2, 2, 1, Math.floor(t * 4) % 2 ? '#4ad86a' : '#2a8a3a'); }
    }
    function render(t) {
      var ort = ORTE[g.ort].id, bg = kachel(ort), off = Math.floor(g.cam * 0.5) % 240;
      ctx.imageSmoothingEnabled = false;
      var shake = g.modus === 'spiel' && g.druck > 85 ? Math.round(Math.sin(t * 60) * 1) : 0;
      ctx.save(); ctx.translate(shake, 0);
      for (var x = -off; x < IW; x += 240) ctx.drawImage(bg, x, 0);
      // Objekte
      g.objekte.forEach(function (o) { var sx = o.x - g.cam; if (sx > -40 && sx < IW + 40) zeichneObjekt(o, sx, t); });
      // Ecki
      var bild, mood = g.druck > 60 ? 'druck' : '';
      if (g.puh > 0) { bild = 'steh'; mood = 'puh'; }
      else if (g.modus === 'ende') { bild = 'steh'; mood = 'rot'; }
      else if (g.modus !== 'spiel') bild = Math.floor(t * 3) % 2 ? 'laufA' : 'laufB';
      else if (!g.amBoden) bild = 'sprung';
      else if (g.duck) bild = 'duck';
      else if (g.v < 5) bild = 'steh';
      else bild = Math.floor(g.strecke / 10) % 2 ? 'laufA' : 'laufB';
      var img = Sprites.ecki(bild, mood), ey = BODEN - img.height + Math.round(g.y) - (g.mobil > 0 ? 6 : 0);
      var sichtbar = g.puh <= 0 && !(g.schutz > 0 && Math.floor(t * 12) % 2);
      if (g.puh > 0) {
        // in der Kabine: nur die Tür, dahinter Ecki erleichtert
        var tuer = g.objekte.filter(function (o) { return o.typ === 'tuer' && o.art === 'frei' && o.benutzt; })[0];
        if (tuer) { var tx = tuer.x - g.cam; ctx.fillStyle = '#a87a4a'; ctx.fillRect(Math.round(tx), BODEN - 34, 22, 34); Pixel.text(ctx, 'PUH', Math.round(tx + 5), BODEN - 22, 1, '#fff'); }
      }
      if (sichtbar) {
        if (g.mobil > 0) { ctx.fillStyle = '#4ad86a'; ctx.fillRect(EX - 4, BODEN - 12 + Math.round(g.y), 24, 8); ctx.fillStyle = '#2aa84a'; ctx.fillRect(EX - 4, BODEN - 6 + Math.round(g.y), 24, 2); ctx.fillStyle = '#222'; ctx.fillRect(EX - 2, BODEN - 4 + Math.round(g.y), 5, 4); ctx.fillRect(EX + 13, BODEN - 4 + Math.round(g.y), 5, 4); }
        Pixel.draw(ctx, img, EX, ey, 1);
        if (g.druck > 60 && g.modus === 'spiel') { ctx.fillStyle = '#8ac8f8'; var tr = Math.floor(t * 6) % 3; ctx.fillRect(EX + 15, ey + 4 + tr * 2, 1, 2); ctx.fillRect(EX - 1, ey + 6 + ((tr + 1) % 3) * 2, 1, 2); }
        if (g.ball > 0) { ctx.fillStyle = '#f2f2f2'; ctx.fillRect(EX + 16, ey + 22, 5, 5); ctx.fillStyle = '#141418'; ctx.fillRect(EX + 18, ey + 24, 1, 1); }
      }
      ctx.restore();
    }
    function hud() {
      $('druck').style.width = g.druck + '%';
      $('druckBox').classList.toggle('knapp', g.druck > 80 && g.modus === 'spiel');
      $('ort').textContent = ORTE[g.ort].name.toUpperCase();
      var bis = Math.max(0, Math.round((g.stationAb - g.cam - EX) / 10));
      $('info').textContent = Math.floor(g.punkte) + ' PKT · ROLLEN ' + g.rollen + (g.ball ? ' · BALL ' + g.ball : '') + (bis > 0 && g.puh <= 0 ? ' · WC ' + bis + 'M' : '');
      if (g.blase) {
        var bx = g.blase.x !== undefined ? g.blase.x - g.cam : EX + 8, by = g.blase.y !== undefined ? g.blase.y : BODEN - 34 + g.y;
        var hb = g.blase.el.offsetWidth / 2 + 6; g.blase.el.style.left = clamp(bx * S, hb, wrap.clientWidth - hb) + 'px'; g.blase.el.style.top = Math.max(80, by * S) + 'px';
      }
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render(g.t); hud();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function figur(mood, bild) { var img = Sprites.ecki(bild || 'steh', mood), c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); return c; }
    function intro() {
      ovl.classList.remove('aus');
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="ek-karte"><h1>Ecki muss mal!</h1><div class="unter">Zu lange gekickt, zu viel Kamillentee – jetzt muss er DRINGEND.</div><div data-el="fig"></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>🚽 Finde eine <b>FREIE</b> Toilette, bevor das Druck-Meter voll ist. Vor der Tür: <b>E</b> / <b>Enter</b> (oder REIN! antippen).</li>' +
        '<li>⬆️ Springen: <b>Leertaste</b> / <b>W</b> / antippen. ⬇️ <b>S</b> halten = ducken &amp; zusammenkneifen (Druck steigt langsamer).</li>' +
        '<li>🍵 Kamillentee senkt den Druck, 🚗 das Öko-Grünmobil macht kurz unverwundbar, ⚽ kickt ein Hindernis weg.</li>' +
        '<li>👨‍🏫 Lehrer halten dich auf. Tauben und Bälle: ducken!</li></ul>' +
        '<button class="px-btn" data-act="los">Lauf, Ecki, lauf!</button></div>';
      ovl.querySelector('[data-el=fig]').appendChild(figur('druck'));
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.ende) { if (g.blase) g.blase.el.remove(); reset(); }
      g.modus = 'spiel'; ovl.classList.add('aus'); $('hud').classList.add('an'); allesLos();
      sag('Ich muss mal … SOFORT!', 1.6);
      Pixel.sfx.tone(392, 0.08, 'square', 0.05); Pixel.sfx.tone(523, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(659, 0.15, 'square', 0.05, null, 0.18);
    }
    function ende() {
      if (g.modus !== 'spiel') return;
      g.modus = 'ende'; g.ende = true; reinBtn.style.display = 'none'; allesLos();
      var punkte = Math.floor(g.punkte), best = +Pixel.get(BEST_KEY, 0), neu = punkte > best;
      if (neu) Pixel.set(BEST_KEY, punkte);
      sag('… zu spät.', 2);
      Pixel.sfx.tone(392, 0.3, 'triangle', 0.06, 370); Pixel.sfx.tone(349, 0.3, 'triangle', 0.06, 330, 0.3); Pixel.sfx.tone(330, 0.3, 'triangle', 0.06, 311, 0.6); Pixel.sfx.tone(294, 0.8, 'triangle', 0.06, 220, 0.9);
      setTimeout(function () {
        if (!alive) return;
        $('hud').classList.remove('an'); ovl.classList.remove('aus');
        ovl.innerHTML = '<div class="ek-karte"><h1 class="rot">Zu spät!</h1><div class="unter">Ecki ist knallrot. Wir reden nicht drüber.</div><div data-el="fig"></div>' +
          '<div class="zeile"><span>Punkte</span><b>' + punkte + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Klos gefunden</span><b>' + g.klos + '</b></div>' +
          '<div class="zeile"><span>Klopapier gesammelt</span><b>' + g.rollen + '</b></div>' +
          '<div class="zeile"><span>Strecke</span><b>' + Math.round(g.strecke / 10) + ' m</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, punkte) + '</b></div>' +
          '<button class="px-btn" data-act="los">Nochmal rennen</button><button class="px-btn" data-act="exit" style="margin-top:8px">Menü</button></div>';
        ovl.querySelector('[data-el=fig]').appendChild(figur('rot'));
      }, 1500);
    }

    function onClick(e) {
      var b = e.target.closest && e.target.closest('[data-act]');
      if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'los') los();
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
    window.__ecki = { g: function () { return g; }, ex: function () { return EX; }, springen: springen, rein: rein, tasten: function () { return tasten; } };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.ecki = { start: start };
})();
