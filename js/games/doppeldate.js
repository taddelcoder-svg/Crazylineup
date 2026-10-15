// Damon & Moritz: Chaos-Dinner – 2D-Pixel-Date im Restaurant.
// Moritz (blond, Zahnspange) und Damon (Metal-Shirt) haben ein Date – miteinander.
// Sie stellen sich gegenseitig Fragen (Antwort mit 1/2/3 oder antippen), dazwischen passieren Pannen:
// Soße im Gesicht, Football-Ticker, Moritz redet ohne Pause, Kerze brennt … schnell reagieren (A = Moritz, L = Damon, Leertaste = Tisch).
// Beide Herzen müssen über drei Gänge oben bleiben.
(function () {
  'use strict';
  var BEST_KEY = 'crazylineup.doppeldate.best';
  var GANG_ZEIT = 45;
  var GAENGE = [
    { name: 'Vorspeise', essen: 'Bruschetta', farbe: ['#c8762a', '#d83a2a'] },
    { name: 'Hauptgang', essen: 'Spaghetti', farbe: ['#e8c060', '#c8301e'] },
    { name: 'Dessert', essen: 'Tiramisu', farbe: ['#6a3a20', '#f2e2c0'] }
  ];

  // ---------- Figuren (20 breit, Oberkörper; sitzen hinter dem Tisch) ----------
  var FIG = {
    moritz: {
      name: 'Moritz', augen: 9, mund: 13,
      pal: { H: '#e8c068', h: '#f6dc98', d: '#c89a48', S: '#f2c8b0', s: '#dcaa90', W: '#ffffff', E: '#4a6a8a', B: '#9aa0a8', M: '#b06060', O: '#401818',
        T: '#1c1c20', t: '#34343c', P: '#e8e8e8', p: '#8a8a8a', R: '#f0a0a0', Z: '#e87a8a' },
      rows: [
        '.....hHhHHHhH.......', '...hHHHHHHHHHHh.....', '..hHHHdHHHHHHHHHh...', '..HHHHHHHHHHHHHHHh..', '.hHHHHHHHHHHHHHHHHh.',
        '.HHHdHHHHHHHHHHHHHH.', '.HHSSHHHHHHHHHHHHSH.', '.HSSSSSSHHHHHHHSSSH.', '..SSSSSSSSSSSHHSSS..', '.sSSWESSSSSSWESSSSs.',
        '.sSSSSSSSSSSSSSSSSs.', '..SSSRSSSssSSSRSSS..', '..SSSSSSSSSSSSSSSS..', '..SSSSSMMMMMSSSSSS..', '...SSSSSSSSSSSSSS...',
        '....ssSSSSSSSSss....', '.......ssssss.......', '....TTTTTssTTTTT....', '..TTTTTTTTTTTTTTTT..', '.TTTTTTTPPPPTTTTTTT.',
        '.TTTTTTTPppPTTTTTTT.', 'TTTtTTTTPPPPTTTTtTTT', 'TTTtTTTTTTTTTTTTtTTT', 'TTTTTTTTTTTTTTTTTTTT', 'TTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTT'
      ],
      moods: {
        zu: { 9: '.sSSEESSSSSSEESSSSs.' },
        froh: { 13: '..SSSSOWBWBWOSSSSS..', 14: '...SSSSOOOOSSSSSS...' },
        verliebt: { 9: '.sSSZZSSSSSSZZSSSSs.', 13: '..SSSSOWBWBWOSSSSS..', 14: '...SSSSOOOOSSSSSS...' },
        genervt: { 9: '.sSSsESSSSSSsESSSSs.', 13: '..SSSSSMMMMMMSSSSS..' },
        rede: { 13: '..SSSSSSOOOSSSSSSS..' },
        schock: { 9: '.sSWWESSSSSWWESSSSs.', 13: '..SSSSSSOOSSSSSSSS..', 14: '...SSSSSOOSSSSSSS...' },
        zunge: { 9: '.sSSEESSSSSSEESSSSs.', 13: '..SSSSOBBBBOSSSSSS..', 14: '...SSSSOZZOSSSSSS...', 15: '....ssSSZZSSSSss....' }
      }
    },
    damon: {
      name: 'Damon', augen: 7, mund: 11,
      pal: { H: '#3a2618', h: '#5a3a26', f: '#7a6050', S: '#eec2a4', s: '#d6a486', W: '#ffffff', E: '#2a1a10', M: '#a86058', O: '#401818',
        T: '#f2f2f0', t: '#d0d0d0', R: '#c81e2a', r: '#8a1018', K: '#202020', k: '#6a6a6a', Z: '#e8304a' },
      rows: [
        '....hHHHHHHHHh......', '...hHHHHHHHHHHHh....', '...HHHHHHHHHHHHHH...', '..fHHHHHHHHHHHHHHf..', '..fSSSSSSSSSSSSSSf..',
        '..fSSSSSSSSSSSSSSf..', '..SHHHHSSSSSSHHHHS..', '.sSSWESSSSSSSSWESSs.', '.sSSSSSSSSSSSSSSSSs.', '..SSSSSSssSSSSSSSS..',
        '..SSSSSSSsSSSSSSSS..', '..SSSSSMMMMMSSSSSS..', '...SSSSSSSSSSSSSS...', '...sSSSSSSSSSSSSs...', '.....ssSSSSSSss.....',
        '.......ssssss.......', '...TTTTTTssTTTTTT...', '.TTTTTTTTTTTTTTTTTT.', 'TTTTTRRrRRRRrRRTTTTT', 'TTTTRrRRrRRrRRRrTTTT',
        'TTTtTTKkKKKKkKTTTtTT', 'TTTtTKKkKWWKkKKTTtTT', 'TTTTTTKKKKKKKKTTTTTT', 'TTTTTTTKkKKkKTTTTTTT', 'TTTTTTTTTTTTTTTTTTTT',
        'TTTTTTTTTTTTTTTTTTTT'
      ],
      moods: {
        zu: { 7: '.sSSEESSSSSSSSEESSs.' },
        froh: { 11: '..SSSSSOWWWWOSSSSS..' },
        verliebt: { 7: '.sSSZZSSSSSSSSZZSSs.', 11: '..SSSSSOWWWWOSSSSS..' },
        genervt: { 6: '..SSHHHSSSSSSHHHSS..', 7: '.sSSsESSSSSSSSsESSs.' },
        rede: { 11: '..SSSSSSOOOSSSSSSS..' },
        schock: { 7: '.sSWWESSSSSSSWWESSs.', 11: '..SSSSSSOOSSSSSSSS..' },
        metal: { 6: '..SHHHHSSSSSSHHHHS..', 7: '.sSSEESSSSSSSSEESSs.', 11: '..SSSSOWWWWWWOSSSS..', 12: '...SSSSOOOOOOSSSS...' }
      }
    }
  };
  function figur(id, mood) {
    var f = FIG[id], o = (mood && f.moods[mood]) || {};
    return Pixel.sprite('dd-' + id + '-' + (mood || 'n'), f.rows.map(function (r, i) { return o[i] || r; }), f.pal);
  }

  // ---------- Fragen: FRAGEN[x] = Fragen AN x (der andere fragt und bewertet die Antwort) ----------
  var FRAGEN = {
    damon: [ // Moritz fragt – Moritz mag Physik, Reden, Luxus
      ['Was ist dein Lieblingssport?', [['Football – das ist angewandte Physik!', 2], ['Football. Ich erklär dir die Regeln.', 1], ['Physik ist kein Sport.', -1]]],
      ['Wohin würdest du gern reisen?', [['USA-Roadtrip – du darfst planen.', 2], ['Texas. Nur Texas.', 1], ['Nirgendwohin, Fliegen ist Geldverschwendung.', -1]]],
      ['Tempolimit auf der Autobahn?', [['Okay … mit dem Bremsweg hast du ein Argument.', 2], ['Ich fahr eh nur Pick-up.', 1], ['Niemals. Freiheit!', -1]]],
      ['Was hältst du von Physik?', [['Erklär’s mir. Ich hör zu.', 2], ['Nur bei Wurfparabeln im Football.', 1], ['Langweilig.', -2]]],
      ['Wie viel willst du später verdienen?', [['Genug, um dich zum Super Bowl einzuladen.', 2], ['Ich werd Footballprofi. Millionen.', 1], ['Geld ist mir egal.', -1]]],
      ['Darf ich dir kurz was erzählen?', [['Klar, red ruhig. Stundenlang.', 2], ['Wenn’s kurz ist …', 1], ['Bitte nicht schon wieder.', -2]]],
      ['Was isst du am liebsten?', [['Burger – ich lad dich ein.', 2], ['Steak vom Grill.', 1], ['Egal, Hauptsache Fleisch.', -1]]],
      ['Lieblingsfilm?', [['Interstellar – seit du’s mir erklärt hast.', 2], ['Irgendwas mit Explosionen.', 1], ['Filme sind Zeitverschwendung.', -1]]]
    ],
    moritz: [ // Damon fragt – Damon mag Football, USA, Action
      ['Guckst du Football?', [['Klar! Super Bowl, die ganze Nacht.', 2], ['Nur wegen der Flugbahn-Physik.', 1], ['Ist das das mit dem Eier-Ball?', -1]]],
      ['USA oder Europa?', [['USA – Roadtrip mit dir!', 2], ['Hauptsache erste Klasse.', 1], ['Europa. Und ich erklär dir, warum …', -1]]],
      ['Tempolimit – ja oder nein?', [['Für dich: heute mal nein.', 2], ['Können wir uns auf 150 einigen?', 1], ['Ja! Physikalisch ist das eindeutig, weil …', -1]]],
      ['Grillen oder vegan?', [['Grillen! Ich bring Wagyu mit.', 2], ['Vegan, aber ich klau dein Steak.', 1], ['Vegan. Ich erklär dir die CO₂-Bilanz.', -1]]],
      ['Kannst du mal kurz still sein?', [['… (nickt stumm)', 2], ['Ich versuch’s. Drei Sekunden.', 1], ['Klar! Also, wo war ich, Quantenphysik …', -2]]],
      ['Was würdest du mit viel Geld machen?', [['Uns Super-Bowl-Tickets kaufen.', 2], ['Eine Yacht. Mit Physiklabor.', 1], ['Erstmal einen Vortrag über Zinsen halten.', -1]]],
      ['Actionfilm heute Abend?', [['Ja! Je mehr Explosionen, desto besser.', 2], ['Nur, wenn die Physik stimmt.', 1], ['Lieber eine Doku über Teilchen.', -1]]],
      ['Würdest du mit mir trainieren gehen?', [['Klar, ich trag die Hantel. Eine.', 2], ['Ich erklär dir dabei die Hebelgesetze.', 1], ['Sport ist nicht so meins.', -1]]]
    ]
  };
  var PLAPPER = ['Wusstest du, dass Licht 8 Minuten von der Sonne braucht?', 'E = mc², das heißt im Grunde …', 'Also, Schwarze Löcher sind ja eigentlich …',
    'Kurzer Funfact zur Entropie:', 'Der Teller ist übrigens ein super Wärmespeicher …', 'Mein Depot ist diese Woche 3 % hoch!', 'Und DESHALB ist der Himmel blau.',
    'Weißt du, wie viel Energie in dieser Kerze steckt?', 'Ich hab gestern wieder Quantenphysik geguckt …'];
  var DAMON_NICKT = ['Mhm.', 'Krass.', 'Okay …', 'Aha.', '*nickt*'];
  var PARTNER = { moritz: 'damon', damon: 'moritz' };
  var REAKTION = {
    moritz: { 2: ['Faszinierend!', 'Physikalisch korrekt!', 'Haha, nice!'], 1: ['Hm, okay.', 'Interessant …', 'Aha.'], '-1': ['Äh …', 'Okaaay.', 'Schade.'], '-2': ['Ernsthaft?!', 'Das tut weh.', 'Ich geh mal kurz aufs Klo.'] },
    damon: { 2: ['Touchdown!', 'Respekt.', 'Gefällt mir.'], 1: ['Hm. Okay.', 'Kann man machen.', 'Joa.'], '-1': ['…', 'Echt jetzt?', 'Hm.'], '-2': ['Nein.', 'Foul!', 'Ich ruf mir gleich ein Taxi.'] }
  };

  // ---------- Pannen ----------
  // wer: moritz/damon/tisch · taste: a/l/leer · schaden: welches Date verliert Herzen
  var PANNEN = [
    { id: 'sosse', wer: 'moritz', txt: 'Soße im Gesicht!', knopf: '🧻 Serviette', schaden: ['damon'], gang: [1] },
    { id: 'spange', wer: 'moritz', txt: 'Spinat in der Zahnspange!', knopf: '😬 Weg damit', schaden: ['damon'] },
    { id: 'zunge', wer: 'moritz', txt: 'Pärchenfoto! Zunge NICHT rausstrecken!', knopf: '🙂 Normal gucken', schaden: ['damon'] },
    { id: 'handy', wer: 'damon', txt: 'Damons Handy: Football-Liveticker auf voller Lautstärke!', knopf: '🔇 Stumm', schaden: ['moritz'] },
    { id: 'plapper', wer: 'moritz', txt: 'Moritz redet seit 5 Minuten über Quantenphysik!', knopf: '🤐 Luft holen', schaden: ['damon'] },
    { id: 'glas', wer: 'damon', txt: 'Damon kippt sein Glas um!', knopf: '🫗 Auffangen', schaden: ['moritz'] },
    { id: 'rose', wer: 'damon', txt: 'Rosenverkäufer! Chance für Damon.', knopf: '🌹 Rose kaufen', schaden: [], bonus: 'moritz' },
    { id: 'geiger', wer: 'tisch', txt: 'Geiger spielt Kitsch direkt am Tisch!', knopf: '💶 Wegschicken', schaden: ['damon'] },
    { id: 'kerze', wer: 'tisch', txt: 'Serviette fängt Feuer!', knopf: '🧯 Löschen', schaden: ['moritz', 'damon'] },
    { id: 'kellner', wer: 'tisch', txt: 'Kellner bringt das falsche Essen!', knopf: '🙅 Zurück damit', schaden: ['moritz', 'damon'] }
  ];
  var TASTE = { moritz: 'A', damon: 'L', tisch: 'Leer' };

  var CSS = [
    '.dd{position:absolute;inset:0;overflow:hidden;background:#1a0e10;font-family:"Pixelify Sans","Barlow Semi Condensed",sans-serif;color:#fff;-webkit-user-select:none;user-select:none;touch-action:manipulation}',
    '.dd canvas{position:absolute;left:0;top:0;image-rendering:pixelated;image-rendering:crisp-edges}',
    '.dd-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:calc(10px + env(safe-area-inset-top)) 10px 0;pointer-events:none;z-index:20}',
    '.dd-top button{pointer-events:auto}',
    '.dd-gang{text-align:center;background:rgba(30,10,14,.82);border:3px solid #f2c84a;padding:5px 14px 7px;box-shadow:4px 4px 0 rgba(0,0,0,.4)}',
    '.dd-gang small{display:block;font:8px/1 "Press Start 2P",monospace;color:#f2c84a;letter-spacing:.08em;margin-bottom:4px}',
    '.dd-gang b{font-size:20px;font-weight:700}',
    '.dd-gang i{display:block;height:5px;background:rgba(255,255,255,.18);margin-top:5px}',
    '.dd-gang i span{display:block;height:100%;background:#f2c84a}',
    '.dd-pkt{position:absolute;left:50%;top:calc(76px + env(safe-area-inset-top));transform:translateX(-50%);font:10px/1 "Press Start 2P",monospace;text-shadow:2px 2px 0 #000;z-index:20}',
    '.dd-herz{position:absolute;transform:translate(-50%,-100%);z-index:15;pointer-events:none;text-align:center}',
    '.dd-herz small{display:block;font:8px/1 "Press Start 2P",monospace;text-shadow:2px 2px 0 #000;margin-bottom:3px}',
    '.dd-herz div{width:70px;height:10px;background:#2a1418;border:2px solid #fff;box-shadow:2px 2px 0 rgba(0,0,0,.5)}',
    '.dd-herz div span{display:block;height:100%;background:#e8304a;transition:width .25s}',
    '.dd-herz.knapp div span{animation:ddBlink .4s infinite alternate}',
    '@keyframes ddBlink{to{opacity:.35}}',
    '.dd-herz em{display:block;font-style:normal;font-size:12px;opacity:.85;margin-top:2px;text-shadow:1px 1px 0 #000;white-space:nowrap}',
    '.dd-blase{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#1a0e10;border:3px solid #1a0e10;padding:6px 9px;font-size:15px;line-height:1.15;',
    ' max-width:min(46vw,260px);z-index:18;pointer-events:none;box-shadow:3px 3px 0 rgba(0,0,0,.35);animation:ddPop .15s}',
    '.dd-blase:after{content:"";position:absolute;left:50%;bottom:-9px;width:10px;height:10px;background:#fff;border-right:3px solid #1a0e10;border-bottom:3px solid #1a0e10;transform:translateX(-50%) rotate(45deg)}',
    '@keyframes ddPop{from{transform:translate(-50%,-80%) scale(.5)}}',
    '.dd-frage{position:absolute;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(560px,calc(100% - 20px));z-index:25;',
    ' background:rgba(30,10,14,.92);border:3px solid #fff;box-shadow:5px 5px 0 rgba(0,0,0,.45);padding:8px 10px 10px;display:none}',
    '.dd-frage.an{display:block;animation:ddHoch .18s}',
    '@keyframes ddHoch{from{transform:translate(-50%,30px);opacity:0}}',
    '.dd-frage .wer{font:8px/1 "Press Start 2P",monospace;color:#f2c84a;margin-bottom:6px;display:flex;justify-content:space-between}',
    '.dd-frage .zeit{height:5px;background:rgba(255,255,255,.18);margin-bottom:7px}',
    '.dd-frage .zeit span{display:block;height:100%;background:#4ad8a0}',
    '.dd-frage button{display:block;width:100%;text-align:left;margin-top:6px;background:#f6ecd8;color:#1a0e10;border:3px solid #1a0e10;padding:7px 10px;',
    ' font:17px/1.15 "Pixelify Sans",sans-serif;cursor:pointer;box-shadow:3px 3px 0 rgba(0,0,0,.35)}',
    '.dd-frage button b{display:inline-block;width:22px;font:10px/1 "Press Start 2P",monospace;color:#a8303a}',
    '.dd-frage button:active{transform:translate(2px,2px);box-shadow:1px 1px 0 rgba(0,0,0,.35)}',
    '.dd-panne{position:absolute;transform:translate(-50%,-50%);z-index:22;background:#e8304a;color:#fff;border:3px solid #fff;padding:8px 10px;cursor:pointer;',
    ' font:16px/1.1 "Pixelify Sans",sans-serif;box-shadow:4px 4px 0 rgba(0,0,0,.45);white-space:nowrap;animation:ddWackel .3s infinite alternate}',
    '.dd-panne small{display:block;font-size:12px;opacity:.95;margin-bottom:3px}',
    '.dd-panne kbd{font:9px/1 "Press Start 2P",monospace;background:#fff;color:#e8304a;padding:2px 4px;margin-left:6px}',
    '.dd-panne i{display:block;height:4px;background:rgba(255,255,255,.35);margin-top:5px}',
    '.dd-panne i span{display:block;height:100%;background:#fff}',
    '.dd-panne.chance{background:#2f9a5c}',
    '@keyframes ddWackel{from{transform:translate(-50%,-50%) rotate(-2deg)}to{transform:translate(-50%,-50%) rotate(2deg)}}',
    '.dd-meldung{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);z-index:24;text-align:center;pointer-events:none;opacity:0;white-space:nowrap}',
    '.dd-meldung b{display:block;font:clamp(14px,3.6vw,22px)/1.2 "Press Start 2P",monospace;color:#f2c84a;text-shadow:3px 3px 0 #000}',
    '.dd-meldung small{display:block;font-size:18px;text-shadow:2px 2px 0 #000;margin-top:8px}',
    '.dd-meldung.zeigen{animation:ddMeld 1.8s ease-out}',
    '@keyframes ddMeld{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}12%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}80%{opacity:1}100%{opacity:0}}',
    '.dd-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(20,6,10,.6);z-index:40;padding:16px}',
    '.dd-ovl.aus{display:none}',
    '.dd-karte{width:min(460px,100%);background:#f6ecd8;color:#1a0e10;border:4px solid #1a0e10;box-shadow:8px 8px 0 #a8303a;padding:16px 18px;text-align:center}',
    '.dd-karte h1{margin:4px 0 2px;font:clamp(18px,5vw,26px)/1.25 "Press Start 2P",monospace;color:#a8303a}',
    '.dd-karte .unter{font-size:18px;margin:8px 0}',
    '.dd-karte .figs{display:flex;justify-content:center;gap:6px;margin:6px 0}',
    '.dd-karte .figs canvas{position:static;width:60px;height:auto}',
    '.dd-karte ul{list-style:none;padding:0;margin:8px 0 12px;text-align:left;font-size:16px;line-height:1.35}',
    '.dd-karte .zeile{display:flex;justify-content:space-between;border-top:2px dashed rgba(26,14,16,.3);padding:6px 0;font-size:18px}',
    '.dd-karte .zeile b{font:12px/1.5 "Press Start 2P",monospace;color:#a8303a}',
    '.dd-karte .px-btn{width:100%;margin-top:8px}'
  ].join('\n');

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function mischen(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function start(root, onExit) {
    var style = document.createElement('style'); style.textContent = CSS;
    root.innerHTML =
      '<div class="dd"><canvas></canvas>' +
      '<div class="dd-top"><button class="ico" data-act="exit" aria-label="Zurück zum Menü">‹</button>' +
        '<div class="dd-gang" data-el="gangBox" style="visibility:hidden"><small data-el="gangNr">GANG 1/3</small><b data-el="gang">Vorspeise</b><i><span data-el="gangZeit"></span></i></div>' +
        '<button class="ico" data-act="ton" aria-label="Ton an/aus"></button></div>' +
      '<div class="dd-pkt" data-el="pkt"></div>' +
      '<div class="dd-herz" data-el="herz-moritz"><small>MORITZ</small><div><span></span></div><em>mag: Physik, Reden, Luxus</em></div>' +
      '<div class="dd-herz" data-el="herz-damon"><small>DAMON</small><div><span></span></div><em>mag: Football, USA, Action</em></div>' +
      '<div class="dd-frage" data-el="frage"></div>' +
      '<div class="dd-meldung" data-el="meldung"></div>' +
      '<div class="dd-ovl" data-el="ovl"></div></div>';
    root.appendChild(style);
    var wrap = root.querySelector('.dd'), cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
    var $ = function (n) { return root.querySelector('[data-el=' + n + ']'); };
    var ovl = $('ovl'), frageEl = $('frage'), tonBtn = root.querySelector('[data-act=ton]');
    var alive = true, raf = 0, last = performance.now();

    // ---------- Layout ----------
    var S = 2, IW = 0, IH = 0, k = 2, tische = [], plaetze = {}, bg = null;
    function resize() {
      var SW = wrap.clientWidth, SH = wrap.clientHeight;
      S = Math.max(2, Math.floor(Math.min(SH / 210, SW / 150)));
      IW = Math.ceil(SW / S); IH = Math.ceil(SH / S);
      cv.width = IW; cv.height = IH; cv.style.width = IW * S + 'px'; cv.style.height = IH * S + 'px';
      tische = []; plaetze = {};
      var top = Math.round(IH * (IW >= 300 ? 0.62 : 0.56)), slot = IW / 2;
      k = clamp(Math.floor(Math.min(slot * 0.62 / 20, (top - 50) / 27)), 1, 8);
      tische.push({ top: top, x0: Math.round(IW * 0.08), x1: Math.round(IW * 0.92), ids: ['moritz', 'damon'] });
      plaetze.moritz = { x: Math.round(IW * 0.3), t: 0 }; plaetze.damon = { x: Math.round(IW * 0.7), t: 0 };
      bg = null;
    }
    function figPos(id) { // Kopf-Oberkante und Mitte in Canvas-Pixeln
      var p = plaetze[id], t = tische[p.t], img = figur(id), h = img.height * k;
      return { x: p.x, top: t.top + 3 * k - h, unten: t.top + 3 * k, h: h };
    }
    function screen(x, y) { return { x: x * S, y: y * S }; }

    // ---------- Hintergrund (vorgerendert) ----------
    function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
    function hintergrund() {
      bg = document.createElement('canvas'); bg.width = IW; bg.height = IH;
      var c = bg.getContext('2d'), wand = Math.round(IH * 0.78);
      // Tapete dunkelrot mit Muster
      R(c, 0, 0, IW, wand, '#5a1a22');
      for (var y = 0; y < wand; y += 12) for (var x = (y / 12) % 2 ? 6 : 0; x < IW; x += 12) { R(c, x + 4, y + 4, 2, 2, '#6e2630'); R(c, x + 5, y + 3, 1, 4, '#6e2630'); R(c, x + 3, y + 5, 4, 1, '#6e2630'); }
      // Holzvertäfelung unten
      var v = Math.round(IH * 0.5);
      R(c, 0, v, IW, wand - v, '#4a2a18'); R(c, 0, v, IW, 3, '#7a4a28'); R(c, 0, v + 3, IW, 1, '#2a160c');
      for (x = 4; x < IW; x += 30) { R(c, x, v + 8, 24, wand - v - 12, '#3e2214'); R(c, x, v + 8, 24, 1, '#2a160c'); }
      // Fenster mit Nachtstadt
      var fw = Math.min(90, Math.round(IW * 0.22)), fh = Math.round(IH * 0.26), fx = [Math.round(IW * 0.25 - fw / 2), Math.round(IW * 0.75 - fw / 2)], fy = Math.round(IH * 0.06);
      fx.forEach(function (x0, n) {
        R(c, x0 - 3, fy - 3, fw + 6, fh + 6, '#2a160c'); R(c, x0, fy, fw, fh, '#141a3a');
        for (var i = 0; i < fh; i++) R(c, x0, fy + i, fw, 1, i < fh * 0.6 ? '#1a2250' : '#24204a');
        if (n === 0) { R(c, x0 + fw - 18, fy + 6, 8, 8, '#f6eec8'); R(c, x0 + fw - 16, fy + 6, 6, 6, '#141a3a'); }
        for (var s = 0; s < 14; s++) R(c, x0 + ((s * 37 + n * 13) % fw), fy + ((s * 23) % Math.round(fh * 0.5)), 1, 1, '#e8e8ff');
        var hx = x0;
        while (hx < x0 + fw) { var bw = 8 + ((hx * 7) % 12), bh = 10 + ((hx * 13) % Math.round(fh * 0.5)); R(c, hx, fy + fh - bh, bw, bh, '#0c0e22'); for (var wy = fy + fh - bh + 3; wy < fy + fh - 2; wy += 4) for (var wx = hx + 2; wx < hx + bw - 2; wx += 3) if ((wx * wy) % 5 === 0) R(c, wx, wy, 1, 2, '#f2d27a'); hx += bw + 1; }
        R(c, x0 + fw / 2 - 1, fy, 2, fh, '#2a160c'); R(c, x0, fy + fh / 2 - 1, fw, 2, '#2a160c');
      });
      // Bild an der Wand (Pizza-Gemälde) und Pflanze
      var bx = Math.round(IW / 2 - 18), by = Math.round(IH * 0.1);
      R(c, bx - 3, by - 3, 42, 32, '#c89a48'); R(c, bx, by, 36, 26, '#e8dcc0');
      for (var a = 0; a < 6; a++) { var w2 = a / 6 * Math.PI * 2; R(c, bx + 18 + Math.cos(w2) * 7 - 2, by + 13 + Math.sin(w2) * 7 - 2, 4, 4, a % 2 ? '#c8301e' : '#e8c060'); }
      R(c, bx + 15, by + 10, 6, 6, '#3a8a3a');
      // Boden
      R(c, 0, wand, IW, IH - wand, '#3a2018');
      for (y = wand; y < IH; y += 6) for (x = ((y - wand) / 6) % 2 ? 0 : 6; x < IW; x += 12) R(c, x, y, 6, 6, '#4a2a1e');
      // Tische
      tische.forEach(function (t) {
        var tiefe = Math.max(12, k * 6), drape = Math.max(14, k * 8);
        for (var x2 = t.x0; x2 < t.x1; x2 += 4) for (var y2 = 0; y2 < tiefe; y2 += 4) R(c, x2, t.top + y2, 4, 4, ((x2 - t.x0) / 4 + y2 / 4) % 2 ? '#f4ece0' : '#d83a3a');
        R(c, t.x0, t.top, t.x1 - t.x0, 1, '#ffffff');
        for (x2 = t.x0; x2 < t.x1; x2 += 4) for (y2 = 0; y2 < drape; y2 += 4) R(c, x2, t.top + tiefe + y2, 4, 4, ((x2 - t.x0) / 4 + y2 / 4) % 2 ? '#e4dcd0' : '#b82e2e');
        R(c, t.x0, t.top + tiefe + drape, t.x1 - t.x0, 2, '#2a1210');
        for (x2 = t.x0 + 4; x2 < t.x1; x2 += 8) R(c, x2, t.top + tiefe + drape, 4, 3, x2 % 16 ? '#b82e2e' : '#e4dcd0');
        t.tiefe = tiefe;
      });
    }

    // ---------- Zustand ----------
    var g;
    function reset() {
      g = {
        modus: 'intro', t: 0, gang: 0, gangT: GANG_ZEIT, herz: { moritz: 70, damon: 70 }, punkte: 0, combo: 0,
        frage: null, fragT: 2.5, wer: 'moritz', pannen: [], pannT: 5, blasen: [], mood: {}, moodT: {}, rede: {}, blinz: {},
        benutzt: { moritz: [], damon: [] }, stat: { gut: 0, cringe: 0, pannen: 0, verpasst: 0 }, ende: false, kellnerX: -40, kellnerZiel: -40, kellnerTeller: false
      };
    }
    function mood(id, m, dauer) { g.mood[id] = m; g.moodT[id] = dauer || 1.6; }
    function herz(id, d) {
      g.herz[id] = clamp(g.herz[id] + d, 0, 100);
      if (d > 0) { mood(id, g.herz[id] > 75 ? 'verliebt' : 'froh', 1.4); funken(id, d); }
      else mood(id, 'genervt', 1.6);
    }
    var funkenListe = [];
    function funken(id, d) {
      var p = figPos(id);
      for (var i = 0; i < Math.min(6, Math.ceil(d / 3)); i++) funkenListe.push({ x: p.x + rnd(-8, 8) * k / 2, y: p.top + rnd(0, 6), vy: -rnd(10, 22), t: 0, life: rnd(0.8, 1.3) });
    }
    var meldT = 0;
    function melde(txt, klein) {
      var el = $('meldung'); el.innerHTML = '<b>' + txt + '</b>' + (klein ? '<small>' + klein + '</small>' : '');
      el.classList.remove('zeigen'); void el.offsetWidth; el.classList.add('zeigen');
      clearTimeout(meldT); meldT = setTimeout(function () { el.classList.remove('zeigen'); }, 1800);
    }
    function blase(id, txt, dauer) {
      g.blasen = g.blasen.filter(function (b) { if (b.id === id) { b.el.remove(); return false; } return true; });
      var el = document.createElement('div'); el.className = 'dd-blase'; el.textContent = txt; wrap.appendChild(el);
      g.blasen.push({ id: id, el: el, t: dauer || 2.4 });
      g.rede[id] = Math.min(2, (dauer || 2.4) * 0.6);
    }

    // ---------- Fragen ----------
    function neueFrage() {
      var junge = g.wer; g.wer = junge === 'moritz' ? 'damon' : 'moritz';
      var liste = FRAGEN[junge], frei = liste.filter(function (f, i) { return g.benutzt[junge].indexOf(i) < 0; });
      if (!frei.length) { g.benutzt[junge] = []; frei = liste; }
      var f = pick(frei); g.benutzt[junge].push(liste.indexOf(f));
      var date = PARTNER[junge];
      g.frage = { junge: junge, date: date, f: f, antw: mischen(f[1]), t: 7.5 - g.gang * 0.8, max: 7.5 - g.gang * 0.8 };
      blase(date, f[0], 3);
      frageEl.innerHTML = '<div class="wer"><span>' + FIG[date].name.toUpperCase() + ' FRAGT · ' + FIG[junge].name.toUpperCase() + ' ANTWORTET</span><span>1 / 2 / 3</span></div>' +
        '<div class="zeit"><span></span></div>' +
        g.frage.antw.map(function (a, i) { return '<button data-antw="' + i + '"><b>' + (i + 1) + '</b>' + a[0] + '</button>'; }).join('');
      frageEl.classList.add('an');
      Pixel.sfx.tone(660, 0.05, 'square', 0.04); Pixel.sfx.tone(880, 0.05, 'square', 0.04, null, 0.06);
    }
    function antworten(i) {
      var fr = g.frage; if (!fr || g.modus !== 'spiel') return;
      var a = fr.antw[i]; if (!a) return;
      g.frage = null; frageEl.classList.remove('an'); g.fragT = rnd(2.5, 4.5);
      blase(fr.junge, a[0], 2.2);
      var w = a[1], delta = { 2: 14, 1: 6, '-1': -9, '-2': -16 }[w];
      setTimeout(function () {
        if (!alive || g.modus !== 'spiel') return;
        herz(fr.date, delta); blase(fr.date, pick(REAKTION[fr.date][w]), 1.6);
        if (w > 0) { g.combo = w === 2 ? g.combo + 1 : 0; var p = w === 2 ? 100 * (1 + Math.min(g.combo, 5) * 0.2) : 40; g.punkte += Math.round(p); if (w === 2) g.stat.gut++; Pixel.sfx.tone(784, 0.08, 'triangle', 0.06); Pixel.sfx.tone(1047, 0.12, 'triangle', 0.06, null, 0.08); }
        else { g.combo = 0; g.stat.cringe++; mood(fr.junge, 'schock', 1.2); Pixel.sfx.tone(220, 0.15, 'square', 0.05, 150); }
        if (fr.junge === 'damon' && w === 2 && Math.random() < 0.5) mood('damon', 'metal', 1.2);
        if (fr.junge === 'moritz' && w === 1 && Math.random() < 0.5) mood('moritz', 'zunge', 1.2);
      }, 650);
    }
    function frageVerpasst() {
      var fr = g.frage; g.frage = null; frageEl.classList.remove('an'); g.fragT = rnd(2.5, 4);
      blase(fr.junge, '… äh …', 1.4); herz(fr.date, -10); g.combo = 0; g.stat.verpasst++;
      setTimeout(function () { if (alive && g.modus === 'spiel') blase(fr.date, fr.date === 'damon' ? '… okay. Stille.' : 'Hallo?! Peinliche Stille …', 1.6); }, 500);
      Pixel.sfx.tone(180, 0.25, 'triangle', 0.05, 120);
    }

    // ---------- Pannen ----------
    function neuePanne() {
      var belegt = g.pannen.map(function (p) { return p.d.wer; });
      var moegl = PANNEN.filter(function (p) { return belegt.indexOf(p.wer) < 0 && (!p.gang || p.gang.indexOf(g.gang) >= 0 || Math.random() < 0.25); });
      if (!moegl.length) return;
      var d = pick(moegl), el = document.createElement('button');
      el.className = 'dd-panne' + (d.bonus ? ' chance' : '');
      el.innerHTML = '<small>' + d.txt + '</small>' + d.knopf + '<kbd>' + TASTE[d.wer] + '</kbd><i><span></span></i>';
      wrap.appendChild(el);
      var dauer = (d.bonus ? 3.2 : 3.8) - g.gang * 0.35, p = { d: d, el: el, t: dauer, max: dauer };
      el.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); loesen(p); });
      g.pannen.push(p);
      if (d.id === 'handy') { mood('damon', 'schock', 1); metalKlingel(); }
      else if (d.id === 'kellner') { g.kellnerZiel = IW / 2; g.kellnerTeller = true; }
      Pixel.sfx.tone(988, 0.06, 'square', 0.05); Pixel.sfx.tone(740, 0.06, 'square', 0.05, null, 0.07);
    }
    function metalKlingel() { for (var i = 0; i < 6; i++) { Pixel.sfx.tone(i % 2 ? 98 : 82, 0.11, 'sawtooth', 0.05, null, i * 0.12); Pixel.sfx.noise(0.05, 0.05, 2500); } }
    function panneWeg(p) { p.el.remove(); g.pannen.splice(g.pannen.indexOf(p), 1); if (p.d.id === 'kellner') { g.kellnerZiel = IW + 40; } }
    function loesen(p) {
      if (g.modus !== 'spiel' || g.pannen.indexOf(p) < 0) return;
      panneWeg(p); g.pannT = Math.min(g.pannT, rnd(3, 6));
      if (p.d.bonus) { herz(p.d.bonus, 14); blase(p.d.bonus, 'Oh, für mich?! 🌹', 1.8); blase('damon', 'Sag’s keinem.', 1.8); g.punkte += 120; }
      else { g.punkte += 60; g.stat.pannen++; p.d.schaden.forEach(function (id) { herz(id, 3); }); }
      var fig = p.d.wer === 'tisch' ? null : p.d.wer;
      if (fig) mood(fig, 'froh', 0.9);
      Pixel.sfx.tone(523, 0.06, 'triangle', 0.06); Pixel.sfx.tone(784, 0.1, 'triangle', 0.06, null, 0.06);
    }
    function verpasst(p) {
      panneWeg(p);
      if (p.d.bonus) return;
      g.stat.verpasst++; g.combo = 0;
      p.d.schaden.forEach(function (id) { herz(id, -13); });
      var reakt = { sosse: ['damon', 'Du hast da was … überall.'], spange: ['damon', 'Ist das … Spinat?'], zunge: ['damon', 'Das Foto rahm ich mir ein.'], handy: ['moritz', 'TOUCHDOWN?! Beim Essen?!'], plapper: ['damon', '*schläft fast ein*'],
        glas: ['moritz', 'Meine Hose!'], geiger: ['damon', 'Bitte. Mach. Dass. Er. Aufhört.'], kerze: ['moritz', 'FEUER!'], kellner: ['damon', 'Das hab ich nicht bestellt …'] }[p.d.id];
      if (reakt) blase(reakt[0], reakt[1], 1.8);
      if (p.d.wer !== 'tisch') mood(p.d.wer, p.d.id === 'zunge' ? 'zunge' : 'schock', p.d.id === 'zunge' ? 2 : 1.2);
      Pixel.sfx.noise(0.25, 0.18, 600); Pixel.sfx.tone(160, 0.25, 'square', 0.05, 90);
    }

    // ---------- Eingabe ----------
    function kd(e) {
      if (e.key === 'Escape') { stop(); onExit(); return; }
      if (g.modus !== 'spiel') { if (e.key === 'Enter' || e.key === ' ') { var b = ovl.querySelector('[data-act=los]'); if (b) { e.preventDefault(); b.click(); } } return; }
      var key = (e.key || '').toLowerCase();
      if (key === '1' || key === '2' || key === '3') { antworten(+key - 1); e.preventDefault(); return; }
      var wer = key === 'a' ? 'moritz' : key === 'l' ? 'damon' : key === ' ' ? 'tisch' : null;
      if (wer) { e.preventDefault(); var p = g.pannen.filter(function (q) { return q.d.wer === wer; })[0]; if (p) loesen(p); }
    }
    frageEl.addEventListener('click', function (e) { var b = e.target.closest('[data-antw]'); if (b) antworten(+b.getAttribute('data-antw')); });

    // ---------- Zeichnen ----------
    function zeichneFigur(id, t) {
      var p = figPos(id), m = g.mood[id] || '';
      if (!m) {
        var h = g.herz[id];
        m = h > 80 ? 'verliebt' : h > 55 ? 'froh' : h < 25 ? 'genervt' : '';
      }
      if (g.rede[id] > 0 && (!m || m === 'froh' || m === 'verliebt') && Math.floor(t * 9) % 2) m = 'rede';
      if (g.blinz[id] > 0 && !m) m = 'zu';
      var img = figur(id, m), bob = Math.round(Math.sin(t * 2 + p.x) * 0.6 * k * 0.5);
      var lehn = 0;
      lehn = Math.sign(plaetze[PARTNER[id]].x - plaetze[id].x) * Math.round((g.herz[id] - 50) / 50 * k * 1.5); // verliebt = näher ran
      if (id === 'damon' && m === 'metal') bob += Math.round(Math.abs(Math.sin(t * 14)) * k * 1.5);
      Pixel.draw(ctx, img, p.x - img.width * k / 2 + lehn, p.top + bob, k);
      // Soße im Gesicht
      if (id === 'moritz' && g.pannen.some(function (q) { return q.d.id === 'sosse'; })) {
        ctx.fillStyle = '#c8301e';
        [[6, 13], [12, 11], [9, 15], [13, 14]].forEach(function (s) { ctx.fillRect(p.x - 10 * k + s[0] * k + lehn, p.top + bob + s[1] * k, k * 2, k); });
      }
      if (id === 'moritz' && g.pannen.some(function (q) { return q.d.id === 'spange'; })) { ctx.fillStyle = '#3a8a2a'; ctx.fillRect(p.x - 2 * k, p.top + bob + 13 * k, 3 * k, k); }
    }
    function tischDeko(t, nur) {
      [nur].forEach(function (ti) {
        var y = ti.top + Math.round(ti.tiefe * 0.35);
        ti.ids.forEach(function (id) {
          var x = plaetze[id].x, gg = GAENGE[g.gang] || GAENGE[2], kk = Math.max(1, Math.round(k * 0.8));
          // Teller
          ctx.fillStyle = '#f8f8f4'; ctx.fillRect(x - 7 * kk, y, 14 * kk, 3 * kk); ctx.fillStyle = '#d8d8d0'; ctx.fillRect(x - 6 * kk, y + 3 * kk, 12 * kk, kk);
          if (g.modus === 'spiel' || g.modus === 'intro') {
            ctx.fillStyle = gg.farbe[0]; ctx.fillRect(x - 4 * kk, y - kk, 8 * kk, 2 * kk);
            ctx.fillStyle = gg.farbe[1]; ctx.fillRect(x - 2 * kk, y - 2 * kk, 3 * kk, kk);
          }
          // Hände auf dem Tisch
          var fig = FIG[id], haut = fig.pal.S;
          ctx.fillStyle = haut; ctx.fillRect(x - 10 * kk, y + kk, 3 * kk, 2 * kk); ctx.fillRect(x + 7 * kk, y + kk, 3 * kk, 2 * kk);
          // Glas
          var gx = x + (plaetze[id].x < IW / 2 ? 9 : -11) * kk;
          var umgekippt = id === 'damon' && g.pannen.some(function (q) { return q.d.id === 'glas'; });
          ctx.fillStyle = 'rgba(220,240,255,.7)';
          if (umgekippt) { ctx.fillRect(gx - kk, y + kk, 5 * kk, 2 * kk); ctx.fillStyle = 'rgba(240,180,60,.8)'; ctx.fillRect(gx + 3 * kk, y + 2 * kk, 6 * kk, kk); }
          else { ctx.fillRect(gx, y - 4 * kk, 3 * kk, 5 * kk); ctx.fillStyle = 'rgba(240,180,60,.85)'; ctx.fillRect(gx, y - 2 * kk, 3 * kk, 3 * kk); }
        });
        // Kerze in der Tischmitte
        var mx = Math.round((ti.x0 + ti.x1) / 2), kk2 = Math.max(1, Math.round(k * 0.8)), brennt = g.pannen.some(function (q) { return q.d.id === 'kerze'; });
        ctx.fillStyle = '#c8b898'; ctx.fillRect(mx - 3 * kk2, y + kk2, 6 * kk2, 2 * kk2);
        ctx.fillStyle = '#f4ecd8'; ctx.fillRect(mx - kk2, y - 5 * kk2, 2 * kk2, 6 * kk2);
        var fl = Math.sin(t * 20) > 0 ? 1 : 0;
        ctx.fillStyle = '#ffb030'; ctx.fillRect(mx - kk2 + fl, y - 8 * kk2, 2 * kk2, 3 * kk2); ctx.fillStyle = '#fff2a0'; ctx.fillRect(mx - kk2 + fl, y - 7 * kk2, kk2, kk2);
        var gr = ctx.createRadialGradient(mx, y - 6 * kk2, 0, mx, y - 6 * kk2, 30 * kk2); gr.addColorStop(0, 'rgba(255,200,100,.28)'); gr.addColorStop(1, 'rgba(255,200,100,0)');
        ctx.fillStyle = gr; ctx.fillRect(mx - 30 * kk2, y - 36 * kk2, 60 * kk2, 60 * kk2);
        if (brennt) {
          for (var f = 0; f < 6; f++) { ctx.fillStyle = f % 2 ? '#ff6020' : '#ffd040'; var fh = (3 + Math.abs(Math.sin(t * 15 + f)) * 6) * kk2; ctx.fillRect(mx + (f - 3) * 2 * kk2 + 6 * kk2, y + 2 * kk2 - fh, 2 * kk2, fh); }
        }
      });
    }
    function lichterkette(t) {
      var y0 = Math.round(IH * 0.035);
      ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 1; ctx.beginPath();
      for (var x = 0; x <= IW; x += 4) { var y = y0 + Math.sin(x / IW * Math.PI * 4) * 4 + 4; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke();
      for (x = 10; x < IW; x += 22) {
        var yy = y0 + Math.sin(x / IW * Math.PI * 4) * 4 + 6, an = (Math.floor(t * 2) + x) % 5 !== 0;
        ctx.fillStyle = an ? '#ffe08a' : '#a88a4a'; ctx.fillRect(x - 1, yy, 3, 3);
        if (an) { ctx.fillStyle = 'rgba(255,220,130,.18)'; ctx.fillRect(x - 4, yy - 3, 9, 9); }
      }
    }
    function npc(x, y, art, t) {
      var kk = k, b = Math.round(Math.abs(Math.sin(t * 8)) * kk);
      if (art === 'kellner') {
        ctx.fillStyle = '#141418'; ctx.fillRect(x - 5 * kk, y - 24 * kk - b, 10 * kk, 18 * kk);
        ctx.fillStyle = '#f2f2f0'; ctx.fillRect(x - 2 * kk, y - 24 * kk - b, 4 * kk, 12 * kk);
        ctx.fillStyle = '#a8303a'; ctx.fillRect(x - kk, y - 23 * kk - b, 2 * kk, kk);
        ctx.fillStyle = '#e8b896'; ctx.fillRect(x - 4 * kk, y - 32 * kk - b, 8 * kk, 8 * kk);
        ctx.fillStyle = '#2a1a10'; ctx.fillRect(x - 4 * kk, y - 33 * kk - b, 8 * kk, 3 * kk); ctx.fillRect(x - kk, y - 27 * kk - b, 3 * kk, kk);
        if (g.kellnerTeller) { ctx.fillStyle = '#f8f8f4'; ctx.fillRect(x + 4 * kk, y - 20 * kk - b, 9 * kk, 2 * kk); ctx.fillStyle = '#6a8a3a'; ctx.fillRect(x + 6 * kk, y - 22 * kk - b, 5 * kk, 2 * kk); }
      } else if (art === 'geiger') {
        ctx.fillStyle = '#2a2a6a'; ctx.fillRect(x - 5 * kk, y - 24 * kk - b, 10 * kk, 18 * kk);
        ctx.fillStyle = '#e8b896'; ctx.fillRect(x - 4 * kk, y - 32 * kk - b, 8 * kk, 8 * kk);
        ctx.fillStyle = '#d8d8d8'; ctx.fillRect(x - 4 * kk, y - 26 * kk - b, 8 * kk, 2 * kk);
        ctx.fillStyle = '#8a4a20'; ctx.fillRect(x - 9 * kk, y - 23 * kk - b, 6 * kk, 3 * kk);
        ctx.fillStyle = '#e8e8e8'; ctx.fillRect(x - 12 * kk + Math.round(Math.sin(t * 10) * 2 * kk), y - 25 * kk - b, 9 * kk, kk);
        ctx.fillStyle = '#f2c84a'; ctx.fillRect(x + 6 * kk, y - 36 * kk - Math.round(Math.sin(t * 4) * 3 * kk), 2 * kk, 4 * kk);
      } else if (art === 'rose') {
        ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x - 5 * kk, y - 24 * kk - b, 10 * kk, 18 * kk);
        ctx.fillStyle = '#e8b896'; ctx.fillRect(x - 4 * kk, y - 32 * kk - b, 8 * kk, 8 * kk);
        ctx.fillStyle = '#3a8a3a'; ctx.fillRect(x + 5 * kk, y - 26 * kk - b, kk, 9 * kk);
        ctx.fillStyle = '#e8304a'; ctx.fillRect(x + 4 * kk, y - 29 * kk - b, 3 * kk, 3 * kk);
      }
    }
    function render(t) {
      if (!bg) hintergrund();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(bg, 0, 0);
      lichterkette(t);
      // NPCs hinter dem Tisch
      var geiger = g.pannen.filter(function (q) { return q.d.id === 'geiger'; })[0], rose = g.pannen.filter(function (q) { return q.d.id === 'rose'; })[0];
      if (geiger) { var pr = figPos('damon'); npc(Math.min(IW - 10 * k, pr.x + 15 * k), pr.unten, 'geiger', t); }
      if (rose) { var pm = figPos('moritz'); npc(Math.max(10 * k, pm.x - 15 * k), pm.unten, 'rose', t); }
      // je Tisch: Figuren, dann Tischdecke darüber, dann Geschirr
      tische.forEach(function (ti) {
        ti.ids.forEach(function (id) { zeichneFigur(id, t); });
        var w = ti.x1 - ti.x0, h = Math.min(ti.tiefe + Math.max(14, k * 8) + 5, IH - ti.top);
        if (h > 0) ctx.drawImage(bg, ti.x0, ti.top, w, h, ti.x0, ti.top, w, h);
        tischDeko(t, ti);
      });
      // Kellner läuft vor dem Tisch
      if (Math.abs(g.kellnerX - g.kellnerZiel) > 1 || (g.kellnerX > -30 && g.kellnerX < IW + 30)) {
        var tl = tische[tische.length - 1]; npc(g.kellnerX, tl.top + tl.tiefe + Math.max(14, k * 8) + 4, 'kellner', t);
      }
      // Funken (Herzen)
      funkenListe.forEach(function (f) { ctx.fillStyle = '#ff4a6a'; var s = Math.max(1, Math.round(k * 0.7)); ctx.fillRect(f.x, f.y, s * 2, s); ctx.fillRect(f.x + s * 3, f.y, s * 2, s); ctx.fillRect(f.x, f.y + s, s * 5, s); ctx.fillRect(f.x + s, f.y + s * 2, s * 3, s); ctx.fillRect(f.x + s * 2, f.y + s * 3, s, s); });
    }

    // ---------- HUD-Positionen ----------
    function hudSetzen() {
      ['moritz', 'damon'].forEach(function (id) {
        var p = figPos(id), el = $('herz-' + id), sp = screen(p.x, p.top - 2);
        el.style.left = sp.x + 'px'; el.style.top = sp.y + 'px';
        el.querySelector('span').style.width = g.herz[id] + '%'; el.classList.toggle('knapp', g.herz[id] < 25);
        el.style.display = g.modus === 'spiel' ? '' : 'none';
      });
      g.blasen.forEach(function (b) {
        var p = figPos(b.id), sp = screen(p.x, p.top - 16);
        var hb = b.el.offsetWidth / 2 + 6; b.el.style.left = clamp(sp.x, hb, wrap.clientWidth - hb) + 'px'; b.el.style.top = Math.max(70, sp.y) + 'px';
      });
      g.pannen.forEach(function (p, i) {
        var x, y;
        if (p.d.wer === 'tisch') { var t = tische[0]; x = (t.x0 + t.x1) / 2; y = t.top + t.tiefe + 10; }
        else { var fp = figPos(p.d.wer); x = fp.x; y = fp.top + fp.h * 0.45; }
        var sp = screen(x, y), halb = p.el.offsetWidth / 2 + 6; p.el.style.left = clamp(sp.x, halb, wrap.clientWidth - halb) + 'px'; p.el.style.top = sp.y + 'px';
        p.el.querySelector('span').style.width = (p.t / p.max * 100) + '%';
      });
      if (g.frage) frageEl.querySelector('.zeit span').style.width = (g.frage.t / g.frage.max * 100) + '%';
      $('gangZeit').style.width = (g.gangT / GANG_ZEIT * 100) + '%';
      $('pkt').textContent = g.modus === 'spiel' ? g.punkte + ' PKT' + (g.combo > 1 ? '  x' + g.combo : '') : '';
    }

    // ---------- Schleife ----------
    function update(dt) {
      g.t += dt;
      ['moritz', 'damon'].forEach(function (id) {
        if (g.moodT[id] > 0) { g.moodT[id] -= dt; if (g.moodT[id] <= 0) g.mood[id] = ''; }
        if (g.rede[id] > 0) g.rede[id] -= dt;
        if (g.blinz[id] > 0) g.blinz[id] -= dt; else if (Math.random() < dt * 0.35) g.blinz[id] = 0.12;
      });
      for (var i = g.blasen.length - 1; i >= 0; i--) { var b = g.blasen[i]; b.t -= dt; if (b.t <= 0) { b.el.remove(); g.blasen.splice(i, 1); } }
      for (i = funkenListe.length - 1; i >= 0; i--) { var f = funkenListe[i]; f.t += dt; f.y += f.vy * dt; if (f.t > f.life) funkenListe.splice(i, 1); }
      g.kellnerX += clamp(g.kellnerZiel - g.kellnerX, -dt * 60, dt * 60);
      if (g.modus !== 'spiel') return;
      // Gänge
      g.gangT -= dt;
      if (g.gangT <= 0) {
        g.gang++;
        if (g.gang >= GAENGE.length) { ende(true); return; }
        g.gangT = GANG_ZEIT; gangAnzeigen();
        g.kellnerX = -30; g.kellnerZiel = IW + 40; g.kellnerTeller = true;
        melde(GAENGE[g.gang].name + '!', GAENGE[g.gang].essen + ' kommt. Weiter charmant sein.');
        Pixel.sfx.tone(523, 0.1, 'triangle', 0.05); Pixel.sfx.tone(659, 0.1, 'triangle', 0.05, null, 0.12);
      }
      // Langeweile lässt die Herzen langsam sinken
      g.herz.moritz = Math.max(0, g.herz.moritz - dt * (0.5 + g.gang * 0.2));
      g.herz.damon = Math.max(0, g.herz.damon - dt * (0.5 + g.gang * 0.2));
      // Moritz plappert, sobald Ruhe ist
      g.plapperT = (g.plapperT === undefined ? 3 : g.plapperT) - dt;
      if (g.plapperT <= 0 && !g.frage && !(g.rede.moritz > 0)) {
        g.plapperT = rnd(3.5, 6);
        blase('moritz', pick(PLAPPER), 2.2);
        if (Math.random() < 0.5) setTimeout(function () { if (alive && g.modus === 'spiel' && !g.frage) blase('damon', pick(DAMON_NICKT), 1.2); }, 1500);
      }
      // Fragen
      if (g.frage) { g.frage.t -= dt; if (g.frage.t <= 0) frageVerpasst(); }
      else { g.fragT -= dt; if (g.fragT <= 0) neueFrage(); }
      // Pannen
      for (i = g.pannen.length - 1; i >= 0; i--) { var p = g.pannen[i]; p.t -= dt; if (p.t <= 0) verpasst(p); }
      g.pannT -= dt;
      if (g.pannT <= 0) { neuePanne(); g.pannT = rnd(4.5, 8) - g.gang * 0.9; if (Math.random() < 0.2 + g.gang * 0.15) setTimeout(function () { if (alive && g.modus === 'spiel') neuePanne(); }, 900); }
      if (g.herz.moritz <= 0) ende(false, 'moritz'); else if (g.herz.damon <= 0) ende(false, 'damon');
    }
    function tick(now) {
      if (!alive) return;
      var dt = Math.min(0.1, (now - last) / 1000); last = now;
      update(dt); render(g.t); hudSetzen();
      raf = requestAnimationFrame(tick);
    }
    function gangAnzeigen() { $('gangNr').textContent = 'GANG ' + (g.gang + 1) + '/3'; $('gang').textContent = GAENGE[g.gang].name + ' · ' + GAENGE[g.gang].essen; }

    // ---------- Bildschirme ----------
    function figurenHtml() { return '<div class="figs" data-el="figs"></div>'; }
    function figurenMalen() {
      var f = ovl.querySelector('[data-el=figs]'); if (!f) return;
      ['moritz', 'damon'].forEach(function (id) {
        var img = figur(id, id === 'moritz' ? 'zunge' : 'metal'), c = document.createElement('canvas');
        c.width = img.width; c.height = img.height; c.getContext('2d').drawImage(img, 0, 0); f.appendChild(c);
      });
    }
    function intro() {
      ovl.classList.remove('aus');
      var best = +Pixel.get(BEST_KEY, 0);
      ovl.innerHTML = '<div class="dd-karte"><h1>Date-Night</h1><div class="unter">Moritz &amp; Damon · Chaos-Dinner zu zweit</div>' + figurenHtml() +
        (best ? '<div class="zeile"><span>Bestmarke</span><b>' + best + '</b></div>' : '') +
        '<ul><li>💬 Die beiden fragen sich gegenseitig aus – du wählst die Antwort: <b>1 / 2 / 3</b> oder antippen.</li>' +
        '<li>❤️ Moritz mag Physik, Reden und Luxus. Damon mag Football, die USA und Action. Kein Herz darf leer werden.</li>' +
        '<li>🔥 Pannen schnell wegklicken: <b>A</b> = Moritz, <b>L</b> = Damon, <b>Leertaste</b> = Tisch.</li>' +
        '<li>🍝 Drei Gänge überstehen – dann kommt die Rechnung.</li></ul>' +
        '<button class="px-btn" data-act="los">Tisch für zwei, bitte!</button></div>';
      figurenMalen();
    }
    function los() {
      if (g.modus === 'spiel') return;
      if (g.ende) { g.pannen.slice().forEach(panneWeg); g.blasen.forEach(function (b) { b.el.remove(); }); reset(); }
      g.modus = 'spiel'; ovl.classList.add('aus'); $('gangBox').style.visibility = ''; gangAnzeigen();
      g.fragT = 1.5;
      blase('moritz', 'Hi! Wusstest du, dass dieser Tisch eigentlich …', 2);
      setTimeout(function () { if (alive) blase('damon', 'Damon. Hi. Du redest viel, oder?', 1.8); }, 1100);
      Pixel.sfx.tone(523, 0.08, 'square', 0.05); Pixel.sfx.tone(659, 0.08, 'square', 0.05, null, 0.09); Pixel.sfx.tone(784, 0.18, 'square', 0.05, null, 0.18);
    }
    function ende(geschafft, wer) {
      if (g.modus !== 'spiel') return;
      g.modus = 'ende'; g.ende = true; frageEl.classList.remove('an'); g.frage = null;
      g.pannen.slice().forEach(panneWeg);
      var bonus = geschafft ? Math.round((g.herz.moritz + g.herz.damon) * 5) : 0, summe = g.punkte + bonus;
      var best = +Pixel.get(BEST_KEY, 0), neu = summe > best; if (neu) Pixel.set(BEST_KEY, summe);
      var titel, unter;
      if (!geschafft) { titel = 'Date abgebrochen!'; unter = FIG[wer].name + ' hat sich ein Taxi gerufen.'; Pixel.sfx.tone(392, 0.25, 'triangle', 0.06, 196); Pixel.sfx.tone(262, 0.5, 'triangle', 0.06, 130, 0.25); }
      else {
        var min = Math.min(g.herz.moritz, g.herz.damon);
        titel = min > 70 ? 'Traumdate!' : min > 40 ? 'Zweites Date? Vielleicht.' : 'Knapp überlebt.';
        unter = min > 70 ? 'Zweites Date: Super Bowl. Moritz erklärt die Physik dazu.' : min > 40 ? 'Die Rechnung teilen sie sich. Immerhin.' : 'Einer schreibt „War nett“. Autsch.';
        Pixel.sfx.tone(523, 0.1, 'triangle', 0.06); Pixel.sfx.tone(659, 0.1, 'triangle', 0.06, null, 0.1); Pixel.sfx.tone(784, 0.1, 'triangle', 0.06, null, 0.2); Pixel.sfx.tone(1047, 0.3, 'triangle', 0.06, null, 0.3);
      }
      setTimeout(function () {
        if (!alive) return;
        ovl.classList.remove('aus');
        ovl.innerHTML = '<div class="dd-karte"><h1>' + titel + '</h1><div class="unter">' + unter + '</div>' + figurenHtml() +
          '<div class="zeile"><span>Punkte</span><b>' + g.punkte + '</b></div>' +
          (geschafft ? '<div class="zeile"><span>Herz-Bonus</span><b>+' + bonus + '</b></div>' : '') +
          '<div class="zeile"><span>Gesamt</span><b>' + summe + (neu ? ' ★' : '') + '</b></div>' +
          '<div class="zeile"><span>Perfekte Antworten</span><b>' + g.stat.gut + '</b></div>' +
          '<div class="zeile"><span>Cringe-Momente</span><b>' + (g.stat.cringe + g.stat.verpasst) + '</b></div>' +
          '<div class="zeile"><span>Bestmarke</span><b>' + Math.max(best, summe) + '</b></div>' +
          '<button class="px-btn" data-act="los">Nochmal daten</button><button class="px-btn" data-act="exit" style="margin-top:8px">Menü</button></div>';
        figurenMalen();
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
      root.removeEventListener('click', onClick);
    }

    tonBtn.textContent = Pixel.isMuted() ? '🔇' : '🔊';
    window.addEventListener('keydown', kd); window.addEventListener('resize', resize);
    root.addEventListener('click', onClick);
    reset(); resize(); intro();
    window.__dd = { g: function () { return g; }, antworten: antworten, loesen: loesen };
    raf = requestAnimationFrame(tick);
    return stop;
  }

  window.CLGames = window.CLGames || {};
  window.CLGames.doppeldate = { start: start };
})();
