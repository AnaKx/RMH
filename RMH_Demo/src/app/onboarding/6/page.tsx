'use client';
import React, { useEffect, useRef, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/context';
import { useReactMediaRecorder } from 'react-media-recorder';

export const dynamic = 'force-dynamic';

// Memoized video preview
const VideoPreview = memo(({ stream }: { stream: MediaStream | null }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
});
VideoPreview.displayName = 'VideoPreview';

// Memoized teleprompter auto-scroll
const TeleprompterAuto = memo(({
  text,
  speed,
  recording
}: {
  text: string;
  speed: number;
  recording: boolean;
}) => {
  const tpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number | null = null;
    function step() {
      if (tpRef.current && recording) {
        tpRef.current.scrollTop += speed;
        frameId = requestAnimationFrame(step);
      }
    }
    if (recording) step();
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [recording, speed]);

  return (
    <div ref={tpRef} style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: '50%',
      background: 'rgba(255,255,255,0.8)',
      willChange: 'transform, scrollTop',
      padding: 16,
      overflowY: 'auto',
    }}>
      {text.split('\n').map((line, i) => (
        <p key={i} style={{ margin: '4px 0' }}>{line}</p>
      ))}
    </div>
  );
});
TeleprompterAuto.displayName = 'TeleprompterAuto';

export default function Step6() {
  const router = useRouter();
  const { data, save } = useWizard();
  const script = data[4]?.script || '';

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    onStop: (blobUrl) => {
      save(5, { mediaBlobUrl: blobUrl });
      router.push('/onboarding/7');
    }
  });

  // Ref-based timer display
  const elapsedRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let seconds = 0;
    let interval: NodeJS.Timeout;
    if (status === 'recording') {
      seconds = 0;
      if (elapsedRef.current) {
        elapsedRef.current.textContent = '0:00';
      }
      interval = setInterval(() => {
        seconds++;
        if (elapsedRef.current) {
          const m = Math.floor(seconds / 60);
          const s = String(seconds % 60).padStart(2, '0');
          elapsedRef.current.textContent = `${m}:${s}`;
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  // Speed control
  const speedRef = useRef(1);
  const [, forceUpdate] = React.useReducer(n => n + 1, 0);

  const decSpeed = () => {
    speedRef.current = Math.max(0.1, +(speedRef.current - 0.1).toFixed(1));
    forceUpdate();
  };
  const incSpeed = () => {
    speedRef.current = +(Math.min(5, speedRef.current + 0.1)).toFixed(1);
    forceUpdate();
  };

  return (
    <>
      <h1>Record Your Intro Video</h1>
      <p>Follow the script below. When you’re ready, hit “Start Recording.”</p>

      <div style={{
        position: 'relative',
        width: 640,
        height: 360,
        margin: '0 auto',
        background: '#000',
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        <VideoPreview stream={previewStream} />
        <TeleprompterAuto
          text={script}
          speed={speedRef.current}
          recording={status === 'recording'}
        />
      </div>

      <div style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: 8,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        color: 'white',
        zIndex: 1000,
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={status === 'recording' ? stopRecording : startRecording}
          style={{
            background: status === 'recording' ? '#dc2626' : '#0ea5e9',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 18,
            fontWeight: 600,
            minWidth: 100
          }}
        >
          {status === 'recording' ? '⏹ Stop' : '⏺ Record'}
        </button>
        <span ref={elapsedRef} style={{
          minWidth: 40,
          fontVariantNumeric: 'tabular-nums',
          fontSize: 18
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={decSpeed} style={{
              background: 'transparent',
              border: '1px solid white',
              borderRadius: 4,
              color: 'white',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: 16
            }}>–</button>
          <span style={{ color: 'white', minWidth: 40, textAlign: 'center' }}>
            {speedRef.current.toFixed(1)}×
          </span>
          <button onClick={incSpeed} style={{
              background: 'transparent',
              border: '1px solid white',
              borderRadius: 4,
              color: 'white',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: 16
            }}>+</button>
        </div>
      </div>
    </>
  );
}