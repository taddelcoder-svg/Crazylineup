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


  // Mo: winzig, wilde Locken, orange Oakley-Sonnenbrille, schwarzes Shirt (12x16, mit Laufbildern)
  var MO_PAL = {
    H: '#6b4a2e', h: '#9a7048', S: '#f0c4a4', s: '#d8a888', G: '#ff9a1c', g: '#f4f4f4', m: '#c27870',
    T: '#18181c', t: '#34343e', L: '#2a3040', K: '#f2f2f2'
  };
  var MO_KOPF = [
    '.h..H.Hh..h.',
    '..HHHHHHHH..',
    '.HHhHHHHHhH.',
    'HHHHHHHHHHHH',
    'HHSSSSSSSSHH',
    'HgGGGggGGGgH',
    '.SSSSSSSSSS.',
    '.SSSSmmSSSS.',
    '..SSSSSSSS..',
    '.TTTTTTTTTT.',
    'STTTTTTTTTTS',
    'STTtTTTTtTTS',
    '..TTTTTTTT..'
  ];
  var MO_BEINE = {
    steh: ['..LLL..LLL..', '..LLL..LLL..', '.KKKK..KKKK.'],
    laufA: ['..LLL..LLL..', '.LLL....LLL.', 'KKK......KKK'],
    laufB: ['...LLLLLL...', '...LLL.LL...', '..KKK..KK...'],
    sprung: ['..LLLLLLLL..', '..LLL..LLL..', '..KKK..KKK..'],
    fall: ['..LLL..LLL..', '.LL......LL.', '.KK......KK.']
  };


  // Omar: dunkle Locken, kurzer Bart, schwarzer Hoodie
  var OMAR_PAL = {
    H: '#1e1410', h: '#3a2a1e', S: '#d9a47c', s: '#c08a64', W: '#ffffff', E: '#2a1a10', B: '#2a1e18',
    m: '#a8625a', O: '#3a1010', K: '#141418', k: '#2c2c34', w: '#d8d8d8', P: '#2a3040', X: '#f2f2f2', x: '#c8c8c8'
  };
  var OMAR = [
    '...H.HH.HH.H....',
    '..HHHhHHHHhHH...',
    '.HHhHHHHHHHHhH..',
    '.HHHHHhHHhHHHH..',
    '.HHHHHHHHHHHHHH.',
    '.HHSHHSSHHSSHHH.',
    '.HSSSSSSSSSSSSH.',
    'sSSWESSSSSSEWSSs',
    'sSSSSSSssSSSSSSs',
    '.SSSSSSSSSSSSSS.',
    '.SBSSSmmmmSSSBS.',
    '..BBSSSSSSSSBB..',
    '...BBBBBBBBBB...',
    '......ssss......',
    '..KKKKKssKKKKK..',
    '.KKKKKkKKkKKKKK.',
    'KKKkKwwwwwwKkKKK',
    'KKKkKKKKKKKKkKKK',
    'KKKKKKKKKKKKKKKK',
    'SKKKKKKKKKKKKKKS',
    'S.KKKKKKKKKKKK.S',
    '..PPPPPPPPPPPP..',
    '..PPPPP..PPPPP..',
    '..PPPPP..PPPPP..',
    '..PPPP....PPPP..',
    '.XXXXX....XXXXX.',
    '.XxXXX....XXxXX.'
  ];
  var OMAR_MOODS = {
    neutral: {},
    happy: { 7: 'sSSEESSSSSSEESSs', 10: '.SBSSOWWWWOSSBS.' }
  };

  // Felix: dunkle Wuschellocken unter der Uschanka mit rotem Stern, Marschallmantel mit Orden
  var FELIX_PAL = {
    U: '#6e5a48', u: '#8a7460', R: '#c8102e', Y: '#e8b84a', H: '#3a2618', h: '#5a3e28', S: '#f2c4a8', s: '#dca88c',
    W: '#ffffff', E: '#3a2a1e', r: '#ec9a8a', m: '#b0645c', O: '#3a1010', C: '#5a6a3c', B: '#5a3a1e', P: '#2a2c34', K: '#141418', k: '#3a3a42'
  };
  var FELIX = [
    '.....uuuuuu.....',
    '...uUUUUUUUUu...',
    '..UUUUUYYUUUUU..',
    '..UUUUURRUUUUU..',
    '.uUUUUUUUUUUUUu.',
    '.UUHhHHhHHhHHUU.',
    '.UHSHHSHHSHHSHU.',
    '.UHSSSSSSSSSSHU.',
    '.USWESSSSSSEWSU.',
    '.USSSSSssSSSSSU.',
    '..SSrSSSSSSrSS..',
    '..SSSSSmmSSSSS..',
    '...sSSSSSSSSs...',
    '.....ssssss.....',
    '..RCCCCssCCCCR..',
    '.RRCCCYCCYCCCRR.',
    '.CCrYRCCCCCCCCC.',
    'CCCCCCYCCYCCCCCC',
    'CCCCCCCCCCCCCCCC',
    'SCBBBBBYYBBBBBCS',
    'S.CCCCCYCCYCCC.S',
    '..CCCCCCCCCCCC..',
    '..PPPRPPPPRPPP..',
    '..PPPRP..PRPPP..',
    '..PPPRP..PRPPP..',
    '..KKKKK..KKKKK..',
    '.KKKKKK..KKKKKK.',
    '.KkKKKK..KKKKkK.'
  ];
  var FELIX_MOODS = {
    neutral: {},
    happy: { 8: '.USEESSSSSSEESU.', 11: '..SSSSOWWOSSSS..' }
  };

  // Julian: verwuschelte braune Haare, Schwimmbrille auf der Stirn, Laborkittel über grauem Polo, irres Grinsen
  var JULIAN_PAL = {
    H: '#6a4a2e', h: '#9a7048', G: '#2a2a30', B: '#5ac8f0', S: '#f0c4a6', s: '#d8a88a', W: '#ffffff', E: '#3a2a1e', O: '#3a1010',
    L: '#f2f2ee', l: '#c8ccd0', P: '#6a7078', p: '#4a5058', R: '#d83a3a', b: '#3a6ad8', J: '#3a4a6a', K: '#e8e8e8', k: '#b0b0b0'
  };
  var JULIAN = [
    '..h..H.h..Hh..h.',
    '.hHH.HHhH.HHhHh.',
    '..HHHHHHHHHHHHH.',
    '.HHHhHHHHHhHHHH.',
    '.HHHHHHHHHHHHHH.',
    '.GGGGGGGGGGGGGG.',
    '.GBBBGGGGGGBBBG.',
    '.HSSSSSSSSSSSSH.',
    'sSSWEWSSSSWEWSSs',
    'sSSSSSSssSSSSSSs',
    '.SSSSSSSSSSSSSS.',
    '.SSSOWWWWWWOSSS.',
    '..SSSOOOOOOSSS..',
    '...ssSSSSSSss...',
    '......ssss......',
    '..LLLLPppPLLLL..',
    '.LLLLLPPPPLLLLL.',
    'LLLlLLPPPPLLRbLL',
    'LLLlLLPPPPLLlLLL',
    'LLLLLLLPPLLLLLLL',
    'SLLLLLLLLLLLLLLS',
    'S.LLLLLLLLLLLL.S',
    '..JJJJJJJJJJJJ..',
    '..JJJJJ..JJJJJ..',
    '..JJJJJ..JJJJJ..',
    '..JJJJ....JJJJ..',
    '.KKKKK....KKKKK.',
    '.KkKKK....KKkKK.'
  ];
  var JULIAN_MOODS = {
    neutral: {},
    traurig: { 8: 'sSSEESSSSSSEESSs', 11: '.SSSSSOOOOSSSSS.', 12: '..SSSOSSSSOSSS..' }
  };

  // Moritz: blonder Wuschelpony, Zahnspange, Zunge raus, schwarzes Shirt mit Print
  var MORITZ_PAL = {
    H: '#e8c068', h: '#f6dc98', S: '#f2c8b0', s: '#dcaa90', W: '#ffffff', E: '#5a4a3a', B: '#9aa0a8', O: '#401818', R: '#e87a8a',
    T: '#1c1c20', t: '#34343c', P: '#e8e8e8', p: '#8a8a8a', J: '#8a96a8', K: '#f2f2f2', k: '#c8c8c8'
  };
  var MORITZ = [
    '....hHhHHhH.....', '..hHHHHHHHHHh...', '.hHHHHHHHHHHHh..', '.HHHHHHHHHHHHHH.', 'hHHHHHHHHHHHHHHh', '.HHSSHHHHHHHHSH.',
    '.HSSSSSHHHHHSSH.', '.SSSSSSSSSSHSSS.', 'sSSEESSSSSSEESSs', 'sSSSSSSssSSSSSSs', '.SSRSSSSSSSSRSS.', '.SSSSOBBBBOSSSS.',
    '..SSSORRRROSSS..', '...ssSRRRSsss...', '......ssss......', '..TTTTTssTTTTT..', '.TTTTTTTTTTTTTT.', 'TTTtTTPPPTTTtTTT',
    'TTTtTTPpPTTTtTTT', 'TTTTTTPPPTTTTTTT', 'STTTTTTTTTTTTTTS', 'S.TTTTTTTTTTTT.S', '..JJJJJJJJJJJJ..', '..JJJJJ..JJJJJ..',
    '..JJJJJ..JJJJJ..', '..JJJJ....JJJJ..', '.KKKKK....KKKKK.', '.KkKKK....KKkKK.'
  ];
  // Damon: dunkler Kurzhaarschnitt mit Fade, weißes Metal-Shirt mit rotem Logo, graue Jeans
  var DAMON_PAL = {
    H: '#3a2618', h: '#5a3a26', f: '#7a6050', S: '#eec2a4', s: '#d6a486', W: '#ffffff', E: '#2a1a10', M: '#a86058',
    T: '#f2f2f0', t: '#d0d0d0', R: '#c81e2a', r: '#8a1018', K: '#202020', k: '#5a5a5a', J: '#a8a8a8', j: '#8a8a8a', B: '#141418', b: '#3a3a3a'
  };
  var DAMON = [
    '....hHHHHHHh....', '...hHHHHHHHHh...', '..HHHHHHHHHHHH..', '..fHHHHHHHHHHf..', '..fSSSSSSSSSSf..', '.fSHHHSSSSHHHSf.',
    'sSSWESSSSSSWESSs', 'sSSSSSSssSSSSSSs', '.SSSSSSsSSSSSSS.', '.SSSSMMMMMSSSSS.', '..SSSSSSSSSSSS..', '..sSSSSSSSSSSs..',
    '....ssssssss....', '......ssss......', '..TTTTTssTTTTT..', '.TTTTTTTTTTTTTT.', 'TTTRRrRRRrRRTTTT', 'TTTtRRrRrRRRtTTT',
    'TTTtTKKkKKKTtTTT', 'TTTTTKKWWKKTTTTT', 'STTTTTKKKKTTTTTS', 'S.TTTTTTTTTTTT.S', '..JJJJJJJJJJJJ..', '..JJJJJ..JJJJJ..',
    '..JJJjJ..JjJJJ..', '..JJJJ....JJJJ..', '.BBBBB....BBBBB.', '.BbBBB....BBbBB.'
  ];

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
    mo: function (bild) {
      bild = MO_BEINE[bild] ? bild : 'steh';
      return Pixel.sprite('mo-' + bild, MO_KOPF.concat(MO_BEINE[bild]), MO_PAL);
    },
    omar: function (mood) {
      mood = mood || 'neutral';
      return Pixel.sprite('omar-' + mood, withMood(OMAR, OMAR_MOODS, mood), OMAR_PAL);
    },
    felix: function (mood) {
      mood = mood || 'neutral';
      return Pixel.sprite('felix-' + mood, withMood(FELIX, FELIX_MOODS, mood), FELIX_PAL);
    },
    julian: function (mood) {
      mood = mood || 'neutral';
      return Pixel.sprite('julian-' + mood, withMood(JULIAN, JULIAN_MOODS, mood), JULIAN_PAL);
    },
    doppeldate: function () {
      var c = document.createElement('canvas'); c.width = 34; c.height = 28;
      var x = c.getContext('2d');
      x.drawImage(Pixel.sprite('moritz-menue', MORITZ, MORITZ_PAL), 0, 0);
      x.drawImage(Pixel.sprite('damon-menue', DAMON, DAMON_PAL), 18, 0);
      return c;
    },
    timo: function (mood) {
      mood = mood || 'neutral';
      return Pixel.sprite('timo-' + mood, withMood(TIMO, TIMO_MOODS, mood), TIMO_PAL);
    }
  };
})();
