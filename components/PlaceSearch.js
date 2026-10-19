'use client';
import { useEffect, useRef, useState } from 'react';
import { IN } from './ui';
import { searchPlaces } from '@/lib/api';

// ช่องค้นสถานที่แบบ autocomplete (คล้าย Google Maps)
// onSelect รับ { name, admin1, country, lat, lng }
export default function PlaceSearch({ selected, onSelect, placeholder }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hi, setHi] = useState(-1);
  const boxRef = useRef(null);

  // debounce ~300ms
  useEffect(() => {
    if (!q || q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try { setResults(await searchPlaces(q)); setOpen(true); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  // คลิกนอกกรอบ → ปิด
  useEffect(() => {
    const h = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const choose = (r) => {
    onSelect(r);
    setQ(r.name);
    setOpen(false);
    setHi(-1);
  };

  const onKey = (e) => {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && hi >= 0) { e.preventDefault(); choose(results[hi]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  const display = q || selected?.name || '';

  return (
    <div ref={boxRef} style={{ position: 'relative' }}>
      <input
        style={IN}
        placeholder={placeholder || 'พิมพ์ชื่อดอย/ภูเขา เช่น ดอยอินทนนท์'}
        value={display}
        onChange={(e) => { setQ(e.target.value); onSelect(null); }}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={onKey}
        autoComplete="off"
      />
      {loading && <span style={{ position: 'absolute', right: 14, top: 14, fontSize: '0.75rem', color: '#6B7AA8' }}>…</span>}
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, background: '#0C1226', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, overflow: 'hidden', zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          {results.map((r, i) => (
            <button
              key={`${r.name}-${r.lat}-${i}`}
              onClick={() => choose(r)}
              onMouseEnter={() => setHi(i)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: hi === i ? 'rgba(96,165,250,0.12)' : 'transparent', color: '#E8EDFF', fontFamily: 'inherit', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '0.95rem' }}>{r.preset ? '⛰️' : '📍'}</span>
              <span style={{ flex: 1 }}>
                <span style={{ fontSize: '0.92rem' }}>{r.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7AA8', marginLeft: 6 }}>
                  {[r.admin1, r.country].filter(Boolean).join(' · ')}
                </span>
              </span>
              {r.preset && <span style={{ fontSize: '0.68rem', color: '#A78BFA' }}>ยอดฮิต</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
