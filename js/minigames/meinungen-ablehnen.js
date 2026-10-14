// Matteo: Meinungen ablehnen
// Falsche Meinungen anklicken/antippen = ablehnen. Matteos eigene Meinungen
// (grüner Rand) nicht anfassen, die dürfen zu ihm durch.
(function () {
  var BAD = [
    'Ananas auf Pizza ist super!',
    'Ketchup auf Pizza!',
    'Pizza mit Messer und Gabel essen',
    'Spaghetti brechen ist normal',
    'Cappuccino nach 12 Uhr',
    'Pizza Hawaii > Margherita',
    'Montag ist der beste Tag',
    'Hausaufgaben machen Spaß',
    'Um 5 Uhr aufstehen ist geil',
    'Parmesan auf Fisch',
    'Pasta mit Ketchup',
    'Pizza braucht keinen Käse',
    'Pizza ist ungesund',
    'Pasta muss man totkochen',
    'Pizza kalt ist besser',
    'Tiefkühlpizza = echte Pizza'
  ];
  var GOOD = [
    'Pizza Margherita ist unschlagbar',
    'Italien hat das beste Essen',
    'Pasta al dente!',
    'Espresso schwarz, fertig',
    'Schlafen ist wichtig',
    'Mehr Pizza in der Mensa',
    'Steinofen schlägt alles'
  ];

  var MAX_LIVES = 3;
  var BEST_KEY = 'crazylineup.matteo.best';

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function readBest() { try { return +localStorage.getItem(BEST_KEY) || 0; } catch (e) { return 0; } }
  function writeBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) {} }

  function start(root, onExit) {
    root.innerHTML =
      '<div class="hud">' +
        '<button class="btn small" data-act="exit">‹ Menü</button>' +
        '<div class="score">Punkte: <b data-el="score">0</b></div>' +
        '<div class="lives" data-el="lives"></div>' +
      '</div>' +
      '<div class="hint">Falsche Meinungen <b>ablehnen</b> (antippen). Matteos eigene (grün) in Ruhe lassen!</div>' +
      '<div class="arena" data-el="arena"><div class="matteo-wrap" data-el="matteo"></div></div>' +
      '<div class="overlay hidden" data-el="over"></div>';

    var arena = root.querySelector('[data-el=arena]');
    var matteoEl = root.querySelector('[data-el=matteo]');
    var scoreEl = root.querySelector('[data-el=score]');
    var livesEl = root.querySelector('[data-el=lives]');
    var over = root.querySelector('[data-el=over]');
    var matteo = window.Matteo.mount(matteoEl, 'neutral');

    var state, raf, last, moodTimer;

    function setMood(m, ms) {
      matteo.setMood(m);
      clearTimeout(moodTimer);
      if (ms) moodTimer = setTimeout(function () { matteo.setMood('neutral'); }, ms);
    }

    function renderLives() {
      var s = '';
      for (var i = 0; i < MAX_LIVES; i++) s += i < state.lives ? '❤️' : '🖤';
      livesEl.textContent = s;
    }

    function reset() {
      state = { score: 0, lives: MAX_LIVES, bubbles: [], spawnIn: 0.6, time: 0, alive: true };
      arena.querySelectorAll('.bubble').forEach(function (b) { b.remove(); });
      scoreEl.textContent = '0';
      renderLives();
      over.classList.add('hidden');
      setMood('neutral');
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function spawn() {
      var good = Math.random() < 0.25;
      var el = document.createElement('div');
      el.className = 'bubble ' + (good ? 'good' : 'bad');
      el.textContent = pick(good ? GOOD : BAD);
      arena.appendChild(el);
      var w = arena.clientWidth, h = arena.clientHeight;
      var bw = el.offsetWidth;
      var x0 = Math.random() * Math.max(1, w - bw);
      var level = Math.min(1, state.time / 90);
      var dur = 6.5 - level * 3.8;
      var b = {
        el: el, good: good, p: 0, dur: dur, x0: x0, bw: bw,
        cx: (w - bw) / 2,
        y1: h - matteoEl.offsetHeight * 0.78 - el.offsetHeight,
        dead: false
      };
      el.addEventListener('pointerdown', function (ev) {
        ev.preventDefault();
        slap(b);
      });
      state.bubbles.push(b);
      position(b);
    }

    function position(b) {
      var x = b.x0 + (b.cx - b.x0) * b.p;
      var y = -b.el.offsetHeight + (b.y1 + b.el.offsetHeight) * b.p;
      b.el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    }

    function remove(b) {
      b.dead = true;
      state.bubbles = state.bubbles.filter(function (o) { return o !== b; });
    }

    function hurt() {
      state.lives--;
      renderLives();
      setMood('shock', 600);
      arena.classList.add('shake');
      setTimeout(function () { arena.classList.remove('shake'); }, 300);
      if (state.lives <= 0) gameOver();
    }

    function slap(b) {
      if (b.dead || !state.alive) return;
      remove(b);
      var dir = b.x0 + b.bw / 2 < arena.clientWidth / 2 ? -1 : 1;
      var cur = b.el.style.transform;
      b.el.classList.add(b.good ? 'wrong' : 'slapped');
      b.el.style.setProperty('--dir', dir);
      b.el.dataset.t = cur;
      b.el.style.transform = cur + ' translateX(' + dir * 160 + 'px) rotate(' + dir * 40 + 'deg)';
      b.el.style.opacity = '0';
      setTimeout(function () { b.el.remove(); }, 400);
      if (b.good) {
        hurt();
      } else {
        state.score += 10;
        scoreEl.textContent = state.score;
        setMood('reject', 350);
      }
    }

    function arrive(b) {
      remove(b);
      b.el.remove();
      if (b.good) {
        state.score += 5;
        scoreEl.textContent = state.score;
        setMood('happy', 500);
      } else {
        hurt();
      }
    }

    function tick(now) {
      if (!state.alive) return;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state.time += dt;
      state.spawnIn -= dt;
      if (state.spawnIn <= 0) {
        spawn();
        var level = Math.min(1, state.time / 90);
        state.spawnIn = 1.7 - level * 1.0 + Math.random() * 0.4;
      }
      state.bubbles.slice().forEach(function (b) {
        b.p += dt / b.dur;
        if (b.p >= 1) arrive(b); else position(b);
      });
      if (state.alive) raf = requestAnimationFrame(tick);
    }

    function gameOver() {
      state.alive = false;
      cancelAnimationFrame(raf);
      var best = readBest();
      var isNew = state.score > best;
      if (isNew) writeBest(state.score);
      matteo.setMood('shock');
      over.innerHTML =
        '<div class="card">' +
        '<h2>Zu viele Meinungen!</h2>' +
        '<p>Punkte: <b>' + state.score + '</b></p>' +
        '<p>Rekord: <b>' + Math.max(best, state.score) + '</b>' + (isNew ? ' 🎉 neu!' : '') + '</p>' +
        '<button class="btn" data-act="again">Nochmal</button> ' +
        '<button class="btn ghost" data-act="exit">Menü</button>' +
        '</div>';
      over.classList.remove('hidden');
    }

    root.addEventListener('click', onClick);
    function onClick(e) {
      var act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'again') reset();
      if (act === 'exit') { stop(); onExit(); }
    }

    function stop() {
      if (state) state.alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(moodTimer);
      root.removeEventListener('click', onClick);
    }

    reset();
    return stop;
  }

  window.Minigames = window.Minigames || [];
  window.Minigames.push({
    id: 'matteo-meinungen',
    person: 'Matteo',
    title: 'Meinungen ablehnen',
    blurb: 'Lehne die falschen Meinungen ab, bevor sie Matteo erreichen.',
    start: start
  });
})();
