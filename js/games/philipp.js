// Philipp: Lernt nie (angeblich) – 2D-Pixel-Spiel.
// Philipp behauptet, er lernt nie. In Wahrheit lernt er heimlich – aber nur, solange keiner der Jungs guckt.
// Lernen: Leertaste/W/↑ halten (oder LERNEN gedrückt halten) · Wenn einer rüberschaut: loslassen und chillen!
// „Digga!“-Pose (E) poliert das Image, wenn gerade jemand guckt · Fragen: 1/2.
// Nach jeder Runde: Klassenarbeit. Note 5 oder 6 → durchgefallen. Image auf 0 → enttarnt.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.philipp.best';
  var SW0 = 180, SH0 = 140, RUNDE = 32;
  var DIGGA = ['Digga, ich lern nie.', 'Lernen? Kenn ich nicht.', 'Bro, das hab ich im Blut.', 'Ich chill nur, Bruder.', 'Was für ne Arbeit?',
    'Hab gestern nur gezockt.', 'Lowkey keinen Plan. Egal.', 'Bücher sind nur Deko.', 'Ich bin einfach so schlau, Bro.'];
  var AUSREDE = ['Das ist … ein Comic!', 'Das gehört meinem Bruder!', 'Hab ich nur gefunden!', 'Ich guck nur die Bilder an!', 'Das ist ne Unterlage, Digga!'];
  var ERWISCHT = ['Bro … LERNST du da?!', 'Sind das Karteikarten?!', 'Philipp?! Ein Buch?!', 'Wir haben das gesehen!', 'Ich wusste es!!', 'Ist das … ein Lernplan?!'];
  var GLAUBEN = ['Glauben wir dir nicht.', 'Niemals ohne Lernen.', 'Zeig mal deinen Schreibtisch!', 'Ja klar, Philipp.', 'Du lernst bestimmt massiv.'];
  var FORMELN = ['H2O', 'PI', '1789', 'A+B', 'DNA', 'X2', '3.14', 'NACL', 'E:MC2', '7X8', 'WENT', 'ATP'];
  var FRAGEN = [
    ['Was ist 7 × 8?', '56.', 'Keine Ahnung, Digga.'],
    ['Wann war die Französische Revolution?', '1789.', 'Gestern?'],
    ['Was ist H₂O?', 'Wasser.', 'Ein Energydrink?'],
    ['Hauptstadt von Australien?', 'Canberra.', 'Sydney, safe.'],
    ['Wurzel aus 144?', '12.', 'Wurzel? Bin ich Gärtner?'],
    ['Simple Past von „go“?', 'went.', 'goed, Bro.'],
    ['Wie viele Bundesländer hat Deutschland?', '16.', 'So … sieben?'],
    ['Was macht die Mitochondrie?', 'Energie für die Zelle.', 'Die Mito-was?']
  ];
  var MAMA = [['Hast du für morgen gelernt, Schatz?', 'Ja, drei Stunden.', 'Nö Mama, chill.'], ['Soll ich dich nachher abfragen?', 'Gern, Kapitel 4 bis 7.', 'Brauch ich nicht.']];
  var SZENEN = [
    { id: 'bus', kurz: 'BUS', name: 'Schulbus', frager: 'Mama (Sprachnachricht)', mama: true },
    { id: 'klasse', kurz: 'KLASSE', name: 'Klassenzimmer', frager: 'Lehrerin' },
    { id: 'mensa', kurz: 'MENSA', name: 'Mensa', frager: 'Lehrer' },
    { id: 'zimmer', kurz: 'CALL', name: 'Discord-Call', frager: 'Mama (durch die Tür)', mama: true, call: true }
  ];
  var SLOTS = [
    { x: 8, y: 34, weg: 'vorne', hin: 'rechts' }, { x: 144, y: 34, weg: 'vorne', hin: 'links' }, { x: 76, y: 8, weg: 'vorne', hin: 'runter' }
  ];
  var CALL_SLOTS = [
    { x: 34, y: 10, weg: 'links', hin: 'vorne' }, { x: 76, y: 10, weg: 'rechts', hin: 'vorne' }, { x: 118, y: 10, weg: 'links', hin: 'vorne' }
  ];
  var PX = 70, PY = 44, TISCH = 92;

  var CSS = [
    '.ph{position:absolute;inset:0;overflow:hidden;background:#1a1a20;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.ph canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.ph-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.ph-top button{pointer-events:auto}',
    '.ph-hud{flex:1;display:flex;gap:8px;justify-content:center;padding:0 8px;opacity:0;transition:opacity .4s}',
    '.ph-hud.an{opacity:1}',
    '.ph-bar{width:min(34vw,200px);background:rgba(20,20,26,.85);border:3px solid #fff;padding:4px 7px 6px;box-shadow:3px 3px 0 rgba(0,0,0,.4)}',
    '.ph-bar small{display:flex;justify-content:space-between;font:8px/1 "Press Start 2P",monospace;margin-bottom:4px;gap:6px}',
    '.ph-bar div{height:10px;background:#2a2a32;border:2px solid #000}',
    '.ph-bar div span{display:block;height:100%;width:0;transition:width .1s}',
    '.ph-bar.w span{background:#4a9ae8}.ph-bar.i span{background:#e8c040}',
    '.ph-bar.i.knapp{animation:phWackel .12s infinite alternate}',
    '@keyframes phWackel{from{transform:translateX(-2px)}to{transform:translateX(2px)}}',
    '.ph-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:4px 8px;font-size:15px;white-space:nowrap;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:phPop .15s}',
    '.ph-blase.rot{background:#ffe0e0}',
    '.ph-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:inherit;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes phPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.ph-meldung{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;white-space:nowrap;z-index:19}',
    '.ph-meldung b{display:block;font:clamp(14px,4vw,24px)/1.2 "Press Start 2P",monospace;color:#e8c040;text-shadow:3px 3px 0 #000}',
    '.ph-meldung small{display:block;font-size:17px;text-shadow:2px 2px 0 #000;margin-top:8px}',
    '.ph-meldung.zeigen{animation:phMeld 1.6s ease-out}',
    '@keyframes phMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0}}',
    '.ph-frage{position:absolute;left:50%;bottom:calc(128px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:22;width:min(440px,92vw);background:#f4f2ea;color:#14141a;',
    ' border:3px solid #14141a;box-shadow:5px 5px 0 #e8c040;padding:8px 10px;display:none}',
    '.ph-frage.an{display:block;animation:phPop2 .2s}',
    '@keyframes phPop2{from{transform:translate(-50%,30px);opacity:0}}',
    '.ph-frage .wer{font:9px/1.4 "Press Start 2P",monospace;color:#a8582a}',
    '.ph-frage .was{font-size:18px;margin:4px 0 6px}',
    '.ph-frage .zeit{height:4px;background:#14141a;margin-bottom:6px}',
    '.ph-frage .knoepfe{display:flex;gap:6px}',
    '.ph-frage button{flex:1;font:16px/1.2 "Pixelify Sans",sans-serif;padding:7px 6px;border:3px solid #14141a;background:#fff;cursor:pointer}',
    '.ph-frage button:hover{background:#ffe8a0}',
    '.ph-frage button b{font:9px "Press Start 2P",monospace;margin-right:4px}',
    '.ph-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;padding:0 14px calc(14px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.ph-pad.an{display:flex}',
    '.ph-pad button{pointer-events:auto;width:100px;height:100px;border-radius:50%;border:3px solid rgba(255,255,255,.75);background:rgba(20,20,26,.5);color:#fff;',
    ' font:10px/1.3 "Press Start 2P",monospace;touch-action:none}',
    '.ph-pad button.gedrueckt{background:rgba(74,154,232,.6)}',
    '.ph-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,14,.55);z-index:40;padding:16px;overflow:auto}',
    '.ph-ovl.aus{display:none}',
    '.ph-karte{width:min(460px,100%);background:#f4f2ea;color:#14141a;border:4px solid #14141a;box-shadow:8px 8px 0 #1e4a3c;padding:16px 18px;text-align:center;margin:auto}',
    '.ph-karte h1{margin:4px 0 4px;font:clamp(16px,4.6vw,24px)/1.25 "Press Start 2P",monospace;color:#1e4a3c}',
    '.ph-karte h1.rot{color:#d83a3a}',
    '.ph-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.ph-karte canvas{position:static;width:80px;height:auto;margin:4px auto}',
    '.ph-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.ph-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(20,20,26,.3);padding:6px 0;font-size:18px}',
    '.ph-karte .zeile b{font:12px/1.5 "Press Start 2P",monospace;color:#1e4a3c}',
    '.ph-karte .note{display:inline-block;font:48px/1 "Press Start 2P",monospace;color:#d83a3a;border:5px solid #d83a3a;border-radius:50%;width:92px;height:92px;line-height:88px;margin:6px auto;transform:rotate(-8deg)}',
    '.ph-karte .zitat{font-size:18px;margin:4px 0}',
    '.ph-karte .zitat i{color:#666}',
    '.ph-karte .px-btn{width:100%;margin-top:8px}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function note(w) { return w >= 85 ? 1 : w >= 70 ? 2 : w >= 55 ? 3 : w >= 40 ? 4 : w >= 25 ? 5 : 6; }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="ph"><canvas></canvas>' +
      '<div class="ph-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="ph-hud" data-el="hud">' +
          '<div class="ph-bar w"><small><span>WISSEN</span><span data-el="zeit">32S</span></small><div><span data-el="wissen"></span></div></div>' +
          '<div class="ph-bar i" data-el="imageBox"><small><span>IMAGE</span><span data-el="ort">BUS</span></small><div><span data-el="image"></span></div></div>' +
        '</div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="ph-meldung" data-el="meldung"></div>' +
      '<div class="ph-frage" data-el="frage"></div>' +
      '<div class="ph-pad"><button data-pad="digga" aria-label="Digga-Pose">DIGGA!</button><button data-pad="lernen" aria-label="Lernen (halten)">LERNEN<br>(HALTEN)</button></div>' +
      '<div class="ph-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.ph'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), frageEl = $('frage'), pad = root.querySelector('.ph-pad'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now(), meldT = 0;
    var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    if (touch) pad.classList.add('an');

    // ---------- Layout ----------
    var S = 3, IW = 0, IH = 0, OX = 0, OY = 0;
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight;
      S = Math.max(2, Math.floor(Math.min(SW / 130, (SH - 60) / 150)));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      OX = Math.floor((IW - SW0) / 2);
      OY = Math.max(Math.ceil(70 / S), Math.floor((IH - SH0) / 2) - (touch ? Math.round(40 / S) : 0));
      OY = Math.min(OY, Math.max(0, IH - SH0));
    }

    // auf schmalen Bildschirmen rücken die Jungs links/rechts näher ran
    function sx(s) { return s === SLOTS[0] ? Math.max(s.x, -OX + 2) : s === SLOTS[1] ? Math.min(s.x, IW - OX - 30) : s.x; }

    // ---------- Zustand ----------
    var g;
    function neueJungs(call) {
      return [0, 1, 2].map(function (i) {
        return { nr: i, slot: (call ? CALL_SLOTS : SLOTS)[i], zustand: 'weg', timer: rnd(1.5, 7) + i * 1.2, fake: false, erwischt: false, schock: 0 };
      });
    }
    function reset() {
      g = { modus: 'intro', runde: 0, t: 0, rest: RUNDE, wissen: 0, image: 100, lernt: false, pose: 0, poseCd: 0, erwischt: 0, punkte: 0,
        noten: [], jungs: neueJungs(false), frage: null, frageAb: rnd(9, 15), fragen: 0, partikel: [], partT: 0, blasen: [], ende: false, blattT: 0 };
    }
    function szene() { return SZENEN[g.runde % SZENEN.length]; }
    function stufe() { return g.runde; }

    function melde(txt, klein) {
      var el = $('meldung'); el.className = 'ph-meldung'; el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1600);
    }
    // Sprechblase an Bühnen-Koordinaten (x, y = Oberkante des Kopfes)
    function sag(wer, txt, dauer, rot) {
      g.blasen = g.blasen.filter(function (b) { if (b.wer === wer) { b.el.remove(); return false; } return true; });
      var el = document.createElement('div'); el.className = 'ph-blase' + (rot ? ' rot' : ''); el.textContent = txt; wrap.appendChild(el);
      g.blasen.push({ wer: wer, el: el, t: dauer || 1.6 });
    }
    function blasenPos(b) {
      var x, y;
      if (b.wer === 'philipp') { x = PX + 44; y = PY + 8; }
      else { var j = g.jungs[b.wer]; x = sx(j.slot) + 14; y = j.slot.y - 4; }
      var hb = b.el.offsetWidth / 2 + 4;
      b.el.style.left = clamp((OX + x) * S, hb, wrap.clientWidth - hb) + 'px';
      b.el.style.top = Math.max(b.el.offsetHeight + 74, (OY + y) * S) + 'px';
    }

    // ---------- Eingabe ----------
    var halten = { taste: false, pad: false, maus: false };
    function lernWunsch() { return halten.taste || halten.pad || halten.maus; }
    function digga() {
      if (g.modus !== 'spiel' || g.poseCd > 0) return;
      var guckt = g.jungs.some(function (j) { return j.zustand === 'schaut' || j.zustand === 'warn'; });
      g.pose = 1.3; g.poseCd = guckt ? 2.6 : 1.4;
      sag('philipp', pick(DIGGA), 1.4);
      Pixel.sfx.tone(98, 0.18, 'sawtooth', 0.05, 70);
      if (guckt) { g.image = Math.min(100, g.image + 6); Pixel.sfx.tone(392, 0.1, 'square', 0.03, null, 0.12); }
    }
    function antworten(i) {
      var f = g.frage; if (!f || g.modus !== 'spiel') return;
      var schlau = f.reihenfolge[i] === 0, guckt = g.jungs.some(function (j) { return j.zustand === 'schaut' || j.zustand === 'warn'; });
      if (schlau) {
        g.wissen = Math.min(100, g.wissen + 8);
        if (guckt) { g.image = Math.max(0, g.image - 12); var j = g.jungs.filter(function (j) { return j.zustand === 'schaut' || j.zustand === 'warn'; })[0]; sag(j.nr, 'Woher weißt du das?!', 1.5, true); j.schock = 0.8; Pixel.sfx.tone(180, 0.2, 'square', 0.05, 120); }
        else { sag('philipp', 'Hab ich geraten, ehrlich.', 1.2); Pixel.sfx.tone(660, 0.08, 'triangle', 0.05); Pixel.sfx.tone(880, 0.12, 'triangle', 0.05, null, 0.08); }
      } else {
        g.image = Math.min(100, g.image + 5); g.wissen = Math.max(0, g.wissen - 5);
        sag('philipp', f.antw[1], 1.3); Pixel.sfx.tone(98, 0.18, 'sawtooth', 0.05, 70);
      }
      g.frage = null; frageEl.classList.remove('an');
    }
    function neueFrage() {
      var sz = szene(), q = sz.mama && Math.random() < 0.6 ? pick(MAMA) : pick(FRAGEN), r = Math.random() < 0.5 ? [0, 1] : [1, 0];
      g.frage = { q: q[0], antw: [q[1], q[2]], reihenfolge: r, t: 5, max: 5 };
      frageEl.innerHTML = '<div class="wer">' + sz.frager.toUpperCase() + ' FRAGT:</div><div class="was"></div><div class="zeit"></div><div class="knoepfe">' +
        '<button data-antw="0"><b>1</b></button><button data-antw="1"><b>2</b></button></div>';
      frageEl.querySelector('.was').textContent = '„' + q[0] + '“';
      frageEl.querySelectorAll('[data-antw]').forEach(function (b, i) { b.appendChild(document.createTextNode(g.frage.antw[r[i]])); });
      frageEl.classList.add('an');
      Pixel.sfx.tone(880, 0.06, 'square', 0.04); Pixel.sfx.tone(988, 0.08, 'square', 0.04, null, 0.07);
    }
    frageEl.addEventListener('click', function (e) { var b = e.target.closest('[data-antw]'); if (b) antworten(+b.getAttribute('data-antw')); });

    var CODES = { Space: 'lernen', KeyW: 'lernen', ArrowUp: 'lernen', KeyE: 'digga', KeyQ: 'digga', Digit1: 'a1', Numpad1: 'a1', Digit2: 'a2', Numpad2: 'a2' };
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel') { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los],[data-act=weiter]'); if (b) { e.preventDefault(); b.click(); } } return; }
      var a = CODES[e.code]; if (!a) return; e.preventDefault();
      if (a === 'lernen') halten.taste = true;
      if (a === 'digga' && !e.repeat) digga();
      if (a === 'a1') antworten(0);
      if (a === 'a2') antworten(1);
    }
    function ku(e) { if (CODES[e.code] === 'lernen') halten.taste = false; }
    function allesLos() { halten = { taste: false, pad: false, maus: false }; pad.querySelectorAll('.gedrueckt').forEach(function (b) { b.classList.remove('gedrueckt'); }); }
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-pad]'); if (!b) return; e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (x) {}
      b.classList.add('gedrueckt');
      if (b.getAttribute('data-pad') === 'lernen') halten.pad = true; else digga();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) {
      pad.addEventListener(n, function (e) { var b = e.target.closest('[data-pad]'); if (!b) return; b.classList.remove('gedrueckt'); if (b.getAttribute('data-pad') === 'lernen') halten.pad = false; });
    });
    cv.addEventListener('pointerdown', function (e) { if (g.modus === 'spiel' && !touch) { e.preventDefault(); halten.maus = true; } });
    window.addEventListener('pointerup', mausLos);
    function mausLos() { halten.maus = false; }

    // ---------- Update ----------
    function update(dt) {
      g.t += dt;
      g.blasen = g.blasen.filter(function (b) { b.t -= dt; if (b.t <= 0) { b.el.remove(); return false; } return true; });
      g.partikel = g.partikel.filter(function (p) { p.t += dt; p.y -= dt * 14; return p.t < 1.4; });
      g.jungs.forEach(function (j) { j.schock = Math.max(0, j.schock - dt); });
      if (g.modus !== 'spiel') return;
      var st = stufe();
      g.rest -= dt; g.pose = Math.max(0, g.pose - dt); g.poseCd = Math.max(0, g.poseCd - dt); g.erwischt = Math.max(0, g.erwischt - dt);
      g.lernt = lernWunsch() && g.pose <= 0 && g.erwischt <= 0;

      // Die Jungs: weg → warn (gleich guckt einer) → schaut → weg
      var aktiv = g.jungs.filter(function (j) { return j.zustand !== 'weg'; }).length, maxGleich = st < 1 ? 1 : st < 3 ? 2 : 3;
      g.jungs.forEach(function (j) {
        j.timer -= dt;
        if (j.zustand === 'weg' && j.timer <= 0) {
          if (aktiv >= maxGleich) { j.timer = rnd(0.4, 1); return; }
          j.zustand = 'warn'; j.timer = Math.max(0.42, 0.9 - st * 0.08); j.fake = st >= 1 && Math.random() < 0.22; aktiv++;
        } else if (j.zustand === 'warn' && j.timer <= 0) {
          if (j.fake) { j.zustand = 'weg'; j.timer = rnd(2, 5); }
          else { j.zustand = 'schaut'; j.timer = rnd(1.3, 2.3 + st * 0.2); j.erwischt = false; }
        } else if (j.zustand === 'schaut') {
          if (g.lernt) {
            if (!j.erwischt) {
              j.erwischt = true; j.schock = 0.9; g.image -= 10; g.erwischt = 0.7; g.lernt = false;
              sag(j.nr, pick(ERWISCHT), 1.5, true); setTimeout(function () { if (alive && g.modus === 'spiel') sag('philipp', pick(AUSREDE), 1.4); }, 350);
              Pixel.sfx.tone(220, 0.15, 'square', 0.06); Pixel.sfx.tone(165, 0.3, 'square', 0.06, null, 0.15);
            }
            g.image -= 14 * dt;
          } else g.image = Math.min(100, g.image + 2.5 * dt);
          if (j.timer <= 0) { j.zustand = 'weg'; j.timer = rnd(6, 15) / (1 + st * 0.22); }
        }
      });

      // Lernen
      if (g.lernt) {
        g.wissen = Math.min(100, g.wissen + (5.6 + st * 0.25) * dt);
        g.partT -= dt; if (g.partT <= 0) { g.partT = 0.32; g.partikel.push({ txt: pick(FORMELN), x: PX + 14 + rnd(-26, 22), y: TISCH - 12, t: 0 }); }
        g.blattT -= dt; if (g.blattT <= 0) { g.blattT = rnd(0.8, 1.4); Pixel.sfx.noise(0.06, 0.03, 3000); }
      }

      // Fragen
      if (g.frage) {
        g.frage.t -= dt; frageEl.querySelector('.zeit').style.width = (g.frage.t / g.frage.max * 100) + '%';
        if (g.frage.t <= 0) { g.frage = null; frageEl.classList.remove('an'); sag('philipp', '…', 0.8); }
      } else if (g.fragen < 2 && RUNDE - g.rest >= g.frageAb && g.rest > 6) { g.fragen++; g.frageAb = RUNDE - g.rest + rnd(9, 14); neueFrage(); }

      if (g.image <= 0) { g.image = 0; ende('image'); return; }
      if (g.rest <= 0) { g.rest = 0; arbeit(); }
    }

    // ---------- Zeichnen ----------
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x), Math.round(OY + y), Math.round(w), Math.round(h)); }
    function hintergrund(t) {
      var id = szene().id, wand, boden;
      if (id === 'klasse') { wand = '#b8c84a'; boden = '#a85a3a'; }
      else if (id === 'bus') { wand = '#d8d6cc'; boden = '#4a4a52'; }
      else if (id === 'mensa') { wand = '#efe0c2'; boden = '#c8c0b0'; }
      else { wand = '#2a2838'; boden = '#3a3040'; }
      ctx.fillStyle = wand; ctx.fillRect(0, 0, IW, OY + 92); ctx.fillStyle = boden; ctx.fillRect(0, OY + 92, IW, IH);
      if (id === 'klasse') {
        R(48, 6, 84, 30, '#8a8a90'); R(50, 8, 80, 26, '#f4f4f0');
        Pixel.text(ctx, 'TEST MORGEN!', OX + 56, OY + 12, 1, '#d83a3a'); R(56, 20, 40, 1, '#3a6ac8'); R(56, 24, 56, 1, '#3a6ac8'); R(56, 28, 30, 1, '#3a6ac8');
        R(150, 4, 40, 60, '#e8e8e0'); R(152, 6, 36, 56, '#a8d8f0'); R(152, 40, 36, 22, '#5a8a5a'); R(152, 52, 36, 10, '#c84a3a');
        for (var x = 0; x < 180; x += 12) R(x, 92, 1, IH, 'rgba(0,0,0,.08)');
      } else if (id === 'bus') {
        R(-OX, 8, IW, 32, '#8a8a90');
        for (x = -OX; x < IW - OX; x += 46) { R(x + 3, 10, 40, 28, '#9ad0f2'); var bx = ((x * 7 - t * 60) % 46 + 46) % 46; R(x + 3 + bx * 0.8, 26, 6, 12, '#4a8a4a'); R(x + 1 + bx * 0.8, 20, 10, 8, '#5aa85a'); }
        R(-OX, 40, IW, 3, '#6a6a70'); R(-OX, 88, IW, 4, '#e8c040');
        R(120, 48, 2, 44, '#c8c8c8'); R(58, 48, 2, 44, '#c8c8c8');
      } else if (id === 'mensa') {
        for (x = 0; x < 180; x += 10) R(x, 0, 1, 92, 'rgba(0,0,0,.06)'); for (var y = 0; y < 92; y += 10) R(0, y, 180, 1, 'rgba(0,0,0,.06)');
        R(54, 6, 72, 26, '#b8b8c0'); R(56, 8, 68, 4, '#e84a3a'); Pixel.text(ctx, 'MENSA', OX + 80, OY + 14, 1, '#fff'); R(58, 18, 12, 6, '#f2c84a'); R(74, 18, 12, 6, '#8ac85a'); R(90, 18, 12, 6, '#e88a4a'); R(106, 18, 12, 6, '#c8a87a');
        for (x = 0; x < 180; x += 16) for (y = 92; y < 140; y += 16) R(x + ((y / 16) % 2) * 8, y, 8, 8, '#b0a898');
      } else {
        R(-OX, 0, IW, 3, '#a84ae8'); R(-OX, 3, IW, 1, 'rgba(168,74,232,.4)');
        R(26, 4, 128, 48, '#0e0e14'); R(28, 6, 124, 44, '#1e1e2a');
        Pixel.text(ctx, 'LIVE', OX + 30, OY + 8, 1, '#e84a4a');
        R(-OX + 4, 10, 20, 26, '#e84a8a'); R(-OX + 6, 12, 16, 22, '#2a2a3a'); R(160, 12, 18, 24, '#3ab0e8'); R(162, 14, 14, 20, '#1e1e2a');

      }
    }
    function junge(j, t) {
      var s = { x: sx(j.slot), y: j.slot.y, weg: j.slot.weg, hin: j.slot.hin }, blick = s.weg, zeichen = null, id = szene().id;
      if (j.schock > 0) blick = 'schock';
      else if (j.zustand === 'schaut') { blick = s.hin; zeichen = 'rot'; }
      else if (j.zustand === 'warn') { blick = Math.floor(t * 8) % 2 ? s.hin : s.weg; zeichen = 'gelb'; }
      if (szene().call) R(s.x - 6, s.y - 4, 40, 36, j.zustand === 'schaut' ? '#44446a' : '#2e2e40');
      if (id === 'bus') { R(s.x - 4, s.y - 8, 36, 44, '#3a5ab8'); R(s.x - 2, s.y - 6, 32, 5, '#5a7ad8'); }
      Pixel.draw(ctx, Sprites.junge(j.nr, blick), OX + s.x, OY + s.y, 2);
      if (id === 'klasse' || id === 'mensa') {
        R(s.x - 6, s.y + 23, 40, 4, id === 'mensa' ? '#d8d0c0' : '#f0f0ea'); R(s.x - 4, s.y + 27, 36, 10, id === 'mensa' ? '#b8b0a0' : '#c8c8c2');
        if (id === 'mensa') { R(s.x + 2, s.y + 20, 14, 3, '#8a8a90'); R(s.x + 4, s.y + 18, 10, 2, '#e8a84a'); }
      }
      if (szene().call) { R(s.x - 6, s.y + 28, 40, 9, '#22223a'); Pixel.text(ctx, ['BRO', 'DIGGA', 'KING'][j.nr], OX + s.x - 3, OY + s.y + 30, 1, '#c8c8d8'); }
      if (zeichen === 'gelb') { var hop = Math.floor(t * 6) % 2; Pixel.text(ctx, '?', OX + s.x + 11, OY + s.y - 12 - hop, 2, '#f2c84a'); }
      if (zeichen === 'rot') {
        Pixel.text(ctx, '!', OX + s.x + 11, OY + s.y - 12, 2, '#e8303a');
        // Blicklinie zu Philipp
        var x0 = s.x + 14, y0 = s.y + 10, x1 = PX + 20, y1 = PY + 18, n = Math.floor(Math.hypot(x1 - x0, y1 - y0) / 3), ph = Math.floor(t * 12) % 2;
        ctx.fillStyle = 'rgba(232,48,58,.8)';
        for (var i = 3; i < n - 2; i++) if ((i + ph) % 2) ctx.fillRect(Math.round(OX + x0 + (x1 - x0) * i / n), Math.round(OY + y0 + (y1 - y0) * i / n), 1, 1);
      }
    }
    // Philipp wird doppelt so groß gezeichnet; P() rechnet in Sprite-Pixeln (0,0 = linke obere Ecke der Figur)
    function P(x, y, w, h, c) { R(PX + x * 2, PY + y * 2, w * 2, h * 2, c); }
    function philipp(t) {
      var mood = 'neutral', dy = 0, L = 24, id = szene().id;
      if (g.modus === 'ende') mood = g.endGrund === 'image' ? 'erwischt' : 'traurig';
      else if (g.erwischt > 0) mood = 'erwischt';
      else if (g.lernt) { mood = 'lernen'; dy = 1; }
      else if (g.pose > 0) mood = 'cool';
      P(-1, 12, 22, 12, id === 'zimmer' ? '#1a1a1a' : '#5a4a3a');
      Pixel.draw(ctx, Sprites.philipp(mood), OX + PX, OY + PY + dy * 2, 2);
      var platte = id === 'zimmer' ? '#3a3a44' : id === 'mensa' ? '#d8d0c0' : '#f0f0ea', front = id === 'zimmer' ? '#2a2a32' : id === 'mensa' ? '#b8b0a0' : '#c8c8c2';
      R(PX - 46, TISCH, 132, 6, platte); R(PX - 42, TISCH + 6, 124, 44, front); R(PX - 42, TISCH + 6, 124, 1, 'rgba(0,0,0,.2)'); Pixel.text(ctx, 'NO STRESS', OX + PX + 2, OY + TISCH + 14, 1, 'rgba(60,60,80,.35)');
      if (id === 'mensa') { P(-14, L - 1, 9, 1, '#8a8a90'); P(-13, L - 2, 7, 1, '#e8a84a'); }
      if (g.modus === 'ende' || g.modus === 'arbeit') return;
      if (g.lernt) {
        // offenes Buch + Hand mit Stift
        P(-2, L - 3, 24, 3, '#f8f8f0'); P(9, L - 3, 1, 3, '#c8c0b0'); P(-3, L - 1, 26, 1, '#2a6ac8');
        for (var l = 0; l < 2; l++) { P(0, L - 3 + l, 7, 1, '#b8b8c8'); P(12, L - 3 + l, 8, 1, '#b8b8c8'); }
        var wipp = Math.floor(t * 10) % 2;
        P(15 + wipp, L - 5, 3, 3, '#e2b48c'); P(17 + wipp, L - 8, 1, 4, '#e8c040'); P(18, L - 5, 4, 3, '#1e4a3c');
        P(-4, L - 4, 4, 3, '#1e4a3c'); P(-1, L - 4, 3, 2, '#e2b48c');
      } else {
        // Kinn auf die Hand gestützt + Handy in der anderen
        P(14, 13, 3, 2, '#e2b48c'); P(14, 15, 4, L - 15, '#1e4a3c'); P(14, 15, 1, L - 15, '#163a2e');
        P(2, L - 7, 4, 6, '#141418'); P(3, L - 6, 2, 4, Math.floor(t * 2) % 2 ? '#4ad8e8' : '#3ab0e8'); P(1, L - 2, 6, 2, '#e2b48c'); P(0, L - 1, 8, 1, '#1e4a3c');
      }
    }
    function render(t) {
      ctx.imageSmoothingEnabled = false;
      hintergrund(t);
      g.jungs.forEach(function (j) { junge(j, t); });
      philipp(t);
      g.partikel.forEach(function (p) { ctx.globalAlpha = Math.max(0, 1 - p.t / 1.4); Pixel.text(ctx, p.txt, OX + p.x, OY + p.y, 1, '#2a6ac8'); ctx.globalAlpha = 1; });
      if (g.modus === 'spiel' && g.erwischt > 0) Pixel.text(ctx, '!!', OX + PX + 14, OY + PY - 14, 2, '#e8303a');
    }
    function hud() {
      $('wissen').style.width = g.wissen + '%'; $('image').style.width = Math.max(0, g.image) + '%';
      $('imageBox').classList.toggle('knapp', g.image < 30 && g.modus === 'spiel');
      $('zeit').textContent = Math.ceil(g.rest) + 'S'; $('ort').textContent = szene().kurz;
      g.blasen.forEach(blasenPos);
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render(g.t); hud();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function figur(mood) { var img = Sprites.philipp(mood), c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); return c; }
    function intro() {
      ovl.classList.remove('aus');
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="ph-karte"><h1>Lernt nie (angeblich)</h1><div class="unter">Philipp sagt, er lernt nie. Wir glauben ihm kein Wort.</div><div data-el="fig"></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>📖 <b>Leertaste</b> halten (oder LERNEN) = heimlich lernen. Das füllt WISSEN.</li>' +
        '<li>👀 Zeigt einer der Jungs ein <b style="color:#c8a020">?</b>, guckt er gleich rüber – sofort loslassen und chillen. Erwischt kostet IMAGE.</li>' +
        '<li>😎 <b>E</b> / DIGGA!: Coolness-Spruch. Bringt Image, wenn gerade jemand guckt.</li>' +
        '<li>❓ Fragen mit <b>1</b>/<b>2</b>: die richtige Antwort gibt Wissen – aber nur, wenn keiner hinschaut.</li>' +
        '<li>📝 Nach jeder Runde Klassenarbeit. Note 5 oder 6 = durchgefallen, Image 0 = enttarnt.</li></ul>' +
        '<button class="px-btn" data-act="los">Ganz entspannt anfangen</button></div>';
      ovl.querySelector('[data-el=fig]').appendChild(figur('cool'));
    }
    function rundeStarten() {
      var sz = szene();
      g.modus = 'spiel'; g.rest = RUNDE; g.wissen = 0; g.jungs = neueJungs(!!sz.call); g.frage = null; g.fragen = 0; g.frageAb = rnd(8, 14);
      g.pose = 0; g.erwischt = 0; ovl.classList.add('aus'); $('hud').classList.add('an'); allesLos();
      melde(sz.name, 'Runde ' + (g.runde + 1) + ' · morgen ist Arbeit');
      setTimeout(function () { if (alive && g.modus === 'spiel') sag('philipp', pick(['Ich lern eh nicht.', 'Chill, ich kann das alles.', 'Lernen? Ich?']), 1.6); }, 900);
      Pixel.sfx.tone(392, 0.08, 'square', 0.05); Pixel.sfx.tone(523, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(659, 0.15, 'square', 0.05, null, 0.18);
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.ende) { g.blasen.forEach(function (b) { b.el.remove(); }); reset(); }
      rundeStarten();
    }
    function arbeit() {
      g.modus = 'arbeit'; g.frage = null; frageEl.classList.remove('an'); allesLos(); $('hud').classList.remove('an');
      var n = note(g.wissen), delta = [0, -8, -4, 0, 6, 0, 0][n];
      g.noten.push(n); g.image = clamp(g.image + delta, 0, 100);
      var pkt = (6 - n) * 150 + Math.round(g.image) * 2; g.punkte += pkt;
      var reaktion = n <= 2 ? pick(GLAUBEN) : n === 3 ? 'Okay … vielleicht lernt er echt nie.' : n === 4 ? 'Siehste, er lernt WIRKLICH nie!' : 'Bro … vielleicht doch mal lernen?';
      Pixel.sfx.tone(523, 0.1, 'triangle', 0.05); Pixel.sfx.tone(n <= 3 ? 784 : 330, 0.25, 'triangle', 0.05, null, 0.12);
      if (n >= 5) { ende('note'); return; }
      ovl.classList.remove('aus');
      ovl.innerHTML = '<div class="ph-karte"><h1>Klassenarbeit</h1><div class="unter">' + szene().name + ' überstanden. Wissen: ' + Math.round(g.wissen) + ' %</div>' +
        '<div class="note">' + n + '</div>' +
        '<div class="zitat"><b>Philipp:</b> „Hab null gelernt, ehrlich.“</div><div class="zitat"><b>Die Jungs:</b> <i>„' + reaktion + '“</i></div>' +
        '<div class="zeile"><span>Image ' + (delta ? '(' + (delta > 0 ? '+' : '') + delta + ')' : '') + '</span><b>' + Math.round(g.image) + '</b></div>' +
        '<div class="zeile"><span>Punkte</span><b>' + g.punkte + '</b></div>' +
        '<button class="px-btn" data-act="weiter">Nächste Runde</button></div>';
    }
    function weiter() { if (g.modus !== 'arbeit') return; g.runde++; rundeStarten(); }
    function ende(grund) {
      if (g.modus === 'ende') return;
      g.modus = 'ende'; g.ende = true; g.endGrund = grund; g.frage = null; frageEl.classList.remove('an'); allesLos();
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best; if (neu) Pixel.set(BEST_KEY, g.punkte);
      var schnitt = g.noten.length ? (g.noten.reduce(function (a, b) { return a + b; }, 0) / g.noten.length).toFixed(1).replace('.', ',') : '–';
      if (grund === 'image') { g.jungs.forEach(function (j) { j.schock = 3; }); sag(0, 'ER LERNT HEIMLICH!!', 2.2, true); }
      Pixel.sfx.tone(392, 0.3, 'triangle', 0.06, 370); Pixel.sfx.tone(349, 0.3, 'triangle', 0.06, 330, 0.3); Pixel.sfx.tone(294, 0.7, 'triangle', 0.06, 220, 0.6);
      setTimeout(function () {
        if (!alive) return;
        $('hud').classList.remove('an'); ovl.classList.remove('aus');
        var titel = grund === 'image' ? 'Enttarnt!' : 'Durchgefallen!';
        var unter = grund === 'image' ? 'Die Jungs haben es gesehen: Philipp lernt. Heimlich. Massiv.' : 'Note ' + g.noten[g.noten.length - 1] + '. So überzeugend hat er noch nie „nicht gelernt“.';
        ovl.innerHTML = '<div class="ph-karte"><h1 class="rot">' + titel + '</h1><div class="unter">' + unter + '</div><div data-el="fig"></div>' +
          '<div class="zeile"><span>Punkte</span><b>' + g.punkte + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Runden</span><b>' + g.noten.length + '</b></div>' +
          '<div class="zeile"><span>Notenschnitt</span><b>' + schnitt + '</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte) + '</b></div>' +
          '<button class="px-btn" data-act="los">Nochmal „nicht lernen“</button><button class="px-btn" data-act="exit" style="margin-top:8px">Menü</button></div>';
        ovl.querySelector('[data-el=fig]').appendChild(figur(grund === 'image' ? 'erwischt' : 'traurig'));
      }, 1400);
    }

    function onClick(e) {
      var b = e.target.closest && e.target.closest('[data-act]');
      if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'los') los();
      if (a === 'weiter') weiter();
      if (a === 'exit') { stop(); onExit(); }
      if (a === 'ton') { Pixel.setMuted(!Pixel.isMuted()); tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊'; }
    }
    function stop() {
      if (!alive) return;
      alive = false; cancelAnimationFrame(raf); clearTimeout(meldT);
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('pointerup', mausLos);
      window.removeEventListener('resize', resize); window.removeEventListener('blur', allesLos);
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize); window.addEventListener('blur', allesLos);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__philipp = { g: function () { return g; }, halten: function () { return halten; }, digga: digga, antworten: antworten, weiter: weiter };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.philipp = { start: start };
})();
