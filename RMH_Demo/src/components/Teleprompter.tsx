'use client';
import React, { useEffect, useRef, useState, CSSProperties } from 'react';

export function Teleprompter({
  text,
  speed = 65,
  style,
}: {
  text: string;
  speed?: number;
  style?: CSSProperties;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault();
        setPlay((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const el = container.current!;
    el.scrollTop = 0;
    const tick = () => {
      if (!play) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      el.scrollTop =
        scrollTop + clientHeight >= scrollHeight ? 0 : scrollTop + 1;
    };
    const iv = setInterval(tick, speed);
    return () => clearInterval(iv);
  }, [text, play, speed]);

  return (
    <div
      ref={container}
      style={{
        overflow: 'hidden',
        padding: 16,
        background: 'rgba(17,17,17,0.6)',
        color: '#0f0',
        fontSize: '12rem',
        fontFamily: 'monospace',
        lineHeight: '14rem',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {text.split('\n').map((l, i) => (
        <p key={i} style={{ margin: '8px 0' }}>
          {l}
        </p>
      ))}
    </div>
  );
}