// Leon: Der lange Hals – 3D-Klassenzimmer (three.js).
// Leon ist riesig und hat einen ausfahrbaren Hals. Er schnappt sich heimlich Snacks
// von den Tischen der anderen. Dreht sich das Opfer oder der Lehrer um, während der
// Hals ausgefahren ist: erwischt. Riesige Junk-Food-Portionen sind Power-ups.
// Steuern: Snack antippen/anklicken (oder Tasten 1–9), nochmal tippen bzw. Leertaste = Hals einziehen.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.leon.best';

  var SNACKS = [
    { e: '🥨', name: 'Brezel', p: 10 }, { e: '🍫', name: 'Schokoriegel', p: 15 },
    { e: '🥪', name: 'Pausenbrot', p: 20 }, { e: '🍩', name: 'Donut', p: 20 },
    { e: '🍟', name: 'Pommes', p: 25 }, { e: '🧃', name: 'Saft', p: 10 }, { e: '🍪', name: 'Keks', p: 10 }
  ];
  var POWER = [
    { e: '🍗', id: 'wings', name: 'FAMILIEN-EIMER WINGS', info: 'Turbo-Hals!', dauer: 8 },
    { e: '🍕', id: 'pizza', name: 'XXL-PIZZA', info: 'Keiner merkt was!', dauer: 6 },
    { e: '🥤', id: 'energy', name: '2-LITER-ENERGY', info: 'Doppelte Punkte!', dauer: 8 },
    { e: '🍔', id: 'burger', name: 'BURGER-TURM', info: 'Ein Verweis weg!', dauer: 0 }
  ];
  var ERWISCHT = ['HEY!', 'MEINS!', 'LEON?!', 'ICH SEH DICH!', 'FINGER WEG!'];
  var LEHRER = ['LEON!', 'NACHSITZEN!', 'WAS WIRD DAS?', 'HALS EINZIEHEN!'];

  var CSS = [
    '.ln{position:absolute;inset:0;overflow:hidden;background:#20242c;font-family:"Barlow Semi Condensed","Arial Narrow",Arial,sans-serif;color:#fff;touch-action:none}',
    '.ln canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.ln-hud{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .4s}',
    '.ln-hud.an{opacity:1}',
    '.ln-punkte{position:absolute;left:calc(66px + env(safe-area-inset-left));top:calc(12px + env(safe-area-inset-top));text-shadow:0 2px 10px rgba(0,0,0,.6)}',
    '.ln-punkte b{display:block;font-size:clamp(30px,6vw,46px);font-weight:800;line-height:1}',
    '.ln-punkte span{font-size:15px;font-weight:600;opacity:.85}',
    '.ln-serie{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:4px;background:#ffd23f;color:#2a2000;font-size:17px;font-weight:800;vertical-align:4px}',
    '.ln-serie.leer{display:none}',
    '.ln-verweise{position:absolute;right:calc(66px + env(safe-area-inset-right));top:calc(14px + env(safe-area-inset-top));display:flex;gap:6px;font-size:26px}',
    '.ln-verweise i{font-style:normal;transition:opacity .3s,filter .3s}.ln-verweise i.weg{opacity:.2;filter:grayscale(1)}',
    '.ln-power{position:absolute;left:50%;top:calc(66px + env(safe-area-inset-top));transform:translateX(-50%);background:rgba(20,20,30,.75);border:2px solid #ffd23f;',
    ' border-radius:10px;padding:6px 12px;font-weight:800;font-size:18px;display:none;white-space:nowrap}',
    '.ln-power.an{display:block}.ln-power i{display:block;height:4px;background:#ffd23f;margin-top:4px;border-radius:2px;font-style:normal}',
    '.ln-meldung{position:absolute;left:50%;top:32%;transform:translate(-50%,-50%);font-size:clamp(28px,6vw,48px);font-weight:800;color:#ffd23f;',
    ' text-shadow:0 0 18px rgba(0,0,0,.5),0 3px 0 rgba(0,0,0,.45);opacity:0;white-space:nowrap;text-align:center}',
    '.ln-meldung small{display:block;font-size:.5em;color:#fff}',
    '.ln-meldung.zeigen{animation:lnPop 1.1s ease-out}',
    '.ln-meldung.rot{color:#ff4a5a}',
    '@keyframes lnPop{0%{opacity:0;transform:translate(-50%,-30%) scale(.8)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}75%{opacity:1}100%{opacity:0;transform:translate(-50%,-80%)}}',
    '.ln-tipp{position:absolute;left:50%;bottom:calc(18px + env(safe-area-inset-bottom));transform:translateX(-50%);font-size:clamp(13px,3.6vw,17px);font-weight:600;opacity:.85;',
    ' white-space:nowrap;text-shadow:0 2px 8px rgba(0,0,0,.7);transition:opacity 1s}',
    '.ln-rot{position:absolute;inset:0;box-shadow:inset 0 0 140px rgba(255,40,40,0);transition:box-shadow .4s;pointer-events:none}',
    '.ln-rot.an{box-shadow:inset 0 0 160px rgba(255,40,40,.7);transition:none}',
    '.ln-knopf{position:absolute;top:calc(12px + env(safe-area-inset-top));width:42px;height:42px;border-radius:8px;border:2px solid rgba(255,255,255,.6);',
    ' background:rgba(40,60,50,.8);color:#fff;font:700 20px/1 sans-serif;cursor:pointer;z-index:20}',
    '.ln-ebene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:10;transition:opacity .4s}',
    '.ln-ebene.aus{opacity:0;pointer-events:none}',
    '@media (min-width:900px){.ln-ebene{justify-content:flex-start;padding-left:6vw}}',
    '@media (max-width:899px) and (orientation:portrait){.ln-ebene{align-items:flex-end;padding-bottom:calc(16px + env(safe-area-inset-bottom))}}',
    // Tafel-Look
    '.ln-tafel{background:#2f5a46;color:#f4f4ee;border-radius:10px;border:10px solid #8a5a34;box-shadow:inset 0 0 40px rgba(0,0,0,.35),0 30px 80px rgba(0,0,0,.55);',
    ' padding:22px 24px 20px;width:min(470px,100%);position:relative;font-family:"Pixelify Sans","Barlow Semi Condensed",sans-serif}',
    '.ln-tafel h1{margin:0;font-family:"Barlow Semi Condensed",sans-serif;font-size:clamp(40px,9vw,64px);font-weight:800;line-height:.92;letter-spacing:.01em}',
    '.ln-tafel .unter{font-size:19px;opacity:.9;margin:8px 0 14px}',
    '.ln-tafel .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(255,255,255,.3);padding:6px 0;font-size:19px}',
    '.ln-tafel .zeile b{font-family:"Barlow Semi Condensed",sans-serif;font-size:23px;font-weight:800}',
    '.ln-tafel ul{margin:10px 0 14px;padding:0;list-style:none;font-size:16px;line-height:1.45}',
    '.ln-tafel .kreide{position:absolute;right:16px;top:14px;font-size:34px}',
    '.ln-btn{width:100%;border:0;border-radius:8px;background:#f4f4ee;color:#2f5a46;font-family:"Barlow Semi Condensed",sans-serif;font-weight:800;font-size:25px;padding:11px 16px;cursor:pointer}',
    '.ln-btn:active{transform:scale(.98)}',
    '.ln-btn.zweit{margin-top:10px;background:transparent;color:#f4f4ee;border:2px solid rgba(255,255,255,.55);font-size:19px;padding:7px}',
    '@media (max-width:899px) and (orientation:portrait){.ln-tafel h1{font-size:40px}.ln-tafel{padding:16px 18px 16px}.ln-tafel ul{font-size:14px;margin:6px 0 10px}}',
    '.ln-fehler{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-size:20px;z-index:30;background:#20242c}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="ln"><canvas></canvas>' +
      '<div class="ln-hud">' +
        '<div class="ln-punkte"><b data-el="punkte">0</b><span data-el="snacks">0 Snacks</span><span class="ln-serie leer" data-el="serie">x2</span></div>' +
        '<div class="ln-verweise" data-el="verweise"><i>📄</i><i>📄</i><i>📄</i></div>' +
        '<div class="ln-power" data-el="power"><span data-el="powerName"></span><i data-el="powerBar"></i></div>' +
        '<div class="ln-meldung" data-el="meldung"></div>' +
        '<div class="ln-tipp" data-el="tipp">Snack antippen, wenn keiner guckt · nochmal tippen = einziehen</div>' +
        '<div class="ln-rot" data-el="rot"></div>' +
      '</div>' +
      '<button class="ln-knopf" style="left:calc(12px + env(safe-area-inset-left))" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
      '<button class="ln-knopf" style="right:calc(12px + env(safe-area-inset-right))" data-act="ton" aria-label="Ton an/aus"></button>' +
      '<div class="ln-ebene" data-el="ebene"></div></div>';
    root.appendChild(style);
    var box = root.querySelector('.ln');
    var canvas = root.querySelector('canvas');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var hud = root.querySelector('.ln-hud'), ebene = $('ebene'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      box.insertAdjacentHTML('beforeend', '<div class="ln-fehler">Dein Browser konnte die 3D-Grafik nicht starten. Schließ andere Tabs mit 3D-Inhalten und lade neu.</div>');
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
    scene.background = new THREE.Color(0x20242c);
    var cam = new THREE.PerspectiveCamera(50, 1, 0.1, 200);

    // ---------- Texturen ----------
    function canvasTex(w, h, paint, srgb) {
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      paint(c.getContext('2d'), w, h);
      var t = new THREE.CanvasTexture(c);
      if (srgb !== false) t.encoding = THREE.sRGBEncoding;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return t;
    }
    var glowTex = canvasTex(128, 128, function (x, w) {
      var gr = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, w, w);
    }, false);
    var emojiCache = {};
    function emojiTex(e) {
      if (emojiCache[e]) return emojiCache[e];
      return (emojiCache[e] = canvasTex(128, 128, function (x, w) {
        x.font = '100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
        x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, w / 2, w / 2 + 6);
      }));
    }
    function blaseTex(txt, bg, fg) {
      return canvasTex(256, 128, function (x, w, h) {
        x.fillStyle = bg; x.strokeStyle = '#111'; x.lineWidth = 8;
        x.beginPath(); x.moveTo(30, 10); x.lineTo(w - 30, 10); x.quadraticCurveTo(w - 8, 10, w - 8, 34); x.lineTo(w - 8, 72);
        x.quadraticCurveTo(w - 8, 96, w - 30, 96); x.lineTo(w / 2 + 16, 96); x.lineTo(w / 2, 122); x.lineTo(w / 2 - 16, 96);
        x.lineTo(30, 96); x.quadraticCurveTo(8, 96, 8, 72); x.lineTo(8, 34); x.quadraticCurveTo(8, 10, 30, 10); x.closePath(); x.fill(); x.stroke();
        x.fillStyle = fg; x.font = '800 52px "Barlow Semi Condensed",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(txt, w / 2, 54);
      });
    }
    var holzTex = canvasTex(256, 256, function (x, w, h) {
      x.fillStyle = '#9a6a42'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 8; i++) {
        x.fillStyle = i % 2 ? '#93633c' : '#a2714a'; x.fillRect(0, i * 32, w, 31);
        x.fillStyle = 'rgba(0,0,0,.15)'; x.fillRect(0, i * 32 + 31, w, 1);
        for (var k = 0; k < 6; k++) { x.fillStyle = 'rgba(60,30,10,.08)'; x.fillRect(Math.random() * w, i * 32 + Math.random() * 30, 40 + Math.random() * 80, 1); }
        x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(((i * 97) % w), i * 32, 1, 31);
      }
    });
    holzTex.wrapS = holzTex.wrapT = THREE.RepeatWrapping; holzTex.repeat.set(4, 4);
    var tafelTex = canvasTex(1024, 384, function (x, w, h) {
      x.fillStyle = '#2f5a46'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 40; i++) { x.fillStyle = 'rgba(255,255,255,.03)'; x.fillRect(Math.random() * w, Math.random() * h, 120, 30); }
      x.fillStyle = 'rgba(245,245,235,.9)'; x.font = '600 54px "Pixelify Sans",cursive,sans-serif';
      x.fillText('Drehmoment & Leistung', 60, 90);
      x.font = '600 48px "Pixelify Sans",cursive,sans-serif';
      x.fillText('P = E / Δt', 90, 180); x.fillText('= m·g·h / Δt', 90, 250);
      x.fillText('HA: S. 42, Nr. 3–7', 600, 300);
      x.strokeStyle = 'rgba(245,245,235,.8)'; x.lineWidth = 5; x.beginPath(); x.moveTo(560, 270); x.lineTo(560, 60); x.lineTo(545, 85); x.moveTo(560, 60); x.lineTo(575, 85); x.stroke();
    });
    var pseTex = canvasTex(512, 256, function (x, w, h) {
      x.fillStyle = '#f2efe6'; x.fillRect(0, 0, w, h);
      var cols = ['#f2d26a', '#7fc4e8', '#9ad08a', '#f2a07a', '#d0b0e8'];
      for (var r = 0; r < 7; r++) for (var c = 0; c < 18; c++) {
        if (r === 0 && c > 0 && c < 17) continue;
        if (r < 3 && c > 1 && c < 12) continue;
        x.fillStyle = cols[(c < 2 ? 0 : c < 12 ? 1 : c < 17 ? 2 : 3)]; x.fillRect(8 + c * 27.5, 12 + r * 33, 25, 30);
      }
    });

    // ---------- Licht ----------
    scene.add(new THREE.HemisphereLight(0xfff6e8, 0x5a5048, 0.75));
    var sonne = new THREE.DirectionalLight(0xfff0d8, 0.95);
    sonne.position.set(-9, 12, 3); sonne.castShadow = true;
    sonne.shadow.mapSize.set(1024, 1024);
    var sc = sonne.shadow.camera; sc.left = -12; sc.right = 12; sc.top = 12; sc.bottom = -12; sc.near = 1; sc.far = 40;
    sonne.shadow.bias = -0.0008;
    scene.add(sonne);
    var fuell = new THREE.DirectionalLight(0xdfe8ff, 0.3); fuell.position.set(6, 6, 10); scene.add(fuell);

    function std(c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8, metalness: 0 }, o || {})); }
    function mesh(geo, mat, x, y, z, schatten) {
      var m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0);
      if (schatten !== false) { m.castShadow = true; m.receiveShadow = true; }
      return m;
    }
    function glow(color, size, opacity) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: color, transparent: true, opacity: opacity || 1, depthWrite: false, blending: THREE.AdditiveBlending }));
      s.scale.set(size, size, 1); return s;
    }

    // ---------- Klassenzimmer ----------
    var raum = new THREE.Group(); scene.add(raum);
    var boden = mesh(new THREE.PlaneGeometry(18, 22), std(0xffffff, { map: holzTex, roughness: 0.7 }), 0, 0, -1);
    boden.rotation.x = -Math.PI / 2; boden.castShadow = false; raum.add(boden);
    var wandM = std(0xf0ead8, { roughness: 0.95 });
    var wandH = mesh(new THREE.PlaneGeometry(18, 7), wandM, 0, 3.5, -10, false); wandH.receiveShadow = true; raum.add(wandH);
    var wandL = mesh(new THREE.PlaneGeometry(22, 7), wandM, -9, 3.5, -1, false); wandL.rotation.y = Math.PI / 2; wandL.receiveShadow = true; raum.add(wandL);
    var wandR = mesh(new THREE.PlaneGeometry(22, 7), wandM, 9, 3.5, -1, false); wandR.rotation.y = -Math.PI / 2; wandR.receiveShadow = true; raum.add(wandR);
    var wandV = mesh(new THREE.PlaneGeometry(18, 7), wandM, 0, 3.5, 10, false); wandV.rotation.y = Math.PI; wandV.receiveShadow = true; raum.add(wandV);
    var decke = mesh(new THREE.PlaneGeometry(18, 22), std(0xf4f1ea, { roughness: 1 }), 0, 7, -1, false); decke.rotation.x = Math.PI / 2; raum.add(decke);
    var sockel = std(0x8fbf6a);
    [[0, -9.98, 0, 18], [-8.98, -1, Math.PI / 2, 22], [8.98, -1, -Math.PI / 2, 22]].forEach(function (w) {
      var s = mesh(new THREE.PlaneGeometry(w[3], 0.25), sockel, w[0], 0.125, w[1], false); s.rotation.y = w[2]; raum.add(s);
    });
    // Tafel
    var tafel = mesh(new THREE.PlaneGeometry(8, 3), new THREE.MeshStandardMaterial({ map: tafelTex, roughness: 0.9 }), 0, 3.2, -9.9, false); raum.add(tafel);
    var rahmen = mesh(new THREE.BoxGeometry(8.3, 3.3, 0.08), std(0x8a5a34), 0, 3.2, -10, false); raum.add(rahmen);
    var ablage = mesh(new THREE.BoxGeometry(8, 0.08, 0.25), std(0x9a9a9a, { metalness: 0.5, roughness: 0.4 }), 0, 1.65, -9.85); raum.add(ablage);
    // Periodensystem rechts
    var pse = mesh(new THREE.PlaneGeometry(3.4, 1.7), new THREE.MeshStandardMaterial({ map: pseTex, roughness: 0.9 }), 8.95, 3.6, -5, false); pse.rotation.y = -Math.PI / 2; raum.add(pse);
    // Fenster links (helles Tageslicht)
    for (var f = 0; f < 3; f++) {
      var fz = -6 + f * 5;
      var fen = mesh(new THREE.PlaneGeometry(3.2, 2.6), new THREE.MeshBasicMaterial({ color: 0xcfe6ff }), -8.97, 3.8, fz, false); fen.rotation.y = Math.PI / 2; raum.add(fen);
      var sp1 = mesh(new THREE.BoxGeometry(0.08, 2.7, 0.1), std(0xeeeeee), -8.92, 3.8, fz, false); raum.add(sp1);
      var sp2 = mesh(new THREE.BoxGeometry(0.08, 0.1, 3.3), std(0xeeeeee), -8.92, 3.8, fz, false); raum.add(sp2);
    }
    // Schränke hinten rechts (wie im Foto)
    for (var s2 = 0; s2 < 3; s2++) {
      var schrank = mesh(new THREE.BoxGeometry(0.7, 2.6, 1.4), std(0xeae6dc, { roughness: 0.7 }), 8.6, 1.3, 2 + s2 * 1.45); raum.add(schrank);
      var griff = mesh(new THREE.BoxGeometry(0.04, 0.25, 0.04), std(0x888888, { metalness: 0.6 }), 8.24, 1.4, 2 + s2 * 1.45 - 0.5, false); raum.add(griff);
    }
    // Lehrerpult
    var pult = mesh(new THREE.BoxGeometry(2.6, 1.0, 1.0), std(0xbfc4ca, { roughness: 0.6 }), 2.6, 0.5, -7.2); raum.add(pult);

    // ---------- Figuren-Helfer ----------
    var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };
    function limb(a, b, r, mat) {
      var d = new THREE.Vector3().subVectors(b, a), len = d.length();
      var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.9, len, 10), mat);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
      m.castShadow = true; return m;
    }
    function kugel(r, mat, p) { var m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat); if (p) m.position.copy(p); m.castShadow = true; return m; }
    var dunkel = new THREE.MeshBasicMaterial({ color: 0x1c1c22 });
    var HAUT = [0xf2c9ae, 0xe8b896, 0xd9a07a, 0xb98060, 0xf6d4c0];
    var HAAR = [0x2a1a12, 0x6b4a30, 0xd8b070, 0x1a1a1a, 0x8a4a22, 0xc89a60];
    var SHIRT = [0xd85a5a, 0x5a7ad8, 0x3faa6a, 0xe8b23f, 0x8a5ad8, 0xe87ab0, 0x2b3a5a, 0xf0f0f0, 0x3a9ab0];

    function kopfBauen(haut, haar, lang) {
      var k = new THREE.Group();
      var hautM = std(haut, { roughness: 0.7 }), haarM = std(haar, { roughness: 0.9 });
      var sch = kugel(0.21, hautM); sch.scale.set(1, 1.1, 1); k.add(sch);
      var kappe = new THREE.Mesh(new THREE.SphereGeometry(0.225, 14, 10, 0, Math.PI * 2, 0, Math.PI * (lang ? 0.62 : 0.5)), haarM);
      kappe.position.y = 0.03; kappe.rotation.x = -0.2; kappe.castShadow = true; k.add(kappe);
      if (lang) { var zopf = kugel(0.16, haarM, V(0, -0.08, -0.15)); zopf.scale.set(1.2, 1.6, 0.8); k.add(zopf); }
      [-1, 1].forEach(function (s) { k.add(kugel(0.025, dunkel, V(s * 0.07, 0.03, 0.19))); });
      return k;
    }

    // ---------- Schüler + Tische ----------
    var SPALTEN = [-3.4, 0, 3.4], REIHEN = [-5.2, -2.4, 0.4];
    var plaetze = [];
    var tischM = std(0xc9cdd2, { roughness: 0.55 }), beinM = std(0x6a6e74, { metalness: 0.5, roughness: 0.4 });
    var stuhlM = std(0x2b2d33, { roughness: 0.6 });
    var hitM = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    REIHEN.forEach(function (rz, ri) {
      SPALTEN.forEach(function (sx, si) {
        var nr = ri * 3 + si;
        // Tisch steht vor dem Schüler (Richtung Tafel)
        var tz = rz - 0.75;
        var platte = mesh(new THREE.BoxGeometry(1.5, 0.07, 0.8), tischM, sx, 1.0, tz); raum.add(platte);
        [[-0.68, -0.33], [0.68, -0.33], [-0.68, 0.33], [0.68, 0.33]].forEach(function (b) { raum.add(mesh(new THREE.BoxGeometry(0.05, 1.0, 0.05), beinM, sx + b[0], 0.5, tz + b[1])); });
        // Stuhl
        raum.add(mesh(new THREE.BoxGeometry(0.5, 0.06, 0.48), stuhlM, sx, 0.62, rz));
        raum.add(mesh(new THREE.BoxGeometry(0.5, 0.55, 0.06), stuhlM, sx, 0.95, rz + 0.24));
        raum.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6), beinM, sx, 0.31, rz));
        // Schüler (sitzt, Blick zur Tafel = -z)
        var schueler = new THREE.Group(); schueler.position.set(sx, 0, rz); raum.add(schueler);
        var shirtM = std(pick(SHIRT), { roughness: 0.85 }), hose = std(pick([0x2b3550, 0x3a3a3a, 0x5a6a8a, 0x6a5a4a]));
        var hautC = pick(HAUT);
        var rumpf = new THREE.Group(); schueler.add(rumpf);
        rumpf.add(mesh(new THREE.BoxGeometry(0.52, 0.6, 0.3), shirtM, 0, 1.0, 0));
        var schu = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.52, 10), shirtM, 0, 1.27, 0); schu.rotation.z = Math.PI / 2; rumpf.add(schu);
        [-1, 1].forEach(function (s) {
          rumpf.add(limb(V(s * 0.3, 1.25, 0), V(s * 0.32, 1.0, -0.3), 0.075, shirtM));
          rumpf.add(limb(V(s * 0.32, 1.0, -0.3), V(s * 0.18, 1.05, -0.55), 0.065, std(hautC)));
          schueler.add(limb(V(s * 0.13, 0.72, 0), V(s * 0.14, 0.7, -0.45), 0.1, hose));
          schueler.add(limb(V(s * 0.14, 0.7, -0.45), V(s * 0.14, 0.05, -0.5), 0.09, hose));
        });
        var halsK = new THREE.Group(); halsK.position.y = 1.42; rumpf.add(halsK);
        halsK.add(limb(V(0, -0.06, 0), V(0, 0.08, 0), 0.07, std(hautC)));
        var kopf = kopfBauen(hautC, pick(HAAR), Math.random() < 0.4);
        kopf.position.y = 0.26; kopf.rotation.y = Math.PI; halsK.add(kopf);
        // Sprechblasen
        var blaseF = new THREE.Sprite(new THREE.SpriteMaterial({ map: blaseTex('?', '#ffffff', '#222'), transparent: true, depthTest: false }));
        var blaseA = new THREE.Sprite(new THREE.SpriteMaterial({ map: blaseTex('!', '#ff4a5a', '#fff'), transparent: true, depthTest: false }));
        [blaseF, blaseA].forEach(function (b) { b.scale.set(1.0, 0.5, 1); b.position.set(0, 2.25, 0); b.visible = false; b.renderOrder = 10; schueler.add(b); });
        // Snack
        var snack = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTex('🥨'), transparent: true }));
        snack.scale.set(0.8, 0.8, 1); snack.position.set(sx, 1.85, tz - 0.05); snack.visible = false; raum.add(snack);
        var snackGlow = glow(0xffe08a, 1.4, 0.0); snackGlow.position.copy(snack.position); raum.add(snackGlow);
        var hit = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.4, 1.9), hitM); hit.position.set(sx, 1.1, tz + 0.3); hit.userData.nr = nr; raum.add(hit);
        plaetze.push({
          nr: nr, x: sx, z: rz, tz: tz, schueler: schueler, rumpf: rumpf, halsK: halsK, blaseF: blaseF, blaseA: blaseA,
          snack: snack, snackGlow: snackGlow, hit: hit, item: null, neuIn: rnd(0.2, 2.5),
          zustand: 'ruhig', zt: rnd(3, 8), dreh: 0, wachsam: rnd(0.8, 1.25)
        });
      });
    });

    // ---------- Lehrer ----------
    var lehrer = new THREE.Group(); lehrer.position.set(-1.5, 0, -8.6); raum.add(lehrer);
    (function () {
      var pulli = std(0x1c2030, { roughness: 0.9 }), hose = std(0x22252c), haut = std(0xe8b896);
      [-1, 1].forEach(function (s) { lehrer.add(limb(V(s * 0.14, 0.05, 0), V(s * 0.14, 0.95, 0), 0.11, hose)); });
      lehrer.add(mesh(new THREE.BoxGeometry(0.62, 0.8, 0.34), pulli, 0, 1.35, 0));
      [-1, 1].forEach(function (s) { lehrer.add(limb(V(s * 0.36, 1.68, 0), V(s * 0.4, 1.0, 0.05), 0.08, pulli)); });
      lehrer.userData.arm = limb(V(0.36, 1.68, 0), V(0.5, 2.2, 0.25), 0.075, pulli); lehrer.add(lehrer.userData.arm);
      var k = kopfBauen(0xe8b896, 0x2a2420, false); k.position.y = 2.0; k.scale.setScalar(1.15); lehrer.add(k);
      var brille = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 14), dunkel); brille.position.set(-0.08, 2.04, 0.22); lehrer.add(brille);
      var b2 = brille.clone(); b2.position.x = 0.08; lehrer.add(b2);
      lehrer.add(limb(V(0, 1.75, 0), V(0, 1.9, 0), 0.08, haut));
    })();
    var lehrerBlaseF = new THREE.Sprite(new THREE.SpriteMaterial({ map: blaseTex('Hm?', '#ffffff', '#222'), transparent: true, depthTest: false }));
    var lehrerBlaseA = new THREE.Sprite(new THREE.SpriteMaterial({ map: blaseTex('!!!', '#ff4a5a', '#fff'), transparent: true, depthTest: false }));
    [lehrerBlaseF, lehrerBlaseA].forEach(function (b) { b.scale.set(1.2, 0.6, 1); b.position.set(0, 2.85, 0); b.visible = false; b.renderOrder = 10; lehrer.add(b); });

    // ---------- Leon ----------
    var leon = new THREE.Group(); leon.position.set(0, 0, 4.4); raum.add(leon);
    var LH = { haut: std(0xe8b896, { roughness: 0.7 }), pulli: std(0x141418, { roughness: 0.95 }), jeans: std(0x1e2433), schuh: std(0xf2f2f2) };
    var koerper = new THREE.Group(); leon.add(koerper);
    [-1, 1].forEach(function (s) {
      koerper.add(limb(V(s * 0.17, 0.08, 0), V(s * 0.17, 1.35, 0), 0.13, LH.jeans));
      koerper.add(mesh(new THREE.BoxGeometry(0.24, 0.14, 0.42), LH.schuh, s * 0.17, 0.07, -0.08));
    });
    koerper.add(mesh(new THREE.BoxGeometry(0.72, 1.0, 0.4), LH.pulli, 0, 1.85, 0));
    var lschu = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.72, 12), LH.pulli, 0, 2.33, 0); lschu.rotation.z = Math.PI / 2; koerper.add(lschu);
    var arme = [-1, 1].map(function (s) {
      var piv = new THREE.Group(); piv.position.set(s * 0.42, 2.3, 0); koerper.add(piv);
      piv.add(limb(V(0, 0, 0), V(0, -0.85, 0), 0.1, LH.pulli));
      piv.add(kugel(0.09, LH.haut, V(0, -0.92, 0)));
      return piv;
    });
    // Hals: Kette aus Kugeln entlang einer Bézierkurve
    var HALS_N = 46, halsKugeln = [];
    var halsGeo = new THREE.SphereGeometry(1, 12, 8);
    for (var hk = 0; hk < HALS_N; hk++) {
      var hm = new THREE.Mesh(halsGeo, LH.haut); hm.castShadow = true; scene.add(hm); halsKugeln.push(hm);
    }
    var lkopf = new THREE.Group(); scene.add(lkopf);
    (function () {
      var sch = kugel(0.3, LH.haut); sch.scale.set(0.95, 1.08, 1); lkopf.add(sch);
      var haarM = std(0x2a1a12, { roughness: 0.95 });
      // Topfschnitt: Kappe + gerader Pony
      var kappe = new THREE.Mesh(new THREE.SphereGeometry(0.315, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.56), haarM);
      kappe.position.y = 0.02; kappe.rotation.x = 0.3; kappe.scale.set(1.03, 1.06, 1.05); kappe.castShadow = true; lkopf.add(kappe);
      [-1, 1].forEach(function (s) {
        var o = kugel(0.07, LH.haut, V(s * 0.29, 0.0, 0)); o.scale.set(0.5, 1, 0.8); lkopf.add(o);
        lkopf.add(kugel(0.035, dunkel, V(s * 0.1, 0.0, 0.27)));
      });
      lkopf.add(kugel(0.045, LH.haut, V(0, -0.06, 0.3)));
      var mundZu = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.016, 6, 14, Math.PI), new THREE.MeshBasicMaterial({ color: 0x8a3a3a }));
      mundZu.position.set(0, -0.15, 0.27); mundZu.rotation.z = Math.PI; lkopf.add(mundZu);
      var mundAuf = new THREE.Group(); mundAuf.position.set(0, -0.16, 0.25); lkopf.add(mundAuf);
      var loch = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color: 0x3a1010 })); loch.scale.set(1.3, 0.9, 0.5); mundAuf.add(loch);
      var zunge = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.03, 0.18), std(0xe8707a, { roughness: 0.5 })); zunge.position.set(0, -0.06, 0.08); zunge.rotation.x = 0.5; mundAuf.add(zunge);
      lkopf.userData.mundZu = mundZu; lkopf.userData.mundAuf = mundAuf;
    })();
    var getragen = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTex('🥨'), transparent: true }));
    getragen.scale.set(0.55, 0.55, 1); getragen.visible = false; scene.add(getragen);

    // ---------- Partikel ----------
    var krumen = [];
    for (var kr = 0; kr < 50; kr++) {
      var km = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), std(0xd8a860)); km.visible = false; scene.add(km);
      krumen.push({ m: km, v: new THREE.Vector3(), t: 0, life: 0 });
    }
    var ki = 0;
    function kruemel(p, farbe, n) {
      for (var i = 0; i < n; i++) {
        var q = krumen[ki++ % krumen.length];
        q.m.material.color.setHex(farbe); q.m.position.copy(p); q.m.visible = true;
        q.v.set(rnd(-1.5, 1.5), rnd(0.5, 2.5), rnd(-1.5, 1.5)); q.t = 0; q.life = rnd(0.5, 0.9);
      }
    }

    // ---------- Spielzustand ----------
    var g;
    function reset() {
      g = {
        modus: 'intro', t: 0, punkte: 0, snacks: 0, verweise: 3, serie: 0, besteSerie: 0, halsLaenge: 0,
        hals: { ext: 0, ziel: null, phase: 'ruhe', len: 1, tempo: 1 }, power: null, powerT: 0, powerDauer: 1,
        lehrer: { zustand: 'schreibt', zt: rnd(6, 9), x: -1.5, zx: 1.5, dreh: 0 }, ertappt: 0, schock: 0, kauen: 0
      };
      plaetze.forEach(function (p) {
        p.item = null; p.snack.visible = false; p.snackGlow.material.opacity = 0; p.neuIn = rnd(0.2, 2); p.zustand = 'ruhig'; p.zt = rnd(3, 8); p.dreh = 0;
        p.blaseF.visible = p.blaseA.visible = false;
      });
      getragen.visible = false;
      renderVerweise();
    }
    function level() { return clamp(g.t / 90, 0, 1); }
    function renderVerweise() { root.querySelectorAll('.ln-verweise i').forEach(function (el, n) { el.classList.toggle('weg', n >= g.verweise); }); }
    var meldTimer = 0;
    function melde(txt, klein, rot) {
      var el = $('meldung'); el.innerHTML = txt + (klein ? '<small>' + klein + '</small>' : '');
      el.className = 'ln-meldung' + (rot ? ' rot' : ''); void el.offsetWidth; el.classList.add('zeigen');
      clearTimeout(meldTimer); meldTimer = setTimeout(function () { el.classList.remove('zeigen'); }, 1100);
    }

    function neuesItem(p) {
      var lv = level();
      if (Math.random() < 0.12 + lv * 0.04 && !plaetze.some(function (q) { return q.item && q.item.power; })) {
        var pw = pick(POWER);
        if (pw.id === 'burger' && g.verweise >= 3) pw = POWER[0];
        p.item = { e: pw.e, power: pw, p: 30, ttl: 7 };
        p.snack.scale.set(1.3, 1.3, 1); p.snackGlow.material.opacity = 0.9;
      } else {
        var sn = pick(SNACKS);
        p.item = { e: sn.e, p: sn.p, name: sn.name, ttl: 99 };
        p.snack.scale.set(0.8, 0.8, 1); p.snackGlow.material.opacity = 0;
      }
      p.snack.material.map = emojiTex(p.item.e); p.snack.material.needsUpdate = true;
      p.snack.visible = true;
    }

    // ---------- Hals ----------
    var basis = V(0, 2.62, 4.35), ruhKopf = V(0, 3.1, 4.25);
    var P0 = new THREE.Vector3(), P1 = new THREE.Vector3(), P2 = new THREE.Vector3(), tmp = new THREE.Vector3();
    function bez(t, out) {
      var a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      return out.set(a * P0.x + b * P1.x + c * P2.x, a * P0.y + b * P1.y + c * P2.y, a * P0.z + b * P1.z + c * P2.z);
    }
    function zielen(p) {
      var h = g.hals;
      if (!p.item || h.phase !== 'ruhe' || g.ertappt > 0) return;
      h.ziel = p; h.phase = 'raus'; h.ext = 0;
      P0.copy(basis);
      P2.set(p.snack.position.x, p.snack.position.y + 0.25, p.snack.position.z + 0.15);
      P1.copy(P0).add(P2).multiplyScalar(0.5); P1.y = Math.max(P0.y, P2.y) + 1.6 + P0.distanceTo(P2) * 0.12;
      h.len = P0.distanceTo(P1) + P1.distanceTo(P2);
      Pixel.sfx.tone(300, 0.25, 'triangle', 0.05, 700);
    }
    function einziehen() {
      var h = g.hals;
      if (h.phase === 'raus' || h.phase === 'zurueck') { h.phase = 'zurueck'; h.schnell = true; }
    }
    function erwischt(wer) {
      var h = g.hals;
      g.verweise--; renderVerweise();
      g.serie = 0; g.ertappt = 1.0; g.schock = 1.2;
      h.phase = 'zurueck'; h.schnell = true; h.beute = null; getragen.visible = false;
      melde(wer === 'lehrer' ? pick(LEHRER) : pick(ERWISCHT), wer === 'lehrer' ? 'Der Lehrer hat dich gesehen' : 'Erwischt!', true);
      var rot = $('rot'); rot.classList.add('an'); setTimeout(function () { rot.classList.remove('an'); }, 80);
      Pixel.sfx.tone(440, 0.12, 'square', 0.07); Pixel.sfx.tone(220, 0.3, 'sawtooth', 0.07, 110, 0.1);
      if (g.verweise <= 0) setTimeout(ende, 700);
    }
    function fressen(item) {
      g.snacks++; g.serie++; g.besteSerie = Math.max(g.besteSerie, g.serie);
      var mult = Math.min(5, 1 + Math.floor(g.serie / 4)) * (g.power && g.power.id === 'energy' ? 2 : 1);
      var pts = item.p * mult; g.punkte += pts;
      g.kauen = 0.8; g.halsLaenge = Math.min(1, g.halsLaenge + 0.02);
      kruemel(lkopf.position, 0xd8a860, 10);
      Pixel.sfx.noise(0.08, 0.25, 2500); Pixel.sfx.noise(0.08, 0.25, 2000);
      if (item.power) {
        var pw = item.power;
        if (pw.id === 'burger') { g.verweise = Math.min(3, g.verweise + 1); renderVerweise(); }
        else { g.power = pw; g.powerT = pw.dauer; g.powerDauer = pw.dauer; }
        melde(pw.name, pw.info);
        Pixel.sfx.tone(523, 0.1, 'square', 0.06); Pixel.sfx.tone(659, 0.1, 'square', 0.06, null, 0.1); Pixel.sfx.tone(784, 0.2, 'square', 0.06, null, 0.2);
      } else if (g.serie > 0 && g.serie % 4 === 0) {
        melde('SERIE x' + Math.min(5, 1 + Math.floor(g.serie / 4)), '+' + pts);
      }
    }

    function halsUpdate(dt) {
      var h = g.hals, wings = g.power && g.power.id === 'wings';
      var speed = (wings ? 15 : 8.5) * (h.schnell ? 1.8 : 1);
      if (h.phase === 'raus') {
        h.ext += dt * speed / h.len;
        if (h.ext >= 1) {
          h.ext = 1;
          var p = h.ziel;
          if (p.item) {
            h.beute = p.item; p.item = null; p.snack.visible = false; p.snackGlow.material.opacity = 0; p.neuIn = rnd(1.5, 4) * lerp(1, 0.6, level());
            getragen.material.map = emojiTex(h.beute.e); getragen.material.needsUpdate = true; getragen.visible = true;
            Pixel.sfx.tone(880, 0.06, 'square', 0.05);
          }
          h.phase = 'zurueck'; h.schnell = false;
        }
      } else if (h.phase === 'zurueck') {
        h.ext -= dt * speed / h.len;
        if (h.ext <= 0) {
          h.ext = 0; h.phase = 'ruhe'; h.schnell = false;
          if (h.beute) { fressen(h.beute); h.beute = null; getragen.visible = false; }
          h.ziel = null;
        }
      }
      // Hals zeichnen
      var schwanken = Math.sin(g.t * 2) * 0.06;
      if (h.phase === 'ruhe' || !h.ziel) {
        P0.copy(basis); P2.copy(ruhKopf); P2.x += schwanken; P2.y += g.halsLaenge * 0.8; P1.copy(P0).lerp(P2, 0.5); P1.z += 0.05;
      }
      var e = h.phase === 'ruhe' ? 1 : Math.max(0.02, h.ext);
      // Kopf leicht über dem Halsende
      var kopfT = h.phase === 'ruhe' ? 1 : e;
      bez(kopfT, lkopf.position);
      for (var i = 0; i < HALS_N; i++) {
        var t = (i / (HALS_N - 1)) * kopfT;
        bez(t, halsKugeln[i].position);
        var r = 0.13 - 0.02 * (i / HALS_N);
        halsKugeln[i].scale.setScalar(r);
        halsKugeln[i].visible = h.phase !== 'ruhe' || i % 3 === 0;
      }
      // Blickrichtung des Kopfes
      if (h.phase === 'ruhe') { tmp.set(lkopf.position.x, lkopf.position.y - 0.4, lkopf.position.z - 3); }
      else { bez(Math.min(1, kopfT + 0.05), tmp); if (kopfT >= 0.99) tmp.set(P2.x, P2.y - 0.5, P2.z - 0.5); }
      lkopf.lookAt(tmp);
      lkopf.position.y += 0.05;
      var offen = h.phase === 'raus' || g.kauen > 0;
      lkopf.userData.mundAuf.visible = offen; lkopf.userData.mundZu.visible = !offen;
      if (g.kauen > 0) lkopf.userData.mundAuf.scale.y = 0.6 + Math.abs(Math.sin(g.t * 18)) * 0.6; else lkopf.userData.mundAuf.scale.y = 1;
      if (getragen.visible) getragen.position.set(lkopf.position.x, lkopf.position.y - 0.32, lkopf.position.z + 0.1);
    }

    // ---------- Aufmerksamkeit ----------
    function wachUpdate(dt) {
      var lv = level(), pizza = g.power && g.power.id === 'pizza';
      plaetze.forEach(function (p) {
        // Items
        if (!p.item && !(g.hals.ziel === p && g.hals.phase === 'raus')) { p.neuIn -= dt; if (p.neuIn <= 0 && g.modus === 'spiel') neuesItem(p); }
        if (p.item && p.item.power) { p.item.ttl -= dt; if (p.item.ttl <= 0 && g.hals.ziel !== p) { p.item = null; p.snack.visible = false; p.snackGlow.material.opacity = 0; p.neuIn = rnd(2, 4); } }
        if (p.item) { p.snack.position.y = 1.85 + Math.sin(g.t * 3 + p.nr) * 0.06; p.snackGlow.position.y = p.snack.position.y; }
        // Zustand
        p.zt -= dt;
        if (p.zustand === 'ruhig' && p.zt <= 0 && g.modus === 'spiel') {
          p.zustand = 'verdacht'; p.zt = lerp(0.95, 0.5, lv);
        } else if (p.zustand === 'verdacht' && p.zt <= 0) {
          p.zustand = 'schaut'; p.zt = lerp(1.1, 1.7, lv) * p.wachsam;
          Pixel.sfx.tone(660, 0.05, 'square', 0.025);
        } else if (p.zustand === 'schaut' && p.zt <= 0) {
          p.zustand = 'ruhig'; p.zt = rnd(lerp(6, 2.4, lv), lerp(11, 5, lv)) / p.wachsam;
        }
        var zielDreh = p.zustand === 'schaut' ? 1 : p.zustand === 'verdacht' ? 0.25 : 0;
        p.dreh = lerp(p.dreh, zielDreh, dt * 9);
        p.halsK.rotation.y = p.dreh * Math.PI * 0.85;
        p.rumpf.rotation.y = p.dreh * 0.35;
        p.blaseF.visible = p.zustand === 'verdacht';
        p.blaseA.visible = p.zustand === 'schaut';
        if (g.hals.ziel === p && g.hals.ext > 0.08 && g.hals.phase !== 'ruhe' && p.zustand === 'schaut' && !pizza && g.ertappt <= 0 && g.modus === 'spiel') erwischt('schueler');
      });
      // Lehrer
      var L = g.lehrer;
      L.zt -= dt;
      if (L.zustand === 'schreibt') {
        L.x = lerp(L.x, L.zx, dt * 0.4); if (Math.abs(L.x - L.zx) < 0.1) L.zx = rnd(-2.8, 2.8);
        if (L.zt <= 0 && g.modus === 'spiel') { L.zustand = 'verdacht'; L.zt = lerp(1.1, 0.6, lv); }
      } else if (L.zustand === 'verdacht' && L.zt <= 0) {
        L.zustand = 'schaut'; L.zt = lerp(1.8, 2.8, lv);
      } else if (L.zustand === 'schaut' && L.zt <= 0) {
        L.zustand = 'schreibt'; L.zt = rnd(lerp(8, 3.5, lv), lerp(12, 6, lv));
      }
      var zd = L.zustand === 'schaut' ? 1 : L.zustand === 'verdacht' ? 0.3 : 0;
      L.dreh = lerp(L.dreh, zd, dt * 7);
      lehrer.position.x = L.x;
      lehrer.rotation.y = Math.PI + L.dreh * Math.PI;
      lehrer.userData.arm.visible = L.zustand === 'schreibt';
      lehrerBlaseF.visible = L.zustand === 'verdacht'; lehrerBlaseA.visible = L.zustand === 'schaut';
      if (L.zustand === 'schaut' && g.hals.phase !== 'ruhe' && g.hals.ext > 0.08 && !pizza && g.ertappt <= 0 && g.modus === 'spiel') erwischt('lehrer');
    }

    // ---------- Eingabe ----------
    var ray = new THREE.Raycaster(), maus = new THREE.Vector2();
    var hitObjs = plaetze.map(function (p) { return p.hit; });
    function tippen(e) {
      if (g.modus !== 'spiel' || e.target !== canvas) return;
      var r = canvas.getBoundingClientRect();
      maus.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      if (g.hals.phase !== 'ruhe') { einziehen(); return; }
      ray.setFromCamera(maus, cam);
      var hits = ray.intersectObjects(hitObjs);
      if (hits.length) zielen(plaetze[hits[0].object.userData.nr]);
    }
    function onKey(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel') { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); los(); } return; }
      if (e.key === ' ') { e.preventDefault(); einziehen(); return; }
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 9) {
        // 1–3 vorne, 7–9 hinten (wie auf dem Ziffernblock von oben gesehen)
        var reihe = 2 - Math.floor((n - 1) / 3), spalte = (n - 1) % 3;
        zielen(plaetze[reihe * 3 + spalte]);
      }
    }

    // ---------- Nachbearbeitung ----------
    var composer = null, grade = null;
    var GRADE = {
      uniforms: { tDiffuse: { value: null } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'uniform sampler2D tDiffuse; varying vec2 vUv;',
        'void main(){ vec2 d = vUv - 0.5; vec3 c = texture2D(tDiffuse, vUv).rgb;',
        ' c = mix(c, c*vec3(1.05,1.0,0.94), 0.5); c = (c-0.5)*1.05+0.5; c *= 1.0 - smoothstep(0.2,0.8,dot(d,d))*0.45;',
        ' gl_FragColor = vec4(max(c,0.0),1.0); }'
      ].join('\n')
    };
    if (THREE.EffectComposer && THREE.RenderPass && THREE.ShaderPass && THREE.UnrealBloomPass) {
      try {
        var rt = new THREE.WebGLRenderTarget(1, 1, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
        rt.texture.encoding = THREE.sRGBEncoding;
        composer = new THREE.EffectComposer(renderer, rt);
        composer.addPass(new THREE.RenderPass(scene, cam));
        composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.35, 0.4, 0.92));
        grade = new THREE.ShaderPass(GRADE); composer.addPass(grade);
      } catch (e) { composer = null; }
    }
    var hoch = false;
    function resize() {
      var w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; hoch = h > w;
      cam.fov = hoch ? 66 : 48; cam.updateProjectionMatrix();
      if (composer) { composer.setPixelRatio(dpr); composer.setSize(w, h); }
    }

    // ---------- Schleife ----------
    var camZiel = new THREE.Vector3(), blick = new THREE.Vector3();
    function update(dt) {
      g.t += g.modus === 'spiel' ? dt : 0;
      g.ertappt = Math.max(0, g.ertappt - dt); g.schock = Math.max(0, g.schock - dt); g.kauen = Math.max(0, g.kauen - dt);
      if (g.power) { g.powerT -= dt; if (g.powerT <= 0) g.power = null; }
      wachUpdate(dt);
      halsUpdate(dt);
      // Leon-Körper: wippt, Arme
      koerper.position.y = Math.sin(performance.now() / 300) * 0.02;
      arme.forEach(function (a, i) { a.rotation.x = g.schock > 0 ? -2.6 : Math.sin(performance.now() / 400 + i) * 0.08; a.rotation.z = (i ? -1 : 1) * (g.schock > 0 ? 0.4 : 0.08); });
      // Krümel
      krumen.forEach(function (q) {
        if (!q.m.visible) return;
        q.t += dt; if (q.t > q.life) { q.m.visible = false; return; }
        q.v.y -= 9 * dt; q.m.position.addScaledVector(q.v, dt);
      });
      // Kamera
      var zeit = performance.now() / 1000;
      if (g.modus === 'spiel') {
        if (hoch) { camZiel.set(0, 9.5, 11.5); blick.set(0, 0.6, -3.2); }
        else { camZiel.set(0, 7.2, 10.5); blick.set(0, 1.0, -2.6); }
        cam.position.lerp(camZiel, Math.min(1, dt * 2.5));
      } else {
        var a = zeit * 0.25;
        if (hoch) camZiel.set(2.6 + Math.sin(a) * 0.6, 3.6, -1.2 + Math.cos(a) * 0.4); else camZiel.set(4.5 + Math.sin(a) * 0.8, 3.3, -0.2 + Math.cos(a) * 0.4);
        cam.position.lerp(camZiel, Math.min(1, dt * 2));
        if (hoch) blick.set(0.2, 0.9, 4.4); else blick.set(2.2, 2.0, 4.2);
      }
      cam.lookAt(blick);
      // HUD
      if (g.modus === 'spiel') {
        $('punkte').textContent = g.punkte;
        $('snacks').textContent = g.snacks + (g.snacks === 1 ? ' Snack' : ' Snacks');
        var sr = $('serie'), m = Math.min(5, 1 + Math.floor(g.serie / 4));
        sr.textContent = 'x' + m; sr.classList.toggle('leer', m < 2);
        var pw = $('power');
        if (g.power) { pw.classList.add('an'); $('powerName').textContent = g.power.e + ' ' + g.power.info; $('powerBar').style.width = (g.powerT / g.powerDauer * 100) + '%'; }
        else pw.classList.remove('an');
        if (g.t > 6) $('tipp').style.opacity = 0;
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
      update(dt); render();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function intro() {
      ebene.classList.remove('aus');
      ebene.innerHTML =
        '<div class="ln-tafel"><span class="kreide">🦒</span><h1>Leon<br>Der lange Hals</h1>' +
        '<div class="unter">Physikstunde. Alle haben Snacks dabei. Leon hat Hunger – und einen sehr langen Hals.</div>' +
        '<div class="zeile"><span>Bestmarke</span><b>' + (+Pixel.get(BEST_KEY, 0)) + '</b></div>' +
        '<ul><li>👆 Snack antippen: Leon fährt den Hals aus und schnappt ihn sich.</li>' +
        '<li>❓ wird zu ❗ – wer sich umdreht, während dein Hals bei ihm ist, erwischt dich. Nochmal tippen zieht den Hals ein.</li>' +
        '<li>👨‍🏫 Dreht sich der Lehrer um, darf der Hals nirgends draußen sein.</li>' +
        '<li>🍗🍕🥤🍔 Riesen-Portionen sind Power-ups. 3 Verweise = Nachsitzen.</li></ul>' +
        '<button class="ln-btn" data-act="los">Pause! Los geht\'s</button></div>';
    }
    function los() {
      if (g.modus === 'spiel') return;
      reset(); g.modus = 'spiel';
      ebene.classList.add('aus'); hud.classList.add('an'); $('tipp').style.opacity = 0.85;
      Pixel.sfx.tone(392, 0.1, 'square', 0.05); Pixel.sfx.tone(523, 0.16, 'square', 0.05, null, 0.1);
    }
    function ende() {
      if (g.modus !== 'spiel') return;
      g.modus = 'ende'; hud.classList.remove('an');
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best;
      if (neu) Pixel.set(BEST_KEY, g.punkte);
      Pixel.sfx.tone(392, 0.2, 'square', 0.06, 196); Pixel.sfx.tone(262, 0.4, 'square', 0.06, 130, 0.2);
      setTimeout(function () {
        if (!alive) return;
        ebene.classList.remove('aus');
        ebene.innerHTML =
          '<div class="ln-tafel"><span class="kreide">📄</span><h1>Nachsitzen!</h1>' +
          '<div class="unter">' + pick(['Leon muss nach der Stunde bleiben. Mit vollem Bauch.', 'Drei Verweise. Aber satt.', 'Der Hals wird jetzt amtlich vermessen.']) + '</div>' +
          '<div class="zeile"><span>Punkte</span><b>' + g.punkte + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Snacks geschnappt</span><b>' + g.snacks + '</b></div>' +
          '<div class="zeile"><span>Beste Serie</span><b>' + g.besteSerie + '</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte) + '</b></div>' +
          '<div style="height:12px"></div>' +
          '<button class="ln-btn" data-act="los">Nächste Stunde</button>' +
          '<button class="ln-btn zweit" data-act="exit">Menü</button></div>';
      }, 600);
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
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey); window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', tippen);
      root.removeEventListener('click', onClick);
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
      });
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch (e) {}
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', onKey); window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', tippen);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    cam.position.set(4.5, 3.3, -0.2);
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.leon = { start: start };
})();
