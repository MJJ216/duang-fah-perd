'use client';
import { useRef } from 'react';
import { C, ST, Rem, RstBtn, FallbackNote, CharmCard } from './ui';
import { ShareCard, ShareButtons } from './ShareCard';
import { sinCol } from '@/lib/astro';

export default function SinResult({ result, onReset }) {
  const c = sinCol(result.sin);
  const cardRef = useRef(null);

  return (
    <div className="ra" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>ผลดวงของ <span style={{ color: '#60A5FA' }}>{result.nickname}</span></h2>
        <p style={{ color: '#6B7AA8', marginTop: 4, fontSize: '0.88rem' }}>
          {result.zodiac} · ธาตุ{result.element} {result.elementEmoji}
          {result.birthDay && <> · วันเกิด{result.birthDay.dayName}</>}
          {result.moon && <> · {result.moon.emoji}{result.moon.name}</>}
        </p>
        {result.birthDay && (
          <p style={{ marginTop: 4, fontSize: '0.8rem' }}>
            สีมงคลวันเกิด: <b style={{ color: result.birthDay.color.hex }}>{result.birthDay.color.name}</b>
          </p>
        )}
      </div>

      <div style={{ ...C, textAlign: 'center', padding: '36px 20px', background: `radial-gradient(ellipse at 50% -10%, ${c}22 0%, rgba(7,11,26,0) 65%), rgba(255,255,255,0.04)` }}>
        <div style={{ color: c, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', lineHeight: 1 }}>
          <span style={{ fontSize: '5.8rem', fontWeight: 800, letterSpacing: '-0.04em' }}>{result.sin}</span>
          <span style={{ fontSize: '2.4rem', fontWeight: 700, marginTop: 14 }}>%</span>
        </div>
        <p style={{ color: '#8B92B8', marginTop: 8 }}>{result.sinLabel}</p>
      </div>

      <div style={C}><p style={ST}>🤖 คำทำนาย</p><p style={{ fontSize: '0.93rem', lineHeight: 1.8, color: '#E8EDFF' }}>{result.analysis}</p></div>
      <FallbackNote show={result.fallback} />
      <CharmCard charm={result.charm} />
      <div style={C}><p style={ST}>🪬 วิธีแก้เคล็ด</p><Rem items={result.remedies} /></div>

      {/* การ์ดแชร์ + ปุ่ม */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ShareCard ref={cardRef} headline={`ดวงของ ${result.nickname}`} sub={`${result.zodiac} · ธาตุ${result.element}`} value={result.sin} valueLabel={result.sinLabel} color={c} vibe={null} />
      </div>
      <ShareButtons cardRef={cardRef} filename={`duang-${result.nickname}`} shareText={`ดวงบาปของเราอยู่ที่ ${result.sin}%! มาเช็คของแกบ้าง 🔮`} />

      <RstBtn onClick={onReset} label="🔄 เช็คใหม่" />
    </div>
  );
}
