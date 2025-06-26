'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage'; // or whatever you use for state

export default function Step9() {
  /*const router = useRouter();
  const [data] = useLocalStorage('formData', {}); // adjust if your hook is different
  const videoUrl = data[]?.editedVideo?.video_url;

  useEffect(() => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'edited-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [videoUrl]);

  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <div style={{
        width: 80, height: 80, margin: '0 auto 24px', borderRadius: '50%',
        background: '#16a34a', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '2rem', color: 'white',
      }}>
        ✓
      </div>
      <h1 style={{ marginBottom: 16 }}>You’re All Set!</h1>
      <p style={{ marginBottom: 32, color: '#475569' }}>
        Your video looks great and your profile is now more engaging than ever.
        You’re one step closer to connecting with the right mentees.
      </p>

      <button
        className="btn btn-primary"
        onClick={() => router.push('/onboarding/1')} 
      >
        Continue
      </button>
    </div>
  );*/
}