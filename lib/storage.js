// ===== ประวัติ + Leaderboard (เก็บใน localStorage เครื่องผู้ใช้เท่านั้น) =====
// ห่อ try/catch ทุกจุด — private mode / ปิด storage จะไม่พัง แอพยังเล่นได้

const KEY = 'dfp_history_v1';
const MAX = 50;

export const loadHistory = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
};

// entry: { kind:'sin'|'trip'|'pair', ... } — เติม ts ให้อัตโนมัติ
export const saveHistory = (entry) => {
  try {
    const h = loadHistory();
    h.unshift({ ...entry, ts: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(h.slice(0, MAX)));
  } catch { /* เงียบไว้ ไม่ให้กระทบ UX */ }
};

export const clearHistory = () => {
  try { localStorage.removeItem(KEY); } catch {}
};

// Leaderboard "ทีมบาปสุดของแก๊ง": รวมผลเช็คบาป เรียง % มาก→น้อย ตัดชื่อซ้ำ (เก็บครั้งล่าสุด)
export const leaderboard = () => {
  const seen = new Map();
  for (const e of loadHistory()) {
    if (e.kind !== 'sin' || !e.nickname) continue;
    if (!seen.has(e.nickname)) seen.set(e.nickname, e); // history เรียงใหม่สุดก่อนอยู่แล้ว
  }
  return [...seen.values()].sort((a, b) => b.sin - a.sin);
};
