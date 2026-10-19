// ===== เฟสพระจันทร์ (คำนวณเอง ไม่ใช้ API) =====
// อิงรอบ synodic month 29.53 วัน จากจันทร์ดับอ้างอิง 2000-01-06 18:14 UTC

const SYNODIC = 29.53058867;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14) / 86400000; // หน่วยเป็น "วัน"

const PHASES = [
  { name: 'จันทร์ดับ', emoji: '🌑' },
  { name: 'ข้างขึ้นเสี้ยว', emoji: '🌒' },
  { name: 'กึ่งขึ้น', emoji: '🌓' },
  { name: 'ข้างขึ้นโหนก', emoji: '🌔' },
  { name: 'จันทร์เต็มดวง', emoji: '🌕' },
  { name: 'ข้างแรมโหนก', emoji: '🌖' },
  { name: 'กึ่งแรม', emoji: '🌗' },
  { name: 'ข้างแรมเสี้ยว', emoji: '🌘' },
];

// รับ 'YYYY-MM-DD' → { idx, name, emoji }
export const moonPhase = (dateStr) => {
  if (!dateStr) return PHASES[0];
  const [y, m, d] = dateStr.split('-').map(Number);
  const days = Date.UTC(y, m - 1, d) / 86400000;
  const frac = ((((days - KNOWN_NEW_MOON) % SYNODIC) + SYNODIC) % SYNODIC) / SYNODIC; // 0..1
  let idx;
  if (frac < 0.03 || frac > 0.97) idx = 0;
  else if (frac < 0.22) idx = 1;
  else if (frac < 0.28) idx = 2;
  else if (frac < 0.47) idx = 3;
  else if (frac < 0.53) idx = 4;
  else if (frac < 0.72) idx = 5;
  else if (frac < 0.78) idx = 6;
  else idx = 7;
  return { idx, ...PHASES[idx] };
};
