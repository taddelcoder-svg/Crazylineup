// Sinan: Krabbe vs. Muay Thai – 3D-Kampf im Ring am Strand (three.js).
// Sinan ist Muay-Thai-Kämpfer. Du bist eine Krabbe. Klein, seitwärts, mit Scheren.
// Steuern: A/D bzw. ←/→ laufen · W/↑/Leertaste springen · J/F zwicken · K/Shift Krabben-Tornado (wenn WUT voll)
// Sinans Angriffe: Low Kick (drüberspringen), Stampfer (wegrennen), Knie (nicht direkt vor ihm springen),
// Schlagkombi (geht über die Krabbe weg – danach ist er offen).
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.sinan.best';
  var RAND = 3.5, SINAN_HP = 520, KRABBE_HP = 100, GRAV = 20, SPRUNG = 7.2;

  var SPRUECHE = {
    start: ['Komm her, du Meeresfrüchte!', 'Muay Thai, Bruder!', 'Ich hab schon gegen Größere gewonnen!', 'Wer hat die Krabbe reingelassen?!'],
    au: ['AUA!', 'MEIN ZEH!', 'Ey, nicht zwicken!', 'Das ist unfair!', 'Ahh, mein Schienbein!'],
    nase: ['MEINE NASE!!', 'Nicht ins Gesicht!', 'Waaah!'],
    po: ['NICHT DA!!', 'Mein Hintern!', 'Von HINTEN?!'],
    luft: ['Wieso bist du so klein?!', 'Wo bist du?!', 'Halt still!', 'Ich seh dich nicht!'],
    treffer: ['Muay Thai!', 'Geht doch!', 'Ab ins Wasser mit dir!', 'Krabbensalat!'],
    weg: ['Wo ist der hin?!', 'Hinter mir?!', 'Seitwärts ist cheaten!'],
    runde2: ['Jetzt wird’s ernst!', 'Okay. Jetzt bin ich sauer.'],
    runde3: ['ICH BIN DER KING HIER!', 'Letzte Runde, Krabbe!'],
    ko: ['Das … war … eine Krabbe …', 'Erzählt das keinem …'],
    sieg: ['Muay Thai > Meeresfrüchte.', 'Nächstes Mal bring ich Zitrone mit.']
  };

  var CSS = [
    '.sn{position:absolute;inset:0;overflow:hidden;background:#2a1e30;font-family:"Barlow Semi Condensed","Arial Narrow",Arial,sans-serif;color:#fff;touch-action:none;-webkit-user-select:none;user-select:none}',
    '.sn canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.sn-hud{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .4s}',
    '.sn-hud.an{opacity:1}',
    '.sn-leisten{position:absolute;left:calc(64px + env(safe-area-inset-left));right:calc(64px + env(safe-area-inset-right));top:calc(12px + env(safe-area-inset-top));display:flex;gap:14px;align-items:flex-start}',
    '.sn-leiste{flex:1;min-width:0}',
    '.sn-leiste .name{display:flex;justify-content:space-between;font-weight:800;font-size:clamp(15px,3.4vw,20px);letter-spacing:.04em;text-shadow:0 2px 6px rgba(0,0,0,.6)}',
    '.sn-leiste .bar{height:14px;background:rgba(0,0,0,.55);border:2px solid #fff;border-radius:3px;overflow:hidden;margin-top:3px;position:relative}',
    '.sn-leiste .bar i{position:absolute;top:0;bottom:0;left:0;background:#ff9a3a;transition:width .12s;font-style:normal}',
    '.sn-leiste .bar b{position:absolute;top:0;bottom:0;left:0;background:#fff;transition:width .6s .2s}',
    '.sn-leiste.rechts .bar i,.sn-leiste.rechts .bar b{left:auto;right:0}',
    '.sn-leiste.rechts .bar i{background:#e83a4a}',
    '.sn-leiste.rechts .name{flex-direction:row-reverse}',
    '.sn-wut{height:7px;background:rgba(0,0,0,.5);border:2px solid rgba(255,255,255,.7);border-radius:3px;margin-top:4px;width:70%;overflow:hidden}',
    '.sn-wut i{display:block;height:100%;width:0;background:#ffd23f;font-style:normal;transition:width .15s}',
    '.sn-wut.voll{border-color:#ffd23f;animation:snBlink .4s infinite alternate}',
    '@keyframes snBlink{from{box-shadow:0 0 0 rgba(255,210,63,0)}to{box-shadow:0 0 14px rgba(255,210,63,.9)}}',
    '.sn-mitte{text-align:center;font-weight:800;font-size:clamp(14px,3vw,18px);text-shadow:0 2px 6px rgba(0,0,0,.6);white-space:nowrap;padding-top:2px}',
    '.sn-mitte b{display:block;font-size:clamp(20px,4.6vw,28px);line-height:1;color:#ffd23f}',
    '.sn-meldung{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);font-size:clamp(34px,8vw,64px);font-weight:800;color:#ffd23f;letter-spacing:.03em;',
    ' text-shadow:0 0 18px rgba(0,0,0,.5),0 4px 0 rgba(0,0,0,.45);opacity:0;white-space:nowrap;text-align:center}',
    '.sn-meldung small{display:block;font-size:.4em;color:#fff;letter-spacing:0}',
    '.sn-meldung.zeigen{animation:snPop 1.4s ease-out}',
    '@keyframes snPop{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}78%{opacity:1}100%{opacity:0;transform:translate(-50%,-70%)}}',
    '.sn-warn{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);font-size:clamp(20px,4.6vw,30px);font-weight:800;color:#fff;background:rgba(220,40,50,.85);',
    ' padding:4px 14px;border-radius:6px;opacity:0;transition:opacity .08s;white-space:nowrap}',
    '.sn-warn.an{opacity:1}',
    '.sn-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#1a1a22;border-radius:12px;padding:6px 12px;font-weight:700;font-size:clamp(15px,3.4vw,19px);',
    ' white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.35);opacity:0;transition:opacity .15s;pointer-events:none}',
    '.sn-blase.an{opacity:1}',
    '.sn-blase:after{content:"";position:absolute;left:50%;bottom:-8px;border:8px solid transparent;border-top-color:#fff;border-bottom:0;transform:translateX(-50%)}',
    '.sn-zahl{position:absolute;transform:translate(-50%,-50%);font-weight:800;font-size:clamp(18px,4vw,26px);color:#ffd23f;text-shadow:0 2px 0 rgba(0,0,0,.6),0 0 10px rgba(0,0,0,.4);',
    ' pointer-events:none;white-space:nowrap;animation:snZahl .9s ease-out forwards}',
    '.sn-zahl.rot{color:#ff5a5a}.sn-zahl.weiss{color:#fff;font-size:clamp(15px,3.2vw,20px)}',
    '@keyframes snZahl{0%{opacity:0;margin-top:0;transform:translate(-50%,-50%) scale(.6)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}100%{opacity:0;margin-top:-50px;transform:translate(-50%,-50%) scale(1)}}',
    '.sn-rot{position:absolute;inset:0;box-shadow:inset 0 0 140px rgba(255,40,40,0);transition:box-shadow .4s;pointer-events:none}',
    '.sn-rot.an{box-shadow:inset 0 0 160px rgba(255,40,40,.7);transition:none}',
    '.sn-knopf{position:absolute;top:calc(12px + env(safe-area-inset-top));width:42px;height:42px;border-radius:8px;border:2px solid rgba(255,255,255,.6);',
    ' background:rgba(60,30,40,.8);color:#fff;font:700 20px/1 sans-serif;cursor:pointer;z-index:20}',
    '.sn-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;align-items:flex-end;padding:0 12px calc(12px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.sn-pad.an{display:flex}',
    '.sn-pad div{display:flex;gap:8px;align-items:flex-end}',
    '.sn-pad button{pointer-events:auto;width:62px;height:62px;border-radius:50%;border:3px solid rgba(255,255,255,.8);background:rgba(30,20,30,.45);color:#fff;',
    ' font:800 15px/1.1 "Barlow Semi Condensed",sans-serif;touch-action:none}',
    '.sn-pad button.gross{width:80px;height:80px;font-size:18px;background:rgba(232,90,40,.5)}',
    '.sn-pad button.wut{opacity:.35}.sn-pad button.wut.bereit{opacity:1;background:rgba(255,210,63,.55);border-color:#ffd23f}',
    '.sn-pad button.gedrueckt{background:rgba(255,154,58,.8)}',
    '.sn-ebene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:10;transition:opacity .4s;overflow:auto}',
    '.sn-ebene.aus{opacity:0;pointer-events:none}',
    '@media (min-width:900px){.sn-ebene{justify-content:flex-start;padding-left:6vw}}',
    '@media (max-width:899px) and (orientation:portrait){.sn-ebene{align-items:flex-end;padding-bottom:calc(16px + env(safe-area-inset-bottom))}}',
    '.sn-karte{background:rgba(24,14,24,.88);border:3px solid #ffd23f;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,.55);padding:20px 22px 18px;width:min(470px,100%);',
    ' font-family:"Pixelify Sans","Barlow Semi Condensed",sans-serif;margin:auto 0}',
    '.sn-karte h1{margin:0;font-family:"Barlow Semi Condensed",sans-serif;font-size:clamp(38px,8.5vw,60px);font-weight:800;line-height:.92;color:#ffd23f;letter-spacing:.01em}',
    '.sn-karte h1 span{color:#fff}',
    '.sn-karte .unter{font-size:18px;opacity:.92;margin:8px 0 12px}',
    '.sn-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(255,255,255,.25);padding:6px 0;font-size:18px}',
    '.sn-karte .zeile b{font-family:"Barlow Semi Condensed",sans-serif;font-size:22px;font-weight:800;color:#ffd23f}',
    '.sn-karte ul{margin:8px 0 14px;padding:0;list-style:none;font-size:16px;line-height:1.45}',
    '.sn-karte .zitat{font-size:18px;margin:2px 0 10px}',
    '.sn-btn{width:100%;border:0;border-radius:8px;background:#ffd23f;color:#2a1a10;font-family:"Barlow Semi Condensed",sans-serif;font-weight:800;font-size:25px;padding:11px 16px;cursor:pointer}',
    '.sn-btn:active{transform:scale(.98)}',
    '.sn-btn.zweit{margin-top:10px;background:transparent;color:#fff;border:2px solid rgba(255,255,255,.55);font-size:19px;padding:7px}',
    '@media (max-width:899px) and (orientation:portrait){.sn-karte h1{font-size:40px}.sn-karte{padding:16px 18px 14px}.sn-karte ul{font-size:14px;margin:6px 0 10px}}',
    '.sn-fehler{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-size:20px;z-index:30;background:#2a1e30}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="sn"><canvas></canvas>' +
      '<div class="sn-hud" data-el="hud">' +
        '<div class="sn-leisten">' +
          '<div class="sn-leiste"><div class="name"><span>🦀 KRABBE</span></div><div class="bar"><b data-el="kSchatten"></b><i data-el="kHp"></i></div>' +
            '<div class="sn-wut" data-el="wutBox"><i data-el="wut"></i></div></div>' +
          '<div class="sn-mitte"><b data-el="punkte">0</b><span data-el="runde">RUNDE 1</span></div>' +
          '<div class="sn-leiste rechts"><div class="name"><span>SINAN 🥊</span></div><div class="bar"><b data-el="sSchatten"></b><i data-el="sHp"></i></div></div>' +
        '</div>' +
        '<div class="sn-meldung" data-el="meldung"></div>' +
        '<div class="sn-warn" data-el="warn"></div>' +
        '<div class="sn-blase" data-el="blase"></div>' +
        '<div class="sn-rot" data-el="rot"></div>' +
      '</div>' +
      '<div class="sn-pad" data-el="pad"><div><button data-pad="links" aria-label="Nach links">◀</button><button data-pad="rechts" aria-label="Nach rechts">▶</button></div>' +
        '<div><button class="wut" data-pad="tornado" aria-label="Krabben-Tornado">TOR-<br>NADO</button><button data-pad="sprung" aria-label="Springen">SPRUNG</button>' +
        '<button class="gross" data-pad="zwick" aria-label="Zwicken">ZWICK</button></div></div>' +
      '<button class="sn-knopf" style="left:calc(12px + env(safe-area-inset-left))" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
      '<button class="sn-knopf" style="right:calc(12px + env(safe-area-inset-right))" data-act="ton" aria-label="Ton an/aus"></button>' +
      '<div class="sn-ebene" data-el="ebene"></div></div>';
    root.appendChild(style);
    var box = root.querySelector('.sn'), canvas = root.querySelector('canvas');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var hudEl = $('hud'), ebene = $('ebene'), pad = $('pad'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, timeouts = [], meldT = 0;
    var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    function spaeter(fn, ms) { var id = setTimeout(function () { if (alive) fn(); }, ms); timeouts.push(id); }

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      box.insertAdjacentHTML('beforeend', '<div class="sn-fehler">Dein Browser konnte die 3D-Grafik nicht starten. Schließ andere Tabs mit 3D-Inhalten und lade neu.</div>');
      return function () {};
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    renderer.setPixelRatio(dpr);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.88;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xc87a6a, 35, 120);
    var cam = new THREE.PerspectiveCamera(42, 1, 0.1, 400);

    // ---------- Texturen ----------
    function canvasTex(w, h, paint, srgb) {
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      paint(c.getContext('2d'), w, h);
      var t = new THREE.CanvasTexture(c);
      if (srgb !== false) t.encoding = THREE.sRGBEncoding;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return t;
    }
    var himmelTex = canvasTex(4, 256, function (x, w, h) {
      var gr = x.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, '#141c4a'); gr.addColorStop(0.35, '#5a3470'); gr.addColorStop(0.6, '#c8606a'); gr.addColorStop(0.72, '#e8946a'); gr.addColorStop(1, '#d88a6a');
      x.fillStyle = gr; x.fillRect(0, 0, w, h);
    });
    var glowTex = canvasTex(128, 128, function (x, w) {
      var gr = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, w, w);
    }, false);
    var mattenTex = canvasTex(1024, 512, function (x, w, h) {
      x.fillStyle = '#2a5ab8'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 2600; i++) { x.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.04) + ')'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 8; x.strokeRect(24, 24, w - 48, h - 48);
      x.save(); x.translate(w / 2, h / 2); x.scale(1, 0.62);
      x.fillStyle = 'rgba(255,255,255,.16)'; x.beginPath(); x.arc(0, 0, 150, 0, Math.PI * 2); x.fill(); x.restore();
      x.fillStyle = 'rgba(255,255,255,.55)'; x.font = '800 64px "Barlow Semi Condensed", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('CRAZY LINEUP', w / 2, h / 2 - 14);
      x.font = '700 30px "Barlow Semi Condensed", Arial, sans-serif'; x.fillStyle = 'rgba(255,210,63,.7)'; x.fillText('BEACH FIGHT NIGHT', w / 2, h / 2 + 38);
    });
    var sandTex = canvasTex(256, 256, function (x, w, h) {
      x.fillStyle = '#e2c08a'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 5000; i++) { var v = Math.random(); x.fillStyle = v < 0.5 ? 'rgba(160,120,70,.18)' : 'rgba(255,240,210,.22)'; x.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
    });
    sandTex.wrapS = sandTex.wrapT = THREE.RepeatWrapping; sandTex.repeat.set(30, 30);
    var schuerzeTex = canvasTex(512, 64, function (x, w, h) {
      x.fillStyle = '#1a2a6a'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#ffd23f'; x.font = '800 34px "Barlow Semi Condensed", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('KRABBE  VS.  SINAN', w / 2, h / 2 + 2);
    });

    // ---------- Licht & Umgebung ----------
    var himmel = new THREE.Mesh(new THREE.SphereGeometry(180, 32, 16), new THREE.MeshBasicMaterial({ map: himmelTex, side: THREE.BackSide, fog: false }));
    scene.add(himmel);
    scene.add(new THREE.HemisphereLight(0xffd0b0, 0x4a3a5a, 0.6));
    var sonne = new THREE.DirectionalLight(0xffc890, 1.25);
    sonne.position.set(-6, 9, -10); sonne.castShadow = true;
    sonne.shadow.mapSize.set(1024, 1024);
    var sc = sonne.shadow.camera; sc.left = -7; sc.right = 7; sc.top = 6; sc.bottom = -4; sc.near = 1; sc.far = 40;
    sonne.shadow.bias = -0.0008;
    scene.add(sonne);
    var fuell = new THREE.DirectionalLight(0x9ab0ff, 0.45); fuell.position.set(5, 4, 8); scene.add(fuell);

    var sonnenScheibe = new THREE.Mesh(new THREE.CircleGeometry(9, 32), new THREE.MeshBasicMaterial({ color: 0xffd890, fog: false }));
    sonnenScheibe.position.set(-14, 6, -150); scene.add(sonnenScheibe);
    var sonnenGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xff8a50, transparent: true, depthWrite: false, fog: false, opacity: 0.6 }));
    sonnenGlow.scale.set(80, 80, 1); sonnenGlow.position.set(-14, 6, -149); scene.add(sonnenGlow);

    var meerGeo = new THREE.PlaneGeometry(400, 140, 80, 28); meerGeo.rotateX(-Math.PI / 2);
    var meer = new THREE.Mesh(meerGeo, new THREE.MeshStandardMaterial({ color: 0x2a5a8a, roughness: 0.25, metalness: 0.35 }));
    meer.position.set(0, -1.3, -88); scene.add(meer);
    var meerBasis = meerGeo.attributes.position.array.slice();
    var sand = new THREE.Mesh(new THREE.PlaneGeometry(400, 60), new THREE.MeshStandardMaterial({ map: sandTex, roughness: 1 }));
    sand.rotation.x = -Math.PI / 2; sand.position.set(0, -0.85, 4); sand.receiveShadow = true; scene.add(sand);

    function std(c, o) { var m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, metalness: 0 }); if (o) for (var k in o) m[k] = o[k]; return m; }
    function mesh(geo, mat, x, y, z, schatten) { var m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); if (schatten !== false) { m.castShadow = true; m.receiveShadow = true; } return m; }

    // Ring
    var ring = new THREE.Group(); scene.add(ring);
    ring.add(mesh(new THREE.BoxGeometry(9.2, 0.85, 5.6), [std(0x1a2a6a), std(0x1a2a6a), std(0x2a5ab8), std(0x1a2a6a), std(0xffffff, { map: schuerzeTex }), std(0x1a2a6a)], 0, -0.425, 0));
    var matte = mesh(new THREE.PlaneGeometry(9.2, 5.6), std(0xffffff, { map: mattenTex, roughness: 0.85 }), 0, 0.002, 0);
    matte.rotation.x = -Math.PI / 2; matte.castShadow = false; ring.add(matte);
    var ecken = [[-4.4, -2.6, 0xd83a3a], [4.4, -2.6, 0x3a6ad8], [-4.4, 2.6, 0xf2f2f2], [4.4, 2.6, 0xf2f2f2]];
    ecken.forEach(function (e) {
      ring.add(mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.6, 10), std(0xb8b8c0, { metalness: 0.6, roughness: 0.35 }), e[0], 0.8, e[1]));
      ring.add(mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), std(e[2]), e[0], 0.95, e[1]));
    });
    var seilFarben = [0xd83a3a, 0xf2f2f2, 0x3a6ad8];
    [0.5, 0.95, 1.4].forEach(function (h, i) {
      var mat = std(seilFarben[i], { roughness: 0.5 });
      var hinten = mesh(new THREE.CylinderGeometry(0.035, 0.035, 8.8, 8), mat, 0, h, -2.6); hinten.rotation.z = Math.PI / 2; ring.add(hinten);
      [-4.4, 4.4].forEach(function (x) { var s = mesh(new THREE.CylinderGeometry(0.035, 0.035, 5.2, 8), mat, x, h, 0); s.rotation.x = Math.PI / 2; ring.add(s); });
    });

    // Palmen
    function palme(x, z, h, neig) {
      var p = new THREE.Group(), stamm = std(0x8a6a42, { roughness: 0.95 }), blatt = std(0x2a7a3a, { roughness: 0.8, side: THREE.DoubleSide });
      var n = 9, px = 0, py = 0;
      for (var i = 0; i < n; i++) {
        var t = i / n, s = mesh(new THREE.CylinderGeometry(0.16 - t * 0.05, 0.19 - t * 0.05, h / n + 0.05, 8), stamm, px, py + h / n / 2, 0);
        s.rotation.z = -neig * (0.3 + t); p.add(s); px += Math.sin(neig * (0.3 + t)) * h / n; py += Math.cos(neig * (0.3 + t)) * h / n;
      }
      for (var k = 0; k < 7; k++) {
        var b = new THREE.Group(); b.position.set(px, py, 0); b.rotation.y = k / 7 * Math.PI * 2;
        var bl = mesh(new THREE.ConeGeometry(0.45, 2.6, 4, 1), blatt, 0, 0, 1.2); bl.scale.set(1, 1, 0.12); bl.rotation.x = Math.PI / 2 + 0.55; b.add(bl);
        p.add(b);
      }
      for (k = 0; k < 3; k++) p.add(mesh(new THREE.SphereGeometry(0.14, 8, 6), std(0x5a3a1a), px + Math.cos(k * 2) * 0.18, py - 0.15, Math.sin(k * 2) * 0.18));
      p.position.set(x, -0.85, z); scene.add(p);
    }
    palme(-9, -5, 6.5, 0.25); palme(-12.5, -1, 5.2, 0.4); palme(9.5, -4.5, 7, -0.2); palme(13, 0.5, 5.5, -0.35); palme(-7.5, -12, 6, 0.1); palme(15, -14, 6.5, -0.15);

    // Fackeln
    var fackeln = [];
    [[-6.2, 1.2], [6.2, 1.2], [-6.2, -3.4], [6.2, -3.4]].forEach(function (p) {
      var f = new THREE.Group(); f.position.set(p[0], -0.85, p[1]); scene.add(f);
      f.add(mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.2, 8), std(0x5a3a22), 0, 1.1, 0));
      f.add(mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.3, 8), std(0x3a2a1a), 0, 2.3, 0));
      var fl = mesh(new THREE.ConeGeometry(0.15, 0.5, 8), new THREE.MeshBasicMaterial({ color: 0xffb040 }), 0, 2.65, 0, false); f.add(fl);
      var gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xff8030, transparent: true, depthWrite: false, opacity: 0.8 })); gl.scale.set(1.6, 1.6, 1); gl.position.set(0, 2.65, 0); f.add(gl);
      fackeln.push({ fl: fl, gl: gl, ph: Math.random() * 10 });
    });
    var fackelLicht = new THREE.PointLight(0xff9040, 0.9, 12, 2); fackelLicht.position.set(0, 2.2, 1.5); scene.add(fackelLicht);

    // ---------- Krabbe ----------
    function baueKrabbe(groesse, farbe) {
      var k = { root: new THREE.Group(), beine: [], scheren: [], augen: [] };
      var koerperMat = std(farbe, { roughness: 0.45 }), hell = std(0xffa070, { roughness: 0.5 }), dunkel = std(0x8a2a12, { roughness: 0.6 });
      var kipp = new THREE.Group(); k.root.add(kipp); k.kipp = kipp;
      var koerper = new THREE.Group(); koerper.position.y = 0.34; kipp.add(koerper); k.koerper = koerper;
      var panzer = mesh(new THREE.SphereGeometry(0.42, 24, 16), koerperMat); panzer.scale.set(1, 0.5, 0.78); koerper.add(panzer);
      var bauch = mesh(new THREE.SphereGeometry(0.4, 20, 12), hell, 0, -0.04, 0); bauch.scale.set(0.95, 0.38, 0.74); koerper.add(bauch);
      [[-0.18, 0.15, 0.12], [0.16, 0.17, 0.05], [0, 0.2, -0.12], [0.24, 0.12, -0.15], [-0.25, 0.1, -0.08]].forEach(function (p) {
        var f = mesh(new THREE.SphereGeometry(0.05, 8, 6), dunkel, p[0], p[1], p[2], false); f.scale.y = 0.4; koerper.add(f);
      });
      // Augen auf Stielen (schauen in die Kamera)
      [-1, 1].forEach(function (s) {
        var st = new THREE.Group(); st.position.set(s * 0.11, 0.14, 0.2); koerper.add(st);
        st.add(mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.2, 6), koerperMat, 0, 0.1, 0));
        var aug = mesh(new THREE.SphereGeometry(0.065, 12, 10), std(0xffffff, { roughness: 0.2 }), 0, 0.22, 0); st.add(aug);
        var pup = mesh(new THREE.SphereGeometry(0.036, 10, 8), std(0x101010, { roughness: 0.1 }), 0, 0.225, 0.045, false); st.add(pup);
        k.augen.push({ st: st, pup: pup, s: s });
      });
      var mund = mesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), dunkel, 0, 0.0, 0.33, false); koerper.add(mund);
      // Beine: 3 pro Seite
      [-1, 1].forEach(function (s) {
        for (var i = 0; i < 3; i++) {
          var b = new THREE.Group(); b.position.set(s * 0.3, -0.02, 0.12 - i * 0.16); koerper.add(b);
          var ob = new THREE.Group(); ob.rotation.z = s * 0.6; b.add(ob);
          var o1 = mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.26, 6), koerperMat, s * 0.13, 0, 0); o1.rotation.z = s * Math.PI / 2; ob.add(o1);
          var ub = new THREE.Group(); ub.position.x = s * 0.26; ob.add(ub);
          var u = mesh(new THREE.CylinderGeometry(0.03, 0.012, 0.46, 6), koerperMat, 0, -0.23, 0); ub.add(u);
          ub.rotation.z = -s * 0.6 + s * 0.15;
          k.beine.push({ g: b, ob: ob, ub: ub, s: s, i: i });
        }
      });
      // Scheren
      [-1, 1].forEach(function (s) {
        var arm = new THREE.Group(); arm.position.set(s * 0.3, 0.06, 0.22); koerper.add(arm);
        arm.add(mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.28, 8), koerperMat, 0, 0.14, 0));
        var hand = new THREE.Group(); hand.position.y = 0.3; arm.add(hand);
        var palm = mesh(new THREE.SphereGeometry(0.14, 14, 10), koerperMat, 0, 0.06, 0); palm.scale.set(0.85, 1.1, 0.7); hand.add(palm);
        var oben = mesh(new THREE.ConeGeometry(0.075, 0.26, 8), koerperMat, s * 0.04, 0.27, 0); oben.rotation.z = -s * 0.12; hand.add(oben);
        var finger = new THREE.Group(); finger.position.set(-s * 0.06, 0.14, 0); hand.add(finger);
        var unten = mesh(new THREE.ConeGeometry(0.05, 0.22, 8), hell, 0, 0.11, 0); finger.add(unten);
        k.scheren.push({ arm: arm, hand: hand, finger: finger, s: s, zwick: 0 });
      });
      k.root.scale.setScalar(groesse);
      return k;
    }
    var krabbe = baueKrabbe(0.95, 0xe0502a); scene.add(krabbe.root);
    var zuschauer = [];
    [[-3.2, -3.0, 0.5], [-2.2, -3.05, 0.45], [2.4, -3.0, 0.5], [3.4, -3.05, 0.42], [-0.6, -3.1, 0.4], [0.9, -3.0, 0.47]].forEach(function (p, i) {
      var z = baueKrabbe(p[2], [0xd8482a, 0xe86a3a, 0xc83a2a][i % 3]); z.root.position.set(p[0], 0, p[1]); scene.add(z.root);
      zuschauer.push({ k: z, ph: Math.random() * 6, jubel: 0 });
    });

    // ---------- Sinan ----------
    function baueSinan() {
      var S = { root: new THREE.Group(), j: {} }, j = S.j;
      var haut = std(0xe0b08a, { roughness: 0.65 }), schwarz = std(0x18181e, { roughness: 0.8 }), rot = std(0xd02a2a, { roughness: 0.45 }),
        weiss = std(0xf2f2ee, { roughness: 0.7 }), haar = std(0x141010, { roughness: 0.55 }), fade = std(0x5a4636, { roughness: 0.9 }), gold = std(0xe8c040, { roughness: 0.35, metalness: 0.5 });
      var kipp = new THREE.Group(); S.root.add(kipp); j.kipp = kipp;
      var huefte = new THREE.Group(); huefte.position.y = 0.95; kipp.add(huefte); j.huefte = huefte;
      // Muay-Thai-Shorts
      var shorts = mesh(new THREE.CylinderGeometry(0.21, 0.26, 0.32, 14), rot, 0, -0.06, 0); huefte.add(shorts);
      huefte.add(mesh(new THREE.CylinderGeometry(0.215, 0.215, 0.07, 14), weiss, 0, 0.1, 0));
      huefte.add(mesh(new THREE.BoxGeometry(0.12, 0.08, 0.02), gold, 0, -0.02, 0.24));
      // Oberkörper
      var torso = new THREE.Group(); torso.position.y = 0.12; huefte.add(torso); j.torso = torso;
      var brust = mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.5, 14), schwarz, 0, 0.25, 0); brust.scale.z = 0.68; torso.add(brust);
      var schult = mesh(new THREE.SphereGeometry(0.25, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), schwarz, 0, 0.48, 0); schult.scale.set(1.05, 0.4, 0.7); torso.add(schult);
      // Logo (klein: blau-weiß-rot)
      [[0x1e2a6a, -0.03], [0xf2f2f2, 0], [0xd02a2a, 0.03]].forEach(function (l) { torso.add(mesh(new THREE.BoxGeometry(0.03, 0.025, 0.01), std(l[0]), 0.09 + l[1], 0.38, 0.165, false)); });
      torso.add(mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.12, 10), haut, 0, 0.56, 0));
      // Kopf
      var kopf = new THREE.Group(); kopf.position.y = 0.62; torso.add(kopf); j.kopf = kopf;
      var gesicht = mesh(new THREE.SphereGeometry(0.135, 20, 16), haut, 0, 0.1, 0); gesicht.scale.set(0.92, 1.12, 1); kopf.add(gesicht);
      var seiten = mesh(new THREE.SphereGeometry(0.139, 20, 12, 0, Math.PI * 2, 0, 1.75), fade, 0, 0.11, -0.008); seiten.scale.set(0.93, 1.12, 1); seiten.rotation.x = -0.35; kopf.add(seiten);
      var oben = mesh(new THREE.SphereGeometry(0.15, 22, 14, 0, Math.PI * 2, 0, 1.2), haar, 0, 0.12, -0.012); oben.scale.set(0.96, 1.1, 1.06); oben.rotation.x = -0.28; kopf.add(oben);
      var tolle = mesh(new THREE.SphereGeometry(0.1, 16, 10), haar, 0, 0.225, 0.05); tolle.scale.set(1.15, 0.45, 0.9); tolle.rotation.x = -0.25; kopf.add(tolle);
      [-1, 1].forEach(function (s) {
        kopf.add(mesh(new THREE.SphereGeometry(0.03, 8, 6), haut, s * 0.125, 0.09, 0));
        kopf.add(mesh(new THREE.SphereGeometry(0.017, 8, 6), std(0x1a1008, { roughness: 0.2 }), s * 0.045, 0.12, 0.124, false));
        var br = mesh(new THREE.BoxGeometry(0.055, 0.014, 0.015), haar, s * 0.047, 0.158, 0.122, false); br.rotation.z = s * -0.12; kopf.add(br);
      });
      kopf.add(mesh(new THREE.BoxGeometry(0.03, 0.05, 0.03), haut, 0, 0.085, 0.135, false));
      var mund = mesh(new THREE.BoxGeometry(0.06, 0.012, 0.01), std(0x8a3a32), 0.008, 0.035, 0.128, false); kopf.add(mund); S.mund = mund;
      // Mongkol (Stirnband)
      var mong = mesh(new THREE.TorusGeometry(0.135, 0.017, 8, 24), rot, 0, 0.17, -0.005); mong.rotation.x = Math.PI / 2 - 0.25; mong.scale.set(0.95, 1.02, 1); kopf.add(mong);
      var schw = mesh(new THREE.CylinderGeometry(0.012, 0.004, 0.22, 6), rot, 0, 0.1, -0.16); schw.rotation.x = -0.5; kopf.add(schw);
      // Arme
      [-1, 1].forEach(function (s) {
        var sh = new THREE.Group(); sh.position.set(s * 0.27, 0.45, 0); torso.add(sh);
        sh.add(mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.3, 10), schwarz, 0, -0.14, 0));
        var el = new THREE.Group(); el.position.y = -0.29; sh.add(el);
        el.add(mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.24, 10), haut, 0, -0.11, 0));
        el.add(mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.07, 10), weiss, 0, -0.21, 0));
        var hs = mesh(new THREE.SphereGeometry(0.09, 14, 12), rot, 0, -0.29, 0.01); hs.scale.set(0.95, 1.1, 1); el.add(hs);
        el.add(mesh(new THREE.CylinderGeometry(0.075, 0.07, 0.06, 10), weiss, 0, -0.22, 0));
        j[s > 0 ? 'lSh' : 'rSh'] = sh; j[s > 0 ? 'lEl' : 'rEl'] = el;
      });
      // Beine (barfuß, Knöchelbandagen)
      [-1, 1].forEach(function (s) {
        var hp = new THREE.Group(); hp.position.set(s * 0.12, -0.08, 0); huefte.add(hp);
        hp.add(mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.22, 10), rot, 0, -0.08, 0));
        hp.add(mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.3, 10), haut, 0, -0.27, 0));
        var kn = new THREE.Group(); kn.position.y = -0.42; hp.add(kn);
        kn.add(mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.4, 10), haut, 0, -0.2, 0));
        kn.add(mesh(new THREE.CylinderGeometry(0.056, 0.056, 0.07, 10), weiss, 0, -0.37, 0));
        kn.add(mesh(new THREE.BoxGeometry(0.1, 0.06, 0.22), haut, 0, -0.43, 0.05));
        j[s > 0 ? 'lHip' : 'rHip'] = hp; j[s > 0 ? 'lKnee' : 'rKnee'] = kn;
      });
      return S;
    }
    var sinan = baueSinan(); scene.add(sinan.root);

    // Posen: Zielwinkel je Gelenk, werden weich angefahren
    var GELENKE = ['torso.x', 'torso.y', 'torso.z', 'kopf.x', 'kopf.y', 'lSh.x', 'lSh.z', 'rSh.x', 'rSh.z', 'lEl.x', 'rEl.x', 'lHip.x', 'lHip.z', 'rHip.x', 'rHip.z', 'lKnee.x', 'rKnee.x', 'huefteY', 'kipp.x'];
    var BASIS = { 'torso.x': 0.08, 'torso.y': 0, 'torso.z': 0, 'kopf.x': 0, 'kopf.y': 0, 'lSh.x': -1.05, 'lSh.z': -0.22, 'rSh.x': -1.05, 'rSh.z': 0.22, 'lEl.x': -2.1, 'rEl.x': -2.1,
      'lHip.x': -0.32, 'lHip.z': 0.05, 'rHip.x': 0.22, 'rHip.z': -0.05, 'lKnee.x': 0.4, 'rKnee.x': 0.38, huefteY: 0.9, 'kipp.x': 0 };
    var POSEN = {
      guard: {},
      lowWind: { 'torso.y': -0.6, 'torso.x': 0.02, 'rHip.x': 0.55, 'rKnee.x': 0.7, 'lKnee.x': 0.55, huefteY: 0.86, 'rSh.x': -0.5 },
      lowKick: { 'torso.y': 0.75, 'torso.x': -0.18, 'rHip.x': -0.8, 'rHip.z': 0.15, 'rKnee.x': 0.05, 'rSh.x': 0.3, 'rSh.z': 0.7, 'rEl.x': -0.4, 'lKnee.x': 0.45, huefteY: 0.88 },
      stampfWind: { 'rHip.x': -1.45, 'rKnee.x': 1.95, 'torso.x': -0.18, 'lSh.z': 0.9, 'rSh.z': -0.9, 'lSh.x': -0.4, 'rSh.x': -0.4, 'lEl.x': -0.5, 'rEl.x': -0.5, 'lKnee.x': 0.2, 'lHip.x': -0.1, huefteY: 0.94 },
      stampf: { 'rHip.x': -0.4, 'rKnee.x': 0.35, 'lKnee.x': 0.75, 'lHip.x': -0.5, 'torso.x': 0.3, huefteY: 0.8, 'lSh.z': 0.5, 'rSh.z': -0.5, 'lEl.x': -0.9, 'rEl.x': -0.9 },
      knieWind: { 'lSh.x': -1.9, 'rSh.x': -1.9, 'lEl.x': -0.7, 'rEl.x': -0.7, 'rHip.x': 0.35, 'torso.x': -0.05 },
      knie: { 'rHip.x': -1.65, 'rKnee.x': 2.3, 'torso.x': -0.25, 'lSh.x': -0.8, 'rSh.x': -0.8, 'lEl.x': -1.3, 'rEl.x': -1.3, 'lKnee.x': 0.15, 'lHip.x': 0, huefteY: 0.98 },
      jabL: { 'lSh.x': -1.6, 'lEl.x': -0.1, 'torso.y': 0.35, 'kopf.y': -0.2 },
      jabR: { 'rSh.x': -1.6, 'rEl.x': -0.1, 'torso.y': -0.35, 'kopf.y': 0.2 },
      treffer: { 'torso.x': -0.35, 'kopf.x': -0.45, 'lSh.z': 0.5, 'rSh.z': -0.5, 'lEl.x': -1.2, 'rEl.x': -1.2 },
      hupf: { 'rHip.x': 0.5, 'rKnee.x': 2.1, 'rSh.x': 0.7, 'rSh.z': 0.1, 'rEl.x': -0.6, 'lSh.x': -0.2, 'lSh.z': 0.7, 'lEl.x': -0.4, 'lKnee.x': 0.25, 'lHip.x': -0.1, 'kopf.x': -0.25, 'torso.x': 0.2 },
      nase: { 'lSh.x': -2.3, 'rSh.x': -2.3, 'lSh.z': -0.3, 'rSh.z': 0.3, 'lEl.x': -1.6, 'rEl.x': -1.6, 'kopf.x': -0.5, 'torso.x': -0.3 },
      wai: { 'lSh.x': -1.25, 'rSh.x': -1.25, 'lSh.z': -0.55, 'rSh.z': 0.55, 'lEl.x': -1.55, 'rEl.x': -1.55, 'kopf.x': 0.35, 'torso.x': 0.25, 'lHip.x': -0.1, 'rHip.x': 0.1, 'lKnee.x': 0.2, 'rKnee.x': 0.2 },
      jubel: { 'lSh.x': -2.9, 'rSh.x': -2.9, 'lSh.z': 0.3, 'rSh.z': -0.3, 'lEl.x': -0.3, 'rEl.x': -0.3, 'kopf.x': -0.3, 'lHip.x': -0.1, 'rHip.x': 0.1, 'lKnee.x': 0.15, 'rKnee.x': 0.15, huefteY: 0.94 },
      ko: { 'kipp.x': -1.48, 'lSh.z': 1.3, 'rSh.z': -1.3, 'lSh.x': -0.2, 'rSh.x': -0.2, 'lEl.x': -0.2, 'rEl.x': -0.2, 'kopf.x': -0.2, 'lHip.x': -0.2, 'rHip.x': 0.15, 'lKnee.x': 0.3, 'rKnee.x': 0.6 }
    };
    var poseIst = {}, poseZiel = {};
    GELENKE.forEach(function (k) { poseIst[k] = BASIS[k]; poseZiel[k] = BASIS[k]; });
    var poseTempo = 10;
    function pose(name, tempo) { var p = POSEN[name] || {}; GELENKE.forEach(function (k) { poseZiel[k] = k in p ? p[k] : BASIS[k]; }); poseTempo = tempo || 10; }
    function poseAnwenden(dt) {
      var f = 1 - Math.exp(-poseTempo * dt), j = sinan.j;
      GELENKE.forEach(function (k) {
        poseIst[k] = lerp(poseIst[k], poseZiel[k], f);
        var v = poseIst[k];
        if (k === 'huefteY') { j.huefte.position.y = v; return; }
        var t = k.split('.'); j[t[0]].rotation[t[1]] = v;
      });
    }

    // Warnmarker auf der Matte
    var warnMat = new THREE.MeshBasicMaterial({ color: 0xff2a3a, transparent: true, opacity: 0, depthWrite: false });
    var warnStreifen = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.2), warnMat); warnStreifen.rotation.x = -Math.PI / 2; warnStreifen.position.y = 0.01; scene.add(warnStreifen);
    var kreisMat = new THREE.MeshBasicMaterial({ color: 0xff2a3a, transparent: true, opacity: 0, depthWrite: false });
    var warnKreis = new THREE.Mesh(new THREE.RingGeometry(0.35, 0.65, 32), kreisMat); warnKreis.rotation.x = -Math.PI / 2; warnKreis.position.y = 0.012; scene.add(warnKreis);
    var wellenMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
    var welle = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 40), wellenMat); welle.rotation.x = -Math.PI / 2; welle.position.y = 0.015; scene.add(welle);
    var welleT = 9;
    var krabbenSchatten = new THREE.Mesh(new THREE.CircleGeometry(0.5, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }));
    krabbenSchatten.rotation.x = -Math.PI / 2; krabbenSchatten.position.y = 0.008; scene.add(krabbenSchatten);
    var tornadoGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffd23f, transparent: true, depthWrite: false, opacity: 0 })); tornadoGlow.scale.set(2.4, 2.4, 1); scene.add(tornadoGlow);

    // Funken
    var funken = [];
    var funkGeo = new THREE.SphereGeometry(0.04, 6, 4);
    for (var fi = 0; fi < 40; fi++) {
      var fm = new THREE.Mesh(funkGeo, new THREE.MeshBasicMaterial({ color: 0xffd23f })); fm.visible = false; scene.add(fm);
      funken.push({ m: fm, v: new THREE.Vector3(), t: 0, life: 0 });
    }
    var funkIdx = 0;
    function funkeln(p, n, farbe) {
      for (var i = 0; i < n; i++) {
        var f = funken[funkIdx++ % funken.length];
        f.m.visible = true; f.m.position.copy(p); f.m.material.color.setHex(farbe || 0xffd23f);
        f.v.set(rnd(-3, 3), rnd(1, 4.5), rnd(-1.5, 1.5)); f.t = 0; f.life = rnd(0.3, 0.6);
      }
    }

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = { modus: 'intro', t: 0, punkte: 0, runde: 1, schaden: 0, ausgewichen: 0, zwicks: 0, stopp: 0, wackel: 0,
        k: { x: -2.2, y: 0, vy: 0, vx: 0, hp: KRABBE_HP, wut: 0, cd: 0, unverw: 0, schub: 0, lauf: 0, tornado: 0, tornadoGetroffen: false, sprungZaehlt: false },
        s: { x: 1.6, blick: -1, hp: SINAN_HP, zustand: 'wai', t: 1, angriff: null, ziel: 0, offen: 0, kombi: 0, schritt: 0, wendT: 0, knieGeprueft: false },
        blaseT: 0, sieg: null, endeT: 0 };
      sinan.root.position.set(g.s.x, 0, 0);
      krabbe.root.position.set(g.k.x, 0, 0.1);
      krabbe.kipp.rotation.set(0, 0, 0);
      pose('wai', 6);
      GELENKE.forEach(function (k) { poseIst[k] = k in POSEN.wai ? POSEN.wai[k] : BASIS[k]; });
    }

    // ---------- HUD-Helfer ----------
    var v3 = new THREE.Vector3();
    function bildschirm(x, y, z) { v3.set(x, y, z).project(cam); return { x: (v3.x + 1) / 2 * box.clientWidth, y: (1 - v3.y) / 2 * box.clientHeight }; }
    function melde(txt, klein, rot) {
      var el = $('meldung'); el.className = 'sn-meldung'; el.style.color = rot ? '#ff4a5a' : '';
      el.innerHTML = txt + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen');
    }
    function sag(txt, dauer) { var b = $('blase'); b.textContent = txt; b.classList.add('an'); g.blaseT = dauer || 1.6; }
    function zahl(txt, x, y, art) {
      var p = bildschirm(x, y, 0), el = document.createElement('div'); el.className = 'sn-zahl' + (art ? ' ' + art : ''); el.textContent = txt;
      el.style.left = p.x + 'px'; el.style.top = p.y + 'px'; hudEl.appendChild(el);
      spaeter(function () { el.remove(); }, 950);
    }
    function warn(txt) { var w = $('warn'); if (txt) { w.textContent = txt; w.classList.add('an'); } else w.classList.remove('an'); }
    function rotBlitz() { var r = $('rot'); r.classList.add('an'); spaeter(function () { r.classList.remove('an'); }, 90); }

    // ---------- Eingabe ----------
    var halten = { l: false, r: false, pl: false, pr: false };
    function richtung() { return ((halten.r || halten.pr) ? 1 : 0) - ((halten.l || halten.pl) ? 1 : 0); }
    function allesLos() { halten = { l: false, r: false, pl: false, pr: false }; pad.querySelectorAll('.gedrueckt').forEach(function (b) { b.classList.remove('gedrueckt'); }); }

    function springen() {
      var k = g.k; if (g.modus !== 'spiel' || k.y > 0.001 || k.tornado > 0) return;
      k.vy = SPRUNG; k.sprungZaehlt = true; g.s.knieGeprueft = false;
      Pixel.sfx.tone(440, 0.12, 'square', 0.04, 880);
    }
    function zwicken() {
      var k = g.k, s = g.s; if (g.modus !== 'spiel' || k.cd > 0 || k.tornado > 0) return;
      k.cd = 0.36;
      var seite = s.x > k.x ? 1 : -1, sch = krabbe.scheren[seite > 0 ? 1 : 0]; sch.zwick = 0.22;
      Pixel.sfx.tone(1400, 0.04, 'square', 0.03, 900);
      if (s.zustand === 'ko' || s.zustand === 'wai') return;
      var dx = Math.abs(s.x - k.x), hinten = (k.x - s.x) * s.blick < 0;
      if (dx > 1.05) return;
      var dmg, art, wut = 10;
      if (k.y > 0.55 && !hinten) { dmg = 13; art = 'nase'; wut = 18; }
      else if (k.y > 0.45 && hinten) { dmg = 13; art = 'po'; wut = 18; }
      else { dmg = s.offen > 0 ? 11 : 5; art = 'zeh'; }
      if (s.offen > 0 && art !== 'zeh') dmg += 5;
      treffeSinan(dmg, art, wut);
    }
    function tornado() {
      var k = g.k; if (g.modus !== 'spiel' || k.wut < 100 || k.tornado > 0) return;
      k.wut = 0; k.tornado = 1.1; k.tornadoGetroffen = false; k.unverw = 1.3; k.vy = 3.5;
      melde('KRABBEN-TORNADO!');
      Pixel.sfx.tone(220, 0.6, 'sawtooth', 0.05, 880); Pixel.sfx.noise(0.6, 0.08, 2500);
    }

    var CODES = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'sprung', KeyW: 'sprung', Space: 'sprung',
      KeyJ: 'zwick', KeyF: 'zwick', Enter: 'zwick', KeyK: 'tornado', ShiftLeft: 'tornado', ShiftRight: 'tornado', KeyL: 'tornado' };
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel') { if (e.key === 'Enter' || e.key === ' ') { var b = ebene.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } } return; }
      var a = CODES[e.code]; if (!a) return; e.preventDefault();
      if (a === 'l') halten.l = true;
      else if (a === 'r') halten.r = true;
      else if (e.repeat) return;
      else if (a === 'sprung') springen();
      else if (a === 'zwick') zwicken();
      else if (a === 'tornado') tornado();
    }
    function ku(e) { var a = CODES[e.code]; if (a === 'l') halten.l = false; if (a === 'r') halten.r = false; }
    function canvasKlick(e) { if (g.modus === 'spiel' && !touch && e.button === 0) zwicken(); }
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-pad]'); if (!b) return; e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (x) {}
      b.classList.add('gedrueckt');
      var a = b.getAttribute('data-pad');
      if (a === 'links') halten.pl = true; else if (a === 'rechts') halten.pr = true;
      else if (a === 'sprung') springen(); else if (a === 'zwick') zwicken(); else if (a === 'tornado') tornado();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) {
      pad.addEventListener(n, function (e) {
        var b = e.target.closest('[data-pad]'); if (!b) return; b.classList.remove('gedrueckt');
        var a = b.getAttribute('data-pad'); if (a === 'links') halten.pl = false; if (a === 'rechts') halten.pr = false;
      });
    });

    // ---------- Kampf ----------
    function phase() { return g.s.hp > SINAN_HP * 0.6 ? 1 : g.s.hp > SINAN_HP * 0.3 ? 2 : 3; }
    function treffeSinan(dmg, art, wut) {
      var s = g.s, k = g.k;
      s.hp = Math.max(0, s.hp - dmg); g.schaden += dmg; g.zwicks++; g.punkte += dmg * 2;
      k.wut = Math.min(100, k.wut + (wut || 10));
      var hy = art === 'nase' ? 1.65 : art === 'po' ? 1.0 : art === 'tornado' ? 1.0 : 0.25;
      v3.set(s.x, hy, 0.15); funkeln(v3.clone(), art === 'zeh' ? 5 : 12);
      zahl((art === 'nase' ? 'NASEN-ZWICK! ' : art === 'po' ? 'PO-ZWICK! ' : art === 'tornado' ? 'TORNADO! ' : '') + '-' + dmg, s.x, hy + 0.35, art === 'zeh' ? 'weiss' : '');
      g.stopp = art === 'zeh' ? 0.03 : 0.08; g.wackel = art === 'zeh' ? 0.05 : 0.18;
      Pixel.sfx.tone(art === 'zeh' ? 900 : 620, 0.06, 'square', 0.05, art === 'zeh' ? 500 : 200); Pixel.sfx.noise(0.08, 0.06, 1800);
      zuschauer.forEach(function (z) { z.jubel = 0.8; });
      if (s.hp <= 0) { sinanKO(); return; }
      var p = phase();
      if (p > g.runde) { g.runde = p; spaeter(function () { if (g.modus === 'spiel') { melde('RUNDE ' + p, p === 3 ? 'Letzte Runde!' : 'Sinan wird schneller'); gong(); sag(pick(SPRUECHE['runde' + p]), 1.8); } }, 350); }
      // Reaktion: große Treffer unterbrechen ihn, kleine nur, wenn er gerade nicht angreift
      var gross = (art !== 'zeh' && s.zustand !== 'aktiv') || (art === 'zeh' && s.offen > 0 && s.zustand === 'erholung');
      if (gross || art === 'tornado') {
        s.angriff = null; warn(null); warnMat.opacity = 0; kreisMat.opacity = 0;
        s.zustand = 'treffer'; s.t = art === 'tornado' ? 1.4 : art === 'zeh' ? 0.35 : 0.8;
        pose(art === 'nase' ? 'nase' : art === 'zeh' && s.offen <= 0 ? 'treffer' : 'hupf', 16);
        sag(pick(SPRUECHE[art === 'nase' ? 'nase' : art === 'po' ? 'po' : 'au']), 1.2);
      } else {
        if (Math.random() < 0.25 && g.blaseT <= 0) sag(pick(SPRUECHE.au), 0.9);
        if (s.zustand === 'idle') s.t = Math.min(s.t, 0.3);   // Zeh-Spam macht ihn sauer: er greift früher an
      }
    }
    function treffeKrabbe(dmg, wer, schub) {
      var k = g.k; if (k.unverw > 0 || g.modus !== 'spiel') return false;
      k.hp = Math.max(0, k.hp - dmg); k.unverw = 0.9; k.vx = schub; k.vy = Math.max(k.vy, 4.5);
      g.stopp = 0.09; g.wackel = 0.3; rotBlitz();
      v3.set(k.x, 0.5, 0.2); funkeln(v3.clone(), 10, 0xff5a3a);
      zahl(wer + ' -' + dmg, k.x, 1.0, 'rot');
      Pixel.sfx.tone(160, 0.25, 'sawtooth', 0.07, 80); Pixel.sfx.noise(0.15, 0.12, 900);
      if (g.blaseT <= 0 || Math.random() < 0.5) sag(pick(SPRUECHE.treffer), 1.2);
      if (k.hp <= 0) krabbeKO();
      return true;
    }
    function angriffWaehlen() {
      var s = g.s, k = g.k, dx = Math.abs(k.x - s.x), p = phase(), r = Math.random();
      var wind = [0.62, 0.5, 0.4][p - 1];
      if (dx < 0.95 && k.y < 0.1 && r < 0.3) return { typ: 'jab', wind: 0.25, aktiv: 1.1, erholung: 0.9 };
      if (dx < 2.3 && r < 0.55) return { typ: 'low', wind: wind, aktiv: 0.2, erholung: 0.7 - p * 0.08 };
      if (dx < 2.8) return { typ: 'stampf', wind: wind + 0.15, aktiv: 0.15, erholung: 0.75 - p * 0.08, ziel: clamp(k.x, -RAND, RAND) };
      return null;
    }
    function angriffStarten(a) {
      var s = g.s; s.angriff = a; s.zustand = 'wind'; s.t = a.wind; s.knieGeprueft = true;
      if (a.typ === 'low') { pose('lowWind', 9); warn('SPRINGEN!'); Pixel.sfx.tone(300, 0.1, 'triangle', 0.04, 360); }
      else if (a.typ === 'stampf') { pose('stampfWind', 8); warn('WEG DA!'); Pixel.sfx.tone(260, 0.1, 'triangle', 0.04, 200); }
      else if (a.typ === 'knie') { pose('knieWind', 18); }
      else if (a.typ === 'jab') { pose('jabL', 14); }
    }
    function angriffAktiv() {
      var s = g.s, a = s.angriff, k = g.k; s.zustand = 'aktiv'; s.t = a.aktiv; a.traf = false;
      warn(null);
      if (a.typ === 'low') { pose('lowKick', 24); s.schritt = 0.55; Pixel.sfx.noise(0.12, 0.07, 1200); }
      else if (a.typ === 'stampf') {
        pose('stampf', 30); s.x = clamp(a.ziel - s.blick * 0.15, -RAND - 0.3, RAND + 0.3);
        welle.position.x = a.ziel; welleT = 0; g.wackel = 0.25;
        Pixel.sfx.tone(90, 0.3, 'sine', 0.12, 40); Pixel.sfx.noise(0.2, 0.12, 400);
      }
      else if (a.typ === 'knie') { pose('knie', 28); Pixel.sfx.noise(0.1, 0.06, 1400); }
      else if (a.typ === 'jab') { a.jabT = 0; a.jabN = 0; if (Math.random() < 0.7) sag(pick(SPRUECHE.luft), 1.3); }
    }
    function angriffPruefen() {
      var s = g.s, a = s.angriff, k = g.k; if (a.traf) return;
      var vorne = (k.x - s.x) * s.blick;
      if (a.typ === 'low' && k.y < 0.32 && vorne > -0.3 && vorne < 1.45) a.traf = treffeKrabbe(18 + phase() * 3, 'LOW KICK', s.blick * 6);
      else if (a.typ === 'stampf' && Math.abs(k.x - a.ziel) < 0.62 && k.y < 0.4) a.traf = treffeKrabbe(24 + phase() * 3, 'STAMPFER', (k.x >= a.ziel ? 1 : -1) * 4);
      else if (a.typ === 'knie' && k.y > 0.25 && Math.abs(k.x - s.x) < 1.15) a.traf = treffeKrabbe(16 + phase() * 2, 'KNIE', s.blick * 7);
    }
    function angriffEnde() {
      var s = g.s, a = s.angriff, k = g.k;
      if (!a.traf && a.typ !== 'jab') {
        var dx = Math.abs(k.x - (a.typ === 'stampf' ? a.ziel : s.x));
        if (dx < (a.typ === 'stampf' ? 1.3 : 1.9)) { g.ausgewichen++; g.punkte += 15; zahl('AUSGEWICHEN +15', k.x, 1.3, 'weiss'); }
      }
      s.zustand = 'erholung'; s.t = a.erholung; s.offen = a.erholung + (a.typ === 'jab' ? 0.3 : 0);
      if (a.typ === 'jab') { pose('guard', 6); sag('Hä?! Wo …', 1); }
      else pose('guard', 7);
      // Kombi in späteren Runden: direkt noch ein Angriff
      if (phase() >= 2 && a.typ !== 'jab' && !a.kombi && Math.random() < (phase() === 2 ? 0.3 : 0.5)) {
        var n = angriffWaehlen(); if (n && n.typ !== 'jab') { n.kombi = true; n.wind *= 0.85; s.offen = 0; angriffStarten(n); return; }
      }
      s.angriff = null;
    }
    function sinanKO() {
      var s = g.s; s.zustand = 'ko'; s.angriff = null; warn(null); warnMat.opacity = 0; kreisMat.opacity = 0;
      pose('ko', 5); sag(pick(SPRUECHE.ko), 2.6); g.sieg = true; g.modus = 'ende'; g.endeT = 0;
      melde('K.O.!', 'Die Krabbe gewinnt!');
      Pixel.sfx.tone(523, 0.12, 'square', 0.06); Pixel.sfx.tone(659, 0.12, 'square', 0.06, null, 0.12); Pixel.sfx.tone(784, 0.12, 'square', 0.06, null, 0.24); Pixel.sfx.tone(1046, 0.4, 'square', 0.06, null, 0.36);
      gong(0.6);
      spaeter(function () { endBildschirm(); }, 2600);
    }
    function krabbeKO() {
      g.sieg = false; g.modus = 'ende'; g.endeT = 0; g.s.zustand = 'jubel'; g.s.angriff = null; warn(null); warnMat.opacity = 0; kreisMat.opacity = 0;
      pose('jubel', 6); spaeter(function () { sag(pick(SPRUECHE.sieg), 2.4); }, 500);
      melde('AUSGEKNOCKT!', 'Die Krabbe liegt auf dem Rücken', true);
      Pixel.sfx.tone(392, 0.3, 'triangle', 0.06, 370); Pixel.sfx.tone(349, 0.3, 'triangle', 0.06, 330, 0.3); Pixel.sfx.tone(294, 0.7, 'triangle', 0.06, 220, 0.6);
      spaeter(function () { endBildschirm(); }, 2600);
    }
    function gong(v) { Pixel.sfx.tone(196, 1.4, 'sine', 0.12, 190, v || 0); Pixel.sfx.tone(392, 1.0, 'triangle', 0.04, 380, v || 0); }

    function updateKrabbe(dt) {
      var k = g.k, s = g.s, r = g.modus === 'spiel' ? richtung() : 0;
      k.cd = Math.max(0, k.cd - dt); k.unverw = Math.max(0, k.unverw - dt);
      if (k.tornado > 0) {
        k.tornado -= dt;
        var ziel = s.x > k.x ? 1 : -1;
        if (!k.tornadoGetroffen) k.vx = ziel * 7.5;
        if (!k.tornadoGetroffen && Math.abs(s.x - k.x) < 0.7 && s.zustand !== 'ko') { k.tornadoGetroffen = true; treffeSinan(30 + Math.floor(Math.random() * 6), 'tornado', 0); k.vx = -ziel * 3; }
        k.x += k.vx * dt;
      } else {
        k.vx *= Math.exp(-6 * dt);
        k.x += (r * 4.4 + k.vx) * dt;
      }
      k.x = clamp(k.x, -RAND - 0.4, RAND + 0.4);
      k.vy -= GRAV * dt; k.y += k.vy * dt;
      if (k.y <= 0) { if (k.vy < -3 && g.modus === 'spiel') Pixel.sfx.tone(140, 0.05, 'square', 0.03); k.y = 0; k.vy = 0; }
      if (r && k.y === 0) k.lauf += dt * 14;
      // Modell
      krabbe.root.position.set(k.x, k.y, 0.1);
      var blinken = k.unverw > 0 && k.tornado <= 0 && Math.floor(k.unverw * 14) % 2 === 0;
      krabbe.root.visible = !blinken || g.modus !== 'spiel';
      if (k.tornado > 0) { krabbe.kipp.rotation.y += dt * 30; krabbe.kipp.rotation.z = 0; }
      else if (g.modus === 'ende' && g.sieg === false) { krabbe.kipp.rotation.y = lerp(krabbe.kipp.rotation.y, 0, dt * 5); krabbe.kipp.rotation.z = lerp(krabbe.kipp.rotation.z, Math.PI, dt * 4); krabbe.kipp.position.y = lerp(krabbe.kipp.position.y, 0.75, dt * 4); }
      else { krabbe.kipp.rotation.y = lerp(krabbe.kipp.rotation.y % (Math.PI * 2), 0, dt * 8); krabbe.kipp.rotation.z = lerp(krabbe.kipp.rotation.z, -r * 0.12 + (k.y > 0 ? -k.vy * 0.015 : 0), dt * 10); krabbe.kipp.position.y = 0; }
      krabbe.koerper.position.y = 0.34 + (r && k.y === 0 ? Math.abs(Math.sin(k.lauf)) * 0.04 : Math.sin(g.t * 3) * 0.01);
      krabbe.beine.forEach(function (b) {
        var ph = k.lauf + b.i * 2.1 + (b.s > 0 ? Math.PI : 0);
        b.ob.rotation.z = b.s * (0.6 + (r && k.y === 0 ? Math.sin(ph) * 0.3 : 0) + (k.y > 0 ? 0.3 : 0));
        b.g.rotation.y = r && k.y === 0 ? Math.cos(ph) * 0.25 : 0;
      });
      var jubel = g.modus === 'ende' && g.sieg;
      krabbe.scheren.forEach(function (c) {
        c.zwick = Math.max(0, c.zwick - dt);
        var z = c.zwick > 0 ? Math.sin((1 - c.zwick / 0.22) * Math.PI) : 0;
        var ruhe = jubel ? -c.s * (0.2 + Math.sin(g.t * 10) * 0.2) : -c.s * (0.55 + Math.sin(g.t * 2.2 + c.s) * 0.06);
        c.arm.rotation.z = lerp(ruhe, -c.s * 1.5, z);
        c.arm.rotation.x = lerp(0.35, 0, z);
        c.finger.rotation.z = c.s * (z > 0.3 ? 0 : 0.55 + Math.sin(g.t * 3 + c.s) * 0.15);
      });
      krabbe.augen.forEach(function (a) {
        a.st.rotation.z = Math.sin(g.t * 1.7 + a.s) * 0.12 - a.s * 0.1;
        a.pup.position.x = clamp((s.x - k.x) * 0.02, -0.025, 0.025);
      });
      krabbenSchatten.position.x = k.x; var sk = 1 / (1 + k.y * 0.8); krabbenSchatten.scale.set(sk, sk, sk); krabbenSchatten.material.opacity = 0.28 * sk;
      tornadoGlow.position.set(k.x, k.y + 0.5, 0.3); tornadoGlow.material.opacity = k.tornado > 0 ? 0.8 : (k.wut >= 100 ? 0.25 + Math.sin(g.t * 8) * 0.1 : 0);
    }

    function updateSinan(dt) {
      var s = g.s, k = g.k;
      s.offen = Math.max(0, s.offen - dt);
      if (s.zustand === 'ko') { poseAnwenden(dt); sinan.root.position.x = s.x; return; }
      // Blickrichtung: dreht sich mit Verzögerung zur Krabbe
      var soll = k.x >= s.x ? 1 : -1;
      if (soll !== s.blick && (s.zustand === 'idle' || s.zustand === 'erholung')) {
        s.wendT += dt;
        if (s.wendT > (s.zustand === 'erholung' ? 0.5 : 0.28)) { s.blick = soll; s.wendT = 0; if (g.modus === 'spiel' && Math.random() < 0.5) sag(pick(SPRUECHE.weg), 1.1); }
      } else s.wendT = 0;
      var dreh = s.blick * (Math.PI / 2 - 0.5);
      sinan.root.rotation.y = lerp(sinan.root.rotation.y, dreh, 1 - Math.exp(-12 * dt));

      if (g.modus === 'spiel') {
        s.t -= dt;
        if (s.zustand === 'idle') {
          // Abstand halten, tänzeln
          var dx = k.x - s.x, wunsch = 1.5, dist = Math.abs(dx);
          var tempo = 1.4 + phase() * 0.35;
          if (dist > wunsch + 0.3) s.x += Math.sign(dx) * tempo * dt;
          else if (dist < 0.6 && Math.random() < dt * 1.2) s.x -= Math.sign(dx) * 0.6;
          // Knie gegen Springer
          if (!s.knieGeprueft && k.y > 0.3 && k.vy > 0 && dist < 1.4 && dx * s.blick > 0) {
            s.knieGeprueft = true;
            if (Math.random() < 0.3 + phase() * 0.12) { angriffStarten({ typ: 'knie', wind: 0.12, aktiv: 0.2, erholung: 0.5 }); }
          }
          if (s.zustand === 'idle' && s.t <= 0) {
            var a = angriffWaehlen();
            if (a) angriffStarten(a); else s.t = 0.3;
          }
          if (s.zustand === 'idle') pose('guard', 8);
        } else if (s.zustand === 'wind') {
          var a2 = s.angriff;
          if (a2.typ === 'low') { warnStreifen.position.x = s.x + s.blick * 0.75; warnStreifen.scale.x = 1.7; warnMat.opacity = 0.25 + 0.2 * Math.sin(g.t * 30); }
          if (a2.typ === 'stampf') { warnKreis.position.x = a2.ziel; kreisMat.opacity = 0.35 + 0.25 * Math.sin(g.t * 30); s.x = lerp(s.x, clamp(a2.ziel - s.blick * 0.15, -RAND - 0.3, RAND + 0.3), 1 - Math.exp(-3 * dt)); }
          if (s.t <= 0) { warnMat.opacity = 0; kreisMat.opacity = 0; angriffAktiv(); }
        } else if (s.zustand === 'aktiv') {
          var a3 = s.angriff;
          if (a3.typ === 'jab') {
            a3.jabT -= dt;
            if (a3.jabT <= 0) { a3.jabN++; a3.jabT = 0.18; pose(a3.jabN % 2 ? 'jabR' : 'jabL', 26); Pixel.sfx.noise(0.05, 0.04, 2400); }
          } else angriffPruefen();
          if (s.zustand === 'aktiv') {
            if (s.schritt > 0) { var st = Math.min(s.schritt, dt * 5); s.x += s.blick * st; s.schritt -= st; }
            if (s.t <= 0) angriffEnde();
          }
        } else if (s.zustand === 'erholung') {
          if (s.t <= 0) { s.zustand = 'idle'; s.t = rnd.apply(null, [[1.1, 1.9], [0.8, 1.4], [0.55, 1.0]][phase() - 1]); }
        } else if (s.zustand === 'treffer') {
          if (s.t <= 0) { s.zustand = 'idle'; s.t = rnd(0.3, 0.7); s.offen = 0; pose('guard', 8); }
        } else if (s.zustand === 'wai') {
          s.zustand = 'idle'; s.t = 1.2; pose('guard', 6);
        }
        s.x = clamp(s.x, -RAND - 0.3, RAND + 0.3);
      }
      poseAnwenden(dt);
      var hupf = s.zustand === 'treffer' && POSEN.hupf && poseZiel['rKnee.x'] > 2 ? Math.abs(Math.sin(g.t * 12)) * 0.12 : 0;
      var taenzeln = s.zustand === 'idle' ? Math.abs(Math.sin(g.t * 5)) * 0.03 : 0;
      if (g.modus === 'ende' && g.sieg === false) hupf = Math.abs(Math.sin(g.t * 6)) * 0.15;
      sinan.root.position.set(s.x, hupf + taenzeln, 0);
      sinan.mund.scale.x = s.zustand === 'treffer' ? 0.6 : 1; sinan.mund.scale.y = s.zustand === 'treffer' ? 4 : 1;
    }

    // ---------- Kamera ----------
    var hoch = false, camZiel = new THREE.Vector3(), blick = new THREE.Vector3();
    function resize() {
      var w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; hoch = h > w;
      cam.fov = hoch ? 62 : 40; cam.updateProjectionMatrix();
      if (composer) { composer.setPixelRatio(dpr); composer.setSize(w, h); }
    }
    function kamera(dt) {
      var zeit = performance.now() / 1000;
      if (g.modus === 'intro') {
        var a = zeit * 0.2;
        if (hoch) { camZiel.set(g.s.x - 0.8 + Math.sin(a) * 0.4, 1.3, 4.6); blick.set(g.s.x - 0.6, 1.25, 0); }
        else { camZiel.set(g.s.x - 0.9 + Math.sin(a) * 0.5, 1.4, 4.0 + Math.cos(a) * 0.3); blick.set(g.s.x - 1.6, 1.05, 0); }
      } else {
        var mitte = (g.k.x + g.s.x) / 2, abst = Math.abs(g.k.x - g.s.x);
        var z = hoch ? 6.2 + abst * 0.65 : 5.6 + abst * 0.35;
        camZiel.set(mitte * 0.8, hoch ? 1.9 : 2.0, z); blick.set(mitte * 0.85, hoch ? 0.75 : 0.85, 0);
        if (g.modus === 'ende') { var ziel = g.sieg ? g.k.x : g.s.x; camZiel.set(ziel * 0.9 + 0.3, 1.4, hoch ? 5.2 : 4.0); blick.set(ziel, g.sieg ? 0.4 : 1.1, 0); }
      }
      cam.position.lerp(camZiel, 1 - Math.exp(-3 * dt));
      if (g.wackel > 0) { cam.position.x += rnd(-1, 1) * g.wackel * 0.25; cam.position.y += rnd(-1, 1) * g.wackel * 0.25; }
      cam.lookAt(blick);
    }

    // ---------- Nachbearbeitung ----------
    var composer = null;
    var GRADE = {
      uniforms: { tDiffuse: { value: null } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'uniform sampler2D tDiffuse; varying vec2 vUv;',
        'void main(){ vec2 d = vUv - 0.5; vec3 c = texture2D(tDiffuse, vUv).rgb;',
        ' c = mix(c, c*vec3(1.06,0.98,0.92), 0.6); c = (c-0.5)*1.06+0.5; c *= 1.0 - smoothstep(0.18,0.8,dot(d,d))*0.5;',
        ' gl_FragColor = vec4(max(c,0.0),1.0); }'
      ].join('\n')
    };
    if (THREE.EffectComposer && THREE.RenderPass && THREE.ShaderPass && THREE.UnrealBloomPass) {
      try {
        var rt = new THREE.WebGLRenderTarget(1, 1, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
        rt.texture.encoding = THREE.sRGBEncoding;
        composer = new THREE.EffectComposer(renderer, rt);
        composer.addPass(new THREE.RenderPass(scene, cam));
        composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.3, 0.45, 0.93));
        composer.addPass(new THREE.ShaderPass(GRADE));
      } catch (e) { composer = null; }
    }

    // ---------- Schleife ----------
    function update(dt) {
      g.t += dt;
      g.wackel = Math.max(0, g.wackel - dt);
      if (g.blaseT > 0) { g.blaseT -= dt; if (g.blaseT <= 0) $('blase').classList.remove('an'); }
      updateKrabbe(dt);
      updateSinan(dt);
      // Effekte
      funken.forEach(function (f) {
        if (!f.m.visible) return;
        f.t += dt; if (f.t > f.life) { f.m.visible = false; return; }
        f.v.y -= 12 * dt; f.m.position.addScaledVector(f.v, dt); var sc2 = 1 - f.t / f.life; f.m.scale.setScalar(sc2);
      });
      welleT += dt; var wt = Math.min(1, welleT / 0.45); welle.scale.setScalar(0.6 + wt * 2.4); wellenMat.opacity = welleT < 0.45 ? 0.7 * (1 - wt) : 0;
      zuschauer.forEach(function (z, i) {
        z.jubel = Math.max(0, z.jubel - dt);
        var h = z.jubel > 0 || (g.modus === 'ende' && g.sieg) ? Math.abs(Math.sin(g.t * 12 + z.ph)) * 0.15 : Math.abs(Math.sin(g.t * 2 + z.ph)) * 0.02;
        z.k.root.position.y = h;
        z.k.scheren.forEach(function (c) { c.arm.rotation.z = -c.s * (z.jubel > 0 || (g.modus === 'ende' && g.sieg) ? 0.15 + Math.sin(g.t * 14 + z.ph) * 0.25 : 0.55); c.arm.rotation.x = 0.35; });
      });
      fackeln.forEach(function (f) { var fl = 1 + Math.sin(g.t * 17 + f.ph) * 0.12 + Math.sin(g.t * 31 + f.ph) * 0.06; f.fl.scale.set(1, fl, 1); f.gl.material.opacity = 0.6 + fl * 0.2; });
      fackelLicht.intensity = 0.8 + Math.sin(g.t * 13) * 0.08;
      // Meer
      var pa = meerGeo.attributes.position.array;
      for (var i = 0; i < pa.length; i += 3) pa[i + 1] = meerBasis[i + 1] + Math.sin(meerBasis[i] * 0.08 + g.t * 1.2) * 0.25 + Math.cos(meerBasis[i + 2] * 0.12 + g.t * 0.9) * 0.2;
      meerGeo.attributes.position.needsUpdate = true;
      kamera(dt);
      hud();
    }
    function hud() {
      var k = g.k, s = g.s;
      $('kHp').style.width = (k.hp / KRABBE_HP * 100) + '%'; $('kSchatten').style.width = (k.hp / KRABBE_HP * 100) + '%';
      $('sHp').style.width = (s.hp / SINAN_HP * 100) + '%'; $('sSchatten').style.width = (s.hp / SINAN_HP * 100) + '%';
      $('wut').style.width = k.wut + '%'; $('wutBox').classList.toggle('voll', k.wut >= 100);
      pad.querySelector('[data-pad=tornado]').classList.toggle('bereit', k.wut >= 100);
      $('punkte').textContent = g.punkte; $('runde').textContent = 'RUNDE ' + g.runde;
      if (g.blaseT > 0) {
        var p = bildschirm(s.x, s.zustand === 'ko' ? 0.6 : 2.0, 0), b = $('blase'), hb = b.offsetWidth / 2 + 6;
        b.style.left = clamp(p.x, hb, box.clientWidth - hb) + 'px'; b.style.top = Math.max(b.offsetHeight + 70, p.y) + 'px';
      }
    }
    function render() { if (composer) composer.render(); else renderer.render(scene, cam); }

    var last = performance.now(), mess = { n: 0, sum: 0 };
    function tick(now) {
      if (!alive) return;
      var roh = (now - last) / 1000, dt = Math.min(0.05, roh); last = now;
      if (roh < 0.5) { mess.n++; mess.sum += roh; }
      if (mess.n >= 90) {
        if (mess.sum / mess.n > 0.03) {
          if (dpr > 1) { dpr = Math.max(1, dpr - 0.3); renderer.setPixelRatio(dpr); resize(); }
          else if (renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; scene.traverse(function (o) { if (o.material) [].concat(o.material).forEach(function (mm) { mm.needsUpdate = true; }); }); }
          else if (composer) composer = null;
        }
        mess.n = 0; mess.sum = 0;
      }
      if (g.stopp > 0) { g.stopp -= dt; dt *= 0.08; }
      update(dt); render();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function intro() {
      ebene.classList.remove('aus'); hudEl.classList.remove('an'); pad.classList.remove('an');
      var best = +Pixel.get(BEST_KEY, 0);
      ebene.innerHTML = '<div class="sn-karte"><h1>KRABBE <span>VS.</span><br>SINAN</h1>' +
        '<div class="unter">Sinan macht Muay Thai. Du bist eine Krabbe. Klingt unfair? Ist es auch – für ihn.</div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>🦀 <b>A/D</b> oder <b>←/→</b> laufen (seitwärts, natürlich). Du passt sogar unter ihm durch.</li>' +
        '<li>✂️ <b>J</b> oder Klick: zwicken. Im Sprung gibt’s den <b>Nasen-Zwick</b> – von hinten den <b>Po-Zwick</b>.</li>' +
        '<li>🦵 <b>SPRINGEN!</b> (W/Leertaste) über den Low Kick · <b>WEG DA!</b> beim Stampfer aus dem roten Kreis.</li>' +
        '<li>⚠️ Spring nicht direkt vor ihm rum – sonst kommt das Knie.</li>' +
        '<li>🌪️ Treffer füllen die <b style="color:#ffd23f">WUT</b>. Voll? <b>K</b>/Shift = Krabben-Tornado.</li></ul>' +
        '<button class="sn-btn" data-act="los">In den Ring!</button></div>';
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.modus === 'ende') reset();
      g.modus = 'spiel'; ebene.classList.add('aus'); hudEl.classList.add('an'); if (touch) pad.classList.add('an'); allesLos();
      g.s.zustand = 'wai'; g.s.t = 0;
      melde('RUNDE 1', 'Kämpft!'); gong();
      spaeter(function () { sag(pick(SPRUECHE.start), 1.8); }, 400);
    }
    function endBildschirm() {
      hudEl.classList.remove('an'); pad.classList.remove('an'); allesLos(); warn(null);
      var bonus = 0;
      if (g.sieg) bonus = 500 + Math.round(g.k.hp) * 5 + Math.max(0, Math.round(180 - g.t)) * 3;
      g.punkte += bonus;
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best; if (neu) Pixel.set(BEST_KEY, g.punkte);
      ebene.classList.remove('aus');
      ebene.innerHTML = '<div class="sn-karte"><h1>' + (g.sieg ? 'K.O.!<br><span>KRABBE GEWINNT</span>' : 'AUS-<br><span>GEKNOCKT</span>') + '</h1>' +
        '<div class="unter">' + (g.sieg ? 'Sinan liegt auf der Matte. Besiegt von einer Krabbe. Das bleibt für immer im Klassenchat.' : 'Die Krabbe liegt auf dem Rücken. Sinan feiert, als hätte er gegen einen echten Gegner gewonnen.') + '</div>' +
        '<div class="zitat"><b>Sinan:</b> „' + (g.sieg ? 'Das zählt nicht, die hat Scheren!' : pick(SPRUECHE.sieg)) + '“</div>' +
        '<div class="zeile"><span>Punkte</span><b>' + g.punkte + (neu ? ' ★' : '') + '</b></div>' +
        (g.sieg ? '<div class="zeile"><span>Sieg-Bonus</span><b>+' + bonus + '</b></div>' : '<div class="zeile"><span>Sinans Restleben</span><b>' + Math.round(g.s.hp / SINAN_HP * 100) + ' %</b></div>') +
        '<div class="zeile"><span>Zwicks</span><b>' + g.zwicks + '</b></div>' +
        '<div class="zeile"><span>Ausgewichen</span><b>' + g.ausgewichen + '</b></div>' +
        '<div class="zeile"><span>Kampfzeit</span><b>' + Math.round(g.t) + ' s</b></div>' +
        '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte) + '</b></div>' +
        '<button class="sn-btn" data-act="los">Rückkampf!</button><button class="sn-btn zweit" data-act="exit">Menü</button></div>';
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
      canvas.removeEventListener('pointerdown', canvasKlick);
      root.removeEventListener('click', onClick);
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
      });
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch (e) {}
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize); window.addEventListener('blur', allesLos);
    canvas.addEventListener('pointerdown', canvasKlick);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__sinan = { g: function () { return g; }, zwicken: zwicken, springen: springen, tornado: tornado, halten: function () { return halten; } };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.sinan = { start: start };
})();
