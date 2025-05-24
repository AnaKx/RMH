'use client';

import React, { useEffect, useRef, memo, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/context';
import { useReactMediaRecorder } from 'react-media-recorder';

// 1) Video preview that binds the MediaStream to a <video> tag
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

// 2) Teleprompter auto-scroll
const TeleprompterAuto = memo(({
  text,
  speed,
  recording,
}: {
  text: string;
  speed: number;
  recording: boolean;
}) => {
  const tpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number | null = null;
    const step = () => {
      if (tpRef.current && recording) {
        tpRef.current.scrollTop += speed;
        frameId = requestAnimationFrame(step);
      }
    };
    if (recording) step();
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [recording, speed]);

  return (
    <div
      ref={tpRef}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '50%',
        background: 'rgba(255,255,255,0.8)',
        willChange: 'scrollTop',
        padding: 16,
        overflowY: 'auto',
      }}
    >
      {text.split('\n').map((line, i) => (
        <p key={i} style={{ margin: '4px 0' }}>{line}</p>
      ))}
    </div>
  );
});
TeleprompterAuto.displayName = 'TeleprompterAuto';

export default function ClientStep6() {
  const router = useRouter();
  const { data, save } = useWizard();
  const script = data[4]?.script || '';

  // 3) Recording hook
  const {
    status,
    startRecording,
    stopRecording,
    previewStream,
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    onStop: (blobUrl) => {
      save(5, { mediaBlobUrl: blobUrl });
      router.push('/onboarding/7');
    },
  });

  // 4) Elapsed timer via ref (no React state to avoid re-renders)
  const elapsedRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let seconds = 0;
    let interval: NodeJS.Timeout;
    if (status === 'recording') {
      if (elapsedRef.current) elapsedRef.current.textContent = '0:00';
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
      clearInterval(interval);
    };
  }, [status]);

  // 5) Speed controls using a ref + forced update
  const speedRef = useRef(1);
  const [, forceUpdate] = useReducer(n => n + 1, 0);
  const decSpeed = () => {
    speedRef.current = Math.max(0.1, +(speedRef.current - 0.1).toFixed(1));
    forceUpdate();
  };
  const incSpeed = () => {
    speedRef.current = Math.min(5, +(speedRef.current + 0.1).toFixed(1));
    forceUpdate();
  };

  return (
    <>
      <h1>Record Your Intro Video</h1>
      <p>Follow the script below. When you’re ready, hit “Start Recording.”</p>

      <div
        style={{
          position: 'relative',
          width: 640,
          height: 360,
          margin: '0 auto',
          background: '#000',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <VideoPreview stream={previewStream || null} />
        <TeleprompterAuto
          text={script}
          speed={speedRef.current}
          recording={status === 'recording'}
        />
      </div>

      <div
        style={{
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
        }}
      >
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
          }}
        >
          {status === 'recording' ? '⏹ Stop' : '⏺ Record'}
        </button>

        <span
          ref={elapsedRef}
          style={{ minWidth: 40, fontVariantNumeric: 'tabular-nums', fontSize: 18 }}
        />

        <button onClick={decSpeed} style={{ color: 'white', fontSize: 18 }}>–</button>
        <span style={{ color: 'white' }}>{speedRef.current.toFixed(1)}×</span>
        <button onClick={incSpeed} style={{ color: 'white', fontSize: 18 }}>+</button>
      </div>
    </>
  );
}