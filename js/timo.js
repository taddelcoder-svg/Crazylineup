// Timo als gezeichneter SVG-Charakter (nach Fotos: kurze, nach oben gestylte
// rotblonde Haare, helles Gesicht mit roten Wangen, hellblaues T-Shirt mit kleinem Logo).
// Stimmungen: neutral, happy, shock
(function () {
  var SKIN = '#f6cdb4';
  var SKIN_SHADE = '#e3ae92';
  var HAIR = '#c98a4b';
  var HAIR_LIGHT = '#e0a96a';
  var SHIRT = '#b4cdeb';
  var SHIRT_SHADE = '#97b4d8';

  var MOODS = {
    neutral:
      '<ellipse cx="82" cy="104" rx="5.5" ry="6" fill="#fff"/><circle cx="82" cy="105" r="3.6" fill="#5b7fa6"/><circle cx="82" cy="105" r="1.7" fill="#1c1c1c"/>' +
      '<ellipse cx="118" cy="104" rx="5.5" ry="6" fill="#fff"/><circle cx="118" cy="105" r="3.6" fill="#5b7fa6"/><circle cx="118" cy="105" r="1.7" fill="#1c1c1c"/>' +
      '<path d="M72 93 Q82 90 92 93 M108 93 Q118 90 128 93" stroke="' + HAIR + '" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
      '<path d="M92 142 Q100 146 108 142" stroke="#c27870" stroke-width="3.5" stroke-linecap="round" fill="none"/>',
    happy:
      '<path d="M73 106 Q82 97 91 106 M109 106 Q118 97 127 106" stroke="#3a2a1c" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
      '<path d="M72 91 Q82 86 92 91 M108 91 Q118 86 128 91" stroke="' + HAIR + '" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
      '<path d="M84 136 Q100 160 116 136 Z" fill="#7a2e2e" stroke="#c27870" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M88 137 Q100 141 112 137 L112 138 Q100 146 88 138 Z" fill="#fff"/>',
    shock:
      '<ellipse cx="82" cy="103" rx="7" ry="8.5" fill="#fff"/><circle cx="82" cy="104" r="4.4" fill="#5b7fa6"/><circle cx="82" cy="104" r="2" fill="#1c1c1c"/>' +
      '<ellipse cx="118" cy="103" rx="7" ry="8.5" fill="#fff"/><circle cx="118" cy="104" r="4.4" fill="#5b7fa6"/><circle cx="118" cy="104" r="2" fill="#1c1c1c"/>' +
      '<path d="M71 88 Q82 80 93 88 M107 88 Q118 80 129 88" stroke="' + HAIR + '" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="100" cy="146" rx="6" ry="8" fill="#7a2e2e"/>'
  };

  function svg() {
    var faces = Object.keys(MOODS).map(function (k) {
      return '<g class="m m-' + k + '">' + MOODS[k] + '</g>';
    }).join('');
    return (
      '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Timo">' +
      // T-Shirt, Ärmel und Arme
      '<path d="M0 240 L0 206 Q6 182 50 172 L80 164 L120 164 L150 172 Q194 182 200 206 L200 240 Z" fill="' + SHIRT + '"/>' +
      '<path d="M0 206 Q6 182 50 172 L44 200 Q20 206 0 222 Z M200 206 Q194 182 150 172 L156 200 Q180 206 200 222 Z" fill="' + SHIRT_SHADE + '"/>' +
      '<rect x="0" y="214" width="26" height="26" fill="' + SKIN + '"/><rect x="174" y="214" width="26" height="26" fill="' + SKIN + '"/>' +
      '<circle cx="136" cy="196" r="3.2" fill="none" stroke="#fff" stroke-width="1.5"/>' +
      // Hals und Kragen
      '<rect x="84" y="140" width="32" height="30" fill="' + SKIN_SHADE + '"/>' +
      '<path d="M76 166 Q100 190 124 166 Q100 176 76 166 Z" fill="' + SHIRT_SHADE + '"/>' +
      // Ohren + Gesicht
      '<ellipse cx="55" cy="108" rx="7" ry="11" fill="' + SKIN + '"/>' +
      '<ellipse cx="145" cy="108" rx="7" ry="11" fill="' + SKIN + '"/>' +
      '<path d="M55 96 Q55 152 100 158 Q145 152 145 96 Q145 52 100 52 Q55 52 55 96 Z" fill="' + SKIN + '"/>' +
      // Rote Wangen + Nase
      '<ellipse cx="72" cy="124" rx="10" ry="7" fill="#f09a8a" opacity=".55"/>' +
      '<ellipse cx="128" cy="124" rx="10" ry="7" fill="#f09a8a" opacity=".55"/>' +
      '<path d="M100 106 L97 122 Q100 126 104 123" stroke="#d8a08a" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      faces +
      // Haare: kurz, oben nach hinten/oben gestylt
      '<path d="M52 100 Q44 46 86 34 Q104 28 124 34 Q160 46 148 100 Q146 78 136 68 Q120 74 100 70 Q80 74 64 68 Q54 78 52 100 Z" fill="' + HAIR + '"/>' +
      '<path d="M60 76 Q70 50 100 52 Q132 50 140 76 Q124 62 100 64 Q76 62 60 76 Z" fill="' + HAIR_LIGHT + '"/>' +
      '<path d="M80 40 Q90 22 110 26 Q124 28 130 40 Q112 34 96 38 Q86 40 80 40 Z" fill="' + HAIR + '"/>' +
      '<path d="M70 56 Q86 40 110 44 M96 32 Q108 26 122 32" stroke="' + HAIR_LIGHT + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function moodSvg(mood) {
    // Für Canvas: eine Stimmung als eigenständiges SVG
    return svg().replace(/<g class="m m-(\w+)">/g, function (m, k) {
      return '<g class="m m-' + k + '" style="display:' + (k === mood ? 'inline' : 'none') + '">';
    });
  }

  window.Timo = {
    mount: function (el, mood) {
      el.classList.add('char', 'timo');
      el.innerHTML = svg();
      var api = { setMood: function (m) { el.setAttribute('data-mood', m); } };
      api.setMood(mood || 'neutral');
      return api;
    },
    // Liefert Image-Objekte pro Stimmung (für Canvas-Spiele)
    images: function () {
      var out = {};
      ['neutral', 'happy', 'shock'].forEach(function (m) {
        var img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(moodSvg(m));
        out[m] = img;
      });
      return out;
    }
  };
})();
