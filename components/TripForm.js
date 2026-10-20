'use client';
import { useState } from 'react';
import { IN, Fld, Err, SubBtn } from './ui';
import PlaceSearch from './PlaceSearch';
import { callClaude, fetchWeather } from '@/lib/api';
import {
  ZODIAC_TH, ZODIAC_EMJ, DAY_TH,
  todayStr, parseDay, fmtDate, getZi, getElem, calcSin, genDates, dayBonus,
} from '@/lib/astro';
import { skyFinal, rainTiming } from '@/lib/weather';
import { moonPhase } from '@/lib/moon';
import { remedyTier } from '@/lib/remedies';
import { saveHistory } from '@/lib/storage';

export default function TripForm({ onResult }) {
  const today = todayStr();
  const [f, setF] = useState({ place: null, startDate: '', endDate: '', members: [{ id: 1, nickname: '', birthYear: '' }] });
  const [loading, setL] = useState(false);
  const [step, setS] = useState('');
  const [err, setE] = useState('');

  const add = () => setF((p) => ({ ...p, members: [...p.members, { id: Date.now(), nickname: '', birthYear: '' }] }));
  const del = (id) => setF((p) => ({ ...p, members: p.members.filter((m) => m.id !== id) }));
  const upd = (id, k, v) => setF((p) => ({ ...p, members: p.members.map((m) => (m.id === id ? { ...m, [k]: v } : m)) }));

  const go = async () => {
    if (!f.place) { setE('เลือกสถานที่จากรายการที่เด้งขึ้นมาก่อนนะ 📍'); return; }
    if (!f.startDate || !f.endDate) { setE('ใส่วันที่ด้วยนะ'); return; }
    if (parseDay(f.endDate) < parseDay(f.startDate)) { setE('วันสิ้นสุดต้องหลังวันเริ่มนะ'); return; }
    setL(true); setE('');
    const locName = f.place.name;
    try {
      setS('🔮 คำนวณดวงทีม...');
      // ชื่อเพื่อนเป็น optional — คิดเฉพาะคนที่ใส่ชื่อ
      const members = f.members.filter((m) => m.nickname.trim()).map((m) => {
        const be = m.birthYear ? parseInt(m.birthYear) : null;
        const ce = be ? be - 543 : null;
        const sin = calcSin({ nickname: m.nickname, birthYearBE: be ? String(be) : null, pastWeather: 'mixed', hasRainGear: 'sometimes' });
        return { ...m, sin, element: ce ? getElem(ce) : null, zodiac: ce ? `${ZODIAC_TH[getZi(ce)]}${ZODIAC_EMJ[getZi(ce)]}` : null };
      });
      // ไม่ใส่ใครเลย → ดวงทีมเป็นกลาง (30) ทำนายจากอากาศจริง + วันมงคลเป็นหลัก
      const teamSin = members.length ? Math.round(members.reduce((a, m) => a + m.sin, 0) / members.length) : 30;
      const dates = genDates(f.startDate, f.endDate);
      const elems = [...new Set(members.filter((m) => m.element).map((m) => m.element))];
      const mDesc = members.length
        ? members.map((m) => `${m.nickname}${m.birthYear ? ` (ธาตุ${m.element},บาป${m.sin}%)` : ` (บาป~${m.sin}%)`}`).join(', ')
        : 'ไม่ได้ระบุทีม (ทำนายจากอากาศ + วันมงคล)';
      const moon = moonPhase(dates[0]);
      const seed = `${locName}:${f.startDate}:${teamSin}`;
      const tier = remedyTier(teamSin);
      const remNote = `แก้เคล็ด ${tier.count} ข้อ ระดับ "${tier.label}" (บาปน้อยให้เบาๆ บาปมากให้จัดเต็ม) มีของตลกๆ ที่หาซื้อได้ที่ร้านสะดวกซื้ออย่างน้อย 1 ข้อ ทุกข้อ specific และไม่ซ้ำแนวกัน`;
      const meta = { location: locName, teamSin, elems, moon, seed };

      // ── 1. ดึงอากาศจริง (ใช้พิกัดที่เลือกไว้แล้ว ไม่ต้อง geocode ซ้ำ) ──
      setS('🌡️ เช็คสภาพอากาศจริง...');
      let weather = null;
      try {
        weather = await fetchWeather({ lat: f.place.lat, lng: f.place.lng, label: locName }, dates[0], dates[dates.length - 1]);
      } catch (we) {
        weather = { seasonal: true };
      }

      let days, realWeather = false, resolvedPlace = '';
      let ai;

      if (weather?.daily?.length) {
        // ── 2a. มีข้อมูลจริง → คำนวณ sky ด้วยสูตรจริง (รวมเมฆ) ──
        realWeather = true;
        resolvedPlace = [weather.location?.name, weather.location?.admin].filter(Boolean).join(', ');
        days = weather.daily.map((d) => ({
          date: d.date,
          dayName: DAY_TH[parseDay(d.date).getDay()],
          sky: skyFinal(d.date, d.weathercode, d.precipProb, teamSin, d.cloud),
          precip: Math.round(d.precipProb ?? 0),
          tempMax: d.tempMax,
          cloud: d.cloud,
          rain: rainTiming(d.rainParts),
        }));
        const wxDesc = days.map((d) => `${d.date}(${d.dayName}): ฟ้าเปิด ${d.sky}%, ฝน ${d.precip}%${d.rain ? `, ${d.rain}` : ''}`).join('\n');
        setS('🤖 AI กำลังวิเคราะห์ดวงทริป...');
        ai = await callClaude(
          `[ROLE] นักพยากรณ์ทริปเดินป่า Gen Z ผสมโหราศาสตร์จีน 5 ธาตุ ความเชื่อพื้นบ้านไทย พูดกวนๆ ไทย+อังกฤษ\n\nสถานที่: ${locName}${resolvedPlace ? ` (${resolvedPlace})` : ''}\nช่วง: ${fmtDate(f.startDate)}–${fmtDate(f.endDate)}\nสมาชิก: ${mDesc}\nบาปเฉลี่ยทีม: ${teamSin}%\nธาตุในทีม: ${elems.join(',') || 'ไม่ทราบ'}\nเฟสพระจันทร์: ${moon.name} ${moon.emoji}\n\nคะแนนฟ้าเปิดรายวัน (คำนวณจากอากาศจริง Open-Meteo + ดวงทีมแล้ว ห้ามแก้ตัวเลข):\n${wxDesc}\n\nวิเคราะห์ดวงทริป 2-3 ประโยค กวนๆ อิงทั้งตัวเลขอากาศจริงและธาตุของทีม\n${remNote} อิงธาตุหลักในทีม สีมงคล ความเชื่อไทย เลขมงคล ของขลัง\nห้ามใส่ตัวเลข % บาปซ้ำในคำวิเคราะห์ (แสดงอยู่ในหน้าจอแล้ว)\n\nตอบ JSON เท่านั้น:\n{"analysis":"string","remedies":["string"],"vibe":"string"}`,
          'trip', meta,
        );
      } else {
        // ── 2b. เกิน 16 วัน / อากาศล่ม → ให้ AI ประมาณตามฤดูกาล ──
        setS('🤖 AI ประมาณจากฤดูกาล... รอแป๊บนึงนะ');
        ai = await callClaude(
          `[ROLE] นักพยากรณ์ทริปเดินป่า Gen Z รู้จักสภาพอากาศตามฤดูกาลในเอเชียตะวันออกเฉียงใต้ดี ผสมโหราศาสตร์จีน 5 ธาตุ ความเชื่อพื้นบ้านไทย\n\nสถานที่: ${locName}\nช่วง: ${fmtDate(f.startDate)}–${fmtDate(f.endDate)}\nวัน: ${dates.join(',')}\nสมาชิก: ${mDesc}\nบาปเฉลี่ยทีม: ${teamSin}%\nธาตุในทีม: ${elems.join(',') || 'ไม่ทราบ'}\nเฟสพระจันทร์: ${moon.name} ${moon.emoji}\n\nประมาณ sky (0-100 สูง=ฟ้าเปิด) และ rain (0-100) ของแต่ละวัน อิงฤดูกาลจริงของ "${locName}" บวกลบ sin penalty (${teamSin}×0.25) และ day bonus (พฤหัส+5,จ/พ/ศ+3,อา0,อ/ส-3)\nวิเคราะห์ดวงทริป 2-3 ประโยค กวนๆ\n${remNote} อิงธาตุหลักในทีม สีมงคล ความเชื่อไทย เลขมงคล ของขลัง\nห้ามใส่ตัวเลข % บาปซ้ำในคำวิเคราะห์ (แสดงอยู่ในหน้าจอแล้ว)\n\nตอบ JSON เท่านั้น:\n{"dailyScores":[{"date":"YYYY-MM-DD","sky":50,"rain":50}],"analysis":"string","remedies":["string"],"vibe":"string"}`,
          'trip', meta,
        );
        if (ai.dailyScores?.length) {
          days = ai.dailyScores.map((d) => ({
            date: d.date,
            dayName: DAY_TH[parseDay(d.date).getDay()],
            sky: Math.max(5, Math.min(99, Number(d.sky) || 50)),
            precip: Number(d.rain) || 0,
          }));
        } else {
          days = dates.map((date) => ({
            date,
            dayName: DAY_TH[parseDay(date).getDay()],
            sky: Math.max(5, Math.min(99, Math.round(60 * 0.72 + (100 - teamSin * 0.25) * 0.28 + dayBonus(date) * 0.1))),
            precip: 50,
          }));
        }
      }

      const top3 = [...days].sort((a, b) => b.sky - a.sky).slice(0, 3);
      const avgSky = days.length ? Math.round(days.reduce((a, d) => a + d.sky, 0) / days.length) : 50;
      saveHistory({ kind: 'trip', location: locName, teamSin, avgSky });
      onResult({
        location: locName, resolvedPlace, startDate: f.startDate, endDate: f.endDate,
        teamSin, avgSky, members, top3, realWeather, moon,
        analysis: ai.analysis, remedies: ai.remedies, vibe: ai.vibe, fallback: ai.fallback,
      });
    } catch (e) {
      setE(`❌ ${e.name === 'AbortError' ? 'หมดเวลา 35 วิ' : e.message} — ลองกดอีกครั้ง`);
    }
    setL(false); setS('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Fld label="จะไปไหน? 📍">
        <PlaceSearch selected={f.place} onSelect={(p) => setF((s) => ({ ...s, place: p }))} />
      </Fld>
      <Fld label="ช่วงวันที่ไป? 📅">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="date" style={{ ...IN, flex: 1 }} min={today} value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} />
          <span style={{ color: '#6B7AA8' }}>→</span>
          <input type="date" style={{ ...IN, flex: 1 }} min={f.startDate || today} value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} />
        </div>
      </Fld>
      <Fld label="ใครไปบ้าง? 👥 (ไม่ใส่ก็ได้)">
        {f.members.map((m, i) => (
          <div key={m.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 10 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input style={{ ...IN, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', borderRadius: 0, padding: '6px 0' }} placeholder={`ชื่อเล่นคนที่ ${i + 1} (ไม่ใส่ก็ได้)`} value={m.nickname} onChange={(e) => upd(m.id, 'nickname', e.target.value)} />
              <input type="number" style={{ ...IN, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', borderRadius: 0, padding: '5px 0', fontSize: '0.83rem', color: '#6B7AA8' }} placeholder="ปีเกิด พ.ศ. (ไม่รู้ก็ไม่เป็นไร)" value={m.birthYear} onChange={(e) => upd(m.id, 'birthYear', e.target.value)} />
            </div>
            {f.members.length > 1 && <button onClick={() => del(m.id)} style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.22)', color: '#F87171', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>×</button>}
          </div>
        ))}
        <button onClick={add} style={{ background: 'rgba(96,165,250,0.04)', border: '1px dashed rgba(96,165,250,0.22)', color: '#60A5FA', padding: '10px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.88rem', width: '100%' }}>+ เพิ่มคนในทริป</button>
      </Fld>
      <Err msg={err} />
      <SubBtn onClick={go} loading={loading} txt={step}>🔮 ทำนายทริปเลย!</SubBtn>
    </div>
  );
}
