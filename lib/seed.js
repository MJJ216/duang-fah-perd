// ===== Deterministic seeded helpers =====
// หัวใจของ "คำทำนายไม่ซ้ำแต่คงที่ต่อคน": คนเดิม(ชื่อ+ปีเกิด)ได้คำเดิมเสมอ
// แต่คนละคนแทบไม่ซ้ำ — ไม่ใช่สุ่มใหม่ทุกครั้ง (จะได้รู้สึก "แม่น" + แชร์แล้วตรง)

// FNV-1a hash → เลขบวก 32 บิต
export const hashStr = (str) => {
  let h = 2166136261 >>> 0;
  const s = String(str ?? '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
};

// เลือก 1 ชิ้นจาก arr ด้วย seed + salt (salt แยก pool ไม่ให้เลือกตำแหน่งเดียวกันหมด)
export const pick = (arr, seed, salt = 0) => {
  if (!arr || arr.length === 0) return undefined;
  return arr[hashStr(`${seed}:${salt}`) % arr.length];
};

// เลือก n ชิ้นไม่ซ้ำจาก arr ด้วย seed
export const pickN = (arr, n, seed, salt = 0) => {
  if (!arr) return [];
  const pool = [...arr];
  const out = [];
  let s = hashStr(`${seed}:${salt}`);
  while (pool.length && out.length < n) {
    out.push(pool.splice(s % pool.length, 1)[0]);
    s = hashStr(String(s));
  }
  return out;
};

// เลขมงคล 1-9 จาก seed
export const luckyNumber = (seed, salt = 'num') => (hashStr(`${seed}:${salt}`) % 9) + 1;
