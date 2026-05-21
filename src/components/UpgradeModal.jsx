import React, { useState } from 'react';
import { saveLicense } from '../licensing/license';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

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
  padding: '2.5rem 2rem',
  maxWidth: '420px', width: '100%',
  boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
  color: 'white',
  fontFamily: 'var(--font-sans, sans-serif)',
};

const btnPrimary = {
  width: '100%', padding: '0.9rem',
  background: 'linear-gradient(135deg,#3b82f6,#9333ea)',
  color: 'white', border: 'none', borderRadius: '12px',
  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
  marginTop: '1.25rem',
};

const btnSecondary = {
  width: '100%', padding: '0.75rem',
  background: 'transparent',
  color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px', fontSize: '0.9rem', cursor: 'pointer',
  marginTop: '0.75rem',
};

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// --- Offline gate view ---
function OfflineGate({ onRetry, onDismiss }) {
  return (
    <div style={card}>
      <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>📡</div>
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.3rem' }}>
        No Internet Connection
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        An internet connection is required to unlock premium problems. Once unlocked, everything works offline.
      </p>
      <button style={btnPrimary} onClick={onRetry}>Retry Connection</button>
      <button style={btnSecondary} onClick={onDismiss}>Continue with free problems</button>
    </div>
  );
}

// --- Paywall view ---
function PaywallGate({ onDismiss, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error('Could not load payment SDK. Please check your connection.');

      // 1. Create order on backend
      const orderRes = await fetch(`${BACKEND_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'pro' }),
      });
      if (!orderRes.ok) throw new Error('Failed to create order. Please try again.');
      const order = await orderRes.json();

      // 2. Open Razorpay checkout
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: RAZORPAY_KEY,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: 'OffCode',
          description: 'Pro — Unlock all 75 problems',
          theme: { color: '#3b82f6' },
          handler: async (response) => {
            try {
              // 3. Verify payment and get license JWT
              const verifyRes = await fetch(`${BACKEND_URL}/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  tier: 'pro',
                }),
              });
              if (!verifyRes.ok) throw new Error('Payment verification failed.');
              const { license } = await verifyRes.json();
              saveLicense(license);
              resolve();
              onSuccess();
            } catch (err) {
              reject(err);
            }
          },
          modal: { ondismiss: () => reject(new Error('cancelled')) },
        });
        rzp.open();
      });
    } catch (err) {
      if (err.message !== 'cancelled') setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Premium Problem</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          You've reached the free limit (5 problems).
        </p>
      </div>

      <div style={{
        background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '0.75rem',
      }}>
        <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          OffCode Pro — ₹150/month
        </div>
        {[
          '✅ Unlock all 75 Blind 75 problems',
          '✅ Full offline access after activation',
          '✅ Progress saved locally forever',
          '✅ Python & JavaScript for every problem',
        ].map(line => (
          <div key={line} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.4rem' }}>
            {line}
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.25)',
        borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '0.5rem', right: '0.75rem',
          background: 'rgba(168,85,247,0.3)', color: '#d8b4fe',
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em',
          padding: '0.15rem 0.5rem', borderRadius: '999px',
        }}>
          COMING SOON
        </div>
        <div style={{ fontWeight: 700, color: '#a855f7', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          OffCode Elite — ₹250/month
        </div>
        {[
          '🚀 500+ curated problems',
          '🏢 Company-specific coding round prep',
          '🎯 Interview tracks for top companies',
          '⚡ Everything in Pro, and more',
        ].map(line => (
          <div key={line} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.4rem' }}>
            {line}
          </div>
        ))}
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <button style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handleUpgrade} disabled={loading}>
        {loading ? 'Processing…' : 'Upgrade to Pro — ₹150/month'}
      </button>
      <button style={btnSecondary} onClick={onDismiss}>Maybe Later</button>
    </div>
  );
}

// --- Main modal ---
export default function UpgradeModal({ onDismiss, onSuccess }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleRetry = () => setIsOnline(navigator.onLine);

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onDismiss()}>
      {isOnline
        ? <PaywallGate onDismiss={onDismiss} onSuccess={onSuccess} />
        : <OfflineGate onRetry={handleRetry} onDismiss={onDismiss} />
      }
    </div>
  );
}
