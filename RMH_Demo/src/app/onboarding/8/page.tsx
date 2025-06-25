'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/context';

export default function Step8() {
  const router = useRouter();
  const { data, save } = useWizard();
  const [error, setError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [progressText, setProgressText] = useState('Uploading and editing your video…');
  const mediaBlobUrl = data[5]?.mediaBlobUrl;

  useEffect(() => {
    const sessionKey = 'video-rendering';
    if (!mediaBlobUrl) return;
    sessionStorage.removeItem(sessionKey);
    sessionStorage.setItem(sessionKey, 'true');

    let isMounted = true;

    (async () => {
      try {
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

        console.log('Response from /api/edit-video:', res);
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Shotstack API error body:', errorText);
          throw new Error(`Shotstack API error: ${res.status}`);
        }
        const result = await res.json();
        console.log('Full result from /api/edit-video:', result);
        console.log('Render ID returned:', result.id);

        if (!result?.id) throw new Error('No render job ID returned.');

        if (!isMounted) return;
        setPolling(true);
        setProgressText('Rendering your video…');

        let done = false;
        let tries = 0;
        while (!done && tries < 40 && isMounted) {
          await new Promise(res => setTimeout(res, 4500));
          tries++;

          const statusRes = await fetch(
            `https://api.shotstack.io/stage/render/${result.id}`,
            {
              headers: { 'x-api-key': process.env.NEXT_PUBLIC_SHOTSTACK_API_KEY!,
                'Accept': 'application/json'
               },
            }
          );

          const statusData = await statusRes.json();
          console.log('Polling response:', statusData);

          const status = statusData?.response?.status;
          const videoUrl = statusData?.response?.url;

          if (status === 'done' && videoUrl) {
            save(8, { editedVideo: { video_url: videoUrl, id: result.id } });
            window.location.href = videoUrl; // router.push('/onboarding/9')?
            done = true;
          } else if (status === 'failed') {
            throw new Error('Video rendering failed. Please try again.');
          }
        }

        if (!done && isMounted) {
          setError('Video processing timed out. Please try again.');
        }
      } catch (err: any) {
          console.error('Caught error in video editing flow:', err);
          if (isMounted) setError(`Failed to edit video: ${err.message || err}`);
      } finally {
        sessionStorage.removeItem(sessionKey);
        if (isMounted) setPolling(false);
      }
    })();

    return () => { isMounted = false; };
  }, [mediaBlobUrl, data, save, router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
      {error ? (
        <>
          <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => {
              setError(null);
              router.refresh();
            }}
            style={{ padding: '0.5rem 1rem', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Try Again
          </button>
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: '1rem' }}>
            {polling ? progressText : 'Editing your video…'}
          </h2>
          <div
            style={{ width: '50%', height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', position: 'relative' }}
          >
            <div
              style={{
                width: polling ? '60%' : '30%',
                height: '100%',
                background: '#0ea5e9',
                position: 'absolute',
                animation: 'pulse 1.2s infinite ease-in-out',
              }}
            />
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