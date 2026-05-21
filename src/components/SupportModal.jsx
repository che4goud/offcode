import React from 'react';

const overlay = {
  position: 'fixed', inset: 0, zIndex: 1000,
  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '1rem',
};

const card = {
  background: 'rgba(11,14,20,0.97)',
  border: '1px solid rgba(59,130,246,0.25)',
  borderRadius: '20px',
  padding: '2rem',
  maxWidth: '340px', width: '100%',
  boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
  color: 'white',
  fontFamily: 'var(--font-sans, sans-serif)',
  textAlign: 'center',
};

export default function SupportModal({ onDismiss }) {
  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onDismiss()}>
      <div style={card}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☕</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' }}>Support OffCode</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          If OffCode helped you crack an interview, buy me a coffee! Every contribution keeps this project alive.
        </p>
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '1rem', display: 'inline-block', marginBottom: '1.25rem',
        }}>
          <img src="/upi-qr.png" alt="UPI QR Code" width={160} height={160} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
          Scan with GPay, PhonePe, Paytm, or any UPI app
        </p>
        <button
          onClick={onDismiss}
          style={{
            width: '100%', padding: '0.75rem',
            background: 'transparent', color: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
            fontSize: '0.9rem', cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
