// Matteo: Meinungen ablehnen – 2D-Pixel-Spiel im Kanzleramt.
// Matteo steht auf dem Kanzlerschreibtisch. Fremde Meinungen fliegen als Akten herein:
// antippen = Stempel ABGELEHNT. Matteos eigene Meinungen (grün) in Ruhe lassen.
(function () {
  'use strict';

  var ANTRAG = [
    'Ananas auf Pizza ist super!', 'Ketchup gehört auf Pizza.', 'Pizza mit Messer und Gabel essen.',
    'Spaghetti vor dem Kochen brechen.', 'Cappuccino nach dem Mittagessen.', 'Pizza Hawaii > Margherita',
    'Montag ist der schönste Tag.', 'Hausaufgaben machen Spaß.', 'Um 5 Uhr aufstehen ist geil.',
    'Parmesan auf Fisch.', 'Pasta mit Ketchup.', 'Pizza braucht keinen Käse.', 'Tiefkühlpizza = echte Pizza.',
    'Pasta muss man totkochen.', 'Kalte Pizza ist besser.', 'Sahne in die Carbonara!', 'Mathe ist mein Hobby.',
    'Socken in Sandalen sind stylisch.', 'Instant-Espresso reicht völlig.', 'Kein WLAN in der Schule.'
  ];
  var EIL = ['SOFORT Ananas-Pflicht!', 'Ketchup JETZT!', 'Spaghetti brechen, schnell!', 'Montag verlängern!', 'Zusatzstunde Mathe!'];
  var GESETZ = ['Pizza nur noch mit Ananas', 'Ketchup-Pflicht in allen Mensen', 'Espresso-Verbot ab 12 Uhr',
    'Abschaffung der Mittagspause', 'Pasta nur noch weichgekocht', 'Hausaufgaben am Wochenende'];
  var EIGENE = ['Pizza Margherita ist unschlagbar.', 'Italien hat das beste Essen.', 'Pasta al dente!',
    'Espresso schwarz. Fertig.', 'Steinofen schlägt alles.', 'Mehr Pizza in der Mensa.', 'Schlafen ist wichtig.'];
  var NEIN = ['NÖ.', 'ABGELEHNT!', 'NIEMALS!', 'BASTA!', 'MAMMA MIA!', 'NEIN DANKE.', 'ARRIVEDERCI!', 'SICHER NICHT.', 'VETO!'];
  var JA = ['GENAU!', 'PERFETTO!', 'BELLISSIMO!', 'SO IST ES.'];
  var AUA = ['AUA!', 'SKANDAL!', 'WAS?!', 'FAKE NEWS!'];
  var BEST_KEY = 'crazylineup.matteo.best';

  var CSS = [
    '.mt-wrap{position:absolute;inset:0;overflow:hidden;background:#1a1410}',
    '.mt-shake{position:absolute;inset:0}',
    '.mt-shake canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.mt-layer{position:absolute;inset:0}',
    '.mt-shake canvas.mt-fx{pointer-events:none;z-index:4000}',
    '.akte{position:absolute;left:0;top:0;width:clamp(122px,31vw,176px);background:#f6efdc;color:#241a12;border:3px solid #241a12;',
    ' box-shadow:4px 4px 0 rgba(0,0,0,.35);font:16px/1.15 "Pixelify Sans",sans-serif;padding-bottom:8px;cursor:pointer;touch-action:none;',
    ' background-image:repeating-linear-gradient(to bottom,transparent 0 17px,rgba(60,90,160,.18) 17px 18px);will-change:transform}',
    '.akte .kopf{font:8px/1 "Press Start 2P",monospace;padding:6px;background:#7c7262;color:#fff;letter-spacing:.06em;display:flex;justify-content:space-between}',
    '.akte.eil .kopf{background:#e8343f}.akte.gesetz .kopf{background:#2f4a8a}.akte.good .kopf{background:#2f9a4c}',
    '.akte.gesetz{width:clamp(140px,36vw,200px);border-width:4px}',
    '.akte.good{background-color:#eaf7e6}',
    '.akte .txt{padding:6px 8px 0}',
    '.akte .st{position:absolute;left:50%;top:55%;font:11px/1 "Press Start 2P",monospace;color:#d42a2a;border:3px solid #d42a2a;padding:6px 7px;',
    ' white-space:nowrap;opacity:0;transform:translate(-50%,-50%) rotate(-14deg) scale(2.2);pointer-events:none;mix-blend-mode:multiply}',
    '.akte .st.on{opacity:.9;transform:translate(-50%,-50%) rotate(var(--r,-14deg)) scale(1);transition:transform .07s,opacity .07s}',
    '.akte .st.gruen{color:#23853d;border-color:#23853d}',
    '.akte.weg{pointer-events:none}',
    '.akte.klatsch{animation:mtKlatsch .6s forwards}',
    '@keyframes mtKlatsch{0%{filter:none}20%{transform:var(--t) scale(1.25)}100%{transform:var(--t) translateY(260px) rotate(40deg) scale(.6);opacity:0}}',
    '.akte.reiss{animation:mtReiss .45s forwards}',
    '@keyframes mtReiss{30%{transform:var(--t) rotate(-8deg) scale(1.1)}100%{transform:var(--t) scale(.2) rotate(30deg);opacity:0}}',
    '.akte.ablage{animation:mtAblage .5s forwards}',
    '@keyframes mtAblage{100%{transform:var(--t) translateY(40px) scale(.3);opacity:0}}',
    '.sprech{position:absolute;font:11px/1.2 "Press Start 2P",monospace;background:#fff;color:#111;border:3px solid #111;padding:7px 8px;',
    ' white-space:nowrap;transform:translate(-50%,-100%);pointer-events:none;animation:mtPop .18s;z-index:5000}',
    '.sprech:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:#fff;border-right:3px solid #111;border-bottom:3px solid #111;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes mtPop{from{transform:translate(-50%,-80%) scale(.4)}}',
    '.mt-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;padding:calc(10px + env(safe-area-inset-top)) 10px 0;pointer-events:none;z-index:6000}',
    '.mt-top button{pointer-events:auto}',
    '.mt-flash{position:absolute;inset:0;background:#ff2030;opacity:0;pointer-events:none;z-index:5500}',
    '.mt-flash.an{animation:mtFlash .35s}',
    '@keyframes mtFlash{0%{opacity:.35}100%{opacity:0}}',
    '.mt-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,6,4,.55);z-index:7000;padding:16px}',
    '.mt-leg{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;text-align:left;margin:14px 0 4px;font-size:16px;align-items:center}',
    '.mt-leg span{font:8px/1 "Press Start 2P",monospace;color:#fff;padding:6px;white-space:nowrap}',
    '.mt-stats{display:grid;grid-template-columns:1fr auto;gap:4px 16px;text-align:left;font-size:18px;margin:12px auto 0;max-width:260px}',
    '.mt-stats b{font-family:"Press Start 2P",monospace;font-size:13px;font-weight:400;text-align:right}'
  ].join('\n');

  var HEART = ['.HH.HH.', 'HwHHHHH', 'HHHHHHH', '.HHHHH.', '..HHH..', '...H...'];

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="mt-wrap"><div class="mt-shake"><canvas></canvas><div class="mt-layer"></div><canvas class="mt-fx"></canvas></div>' +
      '<div class="mt-flash"></div>' +
      '<div class="mt-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
      '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="mt-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.mt-wrap');
    var shakeEl = root.querySelector('.mt-shake');
    var cv = root.querySelector('canvas');
    var ctx = cv.getContext('2d');
    var cvFx = root.querySelector('.mt-fx');
    var fctx = cvFx.getContext('2d');
    var layer = root.querySelector('.mt-layer');
    var flash = root.querySelector('.mt-flash');
    var ovl = root.querySelector('[data-el=ovl]');
    var tonBtn = root.querySelector('[data-act=ton]');
    var heartFull = Pixel.sprite('herz-voll', HEART, { H: '#e8343f', w: '#ffd0d0' });
    var heartEmpty = Pixel.sprite('herz-leer', HEART, { H: '#3a2f2a', w: '#4a3f3a' });

    var S = 3, IW = 0, IH = 0, SW = 0, SH = 0, deskTop = 0, mx = 0, bg = null, bgPhase = -1;
    var win = { x: 0, y: 0, w: 0, h: 0 };
    var g; // Spielzustand
    var raf = 0, last = 0, alive = true;

    // ---------------- Layout ----------------
    function resize() {
      SW = wrap.clientWidth; SH = wrap.clientHeight;
      S = Math.max(2, Math.floor(SH / 230));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH;
      cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      cvFx.width = IW; cvFx.height = IH;
      cvFx.style.width = IW * S + 'px'; cvFx.style.height = IH * S + 'px';
      deskTop = IH - Math.max(62, Math.round(IH * 0.27));
      mx = Math.round(IW / 2);
      win.w = Math.min(IW - 56, 150); win.h = Math.min(84, deskTop - 64);
      win.x = Math.round((IW - win.w) / 2); win.y = 18;
      bgPhase = -1;
    }
    function headScreen() { return { x: mx * S, y: (deskTop + 12 - 56 + 16) * S }; }

    // ---------------- Hintergrund (vorgerendert) ----------------
    var SKY = [
      ['#6fb6ec', '#8ccaf2', '#b4dcf7', '#dcf0fc'],
      ['#4f8fd6', '#7fb2e6', '#f0cf90', '#f6b46e'],
      ['#2a3570', '#5c4890', '#cc6b78', '#f09a58'],
      ['#080c26', '#10173e', '#18225a', '#223068']
    ];
    function buildBg(phase) {
      bg = document.createElement('canvas'); bg.width = IW; bg.height = IH;
      var c = bg.getContext('2d');
      function R(x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
      var night = phase === 3;
      // Wand: dunkelgrüne Tapete mit Streifen
      R(0, 0, IW, deskTop, '#2d4a3b');
      for (var x = 0; x < IW; x += 6) R(x, 0, 2, deskTop, '#294436');
      R(0, 0, IW, 6, '#5a3a22'); R(0, 6, IW, 1, '#8a5a36'); R(0, 7, IW, 1, '#1d2f25');
      // Holzvertäfelung
      var wy = deskTop - 36;
      R(0, wy, IW, 36, '#5b3a24'); R(0, wy, IW, 2, '#8a5a36'); R(0, wy + 2, IW, 1, '#3a2416');
      for (x = 2; x < IW; x += 26) {
        R(x + 3, wy + 7, 20, 24, '#4e3120'); R(x + 3, wy + 7, 20, 1, '#3a2416'); R(x + 3, wy + 30, 20, 1, '#77502f');
      }
      // Fenster mit Himmel
      var sk = SKY[phase], bandH = Math.ceil(win.h / sk.length);
      for (var i = 0; i < sk.length; i++) R(win.x, win.y + i * bandH, win.w, bandH, sk[i]);
      // Dithering zwischen den Bändern
      for (i = 1; i < sk.length; i++) {
        for (x = 0; x < win.w; x += 2) R(win.x + x + (i % 2), win.y + i * bandH - 1, 1, 1, sk[i - 1]);
      }
      if (phase >= 2) for (i = 0; i < 14; i++) R(win.x + (i * 37 % win.w), win.y + 2 + (i * 13 % Math.round(win.h * 0.45)), 1, 1, '#fff7d0');
      // Sonne / Mond
      if (phase === 0) { R(win.x + win.w - 22, win.y + 8, 8, 8, '#fff6b0'); R(win.x + win.w - 23, win.y + 10, 10, 4, '#fff6b0'); }
      if (phase === 3) { R(win.x + win.w - 22, win.y + 7, 7, 7, '#f4f1d8'); R(win.x + win.w - 20, win.y + 7, 5, 5, '#18225a'); }
      // Skyline: Häuser, Reichstag, Fernsehturm
      var base = win.y + win.h, silh = night ? '#141831' : phase === 2 ? '#3b2f52' : '#7d8899';
      for (x = 0; x < win.w; x += 7) {
        var hh = 8 + ((x * 13) % 11);
        R(win.x + x, base - hh, 7, hh, silh);
        if (night) for (var wyy = base - hh + 2; wyy < base - 2; wyy += 3) if ((x + wyy) % 4 === 0) R(win.x + x + 2, wyy, 1, 1, '#ffd36b');
      }
      var rw = Math.min(56, win.w - 20), rx = win.x + Math.round((win.w - rw) / 2), rh = 16;
      var stone = night ? '#22273f' : phase === 2 ? '#5b4a62' : '#b8b1a0';
      R(rx, base - rh, rw, rh, stone);
      R(rx - 2, base - rh - 6, 8, rh + 6, stone); R(rx + rw - 6, base - rh - 6, 8, rh + 6, stone);
      R(rx + 10, base - rh - 4, rw - 20, 4, stone);
      for (x = rx + 12; x < rx + rw - 12; x += 4) R(x, base - rh + 4, 2, 8, night ? '#ffcf6a' : '#6f6858');
      var dx = rx + rw / 2;
      var glas = night ? '#9fd6ff' : '#cfe6f0';
      for (var r = 0; r < 9; r++) { var ww = Math.round(Math.sqrt(81 - r * r) * 1.6); R(dx - ww, base - rh - 4 - r, ww * 2, 1, r % 2 ? glas : stone); }
      // Fernsehturm
      var tx = win.x + Math.round(win.w * 0.18);
      R(tx, base - 46, 2, 46, silh); R(tx - 3, base - 38, 8, 6, silh); R(tx - 2, base - 39, 6, 1, silh); R(tx + 0.5, base - 56, 1, 10, silh);
      // Rahmen + Sprossen
      R(win.x - 4, win.y - 4, win.w + 8, 4, '#3f2615'); R(win.x - 4, win.y + win.h, win.w + 8, 5, '#3f2615');
      R(win.x - 4, win.y, 4, win.h, '#3f2615'); R(win.x + win.w, win.y, 4, win.h, '#3f2615');
      R(win.x + Math.round(win.w / 2) - 1, win.y, 3, win.h, '#3f2615'); R(win.x, win.y + Math.round(win.h * 0.42), win.w, 2, '#3f2615');
      R(win.x - 6, win.y + win.h + 4, win.w + 12, 3, '#6b4428');
      // Vorhänge
      [win.x - 12, win.x + win.w + 4].forEach(function (vx) {
        R(vx, win.y - 8, 8, win.h + 16, '#7a1f2c');
        for (var f = 1; f < 8; f += 3) R(vx + f, win.y - 8, 1, win.h + 16, '#5a1420');
        R(vx, win.y - 10, 8, 3, '#c9a24a');
      });
      R(win.x - 14, win.y - 10, win.w + 28, 2, '#c9a24a');
      // Fahnen: Deutschland links, Europa rechts
      var pl = Math.max(14, win.x - 20), pr = Math.min(IW - 15, win.x + win.w + 19);
      [pl, pr].forEach(function (px, k) {
        R(px, 26, 2, deskTop - 26, '#b08a3a'); R(px - 1, 23, 4, 3, '#e0c060');
        var fx = k === 0 ? px - 18 : px + 2, fy = 28;
        for (var col = 0; col < 18; col++) {
          var off = Math.round(Math.sin(col * 0.5) * 1.2) + 1;
          if (k === 0) { R(fx + col, fy + off, 1, 4, '#111'); R(fx + col, fy + 4 + off, 1, 4, '#dd0000'); R(fx + col, fy + 8 + off, 1, 4, '#ffcc00'); }
          else R(fx + col, fy + off, 1, 12, '#103a9a');
        }
        if (k === 1) for (var a = 0; a < 12; a++) R(fx + 9 + Math.round(Math.cos(a / 12 * 6.283) * 4), fy + 6 + Math.round(Math.sin(a / 12 * 6.283) * 4), 1, 1, '#ffcc00');
      });
      // Gerahmtes Pizza-Gemälde (wenn Platz)
      if (win.x > 54) {
        var gx = 8, gy = 44;
        R(gx, gy, 26, 22, '#c9a24a'); R(gx + 2, gy + 2, 22, 18, '#2a1a10');
        R(gx + 6, gy + 5, 14, 12, '#e8b04a'); R(gx + 7, gy + 6, 12, 10, '#d84a2a');
        [[9, 8], [14, 9], [11, 12], [16, 13]].forEach(function (p) { R(gx + p[0], gy + p[1], 2, 2, '#f4e8c8'); });
        R(gx + 12, gy + 10, 1, 1, '#3a8a3a');
      }
      // Bücherregal rechts und Pflanze links, wenn Platz ist
      var rest = IW - (pr + 22);
      if (rest > 44) {
        var bw = Math.min(70, rest - 14), bx0 = pr + 14 + Math.round((rest - bw) / 2), bt = 34;
        R(bx0 - 2, bt - 2, bw + 4, deskTop - bt, '#3f2615');
        for (var sy0 = bt; sy0 < deskTop - 40; sy0 += 18) {
          R(bx0, sy0, bw, 16, '#2a170c');
          for (var bxx = bx0 + 1; bxx < bx0 + bw - 3;) {
            var bkw = 2 + ((bxx * 7 + sy0) % 3), bkh = 10 + ((bxx * 5 + sy0) % 5);
            R(bxx, sy0 + 16 - bkh, bkw, bkh, ['#8a2a2a', '#2a4a8a', '#2f6a3a', '#c9a24a', '#6a3a7a', '#d8cfb8'][(bxx + sy0) % 6]);
            bxx += bkw + 1;
          }
          R(bx0 - 2, sy0 + 16, bw + 4, 2, '#5a3a22');
        }
      }
      if (pl - 18 > 64) {
        var px0 = pl - 46, pb = deskTop - 36;
        R(px0 + 4, pb - 14, 14, 14, '#a8552a'); R(px0 + 3, pb - 15, 16, 3, '#c26a38');
        [[0, -30, 8, 14], [12, -38, 9, 16], [5, -46, 8, 14], [-4, -22, 9, 9], [17, -26, 8, 10]].forEach(function (l) {
          R(px0 + 4 + l[0], pb + l[1], l[2], l[3], '#2f7a3a'); R(px0 + 5 + l[0], pb + l[1] + 1, 2, l[3] - 2, '#4a9a52');
        });
      }
      // Schreibtisch
      var topH = 22;
      R(0, deskTop, IW, topH, '#8a5530');
      for (i = 0; i < 9; i++) { var gy2 = deskTop + 2 + i * 2.4; R((i * 31) % IW, gy2, 18 + (i * 7) % 22, 1, '#7a4a28'); }
      R(0, deskTop, IW, 1, '#b07446');
      R(0, deskTop + topH, IW, 2, '#a8693d');
      R(0, deskTop + topH + 2, IW, IH - deskTop - topH - 2, '#5a341d');
      for (x = 6; x < IW - 20; x += 34) {
        R(x, deskTop + topH + 8, 28, IH - deskTop - topH - 14, '#4d2b17');
        R(x, deskTop + topH + 8, 28, 1, '#3a2010'); R(x, IH - 7, 28, 1, '#6b4022');
      }
      // Lichtkegel der Bankerlampe
      c.fillStyle = night ? 'rgba(255,230,140,.28)' : 'rgba(255,230,140,.14)';
      for (var lyy = 0; lyy < 12; lyy++) c.fillRect(2, deskTop + 4 + lyy, 30 + lyy, 1);
      // Bankerlampe links hinten
      var lx = 8, ly = deskTop + 6;
      R(lx + 7, ly - 10, 2, 10, '#c9a24a'); R(lx + 3, ly - 1, 10, 2, '#c9a24a');
      R(lx, ly - 15, 16, 5, '#1f7a3f'); R(lx + 1, ly - 16, 14, 1, '#2f9a55'); R(lx, ly - 11, 16, 1, '#ffe9a0');
      // Aktenstapel rechts hinten
      var ax = IW - 40, ay = deskTop + 5;
      ['#d8cfb8', '#2f4a8a', '#f6efdc', '#b03030', '#f6efdc', '#d8b04a'].forEach(function (col, n) { R(ax + (n % 2), ay - n * 2, 22, 2, col); });
      return bg;
    }

    // ---------------- Zustand ----------------
    function reset() {
      layer.innerHTML = '';
      g = {
        t: 0, score: 0, lives: 3, combo: 0, bestCombo: 0, stamped: 0, papers: [], spawnIn: 1.0,
        fx: [], balls: [], parts: [], pops: [], mood: 'neutral', moodT: 0, hop: 0, bonk: 0,
        binWob: 0, shake: 0, running: false, over: false, bubble: null, bubbleT: 0
      };
    }
    function level() { return Math.min(1, g.t / 70); }
    function mult() { return Math.min(5, 1 + Math.floor(g.combo / 5)); }

    function setMood(m, d) { g.mood = m; g.moodT = d || 0.6; }
    function say(txt, dur) {
      if (g.bubble) g.bubble.remove();
      var b = document.createElement('div'); b.className = 'sprech'; b.textContent = txt;
      var h = headScreen(); b.style.left = h.x + 'px'; b.style.top = (h.y - 26 * S) + 'px';
      layer.appendChild(b);
      g.bubble = b; g.bubbleT = dur || 0.9;
    }
    function shake(a) { g.shake = Math.max(g.shake, a); }
    function burst(x, y, n, cols) {
      for (var i = 0; i < n; i++) g.parts.push({ x: x, y: y, vx: rnd(-60, 60), vy: rnd(-80, 10), c: pick(cols), life: rnd(0.3, 0.7), t: 0 });
    }
    function pop(x, y, txt, col) { g.pops.push({ x: x, y: y, txt: txt, col: col, t: 0 }); }

    // ---------------- Akten ----------------
    function spawn() {
      var lv = level(), r = Math.random(), type;
      if (r < 0.26) type = 'good';
      else if (r < 0.26 + 0.12 + 0.14 * lv) type = 'eil';
      else if (r < 0.26 + 0.12 + 0.14 * lv + 0.08 + 0.12 * lv && g.t > 10) type = 'gesetz';
      else type = 'bad';
      var el = document.createElement('div');
      el.className = 'akte ' + type;
      var kopf = { good: ['MATTEO-MEINUNG', '✓'], eil: ['EILANTRAG', '!!'], gesetz: ['GESETZENTWURF', '§'], bad: ['ANTRAG', 'Nr.' + (100 + Math.floor(Math.random() * 900))] }[type];
      var txt = type === 'good' ? pick(EIGENE) : type === 'eil' ? pick(EIL) : type === 'gesetz' ? pick(GESETZ) : pick(ANTRAG);
      el.innerHTML = '<div class="kopf"><span>' + kopf[0] + '</span><span>' + kopf[1] + '</span></div><div class="txt">' + esc(txt) + '</div>' +
        (type === 'gesetz' ? '<div class="st" style="--r:8deg;top:40%">ABGELEHNT</div>' : '') +
        '<div class="st">' + (type === 'good' ? 'GENEHMIGT' : 'ABGELEHNT') + '</div>';
      if (type === 'good') el.querySelector('.st').classList.add('gruen');
      layer.appendChild(el);
      var w = el.offsetWidth, h = el.offsetHeight, hd = headScreen();
      var p = {
        el: el, type: type, w: w, h: h, t: 0, state: 'fly',
        x0: rnd(6, Math.max(7, SW - w - 6)), y0: -h - 10,
        tx: hd.x - w / 2 + rnd(-24, 24), ty: hd.y - h / 2,
        dur: lerp(5.0, 2.2, lv) * (type === 'eil' ? 0.55 : type === 'gesetz' ? 1.35 : 1) * rnd(0.9, 1.1),
        hits: type === 'gesetz' ? 2 : 1, wob: rnd(0, 6.28), rot: rnd(-7, 7), x: 0, y: 0
      };
      el.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); tap(p); });
      g.papers.push(p);
      place(p);
    }
    function place(p) {
      var k = Math.min(1, p.t / p.dur);
      p.x = lerp(p.x0, p.tx, k) + Math.sin(p.t * 2.2 + p.wob) * 14 * (1 - k);
      p.y = lerp(p.y0, p.ty, k);
      var tr = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) rotate(' + (p.rot * (1 - k) + Math.sin(p.t * 3 + p.wob) * 3).toFixed(1) + 'deg)';
      p.el.style.transform = tr;
      p.el.style.setProperty('--t', tr);
      p.el.style.zIndex = 100 + Math.round(k * 100);
    }
    function center(p) { return { x: (p.x + p.w / 2) / S, y: (p.y + p.h / 2) / S }; }
    function finish(p, cls, delay) {
      p.state = 'done';
      p.el.classList.add('weg');
      setTimeout(function () {
        p.el.classList.add(cls);
        setTimeout(function () { p.el.remove(); }, 700);
      }, delay || 0);
    }

    function tap(p) {
      if (!g.running || p.state !== 'fly') return;
      var c = center(p);
      if (p.type === 'good') {
        p.state = 'done';
        p.el.classList.add('weg', 'reiss');
        setTimeout(function () { p.el.remove(); }, 500);
        hurt('DAS WAR MEINE MEINUNG!');
        burst(c.x, c.y, 14, ['#f6efdc', '#2f9a4c', '#ffffff']);
        return;
      }
      p.hits--;
      g.fx.push({ x: c.x, y: c.y, t: 0, hit: false, p: p, last: p.hits <= 0 });
      if (p.hits > 0) { p.dur += 1.2; p.state = 'fly'; return; }
      p.state = 'stamping';
    }

    function stampImpact(f) {
      var p = f.p, sts = p.el.querySelectorAll('.st');
      Pixel.sfx.noise(0.12, 0.35, 900); Pixel.sfx.tone(90, 0.12, 'sine', 0.2, 50);
      shake(f.last ? 3 : 2);
      burst(f.x, f.y, 10, ['#d42a2a', '#8a1010', '#241a12']);
      if (!f.last) { sts[0].classList.add('on'); pop(f.x, f.y - 10, 'NOCHMAL!', '#ffd23f'); return; }
      sts[sts.length - 1].classList.add('on');
      g.combo++; g.bestCombo = Math.max(g.bestCombo, g.combo); g.stamped++;
      var pts = (p.type === 'gesetz' ? 30 : p.type === 'eil' ? 15 : 10) * mult();
      g.score += pts;
      pop(f.x, f.y - 6, '+' + pts, '#ffd23f');
      if (g.combo % 5 === 0) { pop(mx, deskTop - 70, 'KOMBO X' + mult(), '#ff9a3f'); Pixel.sfx.tone(660, 0.1, 'square', 0.05); Pixel.sfx.tone(880, 0.12, 'square', 0.05, null, 0.08); }
      setMood('angry', 0.5); g.hop = 0.18;
      if (Math.random() < 0.55) say(pick(NEIN), 0.8);
      setTimeout(function () {
        if (!alive) return;
        p.el.remove();
        var c = center(p);
        g.balls.push({ x0: c.x, y0: c.y, t: 0, dur: 0.55 });
      }, 260);
    }

    function hurt(msg) {
      g.lives--; g.combo = 0;
      setMood('shock', 0.9); g.bonk = 0.35;
      say(msg || pick(AUA), 1.1);
      shake(5);
      flash.classList.remove('an'); void flash.offsetWidth; flash.classList.add('an');
      Pixel.sfx.tone(220, 0.25, 'sawtooth', 0.08, 70);
      if (g.lives <= 0) setTimeout(gameOver, 500);
    }

    function arrive(p) {
      if (p.type === 'good') {
        p.el.querySelector('.st').classList.add('on');
        finish(p, 'ablage', 300);
        var pts = 5 * mult(); g.score += pts;
        var c = center(p); pop(c.x, c.y - 8, '+' + pts, '#7fe08f');
        setMood('happy', 0.8); say(pick(JA), 0.8);
        Pixel.sfx.tone(784, 0.09, 'square', 0.05); Pixel.sfx.tone(1046, 0.14, 'square', 0.05, null, 0.09);
      } else {
        finish(p, 'klatsch', 0);
        hurt();
      }
    }

    // ---------------- Schleife ----------------
    function update(dt) {
      if (g.running) {
        g.t += dt;
        g.spawnIn -= dt;
        var flying = g.papers.filter(function (p) { return p.state === 'fly'; }).length;
        if (g.spawnIn <= 0 && flying < 10) {
          spawn();
          g.spawnIn = lerp(1.35, 0.45, level()) * rnd(0.8, 1.2);
        }
        g.papers.forEach(function (p) {
          if (p.state !== 'fly') return;
          p.t += dt;
          if (p.t >= p.dur) arrive(p); else place(p);
        });
        g.papers = g.papers.filter(function (p) { return p.state !== 'done'; });
        var ph = Math.min(3, Math.floor(g.t / 35));
        if (ph !== bgPhase) { bgPhase = ph; buildBg(ph); }
      }
      g.fx.forEach(function (f) {
        f.t += dt;
        if (!f.hit && f.t >= 0.08) { f.hit = true; stampImpact(f); }
      });
      g.fx = g.fx.filter(function (f) { return f.t < 0.42; });
      g.balls.forEach(function (b) {
        b.t += dt;
        if (b.t >= b.dur && !b.done) { b.done = true; g.binWob = 0.3; Pixel.sfx.tone(330, 0.06, 'triangle', 0.08, 200); }
      });
      g.balls = g.balls.filter(function (b) { return !b.done; });
      g.parts.forEach(function (q) { q.t += dt; q.vy += 300 * dt; q.x += q.vx * dt; q.y += q.vy * dt; });
      g.parts = g.parts.filter(function (q) { return q.t < q.life; });
      g.pops.forEach(function (q) { q.t += dt; });
      g.pops = g.pops.filter(function (q) { return q.t < 0.9; });
      g.moodT -= dt; if (g.moodT <= 0 && !g.over) g.mood = 'neutral';
      g.hop = Math.max(0, g.hop - dt); g.bonk = Math.max(0, g.bonk - dt); g.binWob = Math.max(0, g.binWob - dt);
      g.shake = Math.max(0, g.shake - dt * 18);
      if (g.bubble) { g.bubbleT -= dt; if (g.bubbleT <= 0) { g.bubble.remove(); g.bubble = null; } }
      shakeEl.style.transform = g.shake > 0.1 ? 'translate(' + Math.round(rnd(-g.shake, g.shake)) + 'px,' + Math.round(rnd(-g.shake, g.shake)) + 'px)' : '';
    }

    function binPos() { return { x: IW - 30, y: deskTop + 2 }; }

    function drawStamp(x, y, squash) {
      var h = squash ? 0.6 : 1;
      fctx.fillStyle = '#5a3418'; fctx.fillRect(x - 4, y - 22 * h, 8, 6 * h); fctx.fillStyle = '#7a4a24'; fctx.fillRect(x - 3, y - 22 * h, 6, 2);
      fctx.fillStyle = '#3a2210'; fctx.fillRect(x - 1, y - 16 * h, 3, 7 * h);
      fctx.fillStyle = '#2a2a2a'; fctx.fillRect(x - 10, y - 9 * h, 20, 5 * h);
      fctx.fillStyle = '#444'; fctx.fillRect(x - 10, y - 9 * h, 20, 1);
      fctx.fillStyle = '#c42020'; fctx.fillRect(x - 10, y - 4 * h, 20, 3);
    }

    function render() {
      if (!bg) buildBg(0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(bg, 0, 0);
      var t = g.t, night = bgPhase === 3;
      // Blinklicht Fernsehturm
      if (Math.floor(performance.now() / 600) % 2) { ctx.fillStyle = '#ff3040'; ctx.fillRect(win.x + Math.round(win.w * 0.18), win.y + win.h - 57, 2, 1); }
      // Espresso mit Dampf
      var ex = 30, ey = deskTop + 13;
      ctx.fillStyle = '#f4f4f4'; ctx.fillRect(ex, ey, 7, 5); ctx.fillRect(ex + 7, ey + 1, 2, 2); ctx.fillStyle = '#3a2010'; ctx.fillRect(ex + 1, ey, 5, 1);
      ctx.fillStyle = '#e8e8e8'; ctx.fillRect(ex - 2, ey + 5, 11, 1);
      ctx.fillStyle = 'rgba(255,255,255,.45)';
      for (var s = 0; s < 3; s++) { var sy = (performance.now() / 90 + s * 5) % 14; ctx.fillRect(ex + 2 + Math.round(Math.sin(sy * 0.6 + s) * 1.5), ey - 2 - sy, 1, 1); }
      if (night) { ctx.fillStyle = 'rgba(10,14,40,.25)'; ctx.fillRect(0, 0, IW, deskTop - 36); }
      // Matteo
      var spr = Sprites.matteo(g.mood);
      var bob = g.running && Math.floor(t * 2.2) % 2 ? 1 : 0;
      var hopY = g.hop > 0 ? -Math.round(Math.sin((g.hop / 0.18) * Math.PI) * 6) : 0;
      var bx = g.bonk > 0 ? Math.round(Math.sin(g.bonk * 60) * 2) : 0;
      var feet = deskTop + 12;
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(mx - 13, feet - 1, 26, 3); ctx.fillRect(mx - 10, feet + 2, 20, 1);
      Pixel.draw(ctx, spr, mx - 16 + bx, feet - 56 + hopY + bob, 2);
      // Namensschild vorne
      var nt = 'KANZLER MATTEO', nw = Pixel.textWidth(nt, 1) + 8;
      var nx = mx - Math.round(nw / 2), ny = deskTop + 15;
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(nx, ny, nw, 9); ctx.fillStyle = '#c9a24a'; ctx.fillRect(nx, ny, nw, 1); ctx.fillRect(nx, ny + 8, nw, 1);
      Pixel.text(ctx, nt, nx + 4, ny + 2, 1, '#e8c86a');
      // Papierkugeln in den Korb
      var bin = binPos();
      g.balls.forEach(function (b) {
        var k = Math.min(1, b.t / b.dur);
        var x = lerp(b.x0, bin.x + 9, k), y = lerp(b.y0, bin.y + 2, k) - Math.sin(k * Math.PI) * 50;
        ctx.fillStyle = '#e8e0c8'; ctx.fillRect(Math.round(x) - 3, Math.round(y) - 3, 6, 6);
        ctx.fillStyle = '#c9bf9f'; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 2, 1); ctx.fillRect(Math.round(x) + 1, Math.round(y) + 1, 2, 1);
      });
      // Papierkorb
      var wob = g.binWob > 0 ? Math.round(Math.sin(g.binWob * 50)) : 0;
      ctx.fillStyle = '#3a3f46'; ctx.fillRect(bin.x + wob, bin.y, 18, 18);
      ctx.fillStyle = '#5a616b'; for (var mxx = 2; mxx < 18; mxx += 3) ctx.fillRect(bin.x + wob + mxx, bin.y + 2, 1, 15);
      ctx.fillStyle = '#7a828c'; ctx.fillRect(bin.x + wob - 1, bin.y, 20, 2);
      fctx.clearRect(0, 0, IW, IH);
      fctx.imageSmoothingEnabled = false;
      // Stempel-Effekte
      g.fx.forEach(function (f) {
        var k = f.t / 0.08;
        var y = f.t < 0.08 ? lerp(f.y - 40, f.y, k * k) : f.t < 0.2 ? f.y : lerp(f.y, f.y - 30, (f.t - 0.2) / 0.22);
        fctx.globalAlpha = f.t > 0.3 ? Math.max(0, 1 - (f.t - 0.3) / 0.12) : 1;
        drawStamp(Math.round(f.x), Math.round(y), f.t >= 0.08 && f.t < 0.14);
        fctx.globalAlpha = 1;
      });
      // Partikel
      g.parts.forEach(function (q) { fctx.fillStyle = q.c; fctx.fillRect(Math.round(q.x), Math.round(q.y), 1, 1); });
      // HUD
      if (g.running || g.over) {
        Pixel.text(fctx, String(g.score), Math.round(IW / 2), 4 + (IW < 200 ? 14 : 0), 3, '#000000', 'center');
        Pixel.text(fctx, String(g.score), Math.round(IW / 2), 3 + (IW < 200 ? 14 : 0), 3, '#ffd23f', 'center');
        if (mult() > 1) Pixel.text(fctx, 'KOMBO X' + mult(), Math.round(IW / 2), 21 + (IW < 200 ? 14 : 0), 1, '#ff9a3f', 'center');
        var hx = IW - Math.ceil(62 / S) - 27;
        for (var hI = 0; hI < 3; hI++) Pixel.draw(fctx, hI < g.lives ? heartFull : heartEmpty, hx + hI * 9, 6, 1);
      }
      g.pops.forEach(function (q) {
        var y = Math.round(q.y - q.t * 24);
        Pixel.text(fctx, q.txt, Math.round(q.x), y + 1, 1, '#000', 'center');
        Pixel.text(fctx, q.txt, Math.round(q.x), y, 1, q.col, 'center');
      });
    }

    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render();
      raf = requestAnimationFrame(tick);
    }

    // ---------------- Bildschirme ----------------
    function intro() {
      ovl.hidden = false;
      ovl.innerHTML =
        '<div class="px-panel"><h2>KANZLERAMT<br>08:00 UHR</h2>' +
        '<p>Bundeskanzler Matteo steht auf seinem Schreibtisch. Von überall fliegen fremde Meinungen rein.</p>' +
        '<p><b>Tippe sie an</b>, um sie mit dem Stempel abzulehnen.</p>' +
        '<div class="mt-leg">' +
        '<span style="background:#7c7262">ANTRAG</span><div>1× stempeln</div>' +
        '<span style="background:#e8343f">EILANTRAG</span><div>schnell, 1× stempeln</div>' +
        '<span style="background:#2f4a8a">GESETZ</span><div>2× stempeln</div>' +
        '<span style="background:#2f9a4c">MATTEO-MEINUNG</span><div>nicht anfassen!</div></div>' +
        '<div class="reihe"><button class="px-btn" data-act="go">SITZUNG ERÖFFNEN</button></div></div>';
    }
    function go() {
      reset(); ovl.hidden = true; ovl.innerHTML = '';
      g.running = true;
      setMood('angry', 1); say('MEINUNGEN? NÖ.', 1.4);
      Pixel.sfx.tone(392, 0.1, 'square', 0.05); Pixel.sfx.tone(523, 0.16, 'square', 0.05, null, 0.1);
    }
    function gameOver() {
      if (g.over) return;
      g.running = false; g.over = true; g.mood = 'shock';
      g.papers.forEach(function (p) { if (p.state === 'fly') finish(p, 'ablage', 0); });
      var best = +Pixel.get(BEST_KEY, 0), neu = g.score > best;
      if (neu) Pixel.set(BEST_KEY, g.score);
      Pixel.sfx.tone(392, 0.2, 'square', 0.06, 196); Pixel.sfx.tone(262, 0.4, 'square', 0.06, 130, 0.2);
      ovl.hidden = false;
      ovl.innerHTML =
        '<div class="px-panel"><h2>MISSTRAUENS-<br>VOTUM!</h2>' +
        '<p>Matteo wurde aus dem Amt gewählt.</p>' +
        '<div class="mt-stats"><span>Punkte</span><b>' + g.score + '</b>' +
        '<span>Abgelehnt</span><b>' + g.stamped + '</b>' +
        '<span>Beste Kombo</span><b>' + g.bestCombo + '</b>' +
        '<span>Rekord</span><b>' + Math.max(best, g.score) + (neu ? ' ★' : '') + '</b></div>' +
        '<div class="reihe"><button class="px-btn" data-act="go">NEUE AMTSZEIT</button>' +
        '<button class="px-btn alt" data-act="exit">MENÜ</button></div></div>';
    }

    function onClick(e) {
      var b = e.target.closest && e.target.closest('[data-act]');
      if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'go') go();
      if (a === 'exit') { stop(); onExit(); }
      if (a === 'ton') { Pixel.setMuted(!Pixel.isMuted()); tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊'; }
    }
    function onKey(e) { if (e.key === 'Escape') { stop(); onExit(); } if ((e.key === 'Enter' || e.key === ' ') && !ovl.hidden) { e.preventDefault(); go(); } }

    function stop() {
      alive = false;
      cancelAnimationFrame(raf);
      root.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
    }
    function onResize() { resize(); }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    root.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    resize(); reset(); intro();
    last = performance.now();
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.matteo = { start: start };
})();
