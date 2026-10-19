// ===== ตัวเรียก Backend API (ฝั่ง client) =====

// เรียก /api/claude พร้อม timeout 35 วิ + retry 2 ครั้ง (พฤติกรรมเดิมจาก Artifact)
export const callClaude = async (prompt, mode, meta, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 35000);
      const r = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({ prompt, mode, meta }),
      });
      clearTimeout(t);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
      return d;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise((res) => setTimeout(res, 2000 * (i + 1)));
    }
  }
};

// ค้นสถานที่ (autocomplete) → [{ name, admin1, country, lat, lng, preset }]
export const searchPlaces = async (q) => {
  if (!q || q.trim().length < 2) return [];
  const r = await fetch(`/api/geocode?q=${encodeURIComponent(q.trim())}`);
  if (!r.ok) return [];
  const d = await r.json();
  return d.results || [];
};

// เรียก /api/weather → { location, daily } | { seasonal: true } | throw error
// sel: { place } หรือ { lat, lng, label } (เลือกจาก dropdown แล้ว)
export const fetchWeather = async (sel, start, end) => {
  const params = new URLSearchParams({ start, end });
  if (sel?.lat != null && sel?.lng != null) {
    params.set('lat', sel.lat); params.set('lng', sel.lng);
    if (sel.label) params.set('label', sel.label);
  } else {
    params.set('place', sel?.place || sel?.label || '');
  }
  const r = await fetch(`/api/weather?${params}`);
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || `HTTP ${r.status}`);
  return d;
};
