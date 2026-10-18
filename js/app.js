// Menü (Gegenüberstellung an der Messlatte) + Nachladen der Minigames.
// Ein Minigame registriert sich mit window.CLGames[id] = { start(root, onExit) -> stop() }.
(function () {
  window.CLGames = window.CLGames || {};
  // Version aus der eigenen URL (index.html: app.js?v=…) – hängt an jedes nachgeladene Spielskript, damit Browser keine alte Fassung aus dem Cache nehmen
  var VERSION = ((document.currentScript && /[?&]v=([^&]+)/.exec(document.currentScript.src)) || [])[1] || '';

  var PP = ['vendor/three.min.js', 'vendor/CopyShader.js', 'vendor/LuminosityHighPassShader.js',
    'vendor/EffectComposer.js', 'vendor/RenderPass.js', 'vendor/ShaderPass.js', 'vendor/UnrealBloomPass.js'];

  var GAMES = [
    {
      id: 'matteo', person: 'Matteo', title: 'Meinungen ablehnen', grösse: '1,78',
      vorwurf: 'Lehnt grundsätzlich jede Meinung ab',
      sprite: function () { return Sprites.matteo('angry'); },
      best: 'crazylineup.matteo.best', einheit: 'Pkt',
      scripts: ['js/games/matteo.js']
    },
    {
      id: 'timo', person: 'Timo', title: 'Bootfahren', grösse: '1,85',
      vorwurf: 'Chillt auch bei 40 Knoten',
      sprite: function () { return Sprites.timo('happy'); },
      best: 'crazylineup.timo.best', einheit: 'Pkt',
      scripts: PP.concat(['js/modelle/werkzeug.js', 'js/modelle/boot.js', 'js/games/timo.js'])
    },
    {
      id: 'leon', person: 'Leon', title: 'Der lange Hals', grösse: '1,95',
      vorwurf: 'Kein Pausenbrot ist vor ihm sicher',
      sprite: function () { return Sprites.leon('happy'); },
      best: 'crazylineup.leon.best', einheit: 'Pkt',
      scripts: PP.concat(['js/games/leon.js'])
    },
    {
      id: 'mo', person: 'Mo', title: 'Ganz klein', grösse: '0,03',
      vorwurf: 'Passt unter jeder Tür durch',
      sprite: function () { return Sprites.mo('steh'); },
      best: 'crazylineup.mo.best', einheit: 'Pkt',
      scripts: ['js/games/mo.js']
    },
    {
      id: 'omar', person: 'Omar', title: 'Sahara Express', grösse: '1,80',
      vorwurf: 'Liefert alles, solange das Kamel mitmacht',
      sprite: function () { return Sprites.omar('happy'); },
      best: 'crazylineup.omar.best', einheit: 'DH',
      scripts: PP.concat(['js/modelle/werkzeug.js', 'js/modelle/kamel.js', 'js/games/omar.js'])
    },
    {
      id: 'felix', person: 'Felix', title: 'Genosse Felix', grösse: '1,76',
      vorwurf: 'Isst dem ganzen Land den Kühlschrank leer',
      sprite: function () { return Sprites.felix(); },
      best: 'crazylineup.felix.best', einheit: 'm',
      scripts: PP.concat(['js/modelle/werkzeug.js', 'js/games/felix.js'])
    },
    {
      id: 'julian', person: 'Julian', title: 'Reagenzbecken', grösse: '1,82',
      vorwurf: 'Viel zu tief in der Chemie drin',
      sprite: function () { return Sprites.julian(); },
      best: 'crazylineup.julian.best', einheit: 'Pkt',
      scripts: PP.concat(['js/games/julian.js'])
    },
    {
      id: 'doppeldate', person: 'Damon & Moritz', title: 'Chaos-Dinner', grösse: '1,86 / 1,70',
      vorwurf: 'Ein Tisch, zwei Typen, null Plan',
      sprite: function () { return Sprites.doppeldate(); },
      best: 'crazylineup.doppeldate.best', einheit: 'Pkt',
      scripts: ['js/games/doppeldate.js']
    },
    {
      id: 'ecki', person: 'Ecki', title: 'Ecki muss mal!', grösse: '1,78',
      vorwurf: 'Kennt jedes Klo der Stadt',
      sprite: function () { return Sprites.ecki('steh'); },
      best: 'crazylineup.ecki.best', einheit: 'Pkt',
      scripts: ['js/games/ecki.js']
    },
    {
      id: 'philipp', person: 'Philipp', title: 'Lernt nie (angeblich)', grösse: '1,80',
      vorwurf: 'Hat angeblich noch nie gelernt',
      sprite: function () { return Sprites.philipp('cool'); },
      best: 'crazylineup.philipp.best', einheit: 'Pkt',
      scripts: ['js/games/philipp.js']
    },
    {
      id: 'saro', person: 'Saro', title: 'Goldmine Frankfurt', grösse: '1,65',
      vorwurf: 'Geht angeblich Gold graben in Frankfurt',
      sprite: function () { return Sprites.saro('cool'); },
      best: 'crazylineup.saro.best', einheit: 'm',
      scripts: ['js/games/saro.js']
    },
    {
      id: 'jule', person: 'Jule', title: 'Kommt zu spät', grösse: '1,52',
      vorwurf: 'Verliert alles außer dem Handy (in der Hand)',
      sprite: function () { return Sprites.jule('happy'); },
      best: 'crazylineup.jule.best', einheit: 'Pkt',
      scripts: ['js/games/jule.js']
    }
  ];
  window.CLKatalog = GAMES;

  var menu = document.getElementById('menu');
  var stage = document.getElementById('game');
  var stopCurrent = null;
  var loaded = {};

  function loadScripts(list, done, fail) {
    var i = 0;
    (function next() {
      if (i >= list.length) return done();
      var src = list[i++];
      if (loaded[src]) return next();
      var s = document.createElement('script');
      s.src = VERSION ? src + '?v=' + VERSION : src;
      s.onload = function () { loaded[src] = true; next(); };
      s.onerror = function () { fail(src); };
      document.body.appendChild(s);
    })();
  }

  function renderMenu() {
    var wall = menu.querySelector('.wall');
    wall.innerHTML = '';
    GAMES.forEach(function (g, i) {
      var b = document.createElement('button');
      b.className = 'suspect';
      b.style.setProperty('--d', (i * 0.08) + 's');
      var best = +Pixel.get(g.best, 0);
      b.innerHTML =
        '<canvas></canvas>' +
        '<div class="plate"><span class="nr">' + String(i + 1).padStart(2, '0') + '</span>' + g.person.toUpperCase() + '</div>' +
        '<div class="charge"><b>' + g.title + '</b><small>' + g.vorwurf + '</small>' +
        (best ? '<em>Rekord: ' + best + ' ' + g.einheit + '</em>' : '') + '</div>';
      var cv = b.querySelector('canvas'), img = g.sprite();
      cv.width = img.width; cv.height = img.height;
      var sk = Math.min(6, 160 / img.width); // breite Figuren (zwei Personen) etwas kleiner
      cv.style.width = img.width * sk + 'px'; cv.style.height = img.height * sk + 'px';
      cv.getContext('2d').drawImage(img, 0, 0);
      b.addEventListener('click', function () { play(g); });
      wall.appendChild(b);
    });
    var t = menu.querySelector('[data-act=ton]');
    t.textContent = Pixel.isMuted() ? '🔇' : '🔊';
  }

  function showMenu() {
    if (stopCurrent) { try { stopCurrent(); } catch (e) {} stopCurrent = null; }
    stage.hidden = true;
    stage.innerHTML = '';
    menu.hidden = false;
    renderMenu();
  }

  function play(g) {
    Pixel.sfx.tone(520, 0.08, 'square', 0.06);
    menu.hidden = true;
    stage.hidden = false;
    stage.innerHTML = '<div class="loading">LÄDT…</div>';
    loadScripts(g.scripts, function () {
      stage.innerHTML = '';
      stopCurrent = window.CLGames[g.id].start(stage, showMenu);
    }, function (src) {
      stage.innerHTML = '<div class="loading">Konnte ' + src + ' nicht laden.<br><button class="px-btn" data-back>Zurück</button></div>';
      stage.querySelector('[data-back]').onclick = showMenu;
    });
  }

  menu.querySelector('[data-act=ton]').addEventListener('click', function () {
    Pixel.setMuted(!Pixel.isMuted());
    renderMenu();
  });

  showMenu();
})();
