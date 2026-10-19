'use client';
import { useState } from 'react';
import { Modal, GhostBtn } from './ui';
import { sinCol, skyCol, MONTHS_TH } from '@/lib/astro';
import { loadHistory, leaderboard, clearHistory } from '@/lib/storage';

const fmtTs = (ts) => {
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS_TH[d.getMonth()]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export default function History({ onClose }) {
  const [tab, setTab] = useState('history');
  const [, force] = useState(0);
  const history = loadHistory();
  const board = leaderboard();

  const wipe = () => { clearHistory(); force((x) => x + 1); };

  return (
    <Modal onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>📜 ของแก๊ง</h2>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#6B7AA8', fontSize: '1.3rem', cursor: 'pointer' }}>×</button>
      </div>

      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 3, marginBottom: 14 }}>
        {[{ id: 'history', l: '📜 ประวัติ' }, { id: 'board', l: '🏆 Leaderboard' }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: tab === t.id ? 'linear-gradient(135deg,#1A3060,#1A2040)' : 'transparent', color: tab === t.id ? '#60A5FA' : '#6B7AA8' }}>{t.l}</button>
        ))}
      </div>

      {tab === 'history' ? (
        history.length === 0 ? <Empty text="ยังไม่มีประวัติ ลองเช็คดวงดูก่อน 🔮" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ fontSize: '1.1rem' }}>{e.kind === 'sin' ? '😈' : e.kind === 'trip' ? '⛺' : '👯'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.88rem', color: '#E8EDFF' }}>
                    {e.kind === 'sin' ? `${e.nickname} · ${e.sinLabel || ''}` : e.kind === 'trip' ? e.location : 'ดวงคู่หู'}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#6B7AA8' }}>{fmtTs(e.ts)}</p>
                </div>
                {e.kind === 'sin' && <span style={{ color: sinCol(e.sin), fontWeight: 700, fontSize: '0.9rem' }}>บาป {e.sin}%</span>}
                {e.kind === 'trip' && <span style={{ color: skyCol(e.avgSky), fontWeight: 700, fontSize: '0.9rem' }}>ฟ้า {e.avgSky}%</span>}
              </div>
            ))}
          </div>
        )
      ) : (
        board.length === 0 ? <Empty text="ยังไม่มีใครในกระดาน — ชวนเพื่อนมาเช็คบาป 😈" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {board.map((e, i) => (
              <div key={e.nickname} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < board.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ fontSize: '1.1rem', width: 26 }}>{i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.92rem', color: '#E8EDFF' }}>{e.nickname}</p>
                  <p style={{ fontSize: '0.72rem', color: '#6B7AA8' }}>{e.zodiac} · ธาตุ{e.element}</p>
                </div>
                <span style={{ color: sinCol(e.sin), fontWeight: 800, fontSize: '1.05rem' }}>{e.sin}%</span>
              </div>
            ))}
            <p style={{ color: 'rgba(107,122,168,0.5)', fontSize: '0.68rem', textAlign: 'center', marginTop: 6 }}>คนบาปสุด = คนที่ทำให้ฟ้าปิดบ่อยสุด 😂</p>
          </div>
        )
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <GhostBtn onClick={wipe}>🗑️ ล้างประวัติทั้งหมด</GhostBtn>
        </div>
      )}
    </Modal>
  );
}

const Empty = ({ text }) => <p style={{ color: '#6B7AA8', fontSize: '0.88rem', textAlign: 'center', padding: '24px 0' }}>{text}</p>;
