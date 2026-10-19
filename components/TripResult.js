'use client';
import { useRef } from 'react';
import { C, ST, Rem, RstBtn, FallbackNote } from './ui';
import { ShareCard, ShareButtons } from './ShareCard';
import { sinCol, skyCol, fmtDate, ELEM_EMJ } from '@/lib/astro';

export default function TripResult({ result, onReset }) {
  const sc = sinCol(result.teamSin);
  const skc = skyCol(result.avgSky);
  const cardRef = useRef(null);
  return (
    <div className="ra" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📍 {result.location}</h2>
        <p style={{ color: '#6B7AA8', marginTop: 4, fontSize: '0.88rem' }}>
          {fmtDate(result.startDate)} → {fmtDate(result.endDate)}
          {result.resolvedPlace ? ` · ${result.resolvedPlace}` : ''}
          {result.moon ? ` · ${result.moon.emoji}${result.moon.name}` : ''}
        </p>
        {result.vibe && <span style={{ display: 'inline-block', marginTop: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.22)', color: '#A78BFA', padding: '4px 12px', borderRadius: 20, fontSize: '0.82rem' }}>{result.vibe}</span>}
      </div>

      <div style={{ ...C, display: 'flex', padding: 0, overflow: 'hidden', background: `radial-gradient(ellipse at 20% 0%, ${skc}18 0%, transparent 55%), radial-gradient(ellipse at 80% 0%, ${sc}14 0%, transparent 55%), rgba(255,255,255,0.04)` }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '24px 12px' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>ฟ้าจะเปิด</p>
          <div style={{ color: skc, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', lineHeight: 1 }}>
            <span style={{ fontSize: '4.2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>{result.avgSky}</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: 10 }}>%</span>
          </div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />
        <div style={{ flex: 1, textAlign: 'center', padding: '24px 12px' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>บาปรวมทีม</p>
          <div style={{ color: sc, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', lineHeight: 1 }}>
            <span style={{ fontSize: '4.2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>{result.teamSin}</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: 10 }}>%</span>
          </div>
        </div>
      </div>

      {result.members?.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {result.members.map((m, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '6px 12px', display: 'flex', gap: 7, fontSize: '0.8rem', alignItems: 'center' }}>
              <span style={{ color: '#E8EDFF' }}>{m.nickname}</span>
              <span style={{ color: sinCol(m.sin), fontWeight: 700 }}>บาป {m.sin}%</span>
              {m.element && <span>{ELEM_EMJ[m.element]}</span>}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#6B7AA8', fontSize: '0.8rem', textAlign: 'center' }}>👥 ไม่ได้ระบุทีม — ทำนายจากอากาศจริง + วันมงคล</p>
      )}

      <div style={C}>
        <p style={ST}>📅 วันดีสุดในช่วงนี้</p>
        {result.top3?.map((d, i) => {
          const dc = skyCol(d.sky);
          return (
            <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < result.top3.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ fontSize: '1.1rem', width: 24, flexShrink: 0 }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E8EDFF' }}>{fmtDate(d.date)} <span style={{ color: '#6B7AA8', fontWeight: 400 }}>({d.dayName})</span></p>
                <p style={{ fontSize: '0.73rem', color: '#6B7AA8', marginTop: 1 }}>ฝน {d.precip}%{d.tempMax != null ? ` · สูงสุด ${Math.round(d.tempMax)}°C` : ''}{d.rain ? ` · ${d.rain}` : ''}</p>
              </div>
              <div style={{ width: 56, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ width: `${d.sky}%`, height: '100%', background: dc, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: dc, minWidth: 34, textAlign: 'right' }}>{d.sky}%</span>
            </div>
          );
        })}
        <p style={{ color: 'rgba(107,122,168,0.45)', fontSize: '0.68rem', marginTop: 10 }}>
          {result.realWeather ? '🌡️ อิงข้อมูลอากาศจริงจาก Open-Meteo + ดวงทีม' : '🌡️ อิงตามฤดูกาลของสถานที่ + ดวงทีม (เกินระยะพยากรณ์ 16 วัน)'}
        </p>
      </div>

      <div style={C}><p style={ST}>🤖 AI วิเคราะห์ทริปนี้</p><p style={{ fontSize: '0.93rem', lineHeight: 1.8, color: '#E8EDFF' }}>{result.analysis}</p></div>
      <FallbackNote show={result.fallback} />
      <div style={C}><p style={ST}>🪬 แก้เคล็ดก่อนขึ้นดอย</p><Rem items={result.remedies} /></div>

      {/* การ์ดแชร์ + ปุ่ม */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ShareCard ref={cardRef} headline={`📍 ${result.location}`} sub={`${fmtDate(result.startDate)} → ${fmtDate(result.endDate)}`} value={result.avgSky} valueLabel="โอกาสฟ้าเปิด" color={skc} vibe={result.vibe} />
      </div>
      <ShareButtons cardRef={cardRef} filename={`trip-${result.location}`} shareText={`ทริป ${result.location} ฟ้าจะเปิด ${result.avgSky}%! มาเช็คทริปแกบ้าง 🔮`} />

      <RstBtn onClick={onReset} label="🔄 ทำนายทริปใหม่" />
    </div>
  );
}
