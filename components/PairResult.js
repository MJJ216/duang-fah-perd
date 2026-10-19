'use client';
import { useRef } from 'react';
import { C, ST, RstBtn } from './ui';
import { ShareCard, ShareButtons } from './ShareCard';
import { skyCol, sinCol, ELEM_EMJ } from '@/lib/astro';

export default function PairResult({ result, onReset }) {
  const { a, b, score, label, relationText } = result;
  const col = skyCol(score);
  const cardRef = useRef(null);

  const chip = (p) => (
    <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 8px' }}>
      <p style={{ fontSize: '1rem', fontWeight: 700, color: '#E8EDFF' }}>{p.nickname}</p>
      <p style={{ fontSize: '0.78rem', color: '#6B7AA8', marginTop: 2 }}>
        {p.element ? `ธาตุ${p.element} ${ELEM_EMJ[p.element]}` : 'ไม่รู้ธาตุ'}{p.zodiac ? ` · ${p.zodiac}` : ''}
      </p>
      <p style={{ fontSize: '0.78rem', color: sinCol(p.sin), fontWeight: 700, marginTop: 4 }}>บาป {p.sin}%</p>
    </div>
  );

  return (
    <div className="ra" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {chip(a)}
        <span style={{ fontSize: '1.4rem' }}>💘</span>
        {chip(b)}
      </div>

      <div style={{ ...C, textAlign: 'center', padding: '32px 20px', background: `radial-gradient(ellipse at 50% -10%, ${col}22 0%, rgba(7,11,26,0) 65%), rgba(255,255,255,0.04)` }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>ไปด้วยกันแล้วฟ้าเปิด</p>
        <div style={{ color: col, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', lineHeight: 1 }}>
          <span style={{ fontSize: '5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>{score}</span>
          <span style={{ fontSize: '2rem', fontWeight: 700, marginTop: 12 }}>%</span>
        </div>
        <p style={{ color: '#8B92B8', marginTop: 8 }}>{label}</p>
      </div>

      <div style={C}><p style={ST}>🔮 ความสัมพันธ์ธาตุ</p><p style={{ fontSize: '0.93rem', lineHeight: 1.8, color: '#E8EDFF' }}>{relationText}</p></div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ShareCard ref={cardRef} headline={`${a.nickname} 💘 ${b.nickname}`} sub="ดวงคู่หูเดินป่า" value={score} valueLabel={label} color={col} vibe={null} />
      </div>
      <ShareButtons cardRef={cardRef} filename={`pair-${a.nickname}-${b.nickname}`} shareText={`${a.nickname} กับ ${b.nickname} ไปเดินป่าด้วยกันฟ้าเปิด ${score}%! 💘`} />

      <RstBtn onClick={onReset} label="🔄 เช็คคู่ใหม่" />
    </div>
  );
}
