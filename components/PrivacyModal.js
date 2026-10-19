'use client';
import { useEffect, useState } from 'react';
import { Modal } from './ui';

const KEY = 'dfp_privacy_ok';

// เด้งครั้งแรก — บอกตามจริงว่าไม่เก็บข้อมูลผู้ใช้
export default function PrivacyModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setShow(true); }
    catch { /* ปิด storage → ไม่เด้ง ก็ได้ */ }
  }, []);

  const ok = () => {
    try { localStorage.setItem(KEY, '1'); } catch {}
    setShow(false);
  };

  if (!show) return null;
  const Line = ({ children }) => (
    <li style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#E8EDFF', marginBottom: 8 }}>{children}</li>
  );

  return (
    <Modal onClose={ok}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6 }}>🔒 เรื่องความเป็นส่วนตัว</h2>
      <p style={{ color: '#8B92B8', fontSize: '0.85rem', marginBottom: 14 }}>เล่นสบายใจได้เลย — เราไม่เก็บข้อมูลคุณ</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <Line>✅ <b>ไม่มีฐานข้อมูล ไม่มีบัญชี ไม่มี tracking</b> — เราไม่มีที่เก็บข้อมูลคุณเลย</Line>
        <Line>✅ ชื่อเล่น / ปีเกิด <b>คำนวณในเครื่องคุณล้วนๆ</b> ไม่ส่งออก</Line>
        <Line>✅ ประวัติ / Leaderboard เก็บใน <b>เครื่องคุณเอง</b> (localStorage) ลบได้ตลอด</Line>
        <Line>📍 ตอนทำนายทริปจะส่งแค่ <b>ชื่อสถานที่</b> ไปเช็คอากาศ (Open-Meteo) เท่านั้น</Line>
      </ul>
      <p style={{ color: 'rgba(107,122,168,0.6)', fontSize: '0.7rem', lineHeight: 1.6, margin: '12px 0 16px' }}>
        * ผู้ให้บริการพื้นฐาน (Vercel/Open-Meteo) อาจมี log ระดับเซิร์ฟเวอร์ตามมาตรฐานทั่วไป ซึ่งเราไม่ได้เก็บเองและไม่ได้นำไปใช้
      </p>
      <button onClick={ok} style={{ background: 'linear-gradient(135deg,#1A3370,#1E40AF)', border: '1px solid rgba(96,165,250,0.25)', color: '#fff', padding: '13px', borderRadius: 12, fontFamily: 'inherit', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
        เก็ตแล้ว เริ่มเลย ✨
      </button>
    </Modal>
  );
}
