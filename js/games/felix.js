// Felix: Genosse Felix – 3D-Fressspiel (three.js).
// Felix ist Chef der UdSSR, schnappt der Bevölkerung das Essen weg und wächst mit jedem Bissen:
// erst Brot und Pelmeni, dann Ladas und Birken, Plattenbauten – und am Ende Kreml, Fernsehturm und Rakete.
// Alles, was kleiner als 72 % von Felix ist, wird gegessen; Größeres hält ihn auf.
// Steuern: WASD/Pfeiltasten oder ziehen (Maus/Finger). Ein Fünfjahresplan dauert 3 Minuten.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.felix.best';
  var W = 200;          // Stadt reicht von -W bis W
  var BL = 40;          // Straßenraster
  var PLAN = 180;       // Fünfjahresplan in Sekunden
  var START_G = 1.75;   // Startgröße in Metern
  var ESS = 0.72;       // Felix isst alles bis 72 % seiner Größe
  var PLATZ = 40;       // Roter Platz: |x|,|z| < PLATZ

  var CSS = [
    '.fx{position:absolute;inset:0;overflow:hidden;background:#1a1414;font-family:"Barlow Semi Condensed","Arial Narrow",Arial,sans-serif;color:#fff;touch-action:none;-webkit-user-select:none;user-select:none}',
    '.fx canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.fx-hud{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .5s}',
    '.fx-hud.an{opacity:1}',
    '.fx-groesse{position:absolute;left:calc(66px + env(safe-area-inset-left));top:calc(10px + env(safe-area-inset-top));text-shadow:0 2px 10px rgba(0,0,0,.5)}',
    '.fx-groesse small{display:block;font-size:12px;font-weight:800;letter-spacing:.16em;color:#f2c14e}',
    '.fx-groesse b{display:block;font-size:clamp(30px,7vw,48px);font-weight:800;line-height:.95}',
    '.fx-plan{position:absolute;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translateX(-50%) skewX(-8deg);background:#c8102e;border:3px solid #1a1414;',
    ' box-shadow:5px 5px 0 #1a1414;padding:5px 16px 7px;text-align:center;white-space:nowrap;min-width:190px}',
    '.fx-plan > *{transform:skewX(8deg)}',
    '.fx-plan small{display:block;font-size:11px;font-weight:800;letter-spacing:.18em;color:#f4ead2}',
    '.fx-plan b{font-size:clamp(17px,4vw,22px);font-weight:800;text-transform:uppercase}',
    '.fx-plan i{font-style:normal;font-weight:800;margin-left:10px;color:#f2c14e}',
    '.fx-plan i.knapp{color:#fff;animation:fxBlink .5s infinite alternate}',
    '.fx-plan div{height:5px;background:rgba(0,0,0,.35);margin-top:4px}',
    '.fx-plan div span{display:block;height:100%;background:#f2c14e;transition:width .3s linear}',
    '@keyframes fxBlink{to{opacity:.4}}',
    '.fx-ziel{position:absolute;left:50%;top:calc(84px + env(safe-area-inset-top));transform:translateX(-50%);font-size:clamp(14px,3.6vw,17px);font-weight:700;',
    ' white-space:nowrap;background:rgba(26,20,20,.6);padding:4px 12px;border-left:4px solid #f2c14e}',
    '.fx-meldung{position:absolute;left:50%;top:34%;transform:translate(-50%,-50%);text-align:center;opacity:0;white-space:nowrap}',
    '.fx-meldung b{display:inline-block;background:#c8102e;color:#f4ead2;border:3px solid #1a1414;box-shadow:6px 6px 0 #1a1414;padding:6px 18px 8px;',
    ' font-size:clamp(22px,5.6vw,40px);font-weight:800;text-transform:uppercase;transform:skewX(-8deg)}',
    '.fx-meldung small{display:block;margin-top:10px;font-size:clamp(14px,3.6vw,18px);font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.8)}',
    '.fx-meldung.zeigen{animation:fxPop 1.9s ease-out}',
    '@keyframes fxPop{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}10%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}82%{opacity:1}100%{opacity:0;transform:translate(-50%,-70%)}}',
    '.fx-tipp{position:absolute;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);font-size:clamp(13px,3.4vw,16px);font-weight:700;',
    ' white-space:nowrap;text-shadow:0 2px 8px rgba(0,0,0,.8);transition:opacity 1s}',
    '.fx-knopf{position:absolute;top:calc(12px + env(safe-area-inset-top));width:42px;height:42px;border:3px solid #1a1414;background:#c8102e;color:#f4ead2;',
    ' font:800 20px/1 sans-serif;cursor:pointer;z-index:20;box-shadow:3px 3px 0 #1a1414}',
    '.fx-stick{position:absolute;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;border:3px solid rgba(244,234,210,.55);background:rgba(26,20,20,.25);',
    ' pointer-events:none;display:none;z-index:12}',
    '.fx-stick i{position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;background:rgba(200,16,46,.85);border:3px solid #f4ead2}',
    '.fx-blase{position:absolute;pointer-events:none;background:#f4ead2;color:#1a1414;font-weight:800;font-size:15px;padding:3px 9px;border:2px solid #1a1414;',
    ' transform:translate(-50%,-100%);white-space:nowrap;opacity:0;transition:opacity .2s}',
    '.fx-ebene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:30;transition:opacity .45s}',
    '.fx-ebene.aus{opacity:0;pointer-events:none}',
    '@media (min-width:900px){.fx-ebene{justify-content:flex-start;padding-left:6vw}}',
    '@media (max-width:899px) and (orientation:portrait){.fx-ebene{align-items:flex-end;padding-bottom:calc(16px + env(safe-area-inset-bottom))}}',
    // Propagandaplakat
    '.fx-plakat{position:relative;width:min(480px,100%);background:#f4ead2;color:#1a1414;border:5px solid #1a1414;box-shadow:12px 12px 0 #c8102e,0 30px 80px rgba(0,0,0,.5)}',
    '.fx-plakat .kopf{position:relative;background:#c8102e;color:#f4ead2;padding:18px 22px 30px;clip-path:polygon(0 0,100% 0,100% 78%,0 100%)}',
    '.fx-plakat .kopf small{display:block;font-size:14px;font-weight:800;letter-spacing:.22em;color:#f2c14e}',
    '.fx-plakat h1{margin:2px 0 0;font-size:clamp(42px,10vw,66px);font-weight:800;line-height:.86;text-transform:uppercase}',
    '.fx-plakat .stern{position:absolute;right:18px;top:12px;font-size:52px;line-height:1;color:#f2c14e}',
    '.fx-plakat .innen{padding:4px 22px 20px}',
    '.fx-plakat .unter{font-size:18px;font-weight:700;margin:0 0 8px}',
    '.fx-plakat ul{margin:6px 0 12px;padding:0;list-style:none;font-size:16px;line-height:1.42;font-weight:600}',
    '.fx-plakat .zeile{display:flex;justify-content:space-between;border-top:2px solid rgba(26,20,20,.2);padding:6px 0;font-size:19px;font-weight:700}',
    '.fx-plakat .zeile b{font-size:23px;font-weight:800;color:#c8102e}',
    '.fx-btn{width:100%;border:3px solid #1a1414;background:#c8102e;color:#f4ead2;font-family:inherit;font-weight:800;font-size:25px;text-transform:uppercase;',
    ' padding:10px 16px;cursor:pointer;box-shadow:5px 5px 0 #1a1414;margin-top:6px}',
    '.fx-btn:active{transform:translate(3px,3px);box-shadow:2px 2px 0 #1a1414}',
    '.fx-btn.zweit{background:transparent;color:#1a1414;font-size:19px;padding:7px;box-shadow:none;margin-top:12px}',
    '@media (max-width:899px) and (orientation:portrait){.fx-plakat h1{font-size:40px}.fx-plakat ul{font-size:14px}.fx-plakat .innen{padding:4px 16px 16px}}',
    '@media (max-width:640px){.fx-plan{top:calc(62px + env(safe-area-inset-top))}.fx-ziel{top:calc(132px + env(safe-area-inset-top))}}',
    '.fx-fehler{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-size:20px;z-index:40;background:#1a1414}'
  ].join('\n');

  // Was es zu essen gibt. g = "Größe" (ab g / ESS Metern essbar).
  var TYPEN = {
    brot: { name: 'Brot', e: '🍞', g: 0.42, r: 0.3, art: 'snack' },
    kartoffel: { name: 'Kartoffel', e: '🥔', g: 0.3, r: 0.22, art: 'snack' },
    wurst: { name: 'Wurst', e: '🌭', g: 0.38, r: 0.25, art: 'snack' },
    borschtsch: { name: 'Borschtsch', e: '🍲', g: 0.45, r: 0.25, art: 'snack' },
    pelmeni: { name: 'Pelmeni', e: '🥟', g: 0.46, r: 0.3, art: 'snack' },
    kohl: { name: 'Kohl', e: '🥬', g: 0.44, r: 0.25, art: 'snack' },
    melone: { name: 'Melone', e: '🍉', g: 0.6, r: 0.32, art: 'snack' },
    gurke: { name: 'Gurke', e: '🥒', g: 0.32, r: 0.2, art: 'snack' },
    muell: { name: 'Mülltonne', e: '🗑️', g: 0.9, r: 0.4, art: 'ding' },
    bank: { name: 'Parkbank', e: '🪑', g: 1.0, r: 0.8, art: 'ding' },
    busch: { name: 'Busch', e: '🌿', g: 1.1, r: 0.7, art: 'ding' },
    laterne: { name: 'Laterne', e: '💡', g: 1.25, r: 0.3, art: 'ding' },
    stand: { name: 'Marktstand', e: '🥬', g: 1.55, r: 1.3, art: 'ding', frei: 'Marktstände sind jetzt Vorspeise!' },
    lada0: { name: 'Lada', e: '🚗', g: 2.1, r: 1.7, art: 'fahrzeug', frei: 'Ladas sind jetzt Snacks!' },
    lada1: { name: 'Lada', e: '🚗', g: 2.1, r: 1.7, art: 'fahrzeug' },
    lada2: { name: 'Lada', e: '🚗', g: 2.1, r: 1.7, art: 'fahrzeug' },
    lada3: { name: 'Lada', e: '🚗', g: 2.1, r: 1.7, art: 'fahrzeug' },
    kiosk: { name: 'Kiosk', e: '🏪', g: 2.4, r: 1.6, art: 'ding' },
    baum: { name: 'Birke', e: '🌳', g: 3.3, r: 0.6, art: 'ding', frei: 'Birken? Salat!' },
    bus: { name: 'Bus', e: '🚌', g: 3.7, r: 2.6, art: 'fahrzeug', frei: 'Busse freigegeben!' },
    tram: { name: 'Straßenbahn', e: '🚋', g: 4.3, r: 3, art: 'fahrzeug' },
    bueste: { name: 'Büste', e: '🗿', g: 4.5, r: 1.3, art: 'ding' },
    haus: { name: 'Bäckerei', e: '🏠', g: 8, box: [5, 4], art: 'bau', frei: 'Häuser stehen auf dem Speiseplan!' },
    mauer: { name: 'Kremlmauer', e: '🧱', g: 10, box: [6, 1.2], art: 'bau' },
    p5: { name: 'Plattenbau', e: '🏢', g: 15, box: [12, 5], art: 'bau', frei: 'Plattenbauten freigegeben!' },
    p9: { name: 'Hochhaus', e: '🏢', g: 22, box: [7, 7], art: 'bau' },
    denkmal: { name: 'Felix-Denkmal', e: '🗽', g: 24, r: 4.2, art: 'wahr', weg: 'Felix hat sein eigenes Denkmal gegessen.' },
    fabrik: { name: 'Brotfabrik', e: '🏭', g: 27, box: [13, 9], art: 'wahr', weg: 'Die ganze Brotfabrik – mit Brot!' },
    kirche: { name: 'Kathedrale', e: '⛪', g: 29, box: [8, 8], art: 'wahr', weg: 'Zwiebeltürme schmecken nach … Zwiebeln.' },
    turm: { name: 'Kremlturm', e: '🏰', g: 34, box: [3.6, 3.6], art: 'wahr', frei: 'Der Kreml wackelt …', weg: 'Kremlturm verputzt!' },
    zucker: { name: 'Zuckerbäcker-Hochhaus', e: '🏛️', g: 40, box: [13, 11], art: 'wahr', weg: 'Zuckerbäckerstil – schmeckt wie Torte.' },
    rakete: { name: 'Rakete', e: '🚀', g: 48, r: 7, art: 'wahr', weg: 'Raumfahrtprogramm: aufgegessen.' },
    tv: { name: 'Fernsehturm', e: '🗼', g: 56, r: 6, art: 'wahr', weg: 'Kein Fernsehen mehr. Nur noch Felix.' }
  };
  var SNACKS = ['brot', 'kartoffel', 'wurst', 'borschtsch', 'pelmeni', 'kohl', 'melone', 'gurke'];
  var LADAS = ['lada0', 'lada1', 'lada2', 'lada3'];

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function winkel(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
  function fmt(g) { return g < 10 ? g.toFixed(1).replace('.', ',') : String(Math.round(g)); }
  function daempf(dt, k) { return 1 - Math.exp(-dt * k); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="fx"><canvas></canvas>' +
      '<div class="fx-hud">' +
        '<div class="fx-groesse"><small>GRÖSSE</small><b data-el="groesse">1,8 m</b></div>' +
        '<div class="fx-plan"><small>FÜNFJAHRESPLAN</small><b data-el="jahr">Jahr 1/5</b><i data-el="uhr">3:00</i><div><span data-el="balken"></span></div></div>' +
        '<div class="fx-ziel" data-el="ziel"></div>' +
        '<div class="fx-meldung" data-el="meldung"></div>' +
        '<div class="fx-tipp" data-el="tipp">WASD / Pfeile laufen · oder ziehen</div>' +
      '</div>' +
      '<div class="fx-stick" data-el="stick"><i></i></div>' +
      '<div class="fx-blase" data-el="blase">Mein Brot!</div>' +
      '<button class="fx-knopf" style="left:calc(12px + env(safe-area-inset-left))" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
      '<button class="fx-knopf" style="right:calc(12px + env(safe-area-inset-right))" data-act="ton" aria-label="Ton an/aus"></button>' +
      '<div class="fx-ebene" data-el="ebene"></div></div>';
    root.appendChild(style);
    var box = root.querySelector('.fx'), canvas = root.querySelector('canvas');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var hud = root.querySelector('.fx-hud'), ebene = $('ebene'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0;

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); }
    catch (e) {
      box.insertAdjacentHTML('beforeend', '<div class="fx-fehler">Dein Browser konnte die 3D-Grafik nicht starten. Schließ andere Tabs mit 3D-Inhalten und lade neu.</div>');
      return function () {};
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    renderer.setPixelRatio(dpr);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    var HORIZONT = new THREE.Color('#d6e2ea');
    scene.fog = new THREE.Fog(HORIZONT, 90, 320);
    var cam = new THREE.PerspectiveCamera(50, 1, 0.2, 3000);

    // ---------- Hilfen ----------
    function farbe(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }
    function std(hex, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: farbe(hex), roughness: 0.82, metalness: 0 }, o || {})); }
    function canvasTex(w, h, paint, srgb) {
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      paint(c.getContext('2d'), w, h);
      var t = new THREE.CanvasTexture(c);
      if (srgb !== false) t.encoding = THREE.sRGBEncoding;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return t;
    }
    var glowTex = canvasTex(64, 64, function (x, w) {
      var gr = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, w, w);
    }, false);
    var BOX = function (w, h, d) { return new THREE.BoxGeometry(w, h, d); };
    var CYL = function (rt, rb, h, s) { return new THREE.CylinderGeometry(rt, rb, h, s || 12); };
    var SPH = function (r, ws, hs, a, b, c, d) { return new THREE.SphereGeometry(r, ws || 12, hs || 8, a, b, c, d); };
    var CONE = function (r, h, s) { return new THREE.ConeGeometry(r, h, s || 12); };
    function sternGeo(r, tiefe) {
      var s = new THREE.Shape();
      for (var i = 0; i < 10; i++) {
        var a = i / 10 * Math.PI * 2 + Math.PI / 2, rr = i % 2 ? r * 0.42 : r;
        if (i === 0) s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); else s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      var g = new THREE.ExtrudeGeometry(s, { depth: tiefe, bevelEnabled: false }); g.translate(0, 0, -tiefe / 2);
      return g;
    }
    function zwiebelGeo(r) {
      var pts = [[0, 0], [0.85, 0.05], [1.2, 0.45], [1.12, 0.85], [0.62, 1.32], [0.18, 1.72], [0.02, 2.1]].map(function (p) { return new THREE.Vector2(p[0] * r, p[1] * r); });
      return new THREE.LatheGeometry(pts, 18);
    }
    function streifen(a, b, n, dreh) { // Spiralstreifen für Zwiebeltürme
      return function (x, y, z) { return Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2) * n + y * (dreh || 0)) ) % 2 ? a : b; };
    }

    // Prototyp aus Teilen mit Vertexfarben: [geo, farbe|fn(x,y,z), x,y,z, rx,ry,rz, sx,sy,sz]
    var _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();
    function proto(teile) {
      var pos = [], nor = [], col = [];
      teile.forEach(function (t) {
        var g = t[0].index ? t[0].toNonIndexed() : t[0].clone(); t[0].dispose();
        var pa = g.attributes.position, fn = typeof t[1] === 'function' ? t[1] : null, cols = [];
        if (!fn) _c.copy(farbe(t[1]));
        for (var i = 0; i < pa.count; i++) { if (fn) _c.copy(farbe(fn(pa.getX(i), pa.getY(i), pa.getZ(i)))); cols.push(_c.r, _c.g, _c.b); }
        var sx = t[8] === undefined ? 1 : t[8];
        _p.set(t[2] || 0, t[3] || 0, t[4] || 0); _e.set(t[5] || 0, t[6] || 0, t[7] || 0); _q.setFromEuler(_e);
        _s.set(sx, t[9] === undefined ? sx : t[9], t[10] === undefined ? sx : t[10]);
        _m.compose(_p, _q, _s); g.applyMatrix4(_m);
        var na = g.attributes.normal;
        for (i = 0; i < pa.count; i++) { pos.push(pa.getX(i), pa.getY(i), pa.getZ(i)); nor.push(na.getX(i), na.getY(i), na.getZ(i)); }
        col.push.apply(col, cols);
        g.dispose();
      });
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      geo.computeBoundingSphere();
      return geo;
    }
    var vcMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0 });

    // ---------- Texturen für Gebäude und Boden ----------
    var plattenTex = canvasTex(256, 256, function (x, w, h) {
      x.fillStyle = '#cfc8b8'; x.fillRect(0, 0, w, h);
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
        var px = c * 64, py = r * 64;
        x.strokeStyle = 'rgba(90,80,70,.3)'; x.lineWidth = 2; x.strokeRect(px + 1, py + 1, 62, 62);
        x.fillStyle = Math.random() < 0.2 ? '#f0d48a' : (Math.random() < 0.5 ? '#3c4a58' : '#4c5c6c'); x.fillRect(px + 16, py + 18, 32, 26);
        x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(px + 18, py + 20, 8, 22);
        x.fillStyle = '#e8e2d6'; x.fillRect(px + 14, py + 44, 36, 4);
        if (Math.random() < 0.35) { x.fillStyle = Math.random() < 0.5 ? '#b8ae9c' : '#9aa8b0'; x.fillRect(px + 10, py + 48, 44, 14); }
      }
    });
    plattenTex.wrapS = plattenTex.wrapT = THREE.RepeatWrapping;
    var hausTex = canvasTex(512, 256, function (x, w, h) {
      // links: Vorderseite der Bäckerei, rechts: Seitenwand
      x.fillStyle = '#e6d6a6'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#c8102e'; x.fillRect(16, 26, 224, 52);
      x.fillStyle = '#f4ead2'; x.font = '800 46px "Barlow Semi Condensed",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('ХЛЕБ', 128, 54);
      x.fillStyle = '#4a5a68'; x.fillRect(24, 100, 130, 112);
      x.fillStyle = '#c47a34'; for (var b = 0; b < 4; b++) { x.beginPath(); x.ellipse(50 + b * 28, 190, 14, 9, 0, 0, 7); x.fill(); }
      x.fillStyle = '#6a3e22'; x.fillRect(176, 112, 56, 144);
      x.fillStyle = '#e6d6a6'; x.fillRect(256, 0, 256, h);
      for (var f = 0; f < 2; f++) { x.fillStyle = '#4a5a68'; x.fillRect(300 + f * 110, 70, 60, 70); x.fillStyle = '#f4ead2'; x.fillRect(296 + f * 110, 140, 68, 6); }
    });
    var blockTex = canvasTex(512, 512, function (x, w, h) {
      var u = w / BL; // Pixel pro Meter
      x.fillStyle = '#9e9a90'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 2500; i++) { var v = 140 + Math.random() * 30; x.fillStyle = 'rgba(' + v + ',' + v + ',' + (v - 8) + ',.35)'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      // Gehweg
      x.fillStyle = '#b4b0a8'; x.fillRect(0, 0, w, 5.6 * u); x.fillRect(0, h - 5.6 * u, w, 5.6 * u); x.fillRect(0, 0, 5.6 * u, h); x.fillRect(w - 5.6 * u, 0, 5.6 * u, h);
      // Straße
      x.fillStyle = '#45464c'; x.fillRect(0, 0, w, 4 * u); x.fillRect(0, h - 4 * u, w, 4 * u); x.fillRect(0, 0, 4 * u, h); x.fillRect(w - 4 * u, 0, 4 * u, h);
      x.fillStyle = '#5a5a60'; x.fillRect(0, 4 * u, w, 3); x.fillRect(0, h - 4 * u - 3, w, 3); x.fillRect(4 * u, 0, 3, h); x.fillRect(w - 4 * u - 3, 0, 3, h);
      // Mittellinie (die Hälfte liegt im Nachbarblock)
      x.fillStyle = '#e8e4d8';
      for (var d = 0; d < w; d += 3 * u) { x.fillRect(d, 0, 1.5 * u, 3); x.fillRect(d, h - 3, 1.5 * u, 3); x.fillRect(0, d, 3, 1.5 * u); x.fillRect(w - 3, d, 3, 1.5 * u); }
    });
    blockTex.wrapS = blockTex.wrapT = THREE.RepeatWrapping; blockTex.repeat.set(2 * W / BL, 2 * W / BL);
    var grasTex = canvasTex(128, 128, function (x, w, h) {
      x.fillStyle = '#6e9a4a'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 900; i++) { x.fillStyle = Math.random() < 0.5 ? 'rgba(40,80,20,.25)' : 'rgba(170,210,110,.25)'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    });
    grasTex.wrapS = grasTex.wrapT = THREE.RepeatWrapping;
    var pflasterTex = canvasTex(256, 256, function (x, w, h) {
      x.fillStyle = '#6a4a44'; x.fillRect(0, 0, w, h);
      for (var r = 0; r < 16; r++) for (var c = 0; c < 16; c++) {
        var v = 90 + Math.random() * 40; x.fillStyle = 'rgb(' + (v + 20) + ',' + (v - 10) + ',' + (v - 16) + ')';
        x.fillRect(c * 16 + (r % 2) * 8 + 1, r * 16 + 1, 14, 14);
      }
    });
    pflasterTex.wrapS = pflasterTex.wrapT = THREE.RepeatWrapping; pflasterTex.repeat.set(8, 8);

    // ---------- Himmel und Licht ----------
    var himmel = new THREE.Mesh(new THREE.SphereGeometry(2000, 24, 12), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { uZ: { value: farbe('#3f7fd4') }, uH: { value: HORIZONT.clone().convertSRGBToLinear() } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 uZ, uH; varying vec3 vD; void main(){ float y = max(vD.y, 0.0); gl_FragColor = vec4(mix(uH, uZ, pow(smoothstep(0.0, 0.7, y), 0.75)), 1.0); }'
    }));
    scene.add(himmel);
    scene.add(new THREE.HemisphereLight(0xd8e8ff, 0x8a7a60, 0.75));
    var sonne = new THREE.DirectionalLight(0xfff0d6, 1.2);
    var SONNE_DIR = new THREE.Vector3(0.55, 1, 0.4).normalize();
    sonne.castShadow = true; sonne.shadow.mapSize.set(2048, 2048); sonne.shadow.bias = -0.0005;
    scene.add(sonne); scene.add(sonne.target);

    // ---------- Boden ----------
    var aussen = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.MeshStandardMaterial({ map: grasTex, roughness: 1 }));
    grasTex.repeat.set(400, 400);
    aussen.rotation.x = -Math.PI / 2; aussen.position.y = -0.05; aussen.receiveShadow = true; scene.add(aussen);
    var stadt = new THREE.Mesh(new THREE.PlaneGeometry(2 * W, 2 * W), new THREE.MeshStandardMaterial({ map: blockTex, roughness: 0.95 }));
    stadt.rotation.x = -Math.PI / 2; stadt.receiveShadow = true; scene.add(stadt);
    var platzBoden = new THREE.Mesh(new THREE.PlaneGeometry(2 * PLATZ - 8, 2 * PLATZ - 8), new THREE.MeshStandardMaterial({ map: pflasterTex, roughness: 0.9 }));
    platzBoden.rotation.x = -Math.PI / 2; platzBoden.position.y = 0.03; platzBoden.receiveShadow = true; scene.add(platzBoden);
    var deko = new THREE.Group(); scene.add(deko); // Parkrasen, Gleise
    var parkGras = new THREE.MeshStandardMaterial({ map: grasTex.clone(), roughness: 1 }); parkGras.map.needsUpdate = true; parkGras.map.repeat.set(6, 6);
    var gleisM = std('#2a2a2e', { roughness: 0.5, metalness: 0.4 });
    [-120, 120].forEach(function (z) { [-0.75, 0.75].forEach(function (o) { var g = new THREE.Mesh(BOX(2 * W, 0.08, 0.14), gleisM); g.position.set(0, 0.04, z + o); deko.add(g); }); });

    // ---------- Prototypen ----------
    function lada(c) {
      return proto([
        [BOX(1.62, 0.62, 3.9), c, 0, 0.62, 0], [BOX(1.42, 0.55, 2.0), c, 0, 1.2, 0.15], [BOX(1.45, 0.4, 1.7), '#9ab8c8', 0, 1.22, 0.15],
        [BOX(1.66, 0.14, 0.1), '#d8d8d8', 0, 0.42, -1.97], [BOX(1.66, 0.14, 0.1), '#d8d8d8', 0, 0.42, 1.97],
        [CYL(0.12, 0.12, 0.06, 10), '#fff4c0', -0.55, 0.72, -1.96, Math.PI / 2], [CYL(0.12, 0.12, 0.06, 10), '#fff4c0', 0.55, 0.72, -1.96, Math.PI / 2],
        [CYL(0.32, 0.32, 0.26, 12), '#1a1a1a', -0.76, 0.32, -1.25, 0, 0, Math.PI / 2], [CYL(0.32, 0.32, 0.26, 12), '#1a1a1a', 0.76, 0.32, -1.25, 0, 0, Math.PI / 2],
        [CYL(0.32, 0.32, 0.26, 12), '#1a1a1a', -0.76, 0.32, 1.25, 0, 0, Math.PI / 2], [CYL(0.32, 0.32, 0.26, 12), '#1a1a1a', 0.76, 0.32, 1.25, 0, 0, Math.PI / 2]
      ]);
    }
    function mensch(mantel, kopfbedeckung) {
      return proto([
        [CYL(0.09, 0.08, 0.8, 6), '#2a2a32', -0.12, 0.4, 0], [CYL(0.09, 0.08, 0.8, 6), '#2a2a32', 0.12, 0.4, 0],
        [CYL(0.22, 0.32, 0.95, 10), mantel, 0, 1.22, 0], [CYL(0.07, 0.06, 0.62, 6), mantel, -0.3, 1.28, 0, 0, 0, -0.18], [CYL(0.07, 0.06, 0.62, 6), mantel, 0.3, 1.28, 0, 0, 0, 0.18],
        [SPH(0.17, 10, 8), '#f0c8a8', 0, 1.86, 0], [SPH(0.2, 10, 6, 0, Math.PI * 2, 0, 1.45), kopfbedeckung, 0, 1.9, 0]
      ]);
    }
    var PROTO = {
      brot: function () { return proto([[SPH(1, 14, 10), '#c47a34', 0, 0.11, 0, 0, 0, 0, 0.14, 0.12, 0.25], [BOX(0.16, 0.025, 0.035), '#ecc080', 0, 0.225, -0.08, 0, 0.4], [BOX(0.16, 0.025, 0.035), '#ecc080', 0, 0.23, 0, 0, 0.4], [BOX(0.16, 0.025, 0.035), '#ecc080', 0, 0.225, 0.08, 0, 0.4]]); },
      kartoffel: function () { return proto([[SPH(1, 10, 8), '#b88a52', 0, 0.1, 0, 0, 0, 0, 0.13, 0.1, 0.16]]); },
      wurst: function () { return proto([[CYL(0.065, 0.065, 0.3, 10), '#a3402c', 0, 0.07, 0, 0, 0, Math.PI / 2], [SPH(0.065, 8, 6), '#a3402c', -0.15, 0.07, 0], [SPH(0.065, 8, 6), '#a3402c', 0.15, 0.07, 0]]); },
      borschtsch: function () { return proto([[CYL(0.17, 0.15, 0.22, 16), '#e4e2da', 0, 0.11, 0], [CYL(0.155, 0.155, 0.02, 16), '#a8183a', 0, 0.215, 0], [SPH(0.05, 8, 6), '#fff8ee', 0.03, 0.225, 0.02, 0, 0, 0, 1, 0.45, 1], [BOX(0.42, 0.04, 0.05), '#c8c6be', 0, 0.18, 0]]); },
      pelmeni: function () {
        var t = [[CYL(0.22, 0.18, 0.03, 18), '#f4f4f0', 0, 0.015, 0]];
        for (var i = 0; i < 7; i++) { var a = i / 7 * Math.PI * 2; t.push([SPH(1, 8, 6), '#f2e2c0', Math.cos(a) * 0.12 * (i ? 1 : 0), 0.05, Math.sin(a) * 0.12 * (i ? 1 : 0), 0, a, 0, 0.06, 0.035, 0.045]); }
        t.push([SPH(0.02, 6, 4), '#4a8a3a', 0.05, 0.08, 0.02]);
        return proto(t);
      },
      kohl: function () { return proto([[SPH(0.17, 12, 10), '#8ab858', 0, 0.17, 0], [SPH(0.19, 10, 8, 0, Math.PI * 2, 1.2, 1.9), '#a8d070', 0, 0.17, 0]]); },
      melone: function () { return proto([[SPH(1, 16, 12), function (x, y) { return Math.floor((Math.atan2(y, x) + Math.PI) / (Math.PI / 7)) % 2 ? '#2a6a2a' : '#6aa83a'; }, 0, 0.2, 0, 0, 0, 0, 0.24, 0.2, 0.3]]); },
      gurke: function () { return proto([[CYL(0.05, 0.05, 0.24, 8), '#3a7a2a', 0, 0.05, 0, 0, 0, Math.PI / 2], [SPH(0.05, 6, 4), '#3a7a2a', -0.12, 0.05, 0], [SPH(0.05, 6, 4), '#3a7a2a', 0.12, 0.05, 0]]); },
      muell: function () { return proto([[CYL(0.32, 0.28, 0.85, 14), '#3a6a4a', 0, 0.425, 0], [CYL(0.35, 0.35, 0.07, 14), '#2a4a38', 0, 0.88, 0]]); },
      bank: function () {
        return proto([[BOX(1.6, 0.08, 0.45), '#8a5a32', 0, 0.46, 0], [BOX(1.6, 0.34, 0.06), '#8a5a32', 0, 0.72, 0.21, -0.15],
          [BOX(0.07, 0.46, 0.42), '#2a4a3a', -0.7, 0.23, 0], [BOX(0.07, 0.46, 0.42), '#2a4a3a', 0.7, 0.23, 0]]);
      },
      busch: function () { return proto([[SPH(0.6, 10, 8), '#4a8a3a', 0, 0.5, 0], [SPH(0.45, 8, 6), '#5a9a44', 0.4, 0.4, 0.15], [SPH(0.45, 8, 6), '#3f7a32', -0.35, 0.42, -0.1]]); },
      laterne: function () {
        return proto([[CYL(0.07, 0.11, 3.6, 8), '#3a3d44', 0, 1.8, 0], [BOX(0.08, 0.08, 0.8), '#3a3d44', 0, 3.55, 0.35],
          [CYL(0.18, 0.28, 0.2, 10), '#3a3d44', 0, 3.5, 0.75], [CYL(0.17, 0.17, 0.06, 10), '#fff2c0', 0, 3.39, 0.75]]);
      },
      stand: function () {
        var t = [[BOX(2.2, 0.1, 1.2), '#a87a4a', 0, 0.9, 0]];
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (p) { t.push([BOX(0.08, 0.9, 0.08), '#6a4a2a', p[0] * 1.0, 0.45, p[1] * 0.5]); t.push([CYL(0.04, 0.04, 1.6, 6), '#6a4a2a', p[0] * 1.15, 1.75, p[1] * 0.7]); });
        t.push([BOX(2.6, 0.1, 1.7), function (x) { return Math.floor((x + 1.3) / 0.325) % 2 ? '#c8102e' : '#f4ead2'; }, 0, 2.55, 0, 0.15]);
        t.push([BOX(0.55, 0.3, 0.45), '#c89a5a', -0.6, 1.1, 0], [BOX(0.55, 0.3, 0.45), '#c89a5a', 0.15, 1.1, -0.1]);
        t.push([SPH(0.22, 8, 6), '#d83a2a', -0.6, 1.3, 0, 0, 0, 0, 1.2, 0.6, 1], [SPH(0.22, 8, 6), '#7ab84a', 0.15, 1.3, -0.1, 0, 0, 0, 1.2, 0.6, 1], [SPH(0.2, 8, 6), '#e8b030', 0.75, 1.05, 0.1, 0, 0, 0, 1.2, 0.6, 1]);
        return proto(t);
      },
      kiosk: function () {
        return proto([[BOX(2.6, 2.4, 2.2), '#3a7aa8', 0, 1.2, 0], [BOX(2.62, 0.75, 2.22), '#bfe0f0', 0, 1.55, 0], [BOX(2.7, 0.45, 2.3), '#f2c14e', 0, 2.62, 0], [BOX(2.9, 0.15, 2.5), '#2a4a6a', 0, 2.92, 0]]);
      },
      lada0: function () { return lada('#e8e2d0'); }, lada1: function () { return lada('#b8302a'); },
      lada2: function () { return lada('#3a6a9a'); }, lada3: function () { return lada('#6a8a4a'); },
      bus: function () {
        var t = [[BOX(2.5, 2.6, 9), '#e8b830', 0, 1.65, 0], [BOX(2.52, 0.9, 8.6), '#3a4a5a', 0, 2.25, 0], [BOX(2.4, 0.15, 8.8), '#f0f0e8', 0, 3.0, 0], [BOX(2.54, 0.2, 9.02), '#c8102e', 0, 1.15, 0]];
        [-3, 3].forEach(function (z) { [-1.15, 1.15].forEach(function (x) { t.push([CYL(0.5, 0.5, 0.3, 12), '#1a1a1a', x, 0.5, z, 0, 0, Math.PI / 2]); }); });
        return proto(t);
      },
      tram: function () {
        var t = [[BOX(2.5, 3.0, 13), '#c8302e', 0, 1.9, 0], [BOX(2.52, 1.0, 12.6), '#f2e6c8', 0, 2.45, 0], [BOX(2.54, 0.72, 12.2), '#3a4a5a', 0, 2.48, 0],
          [BOX(2.2, 0.3, 12), '#d8d0c0', 0, 3.55, 0], [BOX(0.1, 1.1, 1.6), '#2a2a2a', 0, 4.2, 0, 0.5]];
        [-4.5, 4.5].forEach(function (z) { t.push([BOX(2.2, 0.5, 2.2), '#2a2a2a', 0, 0.3, z]); });
        return proto(t);
      },
      baum: function () {
        return proto([[CYL(0.18, 0.26, 4.2, 8), function (x, y) { return Math.sin(y * 9 + x * 25) > 0.72 ? '#2a2a2a' : '#f2f0ea'; }, 0, 2.1, 0],
          [SPH(1.5, 10, 8), '#6aa040', 0, 4.5, 0, 0, 0, 0, 1, 1.25, 1], [SPH(1.1, 8, 6), '#7ab84a', 0.8, 3.7, 0.4], [SPH(1.0, 8, 6), '#5a9038', -0.7, 3.9, -0.5]]);
      },
      bueste: function () {
        return proto([[BOX(1.6, 2, 1.6), '#8a8a88', 0, 1, 0], [SPH(1, 10, 8), '#8a6a30', 0, 2.35, 0, 0, 0, 0, 0.75, 0.45, 0.45],
          [SPH(0.42, 10, 8), '#9a7a3a', 0, 3.1, 0], [SPH(0.47, 10, 8, 0, Math.PI * 2, 0, 1.3), '#7a5a28', 0, 3.2, 0]]);
      },
      mauer: function () {
        var t = [[BOX(12, 6, 2), '#a8382e', 0, 3, 0], [BOX(12.1, 0.4, 2.1), '#8a2a22', 0, 0.2, 0]];
        for (var k = 0; k < 6; k++) { t.push([BOX(1.1, 1.4, 2.05), '#a8382e', -5.5 + k * 2.2, 6.7, 0]); t.push([BOX(0.35, 0.6, 2.06), '#7a2018', -5.5 + k * 2.2, 7.1, 0]); }
        return proto(t);
      },
      turm: function () {
        var t = [[BOX(7, 16, 7), '#a8382e', 0, 8, 0], [BOX(7.4, 0.6, 7.4), '#e8e2d6', 0, 16, 0], [CYL(1.6, 1.6, 0.2, 20), '#f4f0e0', 0, 12.5, 3.55, Math.PI / 2],
          [BOX(0.16, 1.2, 0.1), '#1a1a1a', 0, 12.9, 3.68], [BOX(0.9, 0.16, 0.1), '#1a1a1a', 0.35, 12.5, 3.68], [BOX(5, 6, 5), '#a8382e', 0, 19.3, 0],
          [CYL(2.1, 2.3, 4, 8), '#a8382e', 0, 24.2, 0], [CONE(2.7, 9, 8), '#2f6a4a', 0, 30.7, 0], [SPH(0.4, 8, 6), '#e8b84a', 0, 35.3, 0], [sternGeo(1.4, 0.4), '#e8203a', 0, 36.9, 0]];
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (p) { t.push([CYL(0.35, 0.35, 2.2, 6), '#a8382e', p[0] * 2.2, 23.3, p[1] * 2.2]); t.push([CONE(0.48, 1.3, 6), '#2f6a4a', p[0] * 2.2, 25.05, p[1] * 2.2]); });
        return proto(t);
      },
      kirche: function () {
        var t = [[BOX(16, 7, 16), '#b84a3a', 0, 3.5, 0], [BOX(16.3, 0.5, 16.3), '#f2ece0', 0, 7, 0], [BOX(16.3, 0.4, 16.3), '#f2ece0', 0, 3.2, 0],
          [CYL(3.2, 3.6, 12, 8), '#c85a40', 0, 13, 0], [CONE(3.4, 10, 8), streifen('#e8d8a0', '#3a7a4a', 8), 0, 24, 0], [zwiebelGeo(0.9), '#e8b84a', 0, 28.8, 0]];
        var farben = [['#c8102e', '#3a8a4a'], ['#2a6ab8', '#f4ead2'], ['#e8b830', '#3a8a4a'], ['#c8102e', '#f4ead2']];
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (p, n) {
          t.push([CYL(2, 2.2, 8, 12), '#d86a48', p[0] * 5, 11, p[1] * 5], [BOX(4.6, 0.4, 4.6), '#f2ece0', p[0] * 5, 7.4, p[1] * 5]);
          t.push([zwiebelGeo(2.1), streifen(farben[n][0], farben[n][1], 10, n % 2 ? 1.1 : 0), p[0] * 5, 15, p[1] * 5]);
        });
        [[0, -7], [0, 7], [-7, 0], [7, 0]].forEach(function (p, n) {
          t.push([CYL(1.3, 1.4, 6, 10), '#e07a52', p[0], 10, p[1]], [zwiebelGeo(1.4), streifen(farben[(n + 1) % 4][0], farben[(n + 1) % 4][1], 8, 1.4), p[0], 13, p[1]]);
        });
        return proto(t);
      },
      denkmal: function () {
        var b = '#9a7a38', d = '#7a5a28';
        return proto([[BOX(8, 6, 8), '#7a7a78', 0, 3, 0], [BOX(8.6, 0.6, 8.6), '#9a9a96', 0, 6.3, 0],
          [CYL(0.9, 0.8, 5.4, 10), b, -1.1, 9.3, 0], [CYL(0.9, 0.8, 5.4, 10), b, 1.1, 9.3, 0], [CYL(2.6, 3.0, 3, 14), b, 0, 12.2, 0],
          [SPH(3, 14, 10), b, 0, 14.4, 0, 0, 0, 0, 1, 1.05, 0.95], [SPH(2.6, 14, 10), b, 0, 17.2, 0], [SPH(1.7, 14, 10), b, 0, 20.4, 0],
          [SPH(1.9, 12, 8, 0, Math.PI * 2, 0, 1.3), d, 0, 20.9, 0], [SPH(0.6, 8, 6), d, -1.75, 20.1, 0, 0, 0, 0, 0.6, 1.2, 1], [SPH(0.6, 8, 6), d, 1.75, 20.1, 0, 0, 0, 0, 0.6, 1.2, 1],
          [CYL(0.75, 0.68, 5.2, 10), b, 2.9, 19.3, 1.4, -1.15, 0, -0.35], [SPH(0.7, 8, 6), b, 3.6, 21.2, 3.6], [CYL(0.75, 0.68, 4.5, 10), b, -2.8, 15.4, 0, 0, 0, -0.2]]);
      },
      tv: function () {
        return proto([[CYL(1.8, 7, 16, 8), '#d8d4cc', 0, 8, 0], [CYL(1.0, 1.8, 34, 12), '#e0dcd4', 0, 33, 0], [CYL(3.2, 3.2, 3.5, 16), '#c8c4bc', 0, 44, 0],
          [CYL(3.25, 3.25, 1.2, 16), '#3a4a5a', 0, 44.4, 0], [CYL(0.7, 1.0, 8, 10), '#e0dcd4', 0, 50, 0],
          [CYL(0.32, 0.5, 13, 8), function (x, y) { return Math.floor((y + 6.5) / 1.6) % 2 ? '#c8102e' : '#f4f0e8'; }, 0, 60.5, 0]]);
      },
      rakete: function () {
        var t = [[BOX(18, 1.2, 18), '#8a8a88', 0, 0.6, 0], [CYL(1.8, 1.8, 30, 16), '#eeeeea', 0, 16.2, 0], [CYL(1.83, 1.83, 1.6, 16), '#c8102e', 0, 26, 0],
          [CYL(1.4, 1.8, 6, 16), '#e0e0dc', 0, 34.2, 0], [CONE(1.4, 5, 16), '#d8d8d4', 0, 39.7, 0], [BOX(2.5, 38, 2.5), '#b8402a', 7, 19.2, 0], [BOX(5, 0.6, 0.6), '#b8402a', 4.5, 30, 0]];
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (p) {
          t.push([CYL(1.0, 1.5, 16, 12), '#e4e4e0', p[0] * 2.7, 9.2, p[1] * 2.7], [CONE(1.0, 3.6, 12), '#d0d0cc', p[0] * 2.7, 19, p[1] * 2.7]);
          t.push([BOX(p[0] ? 1.6 : 0.15, 2.4, p[1] ? 1.6 : 0.15), '#c8102e', p[0] * 4.0, 2.6, p[1] * 4.0]);
        });
        return proto(t);
      },
      zucker: function () {
        var fenster = function (x, y) { return Math.abs(Math.sin(x * 1.7)) > 0.72 && Math.abs(Math.sin(y * 1.3)) > 0.45 ? '#5a6878' : '#e4d8be'; };
        var t = [[BOX(26, 16, 22), fenster, 0, 8, 0], [BOX(18, 14, 15), fenster, 0, 23, 0], [BOX(11, 10, 11), fenster, 0, 35, 0], [BOX(7, 7, 7), '#ece2cc', 0, 43.5, 0],
          [CONE(2.2, 12, 8), '#e8b84a', 0, 53, 0], [sternGeo(1.5, 0.4), '#e8203a', 0, 60.5, 0], [BOX(26.4, 0.6, 22.4), '#c8b898', 0, 16, 0], [BOX(18.4, 0.6, 15.4), '#c8b898', 0, 30, 0]];
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (p) { t.push([CYL(0.8, 0.8, 4, 8), '#ece2cc', p[0] * 8, 32, p[1] * 6.5], [CONE(1, 3, 8), '#e8b84a', p[0] * 8, 35.5, p[1] * 6.5]); });
        return proto(t);
      },
      fabrik: function () {
        var t = [[BOX(26, 10, 18), function (x, y) { return y > 1 && y < 3.5 && Math.abs(Math.sin(x * 0.9)) > 0.5 ? '#3a4a58' : '#a84a32'; }, 0, 5, 0],
          [BOX(26.4, 0.6, 18.4), '#5a5a5a', 0, 10.3, 0], [CYL(1.2, 1.6, 22, 12), function (x, y) { return y > 8 && y < 9.5 ? '#f4ead2' : '#9a3a28'; }, 9, 11, 5],
          [BOX(14, 2.4, 0.4), '#f2c14e', 0, 8.3, 9.2], [SPH(1, 18, 12), '#c47a34', -2, 13.6, -2, 0, 0, 0, 9, 3.6, 5]];
        for (var k = -2; k <= 2; k++) t.push([BOX(1.2, 0.5, 6.5), '#ecc080', -2 + k * 3.2, 17.0, -2, 0, 0.4, 0]);
        return proto(t);
      }
    };
    // Texturierte Gebäude: Box mit eigenen UVs (Seiten 0 +x, 1 -x, 2 +y, 3 -y, 4 +z, 5 -z)
    function bauBox(w, h, d, uvFn) {
      var g = new THREE.BoxGeometry(w, h, d); g.translate(0, h / 2, 0);
      var uv = g.attributes.uv;
      for (var f = 0; f < 6; f++) for (var k = 0; k < 4; k++) { var i = f * 4 + k, r = uvFn(f, uv.getX(i), uv.getY(i)); uv.setXY(i, r[0], r[1]); }
      return g;
    }
    function platte(w, h, d) { return bauBox(w, h, d, function (f, u, v) { return f === 2 || f === 3 ? [0.12, 0.97] : [u * (f < 2 ? d : w) / 16, v * h / 12]; }); }
    var plattenM = new THREE.MeshStandardMaterial({ map: plattenTex, roughness: 0.92 });
    var hausM = new THREE.MeshStandardMaterial({ map: hausTex, roughness: 0.9 });
    var TEXTURIERT = {
      p5: function () { return platte(24, 14, 10); }, p9: function () { return platte(14, 26, 14); },
      haus: function () { return bauBox(10, 7, 8, function (f, u, v) { return f === 4 ? [u * 0.5, v] : f === 2 || f === 3 ? [0.75, 0.95] : [0.5 + u * 0.5, v]; }); }
    };

    // ---------- Stadt planen ----------
    var plaene = [], menschenPlan = [];
    function setze(t, x, z, rot, sk) { plaene.push({ t: t, x: x, z: z, rot: rot || 0, sk: sk || 1 }); }
    function snack(x, z) { setze(pick(SNACKS), x, z, rnd(0, 6.28), rnd(0.9, 1.15)); }
    function menschHin(x, z, x0, x1, z0, z1) { menschenPlan.push({ x: x, z: z, b: [x0, x1, z0, z1] }); }
    function block(cx, cz) {
      var belegt = [];
      function platz(r) {
        for (var n = 0; n < 25; n++) {
          var x = cx + rnd(-14 + r, 14 - r), z = cz + rnd(-14 + r, 14 - r);
          if (belegt.every(function (b) { return Math.hypot(b[0] - x, b[1] - z) > b[2] + r; })) { belegt.push([x, z, r]); return [x, z]; }
        }
        return null;
      }
      function fest(x, z, r) { belegt.push([x, z, r]); }
      function viele(t, n, r, sk) { for (var k = 0; k < n; k++) { var p = platz(r); if (p) setze(t, p[0], p[1], rnd(0, 6.28), sk ? rnd(0.85, 1.15) : 1); } }
      function snacks(n) { for (var k = 0; k < n; k++) { var p = platz(0.3); if (p) snack(p[0], p[1]); } }
      function leute(n) { for (var k = 0; k < n; k++) menschHin(cx + rnd(-12, 12), cz + rnd(-12, 12), cx - 13, cx + 13, cz - 13, cz + 13); }
      // Gehweg: Laternen, Mülltonnen, ein paar Snacks
      [[0, -16.2], [0, 16.2]].forEach(function (s, n) { setze('laterne', cx + (n ? 8 : -8), cz + s[1], n ? Math.PI : 0); });
      if (Math.random() < 0.6) setze('muell', cx + rnd(-12, 12), cz + (Math.random() < 0.5 ? -16 : 16));
      for (var k = 0; k < 3; k++) { var seite = Math.floor(rnd(0, 4)), off = rnd(-14, 14); snack(cx + (seite < 2 ? off : (seite === 2 ? -16 : 16)), cz + (seite < 2 ? (seite ? -16 : 16) : off)); }
      var art = pick(['platte', 'platte', 'platte', 'markt', 'markt', 'park', 'park', 'hof']);
      if (art === 'platte') {
        if (Math.random() < 0.55) {
          setze('p5', cx, cz - 7.5); fest(cx - 8, cz - 7.5, 5); fest(cx, cz - 7.5, 5); fest(cx + 8, cz - 7.5, 5);
          setze('p5', cx, cz + 7.5); fest(cx - 8, cz + 7.5, 5); fest(cx, cz + 7.5, 5); fest(cx + 8, cz + 7.5, 5);
          viele('baum', 2, 0.8, true); viele('bank', 1, 0.9);
        } else {
          setze('p9', cx - 6, cz - 6); fest(cx - 6, cz - 6, 9.5);
          setze('haus', cx + 8, cz + 8, Math.PI); fest(cx + 8, cz + 8, 6.3);
          viele('baum', 4, 0.8, true); viele('bank', 2, 0.9); viele('busch', 3, 0.7, true);
        }
        snacks(4); leute(2);
      } else if (art === 'markt') {
        setze('haus', cx - 7, cz - 9); fest(cx - 7, cz - 9, 6.3);
        for (var sx = 0; sx < 3; sx++) for (var sz = 0; sz < 2; sz++) {
          var x = cx - 5 + sx * 6.5, z = cz + 1 + sz * 6.5;
          setze('stand', x, z, 0); fest(x, z, 1.6);
          for (var f = 0; f < 4; f++) snack(x + rnd(-1.6, 1.6), z + rnd(1.1, 2.0));
        }
        if (Math.random() < 0.7) { var kp = platz(1.8); if (kp) setze('kiosk', kp[0], kp[1], rnd(0, 6.28)); }
        snacks(10); leute(6);
      } else if (art === 'park') {
        if (Math.random() < 0.4) { setze('bueste', cx, cz); fest(cx, cz, 2); }
        deko.add((function () { var m = new THREE.Mesh(new THREE.PlaneGeometry(29, 29), parkGras); m.rotation.x = -Math.PI / 2; m.position.set(cx, 0.02, cz); m.receiveShadow = true; return m; })());
        viele('baum', 14, 0.9, true); viele('bank', 4, 0.9); viele('busch', 5, 0.7, true); viele('muell', 1, 0.4);
        snacks(9); leute(3);
      } else {
        for (var r2 = 0; r2 < 2; r2++) for (var c2 = 0; c2 < 4; c2++) { var lx = cx - 9 + c2 * 6, lz = cz - 5 + r2 * 10; if (Math.random() < 0.8) { setze(pick(LADAS), lx, lz, r2 ? Math.PI : 0); fest(lx, lz, 2); } }
        setze('haus', cx + 9, cz + 9.5, Math.PI); fest(cx + 9, cz + 9.5, 6);
        viele('muell', 2, 0.4); viele('baum', 2, 0.8, true);
        snacks(4); leute(1);
      }
    }
    for (var bi = 0; bi < 2 * W / BL; bi++) for (var bj = 0; bj < 2 * W / BL; bj++) {
      var bcx = -W + BL / 2 + bi * BL, bcz = -W + BL / 2 + bj * BL;
      if (Math.abs(bcx) < PLATZ && Math.abs(bcz) < PLATZ) continue;
      if (bi === 0 && bj === 0) { setze('rakete', bcx, bcz); continue; }
      if (bi === 9 && bj === 0) { setze('tv', bcx, bcz); continue; }
      if (bi === 9 && bj === 9) { setze('zucker', bcx, bcz); continue; }
      if (bi === 0 && bj === 9) { setze('fabrik', bcx, bcz); for (var fs = 0; fs < 14; fs++) setze('brot', bcx + rnd(-15, 15), bcz + 13 + rnd(0, 2.5), rnd(0, 6.28)); continue; }
      block(bcx, bcz);
    }
    // Roter Platz: Kremlmauer, Türme, Kathedrale, Denkmal, Marktstände
    [-30, -18, -6, 6, 18, 30].forEach(function (x) { setze('mauer', x, -33); });
    [-36, 0, 36].forEach(function (x) { setze('turm', x, -33); });
    setze('kirche', 0, 27); setze('denkmal', 0, -15);
    [-28, -20, 20, 28].forEach(function (x) { setze('stand', x, 6, x < 0 ? Math.PI / 2 : -Math.PI / 2); for (var f = 0; f < 5; f++) snack(x + rnd(-1.5, 1.5), 6 + rnd(-2, 2)); });
    for (var ps = 0; ps < 30; ps++) snack(rnd(-30, 30), rnd(-24, 14));
    for (var pm = 0; pm < 10; pm++) menschHin(rnd(-30, 30), rnd(-20, 14), -34, 34, -26, 34);
    [-34, 34].forEach(function (x) { [-20, 0, 20].forEach(function (z) { setze('laterne', x, z, x < 0 ? -Math.PI / 2 : Math.PI / 2); }); });

    // ---------- Objekte erzeugen ----------
    var dinge = [], meshe = {}, nachTyp = {};
    plaene.forEach(function (p) { (nachTyp[p.t] = nachTyp[p.t] || []).push(p); });
    var fahrzeugAnz = { lada0: 9, lada1: 9, lada2: 9, lada3: 9, bus: 6, tram: 4 };
    Object.keys(fahrzeugAnz).forEach(function (t) { nachTyp[t] = nachTyp[t] || []; for (var k = 0; k < fahrzeugAnz[t]; k++) nachTyp[t].push({ t: t, x: 0, z: 0, rot: 0, sk: 1, faehrt: true }); });
    var dummy = new THREE.Object3D(), NULL = new THREE.Matrix4().makeScale(0, 0, 0);
    Object.keys(nachTyp).forEach(function (t) {
      var liste = nachTyp[t], typ = TYPEN[t];
      typ.geo = TEXTURIERT[t] ? TEXTURIERT[t]() : PROTO[t]();
      typ.mat = TEXTURIERT[t] ? (t === 'haus' ? hausM : plattenM) : vcMat;
      typ.geo.computeBoundingBox(); typ.hoehe = typ.geo.boundingBox.max.y;
      var m = new THREE.InstancedMesh(typ.geo, typ.mat, liste.length);
      m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; scene.add(m); meshe[t] = m;
      liste.forEach(function (p, i) {
        var quer = Math.abs(Math.sin(p.rot)) > 0.7;
        var o = { t: t, typ: typ, x: p.x, z: p.z, rot: p.rot, sk: p.sk, i: i, lebt: true, g: typ.g * p.sk, cut: 0 };
        if (typ.box) { o.hx = (quer ? typ.box[1] : typ.box[0]) * p.sk; o.hz = (quer ? typ.box[0] : typ.box[1]) * p.sk; o.rmax = Math.max(o.hx, o.hz) * 1.42; }
        else { o.r = typ.r * p.sk; o.rmax = o.r; }
        if (p.faehrt) { o.dyn = t === 'tram' ? tramStart(i) : strasseStart(t === 'bus' ? rnd(6, 8) : rnd(8, 13)); fahren(o, 0); }
        dinge.push(o); setzeMatrix(o);
      });
      m.instanceMatrix.needsUpdate = true;
    });
    function setzeMatrix(o) {
      if (!o.lebt) { meshe[o.t].setMatrixAt(o.i, NULL); return; }
      dummy.position.set(o.x, 0, o.z); dummy.rotation.set(0, o.rot, 0); dummy.scale.set(o.sk, o.sk * (1 - 0.94 * o.cut), o.sk); dummy.updateMatrix();
      meshe[o.t].setMatrixAt(o.i, dummy.matrix);
    }
    Modell3D.verschmelzen(deko);
    // Hohe Gebäude, die Felix vor der Kamera verdecken, ducken sich kurz weg
    var hohe = dinge.filter(function (o) { return o.typ.hoehe > 6; });
    function verdeckung(dt) {
      var kopfY = g.gs * 0.8, geaendert = {};
      for (var n = 0; n < hohe.length; n++) {
        var o = hohe[n]; if (!o.lebt) continue;
        var ziel = 0, ex = (o.hx !== undefined ? o.hx : o.r) + 1, ez = (o.hz !== undefined ? o.hz : o.r) + 1, h = o.typ.hoehe * o.sk;
        if (Math.abs(o.x - (g.x + cam.position.x) / 2) < ex + Math.abs(cam.position.x - g.x) / 2 + 2 && Math.abs(o.z - (g.z + cam.position.z) / 2) < ez + Math.abs(cam.position.z - g.z) / 2 + 2) {
          for (var k = 1; k <= 10; k++) {
            var f = k / 10, px = lerp(g.x, cam.position.x, f), pz = lerp(g.z, cam.position.z, f), py = lerp(kopfY, cam.position.y, f);
            if (Math.abs(px - o.x) < ex && Math.abs(pz - o.z) < ez && h > py) { ziel = 1; break; }
          }
        }
        var neu = o.cut + (ziel - o.cut) * daempf(dt, 7);
        if (Math.abs(neu - o.cut) > 0.002) { o.cut = neu; setzeMatrix(o); geaendert[o.t] = true; }
      }
      Object.keys(geaendert).forEach(function (t) { meshe[t].instanceMatrix.needsUpdate = true; });
    }

    // Menschen mit Brot in der Hand (nicht essbar – aber ihr Brot schon)
    var MENSCH_ARTEN = [['#5a5a62', '#5a4a3a'], ['#7a5a3a', '#6a5a48'], ['#3a4a6a', '#4a3a2a'], ['#6a3a4a', '#c8302e']];
    var menschMeshe = MENSCH_ARTEN.map(function (a, n) {
      var anz = menschenPlan.filter(function (p, k) { return k % 4 === n; }).length;
      var m = new THREE.InstancedMesh(mensch(a[0], a[1]), vcMat, Math.max(1, anz)); m.castShadow = true; m.frustumCulled = false; scene.add(m); return m;
    });
    var handBrot = new THREE.InstancedMesh(TYPEN.brot.geo || PROTO.brot(), vcMat, Math.max(1, menschenPlan.length)); handBrot.frustumCulled = false; scene.add(handBrot);
    var menschen = menschenPlan.map(function (p, k) {
      return { x: p.x, z: p.z, b: p.b, art: k % 4, i: Math.floor(k / 4), k: k, zx: p.x, zz: p.z, v: rnd(1.1, 1.6), brot: Math.random() < 0.8, brotT: 0, rot: 0, ph: rnd(0, 6), flucht: 0 };
    });

    // ---------- Verkehr ----------
    function frei(mx, mz) { return Math.abs(mx) <= W && Math.abs(mz) <= W && !(Math.abs(mx) < PLATZ && Math.abs(mz) < PLATZ); }
    function strasseStart(v) {
      for (var n = 0; n < 60; n++) {
        var achse = Math.random() < 0.5 ? 'x' : 'z', linie = -W + BL * Math.floor(rnd(0, 2 * W / BL + 1)), p = -W + BL * Math.floor(rnd(0, 2 * W / BL)) + BL / 2;
        var mx = achse === 'x' ? p : linie, mz = achse === 'x' ? linie : p;
        if (frei(mx, mz) && Math.abs(linie) < W) return { achse: achse, linie: linie, p: p, dir: Math.random() < 0.5 ? 1 : -1, v: v };
      }
      return { achse: 'x', linie: -W + BL, p: -W + BL / 2, dir: 1, v: v };
    }
    function tramStart(i) { return { tram: true, linie: i % 2 ? 120 : -120, p: rnd(-W + 20, W - 20), dir: i < 2 ? 1 : -1, v: rnd(8, 10) }; }
    function fahren(o, dt) {
      var d = o.dyn;
      if (d.tram) {
        d.p += d.dir * d.v * dt;
        if (d.p > W - 8) { d.p = W - 8; d.dir = -1; } else if (d.p < -W + 8) { d.p = -W + 8; d.dir = 1; }
        o.x = d.p; o.z = d.linie; o.rot = Math.atan2(-d.dir, 0); return;
      }
      var alt = d.p; d.p += d.dir * d.v * dt;
      var kA = Math.floor((alt + W) / BL), kN = Math.floor((d.p + W) / BL);
      if (kA !== kN) {
        var kreuz = -W + BL * (d.dir > 0 ? kN : kA);
        var ix = d.achse === 'x' ? kreuz : d.linie, iz = d.achse === 'x' ? d.linie : kreuz;
        var cur = d.achse === 'x' ? [d.dir, 0] : [0, d.dir], opt = [], gerade = null;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (r) {
          if (r[0] === -cur[0] && r[1] === -cur[1]) return;
          if (!frei(ix + r[0] * BL / 2, iz + r[1] * BL / 2)) return;
          opt.push(r); if (r[0] === cur[0] && r[1] === cur[1]) gerade = r;
        });
        var wahl = gerade && Math.random() < 0.55 ? gerade : (opt.length ? pick(opt) : [-cur[0], -cur[1]]);
        if (wahl[0]) { d.achse = 'x'; d.linie = iz; d.dir = wahl[0]; d.p = ix + d.dir * 0.05; }
        else { d.achse = 'z'; d.linie = ix; d.dir = wahl[1]; d.p = iz + d.dir * 0.05; }
      }
      var dx = d.achse === 'x' ? d.dir : 0, dz = d.achse === 'x' ? 0 : d.dir;
      o.x = (d.achse === 'x' ? d.p : d.linie) - dz * 2;
      o.z = (d.achse === 'x' ? d.linie : d.p) + dx * 2;
      o.rot = Math.atan2(-dx, -dz);
    }

    // ---------- Felix ----------
    function gesichtTex(mund) {
      return canvasTex(1024, 512, function (x, w, h) {
        var px = w / 360;
        function P(lon, lat) { return [w * 0.25 + lon * px, h / 2 - lat * px]; }
        function ell(c, rx, ry, rot) { x.beginPath(); x.ellipse(c[0], c[1], rx * px, ry * px, rot || 0, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = '#f0c2a6'; x.fillRect(0, 0, w, h);
        x.fillStyle = '#3a2618'; x.fillRect(0, 0, w, h / 2 - 27 * px);
        x.fillRect(w * 0.25 + 80 * px, 0, 200 * px, h / 2 + 22 * px);
        [-1, 1].forEach(function (s) {
          var c = P(s * 30, -12), gr = x.createRadialGradient(c[0], c[1], 0, c[0], c[1], 17 * px);
          gr.addColorStop(0, 'rgba(232,120,110,.42)'); gr.addColorStop(1, 'rgba(232,120,110,0)');
          x.fillStyle = gr; x.fillRect(c[0] - 18 * px, c[1] - 18 * px, 36 * px, 36 * px);
          var a = P(s * 17, 4);
          x.fillStyle = '#fff'; ell(a, 7.5, 5);
          x.fillStyle = '#6a4428'; ell([a[0] - s * 0.6 * px, a[1] + 0.4 * px], 4.3, 4.3);
          x.fillStyle = '#1a0f08'; ell([a[0] - s * 0.6 * px, a[1] + 0.4 * px], 2.2, 2.2);
          x.fillStyle = '#fff'; ell([a[0] - 1.8 * px, a[1] - 1.5 * px], 1.1, 1.1);
          x.strokeStyle = '#2a1a10'; x.lineWidth = 1.8 * px; x.beginPath(); x.ellipse(a[0], a[1], 7.8 * px, 5.2 * px, 0, Math.PI * 1.08, Math.PI * 1.92); x.stroke();
          // dicke, leicht skeptische Augenbrauen
          x.fillStyle = '#3a2618'; x.beginPath();
          var i1 = P(s * 7, 10.5), i2 = P(s * 7, 13.8), a1 = P(s * 27, 13.5), a2 = P(s * 26, 10.8);
          x.moveTo(i1[0], i1[1]); x.lineTo(i2[0], i2[1]); x.lineTo(a1[0], a1[1]); x.lineTo(a2[0], a2[1]); x.closePath(); x.fill();
        });
        x.strokeStyle = 'rgba(176,104,84,.55)'; x.lineWidth = 1.5 * px;
        var n = P(0, -9); x.beginPath(); x.arc(n[0], n[1], 4 * px, Math.PI * 0.15, Math.PI * 0.85); x.stroke();
        var mo = P(0, -21);
        if (mund === 'zu') {
          x.fillStyle = '#c97a72'; ell(mo, 7.5, 3);
          x.strokeStyle = '#8a4a44'; x.lineWidth = 1.2 * px; x.beginPath(); x.moveTo(mo[0] - 7 * px, mo[1] + 0.3 * px); x.quadraticCurveTo(mo[0], mo[1] - 0.8 * px, mo[0] + 7 * px, mo[1] + 0.6 * px); x.stroke();
        } else {
          x.fillStyle = '#3a1010'; ell([mo[0], mo[1] + 2 * px], 11, 8.5);
          x.fillStyle = '#fff'; x.fillRect(mo[0] - 7 * px, mo[1] - 5.5 * px, 14 * px, 3 * px);
          x.fillStyle = '#e8707a'; ell([mo[0], mo[1] + 6.5 * px], 6.5, 3.2);
        }
      });
    }
    var felix = new THREE.Group(); scene.add(felix);
    var F = (function () {
      var mantel = std('#5a6a3c', { roughness: 0.9 }), mantelB = std('#5a6a3c', { roughness: 0.9 }), mantelRock = std('#56663a', { roughness: 0.9, side: THREE.DoubleSide });
      var rot = std('#c8102e', { roughness: 0.6 }), gold = std('#e8b84a', { metalness: 0.7, roughness: 0.35 }), silber = std('#d0d4d8', { metalness: 0.7, roughness: 0.3 });
      var hose = std('#2a2c34'), stiefel = std('#16161a', { roughness: 0.4 }), haut = std('#f0c2a6', { roughness: 0.7 }), haar = std('#3a2618', { roughness: 0.95 });
      var fell = std('#6e5a48', { roughness: 1 }), fellH = std('#86705c', { roughness: 1 }), blau = std('#2a5ab8', { roughness: 0.6 });
      function mesh(geo, mat, x, y, z, p) { var m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = true; (p || null) && p.add(m); return m; }
      function glied(r0, r1, len, mat) { var g = CYL(r1, r0, len, 14); g.translate(0, -len / 2, 0); return mesh(g, mat); }
      function ellip(rx, ry, rz, mat, x, y, z, p) { var m = mesh(SPH(1, 20, 14), mat, x, y, z, p); m.scale.set(rx, ry, rz); return m; }
      var huefte = new THREE.Group(); huefte.position.y = 0.86; felix.add(huefte);
      var beine = [-1, 1].map(function (s) {
        var piv = new THREE.Group(); piv.position.set(s * 0.16, 0, 0); huefte.add(piv);
        piv.add(glied(0.13, 0.11, 0.42, hose)); mesh(BOX(0.025, 0.38, 0.05), rot, s * 0.12, -0.2, 0, piv);
        var knie = new THREE.Group(); knie.position.y = -0.42; piv.add(knie);
        mesh(SPH(0.11, 12, 8), hose, 0, 0, 0, knie); knie.add(glied(0.115, 0.1, 0.34, stiefel));
        ellip(0.11, 0.08, 0.18, stiefel, 0, -0.37, 0.05, knie);
        return { piv: piv, knie: knie };
      });
      var rumpf = new THREE.Group(); huefte.add(rumpf);
      var bauchG = new THREE.Group(); bauchG.position.y = 0.32; rumpf.add(bauchG);
      ellip(0.4, 0.42, 0.37, mantelB, 0, 0, 0, bauchG);
      var gurt = mesh(new THREE.TorusGeometry(1, 0.05, 8, 40), std('#5a3a1e', { roughness: 0.6 }), 0, -0.02, 0, bauchG); gurt.rotation.x = Math.PI / 2; gurt.scale.set(0.405, 0.375, 1);
      var schnalle = mesh(BOX(0.13, 0.11, 0.03), gold, 0, -0.02, 0.375, bauchG);
      mesh(sternGeo(0.035, 0.01), rot, 0, -0.02, 0.392, bauchG);
      [0.14, -0.16].forEach(function (y) { [-1, 1].forEach(function (s) { var x = s * 0.1, z = 0.37 * Math.sqrt(Math.max(0, 1 - (x / 0.4) * (x / 0.4) - (y / 0.42) * (y / 0.42))); mesh(SPH(0.022, 8, 6), gold, x, y, z, bauchG); }); });
      mesh(new THREE.CylinderGeometry(0.37, 0.43, 0.42, 22, 1, true), mantelRock, 0, 0.1, 0, rumpf);
      ellip(0.36, 0.32, 0.29, mantel, 0, 0.64, 0, rumpf);
      [0.58, 0.72].forEach(function (y) { [-1, 1].forEach(function (s) { var x = s * 0.1, z = 0.29 * Math.sqrt(Math.max(0, 1 - (x / 0.36) * (x / 0.36) - ((y - 0.64) / 0.32) * ((y - 0.64) / 0.32))); mesh(SPH(0.022, 8, 6), gold, x, y, z + 0.005, rumpf); }); });
      // Orden auf der linken Brust
      [[-0.2, gold], [-0.12, silber], [-0.28, rot]].forEach(function (o, n) {
        var y = 0.66 - (n === 2 ? 0.02 : 0), z = 0.29 * Math.sqrt(Math.max(0, 1 - (o[0] / 0.36) * (o[0] / 0.36) - ((y - 0.64) / 0.32) * ((y - 0.64) / 0.32)));
        var band = mesh(BOX(0.05, 0.04, 0.012), n === 1 ? blau : rot, o[0], y + 0.05, z, rumpf); band.rotation.y = o[0] * 1.2;
        var orden = mesh(CYL(0.024, 0.024, 0.012, 12), o[1], o[0], y, z + 0.01, rumpf); orden.rotation.x = Math.PI / 2; orden.rotation.z = o[0] * 1.2;
      });
      [-1, 1].forEach(function (s) { var sk = mesh(BOX(0.17, 0.035, 0.12), gold, s * 0.29, 0.92, 0, rumpf); sk.rotation.z = -s * 0.25; mesh(BOX(0.12, 0.04, 0.06), rot, s * 0.29, 0.925, 0, rumpf).rotation.z = -s * 0.25; });
      var kragen = mesh(new THREE.TorusGeometry(0.14, 0.045, 8, 20), mantel, 0, 0.94, 0, rumpf); kragen.rotation.x = Math.PI / 2;
      [-1, 1].forEach(function (s) { mesh(BOX(0.06, 0.06, 0.02), rot, s * 0.07, 0.92, 0.15, rumpf); });
      var arme = [-1, 1].map(function (s) {
        var piv = new THREE.Group(); piv.position.set(s * 0.38, 0.82, 0); piv.rotation.z = s * 0.12; rumpf.add(piv);
        mesh(SPH(0.12, 12, 8), mantel, 0, 0, 0, piv); piv.add(glied(0.11, 0.095, 0.36, mantel));
        var ell = new THREE.Group(); ell.position.y = -0.36; piv.add(ell);
        ell.add(glied(0.095, 0.085, 0.3, mantel));
        var manschette = mesh(new THREE.TorusGeometry(0.085, 0.022, 6, 16), rot, 0, -0.28, 0, ell); manschette.rotation.x = Math.PI / 2;
        ellip(0.07, 0.08, 0.06, haut, 0, -0.36, 0, ell);
        return { piv: piv, ell: ell };
      });
      var kopf = new THREE.Group(); kopf.position.y = 1.2; rumpf.add(kopf);
      kopf.add((function () { var h = glied(0.1, 0.11, 0.2, haut); h.position.y = -0.12; return h; })());
      var gesicht = { zu: gesichtTex('zu'), auf: gesichtTex('auf') };
      var schaedel = mesh(SPH(0.27, 40, 28), new THREE.MeshStandardMaterial({ map: gesicht.zu, roughness: 0.7 }), 0, 0, 0, kopf); schaedel.scale.set(1, 1.04, 0.98);
      [-1, 1].forEach(function (s) { ellip(0.045, 0.075, 0.035, haut, s * 0.265, -0.02, 0, kopf); });
      ellip(0.045, 0.04, 0.035, haut, 0, -0.035, 0.262, kopf);
      // Locken: Pony unter der Mütze und an den Seiten
      function aufKopf(lon, lat, r) { var a = lon * Math.PI / 180, b = lat * Math.PI / 180; return [Math.sin(a) * Math.cos(b) * r, Math.sin(b) * r * 1.04, Math.cos(a) * Math.cos(b) * r * 0.98]; }
      for (var lon = -62; lon <= 62; lon += 11) { var q = aufKopf(lon, 24 + Math.abs(lon) * 0.05 + rnd(-2, 2), 0.265); mesh(SPH(rnd(0.06, 0.078), 8, 6), haar, q[0], q[1], q[2], kopf); }
      for (lon = 70; lon <= 290; lon += 14) { [6, 20].forEach(function (lat) { var q = aufKopf(lon, lat + rnd(-3, 3), 0.27); mesh(SPH(rnd(0.065, 0.085), 8, 6), haar, q[0], q[1], q[2], kopf); }); }
      // Uschanka mit rotem Stern
      var hut = new THREE.Group(); hut.position.y = 0.07; kopf.add(hut);
      var kuppel = mesh(SPH(0.3, 28, 16, 0, Math.PI * 2, 0, 1.35), fell, 0, 0.02, 0, hut); kuppel.scale.set(1.04, 0.9, 1.04);
      mesh(new THREE.CylinderGeometry(0.318, 0.322, 0.12, 28, 1, true), std('#86705c', { roughness: 1, side: THREE.DoubleSide }), 0, 0.06, 0, hut);
      var klappe = mesh(BOX(0.36, 0.16, 0.07), fellH, 0, 0.15, 0.275, hut); klappe.rotation.x = -0.3;
      var stern = mesh(sternGeo(0.05, 0.015), std('#e8203a', { emissive: 0x500008, roughness: 0.4 }), 0, 0.16, 0.315, hut); stern.rotation.x = -0.3;
      [-1, 1].forEach(function (s) { var o = ellip(0.07, 0.13, 0.12, fellH, s * 0.3, -0.02, 0, hut); o.rotation.z = s * 0.15; });
      var mund = new THREE.Object3D(); mund.position.set(0, -0.1, 0.28); kopf.add(mund);
      Modell3D.verschmelzen(felix, [huefte, rumpf, bauchG, kopf, hut, beine[0].piv, beine[0].knie, beine[1].piv, beine[1].knie, arme[0].piv, arme[0].ell, arme[1].piv, arme[1].ell]);
      felix.updateMatrixWorld(true);
      var bb = new THREE.Box3().setFromObject(felix);
      return { huefte: huefte, rumpf: rumpf, bauch: bauchG, kopf: kopf, beine: beine, arme: arme, schaedel: schaedel, gesicht: gesicht, mund: mund, hoehe: bb.max.y };
    })();

    // Partikel: Krümel
    var kruemel = [];
    for (var kn = 0; kn < 50; kn++) { var ks = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xd8a860, transparent: true, depthWrite: false })); ks.visible = false; scene.add(ks); kruemel.push({ s: ks, v: new THREE.Vector3(), t: 0, life: 0, g: 1 }); }
    var ki = 0;
    function kruemelWolke(p, n, groesse, farbeHex) {
      for (var k = 0; k < n; k++) {
        var q = kruemel[ki++ % kruemel.length];
        q.s.position.copy(p); q.v.set(rnd(-1, 1), rnd(0.5, 1.8), rnd(-1, 1)).multiplyScalar(groesse * 1.6);
        q.t = 0; q.life = rnd(0.4, 0.8); q.g = groesse * rnd(0.12, 0.25); q.s.material.color.set(farbeHex || 0xd8a860); q.s.visible = true;
      }
    }
    var fliegen = []; // Bissen, die gerade zum Mund fliegen

    // ---------- Zustand ----------
    var g, MUNDPOS = new THREE.Vector3();
    function reset() {
      g = {
        modus: 'intro', t: 0, rest: PLAN, x: 0, z: 4, rot: Math.PI, vx: 0, vz: 0, A: START_G * START_G, gs: START_G, kau: 0, schritt: 0,
        jahr: 1, hinweisT: -9, frei: {}, gegessen: { snack: 0, ding: 0, fahrzeug: 0, bau: 0, wahr: 0, brot: 0 }, ende: false
      };
      Object.keys(TYPEN).forEach(function (t) { if (TYPEN[t].g <= START_G * ESS) g.frei[t] = true; });
    }
    function felixR() { return 0.2 * g.gs + 0.15; }
    var meldT = 0;
    function melde(txt, klein) {
      var el = $('meldung'); el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      el.classList.remove('zeigen'); void el.offsetWidth; el.classList.add('zeigen');
      clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1900);
    }
    function essen(o) {
      o.lebt = false; setzeMatrix(o); meshe[o.t].instanceMatrix.needsUpdate = true;
      var gain = o.g * o.g * ({ snack: 0.6, ding: 0.22, fahrzeug: 0.22, bau: 0.2, wahr: 0.25 })[o.typ.art];
      g.A += gain; g.gegessen[o.typ.art]++;
      g.kau = 0.22;
      var m = new THREE.Mesh(o.typ.geo, o.typ.mat); m.position.set(o.x, 0, o.z); m.rotation.y = o.rot; m.scale.setScalar(o.sk); m.castShadow = true; scene.add(m);
      fliegen.push({ m: m, t: 0, dauer: 0.28 + Math.min(0.7, o.g / 60), x0: o.x, z0: o.z, s0: o.sk });
      var gross = o.g > 6;
      Pixel.sfx.noise(gross ? 0.35 : 0.07, gross ? 0.28 : 0.16, gross ? 260 : 900);
      Pixel.sfx.tone(gross ? 90 : clamp(320 - g.gs * 8, 120, 320), gross ? 0.3 : 0.06, 'square', 0.04, gross ? 50 : null);
      if (o.typ.weg) melde(o.typ.name + ' gegessen!', o.typ.weg);
      freischalten();
    }
    function freischalten() {
      var kann = Math.sqrt(g.A) * ESS;
      Object.keys(TYPEN).forEach(function (t) {
        var typ = TYPEN[t];
        if (g.frei[t] || typ.g > kann) return;
        g.frei[t] = true;
        if (typ.frei && g.modus === 'spiel') { melde(typ.frei, typ.e + ' ' + typ.name + ' ab jetzt essbar'); Pixel.sfx.tone(523, 0.1, 'triangle', 0.06); Pixel.sfx.tone(659, 0.1, 'triangle', 0.06, null, 0.1); Pixel.sfx.tone(784, 0.25, 'triangle', 0.06, null, 0.2); }
      });
    }
    function naechstesZiel() {
      var kann = g.gs * ESS, best = null;
      for (var n = 0; n < dinge.length; n++) { var o = dinge[n]; if (o.lebt && o.typ.g > kann && (!best || o.typ.g < best.g)) best = o.typ; }
      return best;
    }

    // ---------- Eingabe ----------
    var CODES = { KeyW: 'o', ArrowUp: 'o', KeyS: 'u', ArrowDown: 'u', KeyA: 'l', ArrowLeft: 'l', KeyD: 'r', ArrowRight: 'r' };
    var KEYS = { w: 'o', arrowup: 'o', s: 'u', arrowdown: 'u', a: 'l', arrowleft: 'l', d: 'r', arrowright: 'r' };
    var tasten = {}, stick = { id: null, x0: 0, y0: 0, dx: 0, dy: 0 }, stickEl = $('stick'), stickKnopf = stickEl.querySelector('i');
    function taste(e) { return CODES[e.code] || KEYS[(e.key || '').toLowerCase()]; }
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel' && (e.key === 'Enter' || e.key === ' ')) { var b = ebene.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } return; }
      var t = taste(e); if (t) { tasten[t] = true; e.preventDefault(); }
    }
    function ku(e) { var t = taste(e); if (t) tasten[t] = false; }
    function stickLos(e) { if (e && e.pointerId !== stick.id) return; stick.id = null; stick.dx = stick.dy = 0; stickEl.style.display = 'none'; }
    function allesLos() { tasten = {}; stickLos(); }
    function sichtbar() { if (document.hidden) allesLos(); }
    canvas.addEventListener('pointerdown', function (e) {
      if (g.modus !== 'spiel' || stick.id !== null) return;
      e.preventDefault(); stick.id = e.pointerId; stick.x0 = e.clientX; stick.y0 = e.clientY; stick.dx = stick.dy = 0;
      try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
      var r = box.getBoundingClientRect();
      stickEl.style.left = (e.clientX - r.left) + 'px'; stickEl.style.top = (e.clientY - r.top) + 'px'; stickKnopf.style.transform = ''; stickEl.style.display = 'block';
    });
    canvas.addEventListener('pointermove', function (e) {
      if (e.pointerId !== stick.id) return;
      var dx = e.clientX - stick.x0, dy = e.clientY - stick.y0, l = Math.hypot(dx, dy), max = 60;
      if (l > max) { dx *= max / l; dy *= max / l; }
      stick.dx = dx / max; stick.dy = dy / max; stickKnopf.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) { canvas.addEventListener(n, stickLos); });
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    // ---------- Nachbearbeitung ----------
    var composer = null;
    if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass && THREE.ShaderPass) {
      try {
        var rt = new THREE.WebGLRenderTarget(1, 1, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
        rt.texture.encoding = THREE.sRGBEncoding;
        composer = new THREE.EffectComposer(renderer, rt);
        composer.addPass(new THREE.RenderPass(scene, cam));
        composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.25, 0.4, 0.92));
        composer.addPass(new THREE.ShaderPass({
          uniforms: { tDiffuse: { value: null } },
          vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
          fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec2 d = vUv-0.5; vec3 c = texture2D(tDiffuse, vUv).rgb; c = mix(c, c*vec3(1.05,1.0,0.94), 0.6); c *= 1.0 - smoothstep(0.25,0.85,dot(d,d))*0.4; gl_FragColor = vec4(c,1.0); }'
        }));
      } catch (e) { composer = null; }
    }
    function resize() {
      var w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.fov = h > w ? 64 : 50; cam.updateProjectionMatrix();
      if (composer) { composer.setPixelRatio(dpr); composer.setSize(w, h); }
    }

    // ---------- Spiel-Schritt ----------
    function physik(dt) {
      var spiel = g.modus === 'spiel';
      g.t += dt;
      var ix = 0, iz = 0;
      if (spiel) {
        ix = (tasten.r ? 1 : 0) - (tasten.l ? 1 : 0) + stick.dx;
        iz = (tasten.u ? 1 : 0) - (tasten.o ? 1 : 0) + stick.dy;
        var il = Math.hypot(ix, iz); if (il > 1) { ix /= il; iz /= il; }
        g.rest -= dt;
        var jahr = clamp(Math.floor((PLAN - g.rest) / (PLAN / 5)) + 1, 1, 5);
        if (jahr !== g.jahr) { g.jahr = jahr; melde('Jahr ' + jahr + ' des Plans', 'Genosse Felix hat immer noch Hunger.'); }
        if (g.rest <= 0) { g.rest = 0; ende(); }
      }
      var tempo = 4.6 * Math.pow(g.gs, 0.72);
      g.vx += (ix * tempo - g.vx) * daempf(dt, 10); g.vz += (iz * tempo - g.vz) * daempf(dt, 10);
      g.x = clamp(g.x + g.vx * dt, -W + 2, W - 2); g.z = clamp(g.z + g.vz * dt, -W + 2, W - 2);
      var v = Math.hypot(g.vx, g.vz);
      if (v > 0.3) g.rot += winkel(Math.atan2(g.vx, g.vz) - g.rot) * daempf(dt, 12);
      g.schritt += dt * v / Math.max(0.6, g.gs * 0.55);
      // Verkehr
      for (var n = 0; n < dinge.length; n++) { var o = dinge[n]; if (o.dyn && o.lebt) fahren(o, dt); }
      // Essen und Zusammenstöße
      var fr = felixR(), kann = g.gs * ESS;
      for (n = 0; n < dinge.length; n++) {
        o = dinge[n];
        if (!o.lebt) continue;
        var dx = g.x - o.x, dz = g.z - o.z, reich = fr + o.rmax + 1;
        if (dx > reich || dx < -reich || dz > reich || dz < -reich) continue;
        var nah, px = 0, pz = 0, ab;
        if (o.hx !== undefined) {
          var cx = clamp(g.x, o.x - o.hx, o.x + o.hx), cz = clamp(g.z, o.z - o.hz, o.z + o.hz);
          var ex = g.x - cx, ez = g.z - cz; ab = Math.hypot(ex, ez);
          nah = ab < fr * 1.15;
          if (ab < fr) {
            if (ab > 1e-4) { px = ex / ab * (fr - ab); pz = ez / ab * (fr - ab); }
            else { var dl = g.x - (o.x - o.hx), dr = o.x + o.hx - g.x, dvo = g.z - (o.z - o.hz), dh = o.z + o.hz - g.z, mi = Math.min(dl, dr, dvo, dh); if (mi === dl) px = -(dl + fr); else if (mi === dr) px = dr + fr; else if (mi === dvo) pz = -(dvo + fr); else pz = dh + fr; }
          }
        } else {
          ab = Math.hypot(dx, dz);
          var saug = o.g < kann * 0.35 ? fr * 0.45 : 0;
          nah = ab < fr * 1.1 + o.r * 0.7 + saug;
          if (ab < fr + o.r && ab > 1e-4) { px = dx / ab * (fr + o.r - ab); pz = dz / ab * (fr + o.r - ab); }
        }
        if (o.g <= kann) { if (nah && spiel) essen(o); }
        else if (px || pz) {
          g.x += px; g.z += pz;
          if (spiel && g.t - g.hinweisT > 2.2) { g.hinweisT = g.t; melde('Zu groß!', o.typ.e + ' ' + o.typ.name + ' erst ab ' + fmt(o.g / ESS) + ' m'); Pixel.sfx.tone(130, 0.08, 'square', 0.05); }
        }
      }
      // Menschen: laufen herum, fliehen vor Felix, verlieren ihr Brot
      menschen.forEach(function (p) {
        var dx2 = p.x - g.x, dz2 = p.z - g.z, d = Math.hypot(dx2, dz2), angst = 4 + g.gs * 2.2;
        var zx, zz, sp;
        if (spiel && d < angst) { zx = dx2 / (d || 1); zz = dz2 / (d || 1); sp = 3.8; p.flucht = 0.6; }
        else {
          if (Math.hypot(p.zx - p.x, p.zz - p.z) < 0.5) { p.zx = rnd(p.b[0], p.b[1]); p.zz = rnd(p.b[2], p.b[3]); }
          zx = p.zx - p.x; zz = p.zz - p.z; var l = Math.hypot(zx, zz) || 1; zx /= l; zz /= l; sp = p.v;
          p.flucht = Math.max(0, p.flucht - dt);
        }
        p.x = clamp(p.x + zx * sp * dt, -W + 1, W - 1); p.z = clamp(p.z + zz * sp * dt, -W + 1, W - 1);
        p.rot += winkel(Math.atan2(zx, zz) - p.rot) * daempf(dt, 8); p.ph += dt * sp * 4;
        if (d < fr + 0.45) { p.x = g.x + dx2 / (d || 1) * (fr + 0.45); p.z = g.z + dz2 / (d || 1) * (fr + 0.45); }
        if (spiel && p.brot && d < fr + 0.75) {
          p.brot = false; p.brotT = rnd(18, 28); g.A += 0.12; g.gegessen.brot++; g.kau = 0.22;
          Pixel.sfx.tone(660, 0.06, 'triangle', 0.05, 900); blase(p);
        }
        if (!p.brot) { p.brotT -= dt; if (p.brotT <= 0) p.brot = true; }
      });
      // Wachsen
      g.gs += (Math.sqrt(g.A) - g.gs) * daempf(dt, 5);
    }

    var blaseEl = $('blase'), blaseT = 0, blaseP = null, proj = new THREE.Vector3();
    function blase(p) {
      blaseP = p; blaseT = 1.2; blaseEl.textContent = pick(['Mein Brot!', 'Ey!', 'Genosse!?', 'Das war meins!', 'Nicht schon wieder!']); blaseEl.style.opacity = 1;
    }

    function darstellen(dt) {
      var spiel = g.modus === 'spiel';
      // Felix
      var sk = g.gs / F.hoehe;
      felix.scale.setScalar(sk); felix.position.set(g.x, 0, g.z); felix.rotation.y = g.rot;
      var v = Math.hypot(g.vx, g.vz), lauf = clamp(v / (4.6 * Math.pow(g.gs, 0.72)), 0, 1), s = Math.sin(g.schritt * 5);
      F.beine[0].piv.rotation.x = s * 0.6 * lauf; F.beine[1].piv.rotation.x = -s * 0.6 * lauf;
      F.beine[0].knie.rotation.x = Math.max(0, -Math.cos(g.schritt * 5)) * 0.8 * lauf; F.beine[1].knie.rotation.x = Math.max(0, Math.cos(g.schritt * 5)) * 0.8 * lauf;
      F.arme[0].piv.rotation.x = -s * 0.5 * lauf; F.arme[1].piv.rotation.x = s * 0.5 * lauf;
      F.arme[0].ell.rotation.x = F.arme[1].ell.rotation.x = -0.3 - lauf * 0.2;
      F.huefte.position.y = 0.86 + Math.abs(Math.cos(g.schritt * 5)) * 0.04 * lauf + Math.sin(g.t * 2) * 0.006;
      var bauchExtra = clamp(Math.log(g.gs / START_G) * 0.08, 0, 0.28);
      var wackel = 1 + Math.sin(g.schritt * 10) * 0.02 * lauf;
      F.bauch.scale.set((1 + bauchExtra) * wackel, 1 + bauchExtra * 0.5, (1 + bauchExtra) / wackel);
      F.rumpf.rotation.x = lauf * 0.08;
      F.kopf.rotation.z = Math.sin(g.t * 1.6) * 0.04;
      if (g.kau > 0) { g.kau -= dt; F.schaedel.material.map = Math.floor(g.kau * 30) % 2 ? F.gesicht.auf : F.gesicht.zu; }
      else F.schaedel.material.map = F.gesicht.zu;
      if (!spiel && g.modus === 'intro') { F.arme[1].piv.rotation.x = -2.4 + Math.sin(g.t * 3) * 0.15; F.arme[1].piv.rotation.z = 0.5; } else F.arme[1].piv.rotation.z = 0.12;
      felix.updateMatrixWorld(true);
      F.mund.getWorldPosition(MUNDPOS);
      // Bissen fliegen in den Mund
      for (var n = fliegen.length - 1; n >= 0; n--) {
        var f = fliegen[n]; f.t += dt; var k = Math.min(1, f.t / f.dauer), e = k * k * (3 - 2 * k);
        f.m.position.set(lerp(f.x0, MUNDPOS.x, e), lerp(0, MUNDPOS.y, e) + Math.sin(k * Math.PI) * g.gs * 0.3, lerp(f.z0, MUNDPOS.z, e));
        f.m.scale.setScalar(f.s0 * (1 - e * 0.97)); f.m.rotation.y += dt * 6;
        if (k >= 1) { scene.remove(f.m); fliegen.splice(n, 1); kruemelWolke(MUNDPOS, 4, g.gs * 0.4); }
      }
      // Krümel
      kruemel.forEach(function (q) {
        if (!q.s.visible) return;
        q.t += dt; if (q.t > q.life) { q.s.visible = false; return; }
        q.v.y -= 9 * g.gs * 0.4 * dt; q.s.position.addScaledVector(q.v, dt); q.s.scale.setScalar(q.g * (1 - q.t / q.life));
      });
      // Fahrzeuge neu setzen
      var geaendert = {};
      dinge.forEach(function (o) { if (o.dyn && o.lebt) { setzeMatrix(o); geaendert[o.t] = true; } });
      Object.keys(geaendert).forEach(function (t) { meshe[t].instanceMatrix.needsUpdate = true; });
      // Menschen
      menschen.forEach(function (p) {
        dummy.position.set(p.x, Math.abs(Math.sin(p.ph)) * 0.06, p.z); dummy.rotation.set(0, p.rot, p.flucht > 0 ? Math.sin(p.ph) * 0.15 : 0); dummy.scale.setScalar(1); dummy.updateMatrix();
        menschMeshe[p.art].setMatrixAt(p.i, dummy.matrix);
        if (p.brot) { dummy.position.set(p.x + Math.cos(p.rot) * 0.36, 1.0 + Math.abs(Math.sin(p.ph)) * 0.06, p.z - Math.sin(p.rot) * 0.36); dummy.rotation.set(0, p.rot, 0.2); dummy.scale.setScalar(0.8); dummy.updateMatrix(); handBrot.setMatrixAt(p.k, dummy.matrix); }
        else handBrot.setMatrixAt(p.k, NULL);
      });
      menschMeshe.forEach(function (m) { m.instanceMatrix.needsUpdate = true; }); handBrot.instanceMatrix.needsUpdate = true;
      // Kamera: schräg von oben, zoomt mit Felix mit
      var hoch = box.clientHeight > box.clientWidth;
      if (spiel || g.modus === 'ende') {
        var dist = (5 + g.gs * 3) * (hoch ? 1.4 : 1), pitch = 0.85;
        var zx = g.x, zy = g.gs * 0.45, zz = g.z - g.gs * 0.25;
        cam.position.x += (zx - cam.position.x) * daempf(dt, 6);
        cam.position.y += (zy + Math.sin(pitch) * dist - cam.position.y) * daempf(dt, 4);
        cam.position.z += (zz + Math.cos(pitch) * dist - cam.position.z) * daempf(dt, 6);
        blick.x += (zx - blick.x) * daempf(dt, 8); blick.y += (zy - blick.y) * daempf(dt, 4); blick.z += (zz - blick.z) * daempf(dt, 8);
      } else {
        var an = Math.PI + 0.5 + g.t * 0.15, r = hoch ? 6.2 : 4.6;
        cam.position.set(g.x + Math.sin(an) * r, hoch ? 1.5 : 1.9, g.z + Math.cos(an) * r);
        blick.set(g.x, hoch ? -0.6 : 1.25, g.z);
        if (!hoch && box.clientWidth >= 900) { blick.x -= Math.cos(an) * 1.5; blick.z += Math.sin(an) * 1.5; }
      }
      cam.lookAt(blick);
      himmel.position.copy(cam.position);
      if (g.modus !== 'intro') verdeckung(dt);
      // Licht und Nebel wachsen mit
      var schattenGr = 12 + g.gs * 5;
      sonne.position.set(g.x + SONNE_DIR.x * (80 + g.gs * 4), SONNE_DIR.y * (80 + g.gs * 4), g.z + SONNE_DIR.z * (80 + g.gs * 4));
      sonne.target.position.set(g.x, 0, g.z);
      var sc = sonne.shadow.camera;
      if (Math.abs(sc.right - schattenGr) > 0.5) { sc.left = -schattenGr; sc.right = schattenGr; sc.top = schattenGr; sc.bottom = -schattenGr; sc.far = 300 + g.gs * 10; sc.updateProjectionMatrix(); }
      scene.fog.near = 90 + g.gs * 6; scene.fog.far = 320 + g.gs * 14;
      // Sprechblase
      if (blaseT > 0) {
        blaseT -= dt;
        proj.set(blaseP.x, 2.2, blaseP.z).project(cam);
        blaseEl.style.left = ((proj.x + 1) / 2 * box.clientWidth) + 'px'; blaseEl.style.top = ((1 - proj.y) / 2 * box.clientHeight) + 'px';
        if (blaseT <= 0) blaseEl.style.opacity = 0;
      }
      // HUD
      if (spiel) {
        $('groesse').textContent = fmt(g.gs) + ' m';
        $('jahr').textContent = 'Jahr ' + g.jahr + '/5';
        var uhr = $('uhr'); uhr.textContent = Math.floor(g.rest / 60) + ':' + String(Math.floor(g.rest % 60)).padStart(2, '0'); uhr.classList.toggle('knapp', g.rest < 15);
        $('balken').style.width = ((PLAN - g.rest) / PLAN * 100) + '%';
        if (Math.floor(g.t * 4) !== Math.floor((g.t - dt) * 4)) {
          var z = naechstesZiel();
          $('ziel').textContent = z ? 'Nächster Happen: ' + z.e + ' ' + z.name + ' ab ' + fmt(z.g / ESS) + ' m' : 'Die ganze Stadt ist aufgegessen!';
        }
        if (g.t > 10) $('tipp').style.opacity = 0;
      }
    }
    var blick = new THREE.Vector3();
    function render() { if (composer) composer.render(); else renderer.render(scene, cam); }

    var last = performance.now(), mess = { n: 0, sum: 0 };
    function tick(now) {
      if (!alive) return;
      var roh = (now - last) / 1000; last = now;
      if (roh < 0.5) { mess.n++; mess.sum += roh; }
      if (mess.n >= 90) {
        if (mess.sum / mess.n > 0.03) {
          if (dpr > 1) { dpr = Math.max(1, dpr - 0.3); renderer.setPixelRatio(dpr); resize(); }
          else if (renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; scene.traverse(function (o) { if (o.material) [].concat(o.material).forEach(function (m) { m.needsUpdate = true; }); }); }
          else if (composer) composer = null;
        }
        mess.n = 0; mess.sum = 0;
      }
      var dt = Math.min(Math.max(roh, 0), 0.25), rest = dt;
      while (rest > 1e-6) { var st = Math.min(rest, 1 / 30); physik(st); rest -= st; }
      darstellen(dt); render();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function intro() {
      ebene.classList.remove('aus');
      var best = +Pixel.get(BEST_KEY, 0);
      ebene.innerHTML =
        '<div class="fx-plakat"><div class="kopf"><small>CHEF DER UdSSR</small><h1>Genosse<br>Felix</h1><div class="stern">★</div></div><div class="innen">' +
        '<div class="unter">Das Volk hat Essen. Felix hat Hunger. Ein Fünfjahresplan – drei Minuten.</div>' +
        (best ? '<div class="zeile"><span>Rekordgröße</span><b>' + best + ' m</b></div>' : '') +
        '<ul><li>🍞 Iss alles, was kleiner ist als du – mit jedem Bissen wächst du.</li>' +
        '<li>🚗 Erst Brot und Pelmeni, dann Ladas und Birken, Plattenbauten … und am Ende den Kreml.</li>' +
        '<li>🙋 Den Leuten auf der Straße schnappst du das Brot aus der Hand.</li>' +
        '<li>🎮 WASD / Pfeiltasten oder ziehen (Maus/Finger).</li></ul>' +
        '<button class="fx-btn" data-act="los">Guten Appetit, Genosse!</button></div></div>';
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.ende) { aufraeumen(); reset(); neuAufbauen(); }
      g.modus = 'spiel';
      ebene.classList.add('aus'); hud.classList.add('an'); $('tipp').style.opacity = 0.95;
      allesLos(); blick.set(g.x, 1, g.z);
      Pixel.sfx.tone(392, 0.14, 'square', 0.05); Pixel.sfx.tone(523, 0.14, 'square', 0.05, null, 0.15); Pixel.sfx.tone(659, 0.3, 'square', 0.05, null, 0.3);
    }
    function ende() {
      if (g.modus !== 'spiel') return;
      g.modus = 'ende'; g.ende = true; hud.classList.remove('an'); allesLos();
      var punkte = Math.round(g.gs), best = +Pixel.get(BEST_KEY, 0), neu = punkte > best;
      if (neu) Pixel.set(BEST_KEY, punkte);
      Pixel.sfx.tone(523, 0.15, 'square', 0.05); Pixel.sfx.tone(392, 0.15, 'square', 0.05, null, 0.15); Pixel.sfx.tone(262, 0.4, 'square', 0.05, null, 0.3);
      var ge = g.gegessen, titel = g.gs >= 40 ? 'Plan<br>übererfüllt!' : g.gs >= 12 ? 'Plan<br>erfüllt!' : 'Plan<br>verfehlt …';
      setTimeout(function () {
        if (!alive) return;
        ebene.classList.remove('aus');
        ebene.innerHTML =
          '<div class="fx-plakat"><div class="kopf"><small>FÜNFJAHRESPLAN BEENDET</small><h1>' + titel + '</h1><div class="stern">★</div></div><div class="innen">' +
          '<div class="zeile"><span>Endgröße</span><b>' + fmt(g.gs) + ' m' + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Snacks</span><b>' + ge.snack + '</b></div>' +
          '<div class="zeile"><span>Geklaute Brote</span><b>' + ge.brot + '</b></div>' +
          '<div class="zeile"><span>Fahrzeuge &amp; Dinge</span><b>' + (ge.fahrzeug + ge.ding) + '</b></div>' +
          '<div class="zeile"><span>Gebäude &amp; Wahrzeichen</span><b>' + (ge.bau + ge.wahr) + '</b></div>' +
          '<div class="zeile"><span>Rekord</span><b>' + Math.max(best, punkte) + ' m</b></div>' +
          '<button class="fx-btn" data-act="los">Neuer Fünfjahresplan</button>' +
          '<button class="fx-btn zweit" data-act="exit">Menü</button></div></div>';
      }, 800);
    }
    // Für eine neue Runde alles Gegessene zurückholen
    function aufraeumen() {
      fliegen.forEach(function (f) { scene.remove(f.m); }); fliegen.length = 0;
    }
    function neuAufbauen() {
      dinge.forEach(function (o) { o.lebt = true; setzeMatrix(o); });
      Object.keys(meshe).forEach(function (t) { meshe[t].instanceMatrix.needsUpdate = true; });
      menschen.forEach(function (p) { p.brot = Math.random() < 0.8; });
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
      document.removeEventListener('visibilitychange', sichtbar);
      root.removeEventListener('click', onClick);
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
      });
      F.gesicht.zu.dispose(); F.gesicht.auf.dispose();
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch (e) {}
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize); window.addEventListener('blur', allesLos);
    document.addEventListener('visibilitychange', sichtbar);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    if (window.matchMedia && matchMedia('(pointer: coarse)').matches) $('tipp').textContent = 'Finger auf den Bildschirm und ziehen';
    window.__felix = { g: function () { return g; }, renderer: renderer, dinge: dinge, cam: cam, stick: stick };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.felix = { start: start };
})();
