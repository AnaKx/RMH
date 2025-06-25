'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/context';

type ShotstackResponse = { id: string };

export default function Step8() {
  const router = useRouter();
  const { data, save } = useWizard();
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [progressText, setProgressText] = useState('Uploading and editing your video…');
  const mediaBlobUrl = data[5]?.mediaBlobUrl;

  useEffect(() => {
    (async () => {
      if (!mediaBlobUrl) {
        setError('No video found to process.');
        return;
      }

      try {
        // Upload and trigger edit
        const blobRes = await fetch(mediaBlobUrl);
        const blob = await blobRes.blob();
        const file = new File([blob], 'demo.mp4', { type: 'video/mp4' });

        const formData = new FormData();
        formData.append('video', file);
        formData.append('firstName', data[1]?.firstName || 'John');
        formData.append('lastName', data[1]?.lastName || 'Doe');
        formData.append('role', data[2]?.role || 'Economist');

        const res = await fetch('/api/edit-video', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error(`Shotstack API error: ${res.status}`);
        const result = await res.json();

        
        if (!result?.id) throw new Error('No render job ID returned.');

        setPolling(true);
        setProgressText('Rendering your video…');

        // Poll for render status
        let done = false;
        let tries = 0;
        while (!done && tries < 40) { // approx. 3 mins max
          await new Promise(res => setTimeout(res, 4500));
          tries++;
          const statusRes = await fetch(
            `https://api.shotstack.io/edit/stage/assets/${result.id}`,
            {
              headers: { 'x-api-key': process.env.SHOTSTACK_API_KEY! },
            }
          );
          const statusData = await statusRes.json();
          const status = statusData?.data?.status;
          if (status === 'done' && statusData?.data?.url) {
            save(8, { editedVideo: { video_url: statusData.data.url, id: result.id } });
            router.push('/onboarding/9');
            done = true;
          } else if (status === 'failed') {
            throw new Error('Video rendering failed. Please try again.');
          }
        }

        if (!done) {
          setError('Video processing timed out. Please try again.');
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to edit video. Please try again.');
      } finally {
        setPolling(false);
      }
    })();
  }, [data, router, save]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
      {error ? (
        <>
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
          <button onClick={() => { setError(null); router.refresh(); }} style={{ padding: '0.5rem 1rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Try Again
          </button>
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: '1rem' }}>
            {polling ? progressText : 'Editing your video…'}
          </h2>
          <div style={{ width: '50%', height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: polling ? '60%' : '30%',
              height: '100%',
              background: '#0ea5e9',
              position: 'absolute',
              animation: 'pulse 1.2s infinite ease-in-out'
            }} />
          </div>
          <style>{`
            @keyframes pulse {
              0%   { left: -30%; }
              50%  { left: 50%; }
              100% { left: 100%; }
            }
          `}</style>
          <p style={{ marginTop: 24, color: '#64748b', fontSize: 15 }}>
            {polling && 'Rendering can take a minute or two, depending on queue.'}
          </p>
        </>
      )}
    </div>
  );
}