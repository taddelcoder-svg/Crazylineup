// Mo: Ganz klein – Pixel-Jump'n'Run mit Escape-Room-Rätseln.
// Mo ist auf ein paar Zentimeter geschrumpft und muss aus dem Klassenzimmer ausbrechen:
// Schreibtisch → Bücherregal → Boden bis unter die Tür. Schlüssel finden, Schalter drücken,
// Schlösser öffnen. Wandsprung, Radiergummi-Trampoline, Ventilator-Aufwind.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.mo.best', ZEIT_KEY = 'crazylineup.mo.zeit';
  var G = 980, RUN = 92, ACC = 950, AIRACC = 700, FRIC = 1200, JUMP = 330, SPRING = 480;
  var WJX = 125, WJY = 295, SLIDE = 55, MAXFALL = 390;

  // ---------------- Levels ----------------
  function solid(look, x, y, w, h, c) { return { t: 'solid', look: look, x: x, y: y, w: w, h: h, c: c }; }
  function crumbs(list) { return list.map(function (p) { return { t: 'crumb', x: p[0], y: p[1] }; }); }

  function level1() {
    return {
      name: 'DER SCHREIBTISCH', nr: 1, bg: 'pult', w: 1500, h: 260, start: [24, 200],
      tipp: 'Finde die Büroklammer – damit geht das Schloss auf.',
      objs: [
        solid('desk', 0, 220, 440, 40), solid('desk', 510, 220, 990, 40),
        solid('pencil', 110, 211, 80, 9, '#f2c230'),
        solid('book', 230, 190, 90, 30, '#b83a3a'), solid('book', 242, 168, 66, 22, '#2f5a9a'),
        { t: 'spike', x: 330, y: 214, w: 64 },
        { t: 'move', look: 'ruler', x: 445, y: 216, w: 36, h: 5, ax: 445, bx: 469, per: 2.6 },
        { t: 'check', x: 524, y: 220 },
        solid('ruler_v', 600, 100, 7, 120), solid('cup', 631, 118, 46, 102),
        { t: 'key', x: 650, y: 104 },
        { t: 'spring', x: 720, y: 212, w: 22, h: 8 },
        solid('books', 770, 140, 96, 80),
        solid('eraser', 880, 202, 18, 18),
        { t: 'marble', x: 960, y: 213, r: 7, ax: 898, bx: 1090, v: 58 },
        { t: 'marble', x: 1040, y: 213, r: 7, ax: 898, bx: 1090, v: -74, c: '#d84a6a' },
        solid('eraser', 1090, 202, 18, 18),
        { t: 'check', x: 1134, y: 220 },
        solid('pencil', 1170, 211, 70, 9, '#3a8a5a'),
        { t: 'lock', x: 1300, y: 150, w: 22, h: 70 },
        { t: 'exit', x: 1410, y: 172, w: 70, h: 48, look: 'case' }
      ].concat(crumbs([[60, 206], [76, 206], [150, 198], [275, 154], [362, 176], [618, 184], [618, 154], [618, 124], [790, 126], [812, 126], [834, 126], [990, 186], [1205, 198], [1380, 206]]))
    };
  }

  function level2() {
    var c = ['#8a2a2a', '#2a4a8a', '#2f6a3a', '#c9a24a', '#6a3a7a', '#a85a2a', '#2a6a7a'];
    function led(y, x0, x1, i) { return solid('bookflat', x0, y, x1 - x0, 10, c[i % c.length]); }
    return {
      name: 'DAS BÜCHERREGAL', nr: 2, bg: 'regal', w: 320, h: 760, start: [140, 720],
      tipp: 'Wandsprung: An der Wand nochmal springen. Unten durchkriechen geht auch.',
      objs: [
        solid('shelfwall', 0, 0, 10, 760), solid('shelfwall', 310, 0, 10, 760), solid('shelf', 10, 740, 300, 20),
        led(700, 10, 150, 0), led(660, 170, 310, 1), led(620, 10, 150, 2), led(580, 170, 310, 3), led(540, 10, 150, 4),
        led(500, 180, 310, 5), { t: 'drip', x: 188, y: 510, iv: 1.35, pen: true },
        led(460, 10, 150, 6), { t: 'check', x: 128, y: 460 },
        solid('bookstand', 36, 300, 16, 144, '#7a2a4a'),
        led(300, 52, 150, 0), { t: 'check', x: 130, y: 300 },
        led(260, 170, 310, 1),
        { t: 'move', look: 'bookmark', x: 40, y: 220, w: 40, h: 6, ax: 40, bx: 140, per: 3.4 },
        led(180, 10, 140, 2),
        led(140, 170, 310, 3), { t: 'button', x: 286, y: 140, id: 1 },
        led(100, 10, 150, 4),
        solid('shelf', 150, 50, 160, 10),
        { t: 'gate', id: 1, x: 10, y: 54, w: 140, h: 6 },
        { t: 'exit', x: 10, y: 0, w: 140, h: 44, look: 'top' }
      ].concat(crumbs([[60, 726], [230, 646], [60, 606], [290, 566], [80, 526], [260, 486], [22, 400], [22, 350], [100, 286], [240, 246], [60, 166], [230, 126], [80, 86]]))
    };
  }

  function level3() {
    return {
      name: 'ZUR TÜR', nr: 3, bg: 'boden', w: 1800, h: 300, start: [30, 250],
      tipp: 'Schalter öffnet das Tor. Der Ventilator pustet dich nach oben.',
      objs: [
        solid('floor', 0, 270, 1800, 30),
        solid('sole', 120, 254, 150, 16), solid('shoe', 150, 222, 100, 32),
        { t: 'gum', x: 300, y: 266, w: 44 },
        solid('lego', 372, 252, 24, 18, '#d83a3a'),
        { t: 'marble', x: 470, y: 263, r: 7, ax: 396, bx: 578, v: 66 },
        solid('lego', 578, 252, 24, 18, '#3a6ad8'),
        { t: 'check', x: 612, y: 270 },
        solid('lego', 632, 252, 30, 18, '#3faa5a'), solid('lego', 662, 234, 30, 36, '#f2c230'), solid('lego', 692, 216, 30, 54, '#d83a3a'),
        { t: 'fan', x: 760, y: 50, w: 60, h: 220 },
        solid('pipe', 835, 96, 190, 12),
        { t: 'key', x: 900, y: 82 }, { t: 'button', x: 992, y: 96, id: 1 },
        { t: 'gate', id: 1, x: 1080, y: 0, w: 10, h: 270 },
        { t: 'check', x: 1112, y: 270 },
        solid('lego', 1150, 252, 24, 18, '#f2c230'),
        { t: 'marble', x: 1220, y: 263, r: 7, ax: 1174, bx: 1360, v: 82 },
        { t: 'marble', x: 1320, y: 263, r: 7, ax: 1174, bx: 1360, v: -60, c: '#3aa86a' },
        solid('lego', 1360, 252, 24, 18, '#3a6ad8'),
        { t: 'spring', x: 1392, y: 262, w: 22, h: 8 },
        solid('backpack', 1424, 176, 120, 94),
        { t: 'check', x: 1570, y: 270 },
        { t: 'gum', x: 1600, y: 266, w: 36 },
        solid('door', 1690, -260, 34, 514),
        { t: 'lock', x: 1692, y: 254, w: 30, h: 16, klein: true },
        { t: 'exit', x: 1730, y: 200, w: 70, h: 70, look: 'light' }
      ].concat(crumbs([[60, 256], [170, 208], [200, 208], [230, 208], [320, 250], [480, 236], [705, 200], [790, 160], [790, 110], [860, 82], [960, 82], [1260, 236], [1460, 162], [1500, 162], [1620, 250]]))
    };
  }
  var LEVELS = [level1, level2, level3];

  var CSS = [
    '.mo{position:absolute;inset:0;overflow:hidden;background:#120e0c;touch-action:none}',
    '.mo-shake{position:absolute;inset:0}',
    '.mo canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.mo-top{position:absolute;right:0;top:0;display:flex;gap:8px;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20}',
    '.mo-top.links{right:auto;left:0}',
    '.mo-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;align-items:flex-end;',
    ' padding:0 14px calc(14px + env(safe-area-inset-bottom));pointer-events:none;z-index:15}',
    '.mo-pad.an{display:flex}',
    '.mo-pad .grp{display:flex;gap:12px}',
    '.mo-pad button{pointer-events:auto;width:74px;height:74px;border-radius:50%;border:3px solid rgba(255,255,255,.55);background:rgba(20,16,12,.38);',
    ' color:#fff;font:700 28px/1 sans-serif;touch-action:none;-webkit-user-select:none;user-select:none}',
    '.mo-pad button.gedrueckt{background:rgba(255,154,28,.55);border-color:#ffd9a0}',
    '.mo-pad button.sprung{width:88px;height:88px;font-size:34px}',
    '.mo-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(14,10,8,.55);z-index:30;padding:16px}',
    // Lineal-Panel
    '.lineal{position:relative;width:min(440px,calc(100vw - 32px));background:rgba(214,240,206,.94);color:#16261a;border:3px solid #16261a;',
    ' box-shadow:8px 10px 0 rgba(0,0,0,.4);padding:40px 20px 18px;font-family:"Pixelify Sans",sans-serif;text-align:center;',
    ' background-image:repeating-linear-gradient(to right,#16261a 0 2px,transparent 2px 9px),repeating-linear-gradient(to right,#16261a 0 2px,transparent 2px 45px);',
    ' background-size:100% 12px,100% 22px;background-repeat:no-repeat;background-position:0 0,0 0}',
    '.lineal .cm{position:absolute;top:24px;left:0;right:0;display:flex;justify-content:space-between;padding:0 4px;font:8px/1 "Press Start 2P",monospace;opacity:.7}',
    '.lineal h2{font:400 clamp(17px,4.8vw,24px)/1.3 "Press Start 2P",monospace;margin:10px 0 10px}',
    '.lineal p{font-size:18px;line-height:1.3;margin:8px 0}',
    '.lineal .klein{font-size:15px;opacity:.8}',
    '.lineal .mass{display:inline-block;background:#16261a;color:#d6f0ce;font:10px/1 "Press Start 2P",monospace;padding:7px 9px;margin:4px 0 8px}',
    '.lineal .reihe{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}',
    '.lineal .stats{display:grid;grid-template-columns:1fr auto;gap:4px 16px;text-align:left;font-size:18px;max-width:280px;margin:10px auto 0}',
    '.lineal .stats b{font:12px/1.6 "Press Start 2P",monospace;text-align:right}',
    '.mo-btn{font:13px/1 "Press Start 2P",monospace;padding:14px 18px;border:3px solid #16261a;background:#ff9a1c;color:#16261a;cursor:pointer;',
    ' box-shadow:inset -3px -3px 0 rgba(0,0,0,.2),inset 3px 3px 0 rgba(255,255,255,.4),0 4px 0 #16261a}',
    '.mo-btn:active{transform:translateY(3px);box-shadow:0 1px 0 #16261a}',
    '.mo-btn.alt{background:#f4f4f0}',
    '.mo-karte{position:absolute;left:50%;top:22%;transform:translateX(-50%);z-index:12;pointer-events:none;text-align:center;',
    ' font-family:"Press Start 2P",monospace;color:#fff;text-shadow:3px 3px 0 #000;animation:moKarte 2.6s forwards}',
    '.mo-karte small{display:block;font-size:10px;color:#ff9a1c;margin-bottom:10px}',
    '.mo-karte b{display:block;font-weight:400;font-size:clamp(16px,5vw,26px)}',
    '.mo-karte span{display:block;margin-top:12px;font:16px/1.3 "Pixelify Sans",sans-serif;max-width:80vw}',
    '@keyframes moKarte{0%{opacity:0;transform:translate(-50%,-14px)}12%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0}}'
  ].join('\n');

  var HEART_KEY = ['..GGG.....', '.G...G....', '.G...GGGGG', '.G...G.G.G', '..GGG.....'];

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function zeitText(t) { var m = Math.floor(t / 60), s = t - m * 60; return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="mo"><div class="mo-shake"><canvas></canvas></div>' +
      '<div class="mo-top links"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button></div>' +
      '<div class="mo-top"><button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="mo-pad"><div class="grp"><button data-pad="l" aria-label="Links">◀</button><button data-pad="r" aria-label="Rechts">▶</button></div>' +
      '<button class="sprung" data-pad="j" aria-label="Springen">▲</button></div>' +
      '<div class="mo-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var box = root.querySelector('.mo'), shakeEl = root.querySelector('.mo-shake');
    var cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var ovl = root.querySelector('[data-el=ovl]'), tonBtn = root.querySelector('[data-act=ton]');
    var pad = root.querySelector('.mo-pad');
    var keyIcon = Pixel.sprite('mo-key', HEART_KEY, { G: '#f2c230' });
    var keyIconGrau = Pixel.sprite('mo-key-grau', HEART_KEY, { G: '#5a5048' });

    var S = 3, IW = 0, IH = 0, SW = 0, SH = 0;
    var lv = null, objs = [], p = null, cam = { x: 0, y: 0 };
    var st = { modus: 'intro', lvl: 0, zeit: 0, lvlZeit: 0, tode: 0, krumen: 0, krumenGesamt: 0, zeiten: [] };
    var parts = [], drops = [], shake = 0, alive = true, raf = 0, t0 = 0, karteEl = null;
    var vignette = null;

    function resize() {
      SW = box.clientWidth; SH = box.clientHeight;
      S = SH > SW * 1.2 ? Math.max(2, Math.round(SW / 135)) : Math.max(2, Math.round(Math.min(SH / 200, SW / 170)));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      vignette = document.createElement('canvas'); vignette.width = IW; vignette.height = IH;
      var vx = vignette.getContext('2d'), gr = vx.createRadialGradient(IW / 2, IH / 2, Math.min(IW, IH) * 0.35, IW / 2, IH / 2, Math.max(IW, IH) * 0.75);
      gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(10,5,0,.5)');
      vx.fillStyle = gr; vx.fillRect(0, 0, IW, IH);
    }

    // ---------------- Level laden ----------------
    function laden(i) {
      st.lvl = i; lv = LEVELS[i]();
      objs = lv.objs.map(function (o) {
        var c = Object.assign({}, o);
        c.x0 = c.x; c.y0 = c.y;
        if (c.t === 'move') c.ph = 0;
        if (c.t === 'gate') c.lift = 0;
        if (c.t === 'drip') c.cd = rnd(0, c.iv);
        if (c.t === 'crumb') c.ph = Math.random() * 6;
        return c;
      });
      drops = []; parts = [];
      p = { x: lv.start[0], y: lv.start[1] - 14, w: 8, h: 14, vx: 0, vy: 0, boden: false, grund: null, face: 1, coyote: 0, puffer: 0,
            wand: 0, wandT: 0, tot: 0, schluessel: false, squash: 0, lauf: 0, spawn: [lv.start[0], lv.start[1] - 14], landT: 0 };
      st.lvlZeit = 0; st.krumen = 0;
      cam.x = clamp(p.x - IW / 2, 0, Math.max(0, lv.w - IW));
      cam.y = clamp(p.y - IH * 0.55, Math.min(0, lv.h - IH), Math.max(0, lv.h - IH));
      if (lv.h < IH) cam.y = lv.h - IH;
      zeigeKarte();
    }
    function zeigeKarte() {
      if (karteEl) karteEl.remove();
      karteEl = document.createElement('div'); karteEl.className = 'mo-karte';
      karteEl.innerHTML = '<small>LEVEL ' + lv.nr + ' / 3</small><b>' + lv.name + '</b><span>' + lv.tipp + '</span>';
      box.appendChild(karteEl);
    }

    function rect(o) {
      if (o.t === 'gate') {
        if (o.w > o.h) return { x: o.x, y: o.y, w: o.w * (1 - o.lift), h: o.h };
        return { x: o.x, y: o.y, w: o.w, h: o.h * (1 - o.lift) };
      }
      return o;
    }
    function istFest(o) {
      return o.t === 'solid' || o.t === 'move' || o.t === 'spring' || (o.t === 'lock' && !o.offen) || (o.t === 'gate' && o.lift < 0.95);
    }

    // ---------------- Eingabe ----------------
    var inp = { l: false, r: false, j: false, jAlt: false };
    var tasten = {};
    function kd(e) {
      var k = e.key;
      if (k === 'Escape') { stop(); onExit(); return; }
      if (st.modus !== 'spiel' && (k === 'Enter' || k === ' ')) { var b = ovl.querySelector('[data-act=go],[data-act=weiter],[data-act=nochmal]'); if (b) { e.preventDefault(); b.click(); } return; }
      tasten[k.toLowerCase()] = true;
      if ([' ', 'arrowup', 'arrowleft', 'arrowright', 'arrowdown'].indexOf(k.toLowerCase()) >= 0) e.preventDefault();
    }
    function ku(e) { tasten[e.key.toLowerCase()] = false; }
    var padZeiger = {};
    function padSetzen() {
      var l = false, r = false, j = false;
      Object.keys(padZeiger).forEach(function (id) { var w = padZeiger[id]; if (w === 'l') l = true; if (w === 'r') r = true; if (w === 'j') j = true; });
      pad.querySelectorAll('[data-pad]').forEach(function (b) {
        var w = b.getAttribute('data-pad'); b.classList.toggle('gedrueckt', (w === 'l' && l) || (w === 'r' && r) || (w === 'j' && j));
      });
      inp.padL = l; inp.padR = r; inp.padJ = j;
    }
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-pad]'); if (!b) return;
      e.preventDefault(); padZeiger[e.pointerId] = b.getAttribute('data-pad');
      try { b.releasePointerCapture(e.pointerId); } catch (x) {}
      padSetzen();
    });
    pad.addEventListener('pointerover', function (e) {
      if (padZeiger[e.pointerId] === undefined) return;
      var b = e.target.closest('[data-pad]'); if (!b) return;
      var w = b.getAttribute('data-pad');
      if (w !== 'j' && padZeiger[e.pointerId] !== 'j') { padZeiger[e.pointerId] = w; padSetzen(); }
    });
    function padLos(e) { if (padZeiger[e.pointerId] !== undefined) { delete padZeiger[e.pointerId]; padSetzen(); } }
    window.addEventListener('pointerup', padLos); window.addEventListener('pointercancel', padLos);
    if (window.matchMedia && matchMedia('(pointer: coarse)').matches) pad.classList.add('an');

    function lesen() {
      inp.l = tasten['arrowleft'] || tasten['a'] || inp.padL;
      inp.r = tasten['arrowright'] || tasten['d'] || inp.padR;
      var j = tasten[' '] || tasten['arrowup'] || tasten['w'] || inp.padJ;
      inp.jDruck = j && !inp.jAlt; inp.jAlt = j; inp.j = j;
    }

    // ---------------- Effekte ----------------
    function staub(x, y, n, col) {
      for (var i = 0; i < n; i++) parts.push({ x: x + rnd(-3, 3), y: y, vx: rnd(-30, 30), vy: rnd(-40, -5), g: 60, t: 0, life: rnd(0.25, 0.5), c: col || '#d8c8a8' });
    }
    function funken(x, y, n, cols) {
      for (var i = 0; i < n; i++) parts.push({ x: x, y: y, vx: rnd(-70, 70), vy: rnd(-110, -20), g: 260, t: 0, life: rnd(0.4, 0.8), c: cols[i % cols.length] });
    }

    // ---------------- Spieler ----------------
    function sterben() {
      if (p.tot > 0) return;
      p.tot = 0.75; st.tode++; shake = 4;
      funken(p.x + 4, p.y + 7, 18, ['#6b4a2e', '#ff9a1c', '#f0c4a4', '#18181c']);
      Pixel.sfx.tone(520, 0.08, 'square', 0.06, 260); Pixel.sfx.tone(260, 0.25, 'square', 0.06, 90, 0.08);
    }
    function respawn() {
      p.x = p.spawn[0]; p.y = p.spawn[1]; p.vx = p.vy = 0; p.tot = 0; p.squash = 0.15;
      staub(p.x + 4, p.y + 14, 8, '#ffffff');
    }

    function spielerUpdate(dt) {
      if (p.tot > 0) { p.tot -= dt; if (p.tot <= 0) respawn(); return; }
      var feste = objs.filter(istFest);
      // Mitnehmen durch bewegliche Plattform
      if (p.boden && p.grund && p.grund.t === 'move') { p.x += p.grund.dx; p.y += p.grund.dy; }
      var aufKaugummi = p.boden && objs.some(function (o) { return o.t === 'gum' && p.x + p.w > o.x && p.x < o.x + o.w && Math.abs(p.y + p.h - (o.y + 4)) < 3; });
      var max = RUN * (aufKaugummi ? 0.32 : 1);
      var soll = ((inp.r ? 1 : 0) - (inp.l ? 1 : 0)) * max;
      if (soll) p.face = soll > 0 ? 1 : -1;
      var acc = p.boden ? (soll ? ACC : FRIC) : AIRACC;
      if (p.vx < soll) p.vx = Math.min(soll, p.vx + acc * dt); else if (p.vx > soll) p.vx = Math.max(soll, p.vx - acc * dt);
      // Schwerkraft, Wandrutschen, Aufwind
      p.vy += G * dt;
      var wandDruck = !p.boden && p.wand !== 0 && ((p.wand < 0 && inp.l) || (p.wand > 0 && inp.r));
      if (wandDruck && p.vy > SLIDE) { p.vy = SLIDE; if (Math.random() < 0.3) staub(p.x + (p.wand > 0 ? 8 : 0), p.y + 6, 1, '#cfc0a0'); }
      p.wind = false;
      objs.forEach(function (o) {
        if (o.t === 'fan' && hit(p, o)) { p.wind = true; p.vy -= 2600 * dt; if (p.vy < -250) p.vy = -250; }
      });
      if (p.vy > MAXFALL) p.vy = MAXFALL;
      // Springen (mit Puffer, Coyote-Zeit, Wandsprung)
      if (inp.jDruck) p.puffer = 0.12;
      p.puffer -= dt; p.coyote -= dt; p.wandT -= dt;
      if (p.puffer > 0) {
        if (p.coyote > 0) {
          p.vy = -JUMP * (aufKaugummi ? 0.6 : 1); p.puffer = 0; p.coyote = 0; p.boden = false; p.squash = -0.18;
          staub(p.x + 4, p.y + 14, 5); Pixel.sfx.tone(380, 0.09, 'square', 0.045, 760);
        } else if (p.wandT > 0 && p.wandSeite) {
          p.vx = -p.wandSeite * WJX; p.vy = -WJY; p.puffer = 0; p.face = -p.wandSeite; p.wandT = 0; p.squash = -0.15;
          staub(p.x + (p.wandSeite > 0 ? 8 : 0), p.y + 8, 5); Pixel.sfx.tone(440, 0.08, 'square', 0.045, 880);
        }
      }
      if (!inp.j && p.vy < -120 && !p.federt && !p.wind) p.vy = -120;
      if (p.vy >= 0) p.federt = false;
      // Bewegung X
      p.x += p.vx * dt;
      p.x = clamp(p.x, 0, lv.w - p.w);
      var amBoden = p.boden;
      feste.forEach(function (o) {
        var r = rect(o);
        if (hit(p, r)) {
          if (o.t === 'lock' && p.schluessel) return oeffnen(o);
          // Kleine Kanten (bis 9 px) automatisch hochsteigen
          var stufe = p.y + p.h - r.y;
          if (amBoden && stufe > 0 && stufe <= 9 && o.t !== 'lock' && o.t !== 'gate') {
            var neu = { x: p.x, y: r.y - p.h, w: p.w, h: p.h };
            if (!feste.some(function (q) { return q !== o && hit(neu, rect(q)); })) { p.y = r.y - p.h; return; }
          }
          if (p.vx > 0) p.x = r.x - p.w; else if (p.vx < 0) p.x = r.x + r.w; else p.x = (p.x + p.w / 2 < r.x + r.w / 2) ? r.x - p.w : r.x + r.w;
          p.vx = 0;
        }
      });
      // Bewegung Y
      var warBoden = p.boden;
      p.y += p.vy * dt; p.boden = false;
      feste.forEach(function (o) {
        var r = rect(o);
        if (!hit(p, r)) return;
        if (o.t === 'lock' && p.schluessel) return oeffnen(o);
        if (p.vy > 0) {
          p.y = r.y - p.h;
          if (o.t === 'spring') {
            p.vy = -SPRING; p.federt = true; o.squash = 0.25; p.squash = -0.25;
            Pixel.sfx.tone(200, 0.2, 'triangle', 0.08, 700); staub(p.x + 4, p.y + 14, 6, '#ffffff');
          } else { p.boden = true; p.grund = o; if (!warBoden && p.vy > 160) { p.squash = 0.22; staub(p.x + 4, p.y + 14, 4); Pixel.sfx.noise(0.05, 0.12, 700); } p.vy = 0; }
        } else if (p.vy < 0) { p.y = r.y + r.h; p.vy = 0; }
      });
      if (p.boden) p.coyote = 0.1;
      // Wandkontakt
      p.wand = 0;
      if (!p.boden) {
        var links = { x: p.x - 1, y: p.y + 2, w: 1, h: p.h - 4 }, rechts = { x: p.x + p.w, y: p.y + 2, w: 1, h: p.h - 4 };
        feste.forEach(function (o) { var r = rect(o); if (hit(links, r)) p.wand = -1; if (hit(rechts, r)) p.wand = 1; });
        if (p.wand) { p.wandT = 0.1; p.wandSeite = p.wand; }
      }
      p.lauf += Math.abs(p.vx) * dt;
      p.squash *= Math.pow(0.0008, dt);
      // Gefahren
      var hb = { x: p.x + 1, y: p.y + 1, w: p.w - 2, h: p.h - 1 };
      objs.forEach(function (o) {
        if (o.t === 'spike' && hit(hb, { x: o.x, y: o.y + 1, w: o.w, h: 5 })) sterben();
        if (o.t === 'marble') { var cx = clamp(o.x, hb.x, hb.x + hb.w), cy = clamp(o.y, hb.y, hb.y + hb.h); if ((cx - o.x) * (cx - o.x) + (cy - o.y) * (cy - o.y) < (o.r - 1) * (o.r - 1)) sterben(); }
        if (o.t === 'crumb' && !o.weg && hit(p, { x: o.x - 3, y: o.y - 3, w: 6, h: 6 })) {
          o.weg = true; st.krumen++; st.krumenGesamt++; funken(o.x, o.y, 6, ['#ffd27a', '#ffffff']); Pixel.sfx.tone(988, 0.06, 'square', 0.04); Pixel.sfx.tone(1318, 0.08, 'square', 0.04, null, 0.05);
        }
        if (o.t === 'key' && !o.weg && hit(p, { x: o.x - 5, y: o.y - 4, w: 10, h: 8 })) {
          o.weg = true; p.schluessel = true; funken(o.x, o.y, 14, ['#f2c230', '#ffffff']);
          Pixel.sfx.tone(784, 0.08, 'square', 0.05); Pixel.sfx.tone(988, 0.08, 'square', 0.05, null, 0.08); Pixel.sfx.tone(1318, 0.14, 'square', 0.05, null, 0.16);
        }
        if (o.t === 'button' && !o.an && hit(p, { x: o.x - 6, y: o.y - 5, w: 12, h: 5 })) {
          o.an = true; objs.forEach(function (q) { if (q.t === 'gate' && q.id === o.id) q.auf = true; });
          Pixel.sfx.tone(300, 0.1, 'square', 0.06); Pixel.sfx.tone(450, 0.15, 'square', 0.06, null, 0.1); shake = 2;
        }
        if (o.t === 'check' && !o.an && hit(p, { x: o.x - 6, y: o.y - 20, w: 12, h: 20 })) {
          objs.forEach(function (q) { if (q.t === 'check') q.an = false; });
          o.an = true; p.spawn = [o.x - 4, o.y - 14]; funken(o.x, o.y - 14, 8, ['#7fe08f', '#ffffff']); Pixel.sfx.tone(660, 0.12, 'triangle', 0.06, 990);
        }
        if (o.t === 'exit' && hit(p, o)) geschafft();
      });
      drops.forEach(function (d) { if (hit(hb, { x: d.x - 1, y: d.y - 2, w: 3, h: 4 })) sterben(); });
      if (p.y > lv.h + 30) sterben();
    }

    function oeffnen(o) {
      if (o.offen) return;
      o.offen = true; o.fallT = 0; p.schluessel = false; shake = 3;
      funken(o.x + o.w / 2, o.y + o.h / 2, 16, ['#f2c230', '#ffffff', '#c09020']);
      Pixel.sfx.tone(523, 0.08, 'square', 0.06); Pixel.sfx.tone(784, 0.2, 'square', 0.06, null, 0.08); Pixel.sfx.noise(0.2, 0.2, 1500);
    }

    // ---------------- Welt ----------------
    function weltUpdate(dt, t) {
      objs.forEach(function (o) {
        if (o.t === 'move') {
          var nx = lerp(o.ax, o.bx, (1 - Math.cos(t / o.per * Math.PI * 2)) / 2);
          o.dx = nx - o.x; o.dy = 0; o.x = nx;
          if (p.tot <= 0 && hit(p, o) && !(p.boden && p.grund === o)) { if (o.dx > 0) p.x = o.x + o.w; else if (o.dx < 0) p.x = o.x - p.w; }
        }
        if (o.t === 'marble') {
          o.x += o.v * dt;
          if (o.x - o.r < o.ax) { o.x = o.ax + o.r; o.v = Math.abs(o.v); }
          if (o.x + o.r > o.bx) { o.x = o.bx - o.r; o.v = -Math.abs(o.v); }
          o.rot = (o.rot || 0) + o.v * dt / o.r;
        }
        if (o.t === 'gate' && o.auf) o.lift = Math.min(1, o.lift + dt * 1.6);
        if (o.t === 'spring' && o.squash > 0) o.squash -= dt;
        if (o.t === 'lock' && o.offen) o.fallT += dt;
        if (o.t === 'drip') {
          o.cd -= dt;
          if (o.cd <= 0) { o.cd = o.iv; drops.push({ x: o.x, y: o.y, vy: 0 }); }
        }
      });
      var feste = objs.filter(istFest);
      drops.forEach(function (d) {
        d.vy += 500 * dt; d.y += d.vy * dt;
        for (var i = 0; i < feste.length; i++) { var r = rect(feste[i]); if (d.x >= r.x && d.x <= r.x + r.w && d.y >= r.y && d.y <= r.y + r.h) { d.weg = true; funken(d.x, r.y, 5, ['#1a2a7a', '#3a4aa8']); break; } }
        if (d.y > lv.h) d.weg = true;
      });
      drops = drops.filter(function (d) { return !d.weg; });
      parts.forEach(function (q) { q.t += dt; q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt; });
      parts = parts.filter(function (q) { return q.t < q.life; });
    }

    // ---------------- Zeichnen ----------------
    var cx = 0, cy = 0;
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(x - cx), Math.round(y - cy), Math.round(w), Math.round(h)); }
    function P(x, y, c) { R(x, y, 1, 1, c); }
    function kreis(x, y, r, c) { for (var dy = -r; dy <= r; dy++) { var w = Math.round(Math.sqrt(r * r - dy * dy)); R(x - w, y + dy, w * 2 + 1, 1, c); } }

    function hintergrund(t) {
      var b = lv.bg;
      if (b === 'pult') {
        var gr = ctx.createLinearGradient(0, 0, 0, IH);
        gr.addColorStop(0, '#e9dcc0'); gr.addColorStop(1, '#c9b48a');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, IW, IH);
        // Riesiges Fenster (weit weg)
        var px = -cam.x * 0.15, py = -cam.y * 0.15;
        for (var f = 0; f < 4; f++) {
          var fx = Math.round(px + f * 260 + 40), fy = Math.round(py + 10);
          ctx.fillStyle = '#fff8e4'; ctx.fillRect(fx, fy, 170, 150);
          ctx.fillStyle = '#d9e9f2'; ctx.fillRect(fx + 6, fy + 6, 76, 64); ctx.fillRect(fx + 88, fy + 6, 76, 64); ctx.fillRect(fx + 6, fy + 76, 76, 68); ctx.fillRect(fx + 88, fy + 76, 76, 68);
          ctx.fillStyle = '#b8d0dc'; ctx.fillRect(fx + 6, fy + 52, 158, 18);
        }
        // Lichtstrahlen
        ctx.globalAlpha = 0.13; ctx.fillStyle = '#fff6d0';
        for (var s = 0; s < 4; s++) {
          var sx = Math.round(px + s * 260 + 60);
          ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx + 130, 0); ctx.lineTo(sx + 330, IH); ctx.lineTo(sx + 170, IH); ctx.fill();
        }
        ctx.globalAlpha = 1;
        // Riesige Stuhl- und Tischbeine (Mittelgrund)
        var mx = -cam.x * 0.45;
        ctx.fillStyle = 'rgba(70,50,35,.35)';
        for (var k = 0; k < 8; k++) {
          var lx = Math.round(mx + k * 210 + 30);
          ctx.fillRect(lx, 0, 16, IH); ctx.fillRect(lx + 120, 40, 12, IH);
          ctx.fillRect(lx - 10, Math.round(80 - cam.y * 0.45), 160, 12);
        }
      } else if (b === 'regal') {
        ctx.fillStyle = '#3a2416'; ctx.fillRect(0, 0, IW, IH);
        var rx = -cam.x * 0.5, ry = -cam.y * 0.5;
        for (var row = -1; row < 12; row++) {
          var by = Math.round(ry + row * 70);
          for (var bk = 0; bk < 60; bk++) {
            var bw = 6 + (bk * 7 + row * 3) % 6, bh = 40 + (bk * 13 + row * 5) % 22;
            var bx = Math.round(rx - 20 + bk * 11);
            ctx.fillStyle = ['#4a2a22', '#2a3446', '#2e4030', '#5a4a2a', '#3e2a44'][(bk + row) % 5];
            ctx.fillRect(bx, by + 66 - bh, bw, bh);
          }
          ctx.fillStyle = '#2a180c'; ctx.fillRect(0, by + 66, IW, 6);
        }
        var lg = ctx.createRadialGradient(IW * 0.7, 0, 10, IW * 0.7, 0, IW);
        lg.addColorStop(0, 'rgba(255,200,120,.25)'); lg.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = lg; ctx.fillRect(0, 0, IW, IH);
      } else {
        var gr2 = ctx.createLinearGradient(0, 0, 0, IH);
        gr2.addColorStop(0, '#d8d0c0'); gr2.addColorStop(0.75, '#c8bca6'); gr2.addColorStop(1, '#a8987e');
        ctx.fillStyle = gr2; ctx.fillRect(0, 0, IW, IH);
        var bx2 = -cam.x * 0.4, byy = Math.round(270 - 26 - cam.y);
        ctx.fillStyle = '#ece6da'; ctx.fillRect(0, byy - 4, IW, 22);
        ctx.fillStyle = '#d4cab8'; ctx.fillRect(0, byy + 14, IW, 4);
        ctx.fillStyle = 'rgba(80,60,40,.3)';
        for (var q = 0; q < 10; q++) { var tx = Math.round(bx2 + q * 260); ctx.fillRect(tx, 0, 22, byy + 20); ctx.fillRect(tx + 150, 0, 18, byy + 20); }
        // Licht unter der Tür
        var dx = Math.round(1690 - cam.x);
        var dg = ctx.createRadialGradient(dx + 60, IH, 5, dx + 60, IH, 160);
        dg.addColorStop(0, 'rgba(255,240,200,.55)'); dg.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.fillStyle = dg; ctx.fillRect(0, 0, IW, IH);
      }
      // Staubkörner im Licht
      for (var d = 0; d < 26; d++) {
        var x = ((d * 97.3 + t * (4 + d % 3) - cam.x * 0.7) % (IW + 20) + IW + 20) % (IW + 20) - 10;
        var y = ((d * 53.7 + Math.sin(t * 0.7 + d) * 8 - cam.y * 0.7) % IH + IH) % IH;
        ctx.fillStyle = 'rgba(255,250,230,' + (0.25 + 0.25 * Math.sin(t + d)) + ')'; ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
    }

    function zeichne(o, t) {
      var x = o.x, y = o.y, w = o.w, h = o.h, i;
      switch (o.t === 'solid' || o.t === 'move' ? o.look : o.t) {
        case 'desk':
          R(x, y, w, h, '#9a6238'); R(x, y, w, 1, '#d89a68'); R(x, y + 1, w, 2, '#b8784a');
          for (i = 0; i < w / 40; i++) R(x + (i * 53) % w, y + 6 + (i * 7) % (h - 10), 20 + (i * 13) % 30, 1, '#87532e');
          R(x, y + 3, 1, h, '#7a4826'); R(x + w - 1, y + 3, 1, h, '#7a4826');
          break;
        case 'pencil':
          R(x + 7, y, w - 17, h, o.c); R(x + 7, y + 1, w - 17, 2, 'rgba(255,255,255,.35)'); R(x + 7, y + h - 2, w - 17, 2, 'rgba(0,0,0,.2)');
          R(x + 7, y + Math.floor(h / 2), w - 17, 1, 'rgba(0,0,0,.12)');
          R(x, y + 1, 4, h - 2, '#f08a9a'); R(x + 4, y, 3, h, '#c8ccd2'); R(x + 5, y, 1, h, '#e8ecf0');
          for (i = 0; i < 10; i++) { var hh = Math.max(1, Math.round(h * (1 - i / 10))); R(x + w - 10 + i, y + (h - hh) / 2, 1, hh, i < 7 ? '#f0d0a0' : '#3a3a3a'); }
          break;
        case 'book':
          R(x, y, w, h, o.c); R(x + 3, y + 2, w - 6, h - 4, '#f2ead6');
          for (i = 4; i < h - 3; i += 2) R(x + 3, y + i, w - 6, 1, '#ddd2b8');
          R(x, y, w, 2, 'rgba(255,255,255,.25)'); R(x, y + h - 2, w, 2, 'rgba(0,0,0,.25)'); R(x + w - 6, y, 3, h, 'rgba(0,0,0,.18)');
          R(x + 10, y, 6, h, '#d8b04a');
          break;
        case 'books':
          var cols = ['#2f5a9a', '#b83a3a', '#3a7a4a', '#c9a24a', '#6a3a7a'], yy = y, n = 0;
          while (yy < y + h) {
            var bh = Math.min(10 + (n * 7) % 9, y + h - yy), ins = (n % 2) * 4;
            R(x + ins, yy, w - 4, bh, cols[n % cols.length]); R(x + ins + 2, yy + 2, w - 10, bh - 4, '#f2ead6');
            R(x + ins, yy, w - 4, 1, 'rgba(255,255,255,.3)'); R(x + ins, yy + bh - 1, w - 4, 1, 'rgba(0,0,0,.3)');
            yy += bh; n++;
          }
          break;
        case 'cup':
          for (i = 0; i < 5; i++) { var px2 = x + 5 + i * 9; R(px2, y - 22 - (i * 7) % 14, 4, 26, ['#f2c230', '#d83a3a', '#3a6ad8', '#3faa5a', '#8a5ad8'][i]); R(px2 + 1, y - 26 - (i * 7) % 14, 2, 4, '#f0d0a0'); }
          R(x, y, w, h, '#8a929c'); R(x, y, w, 3, '#c8d0d8');
          for (i = 2; i < w; i += 3) R(x + i, y + 3, 1, h - 3, '#9aa2ac');
          for (i = 6; i < h; i += 3) R(x, y + i, w, 1, '#7a828c');
          R(x, y, 2, h, '#b8c0c8'); R(x + w - 3, y, 3, h, '#6a727c');
          break;
        case 'ruler_v':
          R(x, y, w, h, 'rgba(200,232,190,.9)'); R(x, y, 1, h, '#e8f8e0');
          for (i = 0; i < h; i += 3) R(x + w - (i % 15 === 0 ? 5 : i % 6 === 0 ? 3 : 2), y + i, i % 15 === 0 ? 5 : i % 6 === 0 ? 3 : 2, 1, '#2a4a2a');
          break;
        case 'ruler':
          R(x, y, w, h, 'rgba(200,232,190,.95)'); R(x, y, w, 1, '#e8f8e0');
          for (i = 0; i < w; i += 3) R(x + i, y + h - (i % 15 === 0 ? 3 : 2), 1, i % 15 === 0 ? 3 : 2, '#2a4a2a');
          break;
        case 'bookmark':
          R(x, y, w, h, '#c83a4a'); R(x, y, w, 1, '#f07a8a'); R(x + w - 6, y + h, 2, 8, '#f2c230'); R(x + w - 7, y + h + 8, 4, 3, '#f2c230');
          break;
        case 'eraser':
          R(x, y, w, h, '#f4f4f0'); R(x, y + Math.floor(h * 0.4), w, Math.ceil(h * 0.6), '#3a6ad8'); R(x + 2, y + h - 6, w - 4, 1, '#ffffff'); R(x, y, w, 1, '#ffffff');
          break;
        case 'bookflat':
          R(x, y, w, h, o.c); R(x + 1, y + 2, w - 2, h - 4, '#efe6cf'); R(x + 1, y + 4, w - 2, 1, '#d8ccb0'); R(x, y, w, 1, 'rgba(255,255,255,.3)'); R(x, y + h - 1, w, 1, 'rgba(0,0,0,.35)');
          break;
        case 'bookstand':
          R(x, y, w, h, o.c); R(x + 2, y + 10, w - 4, 3, '#d8b04a'); R(x + 2, y + h - 16, w - 4, 3, '#d8b04a'); R(x + 4, y + 30, w - 8, 40, 'rgba(255,255,255,.15)'); R(x, y, 1, h, 'rgba(255,255,255,.25)');
          break;
        case 'shelfwall':
          R(x, y, w, h, '#5a3a22'); for (i = 0; i < h; i += 23) R(x + 2, y + i, 1, 14, '#6a4628'); R(x + w - 2, y, 2, h, '#3a2414');
          break;
        case 'shelf':
          R(x, y, w, h, '#7a5030'); R(x, y, w, 2, '#a07048'); R(x, y + h - 2, w, 2, '#4a2e18');
          break;
        case 'floor':
          R(x, y, w, h, '#b07a48'); R(x, y, w, 1, '#d8a070');
          for (i = 0; i < w; i += 48) { R(x + i, y + 1, 1, h, '#8a5a32'); R(x + i + 24, y + 12, 1, h, '#8a5a32'); }
          R(x, y + 11, w, 1, '#946234');
          break;
        case 'sole':
          R(x, y, w, h, '#d8dce0'); R(x, y + h - 4, w, 4, '#a8aeb4'); for (i = 4; i < w; i += 6) R(x + i, y + h - 3, 3, 2, '#8a9096'); R(x, y, w, 1, '#ffffff');
          break;
        case 'shoe':
          R(x, y, w, h, '#f4f4f4'); R(x, y, w, 2, '#ffffff'); R(x + w - 30, y - 6, 30, 8, '#f4f4f4'); R(x + w - 30, y - 6, 30, 1, '#ffffff');
          for (i = 0; i < 4; i++) { R(x + w - 28 + i * 6, y - 4, 4, 1, '#9aa0a8'); R(x + w - 27 + i * 6, y - 5, 2, 3, '#9aa0a8'); }
          R(x + 10, y + 10, 30, 8, '#e0e4e8'); R(x + 4, y + h - 3, w - 8, 1, '#c8ccd0');
          break;
        case 'lego':
          R(x, y, w, h, o.c); R(x, y, w, 1, 'rgba(255,255,255,.4)'); R(x + w - 2, y, 2, h, 'rgba(0,0,0,.2)'); R(x, y + h - 2, w, 2, 'rgba(0,0,0,.2)');
          for (i = 2; i < w - 2; i += 8) { R(x + i, y - 3, 5, 3, o.c); R(x + i, y - 3, 5, 1, 'rgba(255,255,255,.45)'); }
          break;
        case 'pipe':
          R(x, y, w, h, '#9aa2ac'); R(x, y + 2, w, 2, '#d8e0e8'); R(x, y + h - 3, w, 3, '#6a727c');
          for (i = 20; i < w; i += 60) { R(x + i, y - 2, 6, h + 4, '#7a828c'); R(x + i + 2, y + h + 2, 2, 400, '#7a828c'); }
          break;
        case 'backpack':
          R(x + 4, y, w - 8, h, '#1f2a44'); R(x, y + 8, w, h - 8, '#1f2a44'); R(x + 4, y, w - 8, 2, '#33416a');
          R(x + 10, y + 30, w - 20, 50, '#283656'); R(x + 10, y + 30, w - 20, 1, '#3a4a78'); R(x + 14, y + 34, w - 28, 1, '#c9a24a');
          R(x + w / 2 - 2, y + 36, 4, 8, '#c9a24a'); R(x + 20, y + 60, 16, 6, '#ffffff');
          break;
        case 'door':
          R(x, y, w, h, '#8a5a34'); R(x + 3, y, 1, h, '#a07048');
          for (i = 0; i < h; i += 60) R(x + 6, y + i + 10, w - 12, 40, '#7a4c2a');
          R(x, y + h - 2, w, 2, '#5a3a1e');
          break;
        case 'spring':
          var sq = o.squash > 0 ? Math.round(Math.sin(o.squash / 0.25 * Math.PI) * 3) : 0;
          R(x, y + sq, w, h - sq, '#f08a9a'); R(x, y + sq, w, 1, '#ffc0c8'); R(x, y + h - 3, w, 3, '#d0607a');
          R(x + 3, y + sq + 2, w - 6, 1, '#ffffff');
          break;
        case 'spike':
          for (i = 0; i + 8 <= w; i += 8) {
            var col = ['#d83a3a', '#3a6ad8', '#3faa5a', '#f2c230'][(i / 8) % 4];
            R(x + i + 3, y, 1, 3, '#e8ecf0'); R(x + i + 3, y, 1, 1, '#ffffff');
            R(x + i + 1, y + 3, 6, 2, col); R(x + i + 2, y + 2, 4, 1, col); R(x + i + 2, y + 3, 2, 1, 'rgba(255,255,255,.5)');
          }
          break;
        case 'marble':
          kreis(o.x, o.y, o.r, o.c || '#3a7ad8');
          var a = o.rot || 0;
          for (i = 0; i < 3; i++) P(o.x + Math.round(Math.cos(a + i * 2.1) * (o.r - 3)), o.y + Math.round(Math.sin(a + i * 2.1) * (o.r - 3)), '#ffffff');
          R(o.x - 3, o.y - 4, 2, 2, 'rgba(255,255,255,.85)'); R(o.x - 1, o.y + o.r + 1, 3, 1, 'rgba(0,0,0,.25)');
          break;
        case 'gum':
          R(x + 2, y + 1, w - 4, 3, '#f27ab0'); R(x, y + 2, w, 2, '#f27ab0'); R(x + 5, y, w - 14, 1, '#f8a8d0'); R(x + 6, y + 1, 4, 1, '#ffffff');
          if (Math.floor(t * 2) % 2) R(x + w / 2, y - 1, 1, 1, '#f8a8d0');
          break;
        case 'lock':
          var fy = o.offen ? o.fallT * o.fallT * 300 : 0, rot = o.offen ? Math.min(1, o.fallT * 3) : 0;
          ctx.globalAlpha = o.offen ? Math.max(0, 1 - o.fallT * 1.3) : 1;
          if (o.klein) {
            R(x + 3, y + 4 + fy, w - 6, h - 4, '#d8a830'); R(x + 3, y + 4 + fy, w - 6, 1, '#ffe080'); R(x + w / 2 - 1, y + 8 + fy, 2, 4, '#3a2a10');
            R(x + 7, y + fy - rot * 4, 2, 5, '#a8aeb4'); R(x + w - 9, y + fy, 2, 5, '#a8aeb4'); R(x + 7, y + fy - rot * 4, w - 14, 2, '#a8aeb4');
          } else {
            var bt = y + 30 + fy;
            R(x - 2, bt, w + 4, h - 30, '#d8a830'); R(x - 2, bt, w + 4, 2, '#ffe080'); R(x - 2, bt + h - 32, w + 4, 2, '#a07818');
            R(x + w / 2 - 2, bt + 12, 4, 4, '#3a2a10'); R(x + w / 2 - 1, bt + 16, 2, 7, '#3a2a10');
            var sh = rot * 10;
            R(x + 2, y + 6 + fy - sh, 4, 24, '#a8aeb4'); R(x + w - 6, y + 6 + fy, 4, 24, '#a8aeb4'); R(x + 2, y + 2 + fy - sh, w - 4, 5, '#a8aeb4'); R(x + 3, y + 3 + fy - sh, w - 6, 1, '#d8dee4');
          }
          ctx.globalAlpha = 1;
          break;
        case 'gate':
          var r = rect(o);
          if (r.w < 1 || r.h < 1) break;
          R(r.x, r.y, r.w, r.h, '#5a616b');
          if (o.w > o.h) { for (i = 0; i < r.w; i += 6) R(r.x + i, r.y, 2, r.h, '#8a929c'); }
          else { for (i = 0; i < r.h; i += 6) R(r.x, r.y + i, r.w, 2, '#8a929c'); R(r.x + 2, r.y + r.h - 3, r.w - 4, 3, '#f2c230'); }
          break;
        case 'button':
          R(x - 6, y - 2, 12, 2, '#3a3a40'); R(x - 4, y - (o.an ? 3 : 5), 8, o.an ? 1 : 3, o.an ? '#3faa5a' : '#d83a3a'); R(x - 3, y - (o.an ? 3 : 5), 3, 1, 'rgba(255,255,255,.5)');
          break;
        case 'key':
          if (o.weg) break;
          var ky = y + Math.round(Math.sin(t * 3) * 2);
          R(x - 6, ky - 4, 12, 9, 'rgba(255,220,120,.18)');
          R(x - 4, ky - 2, 3, 1, '#f2c230'); R(x - 5, ky - 1, 1, 3, '#f2c230'); R(x - 1, ky - 1, 1, 3, '#f2c230'); R(x - 4, ky + 2, 3, 1, '#f2c230');
          R(x, ky, 5, 1, '#f2c230'); R(x + 3, ky + 1, 1, 2, '#f2c230'); R(x + 5, ky + 1, 1, 1, '#f2c230');
          if (Math.floor(t * 4) % 4 === 0) { P(x + 2, ky - 3, '#ffffff'); P(x + 1, ky - 2, '#ffffff'); P(x + 3, ky - 2, '#ffffff'); }
          break;
        case 'crumb':
          if (o.weg) break;
          var cyy = y + Math.round(Math.sin(t * 3 + o.ph) * 1.5);
          R(x - 2, cyy - 1, 4, 3, '#d89a4a'); R(x - 1, cyy - 2, 3, 1, '#e8b468'); P(x, cyy, '#7a4a20'); P(x - 1, cyy - 1, '#fff0c8');
          if ((Math.floor(t * 5 + o.ph * 3)) % 9 === 0) P(x + 2, cyy - 3, '#ffffff');
          break;
        case 'check':
          R(x, y - 20, 1, 20, '#9aa2ac'); R(x - 1, y - 21, 3, 2, '#d83a3a');
          var nc = o.an ? '#7fe08f' : '#f8e070';
          R(x + 1, y - 19, 11, 10, nc); R(x + 1, y - 10, 11, 1, 'rgba(0,0,0,.15)');
          if (o.an) { P(x + 4, y - 14, '#1a5a2a'); P(x + 5, y - 13, '#1a5a2a'); P(x + 6, y - 14, '#1a5a2a'); P(x + 7, y - 15, '#1a5a2a'); P(x + 8, y - 16, '#1a5a2a'); }
          else { R(x + 3, y - 16, 7, 1, '#b8a040'); R(x + 3, y - 14, 5, 1, '#b8a040'); }
          break;
        case 'fan':
          var fx2 = x + w / 2, by2 = y + h;
          R(fx2 - 14, by2 - 4, 28, 4, '#3a3a40'); R(fx2 - 2, by2 - 30, 4, 26, '#4a4a52');
          var ang = t * 30;
          for (i = 0; i < 3; i++) { var aa = ang + i * 2.094; R(fx2 + Math.cos(aa) * 9 - 3, by2 - 34 + Math.sin(aa) * 3 - 1, 6, 3, '#9ac8e8'); }
          R(fx2 - 2, by2 - 36, 4, 4, '#2a2a30');
          ctx.globalAlpha = 0.35;
          for (i = 0; i < 14; i++) { var wy = by2 - 40 - ((t * 120 + i * 37) % (h - 40)); R(x + 4 + (i * 13) % (w - 8), wy, 1, 6, '#ffffff'); }
          ctx.globalAlpha = 1;
          break;
        case 'drip':
          // Füller, der über die Kante ragt
          R(x - 2, y - 14, 34, 4, '#1a1a22'); R(x + 20, y - 15, 10, 1, '#c9a24a'); R(x - 6, y - 13, 4, 2, '#c9a24a'); R(x - 1, y - 11, 2, 2, '#1a2a7a');
          break;
        case 'exit':
          var gl = 0.5 + 0.2 * Math.sin(t * 3);
          if (o.look === 'case') {
            R(x, y + 14, w, h - 14, '#2a2a3a'); R(x, y + 14, w, 2, '#4a4a60');
            R(x + 6, y + 18, w - 12, h - 22, 'rgba(255,220,140,' + gl + ')');
            for (i = 0; i < w; i += 4) R(x + i, y + 12, 2, 3, '#c8ccd2');
            R(x + w - 8, y + 6, 4, 8, '#c8ccd2');
            Pixel.text(ctx, 'AUSGANG', Math.round(x + w / 2 - cx), Math.round(y - 4 - cy), 1, '#3faa5a', 'center');
          } else if (o.look === 'top') {
            ctx.fillStyle = 'rgba(255,240,190,' + (gl * 0.6) + ')'; ctx.fillRect(Math.round(x - cx), Math.round(y - cy), w, h);
            Pixel.text(ctx, 'AUSGANG', Math.round(x + w / 2 - cx), Math.round(y + 18 - cy), 1, '#3faa5a', 'center');
          } else {
            ctx.fillStyle = 'rgba(255,248,220,' + (gl + 0.2) + ')'; ctx.fillRect(Math.round(x - cx), Math.round(y - cy), w, h);
            Pixel.text(ctx, 'FREIHEIT', Math.round(x + w / 2 - cx), Math.round(y + 30 - cy), 1, '#3a8a4a', 'center');
          }
          break;
      }
    }

    function zeichneMo(t) {
      if (p.tot > 0) return;
      var bild = 'steh';
      if (!p.boden) bild = p.vy < 0 ? 'sprung' : 'fall';
      else if (Math.abs(p.vx) > 10) bild = Math.floor(p.lauf / 7) % 2 ? 'laufA' : 'laufB';
      var img = Sprites.mo(bild);
      var sq = clamp(p.squash, -0.3, 0.3);
      var w = Math.round(12 * (1 + sq)), h = Math.round(16 * (1 - sq));
      if (bild === 'steh' && Math.floor(t * 2) % 2 && Math.abs(sq) < 0.05) h -= 1;
      var dx = Math.round(p.x + 4 - w / 2 - cx), dy = Math.round(p.y + 14 - h - cy) + 1;
      ctx.fillStyle = 'rgba(0,0,0,.25)'; if (p.boden) ctx.fillRect(Math.round(p.x - 1 - cx), Math.round(p.y + 14 - cy), 10, 1);
      ctx.save();
      if (p.face < 0) { ctx.translate(dx + w, dy); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, w, h); }
      else ctx.drawImage(img, dx, dy, w, h);
      ctx.restore();
      if (p.schluessel) { var kx = Math.round(p.x + 4 - cx), ky = Math.round(p.y - 8 - cy) + Math.round(Math.sin(t * 5)); ctx.drawImage(keyIcon, kx - 5, ky); }
    }

    function hud(t) {
      var off = Math.ceil(58 / S);
      Pixel.text(ctx, 'LEVEL ' + lv.nr, off, 5, 1, '#000');
      Pixel.text(ctx, 'LEVEL ' + lv.nr, off, 4, 1, '#ff9a1c');
      var zt = zeitText(st.zeit);
      Pixel.text(ctx, zt, off, 13, 2, '#000'); Pixel.text(ctx, zt, off, 12, 2, '#ffffff');
      var rx = IW - Math.ceil(58 / S);
      ctx.drawImage(p.schluessel ? keyIcon : keyIconGrau, rx - 11, 5);
      var kr = String(st.krumen);
      ctx.fillStyle = '#d89a4a'; ctx.fillRect(rx - 16, 14, 4, 3); ctx.fillStyle = '#e8b468'; ctx.fillRect(rx - 15, 13, 3, 1);
      Pixel.text(ctx, kr, rx - 19, 14, 1, '#000', 'right'); Pixel.text(ctx, kr, rx - 19, 13, 1, '#ffd27a', 'right');
      Pixel.text(ctx, 'x' + st.tode, rx - 1, 21, 1, '#000', 'right'); Pixel.text(ctx, 'x' + st.tode, rx - 1, 20, 1, '#ff8a8a', 'right');
    }

    function render(t) {
      cx = Math.round(cam.x); cy = Math.round(cam.y);
      ctx.imageSmoothingEnabled = false;
      hintergrund(t);
      objs.forEach(function (o) { if (o.t !== 'exit' && o.t !== 'crumb' && o.t !== 'key') zeichne(o, t); });
      objs.forEach(function (o) { if (o.t === 'exit' || o.t === 'crumb' || o.t === 'key') zeichne(o, t); });
      drops.forEach(function (d) { R(d.x - 1, d.y - 2, 2, 4, '#1a2a8a'); P(d.x - 1, d.y - 2, '#6a7ad8'); });
      zeichneMo(t);
      parts.forEach(function (q) { ctx.globalAlpha = Math.max(0, 1 - q.t / q.life); R(q.x, q.y, 1, 1, q.c); });
      ctx.globalAlpha = 1;
      if (lv.bg === 'boden') { ctx.fillStyle = 'rgba(255,240,200,.06)'; ctx.fillRect(0, 0, IW, IH); }
      if (vignette) ctx.drawImage(vignette, 0, 0);
      hud(t);
    }

    function kamera(dt) {
      var zx = p.x + 4 - IW / 2 + p.face * Math.min(30, IW * 0.12);
      var zy = p.y - IH * 0.55;
      cam.x = lerp(cam.x, clamp(zx, 0, Math.max(0, lv.w - IW)), Math.min(1, dt * 5));
      if (lv.h <= IH) cam.y = lv.h - IH;
      else cam.y = lerp(cam.y, clamp(zy, 0, lv.h - IH), Math.min(1, dt * 5));
    }

    // ---------------- Ablauf ----------------
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.033, (now - t0) / 1000); t0 = now;
      var t = now / 1000;
      lesen();
      if (st.modus === 'spiel') {
        st.zeit += dt; st.lvlZeit += dt;
        weltUpdate(dt, st.lvlZeit);
        spielerUpdate(dt);
      } else if (lv) weltUpdate(dt, t);
      if (lv) { kamera(dt); render(t); }
      shake = Math.max(0, shake - dt * 14);
      shakeEl.style.transform = shake > 0.2 ? 'translate(' + Math.round(rnd(-shake, shake)) + 'px,' + Math.round(rnd(-shake, shake)) + 'px)' : '';
      raf = requestAnimationFrame(tick);
    }

    function intro() {
      st.modus = 'intro';
      ovl.hidden = false;
      ovl.innerHTML =
        '<div class="lineal"><div class="cm"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>' +
        '<h2>MO<br>GANZ KLEIN</h2><span class="mass">KÖRPERGRÖSSE: 3,2 CM</span>' +
        '<p>Mo ist geschrumpft und steckt im Klassenzimmer fest. Für ihn ist jeder Bleistift ein Baumstamm.</p>' +
        '<p>Brich aus: Schreibtisch → Bücherregal → unter der Tür durch. Finde Schlüssel, drück Schalter, sammle Krümel.</p>' +
        '<p class="klein">◀ ▶ / A D laufen · ▲ / Leertaste springen · an Wänden nochmal springen</p>' +
        (+Pixel.get(BEST_KEY, 0) ? '<p class="klein">Bestmarke: ' + Pixel.get(BEST_KEY, 0) + ' Pkt · ' + zeitText(+Pixel.get(ZEIT_KEY, 0)) + '</p>' : '') +
        '<div class="reihe"><button class="mo-btn" data-act="go">AUSBRECHEN</button></div></div>';
    }
    function go() {
      ovl.hidden = true; ovl.innerHTML = '';
      st.zeit = 0; st.tode = 0; st.krumenGesamt = 0; st.zeiten = [];
      laden(0); st.modus = 'spiel';
      Pixel.sfx.tone(523, 0.1, 'square', 0.05); Pixel.sfx.tone(784, 0.15, 'square', 0.05, null, 0.1);
    }
    function geschafft() {
      if (st.modus !== 'spiel') return;
      st.modus = 'pause'; st.zeiten.push(st.lvlZeit);
      Pixel.sfx.tone(523, 0.1, 'square', 0.05); Pixel.sfx.tone(659, 0.1, 'square', 0.05, null, 0.1); Pixel.sfx.tone(784, 0.1, 'square', 0.05, null, 0.2); Pixel.sfx.tone(1046, 0.25, 'square', 0.05, null, 0.3);
      if (karteEl) karteEl.remove();
      var gesamtKrumen = lv.objs.filter(function (o) { return o.t === 'crumb'; }).length;
      if (st.lvl < LEVELS.length - 1) {
        ovl.hidden = false;
        ovl.innerHTML =
          '<div class="lineal"><div class="cm"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>' +
          '<h2>LEVEL ' + lv.nr + '<br>GESCHAFFT!</h2>' +
          '<div class="stats"><span>Zeit</span><b>' + zeitText(st.lvlZeit) + '</b><span>Krümel</span><b>' + st.krumen + ' / ' + gesamtKrumen + '</b><span>Gesamtzeit</span><b>' + zeitText(st.zeit) + '</b></div>' +
          '<div class="reihe"><button class="mo-btn" data-act="weiter">WEITER</button></div></div>';
      } else {
        var punkte = Math.max(100, Math.round(6000 + st.krumenGesamt * 60 - st.tode * 120 - st.zeit * 12));
        var best = +Pixel.get(BEST_KEY, 0), neu = punkte > best;
        if (neu) { Pixel.set(BEST_KEY, punkte); Pixel.set(ZEIT_KEY, st.zeit.toFixed(1)); }
        ovl.hidden = false;
        ovl.innerHTML =
          '<div class="lineal"><div class="cm"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></div>' +
          '<h2>AUSGEBROCHEN!</h2><p>Mo ist unter der Tür durch. Klein, aber frei.</p>' +
          '<div class="stats"><span>Punkte</span><b>' + punkte + (neu ? ' ★' : '') + '</b><span>Gesamtzeit</span><b>' + zeitText(st.zeit) + '</b>' +
          '<span>Krümel</span><b>' + st.krumenGesamt + '</b><span>Hingefallen</span><b>' + st.tode + '×</b><span>Bestmarke</span><b>' + Math.max(best, punkte) + '</b></div>' +
          '<div class="reihe"><button class="mo-btn" data-act="nochmal">NOCHMAL</button><button class="mo-btn alt" data-act="exit">MENÜ</button></div></div>';
      }
    }
    function weiter() {
      ovl.hidden = true; ovl.innerHTML = '';
      laden(st.lvl + 1); st.modus = 'spiel';
    }

    function onClick(e) {
      var b = e.target.closest && e.target.closest('[data-act]');
      if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'go' || a === 'nochmal') go();
      if (a === 'weiter') weiter();
      if (a === 'exit') { stop(); onExit(); }
      if (a === 'ton') { Pixel.setMuted(!Pixel.isMuted()); tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊'; }
    }
    function stop() {
      if (!alive) return;
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerup', padLos); window.removeEventListener('pointercancel', padLos);
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize);
    root.addEventListener('click', onClick);
    resize(); laden(0); if (karteEl) karteEl.remove(); intro();
    t0 = performance.now();
    raf = requestAnimationFrame(tick);
    // Debug/Test: window.__mo erlaubt automatisierte Tests
    window.__mo = { st: st, p: function () { return p; }, laden: function (i) { laden(i); st.modus = 'spiel'; ovl.hidden = true; }, objs: function () { return objs; } };
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.mo = { start: start };
})();
