// Hilfen für die 3D-Modelle (three.js r128).
// verschmelzen(gruppe, gelenke): fasst alle Meshes je Material zu einem Mesh zusammen.
// Meshes werden in das nächste Gelenk (oder die Gruppe selbst) gerechnet, damit
// animierte Teile (Beine, Hals, Motor …) weiter beweglich bleiben. Spart viele
// Zeichenaufrufe, besonders mit Schatten.
(function () {
  'use strict';

  function verschmelzen(gruppe, gelenke) {
    var anker = new Set([gruppe].concat(gelenke || []));
    gruppe.updateMatrixWorld(true);
    var eimer = new Map(); // Anker -> Map(Material -> Liste)
    gruppe.traverse(function (o) {
      if (!o.isMesh || o.userData.einzeln) return;
      var a = o.parent;
      while (a && !anker.has(a)) a = a.parent;
      if (!a) return;
      var nachMat = eimer.get(a);
      if (!nachMat) eimer.set(a, nachMat = new Map());
      var l = nachMat.get(o.material);
      if (!l) nachMat.set(o.material, l = { teile: [], schatten: false, empfang: false });
      l.teile.push(o); l.schatten = l.schatten || o.castShadow; l.empfang = l.empfang || o.receiveShadow;
    });
    var inv = new THREE.Matrix4(), m = new THREE.Matrix4();
    eimer.forEach(function (nachMat, a) {
      inv.copy(a.matrixWorld).invert();
      nachMat.forEach(function (l, mat) {
        if (l.teile.length < 2) return;
        var stuecke = l.teile.map(function (t) {
          var gm = t.geometry.index ? t.geometry.toNonIndexed() : t.geometry.clone();
          m.multiplyMatrices(inv, t.matrixWorld);
          gm.applyMatrix4(m);
          t.parent.remove(t);
          return gm;
        });
        var n = 0; stuecke.forEach(function (gm) { n += gm.attributes.position.count; });
        var pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), o3 = 0;
        stuecke.forEach(function (gm) {
          pos.set(gm.attributes.position.array, o3 * 3);
          nor.set(gm.attributes.normal.array, o3 * 3);
          if (gm.attributes.uv) uv.set(gm.attributes.uv.array, o3 * 2);
          o3 += gm.attributes.position.count; gm.dispose();
        });
        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
        geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
        geo.computeBoundingSphere();
        var mm = new THREE.Mesh(geo, mat); mm.castShadow = l.schatten; mm.receiveShadow = l.empfang;
        a.add(mm);
      });
    });
    return gruppe;
  }

  window.Modell3D = { verschmelzen: verschmelzen };
})();
