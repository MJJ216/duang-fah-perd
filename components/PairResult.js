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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <ShareCard ref={cardRef} headline={`${a.nickname} 💘 ${b.nickname}`} sub="ดวงคู่หูเดินป่า · ไปด้วยกันแล้วฟ้าเปิด" value={score} valueLabel={label} color={col} vibe={null} />
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ShareButtons cardRef={cardRef} filename={`pair-${a.nickname}-${b.nickname}`} shareText={`${a.nickname} กับ ${b.nickname} ไปเดินป่าด้วยกันฟ้าเปิด ${score}%! 💘`} />
        </div>
      </div>

      <div style={C}><p style={ST}>🔮 ความสัมพันธ์ธาตุ</p><p style={{ fontSize: '0.93rem', lineHeight: 1.8, color: '#E8EDFF' }}>{relationText}</p></div>

      <RstBtn onClick={onReset} label="🔄 เช็คคู่ใหม่" />
    </div>
  );
}
