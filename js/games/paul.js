// Paul: Zunge raus! – 2D-Pixel-Spiel in der Bar.
// Paul sitzt am Tresen und fängt mit seiner viel zu langen Zunge alles aus der Luft:
// seine kleinen weißen Päckchen, Gummibärchen, Kekse, Erdbeeren. Chili, Zitrone und Wespe lieber nicht.
// Zielen + schießen: Klick/Tippen auf die Stelle · Tastatur: A/D bzw. ←/→ zielen, Leertaste = Zunge raus.
// CHILL-Leiste sinkt ständig, Päckchen füllen sie am meisten. Chill 0 oder alle Herzen weg → vorbei.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.paul.best';
  var SW0 = 180, SH0 = 140, PX = 74, PY = 62, MX = 90, MY = 86, TRESEN = 114;

  // ---- Item-Sprites ----
  var ITEMS = {
    paeckchen: { rows: ['.WWWWW.', 'WWWWWWW', 'WwWWWWW', 'WWWWWwW', '.WWWWW.'], pal: { W: '#f6f6f2', w: '#d8d8d2' }, pkt: 25, chill: 22, gut: true },
    baer: { rows: ['X.....X', 'XXXXXXX', '.XeXeX.', 'XXXXXXX', 'XXxXXXX', '.XXXXX.', '.X...X.'], pal: null, pkt: 10, chill: 9, gut: true },
    keks: { rows: ['..CCCC..', '.CccccC.', 'CC....CC', 'Cc....cC', '.CccccC.', '..CCCC..'], pal: { C: '#d8a860', c: '#f0c880' }, pkt: 10, chill: 8, gut: true },
    erdbeere: { rows: ['..GGG..', '.GRGRG.', 'RRRRRRR', 'RyRRRyR', 'RRRRRRR', '.RyRRR.', '..RRR..', '...R...'], pal: { G: '#3aa84a', R: '#e8303a', y: '#f8e070' }, pkt: 15, chill: 10, gut: true },
    donut: { rows: ['..pppp..', '.pBpYpp.', 'pYp..pBp', 'pp....pp', 'pBp..pYp', '.ppYpBp.', '..pppp..'], pal: { p: '#f28ab8', B: '#3a8ae8', Y: '#f8e040' }, pkt: 20, chill: 12, gut: true },
    goldbaer: { rows: ['X.....X', 'XXXXXXX', '.XeXeX.', 'XXXXXXX', 'XXxXXXX', '.XXXXX.', '.X...X.'], pal: { X: '#ffd23f', x: '#fff2a0', e: '#a87a10' }, pkt: 100, chill: 35, gut: true, gold: true },
    espresso: { rows: ['.s.s...', '..s.s..', 'WWWWWW.', 'WccccWW', 'WWWWW.W', 'WWWWWW.', '.WWWW..'], pal: { W: '#f2f2ee', c: '#5a3418', s: '#c8c8c8' }, pkt: 15, chill: 6, gut: true, power: true },
    chili: { rows: ['......GG', '...RRRG.', '.RRRRR..', 'RRrRR...', 'RRR.....', '.R......'], pal: { R: '#e8301a', r: '#ff7a5a', G: '#3aa84a' }, schlecht: true },
    zitrone: { rows: ['..YYYY..', '.YYyYYYY', 'YYYYYYYY', 'YYYYYyYY', 'YYYYYYY.', '..YYYY..'], pal: { Y: '#f8e040', y: '#fff8b0' }, schlecht: true },
    wespe: { rows: ['..W..W..', '.WW..WW.', '..KYKYK.', '.KYKYKYE', '..KYKYK.', '......>.'], pal: { W: '#d8f0ff', K: '#141414', Y: '#f8c820', E: '#141414', '>': '#141414' }, schlecht: true }
  };
  var BAER_FARBEN = [
    { X: '#e8303a', x: '#ff8a8a', e: '#7a1010' }, { X: '#3ac84a', x: '#9af0a0', e: '#106a1a' },
    { X: '#f8a020', x: '#ffd890', e: '#8a4a00' }, { X: '#f8e040', x: '#fff8b0', e: '#8a7a00' }, { X: '#f2f2f2', x: '#ffffff', e: '#8a8a8a' }
  ];
  var LECKER = ['Mmmh!', 'Lecker!', 'Mehr!', 'Zunge raus!', 'Easy.', 'Gönn ich mir.'];
  var PAECKCHEN = ['Päckchen-Zeit.', 'Ahh, jetzt chill ich.', 'Genau das.', 'Läuft bei mir.'];

  var CSS = [
    '.pl{position:absolute;inset:0;overflow:hidden;background:#2a2a30;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.pl canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges;cursor:crosshair}',
    '.pl-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.pl-top button{pointer-events:auto}',
    '.pl-hud{flex:1;display:flex;gap:8px;justify-content:center;padding:0 8px;opacity:0;transition:opacity .4s}',
    '.pl-hud.an{opacity:1}',
    '.pl-bar{width:min(30vw,170px);background:rgba(20,20,26,.85);border:3px solid #fff;padding:4px 7px 6px;box-shadow:3px 3px 0 rgba(0,0,0,.4)}',
    '.pl-bar small{display:flex;justify-content:space-between;font:8px/1 "Press Start 2P",monospace;margin-bottom:4px;gap:6px}',
    '.pl-bar div{height:10px;background:#2a2a32;border:2px solid #000}',
    '.pl-bar div span{display:block;height:100%;width:100%;background:#7ad8e8;transition:width .15s}',
    '.pl-bar.knapp{animation:plWackel .12s infinite alternate}',
    '.pl-bar.info b{display:block;font:12px/1.2 "Press Start 2P",monospace;color:#f08a9a;padding-top:1px}',
    '@keyframes plWackel{from{transform:translateX(-2px)}to{transform:translateX(2px)}}',
    '.pl-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:4px 8px;font-size:15px;white-space:nowrap;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:plPop .15s}',
    '.pl-blase.rot{background:#ffe0e0}.pl-blase.gelb{background:#fff6c0}',
    '.pl-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:inherit;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes plPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.pl-meldung{position:absolute;left:50%;top:36%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;white-space:nowrap;z-index:19}',
    '.pl-meldung b{display:block;font:clamp(14px,4vw,24px)/1.2 "Press Start 2P",monospace;color:#f08a9a;text-shadow:3px 3px 0 #000}',
    '.pl-meldung small{display:block;font-size:17px;text-shadow:2px 2px 0 #000;margin-top:8px}',
    '.pl-meldung.zeigen{animation:plMeld 1.6s ease-out}',
    '@keyframes plMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0}}',
    '.pl-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,14,.55);z-index:40;padding:16px;overflow:auto}',
    '.pl-ovl.aus{display:none}',
    '.pl-karte{width:min(460px,100%);background:#f4f2ea;color:#14141a;border:4px solid #14141a;box-shadow:8px 8px 0 #f08a9a;padding:16px 18px;text-align:center;margin:auto}',
    '.pl-karte h1{margin:4px 0 4px;font:clamp(16px,4.6vw,24px)/1.25 "Press Start 2P",monospace;color:#c83a5a}',
    '.pl-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.pl-karte canvas{position:static;width:72px;height:auto;margin:4px auto;cursor:default}',
    '.pl-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.pl-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(20,20,26,.3);padding:6px 0;font-size:18px}',
    '.pl-karte .zeile b{font:12px/1.5 "Press Start 2P",monospace;color:#c83a5a}',
    '.pl-karte .zitat{font-size:18px;margin:6px 0}',
    '.pl-karte .px-btn{width:100%;margin-top:8px}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function itemBild(typ, farbe) {
    var d = ITEMS[typ], pal = d.pal || BAER_FARBEN[farbe % BAER_FARBEN.length];
    return Pixel.sprite('paul-item-' + typ + (d.pal ? '' : '-' + (farbe % BAER_FARBEN.length)), d.rows, pal);
  }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="pl"><canvas></canvas>' +
      '<div class="pl-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="pl-hud" data-el="hud">' +
          '<div class="pl-bar" data-el="chillBox"><small><span>CHILL</span><span data-el="herzen">♥♥♥</span></small><div><span data-el="chill"></span></div></div>' +
          '<div class="pl-bar info"><small><span>PUNKTE</span><span data-el="combo"></span></small><b data-el="punkte">0</b></div>' +
        '</div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="pl-meldung" data-el="meldung"></div>' +
      '<div class="pl-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.pl'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now(), meldT = 0, timeouts = [];
    function spaeter(fn, ms) { var id = setTimeout(function () { if (alive) fn(); }, ms); timeouts.push(id); }

    // ---------- Layout ----------
    var S = 3, IW = 0, IH = 0, OX = 0, OY = 0;
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight;
      S = Math.max(2, Math.floor(Math.min(SW / 130, (SH - 40) / 140)));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      OX = Math.floor((IW - SW0) / 2);
      OY = Math.max(Math.ceil(60 / S), Math.floor((IH - SH0) / 2));
      OY = Math.min(OY, Math.max(0, IH - SH0));
    }
    function links() { return -OX; }
    function rechts() { return IW - OX; }

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = { modus: 'intro', t: 0, punkte: 0, chill: 100, herzen: 3, combo: 0, gegessen: 0, paeckchen: 0, stufe: 0, spawnT: 0.6,
        items: [], partikel: [], blasen: [], ende: false,
        zunge: { z: 'ruhe', L: 0, dx: 0, dy: -1, item: null }, winkel: -Math.PI / 2, tastatur: false,
        mood: 'neutral', moodT: 0, sauer: 0, scharf: 0, dick: 0, turbo: 0 };
    }
    function melde(txt, klein) {
      var el = $('meldung'); el.className = 'pl-meldung'; el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1600);
    }
    function sag(txt, dauer, farbe) {
      g.blasen.forEach(function (b) { b.el.remove(); });
      var el = document.createElement('div'); el.className = 'pl-blase' + (farbe ? ' ' + farbe : ''); el.textContent = txt; wrap.appendChild(el);
      g.blasen = [{ el: el, t: dauer || 1.4 }];
    }
    function blasenPos(b) {
      var hb = b.el.offsetWidth / 2 + 4;
      b.el.style.left = clamp((OX + MX + 26) * S, hb, wrap.clientWidth - hb) + 'px';
      b.el.style.top = Math.max(b.el.offsetHeight + 64, (OY + PY + 4) * S) + 'px';
    }
    function setMood(m, t) { g.mood = m; g.moodT = t; }

    // ---------- Zunge ----------
    function maxLaenge() { return 104 + (g.turbo > 0 ? 26 : 0); }
    function tempo() { return (g.turbo > 0 ? 1.5 : 1) * (g.sauer > 0 ? 0.55 : 1) * (g.dick > 0 ? 0.6 : 1); }
    function schiessen(dx, dy) {
      var z = g.zunge; if (g.modus !== 'spiel' || z.z !== 'ruhe' || g.scharf > 0) return;
      var l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      if (dy > -0.12) { dy = -0.12; var n = Math.hypot(dx, dy); dx /= n; dy /= n; }
      z.dx = dx; z.dy = dy; z.z = 'raus'; z.L = 0; z.item = null;
      Pixel.sfx.tone(520, 0.08, 'square', 0.035, 900);
    }
    function zieleAuf(sx, sy) { schiessen(sx - MX, sy - MY); }

    // ---------- Eingabe ----------
    var tasten = { l: false, r: false };
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel') { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } } return; }
      var c = e.code;
      if (c === 'ArrowLeft' || c === 'KeyA') { tasten.l = true; g.tastatur = true; e.preventDefault(); }
      else if (c === 'ArrowRight' || c === 'KeyD') { tasten.r = true; g.tastatur = true; e.preventDefault(); }
      else if ((c === 'Space' || c === 'ArrowUp' || c === 'KeyW' || c === 'Enter') && !e.repeat) { e.preventDefault(); g.tastatur = true; schiessen(Math.cos(g.winkel), Math.sin(g.winkel)); }
    }
    function ku(e) { var c = e.code; if (c === 'ArrowLeft' || c === 'KeyA') tasten.l = false; if (c === 'ArrowRight' || c === 'KeyD') tasten.r = false; }
    function zeiger(e) {
      if (g.modus !== 'spiel') return;
      e.preventDefault();
      var r = cv.getBoundingClientRect(), sx = (e.clientX - r.left) / S - OX, sy = (e.clientY - r.top) / S - OY;
      g.tastatur = false; g.winkel = Math.atan2(Math.min(sy - MY, -6), sx - MX);
      zieleAuf(sx, sy);
    }
    function allesLos() { tasten = { l: false, r: false }; }

    // ---------- Spiel-Logik ----------
    function neuesItem() {
      var st = g.stufe, r = Math.random(), typ;
      var schlecht = Math.min(0.4, 0.22 + st * 0.02);
      if (r < 0.02) typ = 'goldbaer';
      else if (r < 0.05) typ = 'espresso';
      else if (r < 0.05 + schlecht) typ = pick(st < 1 ? ['chili', 'zitrone'] : ['chili', 'zitrone', 'wespe', 'wespe']);
      else if (r < 0.05 + schlecht + 0.22) typ = 'paeckchen';
      else typ = pick(['baer', 'baer', 'keks', 'erdbeere', 'donut']);
      var vonLinks = Math.random() < 0.5, it = { typ: typ, farbe: Math.floor(Math.random() * 5), t: 0, ph: rnd(0, 6), weg: false };
      var tempoX = rnd(26, 42) + st * 3;
      if (typ !== 'wespe' && Math.random() < 0.38) {
        // vom Tresen hochgeworfen
        it.art = 'wurf'; it.x = vonLinks ? links() + rnd(6, 30) : rechts() - rnd(6, 30); it.y = TRESEN;
        it.vx = (vonLinks ? 1 : -1) * rnd(16, 34); it.vy = -rnd(88, 112); it.grav = 70;
      } else {
        it.art = 'flug'; it.x = vonLinks ? links() - 8 : rechts() + 8; it.basisY = rnd(10, 66); it.y = it.basisY;
        it.vx = (vonLinks ? 1 : -1) * tempoX * (typ === 'wespe' ? 0.8 : 1); it.amp = typ === 'wespe' ? rnd(8, 14) : rnd(0, 6);
      }
      g.items.push(it);
    }
    function treffer(it) {
      var z = g.zunge, d = ITEMS[it.typ];
      if (it.typ === 'wespe') {
        // sticht sofort und fliegt weg
        g.herzen--; g.dick = 2.5; g.combo = 0; setMood('aua', 1.2); sag('AUA! Meine Zunge!', 1.4, 'rot');
        it.vx *= -1.6; it.art = 'flug'; it.basisY = it.y - 20; it.weg = true;
        z.z = 'rein';
        Pixel.sfx.tone(880, 0.05, 'sawtooth', 0.05, 1200); Pixel.sfx.tone(220, 0.25, 'square', 0.05, 110, 0.05);
        for (var i = 0; i < 6; i++) g.partikel.push({ x: MX + z.dx * z.L, y: MY + z.dy * z.L, vx: rnd(-30, 30), vy: rnd(-40, 0), t: 0, f: '#f8c820' });
        if (g.herzen <= 0) ende('herzen');
        return;
      }
      z.item = it; z.z = 'rein';
      g.items = g.items.filter(function (x) { return x !== it; });
      Pixel.sfx.tone(700, 0.04, 'square', 0.03);
    }
    function essen(it) {
      var d = ITEMS[it.typ];
      if (it.typ === 'chili') {
        g.herzen--; g.scharf = 1.6; g.combo = 0; setMood('scharf', 1.6); sag(pick(['SCHARF!!', 'WASSER!!', 'MEIN MUND BRENNT!']), 1.5, 'rot');
        Pixel.sfx.noise(0.5, 0.1, 700); Pixel.sfx.tone(300, 0.4, 'sawtooth', 0.05, 900);
        if (g.herzen <= 0) ende('herzen');
        return;
      }
      if (it.typ === 'zitrone') {
        g.sauer = 2.6; g.combo = 0; g.chill = Math.max(0, g.chill - 10); setMood('sauer', 2.2); sag(pick(['SAUUUER!', 'Bäh!', 'Wer wirft Zitronen?!']), 1.5, 'gelb');
        Pixel.sfx.tone(440, 0.3, 'triangle', 0.05, 330);
        return;
      }
      g.combo++; g.gegessen++;
      var mult = Math.min(5, 1 + Math.floor(g.combo / 4)), pkt = d.pkt * mult;
      g.punkte += pkt; g.chill = Math.min(100, g.chill + d.chill);
      g.partikel.push({ x: MX + 6, y: MY - 6, vx: 0, vy: -22, t: 0, txt: '+' + pkt });
      if (it.typ === 'paeckchen') { g.paeckchen++; setMood('happy', 0.9); if (Math.random() < 0.35) sag(pick(PAECKCHEN), 1.2); }
      else if (it.typ === 'goldbaer') { melde('GOLDBÄR!', '+' + pkt); setMood('happy', 1); }
      else if (it.typ === 'espresso') { g.turbo = 6; melde('TURBO-ZUNGE!', '6 Sekunden'); setMood('happy', 1); }
      else { setMood('happy', 0.6); if (Math.random() < 0.2) sag(pick(LECKER), 1); }
      Pixel.sfx.tone(523 + Math.min(g.combo, 12) * 40, 0.06, 'square', 0.04); Pixel.sfx.tone(784 + Math.min(g.combo, 12) * 40, 0.08, 'square', 0.04, null, 0.06);
      if (mult >= 2 && g.combo % 4 === 0) melde('COMBO x' + mult);
      var neu = Math.floor(g.gegessen / 12);
      if (neu > g.stufe) { g.stufe = neu; melde('LEVEL ' + (neu + 1), 'Mehr Zeug in der Luft'); }
    }

    function update(dt) {
      g.t += dt;
      g.blasen = g.blasen.filter(function (b) { b.t -= dt; if (b.t <= 0) { b.el.remove(); return false; } return true; });
      g.partikel = g.partikel.filter(function (p) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; if (!p.txt) p.vy += 80 * dt; return p.t < (p.txt ? 0.9 : 0.6); });
      if (g.moodT > 0) { g.moodT -= dt; if (g.moodT <= 0) g.mood = 'neutral'; }
      if (g.modus !== 'spiel') return;
      g.sauer = Math.max(0, g.sauer - dt); g.scharf = Math.max(0, g.scharf - dt); g.dick = Math.max(0, g.dick - dt); g.turbo = Math.max(0, g.turbo - dt);

      // Zielen per Tastatur
      var r = (tasten.r ? 1 : 0) - (tasten.l ? 1 : 0);
      if (r) g.winkel = clamp(g.winkel + r * 2.4 * dt, -Math.PI + 0.12, -0.12);

      // Chill sinkt
      g.chill -= (4.6 + g.stufe * 0.55) * dt;
      if (g.chill <= 0) { g.chill = 0; ende('chill'); return; }

      // Spawnen
      g.spawnT -= dt;
      if (g.spawnT <= 0) { neuesItem(); g.spawnT = Math.max(0.42, 1.15 - g.stufe * 0.07) * rnd(0.7, 1.25); }

      // Items bewegen
      g.items.forEach(function (it) {
        it.t += dt; it.x += it.vx * dt;
        if (it.art === 'wurf') { it.vy += it.grav * dt; it.y += it.vy * dt; }
        else it.y = it.basisY + Math.sin(it.t * (it.typ === 'wespe' ? 6 : 2.2) + it.ph) * it.amp;
      });
      g.items = g.items.filter(function (it) { return it.x > links() - 20 && it.x < rechts() + 20 && it.y < TRESEN + 4 && it.y > -40; });

      // Zunge
      var z = g.zunge, v = tempo();
      if (z.z === 'raus') {
        z.L += 290 * v * dt;
        var tx = MX + z.dx * z.L, ty = MY + z.dy * z.L;
        for (var i = 0; i < g.items.length; i++) {
          var it = g.items[i]; if (it.weg) continue;
          if (Math.abs(it.x - tx) < 10 && Math.abs(it.y - ty) < 10) { treffer(it); break; }
        }
        if (z.z === 'raus' && (z.L >= maxLaenge() || ty < -OY - 4)) z.z = 'rein';
      } else if (z.z === 'rein') {
        z.L -= 340 * v * dt;
        if (z.item) { z.item.x = MX + z.dx * z.L; z.item.y = MY + z.dy * z.L; }
        if (z.L <= 0) { z.L = 0; z.z = 'ruhe'; if (z.item) { var e = z.item; z.item = null; essen(e); } }
      }
    }

    // ---------- Zeichnen ----------
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x), Math.round(OY + y), Math.round(w), Math.round(h)); }
    function hintergrund(t) {
      ctx.fillStyle = '#3a3a42'; ctx.fillRect(0, 0, IW, IH);
      // Regale mit Tüten und Gläsern
      var x0 = links() - ((links() % 46) + 46) % 46;
      for (var x = x0; x < rechts(); x += 46) {
        for (var reihe = 0; reihe < 3; reihe++) {
          var y = 14 + reihe * 30;
          R(x, y + 22, 42, 2, '#141418');
          for (var k = 0; k < 4; k++) {
            var seed = Math.abs(Math.sin(x * 3.1 + reihe * 7.7 + k * 1.3)), bx = x + 2 + k * 10;
            if (seed < 0.45) { R(bx, y + 8, 8, 14, '#e8dcc4'); R(bx, y + 12, 8, 3, '#e8803a'); R(bx + 2, y + 6, 4, 2, '#d8ccb4'); }
            else if (seed < 0.75) { R(bx + 1, y + 12, 6, 10, '#c8862a'); R(bx + 1, y + 14, 6, 4, '#f8d040'); R(bx + 2, y + 10, 4, 2, '#d8d8d8'); }
            else { R(bx, y + 10, 8, 12, '#5a6a4a'); R(bx + 1, y + 13, 6, 4, '#f2f2ea'); }
          }
        }
        R(x - 1, 10, 1, 100, '#141418'); R(x + 42, 10, 1, 100, '#141418');
      }
      ctx.fillStyle = 'rgba(16,16,22,.5)'; ctx.fillRect(0, 0, IW, IH);
      // Lampe über Paul
      R(MX - 1, -OY, 2, OY + 8, '#141418'); R(MX - 9, 6, 18, 9, '#1e1e24'); R(MX - 8, 15, 16, 2, '#fff2c0');
      ctx.globalAlpha = 0.12 + Math.sin(t * 3) * 0.01; ctx.fillStyle = '#ffe8a0';
      ctx.beginPath(); ctx.moveTo((OX + MX - 8) * 1, (OY + 17)); ctx.lineTo(OX + MX + 8, OY + 17); ctx.lineTo(OX + MX + 40, OY + TRESEN); ctx.lineTo(OX + MX - 40, OY + TRESEN); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
    function tresen() {
      R(links(), TRESEN, rechts() - links(), 4, '#e8a83a'); R(links(), TRESEN + 4, rechts() - links(), IH, '#c8862a');
      R(links(), TRESEN + 4, rechts() - links(), 1, 'rgba(0,0,0,.2)');
      for (var x = links() - (((links() % 24) + 24) % 24); x < rechts(); x += 24) R(x, TRESEN + 6, 1, 30, 'rgba(0,0,0,.08)');
      // pinkes Tablett und grüne Flasche
      var fx = Math.min(rechts() - 14, 160);
      R(fx - 34, TRESEN - 2, 26, 3, '#e83a8a'); R(fx - 33, TRESEN - 3, 24, 1, '#f86aa8');
      R(fx, TRESEN - 26, 8, 26, '#2a7a3a'); R(fx + 2, TRESEN - 34, 4, 8, '#2a7a3a'); R(fx + 2, TRESEN - 36, 4, 2, '#c8c8c8'); R(fx + 1, TRESEN - 18, 6, 9, '#e8eef2'); R(fx + 2, TRESEN - 15, 4, 1, '#3a6ac8');
      R(fx + 1, TRESEN - 24, 1, 12, 'rgba(255,255,255,.35)');
      // Glas vor Paul
      R(PX + 30, TRESEN - 10, 7, 10, 'rgba(220,235,240,.5)'); R(PX + 31, TRESEN - 6, 5, 5, 'rgba(255,230,160,.6)');
    }
    function zunge(t) {
      var z = g.zunge; if (z.L <= 0) return;
      var n = Math.ceil(z.L), dick = g.dick > 0 ? 2 : 0, w = 3 + dick;
      for (var i = 0; i <= n; i += 1) {
        var x = MX + z.dx * i, y = MY + z.dy * i, wb = Math.sin(i * 0.25 - t * 20) * (z.z === 'raus' ? 0.6 : 0);
        R(x - w / 2 + wb, y - w / 2, w, w, '#e87a8a');
      }
      for (i = 2; i <= n; i += 1) R(MX + z.dx * i - 0.5, MY + z.dy * i - 0.5, 1, 1, '#c85a6a');
      var tx = MX + z.dx * z.L, ty = MY + z.dy * z.L;
      R(tx - 3 - dick / 2, ty - 3 - dick / 2, 6 + dick, 6 + dick, '#f08a9a'); R(tx - 2, ty - 2, 2, 1, '#ffc0c8');
    }
    function paul(t) {
      var mood = g.modus === 'ende' ? (g.endGrund === 'chill' ? 'sauer' : 'aua') : g.zunge.L > 0 ? 'offen' : g.mood;
      if (g.modus === 'intro') mood = 'zunge';
      var wipp = g.zunge.z === 'ruhe' && g.modus === 'spiel' ? Math.floor(t * 2) % 2 : 0;
      Pixel.draw(ctx, Sprites.paul(mood), OX + PX, OY + PY + wipp, 2);
      if (g.scharf > 0) for (var i = 0; i < 3; i++) { var f = (t * 8 + i) % 1; R(MX - 3 + rnd(-2, 2), MY - 2 + f * 0 - i * 3 - f * 6, 6 - f * 4, 3, i % 2 ? '#ff8a2a' : '#ffd23f'); }
      if (g.sauer > 0) { R(MX - 16, MY - 22, 2, 2, '#f8e040'); R(MX + 14, MY - 22, 2, 2, '#f8e040'); }
      if (g.turbo > 0 && Math.floor(t * 8) % 2) { R(MX - 18, MY - 30, 2, 6, '#ffd23f'); R(MX + 16, MY - 30, 2, 6, '#ffd23f'); }
    }
    function zielhilfe(t) {
      if (!g.tastatur || g.zunge.z !== 'ruhe' || g.modus !== 'spiel') return;
      var dx = Math.cos(g.winkel), dy = Math.sin(g.winkel), ph = Math.floor(t * 10) % 2;
      for (var i = 10; i < maxLaenge(); i += 4) if (((i / 4) + ph) % 2 < 1) R(MX + dx * i, MY + dy * i, 1, 1, 'rgba(255,255,255,.55)');
    }
    function render(t) {
      ctx.imageSmoothingEnabled = false;
      hintergrund(t);
      paul(t);
      zielhilfe(t);
      zunge(t);
      g.items.forEach(function (it) {
        var img = itemBild(it.typ, it.farbe), flip = it.vx < 0 && it.typ === 'wespe';
        if (it.typ === 'wespe' && Math.floor(t * 20) % 2) { R(it.x - 4, it.y - 8, 3, 2, '#ffffff'); R(it.x + 2, it.y - 8, 3, 2, '#ffffff'); }
        if (ITEMS[it.typ].gold || it.typ === 'paeckchen') { ctx.globalAlpha = 0.25 + Math.sin(t * 6 + it.ph) * 0.1; R(it.x - 10, it.y - 10, 20, 20, it.typ === 'paeckchen' ? '#ffffff' : '#ffd23f'); ctx.globalAlpha = 1; }
        Pixel.draw(ctx, img, OX + it.x - img.width, OY + it.y - img.height, 2, flip);
      });
      var zi = g.zunge.item; if (zi) { var im = itemBild(zi.typ, zi.farbe); Pixel.draw(ctx, im, OX + zi.x - im.width, OY + zi.y - im.height, 2); }
      tresen();
      g.partikel.forEach(function (p) {
        ctx.globalAlpha = Math.max(0, 1 - p.t / (p.txt ? 0.9 : 0.6));
        if (p.txt) Pixel.text(ctx, p.txt, OX + p.x, OY + p.y, 1, '#ffd23f', 'center'); else R(p.x, p.y, 2, 2, p.f);
        ctx.globalAlpha = 1;
      });
    }
    function hud() {
      $('chill').style.width = Math.max(0, g.chill) + '%';
      $('chillBox').classList.toggle('knapp', g.chill < 25 && g.modus === 'spiel');
      $('herzen').textContent = '♥♥♥'.slice(0, Math.max(0, g.herzen)) + '♡♡♡'.slice(0, 3 - Math.max(0, g.herzen));
      $('punkte').textContent = g.punkte;
      var mult = Math.min(5, 1 + Math.floor(g.combo / 4)); $('combo').textContent = mult > 1 ? 'X' + mult : '';
      g.blasen.forEach(blasenPos);
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render(g.t); hud();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function figur(mood) { var img = Sprites.paul(mood), c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); return c; }
    function intro() {
      ovl.classList.remove('aus');
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="pl-karte"><h1>Zunge raus!</h1><div class="unter">Paul hat die längste Zunge der Klasse. Und er weiß sie zu nutzen.</div><div data-el="fig"></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>👅 <b>Klick/Tippen</b> irgendwohin: Pauls Zunge schießt genau dahin. Tastatur: <b>←/→</b> zielen, <b>Leertaste</b>.</li>' +
        '<li>⬜ Seine kleinen <b>weißen Päckchen</b> bringen am meisten CHILL. Snacks gehen auch.</li>' +
        '<li>🌶️ Chili und 🐝 Wespe kosten ein Herz, 🍋 Zitrone macht die Zunge lahm. ☕ Espresso = Turbo-Zunge.</li>' +
        '<li>📉 CHILL sinkt ständig. Leer oder alle Herzen weg = vorbei.</li></ul>' +
        '<button class="px-btn" data-act="los">Zunge raus!</button></div>';
      ovl.querySelector('[data-el=fig]').appendChild(figur('zunge'));
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.ende) { g.blasen.forEach(function (b) { b.el.remove(); }); reset(); }
      g.modus = 'spiel'; ovl.classList.add('aus'); $('hud').classList.add('an'); allesLos();
      melde('BAR-ABEND', 'Paul hat Hunger');
      spaeter(function () { if (g.modus === 'spiel') sag('Zunge ist aufgewärmt.', 1.4); }, 600);
      Pixel.sfx.tone(392, 0.08, 'square', 0.05); Pixel.sfx.tone(523, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(659, 0.15, 'square', 0.05, null, 0.18);
    }
    function ende(grund) {
      if (g.modus === 'ende') return;
      g.modus = 'ende'; g.ende = true; g.endGrund = grund; g.zunge.z = 'rein'; allesLos();
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best; if (neu) Pixel.set(BEST_KEY, g.punkte);
      Pixel.sfx.tone(392, 0.3, 'triangle', 0.06, 370); Pixel.sfx.tone(349, 0.3, 'triangle', 0.06, 330, 0.3); Pixel.sfx.tone(294, 0.7, 'triangle', 0.06, 220, 0.6);
      spaeter(function () {
        $('hud').classList.remove('an'); ovl.classList.remove('aus');
        ovl.innerHTML = '<div class="pl-karte"><h1>' + (grund === 'chill' ? 'Chill ist alle' : 'Zunge kaputt') + '</h1><div class="unter">' +
          (grund === 'chill' ? 'Keine Päckchen, keine Snacks, keine Laune. Paul geht nach Hause.' : 'Zu viel Chili, zu viele Wespen. Die Zunge braucht Urlaub.') + '</div><div data-el="fig"></div>' +
          '<div class="zitat"><b>Paul:</b> „' + (grund === 'chill' ? 'Hat jemand noch ein Päckchen?' : 'Aua … aber war’s wert.') + '“</div>' +
          '<div class="zeile"><span>Punkte</span><b>' + g.punkte + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Gefangen</span><b>' + g.gegessen + '</b></div>' +
          '<div class="zeile"><span>Päckchen</span><b>' + g.paeckchen + '</b></div>' +
          '<div class="zeile"><span>Level</span><b>' + (g.stufe + 1) + '</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte) + '</b></div>' +
          '<button class="px-btn" data-act="los">Nochmal</button><button class="px-btn" data-act="exit" style="margin-top:8px">Menü</button></div>';
        ovl.querySelector('[data-el=fig]').appendChild(figur(grund === 'chill' ? 'sauer' : 'aua'));
      }, 1200);
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
      alive = false; cancelAnimationFrame(raf); clearTimeout(meldT); timeouts.forEach(clearTimeout);
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
      window.removeEventListener('resize', resize); window.removeEventListener('blur', allesLos);
      cv.removeEventListener('pointerdown', zeiger);
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize); window.addEventListener('blur', allesLos);
    cv.addEventListener('pointerdown', zeiger);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__paul = { g: function () { return g; }, zieleAuf: zieleAuf, schiessen: schiessen };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.paul = { start: start };
})();
