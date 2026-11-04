// Matti: Korbsammler – 2D-Pixel-Spiel auf dem Schulhof.
// Matti ist klein, aber mutig: Er spricht jedes Mädchen an und kassiert jedes Mal einen Korb.
// Hingehen (A/D, ←/→), im richtigen Moment ansprechen (Leertaste) und danach den Korb mit dem Kopf fangen.
// Gefangene Körbe stapeln sich auf seinem Kopf – irgendwann ist er damit sogar 1,80.
// Danebengehauene Sprüche, verpasste Körbe und Übersehen-Werden kosten EGO. Ego auf 0 → Spiel vorbei.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.matti.best';
  var SW0 = 180, SH0 = 140, GY = 124, GRAV = 130, MATTI_H = 44, MAX_STAPEL = 14;
  var SPRUECHE = [
    'Bist du WLAN? Ich spür ne Verbindung.', 'Hast du ne Karte? Ich hab mich in deinen Augen verlaufen.', 'Ich bin klein, aber mein Ego ist 2 Meter.',
    'Bist du ne Fünf in Mathe? Ich denk nur an dich.', 'Ich hab zwei Mensa-Gutscheine. Zufällig.', 'Hi. Ich bin Matti. Gern geschehen.',
    'Bist du Google? Du hast alles, was ich suche.', 'Ich bin nicht klein, ich bin kompakt gebaut.', 'Ich hab Insta, Snap und ne Mutter, die mich abholt.',
    'Komm, gib mir deine Nummer, bevor ich wachse.', 'Ich steh auf Zehenspitzen nur für dich.', 'Na, schon mal mit nem Model im Taschenformat geredet?',
    'Ich bin nicht verzweifelt. Das ist nur Versuch Nummer 47 heute.', 'Ey Schatz, meine Mama sagt, ich bin hübsch.',
    'Deine Freundin hat nein gesagt, also bist du dran.', 'Ich bin wie ein Lottogewinn. Nur unwahrscheinlicher.', 'Lass mal Pausenbrot teilen. Deins.'
  ];
  var KORB = {
    perfekt: ['Süß … aber nein.', 'Netter Versuch, Kleiner.', 'Du bist lieb. Wie ein kleiner Bruder. Den keiner mag.', '10/10 für Mut. 0/10 für alles andere.', 'Aww. Nein. Niemals.', 'Frag nochmal, wenn du über die Theke gucken kannst.', 'Du bist süß. Wie ein Welpe, den man ins Tierheim bringt.'],
    ok: ['Ähm … nein danke.', 'Hab grad keine Zeit. Nie.', 'Ich steh auf Große. Also nicht auf dich.', 'Ich hab schon nen Freund. Bald. Irgendwen, nur nicht dich.', 'Bist du überhaupt schon in der Fünften?', 'Ich date keine Leute mit Kindersitz.', 'Sorry, ich steh nicht auf Gartenzwerge.', 'Wächst du noch oder ist das schon alles?'],
    cringe: ['Was war DAS denn?!', 'Bitte verpiss dich einfach.', 'Hast du den Spruch aus nem Überraschungsei?', 'Nope. Nope. Ekelhaft. Nope.', 'Ich ruf gleich die Pausenaufsicht.', 'Da nehm ich lieber meinen Ex zurück.', 'Junge, du riechst nach Verzweiflung.', 'Ich blockier dich auch im echten Leben.', 'Geh lieber Sandkasten, da passt du hin.', 'Ich hab Brechreiz. Danke.', 'Selbst mein Hund hat mehr Rizz.', 'Ich sag deiner Mama, dass du mich belästigst.'],
    uebersehen: ['Hä? Hat da wer was gesagt?', 'Komisch, ich dachte da war wer.', 'Ist hier irgendwo ein Kind?', 'Hat jemand sein Geschwisterkind verloren?', 'Ich glaub, der Mülleimer hat geredet.', 'Hab ich auf was getreten?']
  };
  var UNTEN = ['HALLO?! HIER UNTEN!', 'Ich bin hier! Unten! Wie immer!', 'Ey! Hier! Bück dich halt!'];
  var JUNGS_JA = ['Ehrenmann!', 'Der Korb steht dir besser als jede Freundin.', 'Sammelt die wie Pokémon.', 'Korb-König!', 'Bro hat mehr Körbe als Follower.', 'Der Korb ist das Einzige, was ihn je umarmt hat.', 'Weiter so, du Opfer! 😂', 'Matti, du bist ne Legende. Ne traurige.', 'Bro baut ne Korb-Sammlung, keine Beziehung.'];
  var JUNGS_NEIN = ['Nicht mal den Korb gefangen …', 'Bro … erbärmlich.', 'Selbst der Korb will dich nicht.', 'Uff. Peinlich, Digga.', 'Der Korb hat dich auch abgelehnt.', 'Wir kennen den nicht.', 'Nicht mal Körbe fangen kann der.', 'Bro verliert sogar gegen nen Korb.'];
  var NAMEN = ['Lena', 'Sophie', 'Mia', 'Emma', 'Hannah', 'Lea', 'Marie', 'Nele', 'Clara', 'Lina'];

  var CSS = [
    '.mt{position:absolute;inset:0;overflow:hidden;background:#8ac8f0;color:#fff;font-family:"Pixelify Sans",sans-serif;-webkit-user-select:none;user-select:none;touch-action:none}',
    '.mt canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.mt-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;z-index:20;pointer-events:none}',
    '.mt-top button{pointer-events:auto}',
    '.mt-hud{flex:1;display:flex;gap:8px;justify-content:center;padding:0 8px;opacity:0;transition:opacity .4s}',
    '.mt-hud.an{opacity:1}',
    '.mt-bar{width:min(30vw,170px);background:rgba(20,20,26,.85);border:3px solid #fff;padding:4px 7px 6px;box-shadow:3px 3px 0 rgba(0,0,0,.4)}',
    '.mt-bar small{display:flex;justify-content:space-between;font:8px/1 "Press Start 2P",monospace;margin-bottom:4px;gap:6px}',
    '.mt-bar div{height:10px;background:#2a2a32;border:2px solid #000}',
    '.mt-bar div span{display:block;height:100%;width:100%;background:#f06a8a;transition:width .15s}',
    '.mt-bar.knapp{animation:mtWackel .12s infinite alternate}',
    '.mt-bar.info b{display:block;font:12px/1.2 "Press Start 2P",monospace;color:#e8c040;padding-top:1px}',
    '@keyframes mtWackel{from{transform:translateX(-2px)}to{transform:translateX(2px)}}',
    '.mt-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#14141a;border:3px solid #14141a;padding:4px 8px;font-size:15px;max-width:min(260px,70vw);text-align:center;z-index:18;',
    ' pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:mtPop .15s}',
    '.mt-blase.rot{background:#ffe0e6}',
    '.mt-blase.gruen{background:#e0ffe4}',
    '.mt-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:inherit;border-right:3px solid #14141a;border-bottom:3px solid #14141a;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes mtPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.mt-meldung{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;opacity:0;white-space:nowrap;z-index:19}',
    '.mt-meldung b{display:block;font:clamp(14px,4vw,24px)/1.2 "Press Start 2P",monospace;color:#f06a8a;text-shadow:3px 3px 0 #000}',
    '.mt-meldung small{display:block;font-size:17px;text-shadow:2px 2px 0 #000;margin-top:8px}',
    '.mt-meldung.zeigen{animation:mtMeld 1.6s ease-out}',
    '@keyframes mtMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0}}',
    '.mt-pad{position:absolute;left:0;right:0;bottom:0;display:none;justify-content:space-between;align-items:flex-end;padding:0 12px calc(12px + env(safe-area-inset-bottom));z-index:15;pointer-events:none}',
    '.mt-pad.an{display:flex}',
    '.mt-pad div{display:flex;gap:10px}',
    '.mt-pad button{pointer-events:auto;width:78px;height:78px;border-radius:50%;border:3px solid rgba(255,255,255,.8);background:rgba(20,20,26,.5);color:#fff;',
    ' font:20px/1 "Press Start 2P",monospace;touch-action:none}',
    '.mt-pad button[data-pad=sag]{width:100px;height:100px;font-size:10px;line-height:1.3}',
    '.mt-pad button.gedrueckt{background:rgba(240,106,138,.6)}',
    '.mt-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,10,14,.55);z-index:40;padding:16px;overflow:auto}',
    '.mt-ovl.aus{display:none}',
    '.mt-karte{width:min(460px,100%);background:#f4f2ea;color:#14141a;border:4px solid #14141a;box-shadow:8px 8px 0 #c83a6a;padding:16px 18px;text-align:center;margin:auto}',
    '.mt-karte h1{margin:4px 0 4px;font:clamp(16px,4.6vw,24px)/1.25 "Press Start 2P",monospace;color:#c83a6a}',
    '.mt-karte .unter{font-size:18px;margin:6px 0 8px}',
    '.mt-karte canvas{position:static;width:72px;height:auto;margin:4px auto}',
    '.mt-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.mt-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(20,20,26,.3);padding:6px 0;font-size:18px}',
    '.mt-karte .zeile b{font:12px/1.5 "Press Start 2P",monospace;color:#c83a6a}',
    '.mt-karte .zitat{font-size:18px;margin:6px 0}',
    '.mt-karte .px-btn{width:100%;margin-top:8px}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function groesse(k) { return (1.55 + Math.min(k, 40) * 0.03).toFixed(2).replace('.', ','); }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="mt"><canvas></canvas>' +
      '<div class="mt-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="mt-hud" data-el="hud">' +
          '<div class="mt-bar" data-el="egoBox"><small><span>EGO</span><span data-el="koerbe">0 KÖRBE</span></small><div><span data-el="ego"></span></div></div>' +
          '<div class="mt-bar info"><small><span>PUNKTE</span><span data-el="punkte">0</span></small><b data-el="groesse">1,55 M</b></div>' +
        '</div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="mt-meldung" data-el="meldung"></div>' +
      '<div class="mt-pad"><div><button data-pad="links" aria-label="Nach links">◀</button><button data-pad="rechts" aria-label="Nach rechts">▶</button></div>' +
        '<button data-pad="sag" aria-label="Ansprechen">AN-<br>SPRE-<br>CHEN</button></div>' +
      '<div class="mt-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.mt'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), pad = root.querySelector('.mt-pad'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now(), meldT = 0, timeouts = [];
    var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    if (touch) pad.classList.add('an');
    function spaeter(fn, ms) { var id = setTimeout(function () { if (alive) fn(); }, ms); timeouts.push(id); }

    // ---------- Layout ----------
    var S = 3, IW = 0, IH = 0, OX = 0, OY = 0;
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight;
      S = Math.max(2, Math.floor(Math.min(SW / 130, (SH - (touch ? 120 : 60)) / 140)));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      OX = Math.floor((IW - SW0) / 2);
      OY = Math.max(Math.ceil(64 / S), Math.floor((IH - SH0) / 2) - (touch ? Math.round(50 / S) : 0));
      OY = Math.min(OY, Math.max(0, IH - SH0));
    }
    function links() { return Math.max(2, -OX + 2); }
    function rechts() { return Math.min(SW0 - 2, IW - OX - 2); }
    function platz() { return rechts() - 34; }                // wo das Mädchen stehen bleibt (linke Kante)
    function mitte() { return g.mx + 16; }                     // Mattis Mitte (Sprite 16 breit, Maßstab 2 → 32 px)

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = { modus: 'intro', t: 0, ego: 100, punkte: 0, koerbe: 0, versuche: 0, perfekt: 0, gefangen: 0, verpasst: 0, stufe: 0,
        mx: 40, lauf: 0, blick: 1, mood: 'neutral', moodT: 0, girl: null, naechste: 1.2, koerbeFlug: [], liegen: [], herzen: [],
        blasen: [], ende: false, meter: null, wackel: 0, hatte180: false, jungsT: 0 };
    }

    function melde(txt, klein) {
      var el = $('meldung'); el.className = 'mt-meldung'; el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      void el.offsetWidth; el.classList.add('zeigen'); clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1600);
    }
    function sag(wer, txt, dauer, farbe) {
      g.blasen = g.blasen.filter(function (b) { if (b.wer === wer) { b.el.remove(); return false; } return true; });
      var el = document.createElement('div'); el.className = 'mt-blase' + (farbe ? ' ' + farbe : ''); el.textContent = txt; wrap.appendChild(el);
      g.blasen.push({ wer: wer, el: el, t: dauer || 1.8 });
    }
    function blasenPos(b) {
      var x, y;
      if (b.wer === 'matti') { x = mitte(); y = GY - MATTI_H - 8 - Math.min(g.koerbe, MAX_STAPEL) * 4; }
      else if (b.wer === 'girl') { if (!g.girl) { b.t = 0; return; } x = g.girl.x + 16; y = GY - 60; }
      else { x = links() + 22; y = 64; }
      var hb = b.el.offsetWidth / 2 + 4;
      b.el.style.left = clamp((OX + x) * S, hb, wrap.clientWidth - hb) + 'px';
      b.el.style.top = Math.max(b.el.offsetHeight + 70, (OY + y) * S) + 'px';
    }

    // ---------- Eingabe ----------
    var halten = { l: false, r: false, pl: false, pr: false };
    function richtung() { return ((halten.r || halten.pr) ? 1 : 0) - ((halten.l || halten.pl) ? 1 : 0); }
    function allesLos() { halten = { l: false, r: false, pl: false, pr: false }; pad.querySelectorAll('.gedrueckt').forEach(function (b) { b.classList.remove('gedrueckt'); }); }

    function ansprechen() {
      if (g.modus !== 'spiel') return;
      var gi = g.girl;
      if (!gi || gi.zustand !== 'wartet') {
        if (!gi) { sag('matti', pick(['Noch keine da …', 'Die verstecken sich vor mir. Logisch.']), 1); }
        return;
      }
      if (Math.abs(mitte() - (gi.x + 16)) > 60) { sag('matti', pick(UNTEN), 1.1); Pixel.sfx.tone(660, 0.06, 'square', 0.03); return; }
      var m = g.meter, d = Math.abs(m.pos - m.mitte), q = d <= m.breite * 0.35 ? 'perfekt' : d <= m.breite * 0.6 ? 'ok' : 'cringe';
      g.meter = null; gi.zustand = 'hoert'; gi.timer = 1.1; gi.q = q; g.versuche++;
      g.mood = 'flirt'; g.moodT = 1.2;
      sag('matti', pick(SPRUECHE), 1.8);
      if (q === 'perfekt') { g.punkte += 30; g.perfekt++; g.ego = Math.min(100, g.ego + 5); Pixel.sfx.tone(784, 0.08, 'triangle', 0.05); Pixel.sfx.tone(1046, 0.14, 'triangle', 0.05, null, 0.08); }
      else if (q === 'ok') { g.punkte += 15; Pixel.sfx.tone(587, 0.12, 'triangle', 0.05); }
      else { g.punkte += 5; g.ego -= 6; Pixel.sfx.tone(196, 0.22, 'sawtooth', 0.05, 140); }
      for (var i = 0; i < (q === 'perfekt' ? 5 : q === 'ok' ? 3 : 0); i++) g.herzen.push({ x: mitte() + rnd(-4, 6), y: GY - MATTI_H - 6, vx: rnd(4, 18), t: 0 });
    }

    var CODES = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', Space: 'sag', Enter: 'sag', KeyW: 'sag', ArrowUp: 'sag', KeyE: 'sag' };
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel') { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } } return; }
      var a = CODES[e.code]; if (!a) return; e.preventDefault();
      if (a === 'l') halten.l = true;
      if (a === 'r') halten.r = true;
      if (a === 'sag' && !e.repeat) ansprechen();
    }
    function ku(e) { var a = CODES[e.code]; if (a === 'l') halten.l = false; if (a === 'r') halten.r = false; }
    pad.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-pad]'); if (!b) return; e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (x) {}
      b.classList.add('gedrueckt');
      var a = b.getAttribute('data-pad');
      if (a === 'links') halten.pl = true; else if (a === 'rechts') halten.pr = true; else ansprechen();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) {
      pad.addEventListener(n, function (e) {
        var b = e.target.closest('[data-pad]'); if (!b) return; b.classList.remove('gedrueckt');
        var a = b.getAttribute('data-pad'); if (a === 'links') halten.pl = false; if (a === 'rechts') halten.pr = false;
      });
    });

    // ---------- Spiel-Logik ----------
    function neuesMaedchen() {
      var nr = Math.floor(Math.random() * 4);
      g.girl = { nr: nr, name: pick(NAMEN), x: rechts() + 20, zustand: 'kommt', timer: 0, mood: 'neutral', q: null, lauf: 0 };
    }
    function korbWerfen(verzoegert) {
      var gi = g.girl; if (!gi) return;
      var x0 = gi.x + 4, y0 = GY - 36;
      var tx = clamp(mitte() + rnd(-22, 22), links() + 8, platz() - 20);
      var T = rnd(1.5, 1.9) / (1 + Math.min(g.stufe, 15) * 0.015);
      g.koerbeFlug.push({ x: x0, y: y0, vx: (tx - x0) / T, vy: (GY - y0 - 0.5 * GRAV * T * T) / T, rot: 0, verz: verzoegert || 0 });
      if (!verzoegert) Pixel.sfx.tone(330, 0.1, 'square', 0.03, 520);
    }
    function reagieren() {
      var gi = g.girl, q = gi.q;
      // ganz selten: ein kurzer Moment Hoffnung
      if (q === 'perfekt' && Math.random() < 0.06) {
        gi.mood = 'lacht'; sag('girl', 'Hmm … vielleicht, wenn du 1,80 bist?', 1.5, 'gruen'); melde('VIELLEICHT?!', '+100 Hoffnung · 0 Chance');
        g.punkte += 100; g.mood = 'jubel'; g.moodT = 1.5;
        Pixel.sfx.tone(523, 0.1, 'square', 0.05); Pixel.sfx.tone(659, 0.1, 'square', 0.05, null, 0.1); Pixel.sfx.tone(784, 0.25, 'square', 0.05, null, 0.2);
        gi.zustand = 'hoffnung'; gi.timer = 1.6; return;
      }
      gi.mood = q === 'perfekt' ? 'lacht' : q === 'ok' ? 'augenrollen' : 'genervt';
      sag('girl', pick(KORB[q]), 1.8, q === 'cringe' ? 'rot' : '');
      g.mood = 'korb'; g.moodT = 1.4;
      korbWerfen(0);
      if (g.stufe >= 10 && Math.random() < 0.15 + Math.min(0.2, g.stufe * 0.01)) korbWerfen(0.7);
      gi.zustand = 'wirft'; gi.timer = 0.9;
    }
    function uebersehen() {
      var gi = g.girl; gi.mood = 'neutral'; gi.zustand = 'geht';
      sag('girl', pick(KORB.uebersehen), 1.8); g.ego -= 8; g.mood = 'korb'; g.moodT = 1.4; g.meter = null; g.versuche++;
      Pixel.sfx.tone(262, 0.25, 'triangle', 0.05, 196);
    }
    function gefangen(k) {
      g.koerbe++; g.gefangen++; g.wackel = 0.4;
      var bonus = 10 * (1 + Math.floor(g.koerbe / 5)); g.punkte += bonus; g.ego = Math.min(100, g.ego + 4);
      Pixel.sfx.tone(523, 0.06, 'square', 0.04); Pixel.sfx.tone(784, 0.1, 'square', 0.04, null, 0.06);
      if (Math.random() < 0.4) sag('jungs', pick(JUNGS_JA), 1.3, 'gruen');
      if (!g.hatte180 && 1.55 + g.koerbe * 0.03 >= 1.795) { g.hatte180 = true; melde('ENDLICH 1,80!', 'Mit Körben zählt das. Sonst nie.'); g.mood = 'jubel'; g.moodT = 1.5; }
      else if (g.koerbe % 10 === 0) melde(g.koerbe + ' KÖRBE!', 'Ablehnungs-Großhändler');
    }
    function verpasst(k) {
      g.verpasst++; g.ego -= 5; g.liegen.push({ x: k.x, t: 0 });
      Pixel.sfx.noise(0.12, 0.08, 900);
      if (Math.random() < 0.5) sag('jungs', pick(JUNGS_NEIN), 1.3, 'rot');
    }

    function update(dt) {
      g.t += dt;
      g.blasen = g.blasen.filter(function (b) { b.t -= dt; if (b.t <= 0) { b.el.remove(); return false; } return true; });
      g.herzen = g.herzen.filter(function (h) { h.t += dt; h.y -= dt * 18; h.x += Math.sin(h.t * 8) * 0.4; return h.t < 1.3; });
      g.liegen = g.liegen.filter(function (l) { l.t += dt; return l.t < 2; });
      g.wackel = Math.max(0, g.wackel - dt);
      if (g.moodT > 0) { g.moodT -= dt; if (g.moodT <= 0) g.mood = 'neutral'; }
      if (g.modus !== 'spiel') return;

      // Matti laufen
      var r = richtung();
      if (r) { g.blick = r; g.lauf += dt; }
      var grenze = g.girl && g.girl.zustand !== 'geht' ? g.girl.x - 34 : rechts() - 34;
      g.mx = clamp(g.mx + r * (95 + Math.min(g.stufe, 12) * 2) * dt, links(), Math.min(grenze, rechts() - 34));

      // Mädchen
      var gi = g.girl;
      if (!gi) { g.naechste -= dt; if (g.naechste <= 0) neuesMaedchen(); }
      else {
        gi.timer -= dt;
        if (gi.zustand === 'kommt') {
          gi.x -= dt * 40; gi.lauf += dt;
          if (gi.x <= platz()) {
            gi.x = platz(); gi.zustand = 'wartet';
            var lim = Math.max(4, 6.5 - g.stufe * 0.08);
            g.meter = { pos: 0, phase: rnd(0, 6), tempo: 1.5 + Math.min(g.stufe, 20) * 0.07, mitte: rnd(0.3, 0.7), breite: Math.max(0.3, 0.5 - g.stufe * 0.008), rest: lim, max: lim };
          }
        } else if (gi.zustand === 'wartet') {
          var m = g.meter; m.phase += dt * m.tempo; m.pos = 0.5 + 0.5 * Math.sin(m.phase); m.rest -= dt;
          if (m.rest <= 0) uebersehen();
        } else if (gi.zustand === 'hoert') {
          if (gi.timer <= 0) reagieren();
        } else if (gi.zustand === 'hoffnung') {
          if (gi.timer <= 0) { gi.q = 'perfekt'; sag('girl', '… nee, Spaß. Als ob. 😂', 1.6); gi.mood = 'augenrollen'; g.mood = 'korb'; g.moodT = 1.4; korbWerfen(0); gi.zustand = 'wirft'; gi.timer = 0.9; }
        } else if (gi.zustand === 'wirft') {
          if (gi.timer <= 0) gi.zustand = 'geht';
        } else if (gi.zustand === 'geht') {
          gi.x += dt * 46; gi.lauf += dt;
          if (gi.x > rechts() + 24 && !g.koerbeFlug.length) { g.girl = null; g.stufe++; g.naechste = rnd(0.5, 1.2); }
        }
      }

      // fliegende Körbe
      var top = GY - MATTI_H - Math.min(g.koerbe, MAX_STAPEL) * 4;
      g.koerbeFlug = g.koerbeFlug.filter(function (k) {
        if (k.verz > 0) { k.verz -= dt; if (k.verz <= 0) Pixel.sfx.tone(330, 0.1, 'square', 0.03, 520); return true; }
        var yAlt = k.y;
        k.vy += GRAV * dt; k.x += k.vx * dt; k.y += k.vy * dt; k.rot += dt * 8;
        if (k.vy > 0 && yAlt <= top + 2 && k.y >= top - 4 && Math.abs(k.x - mitte()) < 17) { gefangen(k); return false; }
        if (k.y >= GY - 3) { verpasst(k); return false; }
        return true;
      });

      if (g.ego <= 0) { g.ego = 0; ende(); }
    }

    // ---------- Zeichnen ----------
    function R(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(Math.round(OX + x), Math.round(OY + y), Math.round(w), Math.round(h)); }
    function hintergrund(t) {
      // Himmel + Schulgebäude
      ctx.fillStyle = '#8ac8f0'; ctx.fillRect(0, 0, IW, IH);
      R(-OX, 70, IW, 6, '#a8d8f6');
      var wx = Math.floor((t * 3) % 220);
      R(20 + wx - 40, 14, 18, 4, '#fff'); R(24 + wx - 40, 11, 10, 3, '#fff');
      R(-OX, 30, IW, 64, '#d89a6a'); R(-OX, 30, IW, 3, '#b87a4a');
      for (var x = -OX - ((-OX) % 26) - 26; x < IW - OX; x += 26) {
        R(x + 4, 38, 16, 14, '#e8e8e0'); R(x + 5, 39, 14, 12, '#9ad0f2'); R(x + 11, 39, 1, 12, '#e8e8e0');
        R(x + 4, 60, 16, 14, '#e8e8e0'); R(x + 5, 61, 14, 12, '#9ad0f2'); R(x + 11, 61, 1, 12, '#e8e8e0');
      }
      R(74, 76, 28, 18, '#6a4a3a'); R(76, 78, 11, 16, '#8a5a3a'); R(89, 78, 11, 16, '#8a5a3a');
      R(66, 33, 44, 9, '#f4f2ea'); Pixel.text(ctx, 'SCHULE', OX + 76, OY + 35, 1, '#c83a6a');
      // Hof
      R(-OX, 94, IW, IH, '#9a9aa2');
      for (x = -OX - ((-OX) % 20) - 20; x < IW - OX; x += 20) R(x, 94, 1, 40, 'rgba(0,0,0,.08)');
      R(-OX, 108, IW, 1, 'rgba(0,0,0,.08)');
      // Bank mit den Jungs (links hinten)
      var bx = links() + 6;
      Pixel.draw(ctx, Sprites.junge(0, g.girl && g.girl.zustand === 'wirft' ? 'schock' : 'rechts'), OX + bx, OY + 80, 1);
      Pixel.draw(ctx, Sprites.junge(2, 'rechts'), OX + bx + 16, OY + 80, 1);
      R(bx - 4, 94, 40, 3, '#8a5a3a'); R(bx - 2, 97, 2, 6, '#5a3a22'); R(bx + 32, 97, 2, 6, '#5a3a22');
      // Baum rechts hinten
      var tx = rechts() - 14; R(tx, 70, 4, 26, '#6a4a2a'); R(tx - 10, 52, 24, 20, '#4a9a4a'); R(tx - 6, 46, 16, 8, '#5aaa5a');
      // Hof-Linie
      R(-OX, GY, IW, 1, 'rgba(0,0,0,.15)');
    }
    function korbBild(cx, y, schief) {
      var x = Math.round(cx - 6), dy = schief ? Math.round(Math.sin(schief) * 1) : 0;
      R(x + 2, y - 3 + dy, 1, 3, '#7a4a1a'); R(x + 9, y - 3 - dy, 1, 3, '#7a4a1a'); R(x + 3, y - 4, 6, 1, '#7a4a1a');
      R(x, y, 12, 5, '#c8863a'); R(x, y, 12, 1, '#e8a85a');
      R(x + 1, y + 2, 10, 1, '#9a5a22'); R(x + 3, y + 1, 1, 4, '#9a5a22'); R(x + 7, y + 1, 1, 4, '#9a5a22');
    }
    function matti(t) {
      var mood = g.modus === 'ende' ? 'korb' : g.mood;
      var bob = g.lauf > 0 && richtung() ? Math.floor(t * 10) % 2 : 0;
      var y = GY - MATTI_H + bob;
      R(g.mx + 3, GY - 1, 26, 2, 'rgba(0,0,0,.2)');
      Pixel.draw(ctx, Sprites.matti(mood), OX + g.mx, OY + y, 2, g.blick < 0);
      // Korb-Stapel auf dem Kopf
      var n = Math.min(g.koerbe, MAX_STAPEL), schw = Math.sin(t * 6) * (g.wackel * 4 + (richtung() ? 0.8 : 0.2));
      for (var i = 0; i < n; i++) korbBild(mitte() + schw * (i / 4), y - 5 - i * 4, i);
      if (g.koerbe > MAX_STAPEL) Pixel.text(ctx, 'X' + g.koerbe, OX + mitte() + 9, OY + y - 5 - n * 4, 1, '#14141a');
    }
    function maedchen(t) {
      var gi = g.girl; if (!gi) return;
      var bob = gi.zustand === 'kommt' || gi.zustand === 'geht' ? Math.floor(gi.lauf * 8) % 2 : 0;
      R(gi.x + 2, GY - 1, 28, 2, 'rgba(0,0,0,.2)');
      Pixel.draw(ctx, Sprites.maedchen(gi.nr, gi.mood), OX + gi.x, OY + GY - 56 - bob, 2);
      if (gi.zustand === 'wartet' && Math.abs(mitte() - (gi.x + 16)) > 60) {
        var hop = Math.floor(t * 4) % 2;
        Pixel.text(ctx, 'HIN DA!', OX + gi.x - 26 + hop, OY + GY - 30, 1, '#14141a');
      }
    }
    function meter(t) {
      var m = g.meter; if (!m) return;
      var w = 90, x = 90 - w / 2, y = 16, nah = Math.abs(mitte() - (g.girl.x + 16)) <= 60;
      R(x - 2, y - 2, w + 4, 14, '#14141a'); R(x, y, w, 10, '#f4f2ea');
      var z0 = (m.mitte - m.breite / 2) * w, zp = m.breite * 0.3 * w;
      R(x + z0, y, m.breite * w, 10, '#ffb8c8'); R(x + m.mitte * w - zp, y, zp * 2, 10, '#f06a8a');
      R(x + m.pos * w - 1, y - 3, 2, 16, nah ? '#14141a' : '#8a8a8a');
      R(x, y + 12, w * Math.max(0, m.rest / m.max), 2, m.rest < 1.2 ? '#e8303a' : '#14141a');
      Pixel.text(ctx, nah ? 'JETZT ANSPRECHEN!' : 'GEH ZU ' + g.girl.name, OX + 90, OY + y - 9, 1, nah ? '#c83a6a' : '#14141a', 'center');
    }
    function render(t) {
      ctx.imageSmoothingEnabled = false;
      hintergrund(t);
      g.liegen.forEach(function (l) { ctx.globalAlpha = Math.max(0, 1 - l.t / 2); korbBild(l.x, GY - 5, 0); ctx.globalAlpha = 1; });
      maedchen(t);
      matti(t);
      g.koerbeFlug.forEach(function (k) { if (k.verz <= 0) korbBild(k.x, k.y - 2, k.rot); });
      g.herzen.forEach(function (h) { ctx.globalAlpha = Math.max(0, 1 - h.t / 1.3); R(h.x, h.y, 1, 1, '#f06a8a'); R(h.x + 2, h.y, 1, 1, '#f06a8a'); R(h.x - 1, h.y + 1, 5, 1, '#f06a8a'); R(h.x, h.y + 2, 3, 1, '#f06a8a'); R(h.x + 1, h.y + 3, 1, 1, '#f06a8a'); ctx.globalAlpha = 1; });
      if (g.modus === 'spiel') meter(t);
    }
    function hud() {
      $('ego').style.width = Math.max(0, g.ego) + '%'; $('punkte').textContent = g.punkte;
      $('egoBox').classList.toggle('knapp', g.ego < 30 && g.modus === 'spiel');
      $('koerbe').textContent = g.koerbe + (g.koerbe === 1 ? ' KORB' : ' KÖRBE'); $('groesse').textContent = groesse(g.koerbe) + ' M';
      g.blasen.forEach(blasenPos);
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      update(dt); render(g.t); hud();
      raf = requestAnimationFrame(tick);
    }

    // ---------- Bildschirme ----------
    function figur(mood) { var img = Sprites.matti(mood), c = document.createElement('canvas'); c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); return c; }
    function intro() {
      ovl.classList.remove('aus');
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="mt-karte"><h1>Korbsammler</h1><div class="unter">Matti ist 1,55 m groß und hat 2 m Selbstbewusstsein. Noch ca. 30 Sekunden.</div><div data-el="fig"></div>' +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>🚶 <b>A/D</b> oder <b>←/→</b>: Matti läuft. Erst nah ran – sonst sieht sie ihn gar nicht.</li>' +
        '<li>💬 <b>Leertaste</b>, wenn der Zeiger im <b style="color:#c83a6a">pinken Feld</b> ist. Mitte = perfekter Spruch.</li>' +
        '<li>🧺 Danach gibt’s einen Korb. Immer. Fang ihn mit dem Kopf – die Körbe stapeln sich und machen Matti größer.</li>' +
        '<li>💔 Cringe-Spruch, verpasster Korb oder zu lange gezögert kostet EGO. Ego 0 = ab nach Hause.</li></ul>' +
        '<button class="px-btn" data-act="los">Selbstbewusst loslegen</button></div>';
      ovl.querySelector('[data-el=fig]').appendChild(figur('flirt'));
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.ende) { g.blasen.forEach(function (b) { b.el.remove(); }); reset(); }
      g.modus = 'spiel'; ovl.classList.add('aus'); $('hud').classList.add('an'); allesLos();
      melde('SCHULHOF', 'Große Pause · Matti ist bereit');
      spaeter(function () { if (g.modus === 'spiel') sag('matti', pick(['Heute klappt’s. Safe.', 'Ich bin ein Alpha. Ein kleiner.', 'Okay Matti, die wollen dich alle.']), 1.6); }, 700);
      Pixel.sfx.tone(392, 0.08, 'square', 0.05); Pixel.sfx.tone(523, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(659, 0.15, 'square', 0.05, null, 0.18);
    }
    function ende() {
      if (g.modus === 'ende') return;
      g.modus = 'ende'; g.ende = true; g.meter = null; allesLos();
      var best = +Pixel.get(BEST_KEY, 0), neu = g.punkte > best; if (neu) Pixel.set(BEST_KEY, g.punkte);
      sag('jungs', 'Kopf hoch, Matti! Ah ne, kommst eh nicht hoch.', 2.2, 'gruen');
      Pixel.sfx.tone(392, 0.3, 'triangle', 0.06, 370); Pixel.sfx.tone(349, 0.3, 'triangle', 0.06, 330, 0.3); Pixel.sfx.tone(294, 0.7, 'triangle', 0.06, 220, 0.6);
      spaeter(function () {
        $('hud').classList.remove('an'); ovl.classList.remove('aus');
        ovl.innerHTML = '<div class="mt-karte"><h1>Ego am Boden</h1><div class="unter">Für heute reicht’s. Morgen gibt’s neue Körbe.</div><div data-el="fig"></div>' +
          '<div class="zitat"><b>Matti:</b> „Die sind nur eingeschüchtert von so viel Mann auf so wenig Fläche.“</div>' +
          '<div class="zeile"><span>Punkte</span><b>' + g.punkte + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Anmachversuche</span><b>' + g.versuche + '</b></div>' +
          '<div class="zeile"><span>Perfekte Sprüche</span><b>' + g.perfekt + '</b></div>' +
          '<div class="zeile"><span>Körbe gefangen</span><b>' + g.gefangen + '</b></div>' +
          '<div class="zeile"><span>Größe mit Körben</span><b>' + groesse(g.koerbe) + ' m</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, g.punkte) + '</b></div>' +
          '<button class="px-btn" data-act="los">Nochmal probieren</button><button class="px-btn" data-act="exit" style="margin-top:8px">Menü</button></div>';
        ovl.querySelector('[data-el=fig]').appendChild(figur('korb'));
      }, 1400);
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
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize); window.addEventListener('blur', allesLos);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__matti = { g: function () { return g; }, halten: function () { return halten; }, ansprechen: ansprechen };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.matti = { start: start };
})();
