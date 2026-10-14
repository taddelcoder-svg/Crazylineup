// Timo: Bootfahren – 3D-Flussfahrt zur blauen Stunde (three.js, Bloom wie in „Blaue Stunde").
// Timo liegt entspannt im Motorboot (wie auf den Fotos: zurückgelehnt, Kopf in den Nacken).
// Steuern: A/D bzw. Pfeiltasten, am Handy Finger links/rechts halten oder ziehen.
// Bojen, Baumstämme, Felsen, Quietscheenten, Ruderboote und Brückenpfeiler ausweichen.
// Rettungsringe einsammeln, knapp vorbeifahren gibt Bonus.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.timo.best';

  var CSS = [
    '.tb{position:absolute;inset:0;overflow:hidden;background:#0b0d1c;font-family:"Barlow Semi Condensed","Arial Narrow",Arial,sans-serif;color:#f3f5f7;touch-action:none}',
    '.tb canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.tb-hud{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .5s}',
    '.tb-hud.an{opacity:1}',
    '.tb-punkte{position:absolute;left:calc(66px + env(safe-area-inset-left));top:calc(12px + env(safe-area-inset-top))}',
    '.tb-punkte b{display:block;font-size:clamp(30px,6vw,46px);font-weight:800;line-height:1;text-shadow:0 2px 14px rgba(0,0,0,.6)}',
    '.tb-punkte span{font-size:15px;font-weight:600;opacity:.75}',
    '.tb-kombo{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:4px;background:#ffb35c;color:#241300;font-size:18px;font-weight:800;vertical-align:6px}',
    '.tb-kombo.leer{display:none}',
    '.tb-leben{position:absolute;right:calc(66px + env(safe-area-inset-right));top:calc(16px + env(safe-area-inset-top));display:flex;gap:6px;font-size:24px}',
    '.tb-leben i{font-style:normal;transition:opacity .3s,filter .3s}.tb-leben i.weg{opacity:.25;filter:grayscale(1)}',
    '.tb-tacho{position:absolute;right:calc(16px + env(safe-area-inset-right));bottom:calc(14px + env(safe-area-inset-bottom));text-align:right}',
    '.tb-tacho b{font-size:clamp(36px,7vw,54px);font-weight:800;line-height:.9;text-shadow:0 2px 12px rgba(0,0,0,.5)}',
    '.tb-tacho span{display:block;font-size:15px;font-weight:600;opacity:.7}',
    '.tb-knapp{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);font-size:clamp(28px,6vw,46px);font-weight:800;color:#ffb35c;',
    ' text-shadow:0 0 20px rgba(255,160,70,.6),0 3px 0 rgba(0,0,0,.4);opacity:0;white-space:nowrap}',
    '.tb-knapp.zeigen{animation:tbKnapp .9s ease-out}',
    '.tb-knapp.ring{color:#ff8a3c}.tb-knapp.aua{color:#ff4a5a;text-shadow:0 0 20px rgba(255,40,60,.6),0 3px 0 rgba(0,0,0,.4)}',
    '@keyframes tbKnapp{0%{opacity:0;transform:translate(-50%,-30%) scale(.8)}15%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-90%) scale(1)}}',
    '.tb-tipp{position:absolute;left:50%;bottom:calc(22px + env(safe-area-inset-bottom));transform:translateX(-50%);font-size:17px;font-weight:600;opacity:.75;transition:opacity 1s;white-space:nowrap}',
    '.tb-rot{position:absolute;inset:0;box-shadow:inset 0 0 140px rgba(255,40,40,0);transition:box-shadow .35s;pointer-events:none}',
    '.tb-rot.an{box-shadow:inset 0 0 140px rgba(255,40,40,.65);transition:none}',
    '.tb-knopf{position:absolute;top:calc(12px + env(safe-area-inset-top));width:42px;height:42px;border-radius:8px;border:2px solid rgba(243,245,247,.6);',
    ' background:rgba(21,83,168,.75);color:#fff;font:700 20px/1 sans-serif;cursor:pointer;pointer-events:auto;z-index:20}',
    '.tb-ebene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:10;transition:opacity .45s}',
    '.tb-ebene.aus{opacity:0;pointer-events:none}',
    '@media (min-width:900px){.tb-ebene{justify-content:flex-start;padding-left:6vw}}',
    '@media (max-width:899px) and (orientation:portrait){.tb-ebene{align-items:flex-end;padding-bottom:calc(20px + env(safe-area-inset-bottom))}.tb-schild h1{font-size:44px}.tb-schild{padding:20px 20px 18px}.tb-steuer{font-size:15px;margin:8px 0 12px}}',
    '.tb-schild{background:#1553a8;color:#f3f5f7;border-radius:14px;box-shadow:0 0 0 4px #1553a8,inset 0 0 0 3px #f3f5f7,0 30px 80px rgba(0,0,0,.6);',
    ' padding:28px 30px 26px;width:min(480px,100%);position:relative}',
    '.tb-schild .anker{position:absolute;right:24px;top:24px;font-size:40px;line-height:1}',
    '.tb-schild h1{margin:0;font-size:clamp(44px,10vw,70px);font-weight:800;line-height:.92}',
    '.tb-schild .unter{font-size:20px;font-weight:600;opacity:.9;margin:8px 0 18px}',
    '.tb-zeile{display:flex;justify-content:space-between;align-items:baseline;border-top:2px solid rgba(243,245,247,.35);padding:7px 0;font-size:21px;font-weight:600}',
    '.tb-zeile b{font-size:24px;font-weight:800}',
    '.tb-steuer{font-size:17px;font-weight:500;line-height:1.45;opacity:.9;margin:12px 0 18px}',
    '.tb-steuer kbd{font-family:inherit;font-weight:700;background:rgba(255,255,255,.15);border-radius:4px;padding:0 6px}',
    '.tb-btn{width:100%;border:0;border-radius:8px;background:#f3f5f7;color:#1553a8;font-family:inherit;font-weight:800;font-size:26px;padding:12px 16px;cursor:pointer}',
    '.tb-btn:active{transform:scale(.98)}',
    '.tb-btn.zweit{margin-top:10px;background:transparent;color:#f3f5f7;border:2px solid rgba(243,245,247,.6);font-size:20px;padding:8px}',
    '.tb-fehler{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-size:20px;z-index:30;background:#0b0d1c}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="tb"><canvas></canvas>' +
      '<div class="tb-hud">' +
        '<div class="tb-punkte"><b data-el="punkte">0</b><span data-el="strecke">0 m</span><span class="tb-kombo leer" data-el="kombo">x2</span></div>' +
        '<div class="tb-leben" data-el="leben"><i>🛟</i><i>🛟</i><i>🛟</i></div>' +
        '<div class="tb-tacho"><b data-el="kn">0</b><span>Knoten</span></div>' +
        '<div class="tb-knapp" data-el="knapp"></div>' +
        '<div class="tb-tipp" data-el="tipp">Finger links/rechts halten oder ziehen · A/D</div>' +
        '<div class="tb-rot" data-el="rot"></div>' +
      '</div>' +
      '<button class="tb-knopf" style="left:calc(12px + env(safe-area-inset-left))" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
      '<button class="tb-knopf" style="right:calc(12px + env(safe-area-inset-right))" data-act="ton" aria-label="Ton an/aus"></button>' +
      '<div class="tb-ebene" data-el="ebene"></div></div>';
    root.appendChild(style);
    var box = root.querySelector('.tb');
    var canvas = root.querySelector('canvas');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var hud = root.querySelector('.tb-hud'), ebene = $('ebene'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      box.insertAdjacentHTML('beforeend', '<div class="tb-fehler">Dein Browser konnte die 3D-Grafik nicht starten. Schließ andere Tabs mit 3D-Inhalten und lade neu.</div>');
      return function () {};
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    renderer.setPixelRatio(dpr);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    var NEBEL = 0x34407a;
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(NEBEL, 40, 175);
    var cam = new THREE.PerspectiveCamera(60, 1, 0.1, 1200);

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
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,.75)');
      gr.addColorStop(0.45, 'rgba(255,255,255,.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, w, w);
    }, false);
    var streakTex = canvasTex(64, 256, function (x, w, h) {
      var gr = x.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.35, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, w, h);
      var g2 = x.createLinearGradient(0, 0, w, 0);
      g2.addColorStop(0, 'rgba(0,0,0,1)'); g2.addColorStop(0.5, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)');
      x.globalCompositeOperation = 'destination-out'; x.fillStyle = g2; x.fillRect(0, 0, w, h);
    }, false);
    var steinTex = canvasTex(256, 128, function (x, w, h) {
      x.fillStyle = '#4a4a58'; x.fillRect(0, 0, w, h);
      for (var r = 0; r < 8; r++) for (var c = 0; c < 6; c++) {
        var o = (r % 2) * 21;
        x.fillStyle = ['#56566a', '#4e4e60', '#5c5a6c', '#4a4858'][(r * 3 + c) % 4];
        x.fillRect(c * 43 + o - 20, r * 16 + 1, 41, 14);
      }
    });
    steinTex.wrapS = steinTex.wrapT = THREE.RepeatWrapping;
    function wiederholt(t, rx, ry) { var c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; }
    function fensterTex(seed) {
      return canvasTex(128, 256, function (x, w, h) {
        x.fillStyle = '#1c1d2e'; x.fillRect(0, 0, w, h);
        var s = seed;
        function r() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
        for (var yy = 10; yy < h - 8; yy += 22) for (var xx = 8; xx < w - 8; xx += 20) {
          var an = r() < 0.42;
          x.fillStyle = an ? ['#ffcf7a', '#ffd99a', '#ffb860', '#cfe3ff'][Math.floor(r() * 4)] : '#2a2c44';
          x.fillRect(xx, yy, 11, 14);
        }
      });
    }
    var fenster = [fensterTex(11), fensterTex(57), fensterTex(203)];

    // ---------- Himmel ----------
    var himmel = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {},
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'varying vec3 vD;',
        'void main(){',
        ' float y = vD.y;',
        ' vec3 oben = vec3(0.03,0.05,0.16), mitte = vec3(0.12,0.17,0.42), hor = vec3(0.21,0.25,0.48);',
        ' vec3 c = mix(hor, mitte, smoothstep(0.0, 0.18, y)); c = mix(c, oben, smoothstep(0.18, 0.7, y));',
        ' float vorn = smoothstep(0.2, 1.0, -vD.z);',
        ' vec3 glut = vec3(0.98,0.52,0.36);',
        ' c = mix(c, glut, vorn*(1.0 - smoothstep(-0.02, 0.16, y))*0.85);',
        ' c += vec3(0.95,0.45,0.55)*vorn*exp(-abs(y-0.03)*18.0)*0.35;',
        ' gl_FragColor = vec4(c, 1.0);',
        '}'
      ].join('\n')
    }));
    scene.add(himmel);
    var sternGeo = new THREE.BufferGeometry(), sp = [];
    for (var i = 0; i < 400; i++) {
      var th = Math.random() * Math.PI * 2, ph = rnd(0.12, 1.2);
      sp.push(Math.cos(th) * Math.cos(ph) * 800, Math.sin(ph) * 800, Math.sin(th) * Math.cos(ph) * 800);
    }
    sternGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    var sterne = new THREE.Points(sternGeo, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.8 }));
    scene.add(sterne);
    var mond = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xfff1d0, fog: false, depthWrite: false, blending: THREE.AdditiveBlending }));
    mond.scale.set(60, 60, 1); mond.position.set(-260, 210, -620); scene.add(mond);
    var mondKern = new THREE.Mesh(new THREE.CircleGeometry(9, 32), new THREE.MeshBasicMaterial({ color: 0xfff6e0, fog: false }));
    mondKern.position.copy(mond.position); mondKern.lookAt(0, 0, 0); scene.add(mondKern);

    // ---------- Licht ----------
    scene.add(new THREE.HemisphereLight(0x7088d0, 0x141228, 0.6));
    var sonne = new THREE.DirectionalLight(0xffa77a, 0.75); sonne.position.set(-10, 8, -30); scene.add(sonne);
    var fuell = new THREE.DirectionalLight(0x8fa8ff, 0.18); fuell.position.set(6, 10, 20); scene.add(fuell);

    // ---------- Wasser ----------
    var col = function (h) { return new THREE.Color(h).convertSRGBToLinear(); };
    var wasserU = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      uTime: { value: 0 }, uScroll: { value: 0 }, uCam: { value: new THREE.Vector3() },
      uTief: { value: col('#0a1230') }, uHimmel: { value: col('#3a4a90') }, uGlut: { value: col('#f08a5a') }
    }]);
    var wasser = new THREE.Mesh(new THREE.PlaneGeometry(80, 420, 1, 1), new THREE.ShaderMaterial({
      uniforms: wasserU, fog: true,
      vertexShader: [
        'varying vec3 vW;',
        '#include <fog_pars_vertex>',
        'void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;',
        '#include <fog_vertex>',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime, uScroll; uniform vec3 uCam, uTief, uHimmel, uGlut; varying vec3 vW;',
        '#include <fog_pars_fragment>',
        'void main(){',
        ' vec2 p = vec2(vW.x, vW.z - uScroll); float t = uTime;',
        ' vec2 g = vec2(cos(p.x*0.9 + t*1.3), cos(p.y*0.7 - t*1.1))*0.07;',
        ' g += vec2(cos(p.x*2.3 - p.y*1.7 + t*2.1), cos(p.y*2.9 + p.x*0.6 + t*1.7))*0.045;',
        ' g += vec2(cos(p.x*5.1 + p.y*3.3 + t*3.0), cos(p.y*6.3 - p.x*2.1 + t*2.6))*0.025;',
        ' g += vec2(cos(p.x*11.0 - p.y*7.0 + t*4.0), cos(p.y*13.0 + p.x*5.0 - t*3.5))*0.012;',
        ' vec3 n = normalize(vec3(-g.x, 1.0, -g.y));',
        ' vec3 v = normalize(uCam - vW);',
        ' float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0);',
        ' vec3 r = reflect(-v, n);',
        ' vec3 sky = mix(uHimmel, uGlut, smoothstep(0.8, 1.0, -r.z)*smoothstep(0.3, 0.02, r.y)*0.75);',
        ' vec3 c = mix(uTief, sky, 0.05 + 0.6*fres);',
        ' vec3 L = normalize(vec3(-0.25, 0.12, -1.0)); float spec = pow(max(dot(r, L), 0.0), 220.0);',
        ' c += uGlut*spec*1.3;',
        ' gl_FragColor = vec4(c, 1.0);',
        ' #include <encodings_fragment>',
        ' #include <fog_fragment>',
        '}'
      ].join('\n')
    }));
    wasser.rotation.x = -Math.PI / 2; wasser.position.set(0, 0, -150);
    scene.add(wasser);

    // ---------- Materialien ----------
    function std(c, o) { var m = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8, metalness: 0.0 }, o || {})); return m; }
    var M = {
      stein: std(0x8a8aa0, { map: wiederholt(steinTex, 14, 1.3), roughness: 0.95 }),
      kante: std(0x5e5c70, { roughness: 0.9 }),
      weg: std(0x23222f, { roughness: 1 }),
      mast: std(0x1d1d26, { roughness: 0.5, metalness: 0.6 }),
      lampe: new THREE.MeshBasicMaterial({ color: 0xffc27a }),
      stamm: std(0x3a2a20),
      laub: std(0x1f3b33, { flatShading: true, roughness: 1 }),
      laub2: std(0x2a4a3a, { flatShading: true, roughness: 1 }),
      dach: std(0x24222e, { roughness: 1 }),
      bruecke: std(0x6a6680, { map: wiederholt(steinTex, 3, 2), roughness: 0.9 })
    };
    var hausM = fenster.map(function (t) { return std(0xffffff, { map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.9, roughness: 1 }); });

    function glow(color, size, opacity) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: color, transparent: true, opacity: opacity || 1, depthWrite: false, blending: THREE.AdditiveBlending }));
      s.scale.set(size, size, 1);
      return s;
    }
    var streakGeo = new THREE.PlaneGeometry(1, 1);
    function streak(color, w, l, opacity) {
      var m = new THREE.Mesh(streakGeo, new THREE.MeshBasicMaterial({ map: streakTex, color: color, transparent: true, opacity: opacity || 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
      m.rotation.x = -Math.PI / 2; m.scale.set(w, l, 1); m.position.y = 0.02;
      return m;
    }

    // ---------- Ufer-Kacheln (wiederholen sich) ----------
    var FLUSS = 7.2, L = 64, NT = 4, kacheln = [];
    var laubGeo = new THREE.IcosahedronGeometry(1, 0);
    function kachel(n) {
      var k = new THREE.Group();
      [-1, 1].forEach(function (s) {
        var mauer = new THREE.Mesh(new THREE.BoxGeometry(1, 2.6, L), M.stein);
        mauer.position.set(s * (FLUSS + 0.5), 0.3, -L / 2); k.add(mauer);
        var kante = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.25, L), M.kante);
        kante.position.set(s * (FLUSS + 0.5), 1.68, -L / 2); k.add(kante);
        var weg = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, L), M.weg);
        weg.position.set(s * (FLUSS + 4), 1.4, -L / 2); k.add(weg);
        // Laternen
        for (var z = 0; z < L; z += 16) {
          var lz = -z - (s > 0 ? 8 : 0);
          var mast = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 3.4, 6), M.mast);
          mast.position.set(s * (FLUSS + 1.1), 3.3, lz); k.add(mast);
          var arm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.07, 0.07), M.mast);
          arm.position.set(s * (FLUSS + 0.8), 4.95, lz); k.add(arm);
          var kopf = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.28), M.lampe);
          kopf.position.set(s * (FLUSS + 0.45), 4.85, lz); k.add(kopf);
          var gl = glow(0xff9a40, 3.2, 0.75); gl.position.copy(kopf.position); k.add(gl);
          var st = streak(0xff9a40, 1.0, 10, 0.75); st.position.set(s * (FLUSS - 0.6), 0.03, lz + 4.5); k.add(st);
        }
        // Bäume
        for (z = 4; z < L; z += rnd(9, 15)) {
          var tx = s * (FLUSS + rnd(3, 5.5));
          var stamm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 2.2, 5), M.stamm);
          stamm.position.set(tx, 2.7, -z); k.add(stamm);
          var kr = rnd(1.3, 2);
          var laub = new THREE.Mesh(laubGeo, Math.random() < 0.5 ? M.laub : M.laub2);
          laub.scale.set(kr, kr * 1.2, kr); laub.position.set(tx, 3.8 + kr * 0.7, -z); laub.rotation.y = rnd(0, 3);
          k.add(laub);
        }
        // Häuser
        for (z = 0; z < L;) {
          var bw = pick([7, 9, 11]), bh = pick([10, 13, 16, 20]), bd = rnd(7, 10);
          var hm = hausM[(n * 7 + Math.round(z)) % 3].clone();
          hm.map = hm.map.clone(); hm.map.needsUpdate = true; hm.map.wrapS = hm.map.wrapT = THREE.RepeatWrapping;
          hm.map.repeat.set(bd / 6, bh / 12); hm.emissiveMap = hm.map;
          var haus = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), [M.dach, hm, M.dach, M.dach, hm, hm]);
          var hx = s * (FLUSS + 8 + bw / 2 + rnd(0, 2));
          haus.position.set(hx, 1.6 + bh / 2, -z - bd / 2); k.add(haus);
          // Fassade zum Fluss: Material-Index 0/1 = +x/-x
          haus.material = s > 0 ? [M.dach, hm, M.dach, M.dach, hm, hm] : [hm, M.dach, M.dach, M.dach, hm, hm];
          var dach = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.4, 0.5, bd + 0.4), M.dach);
          dach.position.set(hx, 1.6 + bh + 0.25, -z - bd / 2); k.add(dach);
          z += bd + rnd(0.5, 2);
        }
      });
      return k;
    }
    for (i = 0; i < NT; i++) { var kk = kachel(i); kk.position.z = -i * L + L * 0.5; scene.add(kk); kacheln.push(kk); }

    // ---------- Boot + Timo ----------
    var boot = new THREE.Group(); scene.add(boot);
    function hullShape(sc) {
      var s = new THREE.Shape();
      s.moveTo(-0.95 * sc, -1.6 * sc); s.lineTo(0.95 * sc, -1.6 * sc); s.lineTo(0.98 * sc, 0.5 * sc);
      s.quadraticCurveTo(0.85 * sc, 1.5 * sc, 0, 2.15 * sc); s.quadraticCurveTo(-0.85 * sc, 1.5 * sc, -0.98 * sc, 0.5 * sc);
      s.lineTo(-0.95 * sc, -1.6 * sc);
      return s;
    }
    function extr(shape, h, y, mat) {
      var gm = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 10 });
      gm.rotateX(-Math.PI / 2);
      var m = new THREE.Mesh(gm, mat); m.position.y = y; return m;
    }
    var weiss = std(0xd6dbe6, { roughness: 0.45 }), blau = std(0x1553a8, { roughness: 0.4 }), holz = std(0x8a5a34, { roughness: 0.7 });
    boot.add(extr(hullShape(0.93), 0.28, -0.12, blau));
    boot.add(extr(hullShape(1), 0.3, 0.16, weiss));
    var rand = hullShape(1); rand.holes.push(hullShape(0.86));
    boot.add(extr(rand, 0.32, 0.46, weiss));
    var streif = extr(hullShape(1.005), 0.05, 0.6, std(0xff8a3c, { roughness: 0.5 })); boot.add(streif);
    boot.add(extr(hullShape(0.87), 0.02, 0.46, holz));
    var motor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.45), std(0x22252e, { roughness: 0.4, metalness: 0.4 }));
    motor.position.set(0, 0.85, 1.78); boot.add(motor);
    var deckel = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.47), std(0xff8a3c, { roughness: 0.5 })); deckel.position.set(0, 1.15, 1.78); boot.add(deckel);
    var schaft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.15), std(0x22252e)); schaft.position.set(0, 0.3, 1.85); boot.add(schaft);
    // Positionslichter
    var navR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3040 }));
    navR.position.set(-0.62, 0.82, -1.0); boot.add(navR);
    var navG = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0x30ff70 }));
    navG.position.set(0.62, 0.82, -1.0); boot.add(navG);
    var gR = glow(0xff3040, 0.6, 0.8); gR.position.copy(navR.position); boot.add(gR);
    var gG = glow(0x30ff70, 0.6, 0.8); gG.position.copy(navG.position); boot.add(gG);
        var bootStreifen = [streak(0xff3040, 0.35, 4, 0.5), streak(0x30ff70, 0.35, 4, 0.5)];
    scene.add(bootStreifen[0]); scene.add(bootStreifen[1]);

    // Timo aus einfachen Formen: zurückgelehnt, Kopf in den Nacken
    var haut = std(0xe8ae8c, { roughness: 0.7 }), shirt = std(0x7fb0ec, { roughness: 0.85 }), jeans = std(0x8a96a6, { roughness: 0.9 });
    var haar = std(0xc0742f, { roughness: 0.9, flatShading: true }), schuh = std(0xe8e8e8, { roughness: 0.6 }), dunkel = new THREE.MeshBasicMaterial({ color: 0x1c2232 });
    function limb(a, b, r, mat) {
      var d = new THREE.Vector3().subVectors(b, a), len = d.length();
      var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.92, len, 10), mat);
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
      return m;
    }
    function kugel(r, mat, p) { var m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat); if (p) m.position.copy(p); return m; }
    var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };
    var timo = new THREE.Group(); timo.position.set(0, 0.6, -0.35); timo.rotation.y = Math.PI; timo.scale.setScalar(1.12); boot.add(timo);
    // Beine (Knie hoch, Füße vorne im Boot)
    [-1, 1].forEach(function (s) {
      var h = V(s * 0.15, 0, 0), k = V(s * 0.2, 0.26, -0.52), f = V(s * 0.22, -0.04, -1.02);
      timo.add(limb(h, k, 0.12, jeans)); timo.add(limb(k, f, 0.105, jeans)); timo.add(kugel(0.12, jeans, k));
      var sch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.34), schuh); sch.position.set(f.x, f.y + 0.02, f.z - 0.1); timo.add(sch);
      var sohle = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.05, 0.35), std(0xd8d8d8)); sohle.position.set(f.x, f.y - 0.07, f.z - 0.1); timo.add(sohle);
    });
    timo.add(kugel(0.2, jeans, V(0, 0.02, 0.02)));
    var oben = new THREE.Group(); timo.add(oben); // Oberkörper (dreht sich zum Zurücklehnen)
    var rumpf = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.3), shirt); rumpf.position.y = 0.3; oben.add(rumpf);
    var schulter = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 10), shirt); schulter.rotation.z = Math.PI / 2; schulter.position.y = 0.55; oben.add(schulter);
    var logo = new THREE.Mesh(new THREE.CircleGeometry(0.035, 10), new THREE.MeshBasicMaterial({ color: 0xffffff })); logo.position.set(0.15, 0.48, -0.152); logo.rotation.y = Math.PI; oben.add(logo);
    var arme = [-1, 1].map(function (s) {
      var piv = new THREE.Group(); piv.position.set(s * 0.33, 0.52, 0); oben.add(piv);
      piv.add(kugel(0.1, shirt));
      piv.add(limb(V(0, 0, 0), V(0, -0.2, 0), 0.1, shirt));
      piv.add(limb(V(0, -0.18, 0), V(0, -0.34, 0), 0.075, haut));
      var unten = new THREE.Group(); unten.position.y = -0.34; piv.add(unten);
      unten.add(kugel(0.075, haut));
      unten.add(limb(V(0, 0, 0), V(0, -0.3, 0), 0.068, haut));
      unten.add(kugel(0.08, haut, V(0, -0.33, 0)));
      return { piv: piv, unten: unten, s: s };
    });
    var kopf = new THREE.Group(); kopf.position.y = 0.72; oben.add(kopf);
    kopf.add(limb(V(0, -0.12, 0), V(0, 0.06, 0), 0.08, haut));
    var schaedel = kugel(0.22, haut, V(0, 0.2, 0)); schaedel.scale.set(1, 1.08, 1.02); kopf.add(schaedel);
    [-1, 1].forEach(function (s) { var o = kugel(0.05, haut, V(s * 0.22, 0.19, 0.02)); o.scale.set(0.6, 1, 0.9); kopf.add(o); });
    var haarKappe = new THREE.Mesh(new THREE.SphereGeometry(0.235, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.52), haar);
    haarKappe.position.set(0, 0.23, 0.02); haarKappe.rotation.x = 0.25; kopf.add(haarKappe);
    for (var q = 0; q < 6; q++) {
      var tuft = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.16, 5), haar);
      tuft.position.set(rnd(-0.12, 0.12), 0.43, rnd(-0.15, 0.02)); tuft.rotation.set(rnd(-0.6, -0.2), rnd(0, 3), rnd(-0.3, 0.3)); kopf.add(tuft);
    }
    var augen = [-1, 1].map(function (s) { var a = kugel(0.028, dunkel, V(s * 0.075, 0.22, -0.2)); kopf.add(a); return a; });
    [-1, 1].forEach(function (s) { var w = kugel(0.04, std(0xf2a090, { roughness: 1 }), V(s * 0.12, 0.14, -0.17)); w.scale.set(1, 0.6, 0.4); kopf.add(w); });
    kopf.add(kugel(0.03, haut, V(0, 0.17, -0.225)));
    var mund = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.014, 6, 14, Math.PI), new THREE.MeshBasicMaterial({ color: 0x8a3030 }));
    mund.position.set(0, 0.09, -0.205); mund.rotation.z = Math.PI; kopf.add(mund);
    var pose = { lehne: 1.0, kopf: 0.5, arme: 0, sitz: 0 }, ziel = { lehne: 1.0, kopf: 0.5, arme: 0 };

    // ---------- Gischt ----------
    var gischt = [];
    for (i = 0; i < 90; i++) {
      var gs = glow(0xdde8ff, 1, 0.3); gs.material.blending = THREE.NormalBlending; gs.visible = false; scene.add(gs);
      gischt.push({ s: gs, t: 0, life: 0, vx: 0, vy: 0, vz: 0 });
    }
    var gi = 0;
    function spritz(x, y, z, vx, vy, vz, life, size, op) {
      var p = gischt[gi++ % gischt.length];
      p.s.position.set(x, y, z); p.vx = vx; p.vy = vy; p.vz = vz; p.t = 0; p.life = life; p.size = size; p.op = op || 0.35;
      p.s.visible = true;
    }

    // ---------- Hindernisse ----------
    var hind = [], pool = {};
    function bau(typ) {
      var gp = new THREE.Group(), d = { typ: typ, hx: 0.5, hz: 0.5, glows: [] };
      if (typ === 'boje') {
        var rot = std(0xd8283a, { roughness: 0.5 });
        var k1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.9, 12), rot); k1.position.y = 0.3; gp.add(k1);
        var band = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.2, 12), weiss); band.position.y = 0.45; gp.add(band);
        var sp2 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 12), rot); sp2.position.y = 1.05; gp.add(sp2);
        var bl = glow(0xff3a3a, 1.6); bl.position.y = 1.45; gp.add(bl); d.blink = bl;
        var bs = streak(0xff3a3a, 0.4, 3, 0.4); bs.position.z = 1.5; gp.add(bs); d.blinkS = bs;
        d.hx = 0.45; d.hz = 0.45;
      } else if (typ === 'stamm') {
        var len = rnd(2.6, 4);
        var st = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, len, 8), M.stamm); st.rotation.z = Math.PI / 2; st.position.y = 0.08; gp.add(st);
        var ast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.8, 5), M.stamm); ast.position.set(len * 0.2, 0.4, 0); ast.rotation.z = 0.5; gp.add(ast);
        d.hx = len / 2; d.hz = 0.35; gp.rotation.y = rnd(-0.25, 0.25);
      } else if (typ === 'fels') {
        var fe = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), std(0x5a5866, { flatShading: true, roughness: 1 }));
        fe.scale.set(1.1, 0.8, 1); fe.rotation.set(rnd(0, 3), rnd(0, 3), 0); fe.position.y = 0.1; gp.add(fe);
        d.hx = 0.95; d.hz = 0.85;
      } else if (typ === 'ente') {
        var gelb = std(0xffd23f, { roughness: 0.4 });
        var kp = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12), gelb); kp.scale.set(1, 0.75, 1.3); kp.position.y = 0.35; gp.add(kp);
        var ko = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), gelb); ko.position.set(0, 1.25, -0.7); gp.add(ko);
        var sn = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 10), std(0xff8a1c)); sn.rotation.x = -Math.PI / 2; sn.position.set(0, 1.18, -1.25); sn.scale.set(1.3, 1, 0.5); gp.add(sn);
        [-1, 1].forEach(function (s) { gp.add(kugel(0.07, dunkel, V(s * 0.22, 1.38, -1.08))); });
        var sw = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 8), gelb); sw.rotation.x = -1.1; sw.position.set(0, 0.85, 1.0); gp.add(sw);
        gp.rotation.y = Math.PI + rnd(-0.6, 0.6);
        d.hx = 0.85; d.hz = 1.0;
      } else if (typ === 'ruderboot') {
        var rb = new THREE.Group();
        rb.add(extr(hullShape(0.62), 0.45, -0.1, std(0x6a4a2e, { roughness: 0.8 })));
        var lat = glow(0xffc070, 1.6); lat.position.set(0, 1.1, 0.4); rb.add(lat);
        var latK = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.2, 0.14), M.lampe); latK.position.set(0, 0.95, 0.4); rb.add(latK);
        var latM = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4), M.mast); latM.position.set(0, 0.6, 0.4); rb.add(latM);
        gp.add(rb); gp.rotation.y = Math.PI;
        var rs = streak(0xffb060, 0.6, 5, 0.45); rs.position.z = -2.5; gp.add(rs);
        d.hx = 0.65; d.hz = 1.4; d.drift = true;
      } else if (typ === 'ring') {
        var ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.16, 10, 24), std(0xff7a2c, { roughness: 0.5, emissive: 0x401800 }));
        ring.position.y = 0.55; ring.rotation.y = 0.3; gp.add(ring); d.dreh = ring;
        for (var w = 0; w < 4; w++) {
          var wb = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.165, 10, 4, 0.35), weiss); wb.rotation.z = w * Math.PI / 2; ring.add(wb);
        }
        var rg = glow(0xff9a4c, 3.2, 0.7); rg.position.y = 0.55; gp.add(rg);
        d.hx = 0.6; d.hz = 0.6; d.bonus = true;
      } else if (typ === 'bruecke') {
        var deck = new THREE.Mesh(new THREE.BoxGeometry(40, 1.1, 3.4), M.bruecke); deck.position.y = 5.6; gp.add(deck);
        var gel = new THREE.Mesh(new THREE.BoxGeometry(40, 0.7, 0.2), M.mast); gel.position.set(0, 6.5, 1.6); gp.add(gel);
        var gel2 = gel.clone(); gel2.position.z = -1.6; gp.add(gel2);
        d.pfeiler = [];
        var xs = Math.random() < 0.5 ? [-3.3, 3.3] : [0];
        xs.forEach(function (px) {
          var pf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 7, 3.6), M.bruecke); pf.position.set(px, 1.6, 0); gp.add(pf);
          var spitze = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 7, 4, 1), M.bruecke); spitze.rotation.y = Math.PI / 4; spitze.scale.set(1, 1, 1.4); spitze.position.set(px, 1.6, 1.9); gp.add(spitze);
          d.pfeiler.push(px);
        });
        [-5.5, -1.5, 1.5, 5.5].forEach(function (lx) {
          var lk = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), M.lampe); lk.position.set(lx, 7.3, 1.6); gp.add(lk);
          var lg = glow(0xffc27a, 2.6, 0.95); lg.position.copy(lk.position); gp.add(lg);
          var ls = streak(0xffa850, 0.8, 10, 0.5); ls.position.set(lx, 0.03, 6.5); gp.add(ls);
        });
        var unter = new THREE.Mesh(new THREE.BoxGeometry(40, 0.1, 3.3), new THREE.MeshBasicMaterial({ color: 0x07070c })); unter.position.y = 5.04; gp.add(unter);
        d.hx = 0.75; d.hz = 1.9;
      }
      gp.userData = d;
      return gp;
    }
    function holen(typ) {
      var p = pool[typ] && pool[typ].pop();
      var gp = p || bau(typ);
      gp.visible = true; gp.userData.passiert = false; gp.userData.weg = 0; gp.userData.getroffen = false;
      scene.add(gp);
      return gp;
    }
    function ablegen(gp) {
      scene.remove(gp);
      (pool[gp.userData.typ] = pool[gp.userData.typ] || []).push(gp);
    }

    // ---------- Spielzustand ----------
    var g;
    function reset() {
      hind.forEach(ablegen); hind = [];
      g = {
        modus: 'intro', t: 0, dist: 0, bonus: 0, tempo: 7, leben: 3, unverw: 0, kombo: 0, besteKombo: 0,
        x: 0, vx: 0, naechste: 12, naechsteBruecke: 150, wackel: 0, ringe: 0, knapp: 0, camT: 0
      };
      renderLeben();
    }
    function punkte() { return Math.floor(g.dist + g.bonus); }
    function renderLeben() {
      root.querySelectorAll('.tb-leben i').forEach(function (el, n) { el.classList.toggle('weg', n >= g.leben); });
    }
    var knappTimer = 0;
    function zeige(txt, cls) {
      var el = $('knapp'); el.textContent = txt; el.className = 'tb-knapp ' + (cls || '');
      void el.offsetWidth; el.classList.add('zeigen');
      clearTimeout(knappTimer); knappTimer = setTimeout(function () { el.classList.remove('zeigen'); }, 900);
    }

    function spawnReihe(z) {
      var typen = ['boje', 'stamm', 'fels', 'ente', 'ruderboot', 'boje', 'fels'];
      var lv = clamp(g.t / 120, 0, 1);
      var anzahl = Math.random() < 0.35 + lv * 0.4 ? 2 : 1;
      var frei = rnd(-4.8, 4.8); // freie Gasse bleibt immer
      for (var n = 0; n < anzahl; n++) {
        var typ = pick(typen), x, tries = 0;
        do { x = rnd(-5.8, 5.8); tries++; } while (Math.abs(x - frei) < 2.6 && tries < 10);
        if (Math.abs(x - frei) < 2.6) continue;
        var o = holen(typ);
        o.position.set(x, 0, z + rnd(-3, 3));
        if (o.userData.drift) o.userData.vx = rnd(-0.8, 0.8);
        hind.push(o);
      }
      if (Math.random() < 0.3) { var r = holen('ring'); r.position.set(frei, 0, z + rnd(-4, 4)); hind.push(r); }
    }

    function treffer(o) {
      var d = o.userData;
      if (d.bonus) {
        d.getroffen = true; o.visible = false;
        g.ringe++; g.bonus += 100;
        zeige('RETTUNGSRING +100', 'ring');
        Pixel.sfx.tone(660, 0.08, 'triangle', 0.08); Pixel.sfx.tone(990, 0.16, 'triangle', 0.08, null, 0.08);
        for (var n = 0; n < 12; n++) spritz(o.position.x, 0.6, o.position.z, rnd(-2, 2), rnd(1, 3), rnd(-2, 2), 0.6, 0.6, 0.5);
        return;
      }
      if (g.unverw > 0) return;
      d.getroffen = true;
      g.leben--; renderLeben();
      g.unverw = 1.6; g.tempo *= 0.55; g.kombo = 0; g.wackel = 0.6;
      ziel.lehne = 0.15; ziel.kopf = -0.2; ziel.arme = 1; pose.schreck = 1.2;
      zeige(pick(['AUTSCH!', 'PLATSCH!', 'HEY!', 'MEIN BOOT!']), 'aua');
      var rot = $('rot'); rot.classList.add('an'); setTimeout(function () { rot.classList.remove('an'); }, 60);
      Pixel.sfx.noise(0.35, 0.5, 600); Pixel.sfx.tone(140, 0.3, 'sawtooth', 0.07, 60);
      for (var m = 0; m < 26; m++) spritz(g.x + rnd(-1, 1), 0.5, -1.6, rnd(-4, 4), rnd(2, 5), rnd(-3, 2), 0.9, 1.2, 0.5);
      if (g.leben <= 0) ende();
    }

    // ---------- Steuerung ----------
    var tasten = { l: false, r: false }, zeiger = null;
    function onKey(e, an) {
      var k = e.key;
      if (k === 'ArrowLeft' || k === 'a' || k === 'A') { tasten.l = an; e.preventDefault(); }
      if (k === 'ArrowRight' || k === 'd' || k === 'D') { tasten.r = an; e.preventDefault(); }
      if (an && k === 'Escape') { stop(); onExit(); }
      if (an && (k === 'Enter' || k === ' ') && g.modus !== 'fahrt') { e.preventDefault(); los(); }
    }
    var kd = function (e) { onKey(e, true); }, ku = function (e) { onKey(e, false); };
    function pd(e) { if (e.target !== canvas) return; zeiger = { id: e.pointerId, x0: e.clientX, x: e.clientX, gx0: g.x }; }
    function pm(e) { if (zeiger && e.pointerId === zeiger.id) zeiger.x = e.clientX; }
    function pu(e) { if (zeiger && e.pointerId === zeiger.id) zeiger = null; }

    function lenkung() {
      var s = (tasten.r ? 1 : 0) - (tasten.l ? 1 : 0);
      if (zeiger) {
        var w = box.clientWidth;
        var drag = (zeiger.x - zeiger.x0) / (w * 0.22);
        if (Math.abs(zeiger.x - zeiger.x0) > 12) s = clamp(drag, -1, 1);
        else s = zeiger.x < w / 2 ? -1 : 1;
      }
      return s;
    }

    // ---------- Nachbearbeitung (Bloom + Grading wie Blaue Stunde) ----------
    var composer = null, bloom = null, grade = null;
    var GRADE = {
      uniforms: { tDiffuse: { value: null }, zeit: { value: 0 }, koernung: { value: 0.025 }, aufl: { value: new THREE.Vector2(1, 1) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'uniform sampler2D tDiffuse; uniform float zeit, koernung; uniform vec2 aufl; varying vec2 vUv;',
        'float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }',
        'void main(){',
        ' vec2 d = vUv - 0.5; float r2 = dot(d,d); float ca = 0.002*r2*4.0;',
        ' vec3 c = vec3(texture2D(tDiffuse, vUv + d*ca).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - d*ca).b);',
        ' float l = dot(c, vec3(0.299,0.587,0.114));',
        ' c = mix(c, c*vec3(0.9,0.97,1.13), (1.0-l)*0.4); c = mix(c, c*vec3(1.08,1.0,0.9), l*0.35);',
        ' c = (c-0.5)*1.06+0.5; c *= 1.0 - smoothstep(0.12,0.72,r2)*0.5;',
        ' c += (hash(vUv*aufl + fract(zeit)*37.0)-0.5)*koernung;',
        ' gl_FragColor = vec4(max(c,0.0),1.0);',
        '}'
      ].join('\n')
    };
    if (THREE.EffectComposer && THREE.RenderPass && THREE.ShaderPass && THREE.UnrealBloomPass) {
      try {
        var rt = new THREE.WebGLRenderTarget(1, 1, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
        rt.texture.encoding = THREE.sRGBEncoding;
        composer = new THREE.EffectComposer(renderer, rt);
        composer.addPass(new THREE.RenderPass(scene, cam));
        bloom = new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.7, 0.45, 0.93);
        composer.addPass(bloom);
        grade = new THREE.ShaderPass(GRADE);
        composer.addPass(grade);
      } catch (e) { composer = null; }
    }

    function resize() {
      var w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.fov = w < h ? 74 : 58;
      cam.updateProjectionMatrix();
      if (composer) { composer.setPixelRatio(dpr); composer.setSize(w, h); grade.uniforms.aufl.value.set(w * dpr, h * dpr); }
    }

    // ---------- Schleife ----------
    var tmpV = new THREE.Vector3(), look = new THREE.Vector3();
    function update(dt) {
      g.t += dt;
      var fahrt = g.modus === 'fahrt';
      if (fahrt) {
        var lv = clamp(g.t / 120, 0, 1);
        var soll = lerp(15, 34, lv);
        g.tempo = lerp(g.tempo, soll, dt * (g.tempo < soll ? 0.5 : 2));
        var s = lenkung();
        g.vx = lerp(g.vx, s * 8.5, dt * 6);
        g.x = clamp(g.x + g.vx * dt, -FLUSS + 1.15, FLUSS - 1.15);
        if (Math.abs(g.x) >= FLUSS - 1.16) g.vx *= 0.5;
        g.dist += g.tempo * dt;
        g.unverw = Math.max(0, g.unverw - dt);
        if (g.t > 4) $('tipp').style.opacity = 0;
      } else {
        g.tempo = lerp(g.tempo, g.modus === 'ende' ? 2 : 7, dt);
        g.x = lerp(g.x, 0, dt);
        g.vx = lerp(g.vx, 0, dt * 3);
      }
      var dz = g.tempo * dt;
      // Ufer
      kacheln.forEach(function (k) { k.position.z += dz; if (k.position.z > L + 20) k.position.z -= NT * L; });
      // Hindernisse
      if (fahrt) {
        g.naechste -= dz; g.naechsteBruecke -= dz;
        if (g.naechsteBruecke <= 0) {
          var br = holen('bruecke'); br.position.set(0, 0, -170); hind.push(br);
          g.naechsteBruecke = rnd(170, 240); g.naechste = Math.max(g.naechste, 22);
        } else if (g.naechste <= 0) {
          spawnReihe(g.t < 6 ? -110 : -170);
          g.naechste = lerp(22, 11, clamp(g.t / 120, 0, 1)) * rnd(0.8, 1.2);
        }
      }
      var bz = -0.25;
      hind.forEach(function (o) {
        var d = o.userData;
        o.position.z += dz;
        if (d.drift) o.position.x = clamp(o.position.x + d.vx * dt, -FLUSS + 1, FLUSS - 1);
        if (d.blink) { var an = Math.floor((g.t + o.position.x) * 2) % 2 === 0; d.blink.visible = an; d.blinkS.visible = an; }
        if (d.dreh) d.dreh.rotation.y += dt * 2;
        o.position.y = d.typ === 'bruecke' ? 0 : Math.sin(g.t * 2 + o.position.z * 0.3) * 0.06;
        if (d.getroffen && !d.bonus) { d.weg += dt; o.position.y -= d.weg * 2; o.rotation.z += dt * 2; }
        if (!fahrt || d.getroffen) return;
        var xs = d.typ === 'bruecke' ? d.pfeiler.map(function (p) { return p + o.position.x; }) : [o.position.x];
        var hz = d.hz, ziz = o.position.z;
        xs.forEach(function (ox) {
          var lx = Math.abs(ox - g.x) - d.hx - 0.9, lz = Math.abs(ziz - bz) - hz - 1.75;
          if (lx < 0 && lz < 0) treffer(o);
        });
        if (!d.passiert && ziz - hz > bz + 1.75) {
          d.passiert = true;
          if (!d.bonus && !d.getroffen) {
            var min = Math.min.apply(null, xs.map(function (ox) { return Math.abs(ox - g.x) - d.hx - 0.9; }));
            if (min < 0.75) {
              g.kombo++; g.besteKombo = Math.max(g.besteKombo, g.kombo);
              var b = 25 * g.kombo; g.bonus += b; g.knapp++;
              zeige('KNAPP! +' + b);
              ziel.arme = 2; pose.jubel = 0.7;
              Pixel.sfx.tone(520 + g.kombo * 40, 0.12, 'triangle', 0.07);
            }
          }
        }
      });
      for (var n = hind.length - 1; n >= 0; n--) if (hind[n].position.z > 25) { ablegen(hind[n]); hind.splice(n, 1); }
      if (g.kombo > 0 && fahrt) { g.komboZeit = (g.komboZeit || 0) + dt; if (g.komboZeit > 6) { g.kombo = 0; g.komboZeit = 0; } }
      if (g.knappAlt !== g.knapp) { g.knappAlt = g.knapp; g.komboZeit = 0; }

      // Boot
      var welle = Math.sin(g.t * 2.3) * 0.05 + Math.sin(g.t * 3.7) * 0.03;
      boot.position.set(g.x, 0.02 + welle + (g.wackel > 0 ? Math.sin(g.t * 40) * 0.06 : 0), 0);
      boot.rotation.z = -g.vx * 0.045 + Math.sin(g.t * 1.9) * 0.025;
      boot.rotation.y = -g.vx * 0.03;
      boot.rotation.x = -0.035 * clamp(g.tempo / 20, 0, 1.5) + Math.sin(g.t * 2.7) * 0.015;
      boot.visible = !(g.unverw > 0 && Math.floor(g.unverw * 12) % 2 === 0);
      g.wackel = Math.max(0, g.wackel - dt);
      bootStreifen[0].position.set(g.x - 0.62, 0.03, 1.2); bootStreifen[1].position.set(g.x + 0.62, 0.03, 1.2);

      // Timo-Pose
      if (pose.schreck > 0) { pose.schreck -= dt; if (pose.schreck <= 0) { ziel.lehne = 1.0; ziel.kopf = 0.5; ziel.arme = 0; } }
      if (pose.jubel > 0) { pose.jubel -= dt; if (pose.jubel <= 0 && !(pose.schreck > 0)) ziel.arme = 0; }
      pose.lehne = lerp(pose.lehne, ziel.lehne, dt * 5);
      pose.kopf = lerp(pose.kopf, ziel.kopf + Math.sin(g.t * 1.3) * 0.08, dt * 4);
      pose.arme = lerp(pose.arme, ziel.arme, dt * 7);
      oben.rotation.x = pose.lehne;
      kopf.rotation.x = pose.kopf; kopf.rotation.z = Math.sin(g.t * 0.9) * 0.08;
      arme.forEach(function (a) {
        // 0 = auf den Ellbogen abgestützt, 1 = erschrocken nach vorn, 2 = Jubel
        var rx = pose.arme <= 1 ? lerp(-0.75, 0.9, pose.arme) : lerp(0.9, 2.9, pose.arme - 1);
        a.piv.rotation.x = rx; a.piv.rotation.z = a.s * lerp(0.38, 0.25, Math.min(1, pose.arme));
        a.unten.rotation.x = pose.arme < 0.5 ? 1.2 : 0.3;
      });
      var froh = pose.arme > 1.5 || g.modus !== 'fahrt';
      augen.forEach(function (a) { a.scale.y = pose.schreck > 0 ? 1.5 : froh ? 0.35 : 1; });
      mund.scale.set(pose.schreck > 0 ? 0.6 : 1, pose.schreck > 0 ? 1.6 : 1, 1);

      // Gischt
      if (g.tempo > 3) {
        var rate = g.tempo / 7;
        for (var r2 = 0; r2 < rate; r2++) {
          if (Math.random() > rate - r2) break;
          var seite = Math.random() < 0.5 ? -1 : 1;
          spritz(g.x + seite * 0.9, 0.06, 1.7, seite * rnd(0.8, 2.2), rnd(0, 0.3), g.tempo * 0.9, rnd(0.9, 1.5), rnd(0.5, 0.9), 0.22);
        }
        spritz(g.x + rnd(-0.15, 0.15), 0.12, 2.3, rnd(-0.6, 0.6), rnd(0.3, 1.0), g.tempo * 0.8, 0.6, rnd(0.4, 0.7), 0.25);
      }
      gischt.forEach(function (p) {
        if (!p.s.visible) return;
        p.t += dt;
        if (p.t >= p.life) { p.s.visible = false; return; }
        p.vy -= 6 * dt;
        p.s.position.x += p.vx * dt; p.s.position.y = Math.max(0.05, p.s.position.y + p.vy * dt); p.s.position.z += p.vz * dt;
        var k = p.t / p.life, sc = p.size * (1 + k * 2.2);
        p.s.scale.set(sc, sc * 0.6, 1); p.s.material.opacity = p.op * (1 - k);
      });

      // Kamera
      if (g.modus === 'fahrt') {
        g.camT = Math.min(1, g.camT + dt * 1.2);
        var e = g.camT * g.camT * (3 - 2 * g.camT);
        var schw = g.wackel > 0 ? g.wackel * 0.25 : 0;
        tmpV.set(g.x * 0.65 + rnd(-schw, schw), 3.9 + rnd(-schw, schw), 6.6);
        look.set(g.x * 0.8, 0.6, -7);
        if (e < 1 && g.camVon) {
          tmpV.lerpVectors(g.camVon, tmpV, e);
          look.lerpVectors(g.lookVon, look, e);
        }
        cam.position.lerp(tmpV, Math.min(1, dt * (e < 1 ? 20 : 6)));
        cam.lookAt(look);
      } else {
        var an2 = g.t * 0.22 + 2.2;
        cam.position.set(g.x + Math.sin(an2) * 6.5, 2.4 + Math.sin(g.t * 0.4) * 0.3, Math.cos(an2) * 6.5 - 1);
        var hoch = box.clientHeight > box.clientWidth;
        cam.lookAt(g.x, hoch && g.modus === 'intro' ? -1.4 : 0.9, 0.2);
      }

      wasserU.uTime.value = g.t; wasserU.uScroll.value = g.dist + (g.modus !== 'fahrt' ? g.t * 7 : 0);
      wasserU.uCam.value.copy(cam.position);
      if (fahrt) g.dist2 = g.dist;

      // HUD
      if (fahrt) {
        $('punkte').textContent = punkte();
        $('strecke').textContent = Math.floor(g.dist) + ' m';
        $('kn').textContent = Math.round(g.tempo * 1.2);
        var kb = $('kombo');
        kb.textContent = 'x' + g.kombo; kb.classList.toggle('leer', g.kombo < 2);
      }
    }

    function render() {
      if (composer) { grade.uniforms.zeit.value = g.t; composer.render(); }
      else renderer.render(scene, cam);
    }

    var last = performance.now(), mess = { n: 0, sum: 0 };
    function tick(now) {
      if (!alive) return;
      var roh = (now - last) / 1000;
      var dt = Math.min(0.05, roh); last = now;
      // Langsames Gerät: erst Auflösung senken, dann Bloom abschalten
      if (roh < 0.5) { mess.n++; mess.sum += roh; }
      if (mess.n >= 90) {
        if (mess.sum / mess.n > 0.03) {
          if (dpr > 1) { dpr = Math.max(1, dpr - 0.3); renderer.setPixelRatio(dpr); resize(); }
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
        '<div class="tb-schild"><span class="anker">⚓</span><h1>Timo<br>fährt Boot</h1>' +
        '<div class="unter">Blaue Stunde auf dem Fluss. Timo chillt – du lenkst.</div>' +
        '<div class="tb-zeile"><span>Bestmarke</span><b>' + best + '</b></div>' +
        '<div class="tb-steuer">Weich Bojen, Stämmen, Felsen, Enten, Booten und Brückenpfeilern aus. ' +
        '<b>Knapp vorbei</b> gibt Bonus, 🛟 Rettungsringe +100.<br>' +
        'Steuern: <kbd>A</kbd>/<kbd>D</kbd> oder <kbd>←</kbd>/<kbd>→</kbd> · am Handy Finger halten oder ziehen.</div>' +
        '<button class="tb-btn" data-act="los">Ablegen</button></div>';
    }
    function los() {
      if (g.modus === 'fahrt') return;
      reset();
      g.modus = 'fahrt'; g.tempo = 8; g.camT = 0;
      g.camVon = cam.position.clone(); g.lookVon = new THREE.Vector3(0, 0.9, 0.2);
      ebene.classList.add('aus');
      hud.classList.add('an');
      $('tipp').style.opacity = 0.75;
      Pixel.sfx.tone(196, 0.3, 'sawtooth', 0.04, 392);
    }
    function ende() {
      g.modus = 'ende';
      hud.classList.remove('an');
      ziel.lehne = 1.0; ziel.kopf = 0.5; ziel.arme = 0;
      var p = punkte(), best = +Pixel.get(BEST_KEY, 0), neu = p > best;
      if (neu) Pixel.set(BEST_KEY, p);
      setTimeout(function () {
        if (!alive) return;
        ebene.classList.remove('aus');
        ebene.innerHTML =
          '<div class="tb-schild"><span class="anker">🌊</span><h1>Baden<br>gegangen</h1>' +
          '<div class="unter">' + pick(['Timo chillt jetzt im Wasser weiter.', 'Das Boot ist hin, die Laune nicht.', 'Timo: „War Absicht."']) + '</div>' +
          '<div class="tb-zeile"><span>Punkte</span><b>' + p + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="tb-zeile"><span>Strecke</span><b>' + Math.floor(g.dist) + ' m</b></div>' +
          '<div class="tb-zeile"><span>Knapp vorbei / Ringe</span><b>' + g.knapp + ' / ' + g.ringe + '</b></div>' +
          '<div class="tb-zeile"><span>Bestmarke</span><b>' + Math.max(best, p) + '</b></div>' +
          '<div style="height:14px"></div>' +
          '<button class="tb-btn" data-act="los">Nochmal ablegen</button>' +
          '<button class="tb-btn zweit" data-act="exit">Menü</button></div>';
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
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', pd); window.removeEventListener('pointermove', pm);
      window.removeEventListener('pointerup', pu); window.removeEventListener('pointercancel', pu);
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
    window.addEventListener('pointerdown', pd); window.addEventListener('pointermove', pm);
    window.addEventListener('pointerup', pu); window.addEventListener('pointercancel', pu);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.timo = { start: start };
})();
