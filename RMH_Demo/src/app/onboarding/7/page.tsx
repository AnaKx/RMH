'use client';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/context';

export default function Step7() {
  const router = useRouter();
  const { data } = useWizard();
  const mediaUrl = data[5]?.mediaBlobUrl;

  return (
    <>

      <h1>Review Your Intro Video</h1>
      <p>Take a moment to watch your video. If you're happy with it, you're good to go! Want to make changes? You can record again.</p>

      {mediaUrl && (
        <div style={{ margin: '24px 0' }}>
          <video src={mediaUrl} controls style={{ width: '100%', borderRadius: 8 }} />
        </div>
      )}

      <div>
        <button
          onClick={() => router.push('/onboarding/6')}
          style={{ marginRight: 16 }}
        >
          Re-record Video
        </button>
        <button
          onClick={() => router.push('/onboarding/8')}
        >
          Use This Video
        </button>
      </div>
    </>
  );
}