'use client';

import React, { useEffect, useRef, memo, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard } from '@/lib/context';
import { useReactMediaRecorder } from 'react-media-recorder';

// VideoPreview stays the same...
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );
});
VideoPreview.displayName = 'VideoPreview';

// TeleprompterAuto: remove absolute positioning so it lives in its container
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
  const [play, setPlay] = useState(true);
  const speedRefLocal = useRef(speed);
  useEffect(() => {
    speedRefLocal.current = speed;
  }, [speed]);

  useEffect(() => {
    const el = tpRef.current;
    if (!el) return;
    el.scrollTop = 0;
    // Handler for toggling play on backtick
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault();
        setPlay(p => !p);
      }
    };
    window.addEventListener('keydown', handleKey);

    let currentScroll = 0;
    const scrollFn = () => {
      if (!play) return;
      currentScroll = el.scrollTop;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        el.scrollTop = 0;
      } else {
        el.scrollTop = currentScroll + 1;
      }
    };
    const interval = setInterval(scrollFn, speedRefLocal.current);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKey);
    };
  }, [text, play]);

  return (
    <div
      ref={tpRef}
      style={{
        height: '100%',
        overflowY: 'auto',
        background: 'transparent',
        color: 'black',
        fontSize: '1.2rem',
        fontFamily: 'monospace',
        lineHeight: 1.5,
      }}
    >
      {text.split('\n').map((line, i) => (
        <p key={i} style={{ margin: '8px 0' }}>{line}</p>
      ))}
    </div>
  );
});
TeleprompterAuto.displayName = 'TeleprompterAuto';

export default function ClientStep6() {
  const router = useRouter();
  const { data, save } = useWizard();
  const script = data[4]?.script || '';

  const { status, startRecording, stopRecording, previewStream } =
    useReactMediaRecorder({
      video: true,
      audio: true,
      onStop: (blobUrl) => {
        save(5, { mediaBlobUrl: blobUrl });
        router.push('/onboarding/7');
      },
    });

  // Timer via ref...
  const elapsedRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
let seconds = 0;
  let interval: NodeJS.Timeout;
  if (status === 'recording') {
    if (elapsedRef.current) elapsedRef.current.textContent = '0:00';
    // Count once every real second (1000ms) so MM:SS matches real time
    interval = setInterval(() => {
      seconds++;
      if (elapsedRef.current) {
        const m = Math.floor(seconds / 60);
        const s = String(seconds % 60).padStart(2, '0');
        elapsedRef.current.textContent = `${m}:${s}`;
      }
    }, 1000);
  }
 return () => void clearInterval(interval);
  }, [status]);

  // Speed controls
  const speedRef = useRef(65);
  const [, forceUpdate] = useReducer(n => n + 1, 0);
  const decSpeed = () => {
    speedRef.current = Math.max(1, speedRef.current - 1);
    forceUpdate();
  };
  const incSpeed = () => {
    speedRef.current = speedRef.current + 1;
    forceUpdate();
  };

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: 'calc(100vh - 120px)',
          margin: 0,
          borderRadius: 0,
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {/* camera feed */}
        <VideoPreview stream={previewStream || null} />

        {/* teleprompter overlay */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '30%',
          right: '30%',
          height: '30%',
          background: 'rgba(255, 255, 255, 0.4)',
          pointerEvents: 'none',
          padding: '8px 16px',
          boxSizing: 'border-box',
          borderRadius: '8px',
        }}>
          <TeleprompterAuto
            text={script}
            speed={speedRef.current}
            recording={status === 'recording'}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#001434',
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
            background: status === 'recording' ? '#dc2626' : '#001434',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: 12,
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
      </div>
    </>
  );
}