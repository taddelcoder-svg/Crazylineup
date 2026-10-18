// Jule kommt zu spät – Action-Lauf (2D-Pixel, hochkant).
// Jule rennt durch die Stadt, das Bild scrollt immer schneller. Steuern: ziehen/tippen (Handy) oder ←/→ bzw. A/D.
// Vergesslich: Aus der Tasche fallen ständig Sachen – einsammeln, bevor sie aus dem Bild sind.
// Klein: große Leute versperren die Sicht und rempeln. HALLOOO! (Leertaste/Knopf, lädt sich auf) fegt alle weg.
// Orientierung: An Kreuzungen zeigt das Schild den richtigen Weg – Jule ruft gern das Gegenteil.
// Mode: Fashion-Teile geben Combo-Punkte. Zwischenziele geben Zeit. Zeit um = zu spät.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.jule.best';
  var W0 = 120, RAND = 14, MITTE = 60;
  var ZIELE = ['BUSHALTESTELLE', 'BAECKER', 'SCHULE', 'MALL', 'PARTY', 'OMA', 'KINO', 'BAHNHOF', 'BIBLIOTHEK', 'ZAHNARZT'];
  var SACHEN = [
    { id: 'schluessel', name: 'Schlüssel', px: [[0, 1, 3, 3, '#e8c040'], [3, 2, 4, 1, '#e8c040'], [5, 3, 1, 2, '#e8c040'], [1, 2, 1, 1, '#8a6a20']] },
    { id: 'geld', name: 'Geldbeutel', px: [[0, 2, 7, 5, '#c84a7a'], [0, 2, 7, 1, '#e86a9a'], [3, 4, 1, 1, '#e8c040']] },
    { id: 'hausi', name: 'Hausaufgaben', px: [[0, 0, 6, 7, '#3a6ac8'], [1, 1, 4, 1, '#ffffff'], [1, 3, 4, 1, '#ffffff'], [1, 5, 3, 1, '#ffffff']] },
    { id: 'lipgloss', name: 'Lipgloss', px: [[2, 0, 3, 3, '#e83a6a'], [2, 3, 3, 4, '#d8d8e0']] },
    { id: 'kopfhoerer', name: 'Kopfhörer', px: [[1, 0, 5, 1, '#f2f2f2'], [0, 1, 1, 4, '#f2f2f2'], [6, 1, 1, 4, '#f2f2f2'], [0, 4, 2, 3, '#d8d8e0'], [5, 4, 2, 3, '#d8d8e0']] },
    { id: 'brotdose', name: 'Brotdose', px: [[0, 2, 7, 5, '#3aae5a'], [0, 2, 7, 1, '#6ad88a']] },
    { id: 'ausweis', name: 'Schülerausweis', px: [[0, 1, 7, 5, '#f2f2f2'], [1, 2, 2, 2, '#e8a888'], [4, 2, 2, 1, '#3a6ac8'], [4, 4, 2, 1, '#3a6ac8']] }
  ];
  var MODE = [
    { name: 'Sonnenbrille', px: [[0, 2, 3, 2, '#14141a'], [4, 2, 3, 2, '#14141a'], [3, 2, 1, 1, '#14141a'], [1, 2, 1, 1, '#5a6a8a']] },
    { name: 'Mini-Bag', px: [[1, 0, 5, 1, '#3a2a22'], [0, 2, 7, 5, '#c84a7a'], [0, 2, 7, 1, '#e86a9a']] },
    { name: 'Ohrringe', px: [[1, 0, 1, 2, '#e8c050'], [5, 0, 1, 2, '#e8c050'], [0, 2, 3, 3, '#e8c050'], [4, 2, 3, 3, '#e8c050']] },
    { name: 'Haarspange', px: [[0, 2, 7, 2, '#ff7ab0'], [2, 1, 3, 1, '#ffffff']] },
    { name: 'Schal', px: [[0, 1, 7, 2, '#c83a4a'], [4, 3, 2, 4, '#c83a4a'], [4, 6, 2, 1, '#f2f2f2']] },
    { name: 'Sneaker', px: [[0, 3, 6, 3, '#f2f2f2'], [4, 1, 2, 2, '#f2f2f2'], [0, 5, 7, 1, '#c8c8d0'], [2, 3, 2, 1, '#e8643a']] }
  ];
  var LEUTE = ['#c83a3a', '#3a6ac8', '#3aa85a', '#e8a82a', '#8a4ac8', '#2a2a32', '#c8c8d0', '#e86a9a'];
  var HAARE = ['#2a1a12', '#c89a4a', '#5a3a22', '#1a1a1e', '#8a8a8a'];
  var SPRUCH = {
    start: ['Ich komm zu spät!!', 'Wo ist mein Handy?! Ach, in der Hand.', 'Hab ich alles? Egal, los!'],
    verloren: ['Moment, mein ', 'Oh nein, mein ', 'Wo ist mein ', 'Hab ich mein '],
    rempler: ['Sorry!!', 'Ich seh nix!', 'Ihr seid alle so GROSS!', 'Entschuldigung!', 'Aua!'],
    pfuetze: ['MEINE SCHUHE!!', 'Die waren neu!!', 'Iiiih!'],
    mode: ['Muss ich haben!', 'Sooo süß!', 'Passt perfekt zum Outfit!', 'Gekauft!'],
    hallo: ['HALLOOOO?!', 'PLATZ DA!', 'ICH BIN AUCH NOCH HIER!', 'HILFEEEE!'],
    aua: ['Meine Ohren!', 'Das Glas!!', 'Wuff!', 'Was war DAS?!'],
    falsch: ['Hier war ich noch nie.', 'Das ist nicht der Weg …', 'Wo bin ich?!'],
    richtig: ['Genau so wollte ich!', 'Wusste ich doch!']
  };

  var CSS = [
    '.ju{position:absolute;inset:0;overflow:hidden;background:#2a2630;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.ju canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.ju-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.ju-top button{pointer-events:auto}',
    '.ju-hud{flex:1;text-align:center;text-shadow:2px 2px 0 #000;opacity:0;transition:opacity .3s}',
    '.ju-hud.an{opacity:1}',
    '.ju-hud b{display:block;font:clamp(14px,4.4vw,22px)/1.2 "Press Start 2P",monospace;color:#fff}',
    '.ju-hud b.knapp{color:#ff5a6a;animation:juWackel .15s infinite alternate}',
    '@keyframes juWackel{from{transform:translateX(-2px)}to{transform:translateX(2px)}}',
    '.ju-hud small{display:block;font:9px/1.6 "Press Start 2P",monospace;margin-top:4px;color:#ffb8d8}',
    '.ju-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:3px 8px;font-size:15px;white-space:nowrap;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:juPop .15s}',
    '.ju-blase.rosa{background:#ffe0ee}',
    '.ju-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:inherit;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes juPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.ju-meldung{position:absolute;left:50%;top:34%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;z-index:19;width:94%}',
    '.ju-meldung b{display:block;font:clamp(13px,4.4vw,22px)/1.3 "Press Start 2P",monospace;color:#ffb8d8;text-shadow:3px 3px 0 #000}',
    '.ju-meldung small{display:block;font-size:18px;text-shadow:2px 2px 0 #000;margin-top:6px}',
    '.ju-meldung.zeigen{animation:juMeld 1.5s ease-out}',
    '@keyframes juMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}78%{opacity:1}100%{opacity:0}}',
    '.ju-hallo{position:absolute;right:calc(14px + env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:21;width:96px;height:96px;border-radius:50%;',
    ' border:4px solid #fff;background:conic-gradient(#ff5a9a var(--p,0%),rgba(20,20,26,.55) 0);color:#fff;font:10px/1.3 "Press Start 2P",monospace;text-shadow:2px 2px 0 #000;touch-action:none;display:none}',
    '.ju-hallo.an{display:block}.ju-hallo.voll{animation:juPuls .5s infinite alternate}',
    '@keyframes juPuls{to{transform:scale(1.08)}}',
    '.ju-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,8,14,.6);z-index:40;padding:16px;overflow:auto}',
    '.ju-ovl.aus{display:none}',
    '.ju-karte{width:min(460px,100%);background:#fdf2f6;color:#2a1a24;border:4px solid #2a1a24;box-shadow:8px 8px 0 #c84a7a;padding:16px 18px;text-align:center;margin:auto}',
    '.ju-karte h1{margin:4px 0;font:clamp(15px,4.6vw,22px)/1.3 "Press Start 2P",monospace;color:#c84a7a}',
    '.ju-karte h1.rot{color:#d83a3a}',
    '.ju-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.ju-karte canvas{position:static;height:76px;width:auto;margin:4px auto}',
    '.ju-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.ju-karte li{margin-bottom:5px}',
    '.ju-karte .zeile{display:flex;justify-content:space-between;gap:8px;border-top:2px dashed rgba(42,26,36,.3);padding:6px 0;font-size:17px;text-align:left}',
    '.ju-karte .zeile b{font:10px/1.7 "Press Start 2P",monospace;color:#c84a7a;white-space:nowrap}',
    '.ju-karte .zitat{font-size:17px;margin:6px 0}.ju-karte .zitat i{color:#6a5a64}',
    '.ju-karte .px-btn{width:100%;margin-top:8px}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function hash(n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
  function ortName(z) { return z.charAt(0) + z.slice(1).toLowerCase().replace('ae', 'ä'); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="ju"><canvas></canvas>' +
      '<div class="ju-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="ju-hud" data-el="hud"><b data-el="zeit"></b><small data-el="info"></small></div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="ju-meldung" data-el="meldung"></div>' +
      '<button class="ju-hallo" data-el="hallo" aria-label="Hallo rufen">HAL-<br>LOOO!</button>' +
      '<div class="ju-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.ju'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), halloBtn = $('hallo'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now(), meldT = 0;

    // ---------- Layout: Straße 120 px breit, Höhe füllt den Bildschirm ----------
    var S = 3, IW = 0, IH = 0, OX = 0, JY = 0;
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight;
      S = Math.max(2, Math.min(SW / W0, SH / 150));
      if (S >= 3) S = Math.floor(S);
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      OX = Math.floor((IW - W0) / 2);
      JY = IH - Math.round(Math.max(46, 130 / S));   // Jules Füße
    }
    // Welt-Distanz d → Bildschirm-y (größere Distanz = weiter oben)
    function sy(d) { return JY - (d - g.dist); }

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = { modus: 'intro', t: 0, dist: 0, tempo: 58, rest: 25, punkte: 0, combo: 0, comboT: 0, mode: 0, eingesammelt: 0, vergessen: [],
        x: MITTE, zielX: null, tasche: SACHEN.map(function (s) { return s.id; }), dinge: [], partikel: [], blasen: [], wackeln: 0,
        langsam: 0, schutz: 0, hallo: 0.4, spawnAb: 60, verlierAb: rnd(3.5, 5), zielNr: 0, naechstesZiel: 380, kreuzAb: 520, kreuz: null, laufT: 0, spruchSperre: 0 };
    }
    function sachen(id) { for (var i = 0; i < SACHEN.length; i++) if (SACHEN[i].id === id) return SACHEN[i]; }
    function melde(txt, klein) {
      var el = $('meldung'); el.className = 'ju-meldung'; el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1500);
    }
    function sag(txt, x, d, dauer, andere) {
      g.blasen.forEach(function (b) { b.el.remove(); }); g.blasen = [];
      var el = document.createElement('div'); el.className = 'ju-blase' + (andere ? '' : ' rosa'); el.textContent = txt; wrap.appendChild(el);
      g.blasen.push({ el: el, x: x, d: d, jule: !andere, t: dauer || 1.4 });
    }
    // kurze Sprüche nicht im Sekundentakt; wichtige (mit Dauer) immer
    function sagJule(txt, dauer) { if (g.spruchSperre > 0 && !dauer) return; g.spruchSperre = 0.6; sag(txt, g.x, g.dist + 26, dauer || 1.3); }
    function blasenPos(b) {
      var x = b.jule ? g.x : b.x, y = b.jule ? JY - 27 : sy(b.d);
      var hb = b.el.offsetWidth / 2 + 4;
      b.el.style.left = clamp((OX + x) * S, hb, wrap.clientWidth - hb) + 'px';
      b.el.style.top = Math.max(b.el.offsetHeight + 70, y * S) + 'px';
    }

    // ---------- Spawnen ----------
    function spawn() {
      var d = g.dist + JY + 40, st = Math.min(1, g.dist / 2500), r = Math.random();
      if (g.kreuz && d > g.kreuz.d0 - 70 && d < g.kreuz.d0 + 150) return 40;   // Kreuzung frei halten
      if (r < 0.34 + st * 0.12) {
        // Menschenmenge mit Lücke – alle größer als Jule
        var luecke = rnd(RAND + 14, W0 - RAND - 14), n = 2 + Math.floor(Math.random() * (2 + st * 3));
        for (var i = 0; i < n; i++) {
          var x = RAND + 6 + Math.random() * (W0 - 2 * RAND - 12);
          if (Math.abs(x - luecke) < 14 - st * 3) continue;
          g.dinge.push({ typ: 'mensch', x: x, d: d + rnd(-8, 8), r: 5, farbe: pick(LEUTE), haar: pick(HAARE), gr: Math.floor(rnd(30, 38)), vd: -rnd(8, 18), seed: Math.random() });
        }
        return rnd(46, 70) - st * 14;
      }
      if (r < 0.48) { var links = Math.random() < 0.5; g.dinge.push({ typ: 'rad', x: links ? -10 : W0 + 10, d: d - 20, r: 5, vx: (links ? 1 : -1) * rnd(55, 80 + st * 40) }); return rnd(34, 50); }
      if (r < 0.6) { var l2 = Math.random() < 0.5; g.dinge.push({ typ: 'hund', x: l2 ? RAND : W0 - RAND, d: d, r: 4, vx: (l2 ? 1 : -1) * rnd(25, 45), seed: Math.random() }); return rnd(30, 46); }
      if (r < 0.72) { g.dinge.push({ typ: 'pfuetze', x: rnd(RAND + 12, W0 - RAND - 12), d: d, r: 8 }); return rnd(28, 44); }
      if (r < 0.92) { g.dinge.push({ typ: 'mode', x: rnd(RAND + 8, W0 - RAND - 8), d: d, r: 6, m: pick(MODE) }); return rnd(22, 36); }
      g.dinge.push({ typ: 'uhr', x: rnd(RAND + 8, W0 - RAND - 8), d: d, r: 6 }); return rnd(30, 44);
    }
    function kreuzungStart() {
      var d0 = g.dist + JY + 120, seite = Math.random() < 0.5 ? 'links' : 'rechts';
      g.kreuz = { d0: d0, seite: seite, ziel: ZIELE[g.zielNr % ZIELE.length], gesagt: false, fertig: false };
      g.dinge = g.dinge.filter(function (o) { return o.typ === 'sache' || o.d < d0 - 80 || o.d > d0 + 160; });
    }
    function sacheVerlieren(warum) {
      if (!g.tasche.length) return;
      var id = g.tasche.splice(Math.floor(Math.random() * g.tasche.length), 1)[0];
      var seite = Math.random() < 0.5 ? -1 : 1, zx = clamp(g.x + seite * rnd(18, 50), RAND + 6, W0 - RAND - 6), zd = g.dist + rnd(60, 110);
      // fällt sie an einer Kreuzung raus, landet sie auf der richtigen Seite
      if (g.kreuz && zd > g.kreuz.d0 - 10 && zd < g.kreuz.d0 + 150) zx = g.kreuz.seite === 'links' ? clamp(zx, RAND + 6, MITTE - 8) : clamp(zx, MITTE + 8, W0 - RAND - 6);
      g.dinge.push({ typ: 'sache', id: id, x: zx, d: zd, r: 7, von: { x: g.x, d: g.dist + 12 }, flug: 0 });
      if (warum !== 'rempler') sagJule(pick(SPRUCH.verloren) + sachen(id).name + '?!', 1.4);
      Pixel.sfx.tone(660, 0.06, 'square', 0.04, 440);
    }

    // ---------- Eingabe ----------
    var tasten = { links: false, rechts: false };
    function hallo() {
      if (g.modus !== 'lauf' || g.hallo < 1) return;
      g.hallo = 0; g.wackeln = 0.45; g.langsam = 0;
      sagJule(pick(SPRUCH.hallo), 1.2);
      var weg = 0;
      g.dinge.forEach(function (o) {
        if ((o.typ === 'mensch' || o.typ === 'hund' || o.typ === 'rad') && Math.abs(o.d - g.dist) < 110) {
          o.flieht = true; o.vx = (o.x < g.x ? -1 : 1) * rnd(90, 140); weg++;
        }
      });
      for (var i = 0; i < 14; i++) g.partikel.push({ x: i % 2 ? rnd(0, 8) : W0 - rnd(0, 8), d: g.dist + rnd(10, 120), vx: (i % 2 ? 1 : -1) * rnd(10, 40), vd: rnd(-10, 20), t: 0, farbe: '#bfe8ff' });
      if (weg) setTimeout(function () { if (alive && g.modus === 'lauf') sag(pick(SPRUCH.aua), clamp(g.x + 30, 20, 100), g.dist + 70, 1.1, true); }, 500);
      Pixel.sfx.tone(1760, 0.3, 'sine', 0.06, 2400); Pixel.sfx.tone(2093, 0.35, 'sine', 0.05, 2794, 0.15); Pixel.sfx.noise(0.25, 0.08, 6000);
    }
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'lauf') { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } } return; }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') { tasten.links = true; g.zielX = null; e.preventDefault(); }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') { tasten.rechts = true; g.zielX = null; e.preventDefault(); }
      if ((e.code === 'Space' || e.code === 'KeyE' || e.code === 'ArrowUp') && !e.repeat) { e.preventDefault(); hallo(); }
    }
    function ku(e) {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') tasten.links = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') tasten.rechts = false;
    }
    function zeiger(e) {
      if (g.modus !== 'lauf') return;
      var r = cv.getBoundingClientRect();
      g.zielX = clamp((e.clientX - r.left) / S - OX, RAND + 5, W0 - RAND - 5);
    }
    var gedrueckt = false;
    cv.addEventListener('pointerdown', function (e) { e.preventDefault(); gedrueckt = true; zeiger(e); });
    cv.addEventListener('pointermove', function (e) { if (gedrueckt || e.pointerType === 'mouse') zeiger(e); });
    window.addEventListener('pointerup', losgelassen);
    function losgelassen() { gedrueckt = false; }
    halloBtn.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); hallo(); });
    function allesLos() { tasten.links = tasten.rechts = false; gedrueckt = false; }

    // ---------- Update ----------
    function trifft(o) { return Math.abs(o.x - g.x) < o.r + 4 && Math.abs(o.d - (g.dist + 3)) < o.r + 3; }
    function update(dt) {
      g.t += dt;
      g.blasen = g.blasen.filter(function (b) { b.t -= dt; if (b.t <= 0) { b.el.remove(); return false; } return true; });
      g.partikel = g.partikel.filter(function (p) { p.t += dt; p.x += (p.vx || 0) * dt; p.d += (p.vd || 0) * dt; return p.t < (p.max || 0.9); });
      g.wackeln = Math.max(0, g.wackeln - dt);
      if (g.modus !== 'lauf') return;
      g.spruchSperre = Math.max(0, g.spruchSperre - dt);
      // Tempo steigt; Rempler und Pfützen bremsen
      g.tempo = Math.min(160, 58 + g.dist * 0.032);
      g.langsam = Math.max(0, g.langsam - dt); g.schutz = Math.max(0, g.schutz - dt);
      var v = g.tempo * (g.langsam > 0 ? 0.4 : 1);
      g.dist += v * dt; g.laufT += dt * v / 40;
      g.rest -= dt;
      g.hallo = Math.min(1, g.hallo + dt / 6);
      g.comboT -= dt; if (g.comboT <= 0) g.combo = 0;
      g.punkte += v * dt * 0.5;
      // Steuern: Finger/Maus gibt ein Ziel vor, Tasten schieben
      var ziel = g.zielX;
      if (tasten.links || tasten.rechts) ziel = g.x + (tasten.rechts ? 30 : 0) - (tasten.links ? 30 : 0);
      if (ziel !== null && ziel !== undefined) g.x += clamp(ziel - g.x, -130 * dt, 130 * dt);
      g.x = clamp(g.x, RAND + 5, W0 - RAND - 5);
      // Kreuzung: Mittelinsel blockiert, danach wird geprüft, wo sie ist
      var k = g.kreuz;
      if (k) {
        if (!k.gesagt && sy(k.d0 - 40) > 30) {
          k.gesagt = true;
          var falsch = Math.random() < 0.6, sagt = falsch ? (k.seite === 'links' ? 'RECHTS' : 'LINKS') : k.seite.toUpperCase();
          sagJule(sagt + '! Ganz sicher ' + sagt.toLowerCase() + '!', 1.8);
        }
        if (g.dist + 3 > k.d0 && g.dist + 3 < k.d0 + 140 && Math.abs(g.x - MITTE) < 7) g.x = g.x < MITTE ? MITTE - 7 : MITTE + 7;
        if (!k.fertig && g.dist > k.d0 + 70) {
          k.fertig = true;
          if ((g.x < MITTE ? 'links' : 'rechts') === k.seite) { g.punkte += 150; melde('Richtig abgebogen!', '+150'); sagJule(pick(SPRUCH.richtig)); Pixel.sfx.tone(784, 0.1, 'square', 0.05); Pixel.sfx.tone(1047, 0.15, 'square', 0.05, null, 0.1); }
          else { g.rest -= 4; melde('Falsch abgebogen!', '−4 Sekunden'); sagJule(pick(SPRUCH.falsch)); g.wackeln = 0.3; Pixel.sfx.tone(220, 0.25, 'sawtooth', 0.05, 150); }
        }
        if (g.dist > k.d0 + 220) { g.kreuz = null; g.kreuzAb = g.dist + rnd(420, 600); }
      } else if (g.dist > g.kreuzAb) kreuzungStart();
      // Zwischenziel: Zeit gutschreiben
      if (g.dist > g.naechstesZiel) {
        var bonus = Math.max(4, 8 - g.zielNr * 0.5), name = ZIELE[g.zielNr % ZIELE.length];
        g.rest += bonus; g.punkte += 200; g.zielNr++; g.naechstesZiel = g.dist + 380 + g.zielNr * 30;
        melde(ortName(name) + ' geschafft!', '+' + Math.round(bonus) + ' Sekunden');
        Pixel.sfx.tone(523, 0.08, 'square', 0.05); Pixel.sfx.tone(659, 0.08, 'square', 0.05, null, 0.08); Pixel.sfx.tone(784, 0.14, 'square', 0.05, null, 0.16);
      }
      if (g.dist >= g.spawnAb) g.spawnAb = g.dist + spawn();
      // Vergesslich: alle paar Sekunden fällt was raus
      g.verlierAb -= dt;
      if (g.verlierAb <= 0) { g.verlierAb = Math.max(2.2, rnd(3.5, 5.5) - g.dist / 900); sacheVerlieren('vergessen'); }
      // Dinge bewegen, einsammeln, treffen
      g.dinge.forEach(function (o) {
        if (o.typ === 'mensch') { o.d += o.vd * dt; if (o.flieht) o.x += o.vx * dt; }
        if (o.typ === 'hund' || o.typ === 'rad') { o.x += o.vx * dt; if (o.typ === 'hund' && !o.flieht && (o.x < RAND || o.x > W0 - RAND)) o.vx = -o.vx; }
        if (o.typ === 'sache' && o.flug < 1) o.flug = Math.min(1, o.flug + dt * 2.4);
        if (o.weg || !trifft(o)) return;
        if (o.typ === 'sache') {
          if (o.flug < 1) return;
          o.weg = true; g.tasche.push(o.id); g.eingesammelt++; g.punkte += 40;
          g.partikel.push({ txt: 'WIEDER DA', x: o.x - 14, d: o.d + 10, vd: 14, t: 0, max: 0.9, farbe: '#5ae87a' });
          Pixel.sfx.tone(988, 0.05, 'square', 0.04); Pixel.sfx.tone(1319, 0.08, 'square', 0.04, null, 0.05);
        } else if (o.typ === 'mode') {
          o.weg = true; g.combo = Math.min(9, g.combo + 1); g.comboT = 3.5; g.mode++;
          var p = 30 * g.combo; g.punkte += p;
          g.partikel.push({ txt: '+' + p + (g.combo > 1 ? ' X' + g.combo : ''), x: o.x - 10, d: o.d + 10, vd: 14, t: 0, max: 0.9, farbe: '#ffb8d8' });
          if (g.combo >= 2 || Math.random() < 0.35) sagJule(pick(SPRUCH.mode));
          Pixel.sfx.tone(880 + g.combo * 60, 0.05, 'triangle', 0.05); Pixel.sfx.tone(1320 + g.combo * 60, 0.08, 'triangle', 0.05, null, 0.05);
        } else if (o.typ === 'uhr') {
          o.weg = true; g.rest += 2;
          g.partikel.push({ txt: '+2 S', x: o.x - 8, d: o.d + 10, vd: 14, t: 0, max: 0.9, farbe: '#ffd23f' });
          Pixel.sfx.tone(1047, 0.06, 'square', 0.04); Pixel.sfx.tone(1568, 0.1, 'square', 0.04, null, 0.06);
        } else if (o.typ === 'pfuetze') {
          if (g.schutz > 0) return;
          g.schutz = 0.8; g.langsam = 0.5; sagJule(pick(SPRUCH.pfuetze));
          for (var i = 0; i < 6; i++) g.partikel.push({ x: o.x, d: o.d, vx: rnd(-40, 40), vd: rnd(10, 40), t: 0, max: 0.5, farbe: '#7ab8e8' });
          Pixel.sfx.noise(0.2, 0.12, 900);
        } else if (!o.flieht && g.schutz <= 0) {
          // Rempler: bremst und schüttelt etwas aus der Tasche
          g.schutz = 1.1; g.langsam = 0.7; g.wackeln = 0.25; o.flieht = true; o.vx = (o.x < g.x ? -1 : 1) * 40;
          sagJule(pick(SPRUCH.rempler)); sacheVerlieren('rempler');
          Pixel.sfx.tone(160, 0.12, 'square', 0.06, 110); Pixel.sfx.noise(0.1, 0.1, 500);
        }
      });
      // Sachen, die aus dem Bild scrollen, sind vergessen
      g.dinge.forEach(function (o) {
        if (o.typ === 'sache' && !o.weg && sy(o.d) > IH + 6) {
          o.weg = true; g.vergessen.push(o.id); g.rest -= 2;
          melde(sachen(o.id).name + ' vergessen!', 'Kurz zurückrennen … −2 Sekunden');
          Pixel.sfx.tone(330, 0.25, 'triangle', 0.05, 200);
        }
      });
      g.dinge = g.dinge.filter(function (o) { return !o.weg && sy(o.d) < IH + 60 && o.x > -30 && o.x < W0 + 30; });
      if (g.rest <= 0) { g.rest = 0; ende(); }
    }

    // ---------- Zeichnen ----------
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x), Math.round(y), Math.round(w), Math.round(h)); }
    function bild(px, x, y) { px.forEach(function (p) { R(x + p[0], y + p[1], p[2], p[3], p[4]); }); }
    function strasse() {
      var wx = g.wackeln > 0 ? Math.round(rnd(-1.5, 1.5)) : 0;
      ctx.save(); ctx.translate(wx, 0);
      ctx.fillStyle = '#3a3640'; ctx.fillRect(-2, 0, IW + 4, IH);
      // Häuser links und rechts (scrollen mit; HALLOOO lässt die Fenster blitzen)
      var blk = 46, erster = Math.floor((g.dist - IH) / blk) - 1, farben = ['#c86a5a', '#e8c8a0', '#8aa8c8', '#c8a8d8', '#a8c890'];
      for (var i = erster; i < erster + Math.ceil(IH / blk) + 4; i++) {
        var y = sy(i * blk) - blk;
        [[-OX - 2, OX + 2, hash(i * 3.1)], [W0, IW - OX - W0 + 2, hash(i * 7.7)]].forEach(function (s, k) {
          if (s[1] <= 0) return;
          R(s[0], y, s[1], blk - 2, farben[Math.floor(s[2] * 5)]);
          R(s[0], y + blk - 6, s[1], 4, 'rgba(0,0,0,.18)');
          for (var f = 0; f < 3; f++) R(k ? s[0] + 3 : s[0] + s[1] - 9, y + 6 + f * 13, 6, 8, g.wackeln > 0 && hash(i + f) > 0.4 ? '#ffffff' : '#9ad0f2');
        });
      }
      // Gehweg und Fahrbahn
      R(0, 0, RAND, IH, '#b8b0a8'); R(W0 - RAND, 0, RAND, IH, '#b8b0a8');
      for (var p = Math.floor(g.dist / 10) * 10 - 20; p < g.dist + IH + 20; p += 10) { R(0, sy(p), RAND, 1, 'rgba(0,0,0,.12)'); R(W0 - RAND, sy(p), RAND, 1, 'rgba(0,0,0,.12)'); }
      R(RAND, 0, W0 - 2 * RAND, IH, '#5a5662');
      var k = g.kreuz;
      for (p = Math.floor(g.dist / 24) * 24 - 24; p < g.dist + IH + 24; p += 24) {
        if (k && p > k.d0 - 30 && p < k.d0 + 150) continue;
        R(MITTE - 1, sy(p) - 10, 2, 10, '#e8e0c8');
      }
      if (k) {
        // Mittelinsel, Schild mit Pfeil, Baustelle auf der falschen Seite
        var y0 = sy(k.d0 + 140), y1 = sy(k.d0);
        R(MITTE - 6, y0, 12, y1 - y0, '#6a9a4a'); R(MITTE - 6, y0, 12, 2, '#b8b0a8'); R(MITTE - 6, y1 - 2, 12, 2, '#b8b0a8');
        for (var b = 0; b < 4; b++) R(MITTE - 3, y0 + 10 + b * 30, 6, 6, '#4a8a3a');
        var ys = sy(k.d0 - 30), li = k.seite === 'links';
        R(MITTE - 1, ys - 2, 2, 12, '#8a8a8a'); R(MITTE - 30, ys - 16, 60, 14, '#2a5ab8'); R(MITTE - 29, ys - 15, 58, 12, '#3a6ac8');
        Pixel.text(ctx, k.ziel.slice(0, 9), OX + MITTE + (li ? 4 : -4), ys - 12, 1, '#ffffff', 'center');
        var ax = li ? MITTE - 27 : MITTE + 22;
        R(ax, ys - 10, 5, 2, '#ffd23f'); R(li ? ax : ax + 3, ys - 12, 2, 6, '#ffd23f');
        var fx = li ? MITTE + 8 : RAND + 2;
        if (y0 < IH) for (var z = 0; z < 3; z++) R(fx + z * 14, y0 + 4, 8, 3, z % 2 ? '#f2f2f2' : '#e8643a');
      }
      // nächstes Zwischenziel als Banner quer über die Straße
      var zy = sy(g.naechstesZiel);
      if (zy > -20 && zy < IH) {
        R(RAND, zy - 12, W0 - 2 * RAND, 12, '#c84a7a'); R(RAND, zy - 12, W0 - 2 * RAND, 2, '#ff7ab0');
        Pixel.text(ctx, ZIELE[g.zielNr % ZIELE.length], OX + MITTE, zy - 9, 1, '#ffffff', 'center');
        R(RAND - 2, zy - 14, 2, 16, '#8a8a8a'); R(W0 - RAND, zy - 14, 2, 16, '#8a8a8a');
      }
      ctx.restore();
    }
    function mensch(o) {
      var y = sy(o.d), h = o.gr, lauf = Math.floor(g.t * 6 + o.seed * 10) % 2;
      R(o.x - 5, y - 1, 10, 2, 'rgba(0,0,0,.25)');
      R(o.x - 3, y - 7, 2, 7 - lauf, '#2a2a3a'); R(o.x + 1, y - 7, 2, 6 + lauf, '#2a2a3a');
      R(o.x - 5, y - h + 9, 10, h - 16, o.farbe); R(o.x - 6, y - h + 11, 1, 10, o.farbe); R(o.x + 5, y - h + 11, 1, 10, o.farbe);
      R(o.x - 3, y - h + 2, 6, 7, '#e8b898'); R(o.x - 3, y - h + 1, 6, 3, o.haar);
      if (o.flieht) { R(o.x - 4, y - h + 4, 1, 3, '#e8b898'); R(o.x + 3, y - h + 4, 1, 3, '#e8b898'); }   // Hände an den Ohren
    }
    function objekt(o) {
      var y = sy(o.d);
      if (o.typ === 'mensch') return mensch(o);
      if (o.typ === 'pfuetze') { R(o.x - 9, y - 4, 18, 6, '#4a7ab8'); R(o.x - 6, y - 3, 6, 1, '#8ac0f0'); return; }
      if (o.typ === 'hund') {
        var w = Math.floor(g.t * 8) % 2, r = o.vx > 0;
        R(o.x - 5, y - 6, 10, 4, '#a87a4a'); R(r ? o.x + 4 : o.x - 7, y - 9, 4, 4, '#a87a4a'); R(r ? o.x + 6 : o.x - 7, y - 8, 1, 1, '#14141a');
        R(o.x - 4, y - 2, 1, 2 + w, '#7a5a3a'); R(o.x + 3, y - 2, 1, 3 - w, '#7a5a3a'); R(r ? o.x - 6 : o.x + 5, y - 7 - w, 1, 2, '#a87a4a');
        return;
      }
      if (o.typ === 'rad') {
        R(o.x - 7, y - 4, 5, 5, '#2a2a2a'); R(o.x + 2, y - 4, 5, 5, '#2a2a2a'); R(o.x - 6, y - 3, 3, 3, '#5a5662'); R(o.x + 3, y - 3, 3, 3, '#5a5662');
        R(o.x - 4, y - 8, 8, 2, '#3ab0e8'); R(o.x - 2, y - 18, 5, 10, '#e8a82a'); R(o.x - 2, y - 22, 4, 4, '#e8b898');
        return;
      }
      var hop = Math.round(Math.sin(g.t * 6 + o.x) * 1.5);
      if (o.typ === 'mode') { R(o.x - 5, y - 2, 10, 2, 'rgba(0,0,0,.2)'); bild(o.m.px, o.x - 3.5, y - 10 + hop); if (Math.floor(g.t * 4 + o.x) % 3 === 0) R(o.x + 4, y - 12 + hop, 1, 1, '#ffffff'); return; }
      if (o.typ === 'uhr') { R(o.x - 4, y - 10 + hop, 8, 8, '#ffd23f'); R(o.x - 3, y - 9 + hop, 6, 6, '#fffbe8'); R(o.x, y - 8 + hop, 1, 3, '#14141a'); R(o.x, y - 6 + hop, 2, 1, '#14141a'); return; }
      if (o.typ === 'sache') {
        // fliegt im Bogen aus der Tasche, dann blinkt ein Rahmen drum
        var f = o.flug, x = o.von.x + (o.x - o.von.x) * f, dd = o.von.d + (o.d - o.von.d) * f, yy = sy(dd) - Math.sin(f * Math.PI) * 18;
        if (f >= 1) { R(x - 6, yy - 12, 13, 13, Math.floor(g.t * 5) % 2 ? '#ff5a9a' : '#ffffff'); R(x - 5, yy - 11, 11, 11, '#3a3640'); }
        bild(sachen(o.id).px, x - 3.5, yy - 9);
      }
    }
    function jule() {
      var lauf = Math.floor(g.laufT * 3) % 2, y = JY - 24 - lauf;
      R(g.x - 6, JY - 1, 12, 2, 'rgba(0,0,0,.3)');
      if (g.schutz > 0 && Math.floor(g.t * 16) % 2) return;
      var mood = g.schutz > 0.4 ? 'schock' : g.langsam > 0 ? 'verwirrt' : g.combo >= 2 ? 'happy' : 'neutral';
      Pixel.draw(ctx, Sprites.jule(mood), OX + g.x - 8, y, 1);
      R(g.x + 6, y + 12, 2, 3, '#1a1a22'); R(g.x + 6, y + 12, 1, 1, '#5ac8f0');   // Handy in der Hand
      R(g.x - 9, y + 13, 4, 5, '#c84a7a'); if (g.tasche.length > SACHEN.length / 2) R(g.x - 9, y + 12, 4, 1, '#e86a9a');
    }
    function taschenLeiste() {
      var y = Math.ceil(64 / S) + 22, x0 = MITTE - SACHEN.length * 5;
      R(x0 - 3, y - 2, SACHEN.length * 10 + 4, 12, 'rgba(20,16,26,.7)');
      SACHEN.forEach(function (s, i) {
        var da = g.tasche.indexOf(s.id) >= 0, faellt = g.dinge.some(function (o) { return o.typ === 'sache' && o.id === s.id; });
        if (da || (faellt && Math.floor(g.t * 6) % 2)) bild(s.px, x0 + i * 10, y);
        else if (!faellt) R(x0 + i * 10 + 1, y + 3, 5, 1, '#8a3a4a');
      });
    }
    function render() {
      ctx.imageSmoothingEnabled = false;
      strasse();
      // weiter oben zuerst zeichnen: große Leute verdecken, was hinter ihnen liegt
      var jGemalt = false;
      g.dinge.slice().sort(function (a, b) { return b.d - a.d; }).forEach(function (o) {
        if (!jGemalt && o.d < g.dist) { jule(); jGemalt = true; }
        objekt(o);
      });
      if (!jGemalt) jule();
      g.partikel.forEach(function (p) {
        ctx.globalAlpha = Math.max(0, 1 - p.t / (p.max || 0.9));
        if (p.txt) { Pixel.text(ctx, p.txt, OX + p.x + 1, sy(p.d) + 1, 1, '#000'); Pixel.text(ctx, p.txt, OX + p.x, sy(p.d), 1, p.farbe); }
        else R(p.x, sy(p.d), 2, 2, p.farbe);
        ctx.globalAlpha = 1;
      });
      if (g.modus === 'lauf' || g.modus === 'ende') taschenLeiste();
    }
    function hud() {
      var an = g.modus === 'lauf';
      $('hud').classList.toggle('an', an);
      halloBtn.classList.toggle('an', an);
      if (an) {
        var z = $('zeit'); z.textContent = '⏰ ' + Math.ceil(g.rest) + ' S'; z.classList.toggle('knapp', g.rest < 8);
        $('info').textContent = Math.floor(g.dist / 4) + ' M · ' + Math.floor(g.punkte) + ' PKT' + (g.combo > 1 ? ' · COMBO X' + g.combo : '');
        halloBtn.style.setProperty('--p', Math.round(g.hallo * 100) + '%');
        halloBtn.classList.toggle('voll', g.hallo >= 1);
      }
      g.blasen.forEach(blasenPos);
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render(); hud();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function figur(mood) { var img = Sprites.jule(mood), c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); return c; }
    function intro() {
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="ju-karte"><h1>Jule kommt zu spät</h1><div class="unter">Wie jeden Tag. Und die Tasche ist schon wieder offen.</div><div data-el="fig"></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>👉 <b>Ziehen/Tippen</b> (oder ←/→): Jule lenken.</li>' +
        '<li>🎒 Ständig fällt was aus der Tasche – <b>schnell einsammeln</b>, bevor es aus dem Bild ist.</li>' +
        '<li>🧍 Alle sind größer als Jule: Leute rempeln und schütteln noch mehr aus der Tasche.</li>' +
        '<li>📣 <b>HALLOOO!</b> (Knopf/Leertaste, lädt sich auf) fegt alle weg. Gläser leider auch.</li>' +
        '<li>🪧 An Kreuzungen dem <b>Schild</b> folgen – nicht Jule.</li>' +
        '<li>👜 Fashion-Teile = Combo-Punkte. ⏰ Uhren und Zwischenziele = mehr Zeit.</li></ul>' +
        '<button class="px-btn" data-act="los">Los, renn!</button></div>';
      ovl.classList.remove('aus'); ovl.querySelector('[data-el=fig]').appendChild(figur('schock'));
    }
    function los() {
      g.blasen.forEach(function (b) { b.el.remove(); });
      reset(); g.modus = 'lauf'; ovl.classList.add('aus'); allesLos();
      melde('Noch 25 Sekunden!', 'Erst mal zur ' + ortName(ZIELE[0]));
      setTimeout(function () { if (alive && g.modus === 'lauf') sagJule(pick(SPRUCH.start), 1.6); }, 700);
      Pixel.sfx.tone(523, 0.08, 'square', 0.05); Pixel.sfx.tone(659, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(784, 0.15, 'square', 0.05, null, 0.18);
    }
    function ende() {
      if (g.modus !== 'lauf') return;
      g.modus = 'ende'; allesLos();
      var dabei = g.tasche.length, pkt = Math.floor(g.punkte) + dabei * 50;
      var best = +Pixel.get(BEST_KEY, 0), neu = pkt > best; if (neu) Pixel.set(BEST_KEY, pkt);
      var fehlt = SACHEN.filter(function (s) { return g.tasche.indexOf(s.id) < 0; }).map(function (s) { return s.name; });
      Pixel.sfx.tone(392, 0.3, 'triangle', 0.06, 370); Pixel.sfx.tone(349, 0.3, 'triangle', 0.06, 330, 0.3); Pixel.sfx.tone(294, 0.6, 'triangle', 0.06, 220, 0.6);
      sagJule('ZU SPÄT?! Ich hab mich doch beeilt!', 1.8);
      setTimeout(function () {
        if (!alive) return;
        ovl.innerHTML = '<div class="ju-karte"><h1 class="rot">Zu spät!</h1><div class="unter">Kurz vor: ' + ortName(ZIELE[g.zielNr % ZIELE.length]) + '. Fast.</div><div data-el="fig"></div>' +
          '<div class="zeile"><span>Strecke</span><b>' + Math.floor(g.dist / 4) + ' m</b></div>' +
          '<div class="zeile"><span>Zwischenziele</span><b>' + g.zielNr + '</b></div>' +
          '<div class="zeile"><span>Noch in der Tasche</span><b>' + dabei + '/' + SACHEN.length + '</b></div>' +
          '<div class="zeile"><span>Fashion-Teile</span><b>' + g.mode + '</b></div>' +
          '<div class="zeile"><span>Punkte</span><b>' + pkt + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, pkt) + '</b></div>' +
          (fehlt.length ? '<div class="zitat"><i>„Hat jemand ' + (fehlt.length > 1 ? 'meine Sachen' : 'mein ' + fehlt[0]) + ' gesehen?“</i></div>'
            : '<div class="zitat"><i>„Alles dabei! Und das Handy war die ganze Zeit in meiner Hand.“</i></div>') +
          '<button class="px-btn" data-act="los">Nochmal rennen</button><button class="px-btn alt" data-act="exit">Menü</button></div>';
        ovl.classList.remove('aus'); ovl.querySelector('[data-el=fig]').appendChild(figur('traurig'));
      }, 1300);
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
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('pointerup', losgelassen);
      window.removeEventListener('resize', resize); window.removeEventListener('blur', allesLos);
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize); window.addEventListener('blur', allesLos);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__jule = { g: function () { return g; }, hallo: hallo, ende: ende };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.jule = { start: start };
})();
