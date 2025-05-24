'use client';
import React, { useEffect, useRef } from 'react';

export function Teleprompter({
  text,
  speed = 3,
}: {
  text: string;
  speed?: number;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    // Reset and start smooth scroll
    el.scrollTop = 0;
    let frame: number;
    const step = () => {
      el.scrollTop += speed / 3;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [text, speed]);

  return (
    <div
      ref={container}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
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