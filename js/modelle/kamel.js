/**
 * buildCamel(THREE) -> THREE.Group
 *
 * Modell aus Claude Design.
 *
 * Stylized low-poly-but-smooth dromedary for three.js r128.
 * Primitives only, canvas textures only, MeshStandardMaterial only.
 *
 *   Orientation : faces -Z, feet at y = 0, hump top at y ≈ 3.3
 *   Scale       : ~2.6 units long, ~3.3 tall (camel's right side is +X)
 *
 * Rig — every pivot is a THREE.Group with rest rotation (0,0,0),
 * so you animate by setting rotation directly:
 *
 *   legFL, legFR, legBL, legBR   hip pivots (rotation.x swings the leg, + = forward)
 *     └─ "knee"                   knee pivot (rotation.x, negative = foot goes back)
 *   neck                         neck base pivot
 *     └─ head                    head pivot at top of neck (moves with neck)
 *   tail                         tail root pivot (rotation.z swishes, rotation.x lifts)
 *   lantern                      bonus: swing pivot of the brass lantern
 *
 * Quick access: camel.userData.rig = { legFL, kneeFL, legFR, kneeFR, legBL, kneeBL,
 *                                      legBR, kneeBR, neck, head, tail, lantern }
 * (or camel.getObjectByName('legFL').getObjectByName('knee'))
 */
