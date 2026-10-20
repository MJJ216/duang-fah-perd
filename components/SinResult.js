'use client';
import { useRef } from 'react';
import { C, ST, Rem, RstBtn, FallbackNote, CharmCard } from './ui';
import { ShareCard, ShareButtons } from './ShareCard';
import { sinCol } from '@/lib/astro';
import { remedyTier } from '@/lib/remedies';

export default function SinResult({ result, onReset }) {
  const c = sinCol(result.sin);
  const cardRef = useRef(null);

  return (
    <div className="ra" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <ShareCard
          ref={cardRef}
          headline={`ผลดวงของ ${result.nickname}`}
          sub={`${result.zodiac} · ธาตุ${result.element} ${result.elementEmoji}${result.birthDay ? ` · เกิดวัน${result.birthDay.dayName}` : ''}`}
          extra={[result.moon && `${result.moon.emoji} ${result.moon.name}`, result.birthDay && `สีมงคลวันเกิด ${result.birthDay.color.name}`].filter(Boolean).join(' · ')}
          value={result.sin} valueLabel={result.sinLabel} color={c} vibe={null}
        />
        <p style={{ color: 'rgba(107,122,168,0.6)', fontSize: '0.72rem' }}>🔮 ดวงวันนี้ · มีขึ้นมีลงในแต่ละวัน</p>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <ShareButtons cardRef={cardRef} filename={`duang-${result.nickname}`} shareText={`คนบาปอย่างเราบาปอยู่ที่ ${result.sin}%! มาเช็คของแกบ้าง 🔮`} />
        </div>
      </div>

      <div style={C}><p style={ST}>🤖 คำทำนาย</p><p style={{ fontSize: '0.93rem', lineHeight: 1.8, color: '#E8EDFF' }}>{result.analysis}</p></div>
      <FallbackNote show={result.fallback} />
      <CharmCard charm={result.charm} />
      <div style={C}><p style={ST}>🪬 วิธีแก้เคล็ด · <span style={{ color: c }}>{remedyTier(result.sin).label}</span></p><Rem items={result.remedies} /></div>

      <RstBtn onClick={onReset} label="🔄 เช็คใหม่" />
    </div>
  );
}
