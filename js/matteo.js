// Matteo als gezeichneter SVG-Charakter (nach Fotos: wuschelige braune Haare mit
// Strähnen nach oben, graubraune Augen, kleiner Schnurrbart, schwarzes Polo).
// Stimmungen: neutral, shock, happy, reject
(function () {
  var SKIN = '#f2c9ae';
  var SKIN_SHADE = '#dfae90';
  var HAIR = '#6b4a30';
  var HAIR_LIGHT = '#8c6a47';

  function eyes(open) {
    var lidY = open === 'wide' ? 8.5 : 5.5;
    var iris = open === 'wide' ? 6.5 : 5.5;
    var out = '';
    [82, 118].forEach(function (cx) {
      out +=
        '<ellipse cx="' + cx + '" cy="109" rx="11" ry="' + lidY + '" fill="#fff"/>' +
        '<circle cx="' + cx + '" cy="109" r="' + iris + '" fill="#7b6d5a"/>' +
        '<circle cx="' + cx + '" cy="109" r="' + (iris * 0.48) + '" fill="#1c1c1c"/>' +
        '<circle cx="' + (cx + 2) + '" cy="107" r="1.4" fill="#fff"/>' +
        '<path d="M' + (cx - 11) + ' 109 Q' + cx + ' ' + (109 - lidY * 2.1) + ' ' + (cx + 11) + ' 109" stroke="#3a2a1c" stroke-width="2" fill="none"/>';
    });
    return out;
  }

  function brows(raise) {
    var y = 96 - raise;
    return (
      '<path d="M70 ' + (y + 1) + ' Q82 ' + (y - 4) + ' 94 ' + (y + 1) + '" stroke="' + HAIR + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<path d="M106 ' + (y + 1) + ' Q118 ' + (y - 4) + ' 130 ' + (y + 1) + '" stroke="' + HAIR + '" stroke-width="4" stroke-linecap="round" fill="none"/>'
    );
  }

  var MOODS = {
    neutral:
      eyes('half') + brows(0) +
      '<path d="M92 149 Q100 152 108 149" stroke="#c27870" stroke-width="3.5" stroke-linecap="round" fill="none"/>',
    shock:
      eyes('wide') + brows(7) +
      '<path d="M93 148 Q100 162 107 148 Z" fill="#7a2e2e"/>',
    happy:
      eyes('half') + brows(2) +
      '<path d="M88 147 Q100 160 112 147 Z" fill="#fff" stroke="#c27870" stroke-width="2.5" stroke-linejoin="round"/>',
    reject:
      '<path d="M71 109 Q82 114 93 109 M107 109 Q118 114 129 109" stroke="#3a2a1c" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<path d="M70 94 L94 100 M130 94 L106 100" stroke="' + HAIR + '" stroke-width="4.5" stroke-linecap="round"/>' +
      '<path d="M91 151 Q100 146 109 151" stroke="#c27870" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
  };

  var HAND =
    '<g class="m m-reject">' +
    '<rect x="158" y="96" width="9" height="28" rx="4.5" fill="' + SKIN + '" stroke="' + SKIN_SHADE + '"/>' +
    '<rect x="168" y="90" width="9" height="32" rx="4.5" fill="' + SKIN + '" stroke="' + SKIN_SHADE + '"/>' +
    '<rect x="178" y="94" width="9" height="30" rx="4.5" fill="' + SKIN + '" stroke="' + SKIN_SHADE + '"/>' +
    '<rect x="188" y="102" width="8" height="24" rx="4" fill="' + SKIN + '" stroke="' + SKIN_SHADE + '"/>' +
    '<ellipse cx="177" cy="136" rx="21" ry="18" fill="' + SKIN + '" stroke="' + SKIN_SHADE + '"/>' +
    '</g>';

  function svg() {
    var faces = Object.keys(MOODS).map(function (k) {
      return '<g class="m m-' + k + '">' + MOODS[k] + '</g>';
    }).join('');
    return (
      '<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matteo">' +
      // Shirt: schwarzes Polo mit offenem Kragen
      '<path d="M0 260 L0 228 Q8 200 55 190 L80 182 L120 182 L145 190 Q192 200 200 228 L200 260 Z" fill="#151515"/>' +
      '<path d="M0 205 M30 215 L30 260 M60 200 L60 260 M140 200 L140 260 M170 215 L170 260" stroke="#222" stroke-width="2"/>' +
      // Hals
      '<rect x="82" y="150" width="36" height="34" fill="' + SKIN_SHADE + '"/>' +
      '<path d="M80 180 L100 216 L120 180 Z" fill="' + SKIN_SHADE + '"/>' +
      '<path d="M84 181 Q100 208 116 181" stroke="#c9a86a" stroke-width="1.4" fill="none"/>' +
      '<path d="M66 180 L84 172 L102 214 L86 204 Z" fill="#242424"/>' +
      '<path d="M134 180 L116 172 L98 214 L114 204 Z" fill="#242424"/>' +
      // Ohren + Gesicht
      '<ellipse cx="54" cy="113" rx="7" ry="11" fill="' + SKIN + '"/>' +
      '<ellipse cx="146" cy="113" rx="7" ry="11" fill="' + SKIN + '"/>' +
      '<path d="M54 100 Q54 160 100 166 Q146 160 146 100 Q146 56 100 56 Q54 56 54 100 Z" fill="' + SKIN + '"/>' +
      // Nase + Schnurrbart
      '<path d="M100 110 L97 129 Q100 133 105 130" stroke="#c9967a" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M84 141 Q92 134 100 138 Q108 134 116 141 Q108 142 100 140 Q92 142 84 141 Z" fill="' + HAIR + '" opacity=".85"/>' +
      faces +
      // Haare: wuschelige Frisur mit Strähnen nach oben und Pony
      '<path d="M48 104 Q38 50 80 36 Q100 28 126 36 Q164 50 152 104 Q150 80 138 72 Q122 86 100 80 Q78 86 64 72 Q52 82 48 104 Z" fill="' + HAIR + '"/>' +
      '<path d="M56 94 Q56 62 100 63 Q144 62 144 94 Q136 72 118 76 L108 92 L98 73 L86 92 L80 76 Q62 78 56 94 Z" fill="' + HAIR + '"/>' +
      '<path d="M66 60 Q80 46 100 50 Q120 46 136 60" stroke="' + HAIR_LIGHT + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M88 40 Q82 12 98 4 Q94 22 104 38 Z" fill="' + HAIR + '"/>' +
      '<path d="M108 38 Q120 10 138 14 Q124 24 122 44 Z" fill="' + HAIR + '"/>' +
      '<path d="M70 44 Q58 24 72 14 Q70 30 82 40 Z" fill="' + HAIR + '"/>' +
      '<path d="M100 8 Q112 -4 128 4 M104 6 Q96 -6 84 -2" stroke="' + HAIR_LIGHT + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      HAND +
      '</svg>'
    );
  }

  window.Matteo = {
    // Rendert Matteo in ein Element; setMood('neutral'|'shock'|'happy'|'reject')
    mount: function (el, mood) {
      el.classList.add('matteo');
      el.innerHTML = svg();
      var api = {
        setMood: function (m) { el.setAttribute('data-mood', m); }
      };
      api.setMood(mood || 'neutral');
      return api;
    }
  };
})();
