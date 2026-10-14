// Timo: Bootfahren
// Timo paddelt flussabwärts. Mit Tippen links/rechts, Wischen oder Pfeiltasten (A/D)
// die Spur wechseln: Hindernissen ausweichen, Rettungsringe einsammeln.
(function () {
  var LANES = 3;
  var MAX_LIVES = 3;
  var BEST_KEY = 'crazylineup.timo.best';
  var OBSTACLES = ['🪨', '🪵', '🦆', '🐊'];

  function readBest() { try { return +localStorage.getItem(BEST_KEY) || 0; } catch (e) { return 0; } }
  function writeBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) {} }

  function start(root, onExit) {
    root.innerHTML =
      '<div class="hud">' +
        '<button class="btn small" data-act="exit">‹ Menü</button>' +
        '<div class="score">Strecke: <b data-el="score">0</b> m</div>' +
        '<div class="lives" data-el="lives"></div>' +
      '</div>' +
      '<div class="hint">Links/rechts tippen oder wischen. Ausweichen, 🛟 einsammeln!</div>' +
      '<div class="arena" data-el="arena"><canvas data-el="cv"></canvas></div>' +
      '<div class="overlay hidden" data-el="over"></div>';

    var arena = root.querySelector('[data-el=arena]');
    var cv = root.querySelector('[data-el=cv]');
    var ctx = cv.getContext('2d');
    var scoreEl = root.querySelector('[data-el=score]');
    var livesEl = root.querySelector('[data-el=lives]');
    var over = root.querySelector('[data-el=over]');
    var timoImgs = window.Timo.images();

    var W = 0, H = 0, bankW = 0, laneW = 0;
    var s, raf, last, moodTimer;

    function resize() {
      var dpr = window.devicePixelRatio || 1;
      W = arena.clientWidth; H = arena.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bankW = W * 0.1;
      laneW = (W - 2 * bankW) / LANES;
    }
    function laneX(l) { return bankW + laneW * (l + 0.5); }

    function renderLives() {
      var t = '';
      for (var i = 0; i < MAX_LIVES; i++) t += i < s.lives ? '❤️' : '🖤';
      livesEl.textContent = t;
    }

    function setMood(m, ms) {
      s.mood = m;
      clearTimeout(moodTimer);
      if (ms) moodTimer = setTimeout(function () { s.mood = 'neutral'; }, ms);
    }

    function reset() {
      resize();
      s = { lane: 1, x: laneX(1), items: [], spawnIn: 0.8, dist: 0, time: 0, lives: MAX_LIVES,
            alive: true, mood: 'neutral', hitCd: 0, wave: 0 };
      scoreEl.textContent = '0';
      renderLives();
      over.classList.add('hidden');
      last = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }

    function move(d) {
      if (!s || !s.alive) return;
      s.lane = Math.max(0, Math.min(LANES - 1, s.lane + d));
    }

    function spawn() {
      var lane = Math.floor(Math.random() * LANES);
      var ring = Math.random() < 0.22;
      s.items.push({
        lane: lane, y: -60, ring: ring,
        glyph: ring ? '🛟' : OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)]
      });
    }

    function boatY() { return H - Math.min(H * 0.3, 190) * 0.55; }

    function update(dt) {
      s.time += dt;
      var level = Math.min(1, s.time / 80);
      var speed = 150 + level * 260; // px/s
      s.dist += speed * dt / 40;
      s.wave = (s.wave + speed * dt) % 40;
      s.hitCd = Math.max(0, s.hitCd - dt);
      s.x += (laneX(s.lane) - s.x) * Math.min(1, dt * 10);
      s.spawnIn -= dt;
      if (s.spawnIn <= 0) {
        spawn();
        if (Math.random() < 0.35 + level * 0.25) spawn();
        s.spawnIn = (0.95 - level * 0.45) + Math.random() * 0.25;
      }
      var by = boatY();
      s.items.forEach(function (it) { it.y += speed * dt; });
      s.items = s.items.filter(function (it) {
        var close = Math.abs(it.y - by) < laneW * 0.45 && Math.abs(laneX(it.lane) - s.x) < laneW * 0.4;
        if (close && !it.gone) {
          if (it.ring) {
            s.dist += 25;
            setMood('happy', 600);
            return false;
          }
          if (s.hitCd <= 0) {
            s.lives--;
            s.hitCd = 0.8;
            renderLives();
            setMood('shock', 700);
            arena.classList.add('shake');
            setTimeout(function () { arena.classList.remove('shake'); }, 300);
            if (s.lives <= 0) gameOver();
          }
          return false;
        }
        return it.y < H + 60;
      });
      scoreEl.textContent = Math.floor(s.dist);
    }

    function draw() {
      // Wasser
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#3a8fd1'); g.addColorStop(1, '#1f5f9e');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Wellenlinien
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2;
      for (var y = -40 + s.wave; y < H; y += 40) {
        for (var l = 0; l < LANES; l++) {
          var cx = laneX(l) + ((y / 40) % 2 ? 18 : -18);
          ctx.beginPath(); ctx.moveTo(cx - 16, y); ctx.quadraticCurveTo(cx, y - 8, cx + 16, y); ctx.stroke();
        }
      }
      // Ufer
      ctx.fillStyle = '#4d8f3a';
      ctx.fillRect(0, 0, bankW, H); ctx.fillRect(W - bankW, 0, bankW, H);
      ctx.fillStyle = '#3b6f2c';
      ctx.fillRect(bankW - 5, 0, 5, H); ctx.fillRect(W - bankW, 0, 5, H);
      // Hindernisse und Ringe
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = Math.round(laneW * 0.55) + 'px serif';
      s.items.forEach(function (it) { ctx.fillText(it.glyph, laneX(it.lane), it.y); });
      // Boot + Timo
      var by = boatY(), bw = laneW * 0.9, bh = bw * 0.55;
      var tw = bw * 0.78, th = tw * 1.2;
      if (s.hitCd > 0 && Math.floor(s.hitCd * 12) % 2) ctx.globalAlpha = 0.45;
      var img = timoImgs[s.mood] || timoImgs.neutral;
      if (img.complete && img.naturalWidth) ctx.drawImage(img, s.x - tw / 2, by - th * 0.78, tw, th);
      ctx.fillStyle = '#c0392b';
      ctx.beginPath();
      ctx.moveTo(s.x - bw / 2, by - bh * 0.1);
      ctx.lineTo(s.x + bw / 2, by - bh * 0.1);
      ctx.quadraticCurveTo(s.x + bw * 0.45, by + bh * 0.9, s.x, by + bh);
      ctx.quadraticCurveTo(s.x - bw * 0.45, by + bh * 0.9, s.x - bw / 2, by - bh * 0.1);
      ctx.fill();
      ctx.fillStyle = '#f2f2f2'; ctx.fillRect(s.x - bw / 2, by - bh * 0.1, bw, bh * 0.14);
      // Paddel
      ctx.strokeStyle = '#8a5a2b'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      var sw = Math.sin(s.time * 6) * 8;
      ctx.beginPath(); ctx.moveTo(s.x - bw * 0.55, by - bh * 0.3 + sw); ctx.lineTo(s.x - bw * 0.85, by + bh * 0.5 - sw); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x + bw * 0.55, by - bh * 0.3 - sw); ctx.lineTo(s.x + bw * 0.85, by + bh * 0.5 + sw); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function tick(now) {
      if (!s.alive) { draw(); return; }
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      update(dt);
      draw();
      if (s.alive) raf = requestAnimationFrame(tick);
    }

    function gameOver() {
      s.alive = false;
      cancelAnimationFrame(raf);
      s.mood = 'shock';
      var score = Math.floor(s.dist);
      var best = readBest();
      var isNew = score > best;
      if (isNew) writeBest(score);
      draw();
      over.innerHTML =
        '<div class="card">' +
        '<h2>Schiffbruch!</h2>' +
        '<p>Strecke: <b>' + score + ' m</b></p>' +
        '<p>Rekord: <b>' + Math.max(best, score) + ' m</b>' + (isNew ? ' 🎉 neu!' : '') + '</p>' +
        '<button class="btn" data-act="again">Nochmal</button> ' +
        '<button class="btn ghost" data-act="exit">Menü</button>' +
        '</div>';
      over.classList.remove('hidden');
    }

    // Steuerung
    var startX = null;
    function onDown(e) { startX = e.clientX; }
    function onUp(e) {
      if (startX === null) return;
      var dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 30) { move(dx > 0 ? 1 : -1); return; }
      var r = cv.getBoundingClientRect();
      move(e.clientX < r.left + r.width / 2 ? -1 : 1);
    }
    function onKey(e) {
      if (e.key === 'ArrowLeft' || e.key === 'a') move(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') move(1);
    }
    function onClick(e) {
      var act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
      if (act === 'again') reset();
      if (act === 'exit') { stop(); onExit(); }
    }
    cv.addEventListener('pointerdown', onDown);
    cv.addEventListener('pointerup', onUp);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', resize);
    root.addEventListener('click', onClick);

    function stop() {
      if (s) s.alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(moodTimer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', resize);
      root.removeEventListener('click', onClick);
    }

    reset();
    return stop;
  }

  window.Minigames = window.Minigames || [];
  window.Minigames.push({
    id: 'timo-bootfahren',
    person: 'Timo',
    title: 'Bootfahren',
    blurb: 'Steuere Timo flussabwärts und weiche den Hindernissen aus.',
    portrait: function (el) { window.Timo.mount(el, 'happy'); },
    start: start
  });
})();
