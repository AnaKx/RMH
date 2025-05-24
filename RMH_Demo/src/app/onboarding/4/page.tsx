'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/context';

export default function Step4() {
  const router = useRouter();
  const { data, save } = useWizard(); 
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/generate-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ form: data }),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const { script } = await res.json();
        save('4', { script });
        router.push('/onboarding/5');
      } catch (err: any) {
        console.error(err);
        setError('Failed to generate script. Please try again.');
      }
    })();
  }, [data, router, save]);

  return (
    <>

      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center',
      }}>
        {error ? (
          <>
            <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={() => {
                setError(null);
                router.refresh();
              }}
              style={{
                padding: '0.5rem 1rem',
                background: '#0ea5e9',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <h2 style={{ marginBottom: '1rem' }}>Generating your script…</h2>
            <div style={{
              width:        '50%',
              height:       8,
              background:   '#e2e8f0',
              borderRadius: 4,
              overflow:     'hidden',
              position:     'relative',
            }}>
              <div style={{
                width:      '30%',
                height:     '100%',
                background: '#0ea5e9',
                position:   'absolute',
                animation:  'pulse 1.2s infinite ease-in-out',
              }} />
            </div>
            <style>{`
              @keyframes pulse {
                0%   { left: -30%; }
                50%  { left: 50%; }
                100% { left: 100%; }
              }
            `}</style>
          </>
        )}
      </div>
    </>
  );
}