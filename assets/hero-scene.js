/* Mikanda — scène « motion design » de l'accueil.
   Un travelling dans une allée de bibliothèque, calculé uniquement à partir
   de la progression p (0 → 1) : même p = même image, aucune horloge. */
(() => {
  // Générateur pseudo-aléatoire à graine fixe : la bibliothèque est toujours la même.
  const mulberry32 = (seed) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const C = {
    night: hex("#0c1913"),
    wall: hex("#112219"),
    wood: hex("#1c3a2d"),
    woodLight: hex("#2c5a43"),
    floor: hex("#16271e"),
    runner: hex("#5a2a1b"),
    brass: hex("#d9ad62"),
    brassSoft: hex("#ecd3a2"),
    ivory: hex("#f6f2e9"),
    clay: hex("#b85235"),
    sage: hex("#6b866f"),
    gold: hex("#e6bd76"),
  };
  const SPINES = ["#b85235", "#8f3f28", "#6b866f", "#4c6b55", "#d9ad62", "#a87b3a", "#e4dbc8", "#c9bba0", "#2c5a43", "#3f4d45", "#7d5a3c", "#ecd3a2"].map(hex);

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const io = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out = (t) => 1 - Math.pow(1 - t, 3);
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  // Ressort amorti (réponse indicielle, amortissement 0,78 : léger dépassement, jamais de rebond)
  const spring = (t, w = 9, z = 0.78) => {
    if (t <= 0) return 0;
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  };
  const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

  /* ---------- Le monde ---------- */
  const L = 24; // longueur de l'allée
  const HW = 0.88; // demi-largeur de l'allée (façade des étagères)
  const BACK = 1.06; // fond des étagères
  const H = 2.25; // hauteur sous plafond
  const SHELVES = [0.06, 0.44, 0.82, 1.2, 1.58]; // planches
  const GAP = 0.38; // hauteur entre deux planches
  const UNIT = 1.5; // largeur d'un module d'étagère
  const DOOR = 1.9; // hauteur de la porte d'entrée

  const rand = mulberry32(1958);
  const books = [];
  for (const side of [-1, 1]) {
    for (const y0 of SHELVES) {
      let z = 0.08;
      while (z < L - 0.3) {
        const unitEnd = Math.ceil((z + 0.001) / UNIT) * UNIT - 0.05;
        const w = 0.045 + rand() * 0.07;
        if (z + w > unitEnd) {
          z = unitEnd + 0.1;
          continue;
        }
        if (rand() < 0.035) {
          z += 0.05 + rand() * 0.12; // un vide sur le rayon
          continue;
        }
        const h = GAP * (0.58 + rand() * 0.34);
        const color = SPINES[(rand() * SPINES.length) | 0];
        const shade = 0.82 + rand() * 0.3;
        books.push({ side, z1: z, z2: z + w, y0: y0 + 0.02, y1: y0 + 0.02 + h, c: color.map((v) => Math.min(255, v * shade)), band: rand() < 0.45 ? 0.62 + rand() * 0.2 : 0 });
        z += w + 0.004;
      }
    }
  }
  books.sort((a, b) => b.z1 - a.z1);

  const LAMPS = [];
  for (let z = 1.6; z < L - 1; z += 2.8) LAMPS.push(z);

  /* ---------- Projection ---------- */
  function makeCamera(w, h, p, wide) {
    const travel = io(seg(p, 0, 0.9));
    const camZ = lerp(-2.6, L - 4.5, travel) + out(seg(p, 0.9, 1)) * 1.2;
    const camX = Math.sin(p * Math.PI) * 0.07;
    const eye = 1.02 - 0.06 * seg(p, 0.75, 1);
    const f = Math.min(w * 0.95, h * 1.05);
    const cx = w * (wide ? 0.63 : 0.5);
    const cy = h * 0.5;
    return {
      camZ,
      near: 0.18,
      proj(x, y, z) {
        const d = z - camZ;
        return [cx + (f * (x - camX)) / d, cy - (f * (y - eye)) / d, d];
      },
      fog(z) {
        return clamp(1 - Math.exp(-(z - camZ) / 9));
      },
    };
  }

  function quad(ctx, pts, fill) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  /* ---------- Rendu ---------- */
  function render(ctx, w, h, p, opts = {}) {
    const wide = opts.wide ?? w / h > 1.1;
    const cam = makeCamera(w, h, p, wide);
    const zMin = cam.camZ + cam.near;
    const zFar = L;
    const fogC = C.night;

    ctx.save();
    ctx.fillStyle = rgb(C.night);
    ctx.fillRect(0, 0, w, h);

    // Sol, plafond et tapis
    const fz = Math.max(zMin, 0);
    const floor = [cam.proj(-BACK, 0, fz), cam.proj(BACK, 0, fz), cam.proj(BACK, 0, zFar), cam.proj(-BACK, 0, zFar)];
    const gFloor = ctx.createLinearGradient(0, h, 0, cam.proj(0, 0, zFar)[1]);
    gFloor.addColorStop(0, rgb(C.floor));
    gFloor.addColorStop(1, rgb(fogC));
    quad(ctx, floor, gFloor);
    const runner = [cam.proj(-0.34, 0, fz), cam.proj(0.34, 0, fz), cam.proj(0.34, 0, zFar), cam.proj(-0.34, 0, zFar)];
    const gRun = ctx.createLinearGradient(0, h, 0, cam.proj(0, 0, zFar)[1]);
    gRun.addColorStop(0, rgb(C.runner, 0.9));
    gRun.addColorStop(1, rgb(mix(C.runner, fogC, 0.85), 0.9));
    quad(ctx, runner, gRun);
    const ceil = [cam.proj(-BACK, H, fz), cam.proj(BACK, H, fz), cam.proj(BACK, H, zFar), cam.proj(-BACK, H, zFar)];
    quad(ctx, ceil, rgb(mix(C.night, [0, 0, 0], 0.25)));

    // Fond de l'allée : une baie lumineuse, la salle de lecture
    drawEnd(ctx, cam, p, w, h);

    // Flaques de lumière au sol
    ctx.globalCompositeOperation = "lighter";
    for (const z of LAMPS) {
      if (z < zMin + 0.2) continue;
      const c = cam.proj(0, 0, z);
      const r = cam.proj(0.85, 0, z)[0] - c[0];
      const fade = 1 - cam.fog(z);
      const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r);
      g.addColorStop(0, rgb(C.brass, 0.22 * fade));
      g.addColorStop(1, rgb(C.brass, 0));
      ctx.save();
      ctx.translate(c[0], c[1]);
      ctx.scale(1, 0.32);
      ctx.translate(-c[0], -c[1]);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(c[0], c[1], r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalCompositeOperation = "source-over";

    // Étagères des deux côtés : du plus loin au plus proche
    for (const side of [-1, 1]) {
      const backWall = [cam.proj(side * BACK, 0, fz), cam.proj(side * BACK, H, fz), cam.proj(side * BACK, H, zFar), cam.proj(side * BACK, 0, zFar)];
      quad(ctx, backWall, rgb(C.wall));
    }

    // Planches (dessus visibles sous l'œil, dessous au-dessus)
    for (let u = Math.floor(L / UNIT); u >= 0; u -= 1) {
      const z1 = Math.max(u * UNIT, zMin);
      const z2 = Math.min((u + 1) * UNIT, L);
      if (z2 <= z1) continue;
      const fogT = cam.fog((z1 + z2) / 2);
      for (const side of [-1, 1]) {
        for (const y of [...SHELVES, SHELVES[SHELVES.length - 1] + GAP + 0.02]) {
          const pts = [cam.proj(side * HW, y, z1), cam.proj(side * BACK, y, z1), cam.proj(side * BACK, y, z2), cam.proj(side * HW, y, z2)];
          quad(ctx, pts, rgb(mix(C.woodLight, fogC, fogT)));
        }
      }
    }

    // Livres
    for (const b of books) {
      if (b.z2 < zMin) continue;
      const z1 = Math.max(b.z1, zMin);
      const x = b.side * HW;
      const a = cam.proj(x, b.y0, z1);
      const c = cam.proj(x, b.y1, b.z2);
      const fogT = cam.fog(b.z1);
      const col = mix(b.c, fogC, fogT);
      const p1 = cam.proj(x, b.y1, z1);
      const p2 = cam.proj(x, b.y0, b.z2);
      quad(ctx, [a, p1, c, p2], rgb(col));
      // Filet doré du titre, seulement quand le livre est assez proche
      if (b.band && Math.abs(p2[0] - a[0]) > 5) {
        const y = b.y0 + (b.y1 - b.y0) * b.band;
        const t1 = cam.proj(x, y, z1);
        const t2 = cam.proj(x, y + 0.018, z1);
        const t3 = cam.proj(x, y + 0.018, b.z2);
        const t4 = cam.proj(x, y, b.z2);
        quad(ctx, [t1, t2, t3, t4], rgb(mix(C.brass, fogC, Math.min(1, fogT + 0.15)), 0.9));
      }
    }

    // Montants et façades de planches
    for (let u = Math.floor(L / UNIT); u >= 0; u -= 1) {
      const z = u * UNIT;
      if (z < zMin) continue;
      const fogT = cam.fog(z);
      for (const side of [-1, 1]) {
        const top = SHELVES[SHELVES.length - 1] + GAP + 0.06;
        const post = [cam.proj(side * HW, 0, z), cam.proj(side * HW, top, z), cam.proj(side * BACK, top, z), cam.proj(side * BACK, 0, z)];
        quad(ctx, post, rgb(mix(C.wood, fogC, fogT)));
        const edge = [cam.proj(side * HW, 0, z), cam.proj(side * HW, top, z), cam.proj(side * HW, top, z + 0.05), cam.proj(side * HW, 0, z + 0.05)];
        quad(ctx, edge, rgb(mix(C.woodLight, fogC, fogT)));
      }
    }
    for (let u = Math.floor(L / UNIT); u >= 0; u -= 1) {
      const z1 = Math.max(u * UNIT, zMin);
      const z2 = Math.min((u + 1) * UNIT, L);
      if (z2 <= z1) continue;
      const fogT = cam.fog(z1);
      for (const side of [-1, 1]) {
        for (const y of SHELVES) {
          const pts = [cam.proj(side * HW, y - 0.035, z1), cam.proj(side * HW, y + 0.02, z1), cam.proj(side * HW, y + 0.02, z2), cam.proj(side * HW, y - 0.035, z2)];
          quad(ctx, pts, rgb(mix(C.wood, fogC, fogT)));
        }
      }
    }

    // Suspensions en laiton
    for (const z of LAMPS) {
      if (z < zMin + 0.1) continue;
      const fade = 1 - cam.fog(z);
      const top = cam.proj(0, H, z);
      const lamp = cam.proj(0, H - 0.34, z);
      const r = Math.max(1, cam.proj(0.14, 0, z)[0] - cam.proj(0, 0, z)[0]);
      ctx.strokeStyle = rgb(C.brass, 0.5 * fade);
      ctx.lineWidth = Math.max(1, r * 0.06);
      ctx.beginPath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(lamp[0], lamp[1]);
      ctx.stroke();
      quad(ctx, [[lamp[0] - r * 0.35, lamp[1]], [lamp[0] + r * 0.35, lamp[1]], [lamp[0] + r, lamp[1] + r * 0.55], [lamp[0] - r, lamp[1] + r * 0.55]], rgb(mix(C.brass, fogC, cam.fog(z) * 0.8)));
      ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(lamp[0], lamp[1] + r * 0.6, 0, lamp[0], lamp[1] + r * 0.6, r * 4.5);
      g.addColorStop(0, rgb(C.brassSoft, 0.55 * fade));
      g.addColorStop(1, rgb(C.brass, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(lamp[0], lamp[1] + r * 0.6, r * 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    // Façade d'entrée : la caméra part du seuil de la bibliothèque
    if (cam.camZ + cam.near < 0) drawFacade(ctx, cam, w, h);

    // Vignettage doux
    const v = ctx.createRadialGradient(w * (wide ? 0.63 : 0.5), h * 0.5, Math.min(w, h) * 0.25, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(5,12,9,0.55)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  /* Façade : un mur lambrissé percé de l'entrée de l'allée, plaque en laiton au-dessus */
  function drawFacade(ctx, cam, w, h) {
    const tl = cam.proj(-BACK, DOOR, 0);
    const br = cam.proj(BACK, 0, 0);
    const s = cam.proj(1, 0, 0)[0] - cam.proj(0, 0, 0)[0];

    // Sol devant l'entrée, avec le tapis qui sort de l'allée
    const zn = cam.camZ + cam.near;
    quad(ctx, [cam.proj(-8, 0, zn), cam.proj(8, 0, zn), cam.proj(8, 0, 0), cam.proj(-8, 0, 0)], rgb(C.floor));
    quad(ctx, [cam.proj(-0.34, 0, zn), cam.proj(0.34, 0, zn), cam.proj(0.34, 0, 0), cam.proj(-0.34, 0, 0)], rgb(C.runner, 0.9));

    ctx.beginPath();
    ctx.rect(0, 0, w, br[1]);
    ctx.rect(tl[0], tl[1], br[0] - tl[0], br[1] - tl[1]);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, rgb(mix(C.wall, C.night, 0.4)));
    g.addColorStop(1, rgb(C.wall));
    ctx.fillStyle = g;
    ctx.fill("evenodd");

    // Lambris verticaux
    ctx.fillStyle = rgb(mix(C.wood, C.wall, 0.35));
    const step = s * 0.42;
    for (let x = tl[0] - step * 0.5; x > -step; x -= step) ctx.fillRect(x, 0, Math.max(1, s * 0.012), h);
    for (let x = br[0] + step * 0.5; x < w + step; x += step) ctx.fillRect(x, 0, Math.max(1, s * 0.012), h);
    ctx.fillRect(0, br[1] - s * 0.02, w, Math.max(2, s * 0.03));

    // Encadrement de la porte
    const t = Math.max(2, s * 0.05);
    ctx.fillStyle = rgb(C.wood);
    ctx.fillRect(tl[0] - t, tl[1] - t, br[0] - tl[0] + t * 2, t);
    ctx.fillRect(tl[0] - t, tl[1] - t, t, br[1] - tl[1] + t);
    ctx.fillRect(br[0], tl[1] - t, t, br[1] - tl[1] + t);
    ctx.fillStyle = rgb(C.brass, 0.85);
    ctx.fillRect(tl[0] - t, tl[1] - t * 1.25, br[0] - tl[0] + t * 2, t * 0.25);

    // Plaque « mikanda. »
    const pw = s * 0.9;
    const ph = s * 0.2;
    const px = (tl[0] + br[0]) / 2 - pw / 2;
    const py = tl[1] - t * 1.25 - ph - s * 0.08;
    ctx.fillStyle = rgb(C.brass);
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = rgb(C.night);
    ctx.font = `600 ${ph * 0.6}px Fraunces, Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("mikanda", px + pw / 2, py + ph / 2 + ph * 0.04);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  /* La baie du fond, le livre ouvert et la marque Mikanda */
  function drawEnd(ctx, cam, p, w, h) {
    const z = L;
    const fogT = cam.fog(z) * 0.55;
    const wall = [cam.proj(-BACK, 0, z), cam.proj(-BACK, H, z), cam.proj(BACK, H, z), cam.proj(BACK, 0, z)];
    quad(ctx, wall, rgb(mix(C.wall, C.night, fogT)));

    // Baie cintrée lumineuse
    const bl = cam.proj(-0.62, 0, z);
    const tr = cam.proj(0.62, 1.78, z);
    const aw = tr[0] - bl[0];
    const ah = bl[1] - tr[1];
    const g = ctx.createLinearGradient(0, tr[1], 0, bl[1]);
    g.addColorStop(0, rgb(mix(C.ivory, C.night, fogT)));
    g.addColorStop(0.6, rgb(mix(C.brassSoft, C.night, fogT)));
    g.addColorStop(1, rgb(mix(C.brass, C.night, fogT + 0.1)));
    ctx.beginPath();
    ctx.moveTo(bl[0], bl[1]);
    ctx.lineTo(bl[0], tr[1] + aw / 2);
    ctx.arc(bl[0] + aw / 2, tr[1] + aw / 2, aw / 2, Math.PI, 0);
    ctx.lineTo(tr[0], bl[1]);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();

    // Halo de la baie
    ctx.globalCompositeOperation = "lighter";
    const cx = bl[0] + aw / 2;
    const cy = bl[1] - ah * 0.45;
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, aw * 2.2);
    halo.addColorStop(0, rgb(C.brass, 0.32 * (1 - fogT)));
    halo.addColorStop(1, rgb(C.brass, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(cx - aw * 2.2, cy - aw * 2.2, aw * 4.4, aw * 4.4);
    ctx.globalCompositeOperation = "source-over";

    // Pupitre et livre ouvert, devant la baie
    const lz = L - 1.1;
    if (lz <= cam.camZ + cam.near) return;
    const s = cam.proj(1, 0, lz)[0] - cam.proj(0, 0, lz)[0]; // pixels par unité à cette profondeur
    const base = cam.proj(0, 0, lz);
    const top = cam.proj(0, 1.0, lz);
    ctx.fillStyle = rgb(C.wood);
    ctx.fillRect(base[0] - s * 0.05, top[1], s * 0.1, base[1] - top[1]);
    quad(ctx, [[base[0] - s * 0.3, base[1]], [base[0] + s * 0.3, base[1]], [base[0] + s * 0.2, base[1] - s * 0.05], [base[0] - s * 0.2, base[1] - s * 0.05]], rgb(C.wood));
    // Plateau incliné
    const tilt = s * 0.1;
    quad(ctx, [[top[0] - s * 0.42, top[1] + tilt], [top[0] + s * 0.42, top[1] + tilt], [top[0] + s * 0.36, top[1] - tilt * 0.6], [top[0] - s * 0.36, top[1] - tilt * 0.6]], rgb(C.woodLight));

    // Le livre s'ouvre (p 0,78 → 0,9)
    const open = io(seg(p, 0.76, 0.9));
    const bw = s * 0.36;
    const bh = s * 0.24;
    const by = top[1] - tilt * 0.6 - bh * 0.15;
    const spineX = top[0];
    const page = (dir, k) => {
      const reach = bw * (0.12 + 0.88 * k);
      quad(ctx, [[spineX, by + bh], [spineX + dir * reach, by + bh - bh * 0.05], [spineX + dir * reach * 0.98, by - bh * 0.04], [spineX, by]], rgb(mix(C.ivory, C.brassSoft, 0.25 + 0.2 * (1 - k))));
    };
    // Couverture
    quad(ctx, [[spineX - bw * 1.04, by + bh * 1.06], [spineX + bw * 1.04 * open + bw * 0.08, by + bh * 1.06], [spineX + bw * 1.0 * open + bw * 0.08, by - bh * 0.08], [spineX - bw * 1.0, by - bh * 0.08]], rgb(C.clay));
    page(-1, 1);
    page(1, open);
    // Une page qui tourne
    const flip = seg(p, 0.84, 0.92);
    if (flip > 0 && flip < 1) {
      const k = Math.cos(io(flip) * Math.PI);
      page(k >= 0 ? 1 : -1, Math.abs(k));
    }

    // Les trois barres de la marque s'élèvent du livre (p 0,88 → 1)
    const bars = [
      { x: -0.66, w: 0.38, h: 0.8, c: C.clay, t: 0.88 },
      { x: -0.19, w: 0.38, h: 1.0, c: C.sage, t: 0.905 },
      { x: 0.28, w: 0.38, h: 0.84, c: C.gold, t: 0.93 },
    ];
    const unit = bw * 0.72;
    for (const bar of bars) {
      const k = spring((p - bar.t) * 9);
      if (k <= 0) continue;
      const x0 = spineX + bar.x * unit;
      const y0 = by - bh * 0.02;
      const height = bar.h * unit * 2.1 * k;
      const skew = unit * 0.12;
      quad(ctx, [[x0, y0], [x0, y0 - height], [x0 + bar.w * unit, y0 - height - skew], [x0 + bar.w * unit, y0 - skew]], rgb(bar.c));
      ctx.strokeStyle = rgb(C.night, 0.55);
      ctx.lineWidth = Math.max(1, unit * 0.025);
      ctx.stroke();
    }
  }

  window.MikandaScene = { render, duration: 12 };
})();
