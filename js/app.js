// Menü + Minigame-Registry. Jedes Minigame registriert sich in window.Minigames
// mit { id, person, title, blurb, start(root, onExit) -> stop() }.
(function () {
  var root = document.getElementById('app');
  var stopCurrent = null;

  function showMenu() {
    if (stopCurrent) { stopCurrent(); stopCurrent = null; }
    root.className = 'menu';
    root.innerHTML =
      '<h1>Crazy Lineup</h1>' +
      '<p class="sub">Ein Minigame für jeden aus der Klasse</p>' +
      '<div class="cards"></div>';
    var cards = root.querySelector('.cards');
    (window.Minigames || []).forEach(function (g) {
      var c = document.createElement('button');
      c.className = 'game-card';
      c.innerHTML =
        '<div class="portrait" data-p="' + g.id + '"></div>' +
        '<div class="meta"><b>' + g.person + '</b><span>' + g.title + '</span><small>' + g.blurb + '</small></div>';
      c.addEventListener('click', function () { play(g); });
      cards.appendChild(c);
      if (g.portrait) g.portrait(c.querySelector('.portrait'));
    });
  }

  function play(g) {
    root.className = 'game';
    stopCurrent = g.start(root, showMenu);
  }

  showMenu();
})();
