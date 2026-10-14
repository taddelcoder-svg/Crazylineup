// Omar: Sahara Express – 3D-Kamel-Simulator (three.js).
// Omar reitet mit seinem Kamel durch die Sahara und liefert Waren zwischen Marrakech,
// Aït-Ben-Haddou, Oase Tinfou, Zagora und Merzouga. Wasser ist knapp: Brunnen und
// Minztee füllen auf. Galopp kostet Wasser. Tag-Nacht-Wechsel und Sandstürme.
// Steuern: A/D bzw. ←/→ lenken, W/↑/Shift Galopp. Am Handy Tasten unten.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.omar.best';
  var RADIUS = 280;

  var ORTE = [
    { id: 'marrakech', name: 'Marrakech', art: 'souk', x: 0, z: -235, wasser: true },
    { id: 'aitbenhaddou', name: 'Aït-Ben-Haddou', art: 'kasbah', x: -185, z: -95, wasser: true },
    { id: 'tinfou', name: 'Oase Tinfou', art: 'oase', x: 150, z: -55, wasser: true },
    { id: 'zagora', name: 'Zagora', art: 'kasbah', x: -160, z: 165, wasser: false },
    { id: 'merzouga', name: 'Merzouga', art: 'camp', x: 175, z: 175, wasser: true }
  ];
  var WAREN = [
    { e: '🌴', name: 'Datteln' }, { e: '🧶', name: 'Teppich' }, { e: '🫖', name: 'Minztee' },
    { e: '🌶️', name: 'Gewürze' }, { e: '🥿', name: 'Babouches' }, { e: '🏺', name: 'Tajine' }, { e: '🫒', name: 'Oliven' }
  ];

  var CSS = [
    '.om{position:absolute;inset:0;overflow:hidden;background:#2a1a10;font-family:"Barlow Semi Condensed","Arial Narrow",Arial,sans-serif;color:#fff8ee;touch-action:none}',
    '.om canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.om-hud{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .5s}',
    '.om-hud.an{opacity:1}',
    '.om-geld{position:absolute;left:calc(66px + env(safe-area-inset-left));top:calc(12px + env(safe-area-inset-top));text-shadow:0 2px 10px rgba(0,0,0,.55)}',
    '.om-geld b{display:block;font-size:clamp(28px,6vw,44px);font-weight:800;line-height:1}',
    '.om-geld span{font-size:15px;font-weight:600;opacity:.85}',
    '.om-auftrag{position:absolute;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translateX(-50%);background:rgba(40,20,10,.72);',
    ' border:2px solid #e8b04a;border-radius:10px;padding:6px 14px 7px;text-align:center;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.35)}',
    '.om-auftrag small{display:block;font-size:12px;letter-spacing:.12em;color:#e8b04a;font-weight:800}',
    '.om-auftrag b{font-size:clamp(16px,4vw,21px);font-weight:800}',
    '.om-auftrag i{font-style:normal;font-weight:800;margin-left:8px;color:#ffd27a}',
    '.om-auftrag i.spaet{color:#ff7a6a}',
    '.om-kompass{position:absolute;left:50%;top:calc(78px + env(safe-area-inset-top));transform:translateX(-50%);width:64px;height:64px;',
    ' border-radius:50%;background:rgba(40,20,10,.55);border:2px solid rgba(232,176,74,.8);display:flex;align-items:center;justify-content:center}',
    '.om-kompass svg{width:40px;height:40px;transition:transform .1s linear}',
    '.om-kompass span{position:absolute;bottom:-20px;font-size:14px;font-weight:800;text-shadow:0 2px 6px rgba(0,0,0,.7);white-space:nowrap}',
    '.om-wasser{position:absolute;right:calc(66px + env(safe-area-inset-right));top:calc(18px + env(safe-area-inset-top));width:min(32vw,170px)}',
    '.om-wasser span{font-size:14px;font-weight:800;text-shadow:0 2px 6px rgba(0,0,0,.6)}',
    '.om-wasser div{height:12px;border-radius:6px;background:rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.6);overflow:hidden;margin-top:3px}',
    '.om-wasser i{display:block;height:100%;background:linear-gradient(90deg,#2a8ad8,#6ad0ff);transition:width .2s}',
    '.om-wasser.knapp i{background:linear-gradient(90deg,#d84a3a,#ff8a6a);animation:omBlink .6s infinite alternate}',
    '@keyframes omBlink{to{opacity:.45}}',
    '.om-meldung{position:absolute;left:50%;top:36%;transform:translate(-50%,-50%);font-size:clamp(26px,6vw,46px);font-weight:800;color:#ffd27a;text-align:center;',
    ' text-shadow:0 0 18px rgba(0,0,0,.5),0 3px 0 rgba(0,0,0,.45);opacity:0;white-space:nowrap}',
    '.om-meldung small{display:block;font-size:.45em;color:#fff8ee}',
    '.om-meldung.zeigen{animation:omPop 1.6s ease-out}',
    '@keyframes omPop{0%{opacity:0;transform:translate(-50%,-30%) scale(.8)}10%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-75%)}}',
    '.om-tipp{position:absolute;left:50%;bottom:calc(110px + env(safe-area-inset-bottom));transform:translateX(-50%);font-size:clamp(13px,3.6vw,17px);font-weight:600;',
    ' opacity:.9;white-space:nowrap;text-shadow:0 2px 8px rgba(0,0,0,.7);transition:opacity 1s}',
    '@media (pointer:fine){.om-tipp{bottom:calc(18px + env(safe-area-inset-bottom))}}',
    '@media (max-width:640px){.om-auftrag{top:calc(62px + env(safe-area-inset-top))}.om-kompass{top:calc(128px + env(safe-area-inset-top))}.om-wasser{width:28vw}}',
    '.om-knopf{position:absolute;top:calc(12px + env(safe-area-inset-top));width:42px;height:42px;border-radius:8px;border:2px solid rgba(232,176,74,.8);',
    ' background:rgba(120,50,20,.75);color:#fff;font:700 20px/1 sans-serif;cursor:pointer;z-index:20}',
    '.om-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;align-items:flex-end;padding:0 14px calc(14px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.om-pad.an{display:flex}',
    '.om-pad .grp{display:flex;gap:12px}',
    '.om-pad button{pointer-events:auto;width:76px;height:76px;border-radius:50%;border:3px solid rgba(255,240,210,.6);background:rgba(60,30,10,.4);color:#fff;font:800 26px/1 sans-serif;touch-action:none}',
    '.om-pad button.galopp{width:96px;height:96px;font:800 16px/1 "Barlow Semi Condensed",sans-serif;letter-spacing:.05em}',
    '.om-pad button.gedrueckt{background:rgba(232,176,74,.6)}',
    '.om-ebene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:30;transition:opacity .45s}',
    '.om-ebene.aus{opacity:0;pointer-events:none}',
    '@media (min-width:900px){.om-ebene{justify-content:flex-start;padding-left:6vw}}',
    '@media (max-width:899px) and (orientation:portrait){.om-ebene{align-items:flex-end;padding-bottom:calc(16px + env(safe-area-inset-bottom))}}',
    // Zellige-Rahmen
    '.om-tafel{position:relative;width:min(480px,100%);padding:12px;border-radius:16px;',
    ' background:conic-gradient(from 45deg,#1f6a6a 0 25%,#e8b04a 0 50%,#b8452a 0 75%,#f2e6cc 0) 0 0/22px 22px;box-shadow:0 30px 80px rgba(0,0,0,.55)}',
    '.om-tafel .innen{background:#f6ead2;color:#3a2010;border-radius:10px;padding:22px 22px 18px;position:relative}',
    '.om-tafel .bogen{position:absolute;left:50%;top:-30px;transform:translateX(-50%);width:120px;height:60px;border-radius:60px 60px 0 0;',
    ' background:#f6ead2;display:flex;align-items:flex-end;justify-content:center;font-size:30px;padding-bottom:4px}',
    '.om-tafel h1{margin:0;font-size:clamp(38px,9vw,60px);font-weight:800;line-height:.92;color:#b8452a}',
    '.om-tafel .unter{font-size:18px;font-weight:600;margin:8px 0 12px;color:#5a3a20}',
    '.om-tafel ul{margin:8px 0 12px;padding:0;list-style:none;font-size:16px;line-height:1.45;font-weight:600}',
    '.om-tafel .zeile{display:flex;justify-content:space-between;border-top:2px dotted rgba(90,58,32,.35);padding:6px 0;font-size:19px;font-weight:600}',
    '.om-tafel .zeile b{font-size:23px;font-weight:800;color:#1f6a6a}',
    '.om-btn{width:100%;border:0;border-radius:8px;background:#b8452a;color:#fff8ee;font-family:inherit;font-weight:800;font-size:25px;padding:11px 16px;cursor:pointer;box-shadow:0 4px 0 #7a2a14}',
    '.om-btn:active{transform:translateY(3px);box-shadow:0 1px 0 #7a2a14}',
    '.om-btn.zweit{margin-top:10px;background:transparent;color:#5a3a20;border:2px solid rgba(90,58,32,.5);box-shadow:none;font-size:19px;padding:7px}',
    '@media (max-width:899px) and (orientation:portrait){.om-tafel h1{font-size:38px}.om-tafel .innen{padding:16px 16px 14px}.om-tafel ul{font-size:14px}}',
    '.om-fehler{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-size:20px;z-index:40;background:#2a1a10}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function smooth(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function winkel(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }

  // Dünen-Höhe (flach an den Orten)
  function hoehe(x, z) {
    var h = 4.2 * Math.sin(x * 0.028 + Math.sin(z * 0.019) * 2.2) * Math.cos(z * 0.024 + x * 0.004)
      + 2.6 * Math.sin((x + z) * 0.047 + 1.3) + 1.1 * Math.sin(x * 0.11 - z * 0.07) + 0.5 * Math.sin(z * 0.19 + x * 0.05);
    h += 3;
    for (var i = 0; i < ORTE.length; i++) {
      var o = ORTE[i], d = Math.hypot(x - o.x, z - o.z);
      h = lerp(1.2, h, smooth(16, 40, d));
    }
    var r = Math.hypot(x, z);
    h += smooth(RADIUS - 10, RADIUS + 40, r) * 30;
    return h;
  }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="om"><canvas></canvas>' +
      '<div class="om-hud">' +
        '<div class="om-geld"><b data-el="geld">0 DH</b><span data-el="lief">0 Lieferungen</span></div>' +
        '<div class="om-auftrag"><small>AUFTRAG</small><b data-el="auftrag">–</b><i data-el="uhr">0:00</i></div>' +
        '<div class="om-kompass"><svg viewBox="0 0 40 40" data-el="pfeil"><path d="M20 3 L30 30 L20 24 L10 30 Z" fill="#ffd27a" stroke="#3a2010" stroke-width="2" stroke-linejoin="round"/></svg><span data-el="dist">0 m</span></div>' +
        '<div class="om-wasser" data-el="wasserBox"><span>💧 WASSER</span><div><i data-el="wasser"></i></div></div>' +
        '<div class="om-meldung" data-el="meldung"></div>' +
        '<div class="om-tipp" data-el="tipp">Folge dem Kompass · A/D lenken · W/Shift Galopp</div>' +
      '</div>' +
      '<div class="om-pad"><div class="grp"><button data-pad="l" aria-label="Links">◀</button><button data-pad="r" aria-label="Rechts">▶</button></div>' +
      '<button class="galopp" data-pad="g" aria-label="Galopp">GALOPP</button></div>' +
      '<button class="om-knopf" style="left:calc(12px + env(safe-area-inset-left))" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
      '<button class="om-knopf" style="right:calc(12px + env(safe-area-inset-right))" data-act="ton" aria-label="Ton an/aus"></button>' +
      '<div class="om-ebene" data-el="ebene"></div></div>';
    root.appendChild(style);
    var box = root.querySelector('.om'), canvas = root.querySelector('canvas');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var hud = root.querySelector('.om-hud'), ebene = $('ebene'), tonBtn = root.querySelector('[data-act=ton]'), pad = root.querySelector('.om-pad');
    var alive = true, raf = 0;

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); }
    catch (e) {
      box.insertAdjacentHTML('beforeend', '<div class="om-fehler">Dein Browser konnte die 3D-Grafik nicht starten. Schließ andere Tabs mit 3D-Inhalten und lade neu.</div>');
      return function () {};
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    renderer.setPixelRatio(dpr);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xe8b888, 60, 330);
    var cam = new THREE.PerspectiveCamera(58, 1, 0.3, 2000);

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
    var sandTex = canvasTex(256, 256, function (x, w, h) {
      x.fillStyle = '#808080'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 2600; i++) { var v = 110 + Math.random() * 40; x.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')'; x.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
      x.globalAlpha = 0.25;
      for (var r = 0; r < 26; r++) {
        x.strokeStyle = r % 2 ? '#a8a8a8' : '#606060'; x.lineWidth = 2; x.beginPath();
        for (var px = 0; px <= w; px += 8) { var py = r * 10 + Math.sin(px * 0.05 + r) * 4; if (px === 0) x.moveTo(px, py); else x.lineTo(px, py); }
        x.stroke();
      }
    }, false);
    sandTex.wrapS = sandTex.wrapT = THREE.RepeatWrapping; sandTex.repeat.set(70, 70);
    var deckeTex = canvasTex(128, 128, function (x, w, h) {
      x.fillStyle = '#b8452a'; x.fillRect(0, 0, w, h);
      var cols = ['#e8b04a', '#1f6a6a', '#f2e6cc', '#3a2010'];
      for (var b = 0; b < 8; b++) { x.fillStyle = cols[b % 4]; x.fillRect(0, b * 16 + 6, w, 4); }
      for (var d = 0; d < 8; d++) { x.fillStyle = cols[(d + 1) % 4]; x.beginPath(); x.moveTo(d * 16 + 8, 0); x.lineTo(d * 16 + 16, 8); x.lineTo(d * 16 + 8, 16); x.lineTo(d * 16, 8); x.fill(); }
    });
    var lehmTex = canvasTex(128, 128, function (x, w, h) {
      x.fillStyle = '#c47a48'; x.fillRect(0, 0, w, h);
      for (var i = 0; i < 900; i++) { x.fillStyle = Math.random() < 0.5 ? 'rgba(90,40,10,.12)' : 'rgba(255,220,180,.12)'; x.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    });
    lehmTex.wrapS = lehmTex.wrapT = THREE.RepeatWrapping;
    function textTex(txt) {
      return canvasTex(512, 128, function (x, w, h) {
        x.font = '800 64px "Barlow Semi Condensed",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.lineWidth = 10; x.strokeStyle = 'rgba(40,20,10,.85)'; x.strokeText(txt, w / 2, h / 2); x.fillStyle = '#fff1d6'; x.fillText(txt, w / 2, h / 2);
      });
    }
    var emojiCache = {};
    function emojiTex(e) {
      return emojiCache[e] || (emojiCache[e] = canvasTex(128, 128, function (x, w) {
        x.font = '100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, w / 2, w / 2 + 6);
      }));
    }

    function std(c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85, metalness: 0 }, o || {})); }
    function glow(color, size, opacity) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: color, transparent: true, opacity: opacity || 1, depthWrite: false, blending: THREE.AdditiveBlending }));
      s.scale.set(size, size, 1); return s;
    }
    function schatten(m) { m.castShadow = true; m.receiveShadow = true; return m; }

    // ---------- Himmel ----------
    var himmelU = {
      uZenit: { value: new THREE.Color() }, uHorizont: { value: new THREE.Color() }, uSonne: { value: new THREE.Vector3(0, 1, 0) },
      uSonnenFarbe: { value: new THREE.Color() }, uNacht: { value: 0 }
    };
    var himmel = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false, uniforms: himmelU,
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'uniform vec3 uZenit, uHorizont, uSonnenFarbe, uSonne; uniform float uNacht; varying vec3 vD;',
        'void main(){',
        ' float y = max(vD.y, -0.1);',
        ' vec3 c = mix(uHorizont, uZenit, pow(smoothstep(-0.05, 0.6, y), 0.7));',
        ' float s = max(dot(vD, normalize(uSonne)), 0.0);',
        ' c += uSonnenFarbe * (pow(s, 600.0)*3.0 + pow(s, 12.0)*0.35 + pow(s, 3.0)*0.12);',
        ' gl_FragColor = vec4(c, 1.0);',
        '}'
      ].join('\n')
    }));
    scene.add(himmel);
    var sternGeo = new THREE.BufferGeometry(), sp = [];
    for (var i = 0; i < 700; i++) { var th = Math.random() * 6.283, ph = rnd(0.08, 1.4); sp.push(Math.cos(th) * Math.cos(ph) * 1200, Math.sin(ph) * 1200, Math.sin(th) * Math.cos(ph) * 1200); }
    sternGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    var sternMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0 });
    scene.add(new THREE.Points(sternGeo, sternMat));
    var mond = glow(0xeef2ff, 90, 0); mond.material.fog = false; scene.add(mond);

    var hemi = new THREE.HemisphereLight(0xbcd4ff, 0x8a5a30, 0.6); scene.add(hemi);
    var sonne = new THREE.DirectionalLight(0xffe0b0, 1.2);
    sonne.castShadow = true; sonne.shadow.mapSize.set(1024, 1024);
    var sc = sonne.shadow.camera; sc.left = -22; sc.right = 22; sc.top = 22; sc.bottom = -22; sc.near = 1; sc.far = 160;
    sonne.shadow.bias = -0.0006;
    scene.add(sonne); scene.add(sonne.target);

    // ---------- Wüste ----------
    var geo = new THREE.PlaneGeometry(760, 760, 190, 190);
    geo.rotateX(-Math.PI / 2);
    var pos = geo.attributes.position, farben = [];
    var cSand = new THREE.Color('#e2b27a'), cKamm = new THREE.Color('#f2cf98'), cTal = new THREE.Color('#c08850'), cFels = new THREE.Color('#8a5a3a'), tmpC = new THREE.Color();
    for (i = 0; i < pos.count; i++) {
      var vx = pos.getX(i), vz = pos.getZ(i), hh = hoehe(vx, vz);
      pos.setY(i, hh);
      var r0 = Math.hypot(vx, vz);
      tmpC.copy(cTal).lerp(cSand, smooth(0, 5, hh)).lerp(cKamm, smooth(5.5, 9, hh));
      tmpC.lerp(cFels, smooth(RADIUS, RADIUS + 30, r0));
      farben.push(tmpC.r, tmpC.g, tmpC.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(farben, 3));
    geo.computeVertexNormals();
    var boden = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, map: sandTex, roughness: 0.95 }));
    boden.receiveShadow = true; scene.add(boden);

    // Atlas-Gebirge am Horizont
    var bergM = std(0x7a4a3a, { flatShading: true, roughness: 1 });
    // Unregelmäßige Bergrücken statt spitzer Kegel
    var bergGeo = new THREE.IcosahedronGeometry(1, 1), bp = bergGeo.attributes.position;
    for (i = 0; i < bp.count; i++) { var f = 1 + Math.sin(bp.getX(i) * 7.1 + bp.getZ(i) * 3.3) * 0.12 + Math.sin(bp.getY(i) * 9.7) * 0.08; bp.setXYZ(i, bp.getX(i) * f, bp.getY(i) * f, bp.getZ(i) * f); }
    bergGeo.computeVertexNormals();
    var bergM2 = std(0x8a5a44, { flatShading: true, roughness: 1 });
    for (i = 0; i < 60; i++) {
      var a = i / 60 * Math.PI * 2 + rnd(-0.04, 0.04), rr = rnd(370, 470), hb = rnd(35, 95);
      var berg = new THREE.Mesh(bergGeo, i % 3 ? bergM : bergM2);
      berg.scale.set(rnd(55, 95), hb, rnd(40, 70));
      berg.position.set(Math.cos(a) * rr, -hb * 0.25, Math.sin(a) * rr); berg.rotation.y = -a + rnd(-0.4, 0.4);
      scene.add(berg);
    }

    // ---------- Orte ----------
    var lehm = std(0xffffff, { map: lehmTex, roughness: 0.95 }), lehmDunkel = std(0x9a5a34, { roughness: 1 });
    var palmeStamm = std(0x6a4a2a), palmeBlatt = std(0x3a6a2a, { side: THREE.DoubleSide, flatShading: true });
    var lampen = [];
    function palme(g, x, z) {
      var h = rnd(5, 8), st = schatten(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, h, 6), palmeStamm));
      st.position.set(x, hoehe(x, z) + h / 2, z); st.rotation.z = rnd(-0.15, 0.15); g.add(st);
      for (var b = 0; b < 7; b++) {
        var bl = schatten(new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.6, 3), palmeBlatt));
        bl.position.set(x, st.position.y + h / 2, z);
        bl.rotation.set(0, b / 7 * Math.PI * 2, 0); bl.rotateX(Math.PI / 2 + 0.5); bl.translateY(1.6); g.add(bl);
      }
    }
    function lampe(g, x, y, z, farbe) {
      var lk = glow(farbe || 0xffb060, 3, 0); lk.position.set(x, y, z); g.add(lk); lampen.push(lk);
    }
    function haus(g, x, z, w, h, d, zinnen) {
      var y0 = hoehe(x, z);
      var hm = schatten(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lehm)); hm.position.set(x, y0 + h / 2 - 0.2, z); g.add(hm);
      if (zinnen) for (var k = -w / 2 + 0.4; k < w / 2; k += 1.2) { var zn = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.6), lehm); zn.position.set(x + k, y0 + h + 0.15, z + d / 2 - 0.3); g.add(zn); var zn2 = zn.clone(); zn2.position.z = z - d / 2 + 0.3; g.add(zn2); }
      for (var f = 0; f < 3; f++) {
        var fe = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.9), new THREE.MeshBasicMaterial({ color: 0x2a1408 }));
        fe.position.set(x - w / 4 + f * w / 4, y0 + h * 0.62, z + d / 2 + 0.02); g.add(fe);
        lampe(g, fe.position.x, fe.position.y, fe.position.z + 0.2, 0xffa850);
      }
    }
    function brunnen(g, x, z) {
      var y0 = hoehe(x, z);
      var ring = schatten(new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 1, 14, 1, true), std(0xd8c8a8, { side: THREE.DoubleSide })));
      ring.position.set(x, y0 + 0.5, z); g.add(ring);
      var w = new THREE.Mesh(new THREE.CircleGeometry(1.3, 16), std(0x2a6a9a, { roughness: 0.15, metalness: 0.3 })); w.rotation.x = -Math.PI / 2; w.position.set(x, y0 + 0.7, z); g.add(w);
    }
    var ortGruppen = {};
    ORTE.forEach(function (o) {
      var g = new THREE.Group(); scene.add(g); ortGruppen[o.id] = g;
      var x = o.x, z = o.z;
      if (o.art === 'kasbah') {
        haus(g, x - 6, z - 4, 9, 7, 7, true); haus(g, x + 5, z - 6, 7, 10, 7, true); haus(g, x + 1, z + 7, 10, 5, 6, true);
        var turm = schatten(new THREE.Mesh(new THREE.BoxGeometry(3, 14, 3), lehm)); turm.position.set(x - 11, hoehe(x - 11, z) + 7, z + 3); g.add(turm);
        palme(g, x + 12, z + 6); palme(g, x - 13, z - 10); palme(g, x + 10, z - 13);
      } else if (o.art === 'oase') {
        var see = new THREE.Mesh(new THREE.CircleGeometry(10, 32), std(0x2a7aa8, { roughness: 0.08, metalness: 0.4 }));
        see.rotation.x = -Math.PI / 2; see.position.set(x, 1.35, z); g.add(see);
        for (var p2 = 0; p2 < 12; p2++) { var pa = p2 / 12 * Math.PI * 2; palme(g, x + Math.cos(pa) * rnd(12, 16), z + Math.sin(pa) * rnd(12, 16)); }
        haus(g, x + 15, z + 14, 6, 4, 5, false);
      } else if (o.art === 'souk') {
        var cols = [0xd84a3a, 0x1f8a8a, 0xe8b04a, 0x8a3a8a, 0x3a8a3a, 0xf2e6cc];
        for (var t2 = 0; t2 < 9; t2++) {
          var tx = x - 14 + (t2 % 3) * 9, tz = z + 4 + Math.floor(t2 / 3) * 7, ty = hoehe(tx, tz);
          var dach = schatten(new THREE.Mesh(new THREE.ConeGeometry(3.4, 1.6, 4), std(cols[t2 % cols.length], { side: THREE.DoubleSide })));
          dach.position.set(tx, ty + 3, tz); dach.rotation.y = Math.PI / 4; g.add(dach);
          [[-1.9, -1.9], [1.9, -1.9], [-1.9, 1.9], [1.9, 1.9]].forEach(function (pp) { var st = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 4), palmeStamm); st.position.set(tx + pp[0], ty + 1.2, tz + pp[1]); g.add(st); });
          lampe(g, tx, ty + 2.3, tz, 0xffb060);
        }
        // Koutoubia-Minarett
        var my = hoehe(x, z - 12);
        var min = schatten(new THREE.Mesh(new THREE.BoxGeometry(5, 26, 5), lehm)); min.position.set(x, my + 13, z - 12); g.add(min);
        var kr = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1, 5.6), std(0x1f6a6a)); kr.position.set(x, my + 22, z - 12); g.add(kr);
        var lat = schatten(new THREE.Mesh(new THREE.BoxGeometry(2.2, 4, 2.2), lehm)); lat.position.set(x, my + 28, z - 12); g.add(lat);
        var kup = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8), std(0xe8b04a, { metalness: 0.6, roughness: 0.3 })); kup.position.set(x, my + 30.6, z - 12); g.add(kup);
        lampe(g, x, my + 27, z - 9.4, 0xffd080);
        haus(g, x + 16, z - 6, 8, 6, 7, true); haus(g, x - 18, z - 4, 7, 5, 7, true);
        palme(g, x + 8, z - 18); palme(g, x - 9, z - 19);
      } else if (o.art === 'camp') {
        for (var c2 = 0; c2 < 6; c2++) {
          var ca = c2 / 6 * Math.PI * 2, cx = x + Math.cos(ca) * 9, cz = z + Math.sin(ca) * 9, cy = hoehe(cx, cz);
          var zelt = schatten(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 3, 2.8, 4), std(c2 % 2 ? 0x3a2418 : 0x5a3a24, { flatShading: true })));
          zelt.position.set(cx, cy + 1.4, cz); zelt.rotation.y = ca; g.add(zelt);
          var deko = new THREE.Mesh(new THREE.CylinderGeometry(3.02, 3.02, 0.25, 4, 1, true), std(0xffffff, { map: deckeTex, side: THREE.DoubleSide }));
          deko.position.set(cx, cy + 0.35, cz); deko.rotation.y = ca; g.add(deko);
        }
        var feuer = glow(0xff8a30, 6, 0.9); feuer.position.set(x, hoehe(x, z) + 1, z); g.add(feuer); g.userData.feuer = feuer;
        var holz = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.6, 5), palmeStamm); holz.rotation.z = Math.PI / 2; holz.position.set(x, hoehe(x, z) + 0.2, z); g.add(holz);
        palme(g, x + 14, z - 6);
      }
      if (o.wasser) brunnen(g, x + (o.art === 'oase' ? 0 : -3), z + (o.art === 'oase' ? 13 : 13));
      var schild = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTex(o.name), transparent: true, depthTest: false, fog: false }));
      schild.scale.set(16, 4, 1); schild.position.set(x, hoehe(x, z) + 20, z); schild.renderOrder = 5; g.add(schild);
      o.schild = schild;
    });

    // Zielstrahl
    var strahl = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 120, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xffb04a, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    scene.add(strahl);

    // Minztee-Gläser zum Aufsammeln
    var tees = [];
    var teeGlas = std(0x6ab84a, { transparent: true, opacity: 0.8, roughness: 0.2, emissive: 0x1a3a10 });
    function teeSetzen(t) {
      var x, z, ok;
      do { x = rnd(-RADIUS + 20, RADIUS - 20); z = rnd(-RADIUS + 20, RADIUS - 20); ok = Math.hypot(x, z) < RADIUS - 20 && ORTE.every(function (o) { return Math.hypot(x - o.x, z - o.z) > 45; }); } while (!ok);
      t.position.set(x, hoehe(x, z) + 1.4, z); t.visible = true;
    }
    for (i = 0; i < 14; i++) {
      var tg = new THREE.Group();
      var gl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.8, 10), teeGlas); tg.add(gl);
      var minze = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 5), std(0x3aa83a)); minze.position.y = 0.45; tg.add(minze);
      var tgl = glow(0x9aff8a, 3.5, 0.5); tg.add(tgl);
      scene.add(tg); teeSetzen(tg); tees.push(tg);
    }

    // ---------- Kamel + Omar ----------
    var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };
    function limb(a, b, r, mat) {
      var d = new THREE.Vector3().subVectors(b, a), len = d.length();
      var m = schatten(new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.85, len, 8), mat));
      m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); return m;
    }
    function kugel(r, mat, p) { var m = schatten(new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), mat)); if (p) m.position.copy(p); return m; }
    var fell = std(0xc8945a, { roughness: 0.95 }), fellD = std(0xa8743e, { roughness: 0.95 }), dunkel = new THREE.MeshBasicMaterial({ color: 0x1a1008 });
    var kamel = new THREE.Group(); scene.add(kamel);
    var koerper = new THREE.Group(); kamel.add(koerper);
    var rumpf = kugel(1, fell, V(0, 2.2, 0)); rumpf.scale.set(0.85, 0.75, 1.5); koerper.add(rumpf);
    var hoecker = kugel(0.75, fell, V(0, 2.85, 0.1)); hoecker.scale.set(0.9, 0.8, 1.1); koerper.add(hoecker);
    var hals = new THREE.Group(); hals.position.set(0, 2.5, -1.25); koerper.add(hals);
    hals.add(limb(V(0, 0, 0), V(0, 1.3, -0.9), 0.32, fell));
    var kopfK = new THREE.Group(); kopfK.position.set(0, 1.35, -0.95); hals.add(kopfK);
    var kk = kugel(0.36, fell, V(0, 0, -0.15)); kk.scale.set(0.8, 0.75, 1.2); kopfK.add(kk);
    var schnauze = kugel(0.26, fellD, V(0, -0.12, -0.6)); schnauze.scale.set(0.9, 0.75, 1.1); kopfK.add(schnauze);
    [-1, 1].forEach(function (s) {
      kopfK.add(kugel(0.06, dunkel, V(s * 0.22, 0.1, -0.35)));
      var ohr = kugel(0.09, fellD, V(s * 0.22, 0.3, 0.05)); ohr.scale.set(0.6, 1.3, 0.6); kopfK.add(ohr);
    });
    var schwanz = limb(V(0, 2.3, 1.45), V(0, 1.5, 1.7), 0.07, fellD); koerper.add(schwanz);
    var beine = [];
    [[-0.45, -0.9], [0.45, -0.9], [-0.45, 0.95], [0.45, 0.95]].forEach(function (b, n) {
      var piv = new THREE.Group(); piv.position.set(b[0], 1.85, b[1]); koerper.add(piv);
      piv.add(limb(V(0, 0, 0), V(0, -0.95, 0), 0.17, fell));
      var knie = new THREE.Group(); knie.position.y = -0.95; piv.add(knie);
      knie.add(kugel(0.16, fellD));
      knie.add(limb(V(0, 0, 0), V(0, -0.9, 0), 0.12, fell));
      var huf = kugel(0.17, fellD, V(0, -0.9, -0.04)); huf.scale.set(1, 0.4, 1.3); knie.add(huf);
      beine.push({ piv: piv, knie: knie, phase: [0, Math.PI, Math.PI * 0.5, Math.PI * 1.5][n] });
    });
    // Sattel + Gepäck
    var decke = schatten(new THREE.Mesh(new THREE.CylinderGeometry(0.98, 0.98, 1.6, 16, 1, true, -Math.PI * 0.55, Math.PI * 1.1), std(0xffffff, { map: deckeTex, side: THREE.DoubleSide })));
    decke.rotation.x = Math.PI / 2; decke.rotation.z = Math.PI; decke.position.set(0, 2.62, 0.1); decke.scale.set(0.82, 1, 0.75); koerper.add(decke);
    var paket = []; [-1, 1].forEach(function (s) {
      var pk = schatten(new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.7), std(0x8a5a2a))); pk.position.set(s * 1.0, 2.1, 0.7); koerper.add(pk); paket.push(pk);
    });
    var laterne = glow(0xffb060, 2.4, 0); laterne.position.set(0.95, 2.6, 0.9); koerper.add(laterne);
    // Omar
    var omar = new THREE.Group(); omar.position.set(0, 3.2, 0.15); koerper.add(omar);
    var hoodie = std(0x161618, { roughness: 0.95 }), haut = std(0xd9a47c, { roughness: 0.7 }), jeans = std(0x2a3040), haar = std(0x1e1410, { roughness: 1 });
    [-1, 1].forEach(function (s) {
      omar.add(limb(V(s * 0.17, 0, 0), V(s * 0.62, -0.3, -0.25), 0.12, jeans));
      omar.add(limb(V(s * 0.62, -0.3, -0.25), V(s * 0.66, -0.95, -0.15), 0.1, jeans));
      var sch = schatten(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.32), std(0xf2f2f2))); sch.position.set(s * 0.66, -1.0, -0.22); omar.add(sch);
    });
    var oKoerper = new THREE.Group(); omar.add(oKoerper);
    var torso = schatten(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.36), hoodie)); torso.position.y = 0.42; oKoerper.add(torso);
    var kap = schatten(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.08, 6, 12), hoodie)); kap.position.set(0, 0.8, 0.1); kap.rotation.x = Math.PI / 2; oKoerper.add(kap);
    var schrift = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.08), new THREE.MeshBasicMaterial({ color: 0xd8d8d8 })); schrift.position.set(0, 0.5, -0.185); schrift.rotation.y = Math.PI; oKoerper.add(schrift);
    var oArme = [-1, 1].map(function (s) {
      var piv = new THREE.Group(); piv.position.set(s * 0.36, 0.7, 0); oKoerper.add(piv);
      piv.add(limb(V(0, 0, 0), V(s * 0.05, -0.32, -0.25), 0.09, hoodie));
      piv.add(limb(V(s * 0.05, -0.32, -0.25), V(-s * 0.12, -0.3, -0.6), 0.075, hoodie));
      piv.add(kugel(0.07, haut, V(-s * 0.14, -0.3, -0.66)));
      return piv;
    });
    var oKopf = new THREE.Group(); oKopf.position.y = 1.05; oKoerper.add(oKopf);
    oKopf.add(limb(V(0, -0.2, 0), V(0, -0.05, 0), 0.08, haut));
    var schaedel = kugel(0.22, haut); schaedel.scale.set(0.95, 1.1, 1); oKopf.add(schaedel);
    var bart = kugel(0.2, haar, V(0, -0.09, -0.04)); bart.scale.set(1.02, 0.55, 1.0); oKopf.add(bart);
    var mund = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.025, 0.02), std(0xa8625a)); mund.position.set(0, -0.09, -0.215); oKopf.add(mund);
    [-1, 1].forEach(function (s) { oKopf.add(kugel(0.025, dunkel, V(s * 0.075, 0.04, -0.2))); oKopf.add(kugel(0.045, haut, V(s * 0.22, 0, 0.02))); });
    // Locken: viele kleine Kugeln
    for (i = 0; i < 26; i++) {
      var th2 = rnd(0, Math.PI * 2), ph2 = rnd(0.05, 1.15);
      var lk = kugel(rnd(0.07, 0.1), haar, V(Math.cos(th2) * Math.sin(ph2) * 0.22, 0.06 + Math.cos(ph2) * 0.2, Math.sin(th2) * Math.sin(ph2) * 0.22 + 0.02));
      if (lk.position.z < -0.12 && lk.position.y < 0.18) continue;
      oKopf.add(lk);
    }

    // Zügel
    var zuegel = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(0, 0, 0), V(0, 0, 0), V(0, 0, 0)]), new THREE.LineBasicMaterial({ color: 0x3a2010 }));
    scene.add(zuegel);

    // Staub
    var staub = [];
    for (i = 0; i < 60; i++) { var ss = glow(0xe8c090, 1, 0.3); ss.material.blending = THREE.NormalBlending; ss.visible = false; scene.add(ss); staub.push({ s: ss, t: 0, life: 0, v: new THREE.Vector3() }); }
    var si = 0;
    function staubWolke(x, y, z, n, groesse) {
      for (var k = 0; k < n; k++) { var q = staub[si++ % staub.length]; q.s.position.set(x + rnd(-0.6, 0.6), y, z + rnd(-0.6, 0.6)); q.v.set(rnd(-1, 1), rnd(0.4, 1.4), rnd(-1, 1)); q.t = 0; q.life = rnd(0.8, 1.6); q.g = groesse || 1.6; q.s.visible = true; }
    }
    // Sandsturm-Partikel
    var sturmGeo = new THREE.BufferGeometry(), stp = [];
    for (i = 0; i < 1400; i++) stp.push(rnd(-40, 40), rnd(0, 14), rnd(-40, 40));
    sturmGeo.setAttribute('position', new THREE.Float32BufferAttribute(stp, 3));
    var sturmMat = new THREE.PointsMaterial({ color: 0xe8b880, size: 0.45, map: glowTex, transparent: true, opacity: 0, depthWrite: false });
    var sturm = new THREE.Points(sturmGeo, sturmMat); scene.add(sturm);

    // ---------- Zustand ----------
    var g;
    function reset() {
      var startOrt = ORTE[4];
      g = {
        modus: 'intro', t: 0, tag: 0.1, x: startOrt.x - 20, z: startOrt.z - 20, kurs: Math.PI * 0.25, tempo: 0, lenk: 0, wasser: 100,
        geld: 0, lief: 0, ort: startOrt, auftrag: null, sturm: 0, sturmIn: rnd(50, 80), schritt: 0, ende: false, langsam: 0
      };
      tees.forEach(teeSetzen);
      neuerAuftrag();
    }
    function neuerAuftrag() {
      var ziele = ORTE.filter(function (o) { return o !== g.ort; });
      var ziel = pick(ziele), ware = pick(WAREN);
      var dist = Math.hypot(ziel.x - g.x, ziel.z - g.z);
      g.auftrag = { ziel: ziel, ware: ware, zeit: Math.round(dist / 8.5 + 18), rest: 0, dist: dist };
      g.auftrag.rest = g.auftrag.zeit;
      $('auftrag').textContent = ware.e + ' ' + ware.name + ' → ' + ziel.name;
    }
    var meldT = 0;
    function melde(txt, klein) {
      var el = $('meldung'); el.innerHTML = txt + (klein ? '<small>' + klein + '</small>' : '');
      el.classList.remove('zeigen'); void el.offsetWidth; el.classList.add('zeigen');
      clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1600);
    }
    function geliefert() {
      var a = g.auftrag, puenktlich = a.rest > 0;
      var lohn = Math.round(a.dist * 0.6 + (puenktlich ? 40 + a.rest * 2 : 15));
      g.geld += lohn; g.lief++; g.ort = a.ziel;
      melde(puenktlich ? 'Geliefert! +' + lohn + ' DH' : 'Zu spät … +' + lohn + ' DH', a.ware.e + ' ' + a.ware.name + ' in ' + a.ziel.name + (puenktlich ? ' · Shukran!' : ''));
      Pixel.sfx.tone(523, 0.1, 'triangle', 0.07); Pixel.sfx.tone(659, 0.1, 'triangle', 0.07, null, 0.1); Pixel.sfx.tone(784, 0.25, 'triangle', 0.07, null, 0.2);
      neuerAuftrag();
    }

    // ---------- Eingabe ----------
    var tasten = {}, padZ = {};
    function kd(e) {
      var k = e.key.toLowerCase();
      if (k === 'escape') { stop(); onExit(); return; }
      if (g.modus !== 'reiten' && (k === 'enter' || k === ' ')) { var b = ebene.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } return; }
      tasten[k] = true;
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' '].indexOf(k) >= 0) e.preventDefault();
    }
    function ku(e) { tasten[e.key.toLowerCase()] = false; }
    pad.addEventListener('pointerdown', function (e) { var b = e.target.closest('[data-pad]'); if (!b) return; e.preventDefault(); padZ[e.pointerId] = b.getAttribute('data-pad'); try { b.releasePointerCapture(e.pointerId); } catch (x) {} padRender(); });
    pad.addEventListener('pointerover', function (e) { if (padZ[e.pointerId] === undefined) return; var b = e.target.closest('[data-pad]'); if (!b) return; var w = b.getAttribute('data-pad'); if (w !== 'g' && padZ[e.pointerId] !== 'g') { padZ[e.pointerId] = w; padRender(); } });
    function padLos(e) { if (padZ[e.pointerId] !== undefined) { delete padZ[e.pointerId]; padRender(); } }
    function padRender() {
      var v = {}; Object.keys(padZ).forEach(function (k) { v[padZ[k]] = true; });
      pad.querySelectorAll('[data-pad]').forEach(function (b) { b.classList.toggle('gedrueckt', !!v[b.getAttribute('data-pad')]); });
      tasten.padl = !!v.l; tasten.padr = !!v.r; tasten.padg = !!v.g;
    }
    if (window.matchMedia && matchMedia('(pointer: coarse)').matches) pad.classList.add('an');

    // ---------- Nachbearbeitung ----------
    var composer = null;
    if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass && THREE.ShaderPass) {
      try {
        var rt = new THREE.WebGLRenderTarget(1, 1, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
        rt.texture.encoding = THREE.sRGBEncoding;
        composer = new THREE.EffectComposer(renderer, rt);
        composer.addPass(new THREE.RenderPass(scene, cam));
        composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.45, 0.5, 0.9));
        composer.addPass(new THREE.ShaderPass({
          uniforms: { tDiffuse: { value: null }, uSturm: { value: 0 } },
          vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
          fragmentShader: 'uniform sampler2D tDiffuse; uniform float uSturm; varying vec2 vUv; void main(){ vec2 d = vUv-0.5; vec3 c = texture2D(tDiffuse, vUv).rgb; c = mix(c, c*vec3(1.06,1.0,0.9), 0.5); c = mix(c, vec3(0.86,0.66,0.44), uSturm*0.35); c *= 1.0 - smoothstep(0.2,0.8,dot(d,d))*0.45; gl_FragColor = vec4(c,1.0); }'
        }));
        composer.gradePass = composer.passes[2];
      } catch (e) { composer = null; }
    }
    function resize() {
      var w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.fov = h > w ? 72 : 56; cam.updateProjectionMatrix();
      if (composer) { composer.setPixelRatio(dpr); composer.setSize(w, h); }
    }

    // ---------- Tageszeit ----------
    var PAL = {
      tag: { z: '#3a7ad8', h: '#cfe4f2', s: '#fff2d8', f: '#e8d2b0', li: 1.25, he: 0.65 },
      gold: { z: '#4a6ab0', h: '#f2b878', s: '#ffb060', f: '#e8b080', li: 1.0, he: 0.5 },
      abend: { z: '#2a2a6a', h: '#e87a5a', s: '#ff7a3a', f: '#b86a5a', li: 0.6, he: 0.35 },
      nacht: { z: '#060a24', h: '#1a2450', s: '#9ab0ff', f: '#141c3a', li: 0.28, he: 0.22 }
    };
    var cA = new THREE.Color(), cB = new THREE.Color();
    function mischPal(a, b, t, key) { cA.set(PAL[a][key]); cB.set(PAL[b][key]); return cA.lerp(cB, t).clone(); }
    function tageszeit() {
      var a = g.tag * Math.PI * 2, el = Math.sin(a);
      var von, nach, t;
      if (el > 0.45) { von = 'tag'; nach = 'tag'; t = 0; }
      else if (el > 0.12) { von = 'gold'; nach = 'tag'; t = (el - 0.12) / 0.33; }
      else if (el > -0.05) { von = 'abend'; nach = 'gold'; t = (el + 0.05) / 0.17; }
      else if (el > -0.25) { von = 'nacht'; nach = 'abend'; t = (el + 0.25) / 0.2; }
      else { von = 'nacht'; nach = 'nacht'; t = 0; }
      var sturmT = g.sturm;
      himmelU.uZenit.value.copy(mischPal(von, nach, t, 'z')).lerp(new THREE.Color('#c89a6a'), sturmT * 0.8);
      himmelU.uHorizont.value.copy(mischPal(von, nach, t, 'h')).lerp(new THREE.Color('#d8a874'), sturmT);
      himmelU.uSonnenFarbe.value.copy(mischPal(von, nach, t, 's')).multiplyScalar(el > -0.05 ? 1 : 0.15);
      var sd = new THREE.Vector3(Math.cos(a) * 0.8, Math.max(el, -0.3), -0.55).normalize();
      if (el < -0.05) sd.set(-Math.cos(a) * 0.8, Math.max(-el, 0.1), -0.55).normalize(); // Mond
      himmelU.uSonne.value.copy(sd);
      var nacht = smooth(0.0, -0.25, el);
      sternMat.opacity = nacht * (1 - sturmT); mond.material.opacity = nacht * 0.9 * (1 - sturmT);
      mond.position.copy(sd).multiplyScalar(1100);
      sonne.color.copy(mischPal(von, nach, t, 's'));
      sonne.intensity = lerp(PAL[von].li, PAL[nach].li, t) * (1 - sturmT * 0.5);
      hemi.intensity = lerp(PAL[von].he, PAL[nach].he, t);
      sonne.position.set(g.x + sd.x * 80, sd.y * 80 + 5, g.z + sd.z * 80);
      sonne.target.position.set(g.x, 0, g.z);
      var fog = mischPal(von, nach, t, 'f').lerp(new THREE.Color('#d8a874'), sturmT);
      scene.fog.color.copy(fog);
      scene.fog.near = lerp(70, 6, sturmT); scene.fog.far = lerp(380, 55, sturmT);
      lampen.forEach(function (l) { l.material.opacity = nacht * 0.95; });
      laterne.material.opacity = nacht;
      return nacht;
    }

    // ---------- Schleife ----------
    var camPos = new THREE.Vector3(), camZiel = new THREE.Vector3(), blick = new THREE.Vector3();
    function update(dt) {
      var reiten = g.modus === 'reiten';
      g.t += dt;
      g.tag = (g.tag + dt / 300) % 1;
      // Eingabe
      var links = tasten.a || tasten.arrowleft || tasten.padl, rechts = tasten.d || tasten.arrowright || tasten.padr;
      var galopp = (tasten.w || tasten.arrowup || tasten.shift || tasten.padg) && g.wasser > 0;
      var bremse = tasten.s || tasten.arrowdown;
      if (!reiten) { links = rechts = galopp = bremse = false; }
      g.lenk = lerp(g.lenk, (rechts ? 1 : 0) - (links ? 1 : 0), dt * 6);
      var soll = reiten ? (bremse ? 2 : galopp ? 15 : 8) : 0;
      // Steigung bremst
      var vorX = g.x + Math.sin(g.kurs) * 2, vorZ = g.z - Math.cos(g.kurs) * 2;
      var steig = hoehe(vorX, vorZ) - hoehe(g.x, g.z);
      soll *= clamp(1 - steig * 0.25, 0.55, 1.15);
      if (g.wasser <= 0) soll = Math.min(soll, 3);
      g.tempo = lerp(g.tempo, soll, dt * (soll > g.tempo ? 1.4 : 2.5));
      g.kurs += g.lenk * dt * lerp(1.6, 1.1, g.tempo / 15);
      // Sturm drückt seitlich
      var windX = g.sturm * Math.sin(g.t * 0.3) * 2.2, windZ = g.sturm * 1.2;
      g.x += (Math.sin(g.kurs) * g.tempo + windX) * dt;
      g.z += (-Math.cos(g.kurs) * g.tempo + windZ) * dt;
      var r = Math.hypot(g.x, g.z);
      if (r > RADIUS) { g.x *= RADIUS / r; g.z *= RADIUS / r; g.tempo *= 0.9; if (reiten && Math.random() < 0.02) melde('Zu weit draußen!', 'Hier gibt es nur Steine und Berge.'); }
      // Wasser
      if (reiten) {
        g.wasser -= dt * (0.55 + (galopp ? 1.6 : 0) + (g.tempo > 1 ? 0.35 : 0) + g.sturm * 0.6);
        g.wasser = Math.max(0, g.wasser);
        ORTE.forEach(function (o) {
          if (!o.wasser) return;
          var bx = o.x + (o.art === 'oase' ? 0 : -3), bz = o.z + 13;
          if (Math.hypot(g.x - bx, g.z - bz) < (o.art === 'oase' ? 16 : 7)) { if (g.wasser < 99.5 && Math.random() < 0.08) staubWolke(g.x, hoehe(g.x, g.z) + 2, g.z, 1, 0.8); g.wasser = Math.min(100, g.wasser + dt * 35); }
        });
        tees.forEach(function (t) {
          if (!t.visible) return;
          t.rotation.y += dt * 2; t.position.y = hoehe(t.position.x, t.position.z) + 1.4 + Math.sin(g.t * 3 + t.position.x) * 0.2;
          if (Math.hypot(g.x - t.position.x, g.z - t.position.z) < 3) {
            g.wasser = Math.min(100, g.wasser + 30); g.geld += 5; teeSetzen(t);
            melde('Minztee! +💧', 'Erfrischend.'); Pixel.sfx.tone(880, 0.08, 'triangle', 0.06); Pixel.sfx.tone(1175, 0.15, 'triangle', 0.06, null, 0.08);
          }
        });
        // Auftrag
        var a = g.auftrag;
        a.rest -= dt;
        if (Math.hypot(g.x - a.ziel.x, g.z - a.ziel.z) < 22) geliefert();
        if (g.wasser <= 0) { g.langsam += dt; if (g.langsam > 6) ende(); } else g.langsam = 0;
        // Sandsturm
        g.sturmIn -= dt;
        if (g.sturmIn <= 0) { g.sturmZiel = 1; g.sturmDauer = rnd(12, 18); g.sturmIn = rnd(70, 110); melde('Sandsturm!', 'Halt dich an den Kompass.'); Pixel.sfx.noise(1.2, 0.25, 500); }
        if (g.sturmDauer > 0) { g.sturmDauer -= dt; if (g.sturmDauer <= 0) g.sturmZiel = 0; }
      }
      g.sturm = lerp(g.sturm, g.sturmZiel || 0, dt * 0.7);
      // Kamel
      var y = hoehe(g.x, g.z);
      g.schritt += dt * g.tempo * 0.55;
      var hub = Math.abs(Math.sin(g.schritt * 2)) * Math.min(1, g.tempo / 8) * 0.18;
      kamel.position.set(g.x, y + hub, g.z);
      kamel.rotation.y = -g.kurs;
      var neigVorne = hoehe(g.x + Math.sin(g.kurs) * 1.4, g.z - Math.cos(g.kurs) * 1.4) - hoehe(g.x - Math.sin(g.kurs) * 1.4, g.z + Math.cos(g.kurs) * 1.4);
      koerper.rotation.x = Math.atan2(neigVorne, 2.8) * 0.8;
      koerper.rotation.z = -g.lenk * g.tempo * 0.012;
      var amp = Math.min(1, g.tempo / 6) * (g.tempo > 11 ? 0.75 : 0.5);
      beine.forEach(function (b) {
        var s = Math.sin(g.schritt * 2 + b.phase);
        b.piv.rotation.x = s * amp; b.knie.rotation.x = Math.max(0, -Math.cos(g.schritt * 2 + b.phase)) * amp * 1.4;
      });
      hals.rotation.x = Math.sin(g.schritt * 2) * 0.08 * Math.min(1, g.tempo / 6) - (g.tempo > 11 ? 0.15 : 0);
      kopfK.rotation.y = -g.lenk * 0.3;
      schwanz.rotation.z = Math.sin(g.t * 3) * 0.2;
      omar.position.y = 3.2 + Math.sin(g.schritt * 2 + 0.6) * 0.06 * Math.min(1, g.tempo / 6);
      oKoerper.rotation.x = g.tempo > 11 ? -0.25 : -0.05;
      oKoerper.rotation.z = g.lenk * 0.12;
      oKopf.rotation.y = -g.lenk * 0.4;
      oArme.forEach(function (arm, n) { arm.rotation.x = (g.ende ? -2.6 : 0) + Math.sin(g.t * 2 + n) * 0.03; });
      // Zügel von den Händen zum Maul
      var hand = V(0, 0, 0), maul = V(0, 0, 0);
      oArme[0].children[2].getWorldPosition(hand); schnauze.getWorldPosition(maul);
      var zp = zuegel.geometry.attributes.position;
      zp.setXYZ(0, hand.x, hand.y, hand.z); zp.setXYZ(1, (hand.x + maul.x) / 2, (hand.y + maul.y) / 2 - 0.25, (hand.z + maul.z) / 2); zp.setXYZ(2, maul.x, maul.y, maul.z); zp.needsUpdate = true;
      // Staub
      if (g.tempo > 6 && Math.random() < g.tempo / 25) staubWolke(g.x - Math.sin(g.kurs) * 1.2, y + 0.2, g.z + Math.cos(g.kurs) * 1.2, 1, g.tempo > 11 ? 2.2 : 1.4);
      staub.forEach(function (q) {
        if (!q.s.visible) return;
        q.t += dt; if (q.t > q.life) { q.s.visible = false; return; }
        q.s.position.addScaledVector(q.v, dt); var k = q.t / q.life, sc2 = q.g * (1 + k * 2);
        q.s.scale.set(sc2, sc2, 1); q.s.material.opacity = 0.32 * (1 - k);
      });
      sturm.position.set(g.x, y, g.z); sturmMat.opacity = g.sturm * 0.75;
      var sp2 = sturmGeo.attributes.position;
      for (var k = 0; k < sp2.count; k += 1) { var nx = sp2.getX(k) + dt * 30 * g.sturm; if (nx > 40) nx -= 80; sp2.setX(k, nx); }
      sp2.needsUpdate = true;
      // Ziel
      var z = g.auftrag.ziel;
      strahl.position.set(z.x, hoehe(z.x, z.z) + 60, z.z);
      strahl.material.opacity = 0.1 + Math.sin(g.t * 3) * 0.04;
      var mg = ortGruppen.merzouga.userData.feuer; if (mg) { var fs = 6 + Math.sin(g.t * 13) * 0.6 + Math.sin(g.t * 7) * 0.4; mg.scale.set(fs, fs, 1); }
      var nacht = tageszeit();
      if (composer && composer.gradePass) composer.gradePass.uniforms.uSturm.value = g.sturm;
      // Kamera
      if (reiten) {
        var hinten = 9 + g.tempo * 0.2, hoch = 4.2;
        camZiel.set(g.x - Math.sin(g.kurs) * hinten, y + hoch + 1.5, g.z + Math.cos(g.kurs) * hinten);
        camZiel.y = Math.max(camZiel.y, hoehe(camZiel.x, camZiel.z) + 2.5);
        // Sichtlinie zum Kamel frei halten (Dünenkamm dazwischen)
        for (var sl = 0.25; sl < 1; sl += 0.25) {
          var sx = lerp(camZiel.x, g.x, sl), sz = lerp(camZiel.z, g.z, sl), sy = lerp(camZiel.y, y + 3, sl), sh = hoehe(sx, sz) + 1.2;
          if (sy < sh) camZiel.y += (sh - sy) / (1 - sl);
        }
        if (camPos.distanceTo(camZiel) > 40) camPos.copy(camZiel); else camPos.lerp(camZiel, Math.min(1, dt * 3));
        cam.position.copy(camPos);
        blick.set(g.x + Math.sin(g.kurs) * 6, y + 3, g.z - Math.cos(g.kurs) * 6);
      } else {
        var an = g.t * 0.15, hochK = box.clientHeight > box.clientWidth;
        cam.position.set(g.x + Math.sin(an) * 9, y + 4.2, g.z + Math.cos(an) * 9);
        blick.set(g.x, y + (hochK ? 1.2 : 3.2), g.z);
        if (!hochK && box.clientWidth >= 900) { var rx = Math.cos(an) * 3.5, rz = -Math.sin(an) * 3.5; blick.x -= rx; blick.z -= rz; }
        camPos.copy(cam.position);
      }
      cam.lookAt(blick);
      // HUD
      if (reiten) {
        $('geld').textContent = g.geld + ' DH';
        $('lief').textContent = g.lief + (g.lief === 1 ? ' Lieferung' : ' Lieferungen');
        var rest = g.auftrag.rest, uhr = $('uhr');
        uhr.textContent = rest > 0 ? Math.floor(rest / 60) + ':' + String(Math.floor(rest % 60)).padStart(2, '0') : 'zu spät';
        uhr.classList.toggle('spaet', rest < 10);
        var dx = z.x - g.x, dz = z.z - g.z;
        var zw = Math.atan2(dx, -dz), rel = winkel(zw - g.kurs);
        $('pfeil').style.transform = 'rotate(' + (rel * 180 / Math.PI) + 'deg)';
        $('dist').textContent = Math.round(Math.hypot(dx, dz) * 10) + ' m';
        $('wasser').style.width = g.wasser + '%';
        $('wasserBox').classList.toggle('knapp', g.wasser < 25);
        if (g.t > 12) $('tipp').style.opacity = 0;
      }
      return nacht;
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
          else if (renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; scene.traverse(function (o) { if (o.material) [].concat(o.material).forEach(function (m) { m.needsUpdate = true; }); }); }
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
      var best = +Pixel.get(BEST_KEY, 0);
      ebene.innerHTML =
        '<div class="om-tafel"><div class="innen"><div class="bogen">🐪</div><h1>Omar<br>Sahara Express</h1>' +
        '<div class="unter">Omar und sein Kamel liefern quer durch die Wüste – von Merzouga bis Marrakech.</div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + ' DH</b></div>' : '') +
        '<ul><li>🧭 Folge dem Kompass zum Ziel, liefere pünktlich für mehr Dirham.</li>' +
        '<li>💧 Wasser wird knapp – Brunnen in den Orten und 🍵 Minztee füllen auf.</li>' +
        '<li>🐪 Galopp ist schnell, aber durstig. Dünen hoch geht\'s langsamer.</li>' +
        '<li>🌪️ Sandstürme, Sonnenuntergang und Sternenhimmel inklusive.</li></ul>' +
        '<button class="om-btn" data-act="los">Yallah, los!</button></div></div>';
    }
    function los() {
      if (g.modus === 'reiten') return;
      if (g.ende) { reset(); }
      g.modus = 'reiten'; g.ende = false;
      ebene.classList.add('aus'); hud.classList.add('an'); $('tipp').style.opacity = 0.9;
      camPos.copy(cam.position);
      Pixel.sfx.tone(294, 0.15, 'triangle', 0.06); Pixel.sfx.tone(370, 0.15, 'triangle', 0.06, null, 0.15); Pixel.sfx.tone(440, 0.3, 'triangle', 0.06, null, 0.3);
    }
    function ende() {
      if (g.modus !== 'reiten') return;
      g.modus = 'ende'; g.ende = true; hud.classList.remove('an');
      var best = +Pixel.get(BEST_KEY, 0), neu = g.geld > best;
      if (neu) Pixel.set(BEST_KEY, g.geld);
      Pixel.sfx.tone(392, 0.25, 'triangle', 0.06, 196); Pixel.sfx.tone(262, 0.5, 'triangle', 0.06, 130, 0.25);
      setTimeout(function () {
        if (!alive) return;
        ebene.classList.remove('aus');
        ebene.innerHTML =
          '<div class="om-tafel"><div class="innen"><div class="bogen">🏜️</div><h1>Das Kamel<br>streikt!</h1>' +
          '<div class="unter">Kein Wasser mehr. Das Kamel legt sich hin und rührt sich nicht.</div>' +
          '<div class="zeile"><span>Verdient</span><b>' + g.geld + ' DH' + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Lieferungen</span><b>' + g.lief + '</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.geld) + ' DH</b></div>' +
          '<div style="height:12px"></div>' +
          '<button class="om-btn" data-act="los">Neue Karawane</button>' +
          '<button class="om-btn zweit" data-act="exit">Menü</button></div></div>';
      }, 900);
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
      alive = false; cancelAnimationFrame(raf);
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerup', padLos); window.removeEventListener('pointercancel', padLos);
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
    window.addEventListener('resize', resize);
    window.addEventListener('pointerup', padLos); window.addEventListener('pointercancel', padLos);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__omar = { g: function () { return g; }, cam: cam, kamel: kamel };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.omar = { start: start };
})();
