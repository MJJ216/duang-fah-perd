// GET /api/weather?lat=18.58&lng=98.48&label=ดอยอินทนนท์&start=...&end=...
//   หรือแบบเดิม ?place=ดอยอินทนนท์&start=...&end=...  (จะ geocode ให้)
// → daily forecast + เมฆ + ความเสี่ยงฝนรายช่วง (Open-Meteo ฟรี ไม่ต้องใช้ key)

const MAX_FORECAST_DAYS = 16; // Open-Meteo พยากรณ์ล่วงหน้าได้สูงสุด ~16 วัน

// รวม hourly รายวัน → { cloud(เฉลี่ย), rainParts:{morning,afternoon,evening} }
function summarizeHourly(hourly, date) {
  if (!hourly?.time) return { cloud: null, rainParts: null };
  const buckets = { morning: [], afternoon: [], evening: [] };
  const clouds = [];
  hourly.time.forEach((t, i) => {
    if (!t.startsWith(date)) return;
    const hr = Number(t.slice(11, 13));
    const prob = hourly.precipitation_probability?.[i];
    if (prob != null) {
      if (hr >= 6 && hr < 12) buckets.morning.push(prob);
      else if (hr >= 12 && hr < 18) buckets.afternoon.push(prob);
      else if (hr >= 18) buckets.evening.push(prob);
    }
    const c = hourly.cloud_cover?.[i];
    if (c != null) clouds.push(c);
  });
  const max = (a) => (a.length ? Math.max(...a) : 0);
  const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null);
  return {
    cloud: avg(clouds),
    rainParts: { morning: max(buckets.morning), afternoon: max(buckets.afternoon), evening: max(buckets.evening) },
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  let lat = searchParams.get('lat');
  let lng = searchParams.get('lng');
  let label = searchParams.get('label') || '';
  let admin = '';
  const place = searchParams.get('place');

  if (!start || !end || (!place && (!lat || !lng))) {
    return Response.json({ error: 'ต้องส่ง (lat,lng หรือ place) + start + end มาให้ครบ' }, { status: 400 });
  }

  // เช็คช่วงวันที่อยู่ในระยะพยากรณ์ไหม
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const endDate = new Date(end + 'T00:00:00');
  const daysAhead = Math.ceil((endDate - today) / 86400000);
  if (daysAhead > MAX_FORECAST_DAYS) {
    return Response.json({ seasonal: true, reason: 'ช่วงวันที่เกินระยะพยากรณ์ 16 วัน' });
  }
  if (daysAhead < 0) {
    return Response.json({ error: 'วันที่อยู่ในอดีตนะแก 🕰️' }, { status: 400 });
  }

  try {
    // ถ้าไม่มีพิกัด → geocode จากชื่อสถานที่ (fallback path เดิม)
    if ((!lat || !lng) && place) {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=th`,
        { next: { revalidate: 86400 } },
      );
      if (!geoRes.ok) throw new Error(`Geocoding HTTP ${geoRes.status}`);
      const geo = await geoRes.json();
      const loc = geo.results?.[0];
      if (!loc) {
        return Response.json({ error: `หาสถานที่ "${place}" ไม่เจอ ลองสะกดใหม่หรือเลือกจากรายการนะ` }, { status: 404 });
      }
      lat = loc.latitude; lng = loc.longitude; label = loc.name; admin = loc.admin1 || '';
    }

    // Forecast รายวัน + รายชั่วโมง (เมฆ + ความน่าจะมีฝน)
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      daily: 'weathercode,temperature_2m_max,precipitation_probability_max,precipitation_sum',
      hourly: 'precipitation_probability,cloud_cover',
      timezone: 'Asia/Bangkok',
      start_date: start,
      end_date: end,
    });
    const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { next: { revalidate: 3600 } });
    if (!wxRes.ok) throw new Error(`Forecast HTTP ${wxRes.status}`);
    const wx = await wxRes.json();

    const daily = (wx.daily?.time || []).map((date, i) => {
      const h = summarizeHourly(wx.hourly, date);
      return {
        date,
        weathercode: wx.daily.weathercode?.[i] ?? 3,
        tempMax: wx.daily.temperature_2m_max?.[i] ?? null,
        precipProb: wx.daily.precipitation_probability_max?.[i] ?? 50,
        precipSum: wx.daily.precipitation_sum?.[i] ?? 0,
        cloud: h.cloud,
        rainParts: h.rainParts,
      };
    });

    return Response.json({
      location: { name: label || place || '', admin, lat: Number(lat), lng: Number(lng) },
      daily,
    });
  } catch (err) {
    console.error('Weather API error:', err);
    return Response.json({ seasonal: true, reason: String(err?.message || err) });
  }
}
