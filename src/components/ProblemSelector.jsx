import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, CheckCircle } from 'lucide-react';

const DIFFICULTY_COLOR = {
  Easy: '#10b981',
  Medium: '#f59e0b',
  Hard: '#ef4444',
};

const TOPIC_COLOR = {
  'Arrays': '#3b82f6',
  'Sliding Window': '#8b5cf6',
  'String': '#ec4899',
  'Trees': '#10b981',
  'Trie': '#06b6d4',
  'Heap': '#f59e0b',
  'Graphs': '#f97316',
  'Dynamic Programming': '#a855f7',
  'Intervals': '#14b8a6',
  'Linked List': '#6366f1',
  'Matrix': '#84cc16',
  'Bit Manipulation': '#94a3b8',
};

export default function ProblemSelector({ problems, currentIndex, solvedSet, onSelect }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const current = problems[currentIndex];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        const portal = document.getElementById('problem-selector-portal');
        if (portal && portal.contains(e.target)) return;
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    };
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open]);

  // Focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch('');
  }, [open]);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
    setOpen(o => !o);
  };

  const filtered = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.topic.toLowerCase().includes(search.toLowerCase()) ||
    p.difficulty.toLowerCase().includes(search.toLowerCase())
  );

  const solved = solvedSet.size;
  const total = problems.length;
  const pct = Math.round((solved / total) * 100);

  const dropdown = open && ReactDOM.createPortal(
    <div
      id="problem-selector-portal"
      style={{
        position: 'fixed',
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: Math.max(dropdownPos.width, 420),
        background: '#0f1319',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        zIndex: 9999,
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar + stats */}
      <div style={{ padding: '0.75rem 1rem 0.6rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
          <span>Progress</span>
          <span style={{ color: '#10b981' }}>{solved} / {total} solved</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#10b981,#3b82f6)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <input
          ref={searchRef}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, topic, difficulty..."
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
            padding: '0.45rem 0.7rem', color: 'white', fontSize: '0.83rem',
            outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Problem list */}
      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
            No problems match
          </div>
        )}
        {filtered.map((p) => {
          const idx = problems.indexOf(p);
          const isSolved = solvedSet.has(p.id);
          const isActive = idx === currentIndex;

          return (
            <div
              key={p.id}
              onClick={() => { onSelect(idx); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.55rem 1rem', cursor: 'pointer',
                background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? 'rgba(59,130,246,0.12)' : 'transparent'; }}
            >
              {/* Status icon */}
              <div style={{ width: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isSolved
                  ? <CheckCircle size={14} color="#10b981" />
                  : <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)' }} />
                }
              </div>

              {/* Number */}
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', width: '24px', flexShrink: 0, textAlign: 'right' }}>
                {idx + 1}.
              </span>

              {/* Title */}
              <span style={{ flex: 1, fontSize: '0.85rem', color: isActive ? 'white' : 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.title}
              </span>

              {/* Topic chip */}
              <span style={{
                fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px',
                background: `${TOPIC_COLOR[p.topic] || '#94a3b8'}20`,
                color: TOPIC_COLOR[p.topic] || '#94a3b8',
                flexShrink: 0, fontWeight: 500, whiteSpace: 'nowrap',
              }}>
                {p.topic}
              </span>

              {/* Difficulty chip */}
              <span style={{
                fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px',
                background: `${DIFFICULTY_COLOR[p.difficulty]}20`,
                color: DIFFICULTY_COLOR[p.difficulty],
                flexShrink: 0, fontWeight: 600,
              }}>
                {p.difficulty}
              </span>
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  );

  return (
    <div ref={triggerRef} style={{ position: 'relative', minWidth: '300px' }}>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px', padding: '0.45rem 0.75rem', cursor: 'pointer',
          color: 'white', fontSize: '0.88rem', fontFamily: 'var(--font-sans)',
          transition: 'all 0.15s',
        }}
      >
        {/* Progress ring */}
        <svg width="22" height="22" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
          <circle
            cx="11" cy="11" r="9" fill="none"
            stroke="#10b981" strokeWidth="2.5"
            strokeDasharray={`${2 * Math.PI * 9}`}
            strokeDashoffset={`${2 * Math.PI * 9 * (1 - pct / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 11 11)"
            style={{ transition: 'stroke-dashoffset 0.4s ease' }}
          />
          <text x="11" y="15" textAnchor="middle" fontSize="7" fill="#10b981" fontWeight="700">
            {pct}%
          </text>
        </svg>

        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: '0.3rem' }}>{currentIndex + 1}.</span>
          {current.title}
        </span>

        <span style={{
          fontSize: '0.72rem', fontWeight: 600, padding: '0.1rem 0.4rem',
          borderRadius: '4px', color: DIFFICULTY_COLOR[current.difficulty],
          background: `${DIFFICULTY_COLOR[current.difficulty]}20`, flexShrink: 0,
        }}>
          {current.difficulty}
        </span>

        <ChevronDown
          size={14}
          style={{ flexShrink: 0, opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {dropdown}
    </div>
  );
}
