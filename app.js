// =====================================================================
//  app.js  —  WHAT THE APP DOES
//  Sections (search for the numbers to jump around):
//    1. Settings          6. Drawing on the photo
//    2. Words (ES / EN)   7. Screens (home, form, editor, detail)
//    3. Saving on phone   8. Voice
//    4. Helpers           9. Export CSV
//    5. Photos & weather 10. Start the app
// =====================================================================
'use strict';
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const CODES = window.APP_CODES;

  // ===================================================================
  // 1. SETTINGS (language, GC name, last floor) — kept on this phone
  // ===================================================================
  const DEFAULTS = { lang: 'es', gcName: '', lastFloor: '' };
  const settings = (function () {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('rl-settings') || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  })();
  function saveSettings() {
    try { localStorage.setItem('rl-settings', JSON.stringify(settings)); } catch (e) { /* ignore */ }
  }

  // ===================================================================
  // 2. WORDS IN BOTH LANGUAGES
  // ===================================================================
  const STR = {
    es: {
      appTitle: 'Registro de Reparaciones',
      newRepair: 'Nueva reparación',
      howTo: 'Pasos a seguir',
      howToSteps: [
        'Toca "Nueva reparación" y llena piso, unidad, ubicación y código (o usa 🎤).',
        'Toma la foto de inicio. Se guardan la hora y el clima.',
        'Marca la foto: flechas, texto y acercamientos. Luego toca "Guardar foto".',
        'Cuando termines la reparación, ábrela y toma la foto final.',
        'Comparte las fotos o exporta el CSV para cobrar.'
      ],
      inProgress: 'En progreso', finished: 'Terminadas', all: 'Todas',
      noRepairs: 'Todavía no hay reparaciones. Toca "Nueva reparación" para empezar.',
      exportCsv: 'Exportar CSV', settings: 'Ajustes',
      localNote: 'Por ahora los datos se guardan solo en este teléfono. Comparte o descarga las fotos para respaldarlas.',
      sayInfo: 'Decir los datos',
      sayInfoHint: 'Ejemplo: "Piso 3, unidad 1321, cocina, código 1.1"',
      floor: 'Piso', unit: 'Unidad', location: 'Ubicación',
      locationPh: 'Ej. Cocina, recámara del fondo',
      area: 'Área', areaTag: 'Etiqueta de área (opcional)', areaPh: 'Ej. B02',
      code: 'Tipo de reparación', chooseCode: 'Elige un código…',
      takeStart: 'Tomar foto de inicio', takeEnd: 'Tomar foto final',
      orGallery: 'o elegir una foto de la galería',
      cancel: 'Cancelar', save: 'Guardar foto', back: '← Volver',
      needUnit: 'Escribe el número de unidad.', needCode: 'Elige el tipo de reparación.',
      toolArrow: 'Flecha', toolText: 'Texto', toolClose: 'Acercar', undo: 'Deshacer',
      hintArrow: 'Arrastra el dedo desde donde empieza la flecha hasta el punto que quieres señalar.',
      hintText: 'Toca la foto donde quieres poner la instrucción.',
      hintClose: 'Toca donde quieres el círculo y toma una foto de cerca del detalle.',
      badgeHint: 'Arrastra el número de unidad (borde punteado) para ponerlo junto a la flecha.',
      badgeCorner: '↙ Regresar número de unidad a la esquina',
      textTitle: 'Escribe o dicta la instrucción', textPh: 'Ej. Forrar cajón',
      dictate: '🎤 Dictar', ok: 'Agregar',
      weatherLoading: 'Obteniendo clima…',
      weatherFail: 'No se pudo obtener el clima. Revisa que la ubicación esté permitida y que haya internet.',
      retry: 'Reintentar',
      indoorTemp: 'Temperatura interior °F (opcional)',
      indoorHint: 'Si mides la temperatura dentro de la unidad, la alerta usa ese número.',
      start: 'Inicio', end: 'Fin', duration: 'Duración',
      elapsed: 'Tiempo desde la foto de inicio', outside: 'Ext', inside: 'Int',
      warnRed: 'Menos de 40°F: no se recomienda hacer acabado de drywall',
      warnYellow: '40–50°F: la mayoría de compuestos y pinturas piden 50°F o más',
      startPhoto: 'Foto de inicio', endPhoto: 'Foto final', share: 'Compartir / Guardar',
      delete: 'Borrar reparación',
      confirmDelete: '¿Borrar esta reparación y sus fotos? No se puede deshacer.',
      confirmDiscard: '¿Descartar esta foto y sus marcas?',
      saved: 'Guardado ✓', processing: 'Procesando foto…',
      noSpeech: 'Este navegador no permite dictado por voz. Prueba con Chrome en Android, o escribe.',
      speechError: 'No se escuchó bien', heard: 'Escuché',
      gcName: 'Nombre del GC actual',
      gcHint: 'Se guarda con cada reparación nueva de GC (código 6).',
      close: 'Cerrar',
      steps: ['Datos', 'Foto inicio', 'Marcar', 'Foto final', 'Listo'],
      longPress: 'Consejo: también puedes mantener presionada una foto para guardarla.',
      photoError: 'No se pudo abrir la foto.',
      storageError: 'No se pudo guardar en este teléfono.',
      dbError: 'Este navegador no permite guardar datos. Sal del modo incógnito.',
      open: 'En progreso', done: 'Terminada',
      w_clear: 'Despejado', w_partly: 'Parcialmente nublado', w_cloudy: 'Nublado', w_fog: 'Niebla',
      w_drizzle: 'Llovizna', w_rain: 'Lluvioso', w_snow: 'Nieve', w_showers: 'Chubascos', w_storm: 'Tormenta',
      csvName: 'reparaciones', tagStart: 'inicio', tagEnd: 'final',
      repairTitle: (trade, code) => `Reparación de ${trade} ${code}`
    },
    en: {
      appTitle: 'Repair Log',
      newRepair: 'New repair',
      howTo: 'Steps to follow',
      howToSteps: [
        'Tap "New repair" and fill in floor, unit, location and code (or use 🎤).',
        'Take the start photo. Time and weather are saved.',
        'Mark up the photo: arrows, text and close-ups. Then tap "Save photo".',
        'When the repair is done, open it and take the end photo.',
        'Share the photos or export the CSV for billing.'
      ],
      inProgress: 'In progress', finished: 'Finished', all: 'All',
      noRepairs: 'No repairs yet. Tap "New repair" to start.',
      exportCsv: 'Export CSV', settings: 'Settings',
      localNote: 'For now, data is saved only on this phone. Share or download photos to back them up.',
      sayInfo: 'Say the info',
      sayInfoHint: 'Example: "Floor 3, unit 1321, kitchen, code 1.1"',
      floor: 'Floor', unit: 'Unit', location: 'Location',
      locationPh: 'e.g. Kitchen, back bedroom',
      area: 'Area', areaTag: 'Area tag (optional)', areaPh: 'e.g. B02',
      code: 'Repair type', chooseCode: 'Choose a code…',
      takeStart: 'Take start photo', takeEnd: 'Take end photo',
      orGallery: 'or choose a photo from the gallery',
      cancel: 'Cancel', save: 'Save photo', back: '← Back',
      needUnit: 'Enter the unit number.', needCode: 'Choose the repair type.',
      toolArrow: 'Arrow', toolText: 'Text', toolClose: 'Close-up', undo: 'Undo',
      hintArrow: 'Drag your finger from where the arrow starts to the spot you want to point at.',
      hintText: 'Tap the photo where you want the instruction.',
      hintClose: 'Tap where you want the circle, then take a close-up photo of the detail.',
      badgeHint: 'Drag the unit number (dashed border) to place it next to the arrow.',
      badgeCorner: '↙ Move unit number back to the corner',
      textTitle: 'Type or dictate the instruction', textPh: 'e.g. Wrap the soffit',
      dictate: '🎤 Dictate', ok: 'Add',
      weatherLoading: 'Getting weather…',
      weatherFail: "Couldn't get the weather. Check that location is allowed and you have internet.",
      retry: 'Retry',
      indoorTemp: 'Indoor temperature °F (optional)',
      indoorHint: 'If you measure the temperature inside the unit, the warning uses that number.',
      start: 'Start', end: 'End', duration: 'Duration',
      elapsed: 'Time since start photo', outside: 'Out', inside: 'In',
      warnRed: 'Below 40°F: drywall finishing not recommended',
      warnYellow: '40–50°F: most compounds and paints need 50°F or more',
      startPhoto: 'Start photo', endPhoto: 'End photo', share: 'Share / Save',
      delete: 'Delete repair',
      confirmDelete: 'Delete this repair and its photos? This cannot be undone.',
      confirmDiscard: 'Discard this photo and its markups?',
      saved: 'Saved ✓', processing: 'Processing photo…',
      noSpeech: "This browser doesn't support voice dictation. Try Chrome on Android, or type.",
      speechError: "Didn't catch that", heard: 'Heard',
      gcName: 'Current GC name',
      gcHint: 'Saved with each new GC repair (code 6).',
      close: 'Close',
      steps: ['Info', 'Start photo', 'Mark up', 'End photo', 'Done'],
      longPress: 'Tip: you can also press and hold a photo to save it.',
      photoError: "Couldn't open the photo.",
      storageError: "Couldn't save on this phone.",
      dbError: "This browser can't save data. Leave private/incognito mode.",
      open: 'In progress', done: 'Done',
      w_clear: 'Clear', w_partly: 'Partly cloudy', w_cloudy: 'Cloudy', w_fog: 'Fog',
      w_drizzle: 'Drizzle', w_rain: 'Rain', w_snow: 'Snow', w_showers: 'Showers', w_storm: 'Thunderstorm',
      csvName: 'repairs', tagStart: 'start', tagEnd: 'end',
      repairTitle: (trade, code) => `${trade} Repair ${code}`
    }
  };
  function t(key) {
    const dict = STR[settings.lang] || STR.es;
    return key in dict ? dict[key] : key;
  }

  // ===================================================================
  // 3. SAVING ON THE PHONE (IndexedDB = a small database inside the browser)
  // ===================================================================
  const DB = {
    db: null,
    open() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open('repairlog', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('repairs', { keyPath: 'id' });
        req.onsuccess = () => { this.db = req.result; resolve(); };
        req.onerror = () => reject(req.error);
      });
    },
    store(mode) { return this.db.transaction('repairs', mode).objectStore('repairs'); },
    wrap(req) { return new Promise((res, rej) => { req.onsuccess = () => res(req.result); req.onerror = () => rej(req.error); }); },
    put(item) { return this.wrap(this.store('readwrite').put(item)); },
    get(id) { return this.wrap(this.store('readonly').get(id)); },
    all() { return this.db ? this.wrap(this.store('readonly').getAll()) : Promise.resolve([]); },
    del(id) { return this.wrap(this.store('readwrite').delete(id)); }
  };

  // ===================================================================
  // 4. HELPERS
  // ===================================================================
  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') e.className = v;
      else if (k.startsWith('on')) e[k] = v;
      else e.setAttribute(k, v);
    }
    for (const k of kids.flat()) {
      if (k == null) continue;
      e.append(k instanceof Node ? k : document.createTextNode(String(k)));
    }
    return e;
  }
  function uid() {
    return (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  let toastTimer;
  function toast(msg) {
    const box = $('#toast');
    box.textContent = msg;
    box.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.add('hidden'), 3000);
  }
  const localeTag = () => (settings.lang === 'es' ? 'es-MX' : 'en-US');
  function fmtDateTime(ms) { return new Date(ms).toLocaleString(localeTag(), { dateStyle: 'short', timeStyle: 'short' }); }
  function fmtDur(ms) {
    const m = Math.max(0, Math.round(ms / 60000));
    const h = Math.floor(m / 60);
    return h ? `${h}h ${m % 60}m` : `${m}m`;
  }
  function isoLocal(ms) {
    const d = new Date(ms), p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  // Look up a code like "1.1" -> its trade (Plumbing) and item (Water leaks)
  function findCode(code) {
    for (const trade of CODES.trades) {
      const item = trade.items.find(i => i.code === code);
      if (item) return { trade, item };
    }
    return null;
  }
  function tradeName(trade, repair) {
    let name = trade[settings.lang] || trade.es;
    if (trade.isGC) {
      const gc = (repair && repair.gcName) || (!repair && settings.gcName);
      if (gc) name = `GC (${gc})`;
    }
    return name;
  }
  function repairTitle(r) {
    const f = findCode(r.code);
    return f ? t('repairTitle')(tradeName(f.trade, r), r.code) : r.code;
  }
  function itemName(r) {
    const f = findCode(r.code);
    return f ? (f.item[settings.lang] || f.item.es) : '';
  }
  function placeLine(r) {
    const parts = [`${t('floor')} ${r.floor || '–'}`, `${t('unit')} ${r.unit}`];
    if (r.location) parts.push(r.location);
    if (r.area) parts.push(`${t('area')} ${r.area}`);
    return parts.join(' · ');
  }
  function fileName(r, which) {
    const stamp = isoLocal(r[which].time).replace(/[: ]/g, '-');
    const tag = which === 'before' ? t('tagStart') : t('tagEnd');
    const parts = [r.code, r.floor && 'P' + r.floor, 'U' + r.unit, r.location, r.area, stamp, tag].filter(Boolean);
    return parts.join('_').replace(/[^\w.\-áéíóúñÁÉÍÓÚÑ]+/g, '-') + '.jpg';
  }

  // ===================================================================
  // 5. PHOTOS & WEATHER
  // ===================================================================
  function blobToImg(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
      img.src = url;
    });
  }
  // Shrinks the photo so it takes ~250 KB instead of ~4 MB
  async function compress(file, maxSide, quality) {
    const img = await blobToImg(file);
    const k = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k);
    const c = el('canvas'); c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    const blob = await new Promise(res => c.toBlob(res, 'image/jpeg', quality));
    if (!blob) throw new Error('compress');
    return { blob, w, h };
  }

  function getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('no-geo'));
      navigator.geolocation.getCurrentPosition(resolve, reject,
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 15 * 60000 });
    });
  }
  // Free weather service (Open-Meteo). No account or key needed.
  async function fetchWeather() {
    const { latitude, longitude } = (await getPosition()).coords;
    const url = 'https://api.open-meteo.com/v1/forecast'
      + `?latitude=${latitude.toFixed(3)}&longitude=${longitude.toFixed(3)}`
      + '&current=temperature_2m,weather_code&temperature_unit=fahrenheit';
    const res = await fetch(url);
    if (!res.ok) throw new Error('weather ' + res.status);
    const data = await res.json();
    return { tempF: Math.round(data.current.temperature_2m), code: data.current.weather_code };
  }
  function weatherInfo(code) {
    if (code === 0) return { emoji: '☀️', key: 'w_clear' };
    if (code === 1 || code === 2) return { emoji: '⛅', key: 'w_partly' };
    if (code === 3) return { emoji: '☁️', key: 'w_cloudy' };
    if (code === 45 || code === 48) return { emoji: '🌫️', key: 'w_fog' };
    if (code >= 51 && code <= 57) return { emoji: '🌦️', key: 'w_drizzle' };
    if (code >= 61 && code <= 67) return { emoji: '🌧️', key: 'w_rain' };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { emoji: '❄️', key: 'w_snow' };
    if (code >= 80 && code <= 82) return { emoji: '🌦️', key: 'w_showers' };
    if (code >= 95) return { emoji: '⛈️', key: 'w_storm' };
    return { emoji: '🌡️', key: 'w_cloudy' };
  }
  // Red below 40°F, yellow 40–49°F
  function tempStatus(f) {
    if (f == null || isNaN(f)) return null;
    if (f < 40) return 'red';
    if (f < 50) return 'yellow';
    return 'ok';
  }

  // ===================================================================
  // 6. DRAWING ON THE PHOTO
  //    Positions are saved as fractions (0 to 1) of the photo's width and
  //    height, so the marks land in the same place at any size.
  // ===================================================================
  const FONT = '-apple-system, system-ui, "Segoe UI", Roboto, Arial, sans-serif';
  const font = (px, bold) => `${bold ? 800 : 600} ${px}px ${FONT}`;

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function wrapText(ctx, text, maxW) {
    const out = [];
    for (const para of String(text).split('\n')) {
      let line = '';
      for (const word of para.split(/\s+/).filter(Boolean)) {
        const test = line ? line + ' ' + word : word;
        if (!line || ctx.measureText(test).width <= maxW) line = test;
        else { out.push(line); line = word; }
      }
      out.push(line);
    }
    return out;
  }

  function drawArrow(ctx, x1, y1, x2, y2, color, s) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len, px = -uy, py = ux;
    const headLen = Math.min(62 * s, len * 0.6), headW = 34 * s, shaftW = 13 * s;
    const bx = x2 - ux * headLen, by = y2 - uy * headLen;
    ctx.beginPath();
    ctx.moveTo(x1 + px * shaftW, y1 + py * shaftW);
    ctx.lineTo(bx + px * shaftW, by + py * shaftW);
    ctx.lineTo(bx + px * headW, by + py * headW);
    ctx.lineTo(x2, y2);
    ctx.lineTo(bx - px * headW, by - py * headW);
    ctx.lineTo(bx - px * shaftW, by - py * shaftW);
    ctx.lineTo(x1 - px * shaftW, y1 - py * shaftW);
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.lineJoin = 'round'; ctx.lineWidth = 4 * s;
    ctx.strokeStyle = color === '#111111' ? '#ffffff' : '#000000';
    ctx.stroke();
  }

  function drawLabel(ctx, text, cx, cy, s, W, H) {
    const fs = 42 * s, pad = fs * 0.35, lh = fs * 1.2;
    ctx.font = font(fs, true);
    const lines = wrapText(ctx, text, W * 0.86 - pad * 2);
    const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + pad * 2;
    const h = lines.length * lh + pad * 2 - (lh - fs);
    const x = Math.min(Math.max(cx - w / 2, 8 * s), W - w - 8 * s);
    const y = Math.min(Math.max(cy - h / 2, 8 * s), H - h - 8 * s);
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    roundRect(ctx, x, y, w, h, 6 * s); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textBaseline = 'top';
    lines.forEach((l, i) => ctx.fillText(l, x + pad, y + pad + i * lh));
  }

  function drawCloseup(ctx, img, cx, cy, s, W, H, color) {
    const r = 0.2 * Math.min(W, H), m = 12 * s;
    cx = Math.min(Math.max(cx, r + m), W - r - m);
    cy = Math.min(Math.max(cy, r + m), H - r - m);
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    const k = Math.max((2 * r) / img.width, (2 * r) / img.height);
    ctx.drawImage(img, cx - (img.width * k) / 2, cy - (img.height * k) / 2, img.width * k, img.height * k);
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = 10 * s; ctx.strokeStyle = color; ctx.stroke();
  }

  // Big yellow unit number (like the client's photos).
  // It starts in the bottom-left corner. If the user drags it, its new
  // center is saved in photo.badge as fractions ({ x: 0–1, y: 0–1 }).
  function badgeLayout(ctx, r, p, s, W, H) {
    const text = [r.unit, r.location].filter(Boolean).join(' ');
    if (!text) return null;
    let fs = 78 * s;
    ctx.font = font(fs, true);
    const maxW = W * 0.9 - 40 * s;
    let tw = ctx.measureText(text).width;
    if (tw > maxW) { fs *= maxW / tw; ctx.font = font(fs, true); tw = ctx.measureText(text).width; }
    const padX = fs * 0.35, padY = fs * 0.2, h = fs + padY * 2, w = tw + padX * 2, m = 20 * s;
    let x = m, y = H - h - m;                       // default: bottom-left corner
    if (p && p.badge) { x = p.badge.x * W - w / 2; y = p.badge.y * H - h / 2; }
    x = Math.min(Math.max(x, 0), W - w);            // keep it inside the photo
    y = Math.min(Math.max(y, 0), H - h);
    return { text, fs, padX, x, y, w, h };
  }
  function drawBadge(ctx, r, p, s, W, H, live) {
    const b = badgeLayout(ctx, r, p, s, W, H);
    if (!b) return;
    ctx.fillStyle = 'rgba(0,0,0,0.88)';
    roundRect(ctx, b.x, b.y, b.w, b.h, b.h * 0.3); ctx.fill();
    ctx.font = font(b.fs, true);
    ctx.fillStyle = '#FFE600'; ctx.textBaseline = 'middle';
    ctx.fillText(b.text, b.x + b.padX, b.y + b.h / 2 + b.fs * 0.04);
    if (live) {
      // Dashed outline only while editing, to show it can be dragged
      ctx.save();
      ctx.setLineDash([14 * s, 10 * s]); ctx.lineWidth = 4 * s; ctx.strokeStyle = '#FFE600';
      roundRect(ctx, b.x - 6 * s, b.y - 6 * s, b.w + 12 * s, b.h + 12 * s, b.h * 0.35); ctx.stroke();
      ctx.restore();
    }
  }

  // The lines in the small info box (top-right corner)
  function infoLines(r, which, p, live) {
    const L = [];
    L.push({ text: repairTitle(r), size: 32, bold: true });
    const item = itemName(r);
    if (item) L.push({ text: item, size: 25 });
    L.push({ text: placeLine(r), size: 25 });
    if (which === 'after' && r.before) {
      L.push({ text: `${t('start')}: ${fmtDateTime(r.before.time)}`, size: 25 });
      L.push({ text: `${t('end')}: ${fmtDateTime(p.time)}`, size: 25 });
      L.push({ text: `⏱ ${t('duration')}: ${fmtDur(p.time - r.before.time)}`, size: 27, bold: true });
    } else {
      L.push({ text: `📅 ${fmtDateTime(p.time)}`, size: 25 });
    }
    let wt = '';
    if (p.weather) {
      const wi = weatherInfo(p.weather.code);
      wt = `${wi.emoji} ${t(wi.key)} · ${t('outside')} ${p.weather.tempF}°F`;
    } else if (live && p.weatherState === 'loading') {
      wt = t('weatherLoading');
    }
    if (p.indoorF != null) wt += `${wt ? ' · ' : ''}${t('inside')} ${p.indoorF}°F`;
    const effective = p.indoorF != null ? p.indoorF : (p.weather ? p.weather.tempF : null);
    const st = tempStatus(effective);
    const color = st === 'red' ? '#FF453A' : st === 'yellow' ? '#FFD60A' : '#FFFFFF';
    if (wt) L.push({ text: wt, size: 25, color, bold: st === 'red' || st === 'yellow' });
    if (st === 'red') L.push({ text: '⚠ ' + t('warnRed'), size: 23, color: '#FF453A', bold: true });
    if (st === 'yellow') L.push({ text: '⚠ ' + t('warnYellow'), size: 23, color: '#FFD60A', bold: true });
    return L;
  }
  function drawInfo(ctx, r, which, p, s, W, live) {
    const pad = 14 * s, maxW = W * 0.62, margin = 16 * s;
    const rows = [];
    for (const line of infoLines(r, which, p, live)) {
      ctx.font = font(line.size * s, line.bold);
      for (const seg of wrapText(ctx, line.text, maxW - pad * 2)) {
        rows.push(Object.assign({}, line, { text: seg, w: ctx.measureText(seg).width }));
      }
    }
    const boxW = Math.min(maxW, Math.max(...rows.map(x => x.w)) + pad * 2);
    const boxH = rows.reduce((sum, x) => sum + x.size * s * 1.28, 0) + pad * 2 - 4 * s;
    const x = W - boxW - margin, y = margin;
    ctx.fillStyle = 'rgba(0,0,0,0.62)';
    roundRect(ctx, x, y, boxW, boxH, 12 * s); ctx.fill();
    ctx.textBaseline = 'top';
    let cy = y + pad;
    for (const row of rows) {
      ctx.font = font(row.size * s, row.bold);
      ctx.fillStyle = row.color || '#FFFFFF';
      ctx.fillText(row.text, x + pad, cy);
      cy += row.size * s * 1.28;
    }
  }

  // Draws everything: photo, close-ups, arrows, text, unit badge, info box
  function drawScene(ctx, W, H, base, p, r, which, cache, preview, live) {
    const s = Math.min(W, H) / 1000;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(base, 0, 0, W, H);
    const anns = preview ? p.annotations.concat([preview]) : p.annotations;
    for (const a of anns) if (a.type === 'closeup' && cache.get(a.id)) drawCloseup(ctx, cache.get(a.id), a.x * W, a.y * H, s, W, H, a.color);
    for (const a of anns) if (a.type === 'arrow') drawArrow(ctx, a.x1 * W, a.y1 * H, a.x2 * W, a.y2 * H, a.color, s);
    for (const a of anns) if (a.type === 'text') drawLabel(ctx, a.text, a.x * W, a.y * H, s, W, H);
    drawBadge(ctx, r, p, s, W, H, live);
    drawInfo(ctx, r, which, p, s, W, live);
  }

  // Makes the final stamped JPEG for a saved photo
  async function renderBlob(r, which) {
    const p = r[which];
    const base = await blobToImg(p.blob);
    const cache = new Map();
    for (const a of p.annotations) if (a.type === 'closeup' && a.blob) cache.set(a.id, await blobToImg(a.blob));
    const c = el('canvas'); c.width = p.w; c.height = p.h;
    drawScene(c.getContext('2d'), p.w, p.h, base, p, r, which, cache, null, false);
    return new Promise(res => c.toBlob(res, 'image/jpeg', 0.88));
  }

  // ===================================================================
  // 7. SCREENS
  // ===================================================================
  const app = { screen: 'home', step: 0, filter: 'all', draft: null, editTarget: null,
                detailId: null, timer: null, urls: [], files: {}, camPurpose: null,
                textPos: null, closePos: null };

  function showScreen(name, step) {
    app.screen = name; app.step = step;
    if (app.timer) { clearInterval(app.timer); app.timer = null; }
    $$('.screen').forEach(s => s.classList.toggle('hidden', s.id !== 'screen-' + name));
    renderStepper(step);
    window.scrollTo(0, 0);
  }
  function renderStepper(step) {
    const nav = $('#stepper');
    if (!step) { nav.classList.add('hidden'); return; }
    nav.classList.remove('hidden'); nav.innerHTML = '';
    t('steps').forEach((label, i) => {
      const n = i + 1;
      const done = n < step || step === 5;
      nav.append(el('div', { class: 'step' + (done ? ' done' : '') + (n === step ? ' current' : '') },
        `${done ? '✓' : n} ${label}`));
    });
  }

  // ---------- HOME ----------
  function goHome() { showScreen('home', 0); renderHome(); }
  async function renderHome() {
    let all = [];
    try { all = await DB.all(); } catch (e) { /* ignore */ }
    all = all.filter(r => r.before).sort((a, b) => b.before.time - a.before.time);
    const tradeOf = r => { const f = findCode(r.code); return f ? f.trade.id : ''; };

    const chips = $('#filters'); chips.innerHTML = '';
    const chip = (id, label, n) => chips.append(el('button',
      { class: 'chip' + (app.filter === id ? ' active' : ''), type: 'button',
        onclick: () => { app.filter = id; renderHome(); } }, `${label} (${n})`));
    if (all.length) {
      chip('all', t('all'), all.length);
      for (const tr of CODES.trades) {
        const n = all.filter(r => tradeOf(r) === tr.id).length;
        if (n) chip(tr.id, `${tr.id} ${tradeName(tr)}`, n);
      }
    }

    const shown = app.filter === 'all' ? all : all.filter(r => tradeOf(r) === app.filter);
    const list = $('#repairList'); list.innerHTML = '';
    if (!all.length) { list.append(el('p', { class: 'note' }, t('noRepairs'))); return; }
    const open = shown.filter(r => r.status === 'open');
    const done = shown.filter(r => r.status === 'done');
    if (open.length) { list.append(el('h2', { class: 'section' }, t('inProgress'))); open.forEach(r => list.append(card(r))); }
    if (done.length) { list.append(el('h2', { class: 'section' }, t('finished'))); done.forEach(r => list.append(card(r))); }
  }
  function card(r) {
    const status = r.status === 'done'
      ? `${t('done')} · ⏱ ${fmtDur(r.after.time - r.before.time)}`
      : `${t('open')} · ${fmtDateTime(r.before.time)}`;
    return el('button', { class: 'card', type: 'button', onclick: () => openDetail(r.id) },
      el('div', { class: 'title' }, repairTitle(r)),
      el('div', { class: 'meta' }, itemName(r)),
      el('div', { class: 'meta' }, placeLine(r)),
      el('div', { class: 'meta' }, el('span', { class: 'pill ' + r.status }, status)));
  }

  // ---------- FORM ----------
  function buildCodeSelect() {
    const s = $('#fCode'), keep = s.value;
    s.innerHTML = '';
    s.append(el('option', { value: '' }, t('chooseCode')));
    for (const tr of CODES.trades) {
      const g = el('optgroup', { label: `${tr.id} · ${tradeName(tr)}` });
      for (const it of tr.items) g.append(el('option', { value: it.code }, `${it.code} — ${it[settings.lang] || it.es}`));
      s.append(g);
    }
    s.value = keep;
  }
  function buildLocations() {
    const dl = $('#locList'); dl.innerHTML = '';
    for (const l of CODES.locations) dl.append(el('option', { value: l[settings.lang] || l.es }));
  }
  function newRepair() {
    app.draft = { id: uid(), createdAt: Date.now(), floor: settings.lastFloor || '', unit: '',
                  location: '', area: '', code: '', gcName: '', status: 'draft' };
    fillForm(app.draft);
    showScreen('form', 1);
  }
  function fillForm(d) {
    $('#fFloor').value = d.floor; $('#fUnit').value = d.unit;
    $('#fLocation').value = d.location; $('#fArea').value = d.area;
    buildCodeSelect(); $('#fCode').value = d.code;
  }
  function readForm() {
    const d = app.draft;
    d.floor = $('#fFloor').value.trim();
    d.unit = $('#fUnit').value.trim();
    d.location = $('#fLocation').value.trim();
    d.area = $('#fArea').value.trim().toUpperCase();
    d.code = $('#fCode').value;
    const f = findCode(d.code);
    d.gcName = f && f.trade.isGC ? settings.gcName : '';
  }
  function takeBefore(fromGallery) {
    readForm();
    if (!app.draft.unit) { toast(t('needUnit')); return; }
    if (!app.draft.code) { toast(t('needCode')); return; }
    openCamera('before', fromGallery);
  }

  // ---------- CAMERA ----------
  function openCamera(purpose, fromGallery) {
    app.camPurpose = purpose;
    (fromGallery ? $('#galleryMain') : $('#camMain')).click();
  }
  async function onMainFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const purpose = app.camPurpose;
    const repair = purpose === 'before' ? app.draft : app.editTarget;
    if (!repair) return;
    // The moment the photo was taken = start (or end) time
    const time = (file.lastModified && Math.abs(Date.now() - file.lastModified) < 7 * 864e5)
      ? file.lastModified : Date.now();
    toast(t('processing'));
    let c;
    try { c = await compress(file, 1600, 0.8); } catch (err) { toast(t('photoError')); return; }
    const photo = { time, blob: c.blob, w: c.w, h: c.h, annotations: [],
                    weather: null, weatherState: 'loading', indoorF: null };
    await openEditor(repair, purpose, photo);
    startWeather(photo, purpose, repair.id);
  }

  // ---------- EDITOR ----------
  const canvas = $('#canvas'), ctx = canvas.getContext('2d');
  const ed = { repair: null, which: null, photo: null, base: null, cache: new Map(),
               tool: 'arrow', color: '#FFE600', down: null, preview: null, drag: null };

  function redraw() {
    if (!ed.base) return;
    drawScene(ctx, canvas.width, canvas.height, ed.base, ed.photo, ed.repair, ed.which, ed.cache, ed.preview, true);
  }
  async function openEditor(repair, which, photo) {
    Object.assign(ed, { repair, which, photo, preview: null, down: null, drag: null, cache: new Map() });
    ed.base = await blobToImg(photo.blob);
    canvas.width = photo.w; canvas.height = photo.h;
    $('#indoorTemp').value = photo.indoorF != null ? photo.indoorF : '';
    setTool(ed.tool); setColor(ed.color);
    showScreen('editor', which === 'before' ? 3 : 4);
    updateWeatherUI(); redraw();
  }
  function closeEditor() { Object.assign(ed, { repair: null, which: null, photo: null, base: null, preview: null }); ed.cache.clear(); }
  function setTool(tool) {
    ed.tool = tool;
    $$('.tool[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === tool));
    $('#toolHint').textContent = t({ arrow: 'hintArrow', text: 'hintText', closeup: 'hintClose' }[tool]);
  }
  function setColor(c) {
    ed.color = c;
    $$('.swatch').forEach(b => b.classList.toggle('active', b.dataset.color === c));
  }
  function updateWeatherUI() {
    const p = ed.photo; if (!p) return;
    const status = $('#weatherStatus'), retry = $('#weatherRetry');
    retry.classList.toggle('hidden', p.weatherState !== 'fail');
    if (p.weatherState === 'loading') status.textContent = t('weatherLoading');
    else if (p.weatherState === 'fail') status.textContent = t('weatherFail');
    else if (p.weather) {
      const wi = weatherInfo(p.weather.code);
      status.textContent = `${wi.emoji} ${t(wi.key)} · ${p.weather.tempF}°F`;
    }
  }
  function startWeather(photo, which, repairId) {
    photo.weatherState = 'loading';
    if (ed.photo === photo) { updateWeatherUI(); redraw(); }
    fetchWeather()
      .then(w => { photo.weather = w; photo.weatherState = 'ok'; },
            () => { photo.weatherState = 'fail'; })
      .then(async () => {
        if (ed.photo === photo) { updateWeatherUI(); redraw(); return; }
        // Already saved before the weather arrived: update the saved copy
        try {
          const fresh = await DB.get(repairId);
          const p = fresh && fresh[which];
          if (p && p.time === photo.time) {
            p.weather = photo.weather; p.weatherState = photo.weatherState;
            await DB.put(fresh);
            if (app.screen === 'detail' && app.detailId === repairId) openDetail(repairId);
          }
        } catch (e) { /* ignore */ }
      });
  }
  function pointOf(e) {
    const r = canvas.getBoundingClientRect();
    const clamp = v => Math.min(1, Math.max(0, v));
    return { x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) };
  }
  // Where the unit badge is right now on the editor canvas (in pixels)
  function currentBadge() {
    const W = canvas.width, H = canvas.height;
    return badgeLayout(ctx, ed.repair, ed.photo, Math.min(W, H) / 1000, W, H);
  }
  // Did the finger land on the unit badge? (a little extra room makes it easier to grab)
  function onBadge(p) {
    const b = currentBadge();
    if (!b) return false;
    const x = p.x * canvas.width, y = p.y * canvas.height, extra = 20 * Math.min(canvas.width, canvas.height) / 1000;
    return x >= b.x - extra && x <= b.x + b.w + extra && y >= b.y - extra && y <= b.y + b.h + extra;
  }
  async function saveEditor() {
    const r = ed.repair, p = ed.photo, which = ed.which;
    if (!r || !p) return;
    r[which] = p;
    if (which === 'before') r.status = 'open';
    else { r.status = 'done'; r.durationMin = Math.round((p.time - r.before.time) / 60000); }
    r.updatedAt = Date.now();
    try { await DB.put(r); } catch (err) { console.error(err); toast(t('storageError')); return; }
    if (which === 'before') { settings.lastFloor = r.floor || ''; saveSettings(); app.draft = null; }
    toast(t('saved'));
    closeEditor();
    openDetail(r.id);
  }
  function cancelEditor() {
    if (ed.photo && ed.photo.annotations.length && !confirm(t('confirmDiscard'))) return;
    const which = ed.which, r = ed.repair;
    closeEditor();
    if (which === 'before') { fillForm(app.draft); showScreen('form', 1); }
    else openDetail(r.id);
  }
  function openTextModal(pos) {
    app.textPos = pos;
    $('#textInput').value = '';
    $('#textModal').classList.remove('hidden');
  }

  // ---------- DETAIL (one repair) ----------
  function cleanupUrls() { app.urls.forEach(u => URL.revokeObjectURL(u)); app.urls = []; app.files = {}; }
  async function openDetail(id) {
    const r = await DB.get(id);
    if (!r) { goHome(); return; }
    showScreen('detail', r.status === 'open' ? 4 : 5);
    app.detailId = id; cleanupUrls();
    const body = $('#detailBody'); body.innerHTML = '';
    body.append(
      el('button', { class: 'link', type: 'button', onclick: goHome }, t('back')),
      el('h2', { class: 'title-lg' }, repairTitle(r)),
      el('p', { class: 'meta' }, itemName(r)),
      el('p', { class: 'meta' }, placeLine(r)));

    if (r.status === 'open') {
      const elapsed = el('div', { class: 'elapsed' }, fmtDur(Date.now() - r.before.time));
      app.timer = setInterval(() => { elapsed.textContent = fmtDur(Date.now() - r.before.time); }, 15000);
      body.append(el('p', { class: 'meta' }, t('elapsed')), elapsed,
        el('button', { class: 'btn primary big', type: 'button',
          onclick: () => { app.editTarget = r; openCamera('after', false); } }, '📷 ' + t('takeEnd')),
        el('button', { class: 'link', type: 'button',
          onclick: () => { app.editTarget = r; openCamera('after', true); } }, t('orGallery')));
    } else {
      body.append(el('p', { class: 'meta' }, `${t('duration')}: `, el('b', {}, fmtDur(r.after.time - r.before.time))));
    }

    for (const which of ['before', 'after']) {
      if (!r[which]) continue;
      const fig = el('div', { class: 'photo' });
      body.append(el('h3', {}, which === 'before' ? t('startPhoto') : t('endPhoto')), fig);
      const blob = await renderBlob(r, which);
      if (app.detailId !== id) return; // user left this screen
      const url = URL.createObjectURL(blob); app.urls.push(url);
      app.files[which] = new File([blob], fileName(r, which), { type: 'image/jpeg' });
      fig.append(el('img', { src: url, alt: '' }),
        el('button', { class: 'btn', type: 'button', onclick: () => sharePhoto(which) }, '⬆ ' + t('share')));
    }
    body.append(el('p', { class: 'note' }, t('longPress')),
      el('button', { class: 'btn ghost danger', type: 'button', onclick: async () => {
        if (confirm(t('confirmDelete'))) { await DB.del(r.id); goHome(); }
      } }, t('delete')));
  }
  // On phones this opens the share sheet (Save Image, WhatsApp, email…)
  function sharePhoto(which) {
    const file = app.files[which];
    if (!file) return;
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] }).catch(err => { if (err && err.name !== 'AbortError') download(file, file.name); });
    } else {
      download(file, file.name);
    }
  }

  // ===================================================================
  // 8. VOICE (uses the phone's built-in speech recognition — free)
  // ===================================================================
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  function listen(btn, onText) {
    if (!Speech) { toast(t('noSpeech')); return; }
    const rec = new Speech();
    rec.lang = settings.lang === 'es' ? 'es-MX' : 'en-US';
    rec.interimResults = false; rec.maxAlternatives = 1;
    btn.classList.add('listening');
    rec.onresult = ev => onText(ev.results[0][0].transcript);
    rec.onerror = ev => { if (ev.error !== 'aborted') toast(`${t('speechError')} (${ev.error})`); };
    rec.onend = () => btn.classList.remove('listening');
    try { rec.start(); } catch (e) { btn.classList.remove('listening'); toast(t('noSpeech')); }
  }

  // Turns "piso 3 unidad 1321 cocina código 1.1" into form values
  const NUM_WORDS = { uno: 1, una: 1, un: 1, primer: 1, primero: 1, dos: 2, segundo: 2, tres: 3, tercer: 3, tercero: 3,
    cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13,
    catorce: 14, quince: 15, one: 1, first: 1, two: 2, second: 2, three: 3, third: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
  const VOICE_KEYS = {
    floor: ['piso', 'floor', 'nivel', 'level'],
    unit: ['unidad', 'unit', 'apartamento', 'apartment', 'departamento', 'depa', 'apt'],
    code: ['código', 'codigo', 'code'],
    area: ['área', 'area', 'etiqueta', 'tag'],
    location: ['ubicación', 'ubicacion', 'location', 'cuarto', 'room']
  };
  function parseSpoken(text) {
    const words = [];
    for (const [k, list] of Object.entries(VOICE_KEYS)) for (const w of list) words.push({ k, w });
    const re = new RegExp('(^|[\\s,.;:])(' + words.map(x => x.w).join('|') + ')(?=$|[\\s,.;:])', 'gi');
    const marks = [];
    let m;
    while ((m = re.exec(text))) {
      const word = m[2].toLowerCase();
      marks.push({ k: words.find(x => x.w === word).k, start: m.index + m[1].length, end: m.index + m[0].length });
    }
    const out = {}, leftover = [];
    if (!marks.length) leftover.push(text);
    else if (marks[0].start > 0) leftover.push(text.slice(0, marks[0].start));
    marks.forEach((mk, i) => {
      const val = text.slice(mk.end, i + 1 < marks.length ? marks[i + 1].start : text.length)
        .replace(/^[\s,.:;]+|[\s,.:;]+$/g, '');
      if (mk.k === 'floor') {
        const first = (val.split(/\s+/)[0] || '').replace(/[,.;:]+$/, '');
        const n = /^\d+$/.test(first) ? first : (NUM_WORDS[first.toLowerCase()] || '');
        if (n) { out.floor = String(n); const rest = val.split(/\s+/).slice(1).join(' '); if (rest) leftover.push(rest); }
      } else if (mk.k === 'unit') {
        const um = val.match(/^((?:\d[\d\s-]*\d|\d)[a-zA-Z]?)(?:[\s,.;:]+(.*))?$/);
        if (um) { out.unit = um[1].replace(/[\s-]/g, '').toUpperCase(); if (um[2]) leftover.push(um[2]); }
        else if (val) out.unit = val.split(/\s+/)[0].toUpperCase();
      } else if (mk.k === 'code') {
        const cm = val.match(/(\d+)\s*(?:[.,]|punto|point|dot)?\s*(\d+)?/i);
        if (cm) {
          let code = cm[2] ? `${cm[1]}.${cm[2]}` : (cm[1].length === 2 ? `${cm[1][0]}.${cm[1][1]}` : '');
          if (!code) { const tr = CODES.trades.find(x => x.id === cm[1]); if (tr) code = tr.items[0].code; }
          if (code) out.code = code;
          const rest = val.slice(cm.index + cm[0].length).trim(); if (rest) leftover.push(rest);
        }
      } else if (mk.k === 'area') {
        const tokens = val.split(/\s+/).filter(Boolean);
        let tag = tokens.shift() || '';
        if (/^[a-z]$/i.test(tag) && tokens[0] && /^\d+$/.test(tokens[0])) tag += tokens.shift();
        if (tag) out.area = tag.toUpperCase();
        if (tokens.length) leftover.push(tokens.join(' '));
      } else if (mk.k === 'location') {
        if (val) out.location = val;
      }
    });
    if (!out.location) {
      const lo = leftover.join(' ').replace(/[\s,.;:]+/g, ' ').trim();
      if (lo) out.location = lo.charAt(0).toUpperCase() + lo.slice(1);
    }
    return out;
  }

  // ===================================================================
  // 9. EXPORT CSV (opens in Excel / Google Sheets for billing)
  // ===================================================================
  async function exportCsv() {
    const all = (await DB.all()).filter(r => r.before).sort((a, b) => a.before.time - b.before.time);
    const wLabel = p => (p && p.weather ? t(weatherInfo(p.weather.code).key) : '');
    const head = ['code', 'trade', 'type', 'gc', 'floor', 'unit', 'location', 'area', 'status',
      'start', 'end', 'duration_min', 'weather_start', 'temp_out_start_F', 'temp_in_start_F',
      'weather_end', 'temp_out_end_F', 'temp_in_end_F'];
    const rows = all.map(r => {
      const f = findCode(r.code), b = r.before, a = r.after;
      return [r.code, f ? tradeName(f.trade, r) : '', itemName(r), r.gcName, r.floor, r.unit, r.location, r.area,
        r.status, isoLocal(b.time), a ? isoLocal(a.time) : '', a ? Math.round((a.time - b.time) / 60000) : '',
        wLabel(b), b.weather ? b.weather.tempF : '', b.indoorF,
        wLabel(a), a && a.weather ? a.weather.tempF : '', a ? a.indoorF : ''];
    });
    const csv = '\ufeff' + [head, ...rows]
      .map(row => row.map(v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(','))
      .join('\r\n');
    download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `${t('csvName')}_${isoLocal(Date.now()).slice(0, 10)}.csv`);
  }

  // ===================================================================
  // 10. START THE APP (connect buttons, load saved data)
  // ===================================================================
  function applyI18n() {
    document.documentElement.lang = settings.lang;
    document.title = t('appTitle');
    $$('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
    $$('[data-i18n-ph]').forEach(n => { n.placeholder = t(n.dataset.i18nPh); });
    // The button shows the language the app is using right now. Tap it to switch.
    $('#langBtn').textContent = settings.lang === 'es' ? '🌐 Español' : '🌐 English';
    const ol = $('#howtoList'); ol.innerHTML = '';
    t('howToSteps').forEach(s => ol.append(el('li', {}, s)));
    buildCodeSelect(); buildLocations();
  }
  function rerender() {
    if (app.screen === 'home') renderHome();
    else if (app.screen === 'editor') { setTool(ed.tool); updateWeatherUI(); redraw(); }
    else if (app.screen === 'detail') openDetail(app.detailId);
    renderStepper(app.step);
  }

  function wire() {
    $('#langBtn').onclick = () => { settings.lang = settings.lang === 'es' ? 'en' : 'es'; saveSettings(); applyI18n(); rerender(); };
    $('#newBtn').onclick = newRepair;
    $('#csvBtn').onclick = exportCsv;
    $('#settingsBtn').onclick = () => { $('#sGc').value = settings.gcName; $('#settingsModal').classList.remove('hidden'); };
    $('#sSave').onclick = () => {
      settings.gcName = $('#sGc').value.trim(); saveSettings();
      $('#settingsModal').classList.add('hidden'); applyI18n(); rerender();
    };
    $('#sClose').onclick = () => $('#settingsModal').classList.add('hidden');

    // Form
    $('#takeBeforeBtn').onclick = () => takeBefore(false);
    $('#galleryBeforeBtn').onclick = () => takeBefore(true);
    $('#cancelFormBtn').onclick = () => { app.draft = null; goHome(); };
    $('#voiceFillBtn').onclick = e => listen(e.currentTarget, text => {
      const p = parseSpoken(text);
      if (p.floor) $('#fFloor').value = p.floor;
      if (p.unit) $('#fUnit').value = p.unit;
      if (p.location) $('#fLocation').value = p.location;
      if (p.area) $('#fArea').value = p.area;
      if (p.code && findCode(p.code)) $('#fCode').value = p.code;
      toast(`${t('heard')}: “${text}”`);
    });
    $$('[data-mic]').forEach(btn => {
      btn.onclick = () => listen(btn, text => {
        const input = $('#' + btn.dataset.mic);
        if (btn.dataset.transform === 'tag') text = text.replace(/\s+/g, '').toUpperCase();
        input.value = btn.dataset.mode === 'append' && input.value ? input.value + ' ' + text : text;
      });
    });

    // Camera inputs
    $('#camMain').onchange = onMainFile;
    $('#galleryMain').onchange = onMainFile;
    $('#camClose').onchange = async e => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file || !ed.photo || !app.closePos) return;
      try {
        const c = await compress(file, 900, 0.8);
        const a = { id: uid(), type: 'closeup', x: app.closePos.x, y: app.closePos.y, color: ed.color, blob: c.blob };
        ed.cache.set(a.id, await blobToImg(c.blob));
        ed.photo.annotations.push(a);
        redraw();
      } catch (err) { toast(t('photoError')); }
    };

    // Editor tools
    $$('.tool[data-tool]').forEach(b => { b.onclick = () => setTool(b.dataset.tool); });
    $$('.swatch').forEach(b => { b.onclick = () => setColor(b.dataset.color); });
    $('#undoBtn').onclick = () => {
      if (!ed.photo) return;
      const a = ed.photo.annotations.pop();
      if (a) ed.cache.delete(a.id);
      redraw();
    };
    $('#saveEditorBtn').onclick = saveEditor;
    $('#cancelEditorBtn').onclick = cancelEditor;
    $('#weatherRetry').onclick = () => { if (ed.photo) startWeather(ed.photo, ed.which, ed.repair.id); };
    $('#indoorTemp').oninput = e => {
      if (!ed.photo) return;
      const v = parseFloat(e.target.value);
      ed.photo.indoorF = isNaN(v) ? null : Math.round(v);
      redraw();
    };

    // Drawing with your finger
    canvas.addEventListener('pointerdown', e => {
      if (!ed.photo) return;
      e.preventDefault();
      try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      const p = pointOf(e);
      ed.down = p;
      // Touching the unit badge always moves it, whatever tool is selected
      if (onBadge(p)) {
        const b = currentBadge();
        ed.drag = { dx: p.x * canvas.width - (b.x + b.w / 2), dy: p.y * canvas.height - (b.y + b.h / 2) };
        return;
      }
      if (ed.tool === 'arrow') ed.preview = { type: 'arrow', x1: p.x, y1: p.y, x2: p.x, y2: p.y, color: ed.color };
    });
    canvas.addEventListener('pointermove', e => {
      if (ed.drag) {
        const p = pointOf(e), W = canvas.width, H = canvas.height;
        ed.photo.badge = { x: (p.x * W - ed.drag.dx) / W, y: (p.y * H - ed.drag.dy) / H };
        const b = currentBadge();                      // save the position after keeping it inside the photo
        ed.photo.badge = { x: (b.x + b.w / 2) / W, y: (b.y + b.h / 2) / H };
        redraw();
        return;
      }
      if (!ed.down || ed.tool !== 'arrow' || !ed.preview) return;
      const p = pointOf(e);
      ed.preview.x2 = p.x; ed.preview.y2 = p.y;
      redraw();
    });
    canvas.addEventListener('pointerup', e => {
      if (!ed.down) return;
      ed.down = null;
      if (ed.drag) { ed.drag = null; redraw(); return; }
      const p = pointOf(e);
      if (ed.tool === 'arrow') {
        const a = ed.preview; ed.preview = null;
        const len = a ? Math.hypot((a.x2 - a.x1) * canvas.width, (a.y2 - a.y1) * canvas.height) : 0;
        if (len > Math.min(canvas.width, canvas.height) * 0.05) { a.id = uid(); ed.photo.annotations.push(a); }
        else toast(t('hintArrow'));
        redraw();
      } else if (ed.tool === 'text') {
        openTextModal(p);
      } else if (ed.tool === 'closeup') {
        app.closePos = p;
        $('#camClose').click();
      }
    });
    canvas.addEventListener('pointercancel', () => { ed.down = null; ed.preview = null; ed.drag = null; redraw(); });
    $('#badgeCornerBtn').onclick = () => { if (ed.photo) { ed.photo.badge = null; redraw(); } };

    // Text pop-up
    $('#textOk').onclick = () => {
      const v = $('#textInput').value.trim();
      if (v && ed.photo && app.textPos) {
        ed.photo.annotations.push({ id: uid(), type: 'text', x: app.textPos.x, y: app.textPos.y, text: v });
        redraw();
      }
      $('#textModal').classList.add('hidden');
    };
    $('#textCancel').onclick = () => $('#textModal').classList.add('hidden');
  }

  async function init() {
    applyI18n();
    wire();
    try { await DB.open(); } catch (e) { toast(t('dbError')); }
    goHome();
  }

  // Exposed only so the code can be tested; the app does not need it.
  window.__repairLog = { parseSpoken, tempStatus };
  init();
})();
