// GET /api/geocode?q=ดอย → รายการสถานที่ให้เลือก (autocomplete)
// รวม "ยอดดอยยอดนิยม" (preset) ขึ้นหัว + ผล geocode จริงจาก Open-Meteo (ฟรี ไม่ต้อง key)
import { matchPeaks } from '@/lib/peaks';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (q.length < 2) return Response.json({ results: [] });

  const presets = matchPeaks(q).map((p) => ({
    name: p.name, admin1: p.admin1, country: '', lat: p.lat, lng: p.lng, preset: true,
  }));

  let geo = [];
  try {
    const r = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=th`,
      { next: { revalidate: 86400 } },
    );
    if (r.ok) {
      const d = await r.json();
      geo = (d.results || []).map((x) => ({
        name: x.name, admin1: x.admin1 || '', country: x.country || '',
        lat: x.latitude, lng: x.longitude, preset: false,
      }));
    }
  } catch { /* geocode ล่ม → ใช้เฉพาะ preset */ }

  const seen = new Set(presets.map((p) => p.name));
  const results = [...presets, ...geo.filter((g) => !seen.has(g.name))].slice(0, 8);
  return Response.json({ results });
}
