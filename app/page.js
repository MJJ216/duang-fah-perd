'use client';
import { useState } from 'react';
import SinForm from '@/components/SinForm';
import SinResult from '@/components/SinResult';
import TripForm from '@/components/TripForm';
import TripResult from '@/components/TripResult';
import PairForm from '@/components/PairForm';
import PairResult from '@/components/PairResult';
import History from '@/components/History';
import PrivacyModal from '@/components/PrivacyModal';

export default function Home() {
  const [tab, setTab] = useState('sin');
  const [sinRes, setSR] = useState(null);
  const [tripRes, setTR] = useState(null);
  const [pairRes, setPR] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const sw = (t) => { setTab(t); setSR(null); setTR(null); setPR(null); };

  const TABS = [
    { id: 'sin', l: '😈 ความบาป' },
    { id: 'trip', l: '⛺ ทริป' },
    { id: 'pair', l: '👯 คู่หู' },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#070B1A' }}>
      <PrivacyModal />
      {showHistory && <History onClose={() => setShowHistory(false)} />}

      {/* Header */}
      <div style={{ padding: '44px 24px 28px', textAlign: 'center', position: 'relative', background: ['radial-gradient(ellipse at 50% -10%, #18306a 0%, #070B1A 60%)', 'radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,0.75) 0%, transparent 100%)', 'radial-gradient(1px 1px at 78% 18%, rgba(255,255,255,0.55) 0%, transparent 100%)', 'radial-gradient(2px 2px at 92% 60%, rgba(255,255,255,0.65) 0%, transparent 100%)', 'radial-gradient(1px 1px at 35% 70%, rgba(255,255,255,0.40) 0%, transparent 100%)'].join(',') }}>
        <button onClick={() => setShowHistory(true)} aria-label="ประวัติ" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#C7D0F0', width: 38, height: 38, borderRadius: 10, cursor: 'pointer', fontSize: '1.1rem' }}>📜</button>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(130deg,#FBBF24 0%,#60A5FA 55%,#A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>🌤️ ดวงฟ้าเปิด</h1>
        <p style={{ color: '#6B7AA8', fontSize: '0.88rem', marginTop: 8 }}>เช็คก่อนขึ้นดอย · ดวงแกไม่ดีอย่าไปยั่วเมฆ ☁️</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, margin: '0 16px', padding: 4, flexShrink: 0 }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => sw(t.id)} style={{ flex: 1, padding: '10px 8px', border: 'none', fontFamily: 'inherit', fontSize: '0.86rem', fontWeight: 600, borderRadius: 9, cursor: 'pointer', transition: 'all .15s', background: tab === t.id ? 'linear-gradient(135deg,#1A3060,#1A2040)' : 'transparent', color: tab === t.id ? '#60A5FA' : '#6B7AA8', boxShadow: tab === t.id ? '0 2px 10px rgba(96,165,250,0.12)' : 'none' }}>{t.l}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 16px 8px' }}>
        {tab === 'sin' && (sinRes ? <SinResult result={sinRes} onReset={() => setSR(null)} /> : <SinForm onResult={setSR} />)}
        {tab === 'trip' && (tripRes ? <TripResult result={tripRes} onReset={() => setTR(null)} /> : <TripForm onResult={setTR} />)}
        {tab === 'pair' && (pairRes ? <PairResult result={pairRes} onReset={() => setPR(null)} /> : <PairForm onResult={setPR} />)}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 8 }}>
        <p style={{ color: 'rgba(107,122,168,0.55)', fontSize: '0.7rem', lineHeight: 1.7 }}>🔮 ทำเพื่อความสนุก อย่าซีเรียสเกินไปนะ<br />แต่หลักโหราศาสตร์ที่ใช้เป็นของจริงนะเว้ย</p>
      </div>
    </div>
  );
}
