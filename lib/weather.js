// ===== Weather Score Formula จริง (จาก dung-fah-perd-summary.md) =====
import { dayBonus } from './astro';

// แปลง WMO weathercode → ความโปร่งของฟ้า (0-100)
export const clarityFromCode = (code) => {
  if (code === 0) return 100;   // ฟ้าใสเปี๊ยะ
  if (code <= 2)  return 85;    // เมฆบางส่วน
  if (code === 3) return 55;    // เมฆครึ้ม
  if (code <= 48) return 40;    // หมอก
  if (code <= 67) return 22;    // ฝนปรอยถึงฝนตก
  return 8;                     // ฝนหนัก/พายุ
};

// ปรับความโปร่งด้วยเมฆเฉลี่ย (0-100%) — เมฆเยอะฟ้าปิดแม้ไม่มีฝน (หมอกลงดอย)
// ผสม clarity จาก weathercode กับ (100 - cloud) แบบถ่วงน้ำหนัก
export const clarity = (code, cloud) => {
  const base = clarityFromCode(code);
  if (cloud == null) return base;
  return Math.round(base * 0.65 + (100 - cloud) * 0.35);
};

// weatherScore = clarity×0.5 + (100 - precipProb)×0.5
export const weatherScore = (code, precipProb, cloud) =>
  clarity(code, cloud) * 0.5 + (100 - (precipProb ?? 50)) * 0.5;

// skyFinal = weatherScore×0.72 + (100 - teamSin×0.25)×0.28 + dayBonus×0.1
export const skyFinal = (dateStr, code, precipProb, teamSin, cloud) => {
  const ws = weatherScore(code, precipProb, cloud);
  const raw = ws * 0.72 + (100 - teamSin * 0.25) * 0.28 + dayBonus(dateStr) * 0.1;
  return Math.max(5, Math.min(99, Math.round(raw)));
};

// สรุปช่วงที่ฝนน่าตก จาก prob รายช่วง {morning, afternoon, evening} (0-100)
// → ข้อความสั้นกวนๆ หรือ '' ถ้าไม่เด่นช่วงไหน
export const rainTiming = (parts) => {
  if (!parts) return '';
  const { morning = 0, afternoon = 0, evening = 0 } = parts;
  const max = Math.max(morning, afternoon, evening);
  if (max < 35) return 'ทั้งวันฟ้าค่อนข้างโปร่ง ☀️';
  const label = max === afternoon ? 'บ่าย' : max === evening ? 'เย็น' : 'เช้า';
  const clear = morning < 35 && label !== 'เช้า' ? ' เช้าโปร่งอยู่' : '';
  return `ฝนเสี่ยงช่วง${label}สุด ☔${clear}`;
};