function buildCamel(THREE) {
  const root = new THREE.Group();
  root.name = 'camel';

  // ------------------------------------------------------------------ helpers
  const V3 = THREE.Vector3;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const M = (color, o = {}) =>
    new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.85, metalness: 0 }, o));

  const add = (geo, mat, parent, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  const ellipsoid = (rx, ry, rz, w = 20, h = 14) => {
    const g = new THREE.SphereGeometry(1, w, h);
    g.scale(rx, ry, rz);
    return g;
  };

  // cylinder hanging DOWN from its pivot (top at y=0)
  const limb = (rTop, rBot, len, seg = 14) => {
    const g = new THREE.CylinderGeometry(rTop, rBot, len, seg, 3);
    g.translate(0, -len / 2, 0);
    return g;
  };

  // segmented box pushed onto rounded corners, with analytic (seamless) normals
  const roundedBox = (w, h, d, r, s = 6) => {
    const g = new THREE.BoxGeometry(w, h, d, s, s, s);
    const p = g.attributes.position, n = g.attributes.normal;
    const v = new V3(), inner = new V3();
    const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      inner.set(clamp(v.x, -hx, hx), clamp(v.y, -hy, hy), clamp(v.z, -hz, hz));
      v.sub(inner);
      if (v.lengthSq() > 1e-10) {
        v.normalize();
        n.setXYZ(i, v.x, v.y, v.z);
        v.multiplyScalar(r);
      }
      v.add(inner);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    return g;
  };

  const canvasTex = (w, h, draw) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  };

  // ---------------------------------------------------------------- palette
  const C = {
    red: '#a8182a', redDark: '#6b1420', gold: '#e3b341', teal: '#16807f', cream: '#f3e6c4',
  };

  // --------------------------------------------------------------- textures
  const blanketTex = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = C.red; g.fillRect(0, 0, w, h);
    // side borders (u edges = hanging drapes)
    const band = (x0, wid, col) => { g.fillStyle = col; g.fillRect(x0, 0, wid, h); g.fillRect(w - x0 - wid, 0, wid, h); };
    band(0, 22, C.gold); band(22, 26, C.teal); band(48, 6, C.gold);
    g.fillStyle = C.cream;
    for (let y = 8; y < h; y += 16) for (const x of [35, w - 35]) {
      g.beginPath(); g.moveTo(x, y - 5); g.lineTo(x + 5, y); g.lineTo(x, y + 5); g.lineTo(x - 5, y); g.fill();
    }
    g.fillStyle = C.gold;
    for (let y = 0; y < h; y += 32) for (const side of [0, 1]) {
      const x0 = side ? w - 54 : 54, dir = side ? -1 : 1;
      g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + dir * 22, y + 16); g.lineTo(x0, y + 32); g.fill();
    }
    // front / back hems
    g.fillStyle = C.gold; g.fillRect(0, 0, w, 10); g.fillRect(0, h - 10, w, 10);
    g.fillStyle = C.teal; g.fillRect(0, 10, w, 8); g.fillRect(0, h - 18, w, 8);
    // field of Moroccan 8-point stars (khatam)
    const star = (cx, cy, r, col) => {
      g.fillStyle = col;
      for (const rot of [0, Math.PI / 4]) { g.save(); g.translate(cx, cy); g.rotate(rot); g.fillRect(-r, -r, 2 * r, 2 * r); g.restore(); }
    };
    for (let row = 0; row < 6; row++) {
      const y = 60 + row * 76;
      const xs = row % 2 ? [154, 222, 290, 358] : [120, 188, 256, 324, 392];
      for (const x of xs) {
        star(x, y, 22, C.gold); star(x, y, 17, C.teal); star(x, y, 8, C.red);
        g.fillStyle = C.gold; g.beginPath(); g.arc(x, y, 3.5, 0, 7); g.fill();
      }
    }
  });

  const bagTex = canvasTex(256, 256, (g, w, h) => {
    const bands = [[C.red, 30], [C.gold, 8], [C.teal, 18], [C.cream, 6], [C.redDark, 26], [C.cream, 6], [C.teal, 18], [C.gold, 8]];
    let y = 0, i = 0;
    while (y < h) {
      const [col, th] = bands[i++ % bands.length];
      g.fillStyle = col; g.fillRect(0, y, w, th);
      if (col === C.redDark) { // zigzag
        g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath();
        for (let x = 0; x <= w; x += 16) g.lineTo(x, y + (x / 16 % 2 ? 6 : th - 6));
        g.stroke();
      }
      y += th;
    }
  });

  const glassTex = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#ffd77a'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#4a2f10'; g.lineWidth = 6;
    g.strokeRect(3, 3, w - 6, h - 6);
    // pointed Moorish arch
    g.beginPath(); g.moveTo(26, h - 12); g.lineTo(26, 60);
    g.quadraticCurveTo(26, 22, 64, 12); g.quadraticCurveTo(102, 22, 102, 60);
    g.lineTo(102, h - 12); g.stroke();
    g.lineWidth = 3;
    for (let k = -2; k <= 2; k++) { // lattice
      g.beginPath(); g.moveTo(64 + k * 22 - 30, 50); g.lineTo(64 + k * 22 + 30, h - 12); g.stroke();
      g.beginPath(); g.moveTo(64 + k * 22 + 30, 50); g.lineTo(64 + k * 22 - 30, h - 12); g.stroke();
    }
  });
  glassTex.wrapS = THREE.RepeatWrapping;
  glassTex.repeat.set(6, 1); // one arch per hex face

  // -------------------------------------------------------------- materials
  const fur      = M(0xdcae72, { roughness: 0.9 });
  const furDark  = M(0xa8743f, { roughness: 0.95 });
  const muzzle   = M(0xeccb98, { roughness: 0.9 });
  const pad      = M(0x6e4a30, { roughness: 1 });
  const eyeWhite = M(0xffffff, { roughness: 0.3 });
  const pupil    = M(0x1b1410, { roughness: 0.2 });
  const shine    = M(0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.8 });
  const blush    = M(0xf19a86, { roughness: 0.9, transparent: true, opacity: 0.85 });
  const red      = M(0xa8182a, { roughness: 0.7 });
  const leather  = M(0x7a1a20, { roughness: 0.6 });
  const teal     = M(0x16807f, { roughness: 0.6 });
  const gold     = M(0xe3b341, { roughness: 0.35, metalness: 0.6 });
  const brass    = M(0xc9a23a, { roughness: 0.3, metalness: 0.85 });
  const blanket  = M(0xffffff, { map: blanketTex, roughness: 0.9, side: THREE.DoubleSide });
  const bagMat   = M(0xffffff, { map: bagTex, roughness: 0.85 });
  const glass    = M(0xffd77a, { map: glassTex, emissive: 0xffa630, emissiveMap: glassTex, emissiveIntensity: 1.3, roughness: 0.3 });

  // ------------------------------------------------------------------- body
  const body = new THREE.Group(); body.name = 'body'; root.add(body);
  add(ellipsoid(0.66, 0.6, 1.15, 32, 22), fur, body, 0, 2.0, 0);      // torso
  add(ellipsoid(0.48, 0.5, 0.5), fur, body, 0, 1.95, -0.85);           // chest
  add(ellipsoid(0.55, 0.55, 0.55), fur, body, 0, 2.05, 0.8);           // rump
  add(ellipsoid(0.55, 0.3, 0.85), muzzle, body, 0, 1.68, 0);           // lighter belly
  // hump: bell-shaped lathe profile so it flows out of the back (top = 3.30)
  const humpPts = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    humpPts.push(new THREE.Vector2(Math.max(0.001, 0.6 * Math.pow(1 - t * t, 0.55) * (1 - 0.12 * t)), 2.2 + t * 1.1));
  }
  const humpGeo = new THREE.LatheGeometry(humpPts, 32);
  humpGeo.scale(1, 1, 1.2);
  add(humpGeo, fur, body, 0, 0, 0.05);

  // ------------------------------------------------------------------- legs
  const rig = {};
  const HIP_Y = 1.75, UPPER = 0.85;
  function leg(name, x, z, front) {
    const hip = new THREE.Group(); hip.name = name; hip.position.set(x, HIP_Y, z); root.add(hip);
    if (front) add(ellipsoid(0.2, 0.38, 0.24), fur, hip, 0, -0.1, 0);       // shoulder
    else       add(ellipsoid(0.21, 0.45, 0.3), fur, hip, 0, -0.05, 0.02);   // haunch
    add(limb(0.18, 0.125, UPPER), fur, hip);

    const knee = new THREE.Group(); knee.name = 'knee'; knee.position.y = -UPPER; hip.add(knee);
    add(new THREE.SphereGeometry(0.145, 16, 12), furDark, knee);             // knee callus
    add(limb(0.115, 0.1, 0.7), fur, knee);
    add(new THREE.SphereGeometry(0.115, 14, 10), fur, knee, 0, -0.7, 0);      // fetlock
    const foot = new THREE.CylinderGeometry(0.14, 0.19, 0.16, 18); foot.translate(0, -0.82, 0);
    add(foot, pad, knee);                                                    // pad: bottom at local -0.90 -> world y 0
    for (const s of [-1, 1]) add(ellipsoid(0.08, 0.06, 0.09, 12, 8), pad, knee, s * 0.075, -0.84, -0.12); // two toes

    rig[name] = hip;
    rig['knee' + name.slice(3)] = knee;
  }
  leg('legFL', -0.34, -0.68, true);
  leg('legFR',  0.34, -0.68, true);
  leg('legBL', -0.34,  0.72, false);
  leg('legBR',  0.34,  0.72, false);

  // ------------------------------------------------------------------- neck
  const neck = new THREE.Group(); neck.name = 'neck'; neck.position.set(0, 2.2, -0.9); root.add(neck);
  const NA = -0.62, NL = 1.25;                       // tilt forward, length
  const ng = new THREE.CylinderGeometry(0.19, 0.3, NL, 18, 4); ng.translate(0, NL / 2, 0); ng.rotateX(NA);
  add(ng, fur, neck);
  add(new THREE.SphereGeometry(0.3, 18, 14), fur, neck);
  const neckTop = new V3(0, NL * Math.cos(NA), NL * Math.sin(NA));
  add(new THREE.SphereGeometry(0.19, 16, 12), fur, neck, neckTop.x, neckTop.y, neckTop.z);

  // collar with pompoms
  const collar = new THREE.Group(); collar.position.copy(neckTop).multiplyScalar(0.3); collar.rotation.x = NA; neck.add(collar);
  const cg = new THREE.TorusGeometry(0.28, 0.035, 8, 28); cg.rotateX(Math.PI / 2);
  add(cg, teal, collar);
  [[-0.12, red], [0, gold], [0.12, red]].forEach(([dx, m]) => {
    add(new THREE.SphereGeometry(0.018, 8, 6), gold, collar, dx, -0.03, -0.27);
    add(new THREE.SphereGeometry(0.05, 12, 10), m, collar, dx, -0.1, -0.27);
  });

  // ------------------------------------------------------------------- head
  const head = new THREE.Group(); head.name = 'head'; head.position.copy(neckTop); neck.add(head);
  add(ellipsoid(0.27, 0.25, 0.33, 24, 18), fur, head, 0, 0.05, -0.12);        // skull
  add(ellipsoid(0.21, 0.19, 0.3, 22, 16), muzzle, head, 0, -0.04, -0.42);     // snout
  add(ellipsoid(0.17, 0.08, 0.22), muzzle, head, 0, -0.17, -0.4);             // lower lip
  for (const s of [-1, 1]) {
    add(ellipsoid(0.03, 0.018, 0.02, 10, 8), pupil, head, s * 0.08, 0.03, -0.69);   // nostril
    add(ellipsoid(0.06, 0.035, 0.04, 12, 8), blush, head, s * 0.2, -0.04, -0.34);   // blush

    // eye
    const eye = new THREE.Group(); eye.position.set(s * 0.215, 0.12, -0.24); head.add(eye);
    add(new THREE.SphereGeometry(0.09, 18, 14), eyeWhite, eye);
    add(new THREE.SphereGeometry(0.058, 16, 12), pupil, eye, s * 0.05, -0.005, -0.035);
    add(new THREE.SphereGeometry(0.018, 8, 6), shine, eye, s * 0.088, 0.03, -0.06);
    const lid = add(new THREE.SphereGeometry(0.097, 18, 10, 0, Math.PI * 2, 0, 1.2), fur, eye);
    lid.rotation.x = -0.3;                                                   // sleepy upper lid
    for (let k = -1; k <= 1; k++) {
      const lash = add(new THREE.ConeGeometry(0.008, 0.055, 5), pupil, eye, s * 0.09, 0.03, -0.03 + k * 0.035);
      lash.rotation.z = -s * 1.0; lash.rotation.x = k * 0.3;
    }

    // ear
    const ear = add(ellipsoid(0.05, 0.1, 0.04, 12, 10), fur, head, s * 0.2, 0.28, 0.04);
    ear.rotation.z = -s * 0.6;

    // bridle side straps + rosettes
    const a = new V3(s * 0.245, 0.0, -0.05), b = new V3(s * 0.205, -0.04, -0.45);
    const strap = add(new THREE.BoxGeometry(0.025, 0.035, a.distanceTo(b)), teal, head);
    strap.position.copy(a).add(b).multiplyScalar(0.5);
    strap.quaternion.setFromUnitVectors(new V3(0, 0, 1), b.clone().sub(a).normalize());
    add(new THREE.SphereGeometry(0.03, 10, 8), gold, head, s * 0.255, -0.01, -0.05);
  }
  const noseband = add(new THREE.TorusGeometry(0.2, 0.022, 8, 28), teal, head, 0, -0.04, -0.45);
  noseband.scale.set(1.07, 0.98, 1);
  const headband = add(new THREE.TorusGeometry(0.25, 0.022, 8, 28), teal, head, 0, 0.05, -0.05);
  headband.scale.set(1.05, 0.98, 1);
  for (let i = 0; i < 5; i++) add(new THREE.SphereGeometry(0.035, 8, 6), furDark, head, (i - 2) * 0.035, 0.31 - Math.abs(i - 2) * 0.012, 0.02 + (i % 2) * 0.03); // hair tuft
  add(new THREE.SphereGeometry(0.022, 8, 6), gold, head, 0, 0.29, -0.13);
  add(new THREE.SphereGeometry(0.06, 12, 10), red, head, 0, 0.34, -0.15);    // forehead pompom

  // ------------------------------------------------------------------- tail
  const tail = new THREE.Group(); tail.name = 'tail'; tail.position.set(0, 2.2, 1.3); root.add(tail);
  const tg = limb(0.05, 0.035, 0.65, 10); tg.rotateX(-0.25);
  add(tg, fur, tail);
  const tuft = add(ellipsoid(0.07, 0.15, 0.07, 12, 10), furDark, tail, 0, -0.63 - 0.08, 0.16 + 0.02);
  tuft.rotation.x = -0.25;

  // ---------------------------------------------------------- saddle blanket
  const BZ0 = 0.05, BZH = 0.62, ARC = 1.6, DROP = 0.38, K = 1.045;
  // s: -1..1 across (left drape .. right drape), zz: -1..1 front..back
  const blanketPoint = (s, zz) => {
    const z = BZ0 + zz * BZH;
    const f = Math.sqrt(Math.max(0, 1 - (z / 1.15) ** 2));
    const rx = 0.66 * f * K, ry = 0.6 * f * K;
    const a = Math.abs(s);
    if (a <= 0.8) {
      const ang = (s / 0.8) * ARC;
      return new V3(Math.sin(ang) * rx, 2.0 + Math.cos(ang) * ry, z);
    }
    const e = blanketPoint(Math.sign(s) * 0.8, zz), t = (a - 0.8) / 0.2;
    e.y -= t * DROP; e.x += Math.sign(s) * t * 0.05;
    return e;
  };
  const bg = new THREE.PlaneGeometry(1, 1, 48, 18), bp = bg.attributes.position;
  for (let i = 0; i < bp.count; i++) {
    const q = blanketPoint(bp.getX(i) * 2, -bp.getY(i) * 2);
    bp.setXYZ(i, q.x, q.y, q.z);
  }
  bg.computeVertexNormals();
  add(bg, blanket, root).name = 'blanket';

  // gold trim along the drape hems, teal trim on front/back edges
  const trim = (pts, r, m) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, r, 6), m, root);
  const lin = (n, f) => Array.from({ length: n + 1 }, (_, i) => f(i / n * 2 - 1));
  for (const s of [-1, 1]) trim(lin(20, zz => blanketPoint(s, zz)), 0.022, gold);
  for (const zz of [-1, 1]) trim(lin(40, s => blanketPoint(s, zz)), 0.018, teal);

  // ring where the hump comes through the blanket
  const hr = new THREE.TorusGeometry(0.53, 0.045, 10, 36); hr.rotateX(Math.PI / 2); hr.scale(1, 1, 1.2);
  add(hr, gold, root, 0, 2.62, 0.05);

  // tassels along both hems
  const tasselMats = [red, gold, teal];
  for (const s of [-1, 1]) {
    for (let i = 0; i <= 7; i++) {
      const zz = i / 7 * 2 - 1, p = blanketPoint(s, zz), big = i === 0 || i === 7;
      const tas = new THREE.Group(); tas.position.copy(p); root.add(tas);
      add(new THREE.SphereGeometry(big ? 0.035 : 0.026, 10, 8), gold, tas, 0, -0.02, 0);
      const cone = add(new THREE.ConeGeometry(big ? 0.05 : 0.035, big ? 0.16 : 0.11, 10), tasselMats[i % 3], tas, 0, big ? -0.12 : -0.09, 0);
      cone.rotation.x = Math.PI; // point up -> flare down
    }
  }

  // ------------------------------------------------------------- saddlebags
  for (const s of [-1, 1]) {
    const bag = new THREE.Group(); bag.name = s < 0 ? 'saddlebagL' : 'saddlebagR';
    bag.position.set(s * 0.75, 1.6, 0.32); root.add(bag);
    add(roundedBox(0.2, 0.42, 0.42, 0.07), bagMat, bag);
    add(roundedBox(0.23, 0.15, 0.45, 0.05), leather, bag, s * 0.01, 0.16, 0);   // flap
    add(new THREE.SphereGeometry(0.035, 12, 10), gold, bag, s * 0.125, 0.1, 0);  // button
    for (const dz of [-0.13, 0.13]) {                                            // straps over blanket
      const st = add(new THREE.BoxGeometry(0.025, 0.6, 0.06), leather, root, s * 0.67, 2.03, 0.32 + dz);
      st.rotation.z = s * 0.28;
    }
  }

  // ------------------------------------------------------------ brass lantern
  // hook on the front-left of the blanket, lantern swings from 'lantern' pivot
  const hook = add(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), brass, root, -0.71, 2.03, -0.42);
  hook.rotation.z = Math.PI / 2;
  add(new THREE.SphereGeometry(0.025, 8, 6), brass, root, -0.81, 2.03, -0.42);

  const lantern = new THREE.Group(); lantern.name = 'lantern'; lantern.position.set(-0.8, 2.02, -0.42); root.add(lantern);
  add(new THREE.TorusGeometry(0.03, 0.008, 6, 16), brass, lantern, 0, -0.03, 0);
  add(new THREE.SphereGeometry(0.018, 8, 6), brass, lantern, 0, -0.065, 0);              // finial
  add(new THREE.ConeGeometry(0.1, 0.11, 6), brass, lantern, 0, -0.125, 0);               // roof
  add(new THREE.CylinderGeometry(0.098, 0.098, 0.022, 6), brass, lantern, 0, -0.185, 0); // upper rim
  add(new THREE.CylinderGeometry(0.085, 0.085, 0.2, 6, 1, true), glass, lantern, 0, -0.29, 0);
  for (let k = 0; k < 6; k++) {                                                         // frame bars
    const a = k / 6 * Math.PI * 2;
    add(new THREE.CylinderGeometry(0.011, 0.011, 0.2, 6), brass, lantern, Math.sin(a) * 0.086, -0.29, Math.cos(a) * 0.086);
  }
  add(new THREE.CylinderGeometry(0.098, 0.098, 0.022, 6), brass, lantern, 0, -0.395, 0); // lower rim
  add(new THREE.CylinderGeometry(0.06, 0.085, 0.05, 6), brass, lantern, 0, -0.43, 0);    // base
  add(new THREE.SphereGeometry(0.02, 8, 6), brass, lantern, 0, -0.465, 0);

  // ------------------------------------------------------------------- done
  root.userData.rig = Object.assign(rig, { neck, head, tail, lantern });
  return root;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { buildCamel };
