/**
 * buildBoat(THREE, opts) -> THREE.Group
 *
 * Modell aus Claude Design. opts.cockpit === false lässt Windschutzscheibe und
 * Steuerpult weg (Platz für Timo, der im Boot liegt).
 *
 * Small white-and-blue runabout for three.js r128.
 * Primitives / procedural geometry only, canvas textures only, MeshStandardMaterial only.
 *
 *   Orientation : bow points to -Z, waterline at y = 0, starboard (right) is +X
 *   Size        : hull 3.85 long (stern z = +1.85, bow z = -2.0), ~4.2 incl. outboard,
 *                 beam ~1.56, draft ~0.28 (outboard leg reaches y ≈ -0.53)
 *
 * Animatable pivots (THREE.Group, rest rotation 0):
 *   motor        outboard steering pivot   -> rotation.y steers, rotation.x tilts up
 *     └─ propeller                         -> spin with rotation.z
 *   searchlight  pivot on the console      -> rotation.y / rotation.x to aim (looks along -Z)
 *
 * Light anchors (empty Object3Ds, attach your own PointLight / SpotLight to them):
 *   navRed (port, -X), navGreen (starboard, +X), sternLight (white, on pole), searchlight
 *
 * Quick access: boat.userData.rig    = { motor, propeller, searchlight }
 *               boat.userData.lights = { navRed, navGreen, sternLight, searchlight }
 *               boat.userData.emissive = { red, green, white, beam } (materials, to dim/flash)
 */
