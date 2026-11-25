// Yassin: Pencil-Dieb – 2D-Pixel-Spiel am Doppeltisch.
// Yassin sitzt neben Paul und will dessen Pencil. Hand rüberschieben, Pencil schnappen, ins Mäppchen damit –
// aber nur, solange Paul woanders hinschaut. Wird Yassin erwischt, gibt es nur einen Ausweg: den Pencil vernichten.
// Steuern: Leertaste/Maus/Taste halten = Hand rüber bzw. mit Pencil zurück · loslassen = Hand weg.
// Zerstörungs-Minispiele: Leertaste hämmern, ←/→ abwechselnd oder im richtigen Moment drücken.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.yassin.best';
  var SW0 = 180, SH0 = 140, YX = 30, YY = 56, PX = 116, PY = 56, TISCH = 92;
  var HAND0 = { x: 58, y: 102 }, PENCIL = { x: 100, y: 104 }, MAEPPCHEN = { x: 40, y: 104 };
  var METHODEN = [
    { id: 'brechen', name: 'DURCHBRECHEN!', hilfe: 'LEERTASTE HÄMMERN!', art: 'mash', ziel: 14, zeit: 3.2 },
    { id: 'spitzer', name: 'ANSPITZEN BIS NIX MEHR DA IST!', hilfe: '← → ABWECHSELND!', art: 'wechsel', ziel: 16, zeit: 3.6 },
    { id: 'fenster', name: 'AUS DEM FENSTER!', hilfe: 'IM GRÜNEN BEREICH DRÜCKEN!', art: 'timing', zeit: 4 },
    { id: 'beissen', name: 'DURCHBEISSEN!', hilfe: 'LEERTASTE HÄMMERN!', art: 'mash', ziel: 18, zeit: 3.2 },
    { id: 'glas', name: 'INS WASSERGLAS!', hilfe: 'DRÜCKEN, WENN ER ÜBERM GLAS IST!', art: 'timing', zeit: 4 },
    { id: 'kleben', name: 'MIT KLEBER ZUKLEISTERN!', hilfe: '← → ABWECHSELND!', art: 'wechsel', ziel: 14, zeit: 3.4 }
  ];
  var PAUL_ERWISCHT = ['Ey! Mein Pencil!', 'YASSIN?!', 'Gib her, Bruder!', 'Ich seh dich!'];
  var PAUL_KAPUTT = ['MEIN PENCIL!!', 'Das waren 130 Euro, Bruder!', 'Ich hab den grad erst gekauft!', 'Wieso machst du das?!', 'Bist du komplett lost?!'];
  var YASSIN_KAPUTT = ['Der war schon kaputt.', 'Ups.', 'Ich wollte nur gucken.', 'Physik, Bruder.', 'Kann passieren.', 'Ist doch nur ein Stift.'];
  var PAUL_SUCHT = ['Wo ist mein Pencil?!', 'Hä? Der lag doch grad hier.', 'Hast du meinen Pencil gesehen?'];
  var YASSIN_SUCHT = ['Keine Ahnung, Bruder.', 'Welcher Pencil?', 'Vielleicht runtergefallen?'];
  var ERSATZ = ['Gut, dass ich Ersatz hab.', 'Noch einen hab ich.', 'Der letzte, ich schwör.'];

  var CSS = [
    '.ys{position:absolute;inset:0;overflow:hidden;background:#2a2a30;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.ys>canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.ys-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.ys-top button{pointer-events:auto}',
    '.ys-hud{flex:1;display:flex;gap:8px;justify-content:center;padding:0 8px;opacity:0;transition:opacity .4s}',
    '.ys-hud.an{opacity:1}',
    '.ys-bar{width:min(30vw,170px);background:rgba(20,20,26,.85);border:3px solid #fff;padding:4px 7px 6px;box-shadow:3px 3px 0 rgba(0,0,0,.4)}',
    '.ys-bar small{display:flex;justify-content:space-between;font:8px/1 "Press Start 2P",monospace;margin-bottom:4px;gap:6px}',
    '.ys-bar b{display:block;font:12px/1.2 "Press Start 2P",monospace;color:#ffd23f;padding-top:1px}',
    '.ys-bar .geduld{font:13px/1 "Press Start 2P",monospace;color:#e8303a;letter-spacing:2px}',
    '.ys-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:4px 8px;font-size:15px;white-space:nowrap;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:ysPop .15s}',
    '.ys-blase.rot{background:#ffe0e0}',
    '.ys-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:inherit;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes ysPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.ys-meldung{position:absolute;left:50%;top:calc(50% + 50px);transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;white-space:nowrap;z-index:19}',
    '.ys-meldung b{display:block;font:clamp(13px,3.8vw,22px)/1.2 "Press Start 2P",monospace;color:#ffd23f;text-shadow:3px 3px 0 #000}',
    '.ys-meldung small{display:block;font-size:17px;text-shadow:2px 2px 0 #000;margin-top:8px}',
    '.ys-meldung.zeigen{animation:ysMeld 1.6s ease-out}',
    '@keyframes ysMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0}}',
    '.ys-qte{position:absolute;left:50%;top:calc(64px + env(safe-area-inset-top));transform:translateX(-50%);z-index:22;width:min(440px,92vw);background:#14141a;border:3px solid #e8303a;',
    ' box-shadow:5px 5px 0 rgba(0,0,0,.5);padding:8px 10px;text-align:center;display:none}',
    '.ys-qte.an{display:block;animation:ysPop2 .2s}',
    '@keyframes ysPop2{from{transform:translate(-50%,-20px);opacity:0}}',
    '.ys-qte b{display:block;font:clamp(11px,3vw,15px)/1.4 "Press Start 2P",monospace;color:#e8303a}',
    '.ys-qte small{display:block;font:9px/1.6 "Press Start 2P",monospace;color:#ffd23f;margin:4px 0}',
    '.ys-qte .leiste{height:10px;background:#2a2a32;border:2px solid #fff;margin-top:4px;position:relative}',
    '.ys-qte .leiste i{position:absolute;left:0;top:0;bottom:0;background:#e8303a;font-style:normal}',
    '.ys-qte .zeit{height:4px;background:#ffd23f;margin-top:5px}',
    '.ys-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;align-items:flex-end;padding:0 12px calc(12px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.ys-pad.an{display:flex}',
    '.ys-pad div{display:flex;gap:10px}',
    '.ys-pad button{pointer-events:auto;width:72px;height:72px;border-radius:50%;border:3px solid rgba(255,255,255,.8);background:rgba(20,20,26,.5);color:#fff;font:18px/1 "Press Start 2P",monospace;touch-action:none}',
    '.ys-pad button[data-pad=go]{width:110px;height:110px;font-size:10px;line-height:1.4}',
    '.ys-pad button.gedrueckt{background:rgba(255,210,63,.55)}',
    '.ys-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,14,.55);z-index:40;padding:16px;overflow:auto}',
    '.ys-ovl.aus{display:none}',
    '.ys-karte{width:min(470px,100%);background:#f4f2ea;color:#14141a;border:4px solid #14141a;box-shadow:8px 8px 0 #e8303a;padding:16px 18px;text-align:center;margin:auto}',
    '.ys-karte h1{margin:4px 0 4px;font:clamp(16px,4.6vw,24px)/1.25 "Press Start 2P",monospace;color:#c8282a}',
    '.ys-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.ys-karte .figs{display:flex;justify-content:center;gap:12px;margin:4px 0}',
    '.ys-karte .figs canvas{width:64px;height:auto;image-rendering:pixelated}',
    '.ys-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.ys-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(20,20,26,.3);padding:6px 0;font-size:18px;gap:10px}',
    '.ys-karte .zeile b{font:12px/1.5 "Press Start 2P",monospace;color:#c8282a;text-align:right}',
    '.ys-karte .zitat{font-size:18px;margin:6px 0}',
    '.ys-karte .px-btn{width:100%;margin-top:8px}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="ys"><canvas></canvas>' +
      '<div class="ys-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="ys-hud" data-el="hud">' +
          '<div class="ys-bar"><small><span>PAULS GEDULD</span></small><span class="geduld" data-el="geduld">♥♥♥</span></div>' +
          '<div class="ys-bar"><small><span>PUNKTE</span><span data-el="beute">✎0</span></small><b data-el="punkte">0</b></div>' +
        '</div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="ys-meldung" data-el="meldung"></div>' +
      '<div class="ys-qte" data-el="qte"></div>' +
      '<div class="ys-pad" data-el="pad"><div><button data-pad="l" aria-label="Links">◀</button><button data-pad="r" aria-label="Rechts">▶</button></div>' +
        '<button data-pad="go" aria-label="Klauen (halten)">KLAUEN<br>(HALTEN)</button></div>' +
      '<div class="ys-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.ys'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), qteEl = $('qte'), pad = $('pad'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now(), meldT = 0, timeouts = [];
    var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    function spaeter(fn, ms) { var id = setTimeout(function () { if (alive) fn(); }, ms); timeouts.push(id); }

    // ---------- Layout ----------
    var S = 3, IW = 0, IH = 0, OX = 0, OY = 0;
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight;
      S = Math.max(2, Math.floor(Math.min(SW / 128, (SH - (touch ? 170 : 60)) / 140)));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      OX = Math.floor((IW - SW0) / 2);
      OY = Math.max(Math.ceil(64 / S), Math.floor((IH - SH0) / 2) - (touch ? Math.round(60 / S) : 0));
      OY = Math.min(OY, Math.max(0, IH - SH0));
    }
    function links() { return -OX; }
    function rechts() { return IW - OX; }

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = { modus: 'intro', t: 0, punkte: 0, geduld: 3, beute: 0, zerstoert: 0, methodenListe: [], stufe: 0, ausgewichen: 0,
        p: 0, hatPencil: false, paul: { z: 'zeichnet', t: 2.5, fake: false }, ymood: 'neutral', ymoodT: 0, pmoodT: 0, pmood: null,
        qte: null, szene: null, teile: [], blasen: [], ende: false, pencilDa: true, erwischtCd: 0 };
    }
    function melde(txt, klein) {
      var el = $('meldung'); el.className = 'ys-meldung'; el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1600);
    }
    function sag(wer, txt, dauer, rot) {
      g.blasen = g.blasen.filter(function (b) { if (b.wer === wer) { b.el.remove(); return false; } return true; });
      var el = document.createElement('div'); el.className = 'ys-blase' + (rot ? ' rot' : ''); el.textContent = txt; wrap.appendChild(el);
      g.blasen.push({ wer: wer, el: el, t: dauer || 1.6 });
    }
    function blasenPos(b) {
      var x = b.wer === 'paul' ? PX + 16 : YX + 16, y = PY - 4;
      var hb = b.el.offsetWidth / 2 + 4;
      b.el.style.left = clamp((OX + x) * S, hb, wrap.clientWidth - hb) + 'px';
      b.el.style.top = Math.max(b.el.offsetHeight + 66, (OY + y) * S) + 'px';
    }
    function setY(m, t) { g.ymood = m; g.ymoodT = t || 0; }

    // ---------- Eingabe ----------
    var halten = { taste: false, maus: false, pad: false };
    function haelt() { return halten.taste || halten.maus || halten.pad; }
    function allesLos() { halten = { taste: false, maus: false, pad: false }; pad.querySelectorAll('.gedrueckt').forEach(function (b) { b.classList.remove('gedrueckt'); }); }
    function qteDruck(art) {
      var q = g.qte; if (!q || q.fertig) return;
      if (q.m.art === 'mash' && art === 'go') { q.n++; q.wackel = 0.12; Pixel.sfx.tone(180 + q.n * 14, 0.04, 'square', 0.04); }
      else if (q.m.art === 'wechsel' && (art === 'l' || art === 'r') && art !== q.letzte) { q.letzte = art; q.n++; q.wackel = 0.1; Pixel.sfx.noise(0.04, 0.05, art === 'l' ? 2400 : 3400); }
      else if (q.m.art === 'timing' && art === 'go') {
        var d = Math.abs(q.pos - q.mitte);
        q.ergebnis = d < q.breite * 0.25 ? 1 : d < q.breite * 0.5 ? 0.7 : 0.25; q.fertig = true;
        Pixel.sfx.tone(q.ergebnis >= 0.7 ? 660 : 220, 0.12, 'square', 0.05, q.ergebnis >= 0.7 ? 990 : 160);
        qteAbschluss();
      }
      if (q.m.art !== 'timing' && q.n >= q.m.ziel) { q.ergebnis = 1; q.fertig = true; qteAbschluss(); }
    }
    var CODES = { Space: 'go', Enter: 'go', KeyW: 'go', ArrowUp: 'go', ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r' };
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel' && g.modus !== 'qte') { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } } return; }
      var a = CODES[e.code]; if (!a) return; e.preventDefault();
      if (g.modus === 'qte') { if (!e.repeat) qteDruck(a); return; }
      if (a === 'go') halten.taste = true;
    }
    function ku(e) { if (CODES[e.code] === 'go') halten.taste = false; }
    cv.addEventListener('pointerdown', function (e) {
      if (touch) return;
      if (g.modus === 'spiel') { e.preventDefault(); halten.maus = true; }
      else if (g.modus === 'qte') { e.preventDefault(); qteDruck(g.qte && g.qte.m.art === 'wechsel' ? (e.clientX < wrap.clientWidth / 2 ? 'l' : 'r') : 'go'); }
    });
    function mausLos() { halten.maus = false; }
    window.addEventListener('pointerup', mausLos);
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-pad]'); if (!b) return; e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (x) {}
      b.classList.add('gedrueckt');
      var a = b.getAttribute('data-pad');
      if (g.modus === 'qte') qteDruck(a); else if (a === 'go') halten.pad = true;
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) {
      pad.addEventListener(n, function (e) { var b = e.target.closest('[data-pad]'); if (!b) return; b.classList.remove('gedrueckt'); if (b.getAttribute('data-pad') === 'go') halten.pad = false; });
    });

    // ---------- Paul ----------
    function paulGuckt() { return g.paul.z === 'schaut'; }
    function paulPencilInHand() { return g.paul.z === 'zeichnet' && g.pencilDa && !g.hatPencil; }
    function paulNaechster() {
      var pa = g.paul, st = g.stufe;
      if (pa.z === 'warn') {
        if (pa.fake) { pa.z = pick(['handy', 'fenster']); pa.t = rnd(1.2, 2.6); return; }
        pa.z = 'schaut'; pa.t = rnd(1.1, 1.8 + st * 0.1); return;
      }
      if (pa.z === 'schaut') { pa.z = 'zeichnet'; pa.t = rnd(1.4, 2.6); return; }
      if (pa.z === 'zeichnet') { pa.z = pick(['handy', 'fenster', 'handy']); pa.t = rnd(2.2, 4.2) / (1 + st * 0.08); return; }
      // aus handy/fenster: gleich wird geguckt oder er zeichnet weiter
      if (Math.random() < 0.55 + Math.min(0.3, st * 0.05)) { pa.z = 'warn'; pa.t = Math.max(0.38, 0.75 - st * 0.05); pa.fake = st >= 1 && Math.random() < 0.25; }
      else { pa.z = 'zeichnet'; pa.t = rnd(1.2, 2.4); }
    }

    // ---------- Klauen ----------
    function erwischt() {
      g.modus = 'qte'; allesLos(); g.hatPencil = true; g.pencilDa = false;
      setY('panik', 99); g.pmood = 'wut'; g.pmoodT = 99;
      sag('paul', pick(PAUL_ERWISCHT), 1.4, true);
      Pixel.sfx.tone(220, 0.15, 'square', 0.06); Pixel.sfx.tone(165, 0.3, 'square', 0.06, null, 0.15);
      var m = METHODEN[Math.floor(Math.random() * METHODEN.length)];
      if (g.methodenListe.length < METHODEN.length) { var neu = METHODEN.filter(function (x) { return g.methodenListe.indexOf(x.id) < 0; }); if (neu.length && Math.random() < 0.7) m = pick(neu); }
      spaeter(function () { qteStart(m); }, 700);
    }
    function qteStart(m) {
      g.qte = { m: m, n: 0, t: m.zeit, letzte: null, pos: 0, phase: rnd(0, 6), mitte: rnd(0.3, 0.7), breite: 0.28 - Math.min(0.1, g.stufe * 0.015), tempo: 3 + g.stufe * 0.3, wackel: 0, fertig: false, ergebnis: 0, anim: 0 };
      setY('grins', 99);
      qteEl.innerHTML = '<b>' + m.name + '</b><small>' + m.hilfe + '</small>' + (m.art === 'timing' ? '<div class="leiste" data-el="ql"><i data-el="qz"></i><i data-el="qn" style="width:3px;background:#fff"></i></div>' : '<div class="leiste"><i data-el="qf"></i></div>') + '<div class="zeit" data-el="qt"></div>';
      if (m.art === 'timing') { var z = $('qz'); z.style.left = ((g.qte.mitte - g.qte.breite / 2) * 100) + '%'; z.style.width = (g.qte.breite * 100) + '%'; z.style.background = '#3ac84a'; }
      qteEl.classList.add('an');
      melde('ERWISCHT!', 'Beweise vernichten!');
    }
    function qteAbschluss() {
      var q = g.qte, m = q.m, e = q.ergebnis;
      q.fertig = true; q.anim = 0;
      var pkt = Math.round((e >= 1 ? 160 : e >= 0.7 ? 110 : e > 0 ? 50 : 20) * (1 + g.stufe * 0.15));
      g.punkte += pkt; g.zerstoert++; if (g.methodenListe.indexOf(m.id) < 0) g.methodenListe.push(m.id);
      var text = e >= 1 ? 'TOTAL ZERSTÖRT!' : e >= 0.7 ? 'GUT ZERSTÖRT' : e > 0 ? 'NUR HALB KAPUTT' : 'KAUM KAPUTT';
      if (m.id === 'fenster') text = Math.round(e * 40 + rnd(0, 5)) + ' M WEIT!';
      melde(text, '+' + pkt + ' Zerstörungs-Kunst');
      zerstoerEffekt(m.id, e);
      Pixel.sfx.noise(0.25, 0.12, 1500);
      spaeter(function () { qteEl.classList.remove('an'); sag('paul', pick(PAUL_KAPUTT), 1.6, true); g.pmood = 'schock'; g.pmoodT = 1.6; }, 400);
      spaeter(function () { sag('yassin', pick(YASSIN_KAPUTT), 1.6); setY('unschuldig', 1.6); }, 1300);
      spaeter(function () {
        g.geduld--; g.qte = null; g.hatPencil = false;
        if (g.geduld <= 0) { ende(); return; }
        g.pmood = null; g.pmoodT = 0; ersatzPencil();
        g.modus = 'spiel'; g.p = 0; g.paul = { z: 'zeichnet', t: rnd(2.5, 3.5) }; g.erwischtCd = 1.5;
      }, 3000);
    }
    function zerstoerEffekt(id, e) {
      var cx = 80, cy = 82, farben = ['#f2f2f2', '#d8d8d8', '#8a8a8a'];
      var n = id === 'spitzer' ? 18 : id === 'kleben' ? 10 : 12;
      for (var i = 0; i < n; i++) {
        var f = id === 'spitzer' ? (i % 2 ? '#e8c890' : '#f2f2f2') : id === 'kleben' ? '#f8f0d0' : pick(farben);
        g.teile.push({ x: cx + rnd(-6, 6), y: cy, vx: id === 'fenster' ? rnd(-90, -60) : rnd(-40, 40), vy: id === 'glas' ? rnd(-10, 0) : rnd(-60, -20), t: 0, f: f, w: id === 'brechen' && i < 2 ? 7 : 2 });
      }
    }
    function ersatzPencil() {
      g.pencilDa = true;
      sag('paul', pick(ERSATZ), 1.6);
    }
    function geklaut() {
      g.hatPencil = false; g.beute++; g.p = 0;
      var pkt = Math.round(100 * (1 + g.stufe * 0.2)); g.punkte += pkt;
      melde('GEKLAUT!', '+' + pkt + ' · ab ins Mäppchen');
      Pixel.sfx.tone(523, 0.08, 'square', 0.05); Pixel.sfx.tone(659, 0.08, 'square', 0.05, null, 0.08); Pixel.sfx.tone(784, 0.15, 'square', 0.05, null, 0.16);
      setY('stolz', 1.2);
      g.stufe = Math.floor(g.beute / 2);
      g.modus = 'suche'; g.paul = { z: 'sucht', t: 3 };
      spaeter(function () { sag('paul', pick(PAUL_SUCHT), 1.6); g.pmood = 'schock'; g.pmoodT = 1.4; }, 500);
      spaeter(function () { sag('yassin', pick(YASSIN_SUCHT), 1.4); setY('unschuldig', 1.4); }, 1500);
      spaeter(function () { g.pmood = null; ersatzPencil(); g.modus = 'spiel'; g.paul = { z: 'zeichnet', t: rnd(2, 3) }; if (g.beute % 2 === 0) melde('LEVEL ' + (g.stufe + 1), 'Paul wird misstrauischer'); }, 3000);
    }

    // ---------- Update ----------
    function update(dt) {
      g.t += dt;
      g.blasen = g.blasen.filter(function (b) { b.t -= dt; if (b.t <= 0) { b.el.remove(); return false; } return true; });
      g.teile = g.teile.filter(function (x) { x.t += dt; x.vy += 120 * dt; x.x += x.vx * dt; x.y += x.vy * dt; if (x.y > TISCH + 12) { x.y = TISCH + 12; x.vy *= -0.3; x.vx *= 0.6; } return x.t < 2.2; });
      if (g.ymoodT > 0 && g.ymoodT < 50) { g.ymoodT -= dt; if (g.ymoodT <= 0) g.ymood = 'neutral'; }
      if (g.pmoodT > 0 && g.pmoodT < 50) { g.pmoodT -= dt; if (g.pmoodT <= 0) g.pmood = null; }
      g.erwischtCd = Math.max(0, g.erwischtCd - dt);

      if (g.modus === 'qte') {
        var q = g.qte; if (!q) return;
        q.wackel = Math.max(0, q.wackel - dt); q.anim += dt;
        if (!q.fertig) {
          q.t -= dt;
          if (q.m.art === 'timing') { q.phase += dt * q.tempo; q.pos = 0.5 + 0.5 * Math.sin(q.phase); var qn = $('qn'); if (qn) qn.style.left = (q.pos * 100) + '%'; }
          else { var qf = $('qf'); if (qf) qf.style.width = Math.min(100, q.n / q.m.ziel * 100) + '%'; }
          var qt = $('qt'); if (qt) qt.style.width = Math.max(0, q.t / q.m.zeit * 100) + '%';
          if (q.t <= 0) { q.ergebnis = q.m.art === 'timing' ? 0 : q.n / q.m.ziel * 0.8; qteAbschluss(); }
        }
        return;
      }
      if (g.modus !== 'spiel') return;

      // Paul
      var pa = g.paul; pa.t -= dt;
      if (pa.t <= 0) {
        var vorher = pa.z; paulNaechster();
        if (vorher === 'schaut' && g.p < 0.1 && !g.hatPencil) { g.ausgewichen++; g.punkte += 10; }
      }
      if (paulGuckt() && g.erwischtCd <= 0 && (g.p > 0.1 || g.hatPencil)) { erwischt(); return; }

      // Yassins Hand
      var h = haelt();
      if (!g.hatPencil) {
        if (h && !paulPencilInHand()) g.p = Math.min(1, g.p + dt * (0.75 + g.stufe * 0.03));
        else g.p = Math.max(0, g.p - dt * 2.6);
        if (h && paulPencilInHand() && g.p > 0.8) { g.p = 0.8; }
        if (g.p >= 1 && g.pencilDa && !paulPencilInHand()) { g.hatPencil = true; g.pencilDa = false; Pixel.sfx.tone(880, 0.05, 'square', 0.04); }
        setY(g.p > 0.05 ? 'rechts' : (paulGuckt() ? 'unschuldig' : g.ymoodT > 0 ? g.ymood : 'neutral'), g.ymoodT > 0 ? g.ymoodT : 0);
      } else {
        if (h) g.p = Math.max(0, g.p - dt * (0.62 + g.stufe * 0.02));
        setY('rechts');
        if (g.p <= 0) geklaut();
      }
    }

    // ---------- Zeichnen ----------
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x), Math.round(OY + y), Math.round(w), Math.round(h)); }
    function strich(x0, y0, x1, y1, w, c) {
      var n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
      for (var i = 0; i <= n; i++) R(x0 + (x1 - x0) * i / n - w / 2, y0 + (y1 - y0) * i / n - w / 2, w, w, c);
    }
    function raum(t) {
      ctx.fillStyle = '#d8d0b8'; ctx.fillRect(0, 0, IW, IH);
      R(links(), 0, rechts() - links(), 6, '#c8c0a8');
      // Tafel
      R(44, 6, 92, 26, '#5a3a22'); R(46, 8, 88, 22, '#2f5a46');
      Pixel.text(ctx, 'BIO-TEST', OX + 50, OY + 11, 1, '#f4f4ee'); R(50, 19, 40, 1, '#c8d8c8'); R(50, 23, 56, 1, '#c8d8c8');
      Pixel.text(ctx, 'HANDYS WEG', OX + 92, OY + 11, 1, '#f2d84a');
      // Fenster links
      var fx = Math.max(links() + 2, 0);
      R(fx, 14, 22, 40, '#f4f4ee'); R(fx + 2, 16, 18, 36, '#9ad0f2'); R(fx + 2, 40, 18, 12, '#6aa85a'); R(fx + 10, 16, 2, 36, '#f4f4ee');
      if (g.szeneFenster > 0) R(fx + 2, 16, 18, 36, 'rgba(255,255,255,.4)');
      // Mitschüler hinten (Silhouetten)
      [[8, 0], [150, 2], [158, 1]].forEach(function (p) { if (p[0] < links() - 10 || p[0] > rechts()) return; Pixel.draw(ctx, Sprites.junge(p[1], 'vorne'), OX + p[0], OY + 60, 1); });
    }
    function tisch() {
      R(links(), TISCH, rechts() - links(), 4, '#e8dcc0'); R(links(), TISCH + 4, rechts() - links(), IH, '#c8b490');
      R(links(), TISCH + 4, rechts() - links(), 1, 'rgba(0,0,0,.15)'); R(88, TISCH + 4, 1, 40, 'rgba(0,0,0,.12)');
      // Pauls Tablet
      R(110, TISCH + 2, 40, 16, '#1a1a20'); R(112, TISCH + 4, 36, 12, g.paul.z === 'zeichnet' ? '#f4f2ea' : '#2a3a5a');
      if (g.paul.z === 'zeichnet') { R(116, TISCH + 7, 10, 1, '#3a6ac8'); R(118, TISCH + 9, 14, 1, '#3a6ac8'); R(122, TISCH + 11, 6, 1, '#e8303a'); }
      // Yassins Mäppchen
      R(MAEPPCHEN.x - 12, TISCH + 6, 26, 9, '#3a3a44'); R(MAEPPCHEN.x - 12, TISCH + 6, 26, 2, '#5a5a66'); R(MAEPPCHEN.x - 1, TISCH + 6, 2, 9, '#b8b8c0');
      if (g.beute > 0) Pixel.text(ctx, 'X' + g.beute, OX + MAEPPCHEN.x + 16, OY + TISCH + 8, 1, '#3a3a44');
      // Heft von Yassin
      R(60, TISCH + 6, 18, 12, '#f4f4ee'); R(60, TISCH + 6, 2, 12, '#c83a3a');
    }
    function pencil(x, y, lang, winkel) {
      lang = lang == null ? 14 : lang;
      var dx = Math.cos(winkel || 0), dy = Math.sin(winkel || 0);
      for (var i = 0; i < lang; i++) R(x + dx * i, y + dy * i, 2, 2, i < 2 ? '#8a8a8a' : i === lang - 1 ? '#c8c8c8' : '#f6f6f2');
    }
    function figuren(t) {
      var pa = g.paul, pm = g.pmood;
      if (!pm) pm = pa.z === 'schaut' ? 'links' : pa.z === 'warn' ? (Math.floor(t * 8) % 2 ? 'links' : 'runter') : pa.z === 'fenster' ? 'rechts' : pa.z === 'sucht' ? 'schock' : 'runter';
      Pixel.draw(ctx, Sprites.paul(pm), OX + PX, OY + PY, 2);
      Pixel.draw(ctx, Sprites.yassin(g.modus === 'ende' ? 'panik' : g.ymood), OX + YX, OY + YY, 2);
    }
    function tischDinge(t) {
      var pa = g.paul;
      // Pauls Hände: zeichnen / Handy
      if (pa.z === 'zeichnet' && g.pencilDa && !g.hatPencil) { R(124, TISCH - 2, 6, 5, '#f2cfb8'); pencil(126, TISCH - 6, 10, 0.9); }
      if (pa.z === 'handy' || pa.z === 'warn' && !g.pmood) { R(118, TISCH - 6, 8, 12, '#141418'); R(119, TISCH - 5, 6, 9, Math.floor(t * 3) % 2 ? '#4ad8e8' : '#3ab0e8'); R(116, TISCH + 2, 12, 4, '#f2cfb8'); }
      if (pa.z === 'warn' && !g.pmood) { var hop = Math.floor(t * 6) % 2; Pixel.text(ctx, '?', OX + PX + 14, OY + PY - 13 - hop, 2, '#e8a020'); }
      if (pa.z === 'schaut' && !g.pmood) {
        Pixel.text(ctx, '!', OX + PX + 14, OY + PY - 13, 2, '#e8303a');
        var ph = Math.floor(t * 12) % 2; ctx.fillStyle = 'rgba(232,48,58,.8)';
        for (var i = 0; i < 18; i++) if ((i + ph) % 2) ctx.fillRect(Math.round(OX + PX + 8 - i * 3), Math.round(OY + PY + 16 + i * 1.2), 1, 1);
      }
      // Pencil auf dem Tisch
      if (g.pencilDa && !g.hatPencil && !paulPencilInHand()) pencil(PENCIL.x - 6, PENCIL.y, 14, 0);
      // Yassins Arm + Hand
      if (g.modus === 'spiel' || g.modus === 'suche') {
        var hx = lerp(HAND0.x, PENCIL.x - 2, g.p), hy = lerp(HAND0.y, PENCIL.y - 1, g.p) - Math.sin(g.p * Math.PI) * 4;
        strich(YX + 28, TISCH + 4, hx, hy, 4, '#9a9c98'); strich(YX + 28, TISCH + 4, hx, hy, 2, '#8a8c88');
        R(hx - 2, hy - 2, 6, 5, '#d8a682'); R(hx + 3, hy - 1, 2, 2, '#b88866');
        if (g.hatPencil) pencil(hx - 4, hy + 1, 14, 0);
        if (g.p > 0.05 && !g.hatPencil && paulPencilInHand()) Pixel.text(ctx, 'ER ZEICHNET!', OX + hx - 20, OY + hy - 10, 1, '#c8282a');
      } else {
        R(YX + 24, TISCH + 2, 6, 5, '#d8a682'); R(YX + 2, TISCH + 2, 6, 5, '#d8a682');
      }
    }
    function qteSzene(t) {
      var q = g.qte; if (!q) return;
      var cx = 80, cy = 82, w = q.wackel > 0 ? rnd(-1.5, 1.5) : 0, id = q.m.id, f = q.fertig ? 1 : (q.m.art === 'timing' ? 0 : q.n / q.m.ziel);
      R(cx - 30, cy - 16, 60, 26, 'rgba(255,255,255,.12)');
      if (q.fertig) {
        if (id === 'glas') { R(cx - 6, cy - 10, 12, 18, 'rgba(200,230,250,.6)'); R(cx - 5, cy - 2, 10, 9, 'rgba(90,160,230,.7)'); pencil(cx - 2, cy - 8, 12, 1.4); if (Math.floor(t * 6) % 2) R(cx + rnd(-3, 3), cy - 4, 2, 2, '#ffffff'); }
        else if (id === 'kleben') { R(cx - 9, cy - 3, 18, 6, '#f8f0d0'); R(cx - 9, cy - 3, 18, 1, '#ffffff'); }
        return;
      }
      if (id === 'brechen') { var knick = f * 0.9; pencil(cx - 12 + w, cy, 12, -knick); pencil(cx + w, cy, 12, knick); R(cx - 14, cy - 2, 5, 5, '#d8a682'); R(cx + 10, cy - 2, 5, 5, '#d8a682'); }
      else if (id === 'spitzer') { var l = Math.max(2, Math.round(16 - f * 14)); R(cx + 6, cy - 3, 8, 7, '#e8c040'); R(cx + 6, cy - 3, 8, 1, '#fff2a0'); pencil(cx + 6 - l + w, cy, l, 0); if (q.n && Math.floor(t * 20) % 2) R(cx + 14, cy + 2, 2, 2, '#e8c890'); }
      else if (id === 'beissen') { pencil(cx - 7, cy + w, 14, 0); for (var i = 0; i < Math.floor(f * 6); i++) R(cx - 6 + i * 2, cy - 1, 1, 1, '#8a8a8a'); }
      else if (id === 'kleben') { pencil(cx - 7, cy, 14, 0); R(cx - 9, cy - 3, Math.round(f * 18), 6, 'rgba(248,240,208,.9)'); R(cx + 14, cy - 8 + w, 5, 9, '#f8f8f8'); R(cx + 15, cy - 10, 3, 2, '#e8303a'); }
      else if (id === 'fenster') { var a = q.pos * 1.4 - 0.2; strich(cx + 6, cy + 6, cx + 6 - Math.cos(a) * 12, cy + 6 - Math.sin(a) * 12, 3, '#9a9c98'); pencil(cx + 6 - Math.cos(a) * 12 - 6, cy + 4 - Math.sin(a) * 12, 12, 0); }
      else if (id === 'glas') { var gx = cx - 18 + q.pos * 36; R(cx - 6, cy - 4, 12, 16, 'rgba(200,230,250,.6)'); R(cx - 5, cy + 3, 10, 8, 'rgba(90,160,230,.7)'); pencil(gx - 6, cy - 14, 12, 0); R(gx - 2, cy - 16, 4, 3, '#d8a682'); }
    }
    function render(t) {
      ctx.imageSmoothingEnabled = false;
      raum(t);
      figuren(t);
      tisch();
      tischDinge(t);
      if (g.modus === 'qte') qteSzene(t);
      g.teile.forEach(function (x) { ctx.globalAlpha = Math.max(0, 1 - x.t / 2.2); R(x.x, x.y, x.w, 2, x.f); ctx.globalAlpha = 1; });
    }
    function hud() {
      $('geduld').textContent = '♥♥♥'.slice(0, Math.max(0, g.geduld)) + '♡♡♡'.slice(0, 3 - Math.max(0, g.geduld));
      $('punkte').textContent = g.punkte; $('beute').textContent = '✎' + g.beute;
      var goBtn = pad.querySelector('[data-pad=go]');
      goBtn.innerHTML = g.modus === 'qte' ? (g.qte && g.qte.m.art === 'wechsel' ? '← →' : 'DRÜCK!') : g.hatPencil ? 'ZURÜCK<br>(HALTEN)' : 'KLAUEN<br>(HALTEN)';
      g.blasen.forEach(blasenPos);
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render(g.t); hud();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function bild(img) { var c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); return c; }
    function intro() {
      ovl.classList.remove('aus');
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="ys-karte"><h1>Pencil-Dieb</h1><div class="unter">Yassin will Pauls Pencil. Paul will seinen Pencil behalten. Nur einer kann gewinnen.</div>' +
        '<div class="figs" data-el="figs"></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>✋ <b>Leertaste</b> (oder Maus/KLAUEN) halten: Yassins Hand schleicht rüber. Mit Pencil halten = zurück ins Mäppchen.</li>' +
        '<li>👀 Zeigt Paul ein <b style="color:#e8a020">?</b>, guckt er gleich rüber – loslassen! Ist die Hand dann draußen oder der Pencil in deiner Hand: erwischt.</li>' +
        '<li>✏️ Solange Paul zeichnet, hat er den Pencil in der Hand – warten, bis er aufs Handy oder aus dem Fenster schaut.</li>' +
        '<li>💥 Erwischt? Beweise vernichten! Hämmern, ←/→ oder Timing – jedes Mal anders.</li>' +
        '<li>❤️ Dreimal erwischt, dann reicht’s Paul.</li></ul>' +
        '<button class="px-btn" data-act="los">Ganz unauffällig anfangen</button></div>';
      var f = $('figs'); f.appendChild(bild(Sprites.yassin('grins'))); f.appendChild(bild(Sprites.paul('runter')));
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.ende) { g.blasen.forEach(function (b) { b.el.remove(); }); reset(); }
      g.modus = 'spiel'; ovl.classList.add('aus'); $('hud').classList.add('an'); if (touch) pad.classList.add('an'); allesLos();
      melde('BIO-STUNDE', 'Paul hat einen neuen Pencil');
      spaeter(function () { sag('yassin', pick(['Schöner Pencil, Bruder.', 'Der gehört bald mir.', 'Ganz unauffällig, Yassin.']), 1.6); }, 700);
      Pixel.sfx.tone(392, 0.08, 'square', 0.05); Pixel.sfx.tone(523, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(659, 0.15, 'square', 0.05, null, 0.18);
    }
    function ende() {
      if (g.modus === 'ende') return;
      g.modus = 'ende'; g.ende = true; allesLos(); qteEl.classList.remove('an'); pad.classList.remove('an');
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best; if (neu) Pixel.set(BEST_KEY, g.punkte);
      g.pmood = 'wut'; g.pmoodT = 99; sag('paul', 'FRAU LEHRERIN!! YASSIN HAT …', 2.2, true);
      Pixel.sfx.tone(392, 0.3, 'triangle', 0.06, 370); Pixel.sfx.tone(349, 0.3, 'triangle', 0.06, 330, 0.3); Pixel.sfx.tone(294, 0.7, 'triangle', 0.06, 220, 0.6);
      var namen = { brechen: 'durchgebrochen', spitzer: 'weggespitzt', fenster: 'aus dem Fenster', beissen: 'durchgebissen', glas: 'versenkt', kleben: 'zugekleistert' };
      spaeter(function () {
        $('hud').classList.remove('an'); ovl.classList.remove('aus');
        ovl.innerHTML = '<div class="ys-karte"><h1>Paul reicht’s!</h1><div class="unter">Paul holt die Lehrerin. Yassin tut so, als wäre nichts gewesen.</div><div class="figs" data-el="figs"></div>' +
          '<div class="zitat"><b>Yassin:</b> „Ich schwör, ich hab nix gemacht.“</div>' +
          '<div class="zeile"><span>Punkte</span><b>' + g.punkte + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Pencils im Mäppchen</span><b>' + g.beute + '</b></div>' +
          '<div class="zeile"><span>Pencils vernichtet</span><b>' + g.zerstoert + '</b></div>' +
          (g.methodenListe.length ? '<div class="zeile"><span>Methoden</span><b>' + g.methodenListe.map(function (m) { return namen[m]; }).join(', ') + '</b></div>' : '') +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte) + '</b></div>' +
          '<button class="px-btn" data-act="los">Nochmal klauen</button><button class="px-btn" data-act="exit" style="margin-top:8px">Menü</button></div>';
        var f = $('figs'); f.appendChild(bild(Sprites.yassin('unschuldig'))); f.appendChild(bild(Sprites.paul('wut')));
      }, 1800);
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
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('pointerup', mausLos);
      window.removeEventListener('resize', resize); window.removeEventListener('blur', allesLos);
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize); window.addEventListener('blur', allesLos);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__yassin = { g: function () { return g; }, halten: function () { return halten; }, qteDruck: qteDruck };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.yassin = { start: start };
})();
