'use client';
import { forwardRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { GhostBtn } from './ui';

// การ์ดสรุปสำหรับแชร์ (ดีไซน์แบรนด์ เอาไปแคป/โหลดเป็นรูปได้)
export const ShareCard = forwardRef(function ShareCard({ headline, sub, extra, value, valueLabel, color, vibe, secondary }, ref) {
  return (
    <div ref={ref} style={{
      width: '100%', maxWidth: 400, padding: '28px 24px', borderRadius: 20, boxSizing: 'border-box',
      background: [`radial-gradient(ellipse at 50% 38%, ${color}26 0%, rgba(7,11,26,0) 60%)`, 'radial-gradient(ellipse at 50% -10%, #18306a 0%, #070B1A 62%)',
        'radial-gradient(1.5px 1.5px at 14% 20%, rgba(255,255,255,0.7) 0%, transparent 100%)',
        'radial-gradient(1px 1px at 82% 16%, rgba(255,255,255,0.5) 0%, transparent 100%)',
        'radial-gradient(2px 2px at 90% 64%, rgba(255,255,255,0.6) 0%, transparent 100%)'].join(','),
      border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center',
      fontFamily: 'inherit', color: '#F0F4FF',
    }}>
      <p style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(130deg,#FBBF24,#60A5FA 55%,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>🌤️ ดวงฟ้าเปิด</p>
      <p style={{ color: '#E8EDFF', fontSize: '1rem', fontWeight: 700, marginTop: 10 }}>{headline}</p>
      {sub && <p style={{ color: '#6B7AA8', fontSize: '0.8rem', marginTop: 2 }}>{sub}</p>}
      {extra && <p style={{ color: '#8B92B8', fontSize: '0.78rem', marginTop: 4 }}>{extra}</p>}
      <div style={{ color, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', lineHeight: 1, margin: '14px 0 6px' }}>
        <span style={{ fontSize: '4.4rem', fontWeight: 800, letterSpacing: '-0.04em' }}>{value}</span>
        <span style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: 10 }}>%</span>
      </div>
      <p style={{ color: '#8B92B8', fontSize: '0.9rem' }}>{valueLabel}</p>
      {secondary && <p style={{ color: secondary.color, fontSize: '0.95rem', fontWeight: 700, marginTop: 8 }}>{secondary.label} {secondary.value}%</p>}
      {vibe && <span style={{ display: 'inline-block', marginTop: 12, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#A78BFA', padding: '4px 14px', borderRadius: 20, fontSize: '0.8rem' }}>{vibe}</span>}
      <p style={{ color: 'rgba(107,122,168,0.5)', fontSize: '0.64rem', marginTop: 16 }}>เช็คดวงก่อนขึ้นดอยของแกบ้าง 🔮</p>
    </div>
  );
});

// ปุ่มแชร์ปุ่มเดียว — แคป node ที่อ้างด้วย cardRef (ถ้าเครื่องแชร์ไฟล์ไม่ได้ จะบันทึกรูปให้แทน)
export function ShareButtons({ cardRef, filename = 'duang-fah-perd', shareText = 'เช็คดวงฟ้าเปิดก่อนขึ้นดอย 🔮' }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const capture = async () => {
    const node = cardRef.current;
    if (!node) return null;
    return toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: '#070B1A' });
  };

  const download = (dataUrl) => {
    const a = document.createElement('a');
    a.href = dataUrl; a.download = `${filename}.png`; a.click();
  };

  const share = async () => {
    setBusy(true); setMsg('');
    try {
      const dataUrl = await capture();
      if (!dataUrl) return;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${filename}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText });
      } else {
        download(dataUrl);
        setMsg('บันทึกรูปแล้ว เอาไปแชร์ได้เลย 📸');
      }
    } catch (e) {
      if (e?.name !== 'AbortError') setMsg('แชร์ไม่ได้ ลองใหม่อีกครั้งนะ');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <GhostBtn onClick={share} flex>{busy ? '⏳ กำลังทำรูป…' : '📤 แชร์ผล'}</GhostBtn>
      {msg && <p style={{ color: '#6B7AA8', fontSize: '0.72rem', textAlign: 'center' }}>{msg}</p>}
    </div>
  );
}
