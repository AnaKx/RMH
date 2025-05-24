'use client';
export const dynamic = 'force-dynamic';

import dynamicClient from 'next/dynamic';
const ClientStep6 = dynamicClient(() => import('./ClientStep6'), { ssr: false });

export default function Step6Page() {
  return <ClientStep6 />;
}