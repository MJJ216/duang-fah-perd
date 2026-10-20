'use client';
import { useState } from 'react';
import { IN, Fld, Chips, Err, SubBtn } from './ui';
import { callClaude } from '@/lib/api';
import {
  ZODIAC_TH, ZODIAC_EMJ, ELEM_EMJ,
  be2ce, getZi, getElem, calcNameNum, calcSin, sinLabel, getBirthDay, todayStr,
  clampSin, dailyLuck, BE_MIN, maxBE,
} from '@/lib/astro';
import { moonPhase } from '@/lib/moon';
import { charmOf } from '@/lib/charm';
import { saveHistory } from '@/lib/storage';
import { remedyTier } from '@/lib/remedies';

export default function SinForm({ onResult }) {
  const [f, setF] = useState({ nickname: '', birthYear: '', birthdate: '', pastWeather: '', hasRainGear: '' });
  const [loading, setL] = useState(false);
  const [err, setE] = useState('');

  const go = async () => {
    if (!f.nickname || !f.birthYear || !f.pastWeather || !f.hasRainGear) { setE('กรอกให้ครบก่อนนะ 555'); return; }
    const be = parseInt(f.birthYear);
    if (be < BE_MIN || be > maxBE()) { setE(`ใส่ปีเกิดเป็น พ.ศ. นะ (${BE_MIN}–${maxBE()})`); return; }
    setL(true); setE('');
    const ce = be2ce(be);
    const baseSin = calcSin({ nickname: f.nickname, birthYearBE: String(be), pastWeather: f.pastWeather, hasRainGear: f.hasRainGear });
    const seed = `${f.nickname}:${be}`;
    // ดวงขยับรายวัน: base + ดวงประจำวัน (คงที่ทั้งวัน เปลี่ยนเมื่อขึ้นวันใหม่)
    const sin = clampSin(baseSin + dailyLuck(seed, todayStr()));
    const el = getElem(ce); const zi = getZi(ce);
    const zodiac = `ปี${ZODIAC_TH[zi]} ${ZODIAC_EMJ[zi]}`; const sl = sinLabel(sin);
    const nameNum = calcNameNum(f.nickname);
    const birthDay = getBirthDay(f.birthdate);     // null ถ้าไม่กรอก
    const moon = moonPhase(todayStr());
    const charm = charmOf(el, seed);
    const tier = remedyTier(sin);
    try {
      const dayLine = birthDay ? `\nวันเกิด: ${birthDay.dayName} (สีมงคล${birthDay.color.name})` : '';
      const prompt = `[ROLE] นักพยากรณ์ Gen Z เชี่ยวชาญโหราศาสตร์จีน 5 ธาตุ นักษัตร เลขศาสตร์ไทย กรรมพุทธ พูดแบบเพื่อนสนิท ไทย+อังกฤษ Gen Z กวนๆ\n\nชื่อเล่น: ${f.nickname}\nปีเกิด: ${be} พ.ศ. (${ce} ค.ศ.)\nนักษัตร: ${zodiac}\nธาตุ: ${el} ${ELEM_EMJ[el]}\nเลขศาสตร์: ${nameNum}${dayLine}\nเฟสพระจันทร์วันนี้: ${moon.name} ${moon.emoji}\nทริปล่าสุด: ${f.pastWeather === 'closed' ? 'ฟ้าปิด' : f.pastWeather === 'mixed' ? 'ปนๆ' : 'ฟ้าเปิด'}\nพกเสื้อกันฝน: ${f.hasRainGear === 'never' ? 'ไม่เคย' : f.hasRainGear === 'sometimes' ? 'บางที' : 'พกเสมอ'}\nบาป: ${sin}% (${sl})\n\nวิเคราะห์ 3-4 ประโยค อิงธาตุ${el}+นักษัตร${ZODIAC_TH[zi]}+เลขศาสตร์+เฟสพระจันทร์ ตามทฤษฎี 5 ธาตุ ห้ามใส่ตัวเลข % บาปซ้ำในคำวิเคราะห์ (แสดงอยู่ในหน้าจอแล้ว) เรียกผู้ใช้ว่า "คนบาป" ได้อย่างมากหนึ่งครั้ง\nแก้เคล็ด ${tier.count} ข้อ ระดับ "${tier.label}" (บาปน้อยให้เบาๆ บาปมากให้จัดเต็ม) อิงธาตุ${el} สีมงคล${birthDay ? `วันเกิด(${birthDay.color.name})` : ''} ความเชื่อไทยภูเขา/ฝน เลขมงคล ของขลัง และต้องมีของตลกๆ ที่หาซื้อได้ที่ร้านสะดวกซื้อ 1 ข้อ — specific ไม่ซ้ำแนวกัน\n\nตอบ JSON เท่านั้น:\n{"analysis":"string","remedies":["string"]}`;
      const ai = await callClaude(prompt, 'sin', { nickname: f.nickname, element: el, zodiacName: ZODIAC_TH[zi], sin, nameNum, dayColor: birthDay?.color || null, moon, seed, date: todayStr(), pastWeather: f.pastWeather, hasRainGear: f.hasRainGear, birthDay });
      const result = { sin, sinLabel: sl, element: el, zodiac, nickname: f.nickname, elementEmoji: ELEM_EMJ[el], birthDay, moon, charm: ai.charm || charm, ...ai };
      saveHistory({ kind: 'sin', nickname: f.nickname, sin, element: el, zodiac, sinLabel: sl });
      onResult(result);
    } catch (e) {
      setE(`❌ ${e.name === 'AbortError' ? 'หมดเวลา' : e.message} — ลองกดอีกครั้ง`);
    }
    setL(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Fld label="ชื่อเล่นของคนบาป? 👤"><input style={IN} placeholder="เช่น ต้าว, มิ้น, เปิ้ล..." value={f.nickname} onChange={(e) => setF({ ...f, nickname: e.target.value })} /></Fld>
      <Fld label="ปีเกิด (พ.ศ.) 📅"><input style={IN} type="number" placeholder={`เช่น ${maxBE()}`} value={f.birthYear} onChange={(e) => setF({ ...f, birthYear: e.target.value })} /></Fld>
      <Fld label="วันเกิดเต็ม (ไม่บังคับ) 🎂">
        <input style={IN} type="date" value={f.birthdate} onChange={(e) => setF({ ...f, birthdate: e.target.value })} />
        <span style={{ fontSize: '0.75rem', color: '#6B7AA8' }}>ใส่แล้วจะได้สีมงคลประจำวันเกิด + ทำนายแม่นขึ้น</span>
      </Fld>
      <Fld label="ทริปล่าสุดฟ้าเป็นไง? 🌦️"><Chips opts={[{ v: 'closed', l: '☁️ ปิดตลอด' }, { v: 'mixed', l: '🌤️ ปนๆ' }, { v: 'open', l: '☀️ เปิดสวย' }]} val={f.pastWeather} set={(v) => setF({ ...f, pastWeather: v })} /></Fld>
      <Fld label="พกเสื้อกันฝนไหม? 🌂"><Chips opts={[{ v: 'never', l: '❌ ไม่เคยเลย' }, { v: 'sometimes', l: '🤷 บางที' }, { v: 'always', l: '✅ พกเสมอ' }]} val={f.hasRainGear} set={(v) => setF({ ...f, hasRainGear: v })} /></Fld>
      <Err msg={err} />
      <SubBtn onClick={go} loading={loading} txt="กำลังดูดวง...">🔮 เช็คความบาปเลย!</SubBtn>
    </div>
  );
}
