'use client';
import React, { useEffect, useRef } from 'react';

export function Teleprompter({ text }: { text: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    // Reset and start smooth scroll
    el.scrollTop = 0;
    let frame: number;
    const step = () => {
      el.scrollTop += 1;  
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [text]);

  return (
    <div
      ref={container}
      style={{
        maxHeight: 200,
        overflowY: 'hidden',
        padding: 16,
        background: '#111',
        color: '#0f0',
        fontFamily: 'monospace',
        lineHeight: 1.5,
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