function buildBoat(THREE, opts) {
  opts = opts || {};
  const root = new THREE.Group();
  root.name = 'boat';
  const V3 = THREE.Vector3;

  // ------------------------------------------------------------------ helpers
  const M = (color, o = {}) =>
    new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.5, metalness: 0 }, o));

  const add = (geo, mat, parent, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  const ellipsoid = (rx, ry, rz, w = 18, h = 12) => {
    const g = new THREE.SphereGeometry(1, w, h); g.scale(rx, ry, rz); return g;
  };

  const roundedBox = (w, h, d, r, s = 5) => {
    const g = new THREE.BoxGeometry(w, h, d, s, s, s);
    const p = g.attributes.position, n = g.attributes.normal;
    const v = new V3(), inner = new V3();
    const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
    const c = (a, m) => Math.max(-m, Math.min(m, a));
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      inner.set(c(v.x, hx), c(v.y, hy), c(v.z, hz));
      v.sub(inner);
      if (v.lengthSq() > 1e-10) { v.normalize(); n.setXYZ(i, v.x, v.y, v.z); v.multiplyScalar(r); }
      v.add(inner);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    return g;
  };

  const tube = (pts, r, closed = false, seg = 64, radial = 8) =>
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, closed), seg, r, radial, closed);

  // grid surface from a function f(i/nu, j/nv) -> {p: Vector3, uv: [u,v]}
  const gridGeo = (nu, nv, f) => {
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const r = f(i / nu, j / nv);
      pos.push(r.p.x, r.p.y, r.p.z); uv.push(r.uv[0], r.uv[1]);
    }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const a = i * (nv + 1) + j, b = a + nv + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };

  const canvasTex = (w, h, draw) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
    return t;
  };

  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  // ------------------------------------------------------------- hull lines
  const LEN = 3.85, Z0 = 1.85;                       // u: 0 = transom, 1 = bow
  const zAt = u => Z0 - u * LEN;
  const beam = u => {                                // half-beam at the sheer
    if (u < 0.35) return 0.78 * (0.93 + 0.07 * u / 0.35);
    const s = (u - 0.35) / 0.65;
    return 0.78 * Math.pow(Math.max(0, 1 - Math.pow(s, 2.2)), 0.62);
  };
  const sheer = u => 0.45 + 0.25 * u * u;            // deck edge rises toward the bow
  const keel = u => -0.28 + 0.45 * Math.pow(Math.max(0, (u - 0.55) / 0.45), 2); // forefoot sweeps up
  // v: -1 (port sheer) .. 0 (keel) .. +1 (starboard sheer)
  const section = (u, v) => {
    const a = Math.abs(v) * Math.PI / 2, b = beam(u), s = sheer(u), k = keel(u);
    return new V3(Math.sign(v) * b * Math.pow(Math.sin(a), 0.85),
                  s - (s - k) * Math.pow(Math.cos(a), 1.3),
                  zAt(u));
  };

  // --------------------------------------------------------------- textures
  // hull paint: v = 0 at keel -> 1 at sheer (canvas bottom -> top)
  const hullTex = canvasTex(8, 512, (g, w, h) => {
    const band = (v0, v1, col) => { g.fillStyle = col; g.fillRect(0, (1 - v1) * h, w, (v1 - v0) * h); };
    band(0, 1, '#f4f6f8');            // white topsides
    band(0, 0.6, '#1d5fbf');          // blue bottom
    band(0.585, 0.6, '#123f86');      // dark edge on the blue
    band(0.635, 0.695, '#ff7a1a');    // orange stripe
    band(0.735, 0.748, '#1d5fbf');    // thin blue pinstripe
  });

  const woodTex = canvasTex(256, 1024, (g, w, h) => {
    const planks = 9, pw = w / planks, cols = ['#b07440', '#a86b3a', '#b97d48', '#a26536', '#ad7140'];
    for (let i = 0; i < planks; i++) {
      g.fillStyle = i === 4 ? '#c99a63' : cols[Math.floor(rnd() * cols.length)];   // lighter king plank
      g.fillRect(i * pw, 0, pw, h);
      g.strokeStyle = 'rgba(70,35,12,.18)'; g.lineWidth = 1;
      for (let k = 0; k < 7; k++) {                     // grain
        const x0 = i * pw + 3 + rnd() * (pw - 6), amp = 1 + rnd() * 2, fr = 0.01 + rnd() * 0.02;
        g.beginPath();
        for (let y = 0; y <= h; y += 16) g.lineTo(x0 + Math.sin(y * fr + k) * amp, y);
        g.stroke();
      }
      g.fillStyle = '#24170d';                          // butt joints
      for (let y = rnd() * 300; y < h; y += 260 + rnd() * 200) g.fillRect(i * pw, y, pw, 2);
    }
    g.fillStyle = '#1b120a';                            // caulking seams
    for (let i = 0; i <= planks; i++) g.fillRect(i * pw - 1.5, 0, 3, h);
  });

  // -------------------------------------------------------------- materials
  const white    = M(0xf4f6f8, { roughness: 0.3 });
  const hullMat  = M(0xffffff, { map: hullTex, roughness: 0.28, side: THREE.DoubleSide });
  const blue     = M(0x1d5fbf, { roughness: 0.35 });
  const orange   = M(0xff7a1a, { roughness: 0.4 });
  const wood     = M(0xffffff, { map: woodTex, roughness: 0.45, side: THREE.DoubleSide });
  const chrome   = M(0xd7dde3, { roughness: 0.18, metalness: 0.85 });
  const dark     = M(0x23272d, { roughness: 0.5, metalness: 0.2 });
  const rubber   = M(0x3a3f45, { roughness: 0.8 });
  const cushion  = M(0x2a6fd6, { roughness: 0.75 });
  const glass    = M(0x8cc8ff, { roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false });
  const navRedM  = M(0xff2a2a, { emissive: 0xff1a1a, emissiveIntensity: 2.0, roughness: 0.2 });
  const navGrnM  = M(0x2aff6a, { emissive: 0x18ff55, emissiveIntensity: 2.0, roughness: 0.2 });
  const whiteL   = M(0xffffff, { emissive: 0xfff6e0, emissiveIntensity: 2.0, roughness: 0.2 });
  const beamL    = M(0xfffbe8, { emissive: 0xfff2c8, emissiveIntensity: 2.2, roughness: 0.1 });
  const gauge    = M(0x0a1a2a, { emissive: 0x3ac8ff, emissiveIntensity: 0.9, roughness: 0.3 });

  // ------------------------------------------------------------------- hull
  const hull = new THREE.Group(); hull.name = 'hull'; root.add(hull);
  add(gridGeo(64, 36, (u, t) => {
    const v = t * 2 - 1;
    return { p: section(u, v), uv: [u, Math.abs(v)] };
  }), hullMat, hull);

  // transom: strip between the stern section and the sheer line
  add(gridGeo(36, 1, (t, k) => {
    const v = t * 2 - 1, p = section(0, v);
    if (k === 1) p.y = sheer(0);
    return { p, uv: [t, k === 1 ? 1 : Math.abs(v)] };
  }), hullMat, hull);

  // wooden deck with slight crown
  add(gridGeo(64, 18, (u, t) => {
    const w = t * 2 - 1;
    return { p: new V3(w * beam(u) * 0.985, sheer(u) + 0.028 * (1 - w * w), zAt(u)), uv: [t, u * 1.6] };
  }), wood, hull).name = 'deck';

  // rub rail around the whole sheer
  const rail = [];
  for (let i = 0; i <= 40; i++) { const p = section(i / 40, -1); p.y += 0.01; rail.push(p); }
  for (let i = 39; i >= 0; i--) { const p = section(i / 40, 1); p.y += 0.01; rail.push(p); }
  add(tube(rail, 0.03, true, 160, 8), white, hull);

  // stern cleats
  for (const s of [-1, 1]) {
    add(new THREE.CylinderGeometry(0.018, 0.022, 0.05, 8), chrome, hull, s * 0.58, 0.49, 1.68);
    const horn = add(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 8), chrome, hull, s * 0.58, 0.52, 1.68);
    horn.rotation.x = Math.PI / 2;
  }

  // ------------------------------------------------------------- bow rail
  const railPts = [], postU = [0.6, 0.74, 0.86];
  const railH = 0.2;
  const inset = (u, s) => new V3(s * Math.max(0, beam(u) - 0.08), sheer(u) + railH, zAt(u));
  for (const u of [0.58, 0.68, 0.78, 0.87, 0.93]) railPts.push(inset(u, -1));
  railPts.push(new V3(0, sheer(0.975) + railH, zAt(0.975)));
  for (const u of [0.93, 0.87, 0.78, 0.68, 0.58]) railPts.push(inset(u, 1));
  add(tube(railPts, 0.014, false, 80, 6), chrome, hull);
  for (const s of [-1, 1]) for (const u of postU) {
    const top = inset(u, s);
    add(new THREE.CylinderGeometry(0.012, 0.012, railH, 6), chrome, hull, top.x, top.y - railH / 2, top.z);
  }

  // ----------------------------------------------------- navigation lights
  const lights = {};
  const bowU = 0.905, bowY = sheer(bowU) + 0.04, bowZ = zAt(bowU);
  add(roundedBox(0.14, 0.05, 0.08, 0.015), white, hull, 0, bowY, bowZ);
  add(new THREE.BoxGeometry(0.008, 0.06, 0.07), dark, hull, 0, bowY + 0.035, bowZ);           // divider
  for (const [s, mat, name] of [[-1, navRedM, 'navRed'], [1, navGrnM, 'navGreen']]) {
    add(new THREE.SphereGeometry(0.032, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat, hull, s * 0.035, bowY + 0.025, bowZ);
    const a = new THREE.Object3D(); a.name = name; a.position.set(s * 0.06, bowY + 0.05, bowZ - 0.02); hull.add(a);
    lights[name] = a;
  }
  // all-round white stern light on a pole
  add(new THREE.CylinderGeometry(0.015, 0.018, 0.7, 8), chrome, hull, -0.5, 0.45 + 0.35, 1.72);
  add(new THREE.CylinderGeometry(0.035, 0.03, 0.03, 10), dark, hull, -0.5, 1.165, 1.72);
  add(new THREE.SphereGeometry(0.04, 14, 10), whiteL, hull, -0.5, 1.2, 1.72);
  const sternA = new THREE.Object3D(); sternA.name = 'sternLight'; sternA.position.set(-0.5, 1.2, 1.72); hull.add(sternA);
  lights.sternLight = sternA;

  if (opts.cockpit !== false) {
  // ------------------------------------------------------------- windshield
  const WS_Z = 0.3, WS_Y = 0.55, WS_H = 0.28, R_BOT = 0.65, R_TOP = 0.55, TH0 = Math.PI - 1, TH = 2;
  const wsGeo = new THREE.CylinderGeometry(R_TOP, R_BOT, WS_H, 28, 1, true, TH0, TH);
  wsGeo.translate(0, WS_H / 2, 0);
  add(wsGeo, glass, hull, 0, WS_Y, WS_Z).castShadow = false;
  const arc = (r, y) => Array.from({ length: 17 }, (_, i) => {
    const th = TH0 + TH * i / 16; return new V3(r * Math.sin(th), WS_Y + y, WS_Z + r * Math.cos(th));
  });
  add(tube(arc(R_TOP, WS_H), 0.014, false, 48, 6), chrome, hull);
  add(tube(arc(R_BOT, 0.012), 0.016, false, 48, 6), dark, hull);
  for (const th of [TH0, TH0 + TH]) add(tube([
    new V3(R_BOT * Math.sin(th), WS_Y, WS_Z + R_BOT * Math.cos(th)),
    new V3(R_TOP * Math.sin(th), WS_Y + WS_H, WS_Z + R_TOP * Math.cos(th))], 0.014, false, 4, 6), chrome, hull);

  // ---------------------------------------------------------------- console
  const con = new THREE.Group(); con.name = 'console'; con.position.set(0.3, WS_Y, 0.15); hull.add(con);
  add(roundedBox(0.44, 0.36, 0.3, 0.05), white, con, 0, 0.18, 0);
  const dash = add(roundedBox(0.44, 0.04, 0.22, 0.015), dark, con, 0, 0.37, 0.03);
  dash.rotation.x = 0.35;
  for (const dx of [-0.1, 0.1]) {
    const gg = add(new THREE.CylinderGeometry(0.04, 0.04, 0.012, 16), gauge, con, dx, 0.395, 0.03);
    gg.rotation.x = 0.35;
  }
  const column = add(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8), dark, con, 0, 0.32, 0.16);
  column.rotation.x = Math.PI / 2 - 0.5;
  const wheel = new THREE.Group(); wheel.position.set(0, 0.35, 0.24); wheel.rotation.x = -0.5; con.add(wheel);
  add(new THREE.TorusGeometry(0.11, 0.013, 8, 28), dark, wheel);
  for (let k = 0; k < 3; k++) {
    const sp = add(new THREE.BoxGeometry(0.11, 0.012, 0.01), chrome, wheel);
    sp.geometry.translate(0.055, 0, 0); sp.rotation.z = k * Math.PI * 2 / 3 + Math.PI / 2;
  }
  add(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12), chrome, wheel).rotation.x = Math.PI / 2;
  // throttle
  const thr = add(new THREE.CylinderGeometry(0.01, 0.01, 0.12, 6), chrome, con, 0.25, 0.3, 0.05);
  thr.rotation.x = -0.4;
  add(new THREE.SphereGeometry(0.025, 10, 8), dark, con, 0.25, 0.355, 0.03);

  // searchlight on top of the console
  const search = new THREE.Group(); search.name = 'searchlight'; search.position.set(-0.12, 0.43, -0.06); con.add(search);
  add(new THREE.CylinderGeometry(0.02, 0.03, 0.06, 8), dark, search, 0, -0.03, 0);
  const head = add(new THREE.CylinderGeometry(0.055, 0.045, 0.11, 16), chrome, search, 0, 0.04, 0);
  head.rotation.x = Math.PI / 2;
  const lens = add(new THREE.CircleGeometry(0.048, 18), beamL, search, 0, 0.04, -0.056);
  lens.rotation.y = Math.PI;
  const searchA = new THREE.Object3D(); searchA.name = 'searchlightAnchor'; searchA.position.set(0, 0.04, -0.07); search.add(searchA);
  lights.searchlight = searchA;

  }

  // ------------------------------------------------------------------ seats
  const seat = new THREE.Group(); seat.name = 'seat'; seat.position.set(0, 0.56, 0.72); hull.add(seat);
  add(roundedBox(1.2, 0.22, 0.42, 0.05), white, seat, 0, 0.11, 0);
  add(roundedBox(1.18, 0.1, 0.42, 0.045), cushion, seat, 0, 0.27, 0);
  const back = add(roundedBox(1.18, 0.34, 0.1, 0.045), cushion, seat, 0, 0.47, 0.2);
  back.rotation.x = 0.18;
  for (let k = -1; k <= 1; k++) add(new THREE.BoxGeometry(0.008, 0.1, 0.43), M(0x1f58ad, { roughness: 0.8 }), seat, k * 0.39, 0.27, 0); // cushion seams

  // ---------------------------------------------------------------- outboard
  add(roundedBox(0.2, 0.18, 0.08, 0.02), dark, hull, 0, 0.41, Z0 + 0.04);           // transom bracket
  const motor = new THREE.Group(); motor.name = 'motor'; motor.position.set(0, 0.45, Z0 + 0.1); root.add(motor);
  add(roundedBox(0.3, 0.14, 0.4, 0.04), dark, motor, 0, 0.12, 0.1);                // lower cowl
  add(roundedBox(0.32, 0.26, 0.44, 0.09), white, motor, 0, 0.3, 0.1);               // upper cowl
  add(roundedBox(0.325, 0.03, 0.445, 0.014), orange, motor, 0, 0.24, 0.1);          // orange stripe
  add(roundedBox(0.26, 0.05, 0.36, 0.024), blue, motor, 0, 0.43, 0.1);              // blue top
  add(roundedBox(0.1, 0.85, 0.14, 0.035), dark, motor, 0, -0.33, 0.1);              // leg
  add(roundedBox(0.32, 0.02, 0.3, 0.008), dark, motor, 0, -0.55, 0.13);             // anti-cavitation plate
  add(ellipsoid(0.07, 0.07, 0.2), dark, motor, 0, -0.78, 0.12);                     // gearcase torpedo
  add(roundedBox(0.02, 0.16, 0.12, 0.008), dark, motor, 0, -0.9, 0.18);             // skeg
  const tiller = add(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 8), dark, motor, 0, 0.14, -0.2);
  tiller.rotation.x = Math.PI / 2 + 0.2;

  const prop = new THREE.Group(); prop.name = 'propeller'; prop.position.set(0, -0.78, 0.33); motor.add(prop);
  const hub = add(new THREE.ConeGeometry(0.035, 0.1, 12), chrome, prop); hub.rotation.x = Math.PI / 2;
  for (let k = 0; k < 3; k++) {
    const holder = new THREE.Group(); holder.rotation.z = k * Math.PI * 2 / 3; prop.add(holder);
    const blade = add(ellipsoid(0.035, 0.085, 0.01, 12, 8), chrome, holder, 0, 0.08, 0);
    blade.rotation.y = 0.55;
  }

  // ------------------------------------------------------------------- done
  root.userData.rig = { motor, propeller: prop, searchlight: opts.cockpit !== false ? hull.getObjectByName('searchlight') : null };
  root.userData.lights = lights;
  root.userData.emissive = { red: navRedM, green: navGrnM, white: whiteL, beam: beamL };
  return root;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { buildBoat };
