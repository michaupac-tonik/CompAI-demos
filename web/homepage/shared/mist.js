/* Mist for previewing a section on its own page.
   The hero's fingerprint after it has dissolved (the print code of index.html with dis = 1 and no intro): small
   dimmed dots that grow around the cursor and stretch toward it. Needs <canvas id="print"> and shapes-phase.js.
   A section sets window.heroMist (canvas opacity) and dispatches "heromist" to liven it, as on the homepage.
   NOTE: derived from the hero shader in index.html. When that shader changes, update this copy too. */
// mist: the hero's fingerprint after it has dissolved (copied from index.html, the hero's print code, with dis = 1)
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused = reduced;
  // ---- fingerprint ------------------------------------------------------------------------
  const D = window.BLEND_FIELDS;
  const cvs = document.getElementById('print');
  if (!D) return;   // shape data missing: the hero stays plain black type
  const ctx = cvs.getContext('2d');
  const dec = (b64, T) => { const s = atob(b64), u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return new T(u.buffer); };
  const N = D.pts.length / 2, order = D.order, TAU = 2 * Math.PI;
  const F = order.map(k => {
    const c = Float32Array.from(dec(D.c[k], Int16Array), v => v / 1000);
    const f = Float32Array.from(dec(D.f[k], Int16Array), v => v / 1000);
    return { b: c.map((v, i) => v - f[i]), f,
             w: Float32Array.from(dec(D.w[k], Uint8Array), v => v / 255),
             m: Float32Array.from(dec(D.m[k], Uint8Array), v => v / 255) };
  });
  const A = (D.pts[2] - D.pts[0]) / 2, key = (i, j) => i * 4096 + j, idx = new Map();
  for (let n = 0; n < N; n++) idx.set(key(Math.round(D.pts[2*n] / A), Math.round(D.pts[2*n+1] / A)), n);
  const diag = new Int32Array(4 * N).fill(-1);
  for (let n = 0; n < N; n++) {
    const i = Math.round(D.pts[2*n] / A), j = Math.round(D.pts[2*n+1] / A);
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([a, b], k) => { const v = idx.get(key(i + a, j + b)); if (v !== undefined) diag[4*n + k] = v; });
  }
  // axis neighbours two steps away (same distance on the 45° lattice as the diagonal ones)
  const axn = new Int32Array(4 * N).fill(-1);
  for (let n = 0; n < N; n++) {
    const i = Math.round(D.pts[2*n] / A), j = Math.round(D.pts[2*n+1] / A);
    [[2, 0], [-2, 0], [0, 2], [0, -2]].forEach(([a, b], k) => { const v = idx.get(key(i + a, j + b)); if (v !== undefined) axn[4*n + k] = v; });
  }
  for (const S of F) {
    let h = S.m.slice();
    for (let it = 0; it < 9; it++) {
      const nx = h.slice();
      for (let n = 0; n < N; n++) for (let k = 0; k < 4; k++) { const v = diag[4*n + k]; if (v >= 0 && h[v] * .86 > nx[n]) nx[n] = h[v] * .86; }
      h = nx;
    }
    S.h = h;
  }
  for (const S of F) {
    let sx = 0, sy = 0, n = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let i = 0; i < N; i++) if (S.m[i] > .3) { const x = D.pts[2*i], y = D.pts[2*i+1];
      sx += x; sy += y; n++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    Object.assign(S, { cx: sx / n, cy: sy / n, rx: (x1 - x0) / 2, ry: (y1 - y0) / 2 });
  }
  const near = (x, y) => {
    let i = Math.round(x / A), j = Math.round(y / A);
    if ((((i + j) % 2) + 2) % 2) { const fx = x / A - i, fy = y / A - j;
      if (Math.abs(fx) > Math.abs(fy)) i += fx > 0 ? 1 : -1; else j += fy > 0 ? 1 : -1; }
    const v = idx.get(key(i, j)); return v === undefined ? -1 : v;
  };
  const Cf = new Float32Array(N), Wf = new Float32Array(N), Mf = new Float32Array(N), Hf = new Float32Array(N), Dr = new Uint8Array(N), Xs = new Float32Array(N), Ys = new Float32Array(N), Hs = new Float32Array(N);

  // ---- tuning (press-screen.html, 16.11) ---------------------------------------------------
  const SPEED = reduced ? 1e9 : 3.3, LOCAL = reduced ? 300 : 2300, SWELL = reduced ? 0 : 0.94;
  const P_RADIUS = 180, P_REACH = 0.75, P_DENSE = 0.24, P_SPILL = 1.5, P_SPREAD = 0.3, P_CRISP = 0.2, P_EDGE = 5.1;
  const GRAVITY = 0.24, LIFT_W = 0.25, LIFT_M = 0.35;
  const FAR_FROM = 120, FAR_TO = 640, FAR_W = 0.29, FAR_M = 0.47;
  const P_IN = 0.27, P_OUT = 0.03, P_FOLLOW = 0.71;
  const TRAIL = 260, TRAIL_SIZE = 0.38, HOVER_ZONE = 0.5;
  // ---- hero additions ----------------------------------------------------------------------
  const AMBIENT = 0.42;      // strength of the slow drifting press when nobody points
  const IDLE_MS = 2600;      // pointer still this long -> ambient takes over
  const REST_MS = 3000;      // cursor still this long over the page -> the print lets go and returns to its first shape
  const GRAD_AMP = .14;      // idle: the mint-to-cyan gradient drifts this far (share of its length)
  const GRAD_PERIOD = 14;    // seconds for one slow pass of the drift
  // base colour (Figma 251:362): #24FF63 at the top of the screen to #00FFEE at the bottom.
  // heat on top: pressed lines warm toward yellow and orange, the side that lets go dims.
  const BASE_TOP = [36,255,99], BASE_BOT = [0,255,238], WARM = [[241,188,55], [245,56,14]];
  const Y_BANDS = 28, WARM_STEPS = 8, DIM_STEPS = 3;
  const mix = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
  const colourOf = (band, heat) => {        // heat: -DIM_STEPS..WARM_STEPS
    let c = mix(BASE_TOP, BASE_BOT, band / (Y_BANDS - 1));
    if (heat > 0) { const u = heat / WARM_STEPS; c = u < .6 ? mix(c, WARM[0], u / .6) : mix(WARM[0], WARM[1], (u - .6) / .4); }
    else if (heat < 0) c = c.map(v => Math.round(v * (1 - .16 * -heat)));
    return `rgb(${c.join(',')})`;
  };
  const PAL = new Map(), paths = new Map();
  const pathFor = (band, heat) => { const k = band * 32 + heat + DIM_STEPS; let P = paths.get(k);
    if (!P) { P = new Path2D(); paths.set(k, P); if (!PAL.has(k)) PAL.set(k, colourOf(band, heat)); } return P; };

  const jit = new Float32Array(N);
  for (let i = 0; i < N; i++) { const h = Math.sin(D.pts[2*i] * 0.9285 + D.pts[2*i+1] * 5.5881) * 43758.5453; jit[i] = (h - Math.floor(h)) * 2 - 1;}

  // ---- intro: the print is pressed in from black, front running along its own lines ------------
  const S0 = F[0], CX = S0.cx, CY = S0.cy - S0.ry * .28;
  const dC = new Float32Array(N); let RMAX = 0;
  for (let i = 0; i < N; i++) { dC[i] = Math.hypot(D.pts[2*i] - CX, D.pts[2*i+1] - CY); if (S0.m[i] > .05 && dC[i] > RMAX) RMAX = dC[i]; }
  const med = a => { a.sort((x, y) => x - y); return a[a.length >> 1] || 0; };
  // line spacing in shape units and which way the phase runs away from the core
  const grads = [], dirs = [];
  for (let n = 0; n < N; n++) { if (S0.m[n] < .6) continue; const a = diag[4*n], c2 = diag[4*n + 1];
    if (a < 0 || c2 < 0) continue;
    const db1 = S0.b[a] - S0.b[n], db2 = S0.b[c2] - S0.b[n];
    grads.push(Math.hypot(db1, db2) / (A * Math.SQRT2)); dirs.push(Math.sign(db1 * (dC[a] - dC[n]) + db2 * (dC[c2] - dC[n]))); }
  const LINE = 1 / med(grads), SGN = med(dirs) < 0 ? -1 : 1;
  // press front: not a circle. It follows the print's own lines counted out from the core,
  // stretched to the silhouette in each direction, with a slow uneven wobble on top.
  const PRESS_LINES = .6, PRESS_SIL = .4, PRESS_WOBBLE = .12;
  const BINS = 96, ext = new Float32Array(BINS);
  const angOf = i => Math.atan2(D.pts[2*i+1] - CY, D.pts[2*i] - CX);
  for (let i = 0; i < N; i++) if (S0.m[i] > .3) { const k = Math.floor((angOf(i) / TAU + .5) * BINS) % BINS; if (dC[i] > ext[k]) ext[k] = dC[i]; }
  const extS = ext.map((_, k) => { let s = 0, n = 0; for (let j = -4; j <= 4; j++) { const v = ext[(k + j + BINS) % BINS]; if (v > 0) { s += v; n++; } } return n ? s / n : RMAX; });
  let core = 0; for (let i = 1; i < N; i++) if (dC[i] < dC[core]) core = i;
  const dP = new Float32Array(N); let PMAX = 0;
  for (let i = 0; i < N; i++) {
    const a = angOf(i), u = (a / TAU + .5) * BINS, k0 = Math.floor(u) % BINS, fr = u - Math.floor(u);
    const e = extS[k0] * (1 - fr) + extS[(k0 + 1) % BINS] * fr;
    const sil = dC[i] / Math.max(e, 60) * RMAX;                          // silhouette-shaped distance
    const lines = Math.max(0, SGN * (S0.b[i] - S0.b[core])) * LINE;      // ridge count from the core
    const wob = 1 + PRESS_WOBBLE * (Math.sin(3 * a + 1.3) + .6 * Math.sin(5 * a + .4) + .4 * Math.sin(8 * a + 2.1));
    dP[i] = (PRESS_LINES * Math.min(lines, sil * 1.6) + PRESS_SIL * sil) * wob;
    if (S0.m[i] > .05 && dP[i] > PMAX) PMAX = dP[i];
  }
  let dis = 1;                                        // isolation file: the hero has already scrolled out, only the mist is left
  const MIST_H = 1.5;                                 // size of the mist dots left behind (shape units)
  const MIST_R = 380;                                 // mist: reach of the cursor (shape units); dots grow within it
  const INTRO_LEN = 3.5;                              // seconds; the cursor press waits until it is over
  let introT0 = performance.now(), introOn = false;

  let cur = 0;
  const copy = s => ({ b: s.b.slice(), f: s.f.slice(), w: s.w.slice(), m: s.m.slice(), h: s.h.slice() });
  const shown = copy(F[0]);
  let from = copy(shown), to = { ...F[0], shift: 0 };
  const dist = new Float32Array(N);
  let t0 = -1, tEnd = 0;
  const press = { x: D.W / 2, y: D.H / 2, tx: D.W / 2, ty: D.H / 2, amt: 0, target: 0, force: 1 };
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function bestShift(a, b) {
    const diffs = [];
    for (let i = 0; i < N; i += 3) if (a.m[i] > .3 || b.m[i] > .3) diffs.push(a.b[i] - b.b[i]);
    diffs.sort((x, y) => x - y);
    return Math.round(diffs[diffs.length >> 1] || 0);
  }
  function morph(px, py, to_ = (cur + 1) % order.length) {
    from = copy(shown);
    cur = to_;
    const T = F[cur];
    to = { ...T, shift: bestShift(from, T) };
    let max = 0;
    for (let i = 0; i < N; i++) { const d = Math.hypot(D.pts[2*i] - px, D.pts[2*i+1] - py); dist[i] = d; if (d > max) max = d; }
    t0 = performance.now(); tEnd = t0 + max / SPEED + LOCAL;
    kick();
  }

  // placement: the print sits right of the type on desktop and below it on a phone, larger than
  // the screen so its lines run off the edges
  const view = { k: 1, ox: 0, oy: 0, w: 0, h: 0, dpr: 1 };
  function place() {
    const r = cvs.getBoundingClientRect(); view.w = r.width; view.h = r.height;
    view.dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = Math.round(view.w * view.dpr); cvs.height = Math.round(view.h * view.dpr);
    const S = F[0], coreX = S.cx, coreY = S.cy - S.ry * .28;
    if (view.w >= 1024) {
      view.k = Math.max(.6, Math.min(view.w / 1440, view.h / 900));
      view.ox = view.w * (.742 + Math.max(0, Math.min(1, (1440 - view.w) / 416)) * .1) - coreX * view.k;
      view.oy = view.h * .44 - coreY * view.k;
    } else if (view.w > 600) {
      view.k = Math.max(.62, view.w / 1440 * 1.15);
      view.ox = view.w * .7 - coreX * view.k;
      view.oy = view.h * .3 - coreY * view.k;
    } else {
      view.k = Math.max(.5, view.w / 1440 * 1.6);
      view.ox = view.w * .62 - coreX * view.k;
      view.oy = view.h * .2 - coreY * view.k;
    }
  }
  const toShape = (cx, cy) => { const r = cvs.getBoundingClientRect();
    return [(cx - r.left - view.ox) / view.k, (cy - r.top - view.oy) / view.k]; };

  const dmd = (P, x, y, hh) => { P.moveTo(x, y - hh); P.lineTo(x + hh, y); P.lineTo(x, y + hh); P.lineTo(x - hh, y); P.closePath(); };

  function draw(now) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.setTransform(view.k * view.dpr, 0, 0, view.k * view.dpr, view.ox * view.dpr, view.oy * view.dpr);
    paths.clear(); Dr.fill(0);
    // base gradient by screen height; while idle it drifts: a slow diagonal swell moves through the print
    const ga = GRAD_AMP * gradAmt, gph = gradT / GRAD_PERIOD * TAU;
    const bandOf = (x, y) => { const sx = (x * view.k + view.ox) / view.w, sy = (y * view.k + view.oy) / view.h;
      const g = sy + ga * Math.sin(TAU * (.55 * sx + .35 * sy) - gph) + ga * .5 * Math.sin(TAU * (.2 * sx - .6 * sy) - gph * .6 + 1.7);
      return Math.max(0, Math.min(Y_BANDS - 1, Math.floor(g * Y_BANDS))); };
    const mz = smooth(.3, .8, dis);                    // 0 in the hero, 1 once only the mist is left
    const pz = press.amt * mz;                         // cursor presence on the mist
    const r = D.round * (1 - .7 * dis), hmax = D.hmax, hmin = D.hmin, active = t0 >= 0 && now < tEnd;   // finer dots on the mist
    const pa = press.amt * press.force * (introOn ? smooth(.15, 1.4, (now - introT0) / 1000) : 1) * (1 - .8 * dis);   // a fifth of the press on the mist
    const d0 = Math.hypot(press.x - D.W / 2, press.y - D.H / 2);
    const R = P_RADIUS + P_REACH * Math.max(0, d0 - P_RADIUS), pr2 = R * R;
    const far = smooth(FAR_FROM, FAR_TO, d0) * pa;
    const qNear = Math.exp(-Math.pow(Math.max(0, d0 - 560), 2) / pr2);
    const it = (now - introT0) / 1000, ik = introOn && it < INTRO_LEN;
    const cull = ik ? .5 : (dis > .05 ? .4 : hmin);
    const frontR = 30 + (1 - Math.pow(1 - Math.min(1, it / 3.0), 2)) * (PMAX + 300), inkFade = 1 - smooth(2.0, 3.4, it);
    for (let i = 0; i < N; i++) {
      let b, f, w, m, hl, swell = 0;
      if (active) {
        const t = ease(Math.min(1, Math.max(0, (now - t0 - dist[i] / SPEED) / LOCAL)));
        b = from.b[i] + (to.b[i] + to.shift - from.b[i]) * t;
        const zx = (1 - t) * Math.cos(TAU * from.f[i]) + t * Math.cos(TAU * to.f[i]);
        const zy = (1 - t) * Math.sin(TAU * from.f[i]) + t * Math.sin(TAU * to.f[i]);
        f = Math.atan2(zy, zx) / TAU;
        w = from.w[i] + (to.w[i] - from.w[i]) * t;
        m = from.m[i] + (to.m[i] - from.m[i]) * t;
        hl = from.h[i] + (to.h[i] - from.h[i]) * t;
        swell = SWELL * Math.sin(Math.PI * t);
        shown.b[i] = b; shown.f[i] = f; shown.w[i] = w; shown.m[i] = m; shown.h[i] = hl;
      } else {
        b = shown.b[i] = to.b[i] + to.shift; f = shown.f[i] = to.f[i];
        w = shown.w[i] = to.w[i]; m = shown.m[i] = to.m[i]; hl = shown.h[i] = to.h[i];
      }
      let c = b + f;
      Mf[i] = 0;
      let x = D.pts[2*i], y = D.pts[2*i+1];
      // intro: squares grow in behind the press front, which carries a little extra ink outward
      let rv = 1;
      if (ik) {
        const d = dC[i];
        {
          const e = frontR - dP[i], bump = Math.exp(-Math.pow((e - 50) / 120, 2)) * inkFade;
          rv = smooth(-30, 120, e);
          w = Math.min(.92, w + .34 * bump);
          m = Math.max(m * rv, hl * .85 * bump);
          const push = 14 * bump / Math.max(d, 1); x += (x - CX) * push; y += (y - CY) * push;
        }
      }
      if (hl < .01) continue;
      let p = 0, q = 0, away = 0, g = 0;
      if (pa > .001) {
        const dx = x - press.x, dy = y - press.y;
        q = Math.min(1, Math.exp(-(dx * dx + dy * dy) / pr2) / qNear);
        p = pa * q;
        away = 1 - q;
        // on the mist the whole-print reactions (the far side letting go, the pull to the press) fade out:
        // together they read as a tilting 3D object; the mist only smears along the cursor's movement
        w = Math.min(.9, w + P_SPREAD * p) - (LIFT_W * pa * away + FAR_W * far * away) * (1 - mz);
        m = (1 - Math.pow(1 - m, 1 + P_EDGE * p)) * (1 - LIFT_M * pa * away * (1 - m * m) * (1 - mz));
        m *= 1 - FAR_M * far * Math.pow(away, 1.6) * (1 - mz);
        m = Math.max(m, hl * P_SPILL * p * p);
        c = b * (1 + P_DENSE * p) + f;
        g = GRAVITY * p * Math.min(1, P_RADIUS / R) * (1 - mz);
        x -= dx * g; y -= dy * g;
      }
      // heat: warm where pressed, cool on the side that lets go, neutral white at rest
      const heat = p > .04 ? Math.round(Math.min(1, p * 1.15) * WARM_STEPS) : -Math.round(pa * away * DIM_STEPS * (1 - mz));
      Cf[i] = c - swell; Wf[i] = w; Mf[i] = m; Hf[i] = heat;
      if (m < .01) continue;
      const v = .5 + .5 * Math.cos(TAU * (c - swell));
      const soft = 1 - P_CRISP * p;
      let s = smooth(1 - w - .34 * soft, 1 - w + .30 * soft, v) * Math.max(m, 0);
      s *= 1 + .12 * jit[i] * (1 - s);
      let h = hmax * s * rv;
      // scroll-out: the work disappears from the outer edge in, squares shrink to a mist of fine dots
      if (dis > 0) { const th = (1 - dis) * (PMAX + 320) - 60, kd = smooth(-160, 0, th - dP[i]);
        h = Math.max(h * kd, s > .4 ? MIST_H * Math.min(1, dis * 1.6) : 0); }
      // mist: the small dimmed dots are the resting form and never go away; around the cursor they grow,
      // getting smaller again with distance until they are back at their resting size
      if (pz > .01) h *= 1 + .8 * pz * (1 - smooth(0, MIST_R * .7, Math.hypot(x - press.x, y - press.y)));
      if (h < cull) continue;
      const room = (A - r - .6) * (1 - 1.5 * g);          // diagonal neighbours touch at half-diagonal A
      let hh = Math.max(Math.min(h - r, room), dis > .5 ? .2 : .4);
      // hard rule: never touch a square already drawn next to it (squares are L1 balls: apart when the
      // L1 distance is at least the sum of their reaches)
      for (let k2 = 0; k2 < 8; k2++) { const nb = k2 < 4 ? diag[4*i + k2] : axn[4*i + k2 - 4];
        if (nb >= 0 && Dr[nb]) hh = Math.min(hh, Math.abs(Xs[nb] - x) + Math.abs(Ys[nb] - y) - Hs[nb] - r - 1); }
      if (hh < .5) continue;
      dmd(pathFor(bandOf(x, y), heat), x, y, hh); Dr[i] = 1; Xs[i] = x; Ys[i] = y; Hs[i] = hh + r;
    }
    const tp = Math.max(pa * (1 - mz), pz);             // trail strength: the hero's press, or the cursor on the mist
    if (tp > .001 && TRAIL > 0) {
      const L = TRAIL * tp;
      for (let i = 0; i < N; i++) {
        if (Mf[i] > .45 || Dr[i]) continue;
        let x = D.pts[2*i], y = D.pts[2*i+1];
        { const dx = x - press.x, dy = y - press.y;
          const g = GRAVITY * pa * Math.min(1, Math.exp(-(dx * dx + dy * dy) / pr2) / qNear) * Math.min(1, P_RADIUS / R);
          x -= dx * g; y -= dy * g; }
        let ux = press.x - x, uy = press.y - y; const ul = Math.hypot(ux, uy);
        if (ul < 1) continue; ux /= ul; uy /= ul;
        for (let k = 1; k <= 4; k++) {
          const j = near(x - ux * L * k / 4, y - uy * L * k / 4);
          if (j < 0 || Mf[j] < .35) continue;
          const v = .5 + .5 * Math.cos(TAU * Cf[j]);
          const s = smooth(1 - Wf[j] - .34, 1 - Wf[j] + .30, v) * Mf[j];
          const h = (mz > .5 ? MIST_H * 2.2 : hmax * TRAIL_SIZE) * s * (1 - (k - 1) / 4) * tp * (1 - Mf[i]);
          if (h > (mz > .5 ? .3 : .9)) {
            const hd = Math.min(h - r, 3.2) + r;
            let clear = true;                                   // keep clear of the drawn squares around it
            for (let k2 = 0; k2 < 8 && clear; k2++) { const nb = k2 < 4 ? diag[4*i + k2] : axn[4*i + k2 - 4];
              if (nb >= 0 && Dr[nb] && Math.abs(Xs[nb] - x) + Math.abs(Ys[nb] - y) < Hs[nb] + hd + 1.5) clear = false; }
            if (clear) { dmd(pathFor(bandOf(x, y), Hf[j]), x, y, Math.max(hd - r, .35)); Dr[i] = 1; Xs[i] = x; Ys[i] = y; Hs[i] = hd; }
          }
          break;
        }
      }
    }
    ctx.lineWidth = 2 * r; ctx.lineJoin = 'round';
    for (const [k, P] of paths) { ctx.fillStyle = ctx.strokeStyle = PAL.get(k); ctx.fill(P); ctx.stroke(P); }
  }

  // ---- loop: pointer press, ambient drift, morph; sleeps off screen and when paused ---------
  let raf = 0, visible = true, lastPointer = -1e9, ambientT = Math.random() * 100, lastNow = performance.now();
  let gradT = Math.random() * GRAD_PERIOD, gradAmt = 0;   // idle gradient drift: its clock and strength
  const kick = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
  function frame(now) {
    const dt = Math.min(64, now - lastNow); lastNow = now;
    { const live = !paused && !reduced && now - lastPointer > IDLE_MS;
      gradAmt += ((live ? 1 : 0) - gradAmt) * (live ? .012 : .05);
      if (!paused && !reduced) gradT += dt / 1000; }
    const inIntro = introOn && now - introT0 < INTRO_LEN * 1000;
    // the cursor press works from the first frame (it builds with the reveal, see draw); only the
    // ambient press waits until the reveal is over, plus about a second
    const ambientOk = !introOn || now - introT0 > INTRO_LEN * 1000 + 900;
    // a resting cursor keeps its press; the ambient press only runs when no cursor is over the page
    const idle = !pointerIn && now - lastPointer > IDLE_MS && ambientOk && dis < .05;
    if (!pointerIn && !ambientOk) press.target = 0;
    // cursor resting: after REST_MS the press lets go (shape and colours settle back), and a print that was
    // morphed on hover flows back to the first one; any movement brings the press back
    if (pointerIn && now - lastPointer > REST_MS && !inIntro) {
      press.target = 0;
      if (cur !== 0 && !(t0 >= 0 && now < tEnd)) morph(press.x, press.y, 0);
    }
    if (idle && !paused && !reduced) {
      // a slow loop around the print, just off its edge, so a soft warm patch keeps moving
      ambientT += dt * .00011;
      press.tx = D.W / 2 + Math.cos(ambientT * 1.0) * D.W * .62;
      press.ty = D.H / 2 + Math.sin(ambientT * 1.7) * D.H * .46;
      press.target = AMBIENT; press.force = 1;
    } else if (idle) press.target = 0;
    const follow = idle ? .02 : P_FOLLOW;
    press.amt += (press.target - press.amt) * (press.target > press.amt ? (idle ? .02 : P_IN) : P_OUT);
    press.x += (press.tx - press.x) * follow;
    press.y += (press.ty - press.y) * follow;
    draw(now);
    const moving = inIntro || (introOn && !ambientOk && !paused && !reduced) || (idle && !paused && !reduced) || Math.abs(press.target - press.amt) > .002 || Math.hypot(press.tx - press.x, press.ty - press.y) > .5;
    raf = (visible && (now < tEnd || moving)) ? requestAnimationFrame(frame) : 0;
  }

  let armed = true, pointerIn = false, restTimer = 0;
  const introBusy = () => introOn && performance.now() - introT0 < INTRO_LEN * 1000;
  const onPointer = e => {
    if (paused || e.pointerType === 'touch') return;
    pointerIn = true;
    clearTimeout(restTimer); restTimer = setTimeout(kick, REST_MS + 30);   // wake the loop to let go after a rest
    const [x, y] = toShape(e.clientX, e.clientY);
    if (performance.now() - lastPointer > IDLE_MS) { press.x = x; press.y = y; }
    lastPointer = performance.now();
    press.tx = x; press.ty = y; press.target = 1;
    press.force = e.pressure > 0 && e.pointerType !== 'mouse' ? .4 + 1.2 * e.pressure : 1;
    const S = F[cur], zx = (x - S.cx) / (S.rx * HOVER_ZONE), zy = (y - S.cy) / (S.ry * HOVER_ZONE);
    const z = zx * zx + zy * zy, busy = t0 >= 0 && performance.now() < tEnd;
    if (z < 1 && armed && !busy && !introBusy()) { armed = false; morph(x, y); }   // also on the mist
    else if (z > 1.3) armed = true;
    kick();
  };
  // pointerover also fires when the page appears under a cursor that has not moved yet
  addEventListener('pointermove', onPointer, { passive: true });
  addEventListener('pointerover', onPointer, { passive: true });
  // touch: a ripple runs out from the point of touch and the press warms that spot
  cvs.parentElement.addEventListener('pointerdown', e => {
    if (paused || e.pointerType !== 'touch' || e.target.closest('a,button')) return;
    const [x, y] = toShape(e.clientX, e.clientY);
    lastPointer = performance.now();
    Object.assign(press, { x, y, tx: x, ty: y, target: 1, force: .4 + 1.2 * (e.pressure || .5) });
    if (!(t0 >= 0 && performance.now() < tEnd) && !introBusy()) morph(x, y);
    kick();
  });
  const release = () => { pointerIn = false; press.target = 0; lastPointer = performance.now(); kick(); };
  document.documentElement.addEventListener('pointerleave', release);
  addEventListener('pointerup', e => { if (e.pointerType === 'touch') release(); });
  addEventListener('blur', release);

  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); }).observe(cvs);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) kick(); });

  let rz = 0;
  addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { place(); draw(performance.now()); kick(); }); });
  window.heroMist = .32;                                    // section 02 raises it on its last step
  const setMist = () => { cvs.style.opacity = window.heroMist.toFixed(3); };
  addEventListener('heromist', setMist);
  place(); setMist(); draw(performance.now()); kick();
})();
