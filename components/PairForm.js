'use client';
import { useState } from 'react';
import { IN, Fld, Err, SubBtn } from './ui';
import { be2ce, getZi, getElem, calcSin, ZODIAC_TH, ZODIAC_EMJ } from '@/lib/astro';
import { compatScore, compatLabel, relationText, elementRelation } from '@/lib/compat';

const person = (p) => {
  const be = p.birthYear ? parseInt(p.birthYear) : null;
  const ce = be && be >= 2483 && be <= 2558 ? be2ce(be) : null;
  const sin = calcSin({ nickname: p.nickname, birthYearBE: ce ? String(be) : null, pastWeather: 'mixed', hasRainGear: 'sometimes' });
  const zi = ce != null ? getZi(ce) : null;
  return {
    nickname: p.nickname, sin,
    element: ce != null ? getElem(ce) : null,
    zodiac: zi != null ? `${ZODIAC_TH[zi]}${ZODIAC_EMJ[zi]}` : null,
  };
};

export default function PairForm({ onResult }) {
  const [a, setA] = useState({ nickname: '', birthYear: '' });
  const [b, setB] = useState({ nickname: '', birthYear: '' });
  const [err, setE] = useState('');

  const go = () => {
    if (!a.nickname || !b.nickname) { setE('ใส่ชื่อเล่นทั้งสองคนก่อนนะ'); return; }
    setE('');
    const A = person(a), B = person(b);
    const score = compatScore({ elementA: A.element, elementB: B.element, sinA: A.sin, sinB: B.sin });
    onResult({
      a: A, b: B, score,
      label: compatLabel(score),
      relation: elementRelation(A.element, B.element),
      relationText: relationText(A.nickname, A.element, B.nickname, B.element),
    });
  };

  const box = (p, set, n) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA' }}>คนที่ {n}</p>
      <input style={IN} placeholder="ชื่อเล่น *" value={p.nickname} onChange={(e) => set({ ...p, nickname: e.target.value })} />
      <input style={IN} type="number" placeholder="ปีเกิด พ.ศ. (ไม่รู้ก็ได้)" value={p.birthYear} onChange={(e) => set({ ...p, birthYear: e.target.value })} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ color: '#8B92B8', fontSize: '0.85rem', textAlign: 'center' }}>เช็คว่าสองคนนี้ไปเดินป่าด้วยกันแล้ว<br />ฟ้าจะเปิดหรือเรียกฝนใส่กัน 🌦️</p>
      <Fld label="👯 คู่หูเดินป่า">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {box(a, setA, 1)}
          {box(b, setB, 2)}
        </div>
      </Fld>
      <Err msg={err} />
      <SubBtn onClick={go} loading={false} txt="">💘 เช็คดวงคู่หูเลย!</SubBtn>
    </div>
  );
}
