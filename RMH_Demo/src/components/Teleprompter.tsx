'use client';
import React, { useEffect, useRef, useState } from 'react';

export function Teleprompter({
  text,
  speed = 65,
}: {
  text: string;
  speed?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    const keyDownTextField = (e: KeyboardEvent) => {
      if (e.key === '`') {
        e.preventDefault();
        setPlay(p => !p);
      }
    };
    window.addEventListener('keydown', keyDownTextField);
    return () => {
      window.removeEventListener('keydown', keyDownTextField);
    };
  }, []);

  // Scroll logic using setInterval
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    el.scrollTop = 0;
    const interval = setInterval(() => {
      if (!play) return;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight) {
        el.scrollTop = 0;
      } else {
        el.scrollTop = scrollTop + 1;
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, play, speed]);

  return (
    <div
      ref={container}
      style={{
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        overflowY: 'hidden',
        padding: 16,
        background: 'rgba(17,17,17,0.9)',
        color: '#0f0',
        fontFamily: 'monospace',
        lineHeight: 1.5,
        zIndex: 10,
      }}
    >
      {text.split('\n').map((line, i) => (
        <p key={i} style={{ margin: '8px 0' }}>
          {line}
        </p>
      ))}
    </div>
  );
}