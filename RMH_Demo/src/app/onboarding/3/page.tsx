'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import '@/globals.css';

export default function Step3() {
  const router = useRouter();
  const handleContinue = () => {
    router.push('/onboarding/4');
  };

  const bulletPoints = [
    'Builds trust with mentees',
    'Showcases your personality and communication style',
    'Script provided for guidance',
    'Record right from your phone or laptop',
  ];

  return (
    <>
    <div className='center-content'>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Bring Your Profile to Life with a Short Intro Video
      </h1>
      <p style={{ marginBottom: '1.5rem', color: '#475569' }}>
        Let potential mentees get to know the real you. A short video helps build trust,
        highlight your expertise, and make your profile stand out. Don’t worry — we’ll
        guide you with an AI-generated script based on your profile info.
      </p>

      <div
      >
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {bulletPoints.map((point, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: i < bulletPoints.length - 1 ? '0.75rem' : 0,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  background: '#0ea5e9',
                  color: 'white',
                  marginRight: '0.75rem',
                  fontSize: '0.875rem',
                }}
              >
                ✓
              </span>
              <span style={{ color: '#1e293b' }}>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleContinue} className="button">
        Continue
      </button>
      </div>
    </>
    
  );
}