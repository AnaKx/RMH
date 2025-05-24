'use client';
import { useRouter } from 'next/navigation';

export default function Step8() {
  const router = useRouter();

  return (
    <>


      <div style={{
        textAlign: 'center',
        padding: '4rem 1rem',
      }}>
        <div style={{
          width: 80,
          height: 80,
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: '#16a34a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: 'white',
        }}>
          ✓
        </div>
        <h1 style={{ marginBottom: 16 }}>You’re All Set!</h1>
        <p style={{ marginBottom: 32, color: '#475569' }}>
          Your video looks great and your profile is now more engaging than ever.
          You’re one step closer to connecting with the right mentees.
        </p>
        <button
          onClick={() => router.push('/onboarding/1')} 
        >
          Continue
        </button>
      </div>
    </>
  );
}