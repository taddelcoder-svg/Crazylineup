// Pixel-Charaktere der Klasse (16x28). Stimmungen tauschen nur einzelne Gesichtszeilen.
(function () {
  var MATTEO_PAL = {
    H: '#6b4a30', h: '#8c6a47', S: '#f2c9ae', s: '#d9a68a', W: '#ffffff', E: '#2a2018',
    M: '#5a3d27', m: '#b8645c', O: '#3a1010', B: '#18181d', b: '#34343e', G: '#d8b46a',
    P: '#2b3550', K: '#111111', k: '#4a4a4a'
  };
  var MATTEO = [
    '......H..H......',
    '....H.HH.HH.H...',
    '...HHHHHHHHHHH..',
    '..HHHhHHHHhHHHH.',
    '..HHHHHHHHHHHHH.',
    '.HHHHHHHHHHHHHH.',
    '.HHSHHHSHHHSHHH.',
    '.HSSSSSSSSSSSSH.',
    'sSSWESSSSSSEWSSs',
    'sSSSSSSssSSSSSSs',
    '.SSSSMMMMMMSSSS.',
    '.SSSSSSmmSSSSSS.',
    '..SSSSSSSSSSSS..',
    '...ssSSSSSSss...',
    '......ssss......',
    '..BBBBBSSBBBBB..',
    '.BBBBBBGGBBBBBB.',
    '.BBbBBBBBBBBbBB.',
    'BBBbBBBBBBBBbBBB',
    'BBBBBBBBBBBBBBBB',
    'SBBBBBBBBBBBBBBS',
    'S.BBBBBBBBBBBB.S',
    '..PPPPPPPPPPPP..',
    '..PPPPP..PPPPP..',
    '..PPPPP..PPPPP..',
    '..PPPP....PPPP..',
    '.KKKKK....KKKKK.',
    '.KkKKK....KKkKK.'
  ];
  var MATTEO_MOODS = {
    neutral: {},
    shock: { 7: '.HSWWSSSSSSWWSH.', 11: '.SSSSSmOOmSSSSS.', 12: '..SSSSSOOSSSSS..' },
    happy: { 8: 'sSSEESSSSSSEESSs', 11: '.SSSSOWWWWOSSSS.' },
    angry: { 7: '.HSEESSSSSSEESH.', 11: '.SSSSSmmmmSSSSS.' }
  };

  var TIMO_PAL = {
    H: '#cf8f4f', h: '#e9b878', S: '#f7d2bb', s: '#e2ad94', W: '#ffffff', E: '#2c3e5a',
    R: '#f2a090', m: '#c27870', O: '#3a1010', T: '#b4cdeb', t: '#93b2da', w: '#ffffff',
    J: '#b9bec4', j: '#9aa0a8', X: '#f4f4f4', x: '#c9c9c9'
  };
  var TIMO = [
    '................',
    '....hHHhHHh.....',
    '...HHHHHHHHHH...',
    '..HHHhHHHHHhHH..',
    '..HHHHHHHHHHHHH.',
    '.HHHHHHHHHHHHHH.',
    '.HHSSSSSSSSSSHH.',
    '.HSSSSSSSSSSSSH.',
    'sSSWESSSSSSEWSSs',
    'sSRRSSSssSSSRRSs',
    '.SSSSSSSSSSSSSS.',
    '.SSSSSmmmmSSSSS.',
    '..SSSSSSSSSSSS..',
    '...ssSSSSSSss...',
    '......ssss......',
    '..TTTTTssTTTTT..',
    '.TTTTTTTTTTTTTT.',
    '.TTtTTTTTTTwtTT.',
    'TTTtTTTTTTTTtTTT',
    'SSTTTTTTTTTTTTSS',
    'SSTTTTTTTTTTTTSS',
    'S.TTTTTTTTTTTT.S',
    '..JJJJJJJJJJJJ..',
    '..JJJJj..jJJJJ..',
    '..JJJJJ..JJJJJ..',
    '..JJJJ....JJJJ..',
    '.XXXXX....XXXXX.',
    '.XxXXX....XXxXX.'
  ];
  var TIMO_MOODS = {
    neutral: {},
    happy: { 8: 'sSSEESSSSSSEESSs', 11: '.SSSSOWWWWOSSSS.' },
    shock: { 7: '.HSWWSSSSSSWWSH.', 11: '.SSSSSmOOmSSSSS.' }
  };


  var LEON_PAL = {
    H: '#2a1a12', h: '#4a3020', S: '#e8b896', s: '#d29c7a', W: '#ffffff', E: '#2a2018',
    m: '#a85a52', O: '#3a1010', T: '#e8707a', B: '#141418', b: '#2c2c34',
    P: '#1e2433', X: '#f2f2f2', x: '#c8c8c8'
  };
  var LEON = [
    '................',
    '....HHHHHHHH....',
    '...HHHHHHHHHH...',
    '..HHHHhHHHHHHH..',
    '..HHHHHHHHHHHH..',
    '..HHHHHHHHHHHH..',
    '.sSHHHHHHHHHHSs.',
    '.sSSSSSSSSSSSSs.',
    '..SWESSSSSSEWS..',
    '..SSSSSssSSSSS..',
    '..SSSSSSSSSSSS..',
    '..SSSSmmmmSSSS..',
    '...SSSSSSSSSS...',
    '....ssSSSSss....',
    '......SSSS......',
    '......SSSS......',
    '......sSSs......',
    '......SSSS......',
    '......SSSS......',
    '......sSSs......',
    '..BBBBBSSBBBBB..',
    '.BBBBBBBBBBBBBB.',
    'BBBbBBBBBBBBbBBB',
    'BBBbBBBBBBBBbBBB',
    'BBBBBBBBBBBBBBBB',
    'SBBBBBBBBBBBBBBS',
    'S.BBBBBBBBBBBB.S',
    '..PPPPPPPPPPPP..',
    '..PPPPP..PPPPP..',
    '..PPPPP..PPPPP..',
    '..PPPP....PPPP..',
    '.XXXXX....XXXXX.',
    '.XxXXX....XXxXX.'
  ];
  var LEON_MOODS = {
    neutral: {},
    happy: { 8: '..SEESSSSSSEES..', 11: '..SSSOWWWWOSSS..', 12: '...SSSTTTTSSS...' },
    shock: { 7: '.sSWWSSSSSSWWSs.', 11: '..SSSSmOOmSSSS..' }
  };

  function withMood(base, moods, mood) {
    var o = moods[mood] || {};
    return base.map(function (row, i) { return o[i] || row; });
  }

  window.Sprites = {
    matteo: function (mood) {
      mood = mood || 'neutral';
      return Pixel.sprite('matteo-' + mood, withMood(MATTEO, MATTEO_MOODS, mood), MATTEO_PAL);
    },
    leon: function (mood) {
      mood = mood || 'neutral';
      return Pixel.sprite('leon-' + mood, withMood(LEON, LEON_MOODS, mood), LEON_PAL);
    },
    timo: function (mood) {
      mood = mood || 'neutral';
      return Pixel.sprite('timo-' + mood, withMood(TIMO, TIMO_MOODS, mood), TIMO_PAL);
    }
  };
})();
