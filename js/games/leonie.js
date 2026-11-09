// Leonie Lockenpracht (Leon): Showtime! – 2D-Pixel-Rhythmusspiel auf der Drag-Bühne.
// Vor jeder Runde: Outfit wählen (die Jury hat ein Motto). Dann läuft der Song:
// Pfeile laufen von rechts zur Trefferzone – im Takt ←/↓/↑/→ (oder D/F/J/K, oder Touch-Knöpfe) drücken.
// Jeder Treffer = eine Pose. Perfekt = „SLAY!“, ★-Noten = Haar-Flip mit Konfetti.
// Das Publikum (HYPE) darf nicht auf 0 fallen. Nach 3 Songs entscheidet die Jury über die Krone.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.leonie.best';
  var SW0 = 180, SH0 = 140, HIT_X = 26, SPUR_Y = 124, LX = 70, LY = 28;
  var RICHTUNG = ['links', 'runter', 'hoch', 'rechts'];
  var SPUR_FARBE = ['#ff6ab8', '#4ad8f0', '#6ae86a', '#ffd23f'];
  var OUTFITS = [
    { name: 'Pink Glitzer', motto: 'Glitzer' }, { name: 'Goldrausch', motto: 'Gold' },
    { name: 'Natur-Locke', motto: 'Natürliche Locken' }, { name: 'Disco-Diva', motto: 'Disco' }
  ];
  var SONGS = [
    { name: 'Lockenpracht', bpm: 108, takte: 16, dicht: [0.72, 0.12] },
    { name: 'Laufsteg-Fieber', bpm: 120, takte: 18, dicht: [0.85, 0.28] },
    { name: 'Krone oder nix', bpm: 132, takte: 20, dicht: [0.92, 0.42] }
  ];
  var AKKORDE = [[110, 130.8, 164.8], [87.3, 110, 130.8], [130.8, 164.8, 196], [98, 123.5, 146.8]];  // Am – F – C – G
  var SPRUECHE = {
    start: ['Leonie Lockenpracht ist da, Darlings!', 'Die Locken sind echt, Baby!', 'Licht an, ich bin die Hauptfigur.'],
    slay: ['SLAY!', 'Werk it!', 'Yasss!', 'Ich bin ein Gemälde.'],
    oops: ['Absatz!', 'Das war Absicht.', 'Choreo-Update!'],
    flip: ['HAAR-FLIP!', 'Seht ihr die Locken?!']
  };
  var JURY = [
    { name: 'Madame Paillette', haar: '#e8e8f2', kleid: '#c83a8a' },
    { name: 'DJ Disco', haar: '#2a1a14', kleid: '#3a6ae8' },
    { name: 'Gräfin Glamour', haar: '#d8483a', kleid: '#e8b830' }
  ];

  var CSS = [
    '.lo{position:absolute;inset:0;overflow:hidden;background:#1a0e24;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.lo>canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.lo-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.lo-top button{pointer-events:auto}',
    '.lo-hud{flex:1;display:flex;gap:8px;justify-content:center;padding:0 8px;opacity:0;transition:opacity .4s}',
    '.lo-hud.an{opacity:1}',
    '.lo-bar{width:min(30vw,170px);background:rgba(20,10,26,.85);border:3px solid #fff;padding:4px 7px 6px;box-shadow:3px 3px 0 rgba(0,0,0,.4)}',
    '.lo-bar small{display:flex;justify-content:space-between;font:8px/1 "Press Start 2P",monospace;margin-bottom:4px;gap:6px}',
    '.lo-bar div{height:10px;background:#2a2a32;border:2px solid #000}',
    '.lo-bar div span{display:block;height:100%;width:50%;background:linear-gradient(90deg,#ff6ab8,#ffd23f);transition:width .15s}',
    '.lo-bar.knapp{animation:loWackel .12s infinite alternate}',
    '.lo-bar.info b{display:block;font:12px/1.2 "Press Start 2P",monospace;color:#ffd23f;padding-top:1px}',
    '@keyframes loWackel{from{transform:translateX(-2px)}to{transform:translateX(2px)}}',
    '.lo-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:4px 8px;font-size:15px;white-space:nowrap;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 #ff6ab8;animation:loPop .15s}',
    '.lo-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:inherit;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes loPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.lo-meldung{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;white-space:nowrap;z-index:19}',
    '.lo-meldung b{display:block;font:clamp(14px,4vw,24px)/1.2 "Press Start 2P",monospace;color:#ff6ab8;text-shadow:3px 3px 0 #000}',
    '.lo-meldung small{display:block;font-size:17px;text-shadow:2px 2px 0 #000;margin-top:8px}',
    '.lo-meldung.zeigen{animation:loMeld 1.6s ease-out}',
    '@keyframes loMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0}}',
    '.lo-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:center;gap:8px;padding:0 8px calc(10px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.lo-pad.an{display:flex}',
    '.lo-pad button{pointer-events:auto;flex:1;max-width:92px;height:74px;border-radius:14px;border:3px solid currentColor;background:rgba(20,10,26,.6);',
    ' font:22px/1 "Press Start 2P",monospace;touch-action:none}',
    '.lo-pad button.gedrueckt{background:rgba(255,255,255,.35)}',
    '.lo-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,4,16,.6);z-index:40;padding:16px;overflow:auto}',
    '.lo-ovl.aus{display:none}',
    '.lo-karte{width:min(480px,100%);background:#f6f0f6;color:#1a0e24;border:4px solid #1a0e24;box-shadow:8px 8px 0 #ff6ab8;padding:16px 18px;text-align:center;margin:auto}',
    '.lo-karte h1{margin:4px 0 4px;font:clamp(15px,4.4vw,22px)/1.3 "Press Start 2P",monospace;color:#c8287a}',
    '.lo-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.lo-karte .figs{display:flex;justify-content:center;align-items:flex-end;gap:14px;margin:4px 0}',
    '.lo-karte .figs canvas{image-rendering:pixelated;height:auto}',
    '.lo-karte .figs span{font:10px "Press Start 2P",monospace;align-self:center;color:#c8287a}',
    '.lo-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.lo-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(26,14,36,.3);padding:6px 0;font-size:18px}',
    '.lo-karte .zeile b{font:12px/1.5 "Press Start 2P",monospace;color:#c8287a}',
    '.lo-karte .zitat{font-size:18px;margin:6px 0}',
    '.lo-karte .px-btn{width:100%;margin-top:8px}',
    '.lo-motto{display:inline-block;background:#1a0e24;color:#ffd23f;font:11px/1.6 "Press Start 2P",monospace;padding:4px 10px;margin:4px 0 8px}',
    '.lo-wahl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:6px 0 4px}',
    '@media (max-width:420px){.lo-wahl{grid-template-columns:repeat(2,1fr)}}',
    '.lo-wahl button{background:#fff;border:3px solid #1a0e24;padding:6px 2px 4px;cursor:pointer;font:14px/1.2 "Pixelify Sans",sans-serif;color:#1a0e24}',
    '.lo-wahl button:hover,.lo-wahl button:focus{background:#ffe0f2;outline:none;box-shadow:0 0 0 3px #ff6ab8}',
    '.lo-wahl canvas{width:60px;height:auto;image-rendering:pixelated;display:block;margin:0 auto 4px}',
    '.lo-jury{display:flex;justify-content:center;gap:10px;margin:8px 0}',
    '.lo-jury div{flex:1;max-width:120px;font-size:14px}',
    '.lo-jury canvas{width:48px;height:auto;image-rendering:pixelated;display:block;margin:0 auto}',
    '.lo-jury b{display:block;font:26px/1.2 "Press Start 2P",monospace;color:#c8287a;margin:4px 0;opacity:0;transform:scale(2);transition:all .3s}',
    '.lo-jury b.an{opacity:1;transform:scale(1)}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // Pfeil-Sprites (9x9) – zeigt nach links, wird gedreht gezeichnet
  var PFEIL = ['....X....', '...XX....', '..XXXXXXX', '.XXXXXXXX', 'XXXXXXXXX', '.XXXXXXXX', '..XXXXXXX', '...XX....', '....X....'];
  function pfeilZeilen(lane) {
    var n = 9, out = [];
    for (var y = 0; y < n; y++) {
      var z = '';
      for (var x = 0; x < n; x++) {
        var sx, sy;
        if (lane === 0) { sx = x; sy = y; }
        else if (lane === 3) { sx = n - 1 - x; sy = y; }
        else if (lane === 2) { sx = y; sy = x; }
        else { sx = n - 1 - y; sy = x; }
        z += PFEIL[sy][sx];
      }
      out.push(z);
    }
    return out;
  }
  function pfeilBild(lane, art) {
    var farbe = art === 'stern' ? '#ffffff' : art === 'leer' ? 'rgba(255,255,255,.28)' : SPUR_FARBE[lane];
    return Pixel.sprite('lo-pfeil-' + lane + '-' + art, pfeilZeilen(lane), { X: farbe });
  }
  function juryBild(j) {
    return Pixel.sprite('lo-jury-' + j, [
      '...HHHHHH...', '..HHHHHHHH..', '.HHSSSSSSHH.', '.HSSSSSSSSH.', '.HSEESSEESH.', '.HSSSSSSSSH.', '..SSSLLSSS..', '...SSSSSS...', '..KKKSSKKK..', '.KKKKKKKKKK.', 'KKKKKKKKKKKK', 'KKKKKKKKKKKK'
    ], { H: JURY[j].haar, S: '#f0c8ae', E: '#1a0e14', L: '#c81a3a', K: JURY[j].kleid });
  }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="lo"><canvas></canvas>' +
      '<div class="lo-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="lo-hud" data-el="hud">' +
          '<div class="lo-bar" data-el="hypeBox"><small><span>HYPE</span><span data-el="song">SONG 1</span></small><div><span data-el="hype"></span></div></div>' +
          '<div class="lo-bar info"><small><span>PUNKTE</span><span data-el="combo"></span></small><b data-el="punkte">0</b></div>' +
        '</div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="lo-meldung" data-el="meldung"></div>' +
      '<div class="lo-pad" data-el="pad">' + [0, 1, 2, 3].map(function (l) {
        return '<button data-lane="' + l + '" style="color:' + SPUR_FARBE[l] + '" aria-label="' + RICHTUNG[l] + '">' + ['◀', '▼', '▲', '▶'][l] + '</button>';
      }).join('') + '</div>' +
      '<div class="lo-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.lo'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), pad = $('pad'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now(), meldT = 0, timeouts = [];
    var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    function spaeter(fn, ms) { var id = setTimeout(function () { if (alive) fn(); }, ms); timeouts.push(id); }

    // ---------- Layout ----------
    var S = 3, IW = 0, IH = 0, OX = 0, OY = 0;
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight;
      S = Math.max(2, Math.floor(Math.min(SW / 128, (SH - (touch ? 150 : 60)) / 140)));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      OX = Math.floor((IW - SW0) / 2);
      OY = Math.max(Math.ceil(62 / S), Math.floor((IH - SH0) / 2) - (touch ? Math.round(44 / S) : 0));
      OY = Math.min(OY, Math.max(0, IH - SH0));
    }
    function links() { return -OX; }
    function hitX() { return Math.max(HIT_X, links() + 12); }
    function rechts() { return IW - OX; }

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = { modus: 'intro', t: 0, runde: 0, punkte: 0, hype: 55, combo: 0, maxCombo: 0, outfit: 2, motto: 0,
        noten: [], songT: -99, schritt: -1, song: null, treffer: { perfekt: 0, gut: 0, miss: 0 }, alle: { perfekt: 0, gut: 0, miss: 0 },
        pose: 'steh', poseT: 0, gesicht: 'normal', gesichtT: 0, flip: 0, konfetti: [], texte: [], blasen: [], lichtPuls: 0, lanePuls: [0, 0, 0, 0],
        juryPunkte: [], ende: false };
    }
    function melde(txt, klein) {
      var el = $('meldung'); el.className = 'lo-meldung'; el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1600);
    }
    function sag(txt, dauer) {
      g.blasen.forEach(function (b) { b.el.remove(); });
      var el = document.createElement('div'); el.className = 'lo-blase'; el.textContent = txt; wrap.appendChild(el);
      g.blasen = [{ el: el, t: dauer || 1.4 }];
    }
    function blasenPos(b) {
      var hb = b.el.offsetWidth / 2 + 4;
      b.el.style.left = clamp((OX + LX + 20) * S, hb, wrap.clientWidth - hb) + 'px';
      b.el.style.top = Math.max(b.el.offsetHeight + 64, (OY + LY - 2) * S) + 'px';
    }

    // ---------- Musik (16tel-Raster) ----------
    function spieleSchritt(i) {
      var sd = g.song, takt = Math.floor(i / 16), akk = AKKORDE[takt % 4], st = i % 16, r = g.runde;
      if (st % 4 === 0) { Pixel.sfx.tone(130, 0.14, 'sine', 0.16, 45); g.lichtPuls = 1; }
      if (st === 4 || st === 12) Pixel.sfx.noise(0.12, 0.09, 2600);
      if (st % 2 === 1) Pixel.sfx.noise(0.03, 0.025, 9000);
      if (st % 2 === 0) Pixel.sfx.tone(akk[0] / (st % 4 === 0 ? 2 : 1), 0.11, 'sawtooth', 0.03);
      if (st % 4 === 2 || (r >= 1 && st % 2 === 1 && Math.random() < 0.35)) Pixel.sfx.tone(akk[(st >> 1) % 3] * 4, 0.08, 'square', 0.018);
      if (r >= 2 && st === 0) Pixel.sfx.tone(akk[2] * 2, 0.4, 'triangle', 0.025);
    }
    function songBauen() {
      var sd = SONGS[g.runde], spb = 60 / sd.bpm, noten = [], letzteLane = -1, gleich = 0;
      var gesamt = sd.takte * 4;
      for (var b = 4; b < gesamt - 2; b += 0.5) {
        var ganz = b % 1 === 0, p = ganz ? sd.dicht[0] : sd.dicht[1];
        if (b % 16 >= 14 && !ganz) p = 0;
        if (Math.random() > p) continue;
        var lane = Math.floor(Math.random() * 4);
        if (lane === letzteLane) { gleich++; if (gleich > 1) lane = (lane + 1 + Math.floor(Math.random() * 3)) % 4; } else gleich = 0;
        if (lane !== letzteLane) gleich = 0;
        letzteLane = lane;
        noten.push({ t: b * spb, lane: lane, stern: Math.random() < 0.06, status: 0 });
      }
      g.noten = noten; g.songDauer = gesamt * spb; g.spb = spb;
    }

    // ---------- Eingabe ----------
    var KEYS = { ArrowLeft: 0, KeyD: 0, KeyA: 0, ArrowDown: 1, KeyF: 1, KeyS: 1, ArrowUp: 2, KeyJ: 2, KeyW: 2, ArrowRight: 3, KeyK: 3 };
    function drueck(lane) {
      if (g.modus !== 'spiel') return;
      g.lanePuls[lane] = 1;
      var best = null, bd = 9;
      g.noten.forEach(function (n) { if (n.status || n.lane !== lane) return; var d = Math.abs(n.t - g.songT); if (d < bd) { bd = d; best = n; } });
      if (!best || bd > 0.17) return;
      var perfekt = bd <= 0.075;
      best.status = perfekt ? 1 : 2;
      g.combo++; g.maxCombo = Math.max(g.maxCombo, g.combo);
      var mult = Math.min(4, 1 + Math.floor(g.combo / 10)), pkt = (perfekt ? 100 : 50) * mult * (best.stern ? 2 : 1);
      g.punkte += pkt;
      g.hype = Math.min(100, g.hype + (perfekt ? 3.2 : 1.6) + (best.stern ? 4 : 0));
      if (perfekt) g.treffer.perfekt++; else g.treffer.gut++;
      g.pose = ['links', 'huefte', 'hoch', 'rechts'][lane]; g.poseT = 0.32;
      if (perfekt) { g.gesicht = 'strahl'; g.gesichtT = 0.3; }
      g.texte.push({ txt: best.stern ? 'HAAR-FLIP!' : perfekt ? pick(['SLAY!', 'WERK!', 'PERFEKT!']) : 'GUT', x: hitX() + 4, y: SPUR_Y - 14, t: 0, f: best.stern ? '#ffd23f' : perfekt ? '#ff6ab8' : '#ffffff' });
      if (best.stern) {
        g.flip = 0.5; konfetti(24);
        if (Math.random() < 0.5) sag(pick(SPRUECHE.flip), 1);
      } else if (perfekt && g.combo % 16 === 0) sag(pick(SPRUECHE.slay), 1.1);
      if (g.combo > 0 && g.combo % 25 === 0) { melde(g.combo + ' COMBO!', 'Das Publikum rastet aus'); konfetti(30); }
    }
    function verpasst(n) {
      n.status = 3; g.treffer.miss++; g.combo = 0; g.hype -= 6;
      g.pose = 'steh'; g.gesicht = 'oops'; g.gesichtT = 0.45;
      g.texte.push({ txt: 'OOPS', x: hitX() + 4, y: SPUR_Y - 14, t: 0, f: '#8a8a9a' });
      if (Math.random() < 0.15) sag(pick(SPRUECHE.oops), 1);
      if (g.hype <= 0) { g.hype = 0; ende('buh'); }
    }
    function konfetti(n) {
      var farben = ['#ff6ab8', '#ffd23f', '#4ad8f0', '#6ae86a', '#ffffff', '#b88ae8'];
      for (var i = 0; i < n; i++) g.konfetti.push({ x: rnd(links(), rechts()), y: rnd(-30, 0), vy: rnd(18, 40), vx: rnd(-8, 8), f: pick(farben), t: 0, ph: rnd(0, 6) });
    }
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel') {
        if (g.modus === 'outfit') { var n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 }[e.code]; if (n !== undefined) { e.preventDefault(); outfitWahl(n); return; } }
        if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los],[data-act=weiter]'); if (b) { e.preventDefault(); b.click(); } }
        return;
      }
      var l = KEYS[e.code]; if (l === undefined) return; e.preventDefault();
      if (!e.repeat) drueck(l);
    }
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-lane]'); if (!b) return; e.preventDefault();
      b.classList.add('gedrueckt'); drueck(+b.getAttribute('data-lane'));
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) {
      pad.addEventListener(n, function (e) { var b = e.target.closest('[data-lane]'); if (b) b.classList.remove('gedrueckt'); });
    });

    // ---------- Ablauf ----------
    function update(dt) {
      g.t += dt;
      g.blasen = g.blasen.filter(function (b) { b.t -= dt; if (b.t <= 0) { b.el.remove(); return false; } return true; });
      g.texte = g.texte.filter(function (x) { x.t += dt; x.y -= dt * 14; return x.t < 0.7; });
      g.konfetti = g.konfetti.filter(function (k) { k.t += dt; k.y += k.vy * dt; k.x += k.vx * dt + Math.sin(k.t * 5 + k.ph) * 0.3; return k.y < SH0 + 10; });
      g.lichtPuls = Math.max(0, g.lichtPuls - dt * 3); g.flip = Math.max(0, g.flip - dt);
      g.lanePuls = g.lanePuls.map(function (v) { return Math.max(0, v - dt * 5); });
      if (g.poseT > 0) { g.poseT -= dt; if (g.poseT <= 0) g.pose = 'steh'; }
      if (g.gesichtT > 0) { g.gesichtT -= dt; if (g.gesichtT <= 0) g.gesicht = 'normal'; }
      if (g.modus === 'intro' || g.modus === 'outfit') { if (Math.random() < dt * 0.6) g.lichtPuls = 0.6; }
      if (g.modus !== 'spiel') return;
      g.songT += dt;
      var schritt = Math.floor(g.songT / (g.spb / 4));
      while (g.schritt < schritt) { g.schritt++; if (g.schritt >= 0 && g.schritt * g.spb / 4 < g.songDauer) spieleSchritt(g.schritt); }
      if (g.songT < 0) { var c = Math.ceil(-g.songT / g.spb); if (c !== g.countdown) { g.countdown = c; } }
      g.noten.forEach(function (n) { if (!n.status && g.songT - n.t > 0.17) verpasst(n); });
      if (g.modus !== 'spiel') return;
      g.hype -= dt * (0.6 + g.runde * 0.3);
      if (g.hype <= 0) { g.hype = 0; ende('buh'); return; }
      if (g.songT > g.songDauer + 0.6) songEnde();
    }

    // ---------- Zeichnen ----------
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x), Math.round(OY + y), Math.round(w), Math.round(h)); }
    function buehne(t) {
      ctx.fillStyle = '#1a0e24'; ctx.fillRect(0, 0, IW, IH);
      // Rückwand mit Lichterkette und Schriftzug
      R(links(), 0, rechts() - links(), 96, '#2a1238');
      for (var x = links() - (((links() % 10) + 10) % 10); x < rechts(); x += 10) {
        var an = (Math.floor(t * 4 + x / 10) % 3) === 0 || g.lichtPuls > 0.7;
        R(x + 4, 4, 2, 2, an ? '#ffd23f' : '#6a4a2a');
      }
      Pixel.text(ctx, 'SHOWTIME', OX + 90, OY + 10, 2, g.lichtPuls > 0.5 ? '#ffffff' : '#ff6ab8', 'center');
      // Vorhänge
      for (var i = 0; i < 6; i++) {
        R(links() + i * 4, 0, 4, 96, i % 2 ? '#a81a3a' : '#c8284a');
        R(rechts() - 4 - i * 4, 0, 4, 96, i % 2 ? '#a81a3a' : '#c8284a');
      }
      // Discokugel
      var kx = 90, ky = 24 + Math.sin(t) * 1;
      R(kx, 0, 1, ky - 6, '#8a8a9a');
      for (var a = 0; a < 7; a++) for (var b = 0; b < 7; b++) if ((a - 3) * (a - 3) + (b - 3) * (b - 3) <= 10) R(kx - 3 + a, ky - 3 + b, 1, 1, ((a + b + Math.floor(t * 6)) % 3) ? '#c8c8d8' : '#ffffff');
      // Lichtkegel
      ctx.globalAlpha = 0.1 + g.lichtPuls * 0.12;
      [[30, '#ff6ab8'], [150, '#4ad8f0']].forEach(function (s, k) {
        var sw = Math.sin(t * 1.3 + k * 2) * 30;
        ctx.fillStyle = s[1]; ctx.beginPath(); ctx.moveTo(OX + s[0], OY); ctx.lineTo(OX + LX + 20 + sw - 18, OY + 96); ctx.lineTo(OX + LX + 20 + sw + 18, OY + 96); ctx.closePath(); ctx.fill();
      });
      ctx.globalAlpha = 1;
      // Laufsteg
      R(links(), 92, rechts() - links(), 6, '#3a1a4a'); R(links(), 92, rechts() - links(), 1, '#ff6ab8');
      for (x = links() - (((links() % 12) + 12) % 12); x < rechts(); x += 12) R(x + 5, 94, 2, 2, (Math.floor(t * 6 + x / 12) % 2) ? '#ffd23f' : '#ff6ab8');
      // Jury-Pult rechts
      var jx = Math.min(rechts() - 52, 128);
      R(jx - 2, 66, 54, 26, '#14081c'); R(jx - 2, 66, 54, 2, '#ffd23f');
      for (var j = 0; j < 3; j++) Pixel.draw(ctx, juryBild(j), OX + jx + j * 17, OY + 54 + (g.modus === 'spiel' && Math.floor(t * 2 + j) % 2 && g.hype > 70 ? -1 : 0), 1);
      Pixel.text(ctx, 'JURY', OX + jx + 24, OY + 72, 1, '#ffd23f', 'center');
    }
    function leonie(t) {
      var pose = g.pose, ges = g.gesicht;
      if (g.modus === 'intro' || g.modus === 'outfit') { pose = Math.floor(t * 1.5) % 4 === 0 ? 'huefte' : 'steh'; ges = Math.floor(t * 1.5) % 4 === 1 ? 'zwinker' : 'normal'; }
      if (g.modus === 'ende') { pose = g.endGrund === 'buh' ? 'steh' : 'hoch'; ges = g.endGrund === 'buh' ? 'oops' : 'strahl'; }
      var bob = g.modus === 'spiel' && g.lichtPuls > 0.6 ? 1 : 0;
      var img = Sprites.leonie(g.outfit, pose, ges);
      R(LX + 4, 92, 32, 2, 'rgba(0,0,0,.35)');
      Pixel.draw(ctx, img, OX + LX, OY + LY + bob, 2, g.flip > 0 && Math.floor(g.flip * 16) % 2 === 1);
      if (g.modus === 'ende' && g.endGrund !== 'buh' && g.krone) {
        R(LX + 12, LY - 8, 16, 6, '#ffd23f'); R(LX + 12, LY - 12, 2, 4, '#ffd23f'); R(LX + 19, LY - 13, 2, 5, '#ffd23f'); R(LX + 26, LY - 12, 2, 4, '#ffd23f'); R(LX + 19, LY - 7, 2, 2, '#e83a5a');
      }
    }
    function publikum(t) {
      var h = g.hype / 100;
      for (var x = links() - 4, i = 0; x < rechts(); x += 9, i++) {
        var hop = g.modus === 'spiel' && h > 0.35 && (Math.floor(t * (2 + h * 4) + i) % 2) ? 2 : 0;
        var arm = h > 0.6 && (i % 3 !== 1);
        R(x, 104 - hop, 7, 7, '#0e0614'); R(x - 1, 109 - hop, 9, 10, '#0e0614');
        if (arm) { R(x - 2, 96 - hop - (Math.floor(t * 4 + i) % 2), 2, 9, '#0e0614'); R(x + 7, 96 - hop - (Math.floor(t * 4 + i + 1) % 2), 2, 9, '#0e0614'); }
        if (h > 0.8 && i % 4 === 0) R(x + 2, 92 - hop, 3, 3, (Math.floor(t * 8 + i) % 2) ? '#ffffff' : '#ffd23f');
      }
    }
    function spur(t) {
      R(links(), SPUR_Y - 8, rechts() - links(), 17, 'rgba(10,4,16,.85)'); R(links(), SPUR_Y - 8, rechts() - links(), 1, '#ff6ab8');
      // Trefferzone: 4 leere Pfeile übereinander gestapelt? – eine Zone, Spurfarbe nach Pfeil
      R(hitX() - 7, SPUR_Y - 7, 14, 14, 'rgba(255,255,255,' + (0.12 + g.lichtPuls * 0.15) + ')');
      R(hitX() - 7, SPUR_Y - 7, 14, 1, '#ffffff'); R(hitX() - 7, SPUR_Y + 6, 14, 1, '#ffffff'); R(hitX() - 7, SPUR_Y - 7, 1, 14, '#ffffff'); R(hitX() + 6, SPUR_Y - 7, 1, 14, '#ffffff');
      for (var l = 0; l < 4; l++) if (g.lanePuls[l] > 0) { ctx.globalAlpha = g.lanePuls[l]; R(hitX() - 8, SPUR_Y - 8, 16, 16, SPUR_FARBE[l]); ctx.globalAlpha = 1; }
      if (g.modus !== 'spiel') return;
      var tempo = 62 + g.runde * 8;
      for (var i = g.noten.length - 1; i >= 0; i--) {
        var n = g.noten[i]; if (n.status === 1 || n.status === 2) continue;
        var x = hitX() + (n.t - g.songT) * tempo;
        if (x > rechts() + 8 || x < links() - 10) continue;
        if (n.stern) { ctx.globalAlpha = 0.5 + Math.sin(t * 12) * 0.3; R(x - 6, SPUR_Y - 6, 12, 12, '#ffd23f'); ctx.globalAlpha = 1; }
        ctx.globalAlpha = n.status === 3 ? 0.3 : 1;
        Pixel.draw(ctx, pfeilBild(n.lane, n.stern ? 'stern' : 'voll'), OX + x - 4, OY + SPUR_Y - 4, 1);
        ctx.globalAlpha = 1;
      }
      if (g.songT < 0 && g.countdown) Pixel.text(ctx, String(g.countdown), OX + 90, OY + 50, 4, '#ffd23f', 'center');
    }
    function render(t) {
      ctx.imageSmoothingEnabled = false;
      buehne(t);
      leonie(t);
      publikum(t);
      spur(t);
      g.texte.forEach(function (x) { ctx.globalAlpha = Math.max(0, 1 - x.t / 0.7); Pixel.text(ctx, x.txt, OX + x.x, OY + x.y, 1, x.f, 'left'); ctx.globalAlpha = 1; });
      g.konfetti.forEach(function (k) { R(k.x, k.y, 2, Math.sin(k.t * 8 + k.ph) > 0 ? 2 : 1, k.f); });
    }
    function hud() {
      $('hype').style.width = Math.max(0, g.hype) + '%';
      $('hypeBox').classList.toggle('knapp', g.hype < 25 && g.modus === 'spiel');
      $('punkte').textContent = g.punkte; $('song').textContent = 'SONG ' + (g.runde + 1);
      var mult = Math.min(4, 1 + Math.floor(g.combo / 10)); $('combo').textContent = mult > 1 ? 'X' + mult : (g.combo > 4 ? g.combo + '' : '');
      g.blasen.forEach(blasenPos);
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render(g.t); hud();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function bild(img, breite) { var c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); if (breite) c.style.width = breite + 'px'; return c; }
    function intro() {
      ovl.classList.remove('aus'); pad.classList.remove('an'); $('hud').classList.remove('an');
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="lo-karte"><h1>Leonie Lockenpracht<br>Showtime!</h1><div class="unter">Tagsüber Leon. Heute Abend die Queen der Bühne.</div>' +
        '<div class="figs" data-el="figs"></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>👗 Vor jedem Song ein Outfit wählen – passt es zum Jury-Motto, gibt’s Extrapunkte.</li>' +
        '<li>🎵 Pfeile laufen in die Trefferzone: im Takt <b>← ↓ ↑ →</b> drücken (oder D F J K / Touch-Knöpfe).</li>' +
        '<li>✨ Genau im Takt = <b>SLAY!</b> · ★-Noten = Haar-Flip mit Konfetti.</li>' +
        '<li>📣 Der HYPE vom Publikum darf nicht auf 0 fallen. Nach 3 Songs vergibt die Jury die Krone.</li></ul>' +
        '<button class="px-btn" data-act="los">Vorhang auf!</button></div>';
      var f = $('figs');
      f.appendChild(bild(Sprites.leonb(), 48)); var sp = document.createElement('span'); sp.textContent = '→'; f.appendChild(sp); f.appendChild(bild(Sprites.leonie(0, 'huefte', 'zwinker'), 60));
    }
    function outfitBildschirm() {
      g.modus = 'outfit'; g.motto = Math.floor(Math.random() * 4); pad.classList.remove('an'); $('hud').classList.remove('an');
      ovl.classList.remove('aus');
      ovl.innerHTML = '<div class="lo-karte"><h1>Song ' + (g.runde + 1) + ': ' + SONGS[g.runde].name + '</h1>' +
        '<div class="unter">Garderobe! Was zieht Leonie an?</div><div class="lo-motto">JURY-MOTTO: ' + OUTFITS[g.motto].motto.toUpperCase() + '</div>' +
        '<div class="lo-wahl" data-el="wahl"></div></div>';
      var w = $('wahl');
      OUTFITS.forEach(function (o, i) {
        var b = document.createElement('button'); b.setAttribute('data-outfit', i);
        b.appendChild(bild(Sprites.leonie(i, 'steh', 'normal'))); b.appendChild(document.createTextNode((i + 1) + ' · ' + o.name));
        w.appendChild(b);
      });
    }
    function outfitWahl(i) {
      if (g.modus !== 'outfit') return;
      g.outfit = i; g.passt = i === g.motto;
      Pixel.sfx.tone(660, 0.08, 'square', 0.04); Pixel.sfx.tone(990, 0.12, 'square', 0.04, null, 0.08);
      songStarten();
    }
    function songStarten() {
      songBauen();
      g.modus = 'spiel'; g.songT = -g.spb * 4; g.schritt = Math.floor(g.songT / (g.spb / 4)) - 1; g.countdown = 0;
      g.treffer = { perfekt: 0, gut: 0, miss: 0 }; g.combo = 0; g.hype = Math.max(g.hype, 50);
      ovl.classList.add('aus'); $('hud').classList.add('an'); if (touch) pad.classList.add('an');
      melde(SONGS[g.runde].name.toUpperCase(), g.passt ? 'Outfit passt zum Motto! ★' : OUTFITS[g.outfit].name);
      spaeter(function () { if (g.modus === 'spiel') sag(g.runde === 0 ? pick(SPRUECHE.start) : pick(SPRUECHE.slay), 1.6); }, 500);
    }
    function songEnde() {
      g.modus = 'jury'; pad.classList.remove('an');
      ['perfekt', 'gut', 'miss'].forEach(function (k) { g.alle[k] += g.treffer[k]; });
      var tr = g.treffer, ges = Math.max(1, tr.perfekt + tr.gut + tr.miss), acc = (tr.perfekt + tr.gut * 0.6) / ges;
      var basis = 3 + acc * 6.4 + (g.passt ? 1 : 0) + (g.hype > 80 ? 0.5 : 0);
      var noten = JURY.map(function () { return clamp(Math.round(basis + rnd(-0.9, 0.9)), 1, 10); });
      var summe = noten.reduce(function (a, b) { return a + b; }, 0), bonus = summe * 60;
      g.punkte += bonus; g.juryPunkte.push(summe);
      konfetti(summe > 24 ? 50 : 10);
      Pixel.sfx.tone(523, 0.1, 'triangle', 0.05); Pixel.sfx.tone(659, 0.1, 'triangle', 0.05, null, 0.1); Pixel.sfx.tone(784, 0.2, 'triangle', 0.05, null, 0.2);
      var kommentar = summe >= 27 ? 'Zehn von zehn, Darling! Die Locken!!' : summe >= 21 ? 'Sehr glamourös. Mehr Glitzer geht immer.' : summe >= 15 ? 'Ganz okay … die Absätze waren mutig.' : 'Hm. Üben, Schätzchen.';
      ovl.classList.remove('aus');
      ovl.innerHTML = '<div class="lo-karte"><h1>Die Jury</h1><div class="unter">' + SONGS[g.runde].name + ' · ' + Math.round(acc * 100) + ' % im Takt' + (g.passt ? ' · Motto getroffen ★' : '') + '</div>' +
        '<div class="lo-jury" data-el="jury"></div>' +
        '<div class="zitat"><i>„' + kommentar + '“</i></div>' +
        '<div class="zeile"><span>Jury-Bonus</span><b>+' + bonus + '</b></div>' +
        '<div class="zeile"><span>Punkte</span><b>' + g.punkte + '</b></div>' +
        '<button class="px-btn" data-act="weiter">' + (g.runde < SONGS.length - 1 ? 'Nächster Song' : 'Krönung!') + '</button></div>';
      var jEl = $('jury');
      JURY.forEach(function (j, i) {
        var d = document.createElement('div'); d.appendChild(bild(juryBild(i))); var b = document.createElement('b'); b.textContent = noten[i]; d.appendChild(b);
        d.appendChild(document.createTextNode(j.name)); jEl.appendChild(d);
        spaeter(function () { b.classList.add('an'); Pixel.sfx.tone(440 + noten[i] * 40, 0.12, 'square', 0.04); }, 350 + i * 450);
      });
    }
    function weiter() {
      if (g.modus !== 'jury') return;
      if (g.runde < SONGS.length - 1) { g.runde++; outfitBildschirm(); }
      else ende('fertig');
    }
    function los() {
      if (g.modus === 'spiel' || g.modus === 'outfit') return;
      if (g.ende) { g.blasen.forEach(function (b) { b.el.remove(); }); reset(); }
      outfitBildschirm();
    }
    function ende(grund) {
      if (g.modus === 'ende') return;
      var warSpiel = g.modus === 'spiel';
      g.modus = 'ende'; g.ende = true; g.endGrund = grund; pad.classList.remove('an');
      if (warSpiel) ['perfekt', 'gut', 'miss'].forEach(function (k) { g.alle[k] += g.treffer[k]; });
      var schnitt = g.juryPunkte.length ? g.juryPunkte.reduce(function (a, b) { return a + b; }, 0) / g.juryPunkte.length / 3 : 0;
      g.krone = grund === 'fertig' && schnitt >= 8;
      if (g.krone) g.punkte += 1000;
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best; if (neu) Pixel.set(BEST_KEY, g.punkte);
      if (grund === 'buh') { Pixel.sfx.tone(392, 0.3, 'triangle', 0.06, 370); Pixel.sfx.tone(349, 0.3, 'triangle', 0.06, 330, 0.3); Pixel.sfx.tone(294, 0.7, 'triangle', 0.06, 220, 0.6); melde('VORHANG ZU!'); }
      else { konfetti(80); Pixel.sfx.tone(523, 0.12, 'square', 0.05); Pixel.sfx.tone(659, 0.12, 'square', 0.05, null, 0.12); Pixel.sfx.tone(784, 0.12, 'square', 0.05, null, 0.24); Pixel.sfx.tone(1046, 0.4, 'square', 0.05, null, 0.36); }
      spaeter(function () {
        $('hud').classList.remove('an'); ovl.classList.remove('aus');
        var titel = grund === 'buh' ? 'Vorhang zu!' : g.krone ? 'Die Krone!' : 'Applaus!';
        var unter = grund === 'buh' ? 'Das Publikum war nicht bereit für so viel Leonie. Noch nicht.' : g.krone ? 'Leonie Lockenpracht ist die Queen der Klasse. Die Locken haben gewonnen.' : 'Starke Show – für die Krone braucht die Jury im Schnitt eine 8.';
        ovl.innerHTML = '<div class="lo-karte"><h1>' + titel + '</h1><div class="unter">' + unter + '</div><div class="figs" data-el="figs"></div>' +
          '<div class="zitat"><b>Leonie:</b> „' + (grund === 'buh' ? 'Ihr werdet mich vermissen, Darlings.' : g.krone ? 'Ich danke meinen Locken.' : 'Nächstes Mal mehr Glitzer.') + '“</div>' +
          '<div class="zeile"><span>Punkte</span><b>' + g.punkte + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Perfekt / Gut / Oops</span><b>' + g.alle.perfekt + ' / ' + g.alle.gut + ' / ' + g.alle.miss + '</b></div>' +
          '<div class="zeile"><span>Beste Combo</span><b>' + g.maxCombo + '</b></div>' +
          (g.juryPunkte.length ? '<div class="zeile"><span>Jury-Schnitt</span><b>' + schnitt.toFixed(1).replace('.', ',') + '</b></div>' : '') +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte) + '</b></div>' +
          '<button class="px-btn" data-act="los">Zugabe!</button><button class="px-btn" data-act="exit" style="margin-top:8px">Menü</button></div>';
        $('figs').appendChild(bild(Sprites.leonie(g.outfit, grund === 'buh' ? 'steh' : 'hoch', grund === 'buh' ? 'oops' : 'strahl'), 64));
      }, grund === 'buh' ? 1400 : 900);
    }

    function onClick(e) {
      var o = e.target.closest && e.target.closest('[data-outfit]');
      if (o) { outfitWahl(+o.getAttribute('data-outfit')); return; }
      var b = e.target.closest && e.target.closest('[data-act]');
      if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'los') los();
      if (a === 'weiter') weiter();
      if (a === 'exit') { stop(); onExit(); }
      if (a === 'ton') { Pixel.setMuted(!Pixel.isMuted()); tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊'; }
    }
    function stop() {
      if (!alive) return;
      alive = false; cancelAnimationFrame(raf); clearTimeout(meldT); timeouts.forEach(clearTimeout);
      window.removeEventListener('keydown', kd); window.removeEventListener('resize', resize);
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('resize', resize);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__leonie = { g: function () { return g; }, drueck: drueck, outfitWahl: outfitWahl, weiter: weiter };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.leonie = { start: start };
})();
