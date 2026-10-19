// ===== ดวงคู่หูเดินป่า — ความเข้ากันตามวงจร 5 ธาตุ =====
// เสริม/เกิด (generative): น้ำ→ไม้→ไฟ→ดิน→ทอง→น้ำ
// ข่ม/ทำลาย (controlling): ไม้→ดิน→น้ำ→ไฟ→ทอง→ไม้

const GEN  = { น้ำ: 'ไม้', ไม้: 'ไฟ', ไฟ: 'ดิน', ดิน: 'ทอง', ทอง: 'น้ำ' };   // A เกิด B
const CTRL = { ไม้: 'ดิน', ดิน: 'น้ำ', น้ำ: 'ไฟ', ไฟ: 'ทอง', ทอง: 'ไม้' };  // A ข่ม B

export const elementRelation = (a, b) => {
  if (!a || !b) return 'unknown';
  if (a === b) return 'same';
  if (GEN[a] === b || GEN[b] === a) return 'generative';
  if (CTRL[a] === b || CTRL[b] === a) return 'controlling';
  return 'neutral';
};

// คะแนน "ไปด้วยกันแล้วฟ้าเปิดไหม" 5-95
export const compatScore = ({ elementA, elementB, sinA, sinB }) => {
  let s = 55;
  const rel = elementRelation(elementA, elementB);
  if (rel === 'same') s += 12;
  else if (rel === 'generative') s += 25;
  else if (rel === 'controlling') s -= 18;
  // บาปรวมยิ่งเยอะ ยิ่งดึงฟ้าปิด
  const avgSin = (Number(sinA) + Number(sinB)) / 2;
  s -= (avgSin - 40) * 0.3;
  return Math.max(5, Math.min(95, Math.round(s)));
};

export const compatLabel = (score) =>
  score >= 75 ? 'คู่ซี้ฟ้าเปิด ☀️ ไปไหนก็รอด'
  : score >= 55 ? 'เข้ากันได้ 👍 ลุ้นนิดหน่อยแต่โอเค'
  : score >= 40 ? 'ก้ำกึ่ง 🎲 ต้องแก้เคล็ดช่วย'
  : 'คู่อันตราย ⚠️ ไปด้วยกันเมื่อไหร่ฟ้าปิดเมื่อนั้น';

// คำอธิบายความสัมพันธ์ธาตุ (ใครดึงใคร)
export const relationText = (nameA, elemA, nameB, elemB) => {
  const rel = elementRelation(elemA, elemB);
  if (rel === 'unknown') return 'ไม่รู้ธาตุครบทั้งคู่ (ใส่ปีเกิดให้ครบจะแม่นขึ้น) — ตัดสินจากบาปล้วนๆ ไปก่อน';
  if (rel === 'same') return `${nameA} กับ ${nameB} ธาตุ${elemA}เหมือนกัน — จูนกันง่าย แต่ถ้าเป็นธาตุน้ำทั้งคู่ก็เรียกฝน x2 ระวังไว้`;
  if (rel === 'generative') return `ธาตุ${elemA}กับธาตุ${elemB}เป็นคู่ "เสริมกัน" ตามวงจร 5 ธาตุ — ยิ่งไปด้วยกันยิ่งบุญหนา ฟ้าเอนเอียงมาทางเปิด`;
  if (rel === 'controlling') return `ธาตุ${elemA}กับธาตุ${elemB}เป็นคู่ "ข่มกัน" — มีคนดึงอีกคนลง ต้องใส่สีมงคลช่วยบาลานซ์ ไม่งั้นเมฆได้ใจ`;
  return `ธาตุ${elemA}กับธาตุ${elemB}อยู่กลางๆ — ดวงคู่นี้ขึ้นกับการแก้เคล็ดและวันที่ไป`;
};
