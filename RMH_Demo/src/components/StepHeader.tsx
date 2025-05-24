'use client';
import React from 'react';

type StepHeaderProps = {
  steps: string[];
  current: number;
};

export function StepHeader({ steps, current }: StepHeaderProps) {
  return (
    <nav aria-label="Progress" style={{ marginBottom: 24 }}>
      <ol style={{
        display: 'flex',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        gap: 16,
      }}>
        {steps.map((label, i) => {
          const isActive   = i === current;
          const isComplete = i < current;
          return (
            <li key={label} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 32,
                height: 32,
                lineHeight: '32px',
                margin: '0 auto 8px',
                borderRadius: '50%',
                border: `2px solid ${ isActive || isComplete ? '#0ea5e9' : '#cbd5e1' }`,
                background: isComplete ? '#0ea5e9' : 'transparent',
                color: isComplete ? 'white' : isActive ? '#0ea5e9' : '#64748b',
                fontWeight: isActive || isComplete ? 600 : 400,
              }}>
                { isComplete ? '✓' : (i + 1) }
              </div>
              <span style={{
                fontSize: '0.875rem',
                color: isActive ? '#0ea5e9' : '#64748b',
                fontWeight: isActive ? 600 : 400,
              }}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}