// Julian: Reagenzbecken – 3D-Schwimmspiel (three.js).
// Julian ist geschrumpft und schwimmt in einem riesigen Becherglas mitten im Chemielabor.
// Er sammelt Atome und baut daraus Moleküle (H₂O, NaCl, CO₂ …). Natrium und Kalium reagieren
// mit dem Wasser und knallen. Ashley (das Herz, Halbwertszeit: ewig) zieht ihn magisch an –
// erwischt er es, treibt er traurig herum. Das Durchdreh-Meter steigt mit jedem Molekül.
// Steuern: A/← und D/→ abwechselnd = kraulen (geradeaus), eine Seite mehrfach = Kurve.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.julian.best';
  var R = 29.5;        // Schwimmbereich
  var GLAS = 31;       // Becherglas-Radius

  var ELEMENTE = {
    H: { name: 'Wasserstoff', farbe: '#f2f2f2', r: 0.5, dunkel: true },
    O: { name: 'Sauerstoff', farbe: '#e8302a', r: 0.62 },
    C: { name: 'Kohlenstoff', farbe: '#3a3a40', r: 0.64 },
    N: { name: 'Stickstoff', farbe: '#3a5ad8', r: 0.6 },
    Na: { name: 'Natrium', farbe: '#a46ae8', r: 0.7, reaktiv: 1 },
    K: { name: 'Kalium', farbe: '#7a32c8', r: 0.74, reaktiv: 1.5 },
    Cl: { name: 'Chlor', farbe: '#46c846', r: 0.66 },
    S: { name: 'Schwefel', farbe: '#e8d030', r: 0.66, dunkel: true }
  };
  var MOLEKUELE = [
    { f: 'H<sub>2</sub>', name: 'Wasserstoff', a: { H: 2 }, fakt: 'Das leichteste Molekül der Welt.', stufe: 0 },
    { f: 'O<sub>2</sub>', name: 'Sauerstoff', a: { O: 2 }, fakt: 'Zum Glück gerade im Angebot.', stufe: 0 },
    { f: 'H<sub>2</sub>O', name: 'Wasser', a: { H: 2, O: 1 }, fakt: 'Er schwimmt quasi in seinem eigenen Werk.', stufe: 0 },
    { f: 'HCl', name: 'Salzsäure', a: { H: 1, Cl: 1 }, fakt: 'Gibt es auch in deinem Magen.', stufe: 1 },
    { f: 'NaCl', name: 'Kochsalz', a: { Na: 1, Cl: 1 }, fakt: 'Natrium schnappen, bevor es knallt!', stufe: 1 },
    { f: 'CO<sub>2</sub>', name: 'Kohlendioxid', a: { C: 1, O: 2 }, fakt: 'Macht die Cola sprudelig.', stufe: 1 },
    { f: 'CO', name: 'Kohlenmonoxid', a: { C: 1, O: 1 }, fakt: 'Nicht einatmen. Ernsthaft.', stufe: 1 },
    { f: 'NH<sub>3</sub>', name: 'Ammoniak', a: { N: 1, H: 3 }, fakt: 'Riecht nach Katzenklo.', stufe: 2 },
    { f: 'CH<sub>4</sub>', name: 'Methan', a: { C: 1, H: 4 }, fakt: 'Kühe sind große Fans.', stufe: 2 },
    { f: 'H<sub>2</sub>O<sub>2</sub>', name: 'Wasserstoffperoxid', a: { H: 2, O: 2 }, fakt: 'Blondiert auch Haare.', stufe: 2 },
    { f: 'KCl', name: 'Kaliumchlorid', a: { K: 1, Cl: 1 }, fakt: 'Kalium knallt noch lauter als Natrium.', stufe: 2 },
    { f: 'SO<sub>2</sub>', name: 'Schwefeldioxid', a: { S: 1, O: 2 }, fakt: 'Riecht nach angezündetem Streichholz.', stufe: 2 },
    { f: 'NaOH', name: 'Natronlauge', a: { Na: 1, O: 1, H: 1 }, fakt: 'pH 14 – Julian ist begeistert.', stufe: 3 },
    { f: 'CH<sub>3</sub>OH', name: 'Methanol', a: { C: 1, H: 4, O: 1 }, fakt: 'Nicht trinken. Niemals.', stufe: 3 },
    { f: 'H<sub>2</sub>SO<sub>4</sub>', name: 'Schwefelsäure', a: { H: 2, S: 1, O: 4 }, fakt: 'Lieber nicht drin schwimmen.', stufe: 3 }
  ];
  var SPRUECHE = ['Kovalente Bindung, Baby!', 'Avogadro wäre stolz!', 'Ich SEHE die Elektronen!', 'Ich bin das Lösungsmittel!', 'Mehr Protonen!!!', 'Exotherm!!', 'Ausgeglichen. Wie ich.', 'Stoffmenge: unendlich!'];
  var TRAUER = ['Ashley …', 'Manche Bindungen halten nicht …', 'Ashley … Halbwertszeit: ewig.', 'Wir waren so eine stabile Verbindung …', '*schnief* … unsere Elektronenpaare …'];
  var FORMELN = ['pH 14!', 'C₆H₁₂O₆', 'Mol!', 'NaCl', 'ΔH < 0', '6,022·10²³', 'H⁺', 'Redox!', 'sp³', 'Ar', 'e⁻ e⁻ e⁻'];

  var CSS = [
    '.jn{position:absolute;inset:0;overflow:hidden;background:#0c1620;font-family:"Barlow Semi Condensed","Arial Narrow",Arial,sans-serif;color:#eafff4;touch-action:none;-webkit-user-select:none;user-select:none}',
    '.jn canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
    '.jn-hud{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .5s}',
    '.jn-hud.an{opacity:1}',
    '.jn-punkte{position:absolute;left:calc(66px + env(safe-area-inset-left));top:calc(10px + env(safe-area-inset-top));text-shadow:0 2px 10px rgba(0,0,0,.6)}',
    '.jn-punkte b{display:block;font-size:clamp(28px,6.5vw,44px);font-weight:800;line-height:1}',
    '.jn-punkte span{font-size:14px;font-weight:700;opacity:.85}',
    '.jn-auftrag{position:absolute;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translateX(-50%);background:rgba(10,24,32,.82);border:2px solid #39ff88;',
    ' border-radius:10px;padding:6px 14px 8px;text-align:center;white-space:nowrap;box-shadow:0 0 22px rgba(57,255,136,.25)}',
    '.jn-auftrag small{display:block;font-size:11px;font-weight:800;letter-spacing:.16em;color:#39ff88}',
    '.jn-auftrag b{font-size:clamp(20px,5vw,28px);font-weight:800}',
    '.jn-auftrag b sub{font-size:.6em}',
    '.jn-auftrag em{font-style:normal;font-size:15px;font-weight:600;opacity:.8;margin-left:8px}',
    '.jn-slots{display:flex;gap:5px;justify-content:center;margin-top:5px}',
    '.jn-slots i{width:24px;height:24px;border-radius:50%;border:2px dashed rgba(255,255,255,.45);font:800 11px/20px "Barlow Semi Condensed",sans-serif;font-style:normal;color:rgba(255,255,255,.6);text-align:center}',
    '.jn-slots i.voll{border-style:solid;border-color:#fff;color:#111}',
    '.jn-zeit{height:6px;background:rgba(255,255,255,.15);border-radius:3px;margin-top:6px;overflow:hidden}',
    '.jn-zeit span{display:block;height:100%;background:#39ff88;transition:width .2s linear}',
    '.jn-zeit.knapp span{background:#ff5a4a}',
    '.jn-wahn{position:absolute;right:calc(66px + env(safe-area-inset-right));top:calc(14px + env(safe-area-inset-top));width:min(30vw,170px);text-align:right}',
    '.jn-wahn small{display:block;font-size:11px;font-weight:800;letter-spacing:.12em;color:#ff7af0}',
    '.jn-wahn div{height:12px;border-radius:6px;background:rgba(0,0,0,.45);border:2px solid rgba(255,255,255,.55);overflow:hidden;margin-top:3px}',
    '.jn-wahn div span{display:block;height:100%;width:0;background:linear-gradient(90deg,#39ff88,#ffe14a,#ff4af0);transition:width .2s}',
    '.jn-wahn em{display:block;font-style:normal;font-size:14px;font-weight:800;margin-top:2px;text-shadow:0 2px 6px rgba(0,0,0,.7)}',
    '.jn-wahn.eureka div span{animation:jnRegen .4s linear infinite}',
    '@keyframes jnRegen{0%{filter:hue-rotate(0)}100%{filter:hue-rotate(360deg)}}',
    '.jn-meldung{position:absolute;left:50%;top:36%;transform:translate(-50%,-50%);text-align:center;opacity:0;white-space:nowrap}',
    '.jn-meldung b{display:block;font-size:clamp(26px,6.5vw,46px);font-weight:800;color:#39ff88;text-shadow:0 0 18px rgba(57,255,136,.6),0 3px 0 rgba(0,0,0,.5)}',
    '.jn-meldung b sub{font-size:.6em}',
    '.jn-meldung small{display:block;font-size:clamp(14px,3.6vw,18px);font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.8)}',
    '.jn-meldung.rot b{color:#ff6a5a;text-shadow:0 0 18px rgba(255,90,74,.6),0 3px 0 rgba(0,0,0,.5)}',
    '.jn-meldung.pink b{color:#ff8ad8;text-shadow:0 0 18px rgba(255,120,220,.6),0 3px 0 rgba(0,0,0,.5)}',
    '.jn-meldung.zeigen{animation:jnPop 1.8s ease-out}',
    '@keyframes jnPop{0%{opacity:0;transform:translate(-50%,-30%) scale(.75)}10%{opacity:1;transform:translate(-50%,-50%) scale(1.06)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-70%)}}',
    '.jn-blase{position:absolute;pointer-events:none;background:#fff;color:#14202a;font-weight:800;font-size:15px;padding:4px 10px;border-radius:12px;',
    ' transform:translate(-50%,-100%);white-space:nowrap;opacity:0;transition:opacity .2s;box-shadow:0 4px 14px rgba(0,0,0,.35)}',
    '.jn-blase.traurig{background:#c8d4e8;font-style:italic}',
    '.jn-tipp{position:absolute;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);font-size:clamp(13px,3.4vw,16px);font-weight:700;',
    ' white-space:nowrap;text-shadow:0 2px 8px rgba(0,0,0,.8);transition:opacity 1s}',
    '@media (pointer:coarse){.jn-tipp{bottom:calc(118px + env(safe-area-inset-bottom))}}',
    '.jn-knopf{position:absolute;top:calc(12px + env(safe-area-inset-top));width:42px;height:42px;border-radius:10px;border:2px solid #39ff88;background:rgba(10,24,32,.8);',
    ' color:#eafff4;font:700 20px/1 sans-serif;cursor:pointer;z-index:20}',
    '.jn-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;padding:0 16px calc(16px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.jn-pad.an{display:flex}',
    '.jn-pad button{pointer-events:auto;width:92px;height:92px;border-radius:50%;border:3px solid rgba(57,255,136,.7);background:rgba(10,24,32,.45);color:#eafff4;',
    ' font:800 15px/1.1 "Barlow Semi Condensed",sans-serif;touch-action:none;-webkit-user-select:none;user-select:none}',
    '.jn-pad button.gedrueckt{background:rgba(57,255,136,.45)}',
    '.jn-ebene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;z-index:30;transition:opacity .45s}',
    '.jn-ebene.aus{opacity:0;pointer-events:none}',
    '@media (min-width:900px){.jn-ebene{justify-content:flex-start;padding-left:6vw}}',
    '@media (max-width:899px) and (orientation:portrait){.jn-ebene{align-items:flex-end;padding-bottom:calc(16px + env(safe-area-inset-bottom))}}',
    // Laborprotokoll mit Element-Kachel
    '.jn-karte{width:min(480px,100%);background:#f4f8f2;color:#14202a;border-radius:14px;padding:18px 20px 18px;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 3px #39ff88}',
    '.jn-kopf{display:flex;gap:16px;align-items:center;margin-bottom:10px}',
    '.jn-kachel{flex:none;width:104px;height:116px;border:3px solid #14202a;border-radius:8px;background:linear-gradient(160deg,#c8ffe0,#7ae8b0);position:relative;font-weight:800}',
    '.jn-kachel .nr{position:absolute;left:7px;top:4px;font-size:15px}',
    '.jn-kachel .sym{position:absolute;left:0;right:0;top:20px;text-align:center;font-size:52px;line-height:1}',
    '.jn-kachel .nm{position:absolute;left:0;right:0;bottom:20px;text-align:center;font-size:14px}',
    '.jn-kachel .ms{position:absolute;left:0;right:0;bottom:4px;text-align:center;font-size:11px;font-weight:700}',
    '.jn-karte h1{margin:0;font-size:clamp(34px,8vw,48px);font-weight:800;line-height:.92;color:#0a7a4a}',
    '.jn-karte .unter{font-size:16px;font-weight:600;margin-top:4px;color:#3a4a54}',
    '.jn-karte ul{margin:6px 0 12px;padding:0;list-style:none;font-size:15.5px;line-height:1.42;font-weight:600}',
    '.jn-karte .zeile{display:flex;justify-content:space-between;border-top:2px dotted rgba(20,32,42,.25);padding:6px 0;font-size:18px;font-weight:700}',
    '.jn-karte .zeile b{font-size:22px;font-weight:800;color:#0a7a4a}',
    '.jn-btn{width:100%;border:0;border-radius:10px;background:#0a7a4a;color:#fff;font-family:inherit;font-weight:800;font-size:24px;padding:11px 16px;cursor:pointer;box-shadow:0 4px 0 #05472b;margin-top:4px}',
    '.jn-btn:active{transform:translateY(3px);box-shadow:0 1px 0 #05472b}',
    '.jn-btn.zweit{margin-top:10px;background:transparent;color:#3a4a54;border:2px solid rgba(20,32,42,.3);box-shadow:none;font-size:19px;padding:7px}',
    '@media (max-width:899px) and (orientation:portrait){.jn-karte ul{font-size:14px}.jn-kachel{width:84px;height:96px}.jn-kachel .sym{font-size:42px;top:18px}.jn-kachel .nm{bottom:16px;font-size:12px}}',
    '@media (max-width:640px){.jn-auftrag{top:calc(60px + env(safe-area-inset-top))}.jn-wahn{width:30vw}}',
    '.jn-fehler{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-size:20px;z-index:40;background:#0c1620}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function winkel(a) { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; }
  function daempf(dt, k) { return 1 - Math.exp(-dt * k); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="jn"><canvas></canvas>' +
      '<div class="jn-hud">' +
        '<div class="jn-punkte"><b data-el="punkte">0</b><span data-el="anzahl">0 Moleküle</span></div>' +
        '<div class="jn-auftrag"><small>SYNTHETISIERE</small><b data-el="formel">H<sub>2</sub>O</b><em data-el="mname">Wasser</em>' +
          '<div class="jn-slots" data-el="slots"></div><div class="jn-zeit" data-el="zeitBox"><span data-el="zeit"></span></div></div>' +
        '<div class="jn-wahn" data-el="wahnBox"><small>DURCHDREH-METER</small><div><span data-el="wahn"></span></div><em data-el="wahnTxt">noch normal</em></div>' +
        '<div class="jn-meldung" data-el="meldung"></div>' +
        '<div class="jn-tipp" data-el="tipp">A / D abwechselnd = kraulen · eine Seite mehrmals = Kurve</div>' +
      '</div>' +
      '<div class="jn-blase" data-el="blase"></div>' +
      '<div class="jn-pad"><button data-pad="l" aria-label="Links kraulen">◀<br>LINKS</button><button data-pad="r" aria-label="Rechts kraulen">▶<br>RECHTS</button></div>' +
      '<button class="jn-knopf" style="left:calc(12px + env(safe-area-inset-left))" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
      '<button class="jn-knopf" style="right:calc(12px + env(safe-area-inset-right))" data-act="ton" aria-label="Ton an/aus"></button>' +
      '<div class="jn-ebene" data-el="ebene"></div></div>';
    root.appendChild(style);
    var box = root.querySelector('.jn'), canvas = root.querySelector('canvas');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var hud = root.querySelector('.jn-hud'), ebene = $('ebene'), tonBtn = root.querySelector('[data-act=ton]'), pad = root.querySelector('.jn-pad');
    var alive = true, raf = 0;

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); }
    catch (e) {
      box.insertAdjacentHTML('beforeend', '<div class="jn-fehler">Dein Browser konnte die 3D-Grafik nicht starten. Schließ andere Tabs mit 3D-Inhalten und lade neu.</div>');
      return function () {};
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    renderer.setPixelRatio(dpr);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color('#b8c6c6').convertSRGBToLinear();
    scene.fog = new THREE.Fog(scene.background.clone(), 180, 520);
    var cam = new THREE.PerspectiveCamera(58, 1, 0.1, 2000);

    // ---------- Hilfen ----------
    function farbe(hex) { return new THREE.Color(hex).convertSRGBToLinear(); }
    function std(hex, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: farbe(hex), roughness: 0.6, metalness: 0 }, o || {})); }
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
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, w, w);
    }, false);
    function glow(hex, size, op, additiv) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: farbe(hex), transparent: true, opacity: op === undefined ? 1 : op, depthWrite: false, blending: additiv === false ? THREE.NormalBlending : THREE.AdditiveBlending }));
      s.scale.set(size, size, 1); return s;
    }
    function textSprite(txt, hex, groesse) {
      var t = canvasTex(256, 128, function (x, w, h) {
        x.font = '800 74px "Barlow Semi Condensed",Arial,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.lineWidth = 12; x.strokeStyle = 'rgba(10,20,26,.85)'; x.strokeText(txt, w / 2, h / 2); x.fillStyle = hex || '#fff'; x.fillText(txt, w / 2, h / 2);
      });
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
      s.scale.set(groesse * 2, groesse, 1); return s;
    }
    function mesh(geo, mat, x, y, z, p, schatten) { var m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); if (schatten !== false) { m.castShadow = true; m.receiveShadow = true; } if (p) p.add(m); return m; }
    function ellip(rx, ry, rz, mat, x, y, z, p) { var m = mesh(new THREE.SphereGeometry(1, 20, 14), mat, x, y, z, p); m.scale.set(rx, ry, rz); return m; }

    // ---------- Licht ----------
    scene.add(new THREE.HemisphereLight(0xeef6ff, 0x4a5a58, 0.6));
    var sonne = new THREE.DirectionalLight(0xfffaf0, 0.9);
    sonne.position.set(40, 120, 30); sonne.castShadow = true; sonne.shadow.mapSize.set(1024, 1024);
    var sc = sonne.shadow.camera; sc.left = -40; sc.right = 40; sc.top = 40; sc.bottom = -40; sc.near = 20; sc.far = 260; sonne.shadow.bias = -0.0008;
    scene.add(sonne);
    var wasserLicht = new THREE.PointLight(0x5affc0, 0.6, 70); wasserLicht.position.set(0, 6, 0); scene.add(wasserLicht);

    // ---------- Riesiges Labor ----------
    var labor = new THREE.Group(); scene.add(labor);
    var periodenTex = canvasTex(1024, 560, function (x, w, h) {
      x.fillStyle = '#f6f4ec'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#14202a'; x.font = '800 40px "Barlow Semi Condensed",Arial,sans-serif'; x.textAlign = 'center'; x.fillText('PERIODENSYSTEM DER ELEMENTE', w / 2, 46);
      var sym = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca'.split(' '), pos = [[0, 0], [17, 0], [0, 1], [1, 1], [12, 1], [13, 1], [14, 1], [15, 1], [16, 1], [17, 1], [0, 2], [1, 2], [12, 2], [13, 2], [14, 2], [15, 2], [16, 2], [17, 2], [0, 3], [1, 3]];
      var cols = ['#f2a0a0', '#f2d08a', '#b8e0a0', '#9ad0f0', '#d0b0f0'];
      for (var r = 0; r < 7; r++) for (var c = 0; c < 18; c++) {
        if (r < 3 && c > 1 && c < 12) continue; if (r === 0 && c > 0 && c < 17) continue;
        var px = 22 + c * 54.5, py = 70 + r * 66;
        x.fillStyle = cols[(c * 3 + r) % cols.length]; x.fillRect(px, py, 50, 60); x.strokeStyle = '#14202a'; x.lineWidth = 2; x.strokeRect(px, py, 50, 60);
      }
      x.font = '800 26px "Barlow Semi Condensed",Arial,sans-serif'; x.fillStyle = '#14202a';
      sym.forEach(function (s, i) { x.fillText(s, 22 + pos[i][0] * 54.5 + 25, 70 + pos[i][1] * 66 + 40); });
    });
    var tafelTex = canvasTex(1024, 480, function (x, w, h) {
      x.fillStyle = '#24463a'; x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(255,255,255,.85)'; x.font = '600 46px "Barlow Semi Condensed",Arial,sans-serif';
      ['2 Na + 2 H₂O → 2 NaOH + H₂ ↑', 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', 'n = m / M     pH = −lg c(H⁺)', 'Julian + Becherglas = ???'].forEach(function (t, i) { x.fillText(t, 50, 90 + i * 100); });
    });
    var regelTex = canvasTex(512, 640, function (x, w, h) {
      x.fillStyle = '#ffe14a'; x.fillRect(0, 0, w, h); x.fillStyle = '#14202a'; x.fillRect(0, 0, w, 110);
      x.fillStyle = '#ffe14a'; x.font = '800 54px "Barlow Semi Condensed",Arial,sans-serif'; x.textAlign = 'center'; x.fillText('LABORREGELN', w / 2, 74);
      x.fillStyle = '#14202a'; x.font = '700 34px "Barlow Semi Condensed",Arial,sans-serif'; x.textAlign = 'left';
      ['1. Schutzbrille tragen', '2. Nichts trinken', '3. Nicht im Becherglas', '    schwimmen!!', '4. Julian, wir meinen', '    DICH.'].forEach(function (t, i) { x.fillText(t, 36, 180 + i * 72); });
    });
    var wandM = std('#bccac6', { roughness: 0.95 });
    [[0, -300, 0], [0, 300, Math.PI], [-300, 0, Math.PI / 2], [300, 0, -Math.PI / 2]].forEach(function (w) {
      var m = mesh(new THREE.PlaneGeometry(600, 400), wandM, w[0], 120, w[1], labor, false); m.rotation.y = w[2]; m.receiveShadow = true;
    });
    mesh(new THREE.PlaneGeometry(260, 142), new THREE.MeshStandardMaterial({ map: periodenTex, roughness: 0.9 }), 0, 110, -299, labor, false);
    var tafel = mesh(new THREE.PlaneGeometry(240, 112), new THREE.MeshStandardMaterial({ map: tafelTex, roughness: 0.95 }), -299, 100, -20, labor, false); tafel.rotation.y = Math.PI / 2;
    var regel = mesh(new THREE.PlaneGeometry(80, 100), new THREE.MeshStandardMaterial({ map: regelTex, roughness: 0.9 }), 299, 90, 40, labor, false); regel.rotation.y = -Math.PI / 2;
    var decke = mesh(new THREE.PlaneGeometry(600, 600), std('#f2f4f2'), 0, 320, 0, labor, false); decke.rotation.x = Math.PI / 2;
    for (var li = -1; li <= 1; li++) mesh(new THREE.BoxGeometry(160, 2, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, 318, li * 120, labor, false);
    // Labortisch, auf dem das Becherglas steht
    var tisch = mesh(new THREE.BoxGeometry(520, 8, 240), std('#2c3a3c', { roughness: 0.5 }), 0, -26, 0, labor); tisch.receiveShadow = true;
    mesh(new THREE.BoxGeometry(524, 2, 244), std('#9aa4a6', { metalness: 0.6, roughness: 0.3 }), 0, -21.6, 0, labor);
    // Bunsenbrenner
    var brenner = new THREE.Group(); brenner.position.set(78, -21, -28); labor.add(brenner);
    mesh(new THREE.CylinderGeometry(9, 11, 3, 24), std('#3a3a40', { metalness: 0.5, roughness: 0.4 }), 0, 1.5, 0, brenner);
    mesh(new THREE.CylinderGeometry(2.4, 2.6, 34, 16), std('#b8bcc2', { metalness: 0.8, roughness: 0.25 }), 0, 18, 0, brenner);
    var flamme = mesh(new THREE.ConeGeometry(3.2, 16, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0x4a8aff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), 0, 43, 0, brenner, false);
    var flammeGlow = glow('#6aa0ff', 26, 0.7); flammeGlow.position.y = 42; brenner.add(flammeGlow);
    // Erlenmeyer- und Rundkolben mit leuchtenden Flüssigkeiten
    var glasM = new THREE.MeshStandardMaterial({ color: farbe('#e8f6ff'), transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false });
    function kolben(x, z, h, flussig, rund) {
      var g = new THREE.Group(); g.position.set(x, -21, z); labor.add(g);
      var pts = rund ? [[0, 0], [10, 2], [17, 12], [18, 22], [14, 33], [4, 40], [4, h], [5, h + 1]] : [[0, 0], [22, 0], [23, 2], [7, h * 0.78], [6, h], [7, h + 1]];
      var v = pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
      mesh(new THREE.LatheGeometry(v, 32), glasM, 0, 0, 0, g, false);
      var fl = rund ? [[0, 0.5], [10, 2.5], [16.4, 12], [17, 20], [0.01, 20]] : [[0, 0.5], [21.5, 0.5], [13, h * 0.42], [0.01, h * 0.42]];
      mesh(new THREE.LatheGeometry(fl.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 32), new THREE.MeshStandardMaterial({ color: farbe(flussig), emissive: farbe(flussig), emissiveIntensity: 0.45, transparent: true, opacity: 0.8, roughness: 0.2 }), 0, 0, 0, g, false);
      var gl = glow(flussig, rund ? 50 : 60, 0.25); gl.position.y = 12; g.add(gl);
      return g;
    }
    kolben(-82, -40, 70, '#c84ae8', false); kolben(70, 74, 60, '#4ae8a0', true); kolben(-60, 90, 50, '#ffb02a', false);
    // Reagenzglasständer
    var staender = new THREE.Group(); staender.position.set(-30, -21, -95); labor.add(staender);
    mesh(new THREE.BoxGeometry(70, 3, 14), std('#c8a070', { roughness: 0.8 }), 0, 1.5, 0, staender); mesh(new THREE.BoxGeometry(70, 2, 14), std('#c8a070', { roughness: 0.8 }), 0, 24, 0, staender);
    ['#ff4a5a', '#4a8aff', '#ffe14a', '#4ae88a', '#ff8af0'].forEach(function (c, i) {
      var x = -26 + i * 13;
      mesh(new THREE.CylinderGeometry(3, 3, 40, 16, 1, true), glasM, x, 22, 0, staender, false);
      mesh(new THREE.CylinderGeometry(2.7, 2.7, rnd(10, 24), 16), new THREE.MeshStandardMaterial({ color: farbe(c), emissive: farbe(c), emissiveIntensity: 0.4, transparent: true, opacity: 0.85 }), x, 10, 0, staender, false);
    });

    // ---------- Becherglas ----------
    var skalaTex = canvasTex(1024, 256, function (x, w, h) {
      x.clearRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.8)'; x.fillStyle = 'rgba(255,255,255,.85)'; x.font = '700 22px "Barlow Semi Condensed",Arial,sans-serif';
      for (var i = 0; i < 6; i++) { var y = 40 + i * 34; x.lineWidth = 3; x.beginPath(); x.moveTo(60, y); x.lineTo(i % 2 ? 110 : 150, y); x.stroke(); if (!(i % 2)) x.fillText((1000 - i * 100) + ' ml', 160, y + 8); }
    });
    skalaTex.wrapS = THREE.RepeatWrapping; skalaTex.repeat.set(4, 1);
    var becher = new THREE.Group(); scene.add(becher);
    mesh(new THREE.CylinderGeometry(GLAS, GLAS, 26, 96, 1, true), glasM, 0, -9, 0, becher, false);
    mesh(new THREE.CylinderGeometry(GLAS - 0.05, GLAS - 0.05, 20, 96, 1, true), new THREE.MeshBasicMaterial({ map: skalaTex, transparent: true, side: THREE.DoubleSide, depthWrite: false }), 0, -8, 0, becher, false);
    var rand = mesh(new THREE.TorusGeometry(GLAS, 0.45, 12, 120), std('#f4fbff', { transparent: true, opacity: 0.55, roughness: 0.05 }), 0, 4, 0, becher, false); rand.rotation.x = Math.PI / 2;
    // Wasser
    var wasserU = { uT: { value: 0 }, uHue: { value: 0 }, uKam: { value: new THREE.Vector3() }, uTief: { value: farbe('#063a42') }, uHell: { value: farbe('#1cc896') } };
    var wasserGeo = new THREE.PlaneGeometry(2 * GLAS + 2, 2 * GLAS + 2, 120, 120); wasserGeo.rotateX(-Math.PI / 2);
    var wasser = new THREE.Mesh(wasserGeo, new THREE.ShaderMaterial({
      uniforms: wasserU,
      vertexShader: [
        'uniform float uT; varying vec3 vW; varying vec3 vN;',
        'float welle(vec2 p){ return sin(p.x*0.35+uT*1.6)*0.12 + sin(p.y*0.42-uT*1.3)*0.1 + sin((p.x+p.y)*0.9+uT*2.4)*0.05; }',
        'void main(){ vec3 p = position; p.y += welle(p.xz); float e = 0.15;',
        ' vN = normalize(vec3(-(welle(p.xz+vec2(e,0.))-welle(p.xz-vec2(e,0.)))/(2.*e), 1.0, -(welle(p.xz+vec2(0.,e))-welle(p.xz-vec2(0.,e)))/(2.*e)));',
        ' vec4 w = modelMatrix*vec4(p,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uTief, uHell, uKam; uniform float uT, uHue; varying vec3 vW; varying vec3 vN;',
        'vec3 hue(vec3 c, float a){ const vec3 k = vec3(0.57735); float ca = cos(a); return c*ca + cross(k,c)*sin(a) + k*dot(k,c)*(1.0-ca); }',
        'void main(){ if (length(vW.xz) > ' + (GLAS - 0.2).toFixed(1) + ') discard;',
        ' vec3 v = normalize(uKam - vW); float fr = pow(1.0 - max(dot(v, vN), 0.0), 3.0);',
        ' float r = length(vW.xz) / ' + GLAS.toFixed(1) + ';',
        ' vec3 c = mix(uHell, uTief, smoothstep(0.0, 1.0, r * 0.9));',
        ' float s = sin(vW.x*1.3+uT*2.0)*sin(vW.z*1.1-uT*1.7) + sin(vW.x*0.6-vW.z*0.8+uT); c += uHell*0.22*smoothstep(0.8, 1.6, s);',
        ' c = mix(c, vec3(0.6,0.85,0.9), fr*0.35);',
        ' vec3 L = normalize(vec3(0.3,1.0,0.2)); vec3 hv = normalize(L+v); c += pow(max(dot(vN,hv),0.0), 140.0)*0.9;',
        ' c = hue(c, uHue);',
        ' gl_FragColor = vec4(c, 1.0);',
        ' #include <encodings_fragment>',
        '}'
      ].join('\n')
    }));
    wasser.receiveShadow = false; scene.add(wasser);

    // ---------- Julian ----------
    function gesichtTex(art) {
      return canvasTex(1024, 512, function (x, w, h) {
        var px = w / 360;
        function P(lon, lat) { return [w * 0.25 + lon * px, h / 2 - lat * px]; }
        function ell(c, rx, ry) { x.beginPath(); x.ellipse(c[0], c[1], rx * px, ry * px, 0, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = '#f0c4a6'; x.fillRect(0, 0, w, h);
        x.fillStyle = '#6a4a2e'; x.fillRect(0, 0, w, h / 2 - 30 * px); x.fillRect(w * 0.25 + 82 * px, 0, 196 * px, h / 2 + 18 * px);
        var traurig = art === 'traurig';
        [-1, 1].forEach(function (s) {
          var a = P(s * 17, 4);
          x.fillStyle = '#fff'; ell(a, 8, traurig ? 4.5 : 7);
          x.fillStyle = '#5a3a20'; ell([a[0], a[1] + (traurig ? 1.5 : 0) * px], traurig ? 4 : 3.2, traurig ? 4 : 3.2);
          x.fillStyle = '#100804'; ell([a[0], a[1] + (traurig ? 1.5 : 0) * px], traurig ? 2.2 : 1.3, traurig ? 2.2 : 1.3);
          x.fillStyle = '#fff'; ell([a[0] - 1.6 * px, a[1] - 1.6 * px], 1, 1);
          x.fillStyle = '#5a3a20'; x.beginPath();
          var i1 = P(s * 7, traurig ? 12.5 : 14), a1 = P(s * 27, traurig ? 9.5 : 16);
          x.moveTo(i1[0], i1[1]); x.lineTo(a1[0], a1[1]); x.lineTo(a1[0], a1[1] + 2.6 * px); x.lineTo(i1[0], i1[1] + 2.6 * px); x.closePath(); x.fill();
        });
        if (traurig) { x.fillStyle = 'rgba(120,190,255,.9)'; ell(P(-21, -6), 1.6, 3); }
        x.strokeStyle = 'rgba(176,104,84,.55)'; x.lineWidth = 1.5 * px; var n = P(0, -8); x.beginPath(); x.arc(n[0], n[1], 4 * px, Math.PI * 0.15, Math.PI * 0.85); x.stroke();
        // leichter Bartschatten
        x.fillStyle = 'rgba(90,60,40,.18)'; ell(P(0, -30), 12, 4);
        var mo = P(0, -20);
        if (traurig) {
          x.strokeStyle = '#7a3a34'; x.lineWidth = 2 * px; x.beginPath(); x.moveTo(mo[0] - 8 * px, mo[1] + 2 * px); x.quadraticCurveTo(mo[0], mo[1] - 4 * px, mo[0] + 8 * px, mo[1] + 2 * px); x.stroke();
        } else {
          x.fillStyle = '#3a1010'; x.beginPath(); x.moveTo(mo[0] - 14 * px, mo[1] - 3 * px); x.quadraticCurveTo(mo[0], mo[1] + 14 * px, mo[0] + 14 * px, mo[1] - 3 * px); x.closePath(); x.fill();
          x.fillStyle = '#fff'; x.fillRect(mo[0] - 11 * px, mo[1] - 2.6 * px, 22 * px, 3.2 * px);
          x.fillStyle = '#e8707a'; ell([mo[0], mo[1] + 5 * px], 5, 2.2);
        }
      });
    }
    var julian = new THREE.Group(); scene.add(julian);
    var J = (function () {
      var modell = new THREE.Group(); modell.rotation.y = Math.PI; julian.add(modell); // Modell schaut nach +Z, Julian schwimmt nach -Z
      var kittel = std('#f2f2ee', { roughness: 0.7 }), polo = std('#6a7078', { roughness: 0.9 }), haut = std('#f0c4a6', { roughness: 0.7 });
      var haar = std('#6a4a2e', { roughness: 0.9 }), haarH = std('#9a7048', { roughness: 0.9 }), brilleM = std('#2a2a30', { roughness: 0.4 });
      var koerper = new THREE.Group(); koerper.rotation.x = 0.95; modell.add(koerper); // schräg im Wasser liegend
      ellip(0.36, 0.42, 0.24, kittel, 0, 0.2, 0, koerper);
      mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.12, 16), polo, 0, 0.6, 0, koerper);
      [-1, 1].forEach(function (s) { var r = mesh(new THREE.BoxGeometry(0.14, 0.3, 0.03), kittel, s * 0.12, 0.42, 0.22, koerper); r.rotation.z = s * 0.35; });
      mesh(new THREE.BoxGeometry(0.1, 0.12, 0.02), std('#d8dce0'), 0.18, 0.32, 0.235, koerper);
      [['#d83a3a', 0.15], ['#3a6ad8', 0.19]].forEach(function (s) { mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6), std(s[0]), s[1], 0.4, 0.245, koerper); });
      [-1, 1].forEach(function (s) { var b = mesh(new THREE.CylinderGeometry(0.11, 0.07, 0.75, 10), std('#3a4a6a'), s * 0.13, -0.5, -0.02, koerper); b.rotation.x = 0.15; });
      var arme = [-1, 1].map(function (s) {
        var piv = new THREE.Group(); piv.position.set(s * 0.38, 0.45, 0); koerper.add(piv);
        mesh(new THREE.SphereGeometry(0.11, 12, 8), kittel, 0, 0, 0, piv);
        var g = new THREE.CylinderGeometry(0.1, 0.085, 0.62, 12); g.translate(0, -0.31, 0); mesh(g, kittel, 0, 0, 0, piv);
        ellip(0.07, 0.1, 0.05, haut, 0, -0.68, 0, piv);
        return piv;
      });
      var kopf = new THREE.Group(); kopf.position.set(0, 0.95, 0); kopf.rotation.x = -0.85; koerper.add(kopf); // Kopf über Wasser, Blick nach vorn
      var gesicht = { irre: gesichtTex('irre'), traurig: gesichtTex('traurig') };
      var schaedel = mesh(new THREE.SphereGeometry(0.26, 36, 26), new THREE.MeshStandardMaterial({ map: gesicht.irre, roughness: 0.7 }), 0, 0, 0, kopf); schaedel.scale.set(0.95, 1.06, 0.98);
      [-1, 1].forEach(function (s) { ellip(0.04, 0.07, 0.035, haut, s * 0.25, -0.01, 0, kopf); });
      ellip(0.04, 0.05, 0.05, haut, 0, -0.03, 0.255, kopf);
      // Schwimmbrille
      [-1, 1].forEach(function (s) {
        var a = s * 17 * Math.PI / 180, b = 4 * Math.PI / 180, r = 0.272;
        var ring = mesh(new THREE.TorusGeometry(0.058, 0.016, 8, 20), brilleM, Math.sin(a) * r, Math.sin(b) * r * 1.06, Math.cos(a) * r * 0.98, kopf); ring.rotation.y = a;
        var glas = mesh(new THREE.CircleGeometry(0.058, 20), new THREE.MeshStandardMaterial({ color: farbe('#5ac8f0'), transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.3 }), Math.sin(a) * (r + 0.004), Math.sin(b) * r * 1.06, Math.cos(a) * (r + 0.004) * 0.98, kopf, false); glas.rotation.y = a;
      });
      var band = mesh(new THREE.TorusGeometry(0.262, 0.014, 6, 40), brilleM, 0, 0.015, -0.01, kopf); band.scale.set(0.97, 1, 0.99);
      // verwuschelte Haare
      var kappe = mesh(new THREE.SphereGeometry(0.275, 24, 14, 0, Math.PI * 2, 0, 1.25), haar, 0, 0.02, -0.01, kopf); kappe.rotation.x = -0.12;
      for (var i = 0; i < 34; i++) {
        var lon = rnd(-180, 180) * Math.PI / 180, lat = rnd(25, 82) * Math.PI / 180, r2 = 0.27;
        var bx = Math.sin(lon) * Math.cos(lat) * r2, by = Math.sin(lat) * r2 + 0.03, bz = Math.cos(lon) * Math.cos(lat) * r2;
        var tuft = mesh(new THREE.ConeGeometry(rnd(0.045, 0.07), rnd(0.18, 0.3), 6), i % 3 ? haar : haarH, bx, by, bz, kopf);
        tuft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(bx + rnd(-0.08, 0.08), by + rnd(0.05, 0.2), bz + rnd(-0.08, 0.08)).normalize());
      }
      // Pony über der Stirn
      for (var k = -3; k <= 3; k++) {
        var a2 = k * 13 * Math.PI / 180, f = mesh(new THREE.ConeGeometry(0.055, 0.22, 6), k % 2 ? haarH : haar, Math.sin(a2) * 0.26, 0.17, Math.cos(a2) * 0.24, kopf);
        f.rotation.set(1.9 + rnd(-0.2, 0.2), a2, rnd(-0.3, 0.3));
      }
      // Regenwolke für traurige Momente
      var wolke = new THREE.Group(); wolke.visible = false; wolke.scale.setScalar(0.75); wolke.position.y = 0.9; julian.add(wolke);
      var wolkeM = std('#6a7484', { roughness: 1 });
      [[0, 0, 0, 0.5], [0.45, -0.05, 0, 0.38], [-0.45, -0.05, 0.05, 0.4], [0.15, 0.2, 0, 0.36]].forEach(function (p) { mesh(new THREE.SphereGeometry(p[3], 12, 8), wolkeM, p[0], p[1] + 2.3, p[2], wolke, false); });
      var tropfen = [];
      for (var t = 0; t < 10; t++) { var tr = mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 4), new THREE.MeshBasicMaterial({ color: 0x9ad0ff }), rnd(-0.6, 0.6), rnd(0.8, 2.0), rnd(-0.3, 0.3), wolke, false); tropfen.push(tr); }
      julian.updateMatrixWorld(true);
      return { modell: modell, koerper: koerper, arme: arme, kopf: kopf, schaedel: schaedel, gesicht: gesicht, wolke: wolke, tropfen: tropfen };
    })();

    // ---------- Atome ----------
    var atomGeo = new THREE.SphereGeometry(1, 24, 18), atome = [];
    var atomMat = {};
    Object.keys(ELEMENTE).forEach(function (el) { var e = ELEMENTE[el]; atomMat[el] = std(e.farbe, { roughness: 0.3, metalness: 0.1, emissive: farbe(e.farbe), emissiveIntensity: 0.15 }); });
    function atomBauen(el) {
      var e = ELEMENTE[el], gr = new THREE.Group();
      var kugel = mesh(atomGeo, atomMat[el], 0, 0, 0, gr); kugel.scale.setScalar(e.r);
      var schrift = textSprite(el, '#ffffff', 0.95); schrift.position.y = e.r + 0.45; gr.add(schrift);
      var ring = glow(e.farbe, e.r * 4, 0.35); gr.add(ring);
      scene.add(gr);
      return { el: el, g: gr, kugel: kugel, ring: ring, x: 0, z: 0, ph: rnd(0, 6.28), lebt: true, zisch: e.reaktiv ? rnd(9, 14) / e.reaktiv : 0, vx: 0, vz: 0 };
    }
    function atomWeg(a) { a.lebt = false; scene.remove(a.g); a.g.children.forEach(function (c) { if (c.material && c.material.map && c.isSprite && c !== a.ring) c.material.map.dispose(); }); }
    function freierPlatz() {
      for (var n = 0; n < 40; n++) {
        var w = rnd(0, Math.PI * 2), r = Math.sqrt(Math.random()) * (R - 2), x = Math.cos(w) * r, z = Math.sin(w) * r;
        if (Math.hypot(x - g.x, z - g.z) > 7) return [x, z];
      }
      return [0, 0];
    }
    function atomSetzen(el) { var a = atomBauen(el), p = freierPlatz(); a.x = p[0]; a.z = p[1]; atome.push(a); return a; }
    function erlaubteElemente() {
      var els = {};
      MOLEKUELE.forEach(function (m) { if (m.stufe <= stufe()) Object.keys(m.a).forEach(function (e) { els[e] = 1; }); });
      return Object.keys(els);
    }
    function atomeAuffuellen() {
      var bedarf = g.auftrag.m.a, zaehl = {};
      atome.forEach(function (a) { if (a.lebt) zaehl[a.el] = (zaehl[a.el] || 0) + 1; });
      Object.keys(bedarf).forEach(function (el) {
        var fehlt = bedarf[el] - (g.auftrag.hat[el] || 0) + 1 - (zaehl[el] || 0);
        for (var k = 0; k < fehlt; k++) { atomSetzen(el); zaehl[el] = (zaehl[el] || 0) + 1; }
      });
      var gesamt = atome.filter(function (a) { return a.lebt; }).length, els = erlaubteElemente();
      while (gesamt < 14 + stufe() * 2) { atomSetzen(pick(els)); gesamt++; }
    }

    // Ashley: das Herz, dem Julian hinterherschwimmt
    var exium = (function () {
      var gr = new THREE.Group(); gr.visible = false; scene.add(gr);
      var herzM = std('#ff5ab8', { emissive: farbe('#ff3aa0'), emissiveIntensity: 0.5, roughness: 0.3 });
      var herz = new THREE.Group(); gr.add(herz);
      mesh(new THREE.SphereGeometry(0.42, 18, 12), herzM, -0.3, 0.2, 0, herz); mesh(new THREE.SphereGeometry(0.42, 18, 12), herzM, 0.3, 0.2, 0, herz);
      var spitze = mesh(new THREE.ConeGeometry(0.58, 0.85, 18), herzM, 0, -0.32, 0, herz); spitze.rotation.z = Math.PI;
      var schrift = textSprite('Ashley', '#ffd0f0', 0.75); schrift.position.y = 1.15; gr.add(schrift);
      var schein = glow('#ff5ab8', 4, 0.5); gr.add(schein);
      return { g: gr, herz: herz, aktiv: false, x: 0, z: 0, t: 0, naechstes: rnd(16, 24) };
    })();

    // Molekül-Modell, das nach dem Bauen aufsteigt
    var molekuele = [];
    function molekuelZeigen(m) {
      var gr = new THREE.Group(), liste = [];
      Object.keys(m.a).forEach(function (el) { for (var k = 0; k < m.a[el]; k++) liste.push(el); });
      liste.sort(function (a, b) { return ELEMENTE[b].r - ELEMENTE[a].r; });
      var mitte = liste[0], rest = liste.slice(1);
      var m0 = mesh(atomGeo, atomMat[mitte], 0, 0, 0, gr); m0.scale.setScalar(ELEMENTE[mitte].r);
      rest.forEach(function (el, i) {
        var phi = Math.acos(1 - 2 * (i + 0.5) / rest.length), th = Math.PI * (1 + Math.sqrt(5)) * i, d = ELEMENTE[mitte].r + ELEMENTE[el].r + 0.25;
        var dir = new THREE.Vector3(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th));
        if (rest.length === 1) dir.set(1, 0, 0);
        var a = mesh(atomGeo, atomMat[el], dir.x * d, dir.y * d, dir.z * d, gr); a.scale.setScalar(ELEMENTE[el].r);
        var st = mesh(new THREE.CylinderGeometry(0.08, 0.08, d, 8), std('#d8dce0', { roughness: 0.4 }), dir.x * d / 2, dir.y * d / 2, dir.z * d / 2, gr);
        st.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      });
      gr.position.set(g.x, 1.2, g.z); scene.add(gr);
      var gl = glow('#39ff88', 6, 0.9); gr.add(gl);
      molekuele.push({ g: gr, t: 0 });
    }

    // Partikel: Spritzer, Funken, Formeln
    var spritzer = [];
    for (var sp = 0; sp < 70; sp++) { var s = glow('#d8fff0', 0.5, 0.7, false); s.visible = false; scene.add(s); spritzer.push({ s: s, v: new THREE.Vector3(), t: 0, life: 0 }); }
    var si = 0;
    function spritz(x, y, z, n, kraft, hex, gr) {
      for (var k = 0; k < n; k++) {
        var q = spritzer[si++ % spritzer.length];
        q.s.position.set(x + rnd(-0.3, 0.3), y, z + rnd(-0.3, 0.3)); q.v.set(rnd(-1, 1) * kraft, rnd(1.5, 3.5) * kraft * 0.7, rnd(-1, 1) * kraft);
        q.t = 0; q.life = rnd(0.5, 0.9); q.gr = gr || rnd(0.25, 0.5); q.s.material.color.copy(farbe(hex || '#d8fff0')); q.s.visible = true;
      }
    }
    var formelSprites = [];
    for (var fs = 0; fs < 10; fs++) { var f = textSprite(pick(FORMELN), pick(['#ff7af0', '#ffe14a', '#39ff88', '#7ad0ff']), 1.1); f.visible = false; scene.add(f); formelSprites.push({ s: f, t: 0, life: 0 }); }
    var orbit = []; // gesammelte Atome kreisen um Julian
    var orbitGeo = atomGeo;

    // ---------- Zustand ----------
    var g;
    function stufe() { return clamp(Math.floor(g.anzahl / 3), 0, 3); }
    function reset() {
      atome.forEach(atomWeg); atome.length = 0;
      orbit.forEach(function (o) { scene.remove(o); }); orbit.length = 0;
      molekuele.forEach(function (m) { scene.remove(m.g); }); molekuele.length = 0;
      g = {
        modus: 'intro', t: 0, x: 0, z: 8, h: 0, v: 0, kx: 0, kz: 0, letzte: null, schlagT: 0, armT: [-1, -1], paddel: 0,
        zeit: 45, punkte: 0, anzahl: 0, knalle: 0, trauerAnz: 0, trauer: 0, wahn: 0, eureka: 0, hue: 0, glasT: 0, falschT: 0, spruchT: 6, ende: false, auftrag: null
      };
      exium.aktiv = false; exium.g.visible = false; exium.naechstes = rnd(16, 24);
      neuerAuftrag(true);
    }
    function neuerAuftrag(erstes) {
      var pool = MOLEKUELE.filter(function (m) { return m.stufe <= stufe() && (!g.auftrag || m !== g.auftrag.m); });
      if (erstes) pool = [MOLEKUELE[2]];
      var neu = pool.filter(function (m) { return m.stufe === stufe(); });
      var m = Math.random() < 0.6 && neu.length ? pick(neu) : pick(pool);
      g.auftrag = { m: m, hat: {} };
      $('formel').innerHTML = m.f; $('mname').textContent = m.name;
      slotsZeichnen();
      atomeAuffuellen();
    }
    function slotsZeichnen() {
      var m = g.auftrag.m, html = '';
      Object.keys(m.a).forEach(function (el) {
        for (var k = 0; k < m.a[el]; k++) {
          var voll = k < (g.auftrag.hat[el] || 0), e = ELEMENTE[el];
          html += '<i class="' + (voll ? 'voll' : '') + '" style="' + (voll ? 'background:' + e.farbe + ';color:' + (e.dunkel ? '#111' : '#fff') : '') + '">' + el + '</i>';
        }
      });
      $('slots').innerHTML = html;
    }
    var meldT = 0;
    function melde(txt, klein, art) {
      var el = $('meldung'); el.className = 'jn-meldung' + (art ? ' ' + art : ''); el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen');
      clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1800);
    }
    var blaseEl = $('blase'), blaseT = 0;
    function sag(txt, traurig) { blaseEl.textContent = txt; blaseEl.classList.toggle('traurig', !!traurig); blaseEl.style.opacity = 1; blaseT = 2.2; }
    function mult() { return g.eureka > 0 ? 3 : g.wahn >= 66 ? 2 : g.wahn >= 33 ? 1.5 : 1; }

    function einsammeln(a) {
      var m = g.auftrag.m, braucht = (m.a[a.el] || 0) - (g.auftrag.hat[a.el] || 0);
      if (braucht <= 0) {
        // falsches Atom: abprallen
        var dx = g.x - a.x, dz = g.z - a.z, d = Math.hypot(dx, dz) || 1;
        g.kx += dx / d * 5; g.kz += dz / d * 5; a.vx -= dx / d * 3; a.vz -= dz / d * 3;
        if (g.t - g.falschT > 1.2) { g.falschT = g.t; melde('Brauch ich nicht!', ELEMENTE[a.el].name + ' passt nicht in ' + m.name.replace(/<[^>]+>/g, ''), 'rot'); Pixel.sfx.tone(180, 0.12, 'square', 0.05, 120); }
        return;
      }
      g.auftrag.hat[a.el] = (g.auftrag.hat[a.el] || 0) + 1;
      atomWeg(a);
      var o = mesh(orbitGeo, atomMat[a.el], 0, 0, 0, null, false); o.scale.setScalar(ELEMENTE[a.el].r * 0.55); scene.add(o); orbit.push(o);
      spritz(a.x, 0.3, a.z, 6, 1, ELEMENTE[a.el].farbe);
      Pixel.sfx.tone(660 + orbit.length * 90, 0.07, 'triangle', 0.06);
      slotsZeichnen();
      var fertig = Object.keys(m.a).every(function (el) { return (g.auftrag.hat[el] || 0) >= m.a[el]; });
      if (fertig) synthese();
    }
    function synthese() {
      var m = g.auftrag.m, atomzahl = Object.keys(m.a).reduce(function (s, el) { return s + m.a[el]; }, 0);
      var p = Math.round(50 * atomzahl * mult());
      g.punkte += p; g.anzahl++;
      g.zeit = Math.min(60, g.zeit + 3 + atomzahl * 1.6);
      if (g.eureka <= 0) g.wahn = Math.min(100, g.wahn + 17);
      orbit.forEach(function (o) { scene.remove(o); }); orbit.length = 0;
      molekuelZeigen(m);
      melde(m.f + ' synthetisiert! +' + p, m.fakt);
      Pixel.sfx.tone(523, 0.08, 'triangle', 0.07); Pixel.sfx.tone(659, 0.08, 'triangle', 0.07, null, 0.08); Pixel.sfx.tone(784, 0.08, 'triangle', 0.07, null, 0.16); Pixel.sfx.tone(1047, 0.25, 'triangle', 0.07, null, 0.24);
      if (Math.random() < 0.6) sag(pick(SPRUECHE));
      if (g.wahn >= 100 && g.eureka <= 0) {
        g.eureka = 7; melde('EUREKA!!!', 'Komplett durchgedreht: Atome fliegen zu dir, Punkte ×3', 'pink');
        Pixel.sfx.tone(392, 0.1, 'square', 0.06); Pixel.sfx.tone(523, 0.1, 'square', 0.06, null, 0.1); Pixel.sfx.tone(659, 0.1, 'square', 0.06, null, 0.2); Pixel.sfx.tone(1047, 0.4, 'square', 0.06, null, 0.3);
      }
      neuerAuftrag();
    }
    function knall(a) {
      var e = ELEMENTE[a.el], kraft = e.reaktiv;
      spritz(a.x, 0.4, a.z, 22, 2.4 * kraft, '#ffd27a'); spritz(a.x, 0.4, a.z, 12, 1.4 * kraft, '#ffffff');
      var fl = glow('#ffb04a', 8 * kraft, 1); fl.position.set(a.x, 1, a.z); scene.add(fl); blitze.push({ s: fl, t: 0 });
      Pixel.sfx.noise(0.45, 0.32, 220); Pixel.sfx.tone(110, 0.3, 'sawtooth', 0.05, 40);
      var dx = g.x - a.x, dz = g.z - a.z, d = Math.hypot(dx, dz);
      if (d < 9 * kraft && g.modus === 'spiel') {
        var stoss = (1 - d / (9 * kraft)) * 14 * kraft;
        g.kx += dx / (d || 1) * stoss; g.kz += dz / (d || 1) * stoss; g.knalle++;
        if (g.eureka <= 0) g.wahn = Math.min(100, g.wahn + 6);
        melde(e.name + ' + Wasser = BUMM!', 'Alkalimetalle reagieren heftig mit Wasser.', 'rot');
      }
      atomWeg(a);
    }
    var blitze = [];

    // ---------- Eingabe ----------
    var CODES = { KeyA: 'l', ArrowLeft: 'l', KeyD: 'r', ArrowRight: 'r' };
    function schlag(seite) {
      if (g.modus !== 'spiel' || g.trauer > 0) return;
      if (g.t - g.schlagT < 0.12) return;
      g.schlagT = g.t;
      var gut = g.letzte !== seite;
      g.v = Math.min(11, g.v + (gut ? 2.7 : 1.1));
      g.h += (seite === 'l' ? -1 : 1) * (gut ? 0.07 : 0.32);
      g.letzte = seite;
      var arm = seite === 'l' ? 0 : 1; g.armT[arm] = 0;
      var hx = g.x + Math.sin(g.h) * 0.6 + (seite === 'l' ? -0.4 : 0.4) * Math.cos(g.h), hz = g.z - Math.cos(g.h) * 0.6 + (seite === 'l' ? -0.4 : 0.4) * Math.sin(g.h);
      spritz(hx, 0.2, hz, 3, 0.7);
      Pixel.sfx.noise(0.05, gut ? 0.07 : 0.04, gut ? 1600 : 1000);
    }
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel' && (e.key === 'Enter' || e.key === ' ')) { var b = ebene.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } return; }
      var t = CODES[e.code] || ({ a: 'l', arrowleft: 'l', d: 'r', arrowright: 'r' })[(e.key || '').toLowerCase()];
      if (t) { e.preventDefault(); if (!e.repeat) schlag(t); }
    }
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-pad]'); if (!b) return; e.preventDefault();
      schlag(b.getAttribute('data-pad')); b.classList.add('gedrueckt'); setTimeout(function () { b.classList.remove('gedrueckt'); }, 110);
    });
    pad.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    // Auf dem Spielfeld: linke/rechte Bildschirmhälfte antippen
    canvas.addEventListener('pointerdown', function (e) {
      if (g.modus !== 'spiel') return;
      e.preventDefault(); var r = box.getBoundingClientRect(); schlag(e.clientX - r.left < r.width / 2 ? 'l' : 'r');
    });
    function touchAn() { pad.classList.add('an'); $('tipp').textContent = 'Links / rechts abwechselnd tippen = kraulen'; }
    if (window.matchMedia && matchMedia('(pointer: coarse)').matches) touchAn();

    // ---------- Nachbearbeitung ----------
    var composer = null;
    if (THREE.EffectComposer && THREE.RenderPass && THREE.UnrealBloomPass && THREE.ShaderPass) {
      try {
        var rt = new THREE.WebGLRenderTarget(1, 1, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
        rt.texture.encoding = THREE.sRGBEncoding;
        composer = new THREE.EffectComposer(renderer, rt);
        composer.addPass(new THREE.RenderPass(scene, cam));
        composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(256, 256), 0.38, 0.45, 0.93));
        composer.addPass(new THREE.ShaderPass({
          uniforms: { tDiffuse: { value: null }, uWahn: { value: 0 }, uT: { value: 0 } },
          vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
          fragmentShader: [
            'uniform sampler2D tDiffuse; uniform float uWahn, uT; varying vec2 vUv;',
            'void main(){ vec2 d = vUv-0.5; vec2 off = d*uWahn*0.012*(1.0+sin(uT*3.0));',
            ' vec3 c = vec3(texture2D(tDiffuse, vUv+off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv-off).b);',
            ' c *= 1.0 - smoothstep(0.25,0.85,dot(d,d))*0.4; gl_FragColor = vec4(c,1.0); }'
          ].join('\n')
        }));
        composer.gradePass = composer.passes[2];
      } catch (e) { composer = null; }
    }
    function resize() {
      var w = box.clientWidth, h = box.clientHeight;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.fov = h > w ? 70 : 58; cam.updateProjectionMatrix();
      if (composer) { composer.setPixelRatio(dpr); composer.setSize(w, h); }
    }

    // ---------- Physik ----------
    function physik(dt) {
      var spiel = g.modus === 'spiel';
      g.t += dt;
      // Schwimmen
      g.v *= Math.exp(-dt * (g.trauer > 0 ? 2.2 : 0.95));
      g.x += (Math.sin(g.h) * g.v + g.kx) * dt; g.z += (-Math.cos(g.h) * g.v + g.kz) * dt;
      g.kx *= Math.exp(-dt * 2.2); g.kz *= Math.exp(-dt * 2.2);
      var r = Math.hypot(g.x, g.z);
      if (r > R) {
        g.x *= R / r; g.z *= R / r; g.v *= 0.5;
        var nx = g.x / R, nz = g.z / R, dotk = g.kx * nx + g.kz * nz; if (dotk > 0) { g.kx -= 2 * dotk * nx; g.kz -= 2 * dotk * nz; }
        if (spiel && g.t - g.glasT > 0.8) { g.glasT = g.t; Pixel.sfx.tone(880, 0.25, 'sine', 0.05); Pixel.sfx.tone(1320, 0.2, 'sine', 0.025); }
      }
      if (!spiel) { if (g.modus === 'intro') { g.h += dt * 0.25; g.v = 2.2; } return; }
      g.zeit -= dt * (1 + stufe() * 0.12);
      if (g.zeit <= 0) { g.zeit = 0; ende(); return; }
      // Durchdrehen
      if (g.eureka > 0) { g.eureka -= dt; g.wahn = 100; if (g.eureka <= 0) g.wahn = 45; }
      else g.wahn = Math.max(0, g.wahn - dt * 0.55);
      if (g.wahn > 25 || g.eureka > 0) g.hue += dt * (g.wahn / 100) * (g.eureka > 0 ? 3 : 0.9);
      else g.hue = winkel(g.hue) * Math.exp(-dt * 0.8);
      g.spruchT -= dt;
      if (g.spruchT <= 0 && g.wahn > 40 && g.trauer <= 0) { g.spruchT = rnd(6, 10); sag(pick(SPRUECHE)); }
      // Atome
      for (var n = atome.length - 1; n >= 0; n--) {
        var a = atome[n];
        if (!a.lebt) { atome.splice(n, 1); continue; }
        a.x += a.vx * dt; a.z += a.vz * dt; a.vx *= Math.exp(-dt * 1.5); a.vz *= Math.exp(-dt * 1.5);
        a.x += Math.sin(g.t * 0.3 + a.ph) * 0.25 * dt; a.z += Math.cos(g.t * 0.27 + a.ph) * 0.25 * dt;
        var ra = Math.hypot(a.x, a.z); if (ra > R - 1) { a.x *= (R - 1) / ra; a.z *= (R - 1) / ra; }
        if (g.eureka > 0 && (g.auftrag.m.a[a.el] || 0) > (g.auftrag.hat[a.el] || 0)) { var ex = g.x - a.x, ez = g.z - a.z, el = Math.hypot(ex, ez) || 1; a.x += ex / el * 7 * dt; a.z += ez / el * 7 * dt; }
        if (a.zisch > 0) { a.zisch -= dt; if (a.zisch <= 0) { knall(a); continue; } }
        if (g.trauer <= 0 && Math.hypot(g.x - a.x, g.z - a.z) < 0.9 + ELEMENTE[a.el].r) einsammeln(a);
      }
      if (g.t % 1 < dt) atomeAuffuellen();
      // Ashley
      if (!exium.aktiv) {
        exium.naechstes -= dt;
        if (exium.naechstes <= 0 && g.trauer <= 0) { var p = freierPlatz(); exium.x = p[0]; exium.z = p[1]; exium.t = 0; exium.aktiv = true; exium.g.visible = true; melde('Oh nein … Ashley!', 'Halbwertszeit: ewig. Nicht hinschwimmen!', 'pink'); }
      } else {
        exium.t += dt;
        exium.x += Math.sin(g.t * 0.5) * 1.4 * dt; exium.z += Math.cos(g.t * 0.43) * 1.4 * dt;
        var re = Math.hypot(exium.x, exium.z); if (re > R - 2) { exium.x *= (R - 2) / re; exium.z *= (R - 2) / re; }
        var dx = exium.x - g.x, dz = exium.z - g.z, d = Math.hypot(dx, dz);
        if (d < 11 && g.trauer <= 0) { var zug = (1 - d / 11) * 6.5 + 1.2; g.x += dx / d * zug * dt; g.z += dz / d * zug * dt; }
        if (d < 1.5 && g.trauer <= 0) {
          g.trauer = 3.2; g.trauerAnz++; g.v = 0.5; g.wahn = Math.max(0, g.wahn - 25); g.eureka = 0;
          exium.aktiv = false; exium.g.visible = false; exium.naechstes = rnd(18, 28);
          spritz(exium.x, 0.6, exium.z, 14, 1.2, '#ff5ab8');
          sag(pick(TRAUER), true);
          Pixel.sfx.tone(392, 0.4, 'triangle', 0.05, 370); Pixel.sfx.tone(330, 0.4, 'triangle', 0.05, 311, 0.4); Pixel.sfx.tone(262, 0.8, 'triangle', 0.05, 247, 0.8);
        } else if (exium.t > 16) { exium.aktiv = false; exium.g.visible = false; exium.naechstes = rnd(16, 26); }
      }
      if (g.trauer > 0) { g.trauer -= dt; if (g.trauer <= 0) sag('… okay. Weiter. Chemie.'); }
    }

    // ---------- Darstellung ----------
    var blick = new THREE.Vector3(), blickS = new THREE.Vector3(), cam3 = { yaw: 0, init: false }, kopfW = new THREE.Vector3(), proj = new THREE.Vector3();
    function darstellen(dt) {
      var spiel = g.modus === 'spiel';
      wasserU.uT.value = g.t; wasserU.uHue.value = g.hue; wasserU.uKam.value.copy(cam.position);
      // Julian
      var wy = Math.sin(g.t * 1.6 + g.x * 0.35) * 0.12;
      julian.position.set(g.x, wy - 0.05, g.z); julian.rotation.y = -g.h;
      J.koerper.rotation.z = Math.sin(g.t * 2.2) * 0.05 + (g.letzte === 'l' ? 0.04 : -0.04);
      for (var k = 0; k < 2; k++) {
        var arm = J.arme[k];
        if (g.armT[k] >= 0) { g.armT[k] += dt / 0.45; var p = Math.min(1, g.armT[k]); arm.rotation.x = -p * Math.PI * 2; if (g.armT[k] >= 1) g.armT[k] = -1; }
        else arm.rotation.x = lerp(arm.rotation.x % (Math.PI * 2), Math.sin(g.t * 3 + k * Math.PI) * 0.35 - 0.3, daempf(dt, 6));
        arm.rotation.z = (k ? -1 : 1) * 0.25;
      }
      var traurig = g.trauer > 0;
      J.schaedel.material.map = traurig ? J.gesicht.traurig : J.gesicht.irre;
      J.kopf.rotation.z = traurig ? 0.25 : Math.sin(g.t * (g.wahn > 50 ? 9 : 2)) * (0.04 + g.wahn * 0.0012);
      J.wolke.visible = traurig;
      if (traurig) J.tropfen.forEach(function (tr) { tr.position.y -= dt * 3; if (tr.position.y < 0.6) tr.position.y = 2.1; });
      // Atome wippen
      atome.forEach(function (a) {
        if (!a.lebt) return;
        a.g.position.set(a.x, ELEMENTE[a.el].r * 0.75 + 0.15 + Math.sin(g.t * 2 + a.ph) * 0.1, a.z); a.kugel.rotation.y += dt;
        var gebraucht = (g.auftrag.m.a[a.el] || 0) > (g.auftrag.hat[a.el] || 0);
        a.ring.material.opacity = gebraucht ? 0.35 + Math.sin(g.t * 5) * 0.15 : 0.08;
        if (a.zisch > 0 && a.zisch < 4) { a.g.position.x += rnd(-0.06, 0.06); if (Math.random() < 0.3) spritz(a.x, 0.5, a.z, 1, 0.6, '#ffd27a', 0.2); }
      });
      // gesammelte Atome kreisen um den Kopf
      orbit.forEach(function (o, i) { var w = g.t * 3 + i / orbit.length * Math.PI * 2; o.position.set(g.x + Math.cos(w) * 1.1, 1.3 + Math.sin(w * 2) * 0.1, g.z + Math.sin(w) * 1.1); });
      // Ashley
      if (exium.aktiv) { exium.g.position.set(exium.x, 0.6 + Math.sin(g.t * 3) * 0.15, exium.z); var pu = 1 + Math.sin(g.t * 6) * 0.08; exium.herz.scale.setScalar(pu); exium.herz.rotation.y += dt * 1.5; }
      // fertige Moleküle steigen auf
      for (var n = molekuele.length - 1; n >= 0; n--) { var mo = molekuele[n]; mo.t += dt; mo.g.position.y += dt * 2.2; mo.g.rotation.y += dt * 2; mo.g.scale.setScalar(Math.min(1, mo.t * 3) * (mo.t > 1.6 ? Math.max(0, 1 - (mo.t - 1.6) * 2) : 1)); if (mo.t > 2.1) { scene.remove(mo.g); molekuele.splice(n, 1); } }
      for (n = blitze.length - 1; n >= 0; n--) { var bl = blitze[n]; bl.t += dt; bl.s.material.opacity = Math.max(0, 1 - bl.t * 2.5); if (bl.t > 0.4) { scene.remove(bl.s); bl.s.material.dispose(); blitze.splice(n, 1); } }
      spritzer.forEach(function (q) {
        if (!q.s.visible) return;
        q.t += dt; if (q.t > q.life) { q.s.visible = false; return; }
        q.v.y -= 9 * dt; q.s.position.addScaledVector(q.v, dt); q.s.scale.setScalar(q.gr * (1 - q.t / q.life * 0.5));
        if (q.s.position.y < 0) q.s.visible = false;
      });
      // durchgedrehte Formeln
      formelSprites.forEach(function (f) {
        if (f.s.visible) { f.t += dt; f.s.position.y += dt * 1.5; f.s.material.opacity = Math.max(0, 1 - f.t / f.life); if (f.t > f.life) f.s.visible = false; }
        else if (spiel && g.wahn > 30 && Math.random() < dt * g.wahn / 120) {
          var w = rnd(0, 6.28), rr = rnd(3, 12); f.s.position.set(clamp(g.x + Math.cos(w) * rr, -R, R), 0.5, clamp(g.z + Math.sin(w) * rr, -R, R)); f.t = 0; f.life = rnd(1.6, 2.6); f.s.visible = true;
        }
      });
      flamme.scale.set(1 + Math.sin(g.t * 17) * 0.05, 1 + Math.sin(g.t * 11) * 0.08, 1); flammeGlow.material.opacity = 0.6 + Math.sin(g.t * 13) * 0.1;
      // Kamera folgt hinter Julian
      if (spiel || g.modus === 'ende') {
        if (!cam3.init) { cam3.yaw = g.h; blickS.set(g.x, 0.5, g.z); cam3.init = true; }
        cam3.yaw += winkel(g.h - cam3.yaw) * daempf(dt, 3);
        var hoch = box.clientHeight > box.clientWidth, dist = hoch ? 8 : 6.5;
        cam.position.set(g.x - Math.sin(cam3.yaw) * dist, hoch ? 4.6 : 3.6, g.z + Math.cos(cam3.yaw) * dist);
        var cr = Math.hypot(cam.position.x, cam.position.z);
        if (cr > GLAS - 1.5) { cam.position.x *= (GLAS - 1.5) / cr; cam.position.z *= (GLAS - 1.5) / cr; cam.position.y += (cr - GLAS + 1.5) * 0.6; }
        blick.set(g.x + Math.sin(cam3.yaw) * 4, 0.4, g.z - Math.cos(cam3.yaw) * 4);
        blickS.lerp(blick, daempf(dt, 8));
        cam.lookAt(blickS);
        cam.rotation.z += Math.sin(g.t * 1.7) * g.wahn * 0.0006 + (g.eureka > 0 ? Math.sin(g.t * 9) * 0.02 : 0);
      } else {
        var hochI = box.clientHeight > box.clientWidth, rr = hochI ? 5.2 : 4, wi = g.h + 0.55;
        var hx = g.x + Math.sin(g.h) * 0.6, hz = g.z - Math.cos(g.h) * 0.6;
        cam.position.set(hx + Math.sin(wi) * rr, 1.5, hz - Math.cos(wi) * rr);
        blick.set(hx, hochI ? -0.5 : 0.6, hz);
        if (box.clientWidth >= 900 && box.clientWidth > box.clientHeight) { var fx = hx - cam.position.x, fz = hz - cam.position.z, l = Math.hypot(fx, fz); blick.x += fz / l * 1.6; blick.z -= fx / l * 1.6; }
        cam.lookAt(blick);
      }
      if (composer && composer.gradePass) { composer.gradePass.uniforms.uWahn.value = g.wahn / 100; composer.gradePass.uniforms.uT.value = g.t; }
      // Sprechblase
      if (blaseT > 0) {
        blaseT -= dt;
        J.kopf.getWorldPosition(kopfW); proj.copy(kopfW); proj.y += 0.9; proj.project(cam);
        blaseEl.style.left = ((proj.x + 1) / 2 * box.clientWidth) + 'px'; blaseEl.style.top = ((1 - proj.y) / 2 * box.clientHeight) + 'px';
        if (blaseT <= 0) blaseEl.style.opacity = 0;
      }
      // HUD
      if (spiel) {
        $('punkte').textContent = g.punkte.toLocaleString('de-DE');
        $('anzahl').textContent = g.anzahl + (g.anzahl === 1 ? ' Molekül' : ' Moleküle');
        $('zeit').style.width = Math.min(100, g.zeit / 60 * 100) + '%'; $('zeitBox').classList.toggle('knapp', g.zeit < 10);
        $('wahn').style.width = g.wahn + '%';
        $('wahnTxt').textContent = g.eureka > 0 ? 'EUREKA ×3' : g.wahn >= 66 ? 'komplett durchgedreht ×2' : g.wahn >= 33 ? 'leicht verrückt ×1,5' : 'noch normal';
        $('wahnBox').classList.toggle('eureka', g.eureka > 0);
        if (g.t > 12) $('tipp').style.opacity = 0;
      }
    }
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
    function kachel() {
      return '<div class="jn-kachel"><span class="nr">7</span><span class="sym">Ju</span><span class="nm">Julian</span><span class="ms">Wahnsinn: ∞</span></div>';
    }
    function intro() {
      ebene.classList.remove('aus');
      var best = +Pixel.get(BEST_KEY, 0);
      ebene.innerHTML =
        '<div class="jn-karte"><div class="jn-kopf">' + kachel() + '<div><h1>Julian im<br>Reagenzbecken</h1><div class="unter">Geschrumpft, im Becherglas, viel zu tief in der Chemie.</div></div></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best.toLocaleString('de-DE') + '</b></div>' : '') +
        '<ul><li>🏊 Kraulen: <b>A</b> und <b>D</b> (oder ← →) abwechselnd. Eine Seite mehrmals = Kurve.</li>' +
        '<li>⚛️ Sammle die Atome für das Molekül oben – jedes Molekül gibt Punkte und Zeit.</li>' +
        '<li>💥 Natrium und Kalium zischen und knallen im Wasser. Schnell sein!</li>' +
        '<li>💔 Vorsicht vor <b>Ashley</b> – Julian kann nicht anders, als hinterherzuschwimmen.</li>' +
        '<li>🤪 Das Durchdreh-Meter steigt mit jedem Molekül. Voll = EUREKA!</li></ul>' +
        '<button class="jn-btn" data-act="los">Ab ins Becherglas!</button></div>';
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.ende) reset();
      g.modus = 'spiel'; g.ende = false; g.v = 0; g.h = 0; g.x = 0; g.z = 8; cam3.init = false;
      ebene.classList.add('aus'); hud.classList.add('an'); $('tipp').style.opacity = 0.95;
      sag('Zeit für Wissenschaft!!');
      Pixel.sfx.tone(523, 0.1, 'triangle', 0.06); Pixel.sfx.tone(784, 0.1, 'triangle', 0.06, null, 0.1); Pixel.sfx.tone(1047, 0.25, 'triangle', 0.06, null, 0.2);
    }
    function ende() {
      if (g.modus !== 'spiel') return;
      g.modus = 'ende'; g.ende = true; hud.classList.remove('an');
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best;
      if (neu) Pixel.set(BEST_KEY, g.punkte);
      Pixel.sfx.tone(392, 0.25, 'triangle', 0.06, 196); Pixel.sfx.tone(262, 0.5, 'triangle', 0.06, 130, 0.25);
      setTimeout(function () {
        if (!alive) return;
        ebene.classList.remove('aus');
        ebene.innerHTML =
          '<div class="jn-karte"><div class="jn-kopf">' + kachel() + '<div><h1>Reaktion<br>beendet!</h1><div class="unter">Die Zeit ist um. Julian redet trotzdem weiter über Chemie.</div></div></div>' +
          '<div class="zeile"><span>Punkte</span><b>' + g.punkte.toLocaleString('de-DE') + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Moleküle</span><b>' + g.anzahl + '</b></div>' +
          '<div class="zeile"><span>Explosionen abbekommen</span><b>' + g.knalle + '</b></div>' +
          '<div class="zeile"><span>Trauerphasen wegen Ashley</span><b>' + g.trauerAnz + '</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte).toLocaleString('de-DE') + '</b></div>' +
          '<button class="jn-btn" data-act="los">Nochmal reinspringen</button>' +
          '<button class="jn-btn zweit" data-act="exit">Menü</button></div>';
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
      alive = false; cancelAnimationFrame(raf); clearTimeout(meldT);
      window.removeEventListener('keydown', kd); window.removeEventListener('resize', resize);
      window.removeEventListener('touchstart', touchAn);
      root.removeEventListener('click', onClick);
      scene.traverse(function (o) {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); });
      });
      J.gesicht.irre.dispose(); J.gesicht.traurig.dispose();
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch (e) {}
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('resize', resize);
    window.addEventListener('touchstart', touchAn, { passive: true });
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__julian = { g: function () { return g; }, atome: atome, schlag: schlag, exium: exium, renderer: renderer };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.julian = { start: start };
})();
