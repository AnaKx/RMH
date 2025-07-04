'use client';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/context';
import '@/globals.css';

export default function Step5() {
  const router = useRouter();
  const { data } = useWizard();
  const script = data[4]?.script || '';

  return (
    <>
    <div className='center-content'>
      <h1>Your Script Is Ready. Let’s Record!</h1>
      <p style={{ marginBottom: 24 }}>
        Start recording your video now—here are a few suggestions.
        Your video should be around 60–90 seconds.
      </p>

      <div className="script-card">
          {script.split('\n\n').map((para: string, i: number) => (
          <p key={i} style={{ marginBottom: i < script.split('\n\n').length - 1 ? 16 : 0 }}>
            {para}
          </p>
        ))}
      </div>

      <button onClick={() => router.push('/onboarding/6')} className="button">
        Start Recording
      </button>
      </div>
    </>
  );
}