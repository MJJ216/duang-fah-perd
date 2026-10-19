// ===== ค่าคงที่ทางโหราศาสตร์ (ยกมาจาก dung-fah-perd.jsx เดิม — ไม่แก้สูตร) =====
import { hashStr } from './seed';

export const ZODIAC_TH  = ['ชวด','ฉลู','ขาล','เถาะ','มะโรง','มะเส็ง','มะเมีย','มะแม','วอก','ระกา','จอ','กุน'];
export const ZODIAC_EMJ = ['🐀','🐂','🐯','🐇','🐉','🐍','🐴','🐐','🐒','🐓','🐕','🐷'];
export const ELEM_MAP   = {0:'ทอง',1:'ทอง',2:'น้ำ',3:'น้ำ',4:'ไม้',5:'ไม้',6:'ไฟ',7:'ไฟ',8:'ดิน',9:'ดิน'};
export const ELEM_EMJ   = {ทอง:'⚙️',น้ำ:'💧',ไม้:'🌿',ไฟ:'🔥',ดิน:'🪨'};
export const ELEM_SIN   = {ทอง:-8,น้ำ:20,ไม้:8,ไฟ:-15,ดิน:0};
export const NAME_SIN   = {1:-5,2:5,3:3,4:0,5:-3,6:-3,7:5,8:3,9:-5};
export const DAY_TH     = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
export const MONTHS_TH  = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

// ===== Helpers วันที่ =====
// ⚠️ ห้ามใช้ toISOString() แปลงวันที่ — มันแปลงเป็น UTC ทำให้วันที่ไทย (UTC+7) ถอยไป 1 วัน

const pad2 = (n) => String(n).padStart(2, '0');
export const fmtYMD  = (d) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
export const todayStr = () => fmtYMD(new Date());
export const parseDay = (s) => { const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); };
export const fmtDate  = (s) => { const [,m,d]=s.split('-').map(Number); return `${d} ${MONTHS_TH[m-1]}`; };

// ===== แปลง พ.ศ. → ค.ศ. + นักษัตร + ธาตุ =====

export const be2ce   = (be) => parseInt(be)-543;

// ช่วงปีเกิดที่รับได้ (พ.ศ.) — สูงสุด = ปีปัจจุบัน (คำนวณสดทุกครั้ง ไม่ต้องมาแก้ทุกปี)
export const BE_MIN  = 2483;                              // พ.ศ. 2483 = ค.ศ. 1940
export const maxBE   = () => new Date().getFullYear() + 543;
export const getZi   = (ce) => ((ce-1900)%12+12)%12;
export const getElem = (ce) => ELEM_MAP[ce%10];

// ===== เลขศาสตร์จากชื่อเล่น =====

export const calcNameNum = (name) => {
  if(!name?.trim()) return 5;
  let s=[...name.trim()].reduce((a,c)=>a+(c.charCodeAt(0)%9)+1,0);
  while(s>9) s=[...String(s)].reduce((a,d)=>a+ +d,0);
  return s;
};

// ===== Sin Score (ความบาป %) =====

export const calcSin = ({nickname,birthYearBE,pastWeather,hasRainGear}) => {
  let sin=30;
  if(birthYearBE){
    const ce=be2ce(birthYearBE);
    sin+=ELEM_SIN[getElem(ce)]||0;
    const zi=getZi(ce);
    if(zi===0||zi===11) sin+=10;   // ชวด/กุน = สัตว์น้ำ
    if(zi===5||zi===6)  sin-=10;   // มะเส็ง/มะเมีย = สัตว์ไฟ
  }
  sin+=NAME_SIN[calcNameNum(nickname)]||0;
  if(pastWeather==='closed') sin+=15; else if(pastWeather==='open') sin-=10;
  if(hasRainGear==='never')  sin+=10; else if(hasRainGear==='always') sin-=5;
  return Math.max(5,Math.min(95,Math.round(sin)));
};

export const sinLabel=(s)=>s<25?'บาปน้อยมาก 😇':s<45?'บาปนิดหน่อย 😅':s<65?'บาปพอควร 😈':s<80?'บาปเยอะนะ 🔥':'บาปมาก!! 👹';

// บีบค่าให้อยู่ 5–95
export const clampSin = (s) => Math.max(5, Math.min(95, Math.round(s)));

// ดวงแกว่งรายวัน -12..+12 (คงที่ภายในวันเดียว ต่อคน — seeded ด้วย คน+วันที่)
// เพราะดวงคนมีขึ้นมีลงในแต่ละวัน
export const dailyLuck = (seed, dateStr) => (hashStr(`${seed}|luck|${dateStr}`) % 25) - 12;
export const sinCol  =(s)=>`hsl(${Math.round(120*(1-s/100))},75%,55%)`;
export const skyCol  =(s)=>s>=65?'#34D399':s>=45?'#FBBF24':'#F87171';

// ===== สร้างรายการวันที่ในทริป (สูงสุด 14 วัน) =====

export const genDates=(start,end,max=14)=>{
  const dates=[];let cur=parseDay(start);const e=parseDay(end);
  while(cur<=e&&dates.length<max){
    dates.push(fmtYMD(cur));
    cur=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()+1);
  }
  return dates;
};

// ===== Day Bonus ตามโหราศาสตร์ไทย (วันธงชัย/อุบาทว์) =====
// อาทิตย์=0, จันทร์=1, อังคาร=2, พุธ=3, พฤหัส=4, ศุกร์=5, เสาร์=6

export const dayBonus=(dateStr)=>{
  const d=parseDay(dateStr).getDay();
  if(d===4) return 5;                    // พฤหัสบดี — ธงชัย
  if(d===1||d===3||d===5) return 3;      // จันทร์/พุธ/ศุกร์
  if(d===0) return 0;                    // อาทิตย์
  return -3;                             // อังคาร/เสาร์ — อุบาทว์
};

// ===== สีมงคลประจำวันเกิด (ความเชื่อไทยของจริง) =====
// index = วันในสัปดาห์ (อาทิตย์=0 ... เสาร์=6)
export const DAY_COLOR = {
  0: { name: 'แดง',          hex: '#F87171' },  // อาทิตย์
  1: { name: 'เหลืองครีม',   hex: '#FBBF24' },  // จันทร์
  2: { name: 'ชมพู',         hex: '#F472B6' },  // อังคาร
  3: { name: 'เขียว',        hex: '#34D399' },  // พุธ
  4: { name: 'ส้มแสด',       hex: '#FB923C' },  // พฤหัสบดี
  5: { name: 'ฟ้า',          hex: '#60A5FA' },  // ศุกร์
  6: { name: 'ม่วง',         hex: '#A78BFA' },  // เสาร์
};

// รับ 'YYYY-MM-DD' (วันเกิดเต็ม, optional) → { dow, dayName, color } | null
export const getBirthDay = (birthdateStr) => {
  if (!birthdateStr) return null;
  const dow = parseDay(birthdateStr).getDay();
  return { dow, dayName: DAY_TH[dow], color: DAY_COLOR[dow] };
};
