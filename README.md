# 🌤️ ดวงฟ้าเปิด

> แอพทำนายดวงนักเดินป่า — เช็คว่าใครเป็น "คนบาป" ที่ทำให้ฟ้าปิด
> ผสมโหราศาสตร์จริง (5 ธาตุจีน, นักษัตร, เลขศาสตร์ไทย) + ข้อมูลอากาศจริงจาก Open-Meteo

สร้างด้วย Next.js (App Router) · Deploy บน Vercel ได้ฟรี

---

## 🚀 รันบนเครื่องตัวเอง

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## 🔑 เปิดโหมด AI (optional)

ถ้าไม่ตั้งค่า แอพยังใช้งานได้ — คะแนนดวงและอากาศคำนวณจริงทั้งหมด
แต่ส่วน "AI วิเคราะห์" จะใช้ข้อความสำเร็จรูปจากตำราแทน

1. สมัคร API key ที่ [console.anthropic.com](https://console.anthropic.com)
2. ก็อป `.env.example` เป็น `.env.local`
3. ใส่ key: `ANTHROPIC_API_KEY=sk-ant-...`
4. restart dev server (`Ctrl+C` แล้ว `npm run dev` ใหม่)

## ☁️ Deploy ขึ้น Vercel

1. Push โค้ดขึ้น GitHub (สร้าง repo ใหม่ แล้ว push โฟลเดอร์นี้)
2. ไปที่ [vercel.com](https://vercel.com) → **Add New Project** → เลือก repo
3. ที่หน้า config ก่อน deploy: ใส่ Environment Variable
   - Name: `ANTHROPIC_API_KEY` / Value: `sk-ant-...`
4. กด **Deploy** — เสร็จแล้วได้ลิงก์ `https://ชื่อโปรเจกต์.vercel.app` แชร์ให้เพื่อนได้เลย

> ⚠️ API key อยู่ฝั่ง server เท่านั้น (API routes) — ผู้ใช้เว็บมองไม่เห็น key

## 🗂️ โครงสร้าง

```
app/
  page.js               หน้าหลัก (tab เช็คความบาป / ทำนายทริป)
  layout.js             ฟอนต์ Sarabun + metadata
  api/claude/route.js   proxy ไป Anthropic API (ซ่อน key) + fallback ไม่มี AI
  api/weather/route.js  geocode + forecast จาก Open-Meteo (ฟรี ไม่ใช้ key)
components/             SinForm, SinResult, TripForm, TripResult, ui
lib/
  astro.js              สูตรโหราศาสตร์ทั้งหมด (sin score, นักษัตร, ธาตุ, วันมงคล)
  weather.js            Weather Score formula (clarity, skyFinal)
  fallback.js           คำวิเคราะห์สำเร็จรูปเมื่อไม่มี API key
```

## 🧮 สูตร Sky Score

```
clarity      = weathercode → 100/85/55/40/22/8
weatherScore = clarity×0.5 + (100−โอกาสฝน)×0.5
skyFinal     = weatherScore×0.72 + (100−บาปทีม×0.25)×0.28 + วันมงคล×0.1
```

- ทริปภายใน 16 วันข้างหน้า → ใช้พยากรณ์อากาศจริง
- เกิน 16 วัน → AI ประมาณจากฤดูกาล (หรือคำนวณจากดวงล้วนๆ ถ้าไม่มี key)

---

🔮 ทำเพื่อความสนุก อย่าซีเรียสเกินไปนะ — แต่หลักโหราศาสตร์ที่ใช้เป็นของจริงนะเว้ย
