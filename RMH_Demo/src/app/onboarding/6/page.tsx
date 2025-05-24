'use client';
import { useRouter } from 'next/navigation';
import { StepHeader } from '@/components/StepHeader';
import { ONBOARDING_STEPS } from '@/constants/steps';
import { useWizard } from '@/lib/context';
import { useReactMediaRecorder } from 'react-media-recorder';

export default function Step6() {
  const router = useRouter();
  const { data, save } = useWizard();
  const script = data[4]?.script || '';

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    onStop: (blobUrl) => {
      save(5, { mediaBlobUrl: blobUrl });
      router.push('/onboarding/7');
    }
  });

  return (
    <>

      <h1>Record Your Intro Video</h1>
      <p>Follow the script below. When you’re ready, hit “Start Recording.”</p>

      <div style={{
        maxHeight: 200,
        overflowY: 'auto',
        padding: 16,
        background: '#f1f5f9',
        borderRadius: 8,
        margin: '24px 0',
        lineHeight: 1.5,
      }}>
        {script.split('\n').map((line, i) => (
          <p key={i} style={{ margin: '8px 0' }}>{line}</p>
        ))}
      </div>

      <button
        onClick={status === 'recording' ? stopRecording : startRecording}
        style={{
          background: status === 'recording' ? '#dc2626' : '#0ea5e9',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          marginRight: 16,
        }}
      >
        {status === 'recording' ? 'Stop Recording' : 'Start Recording'}
      </button>
      <span>Status: {status}</span>
    </>
  );
}