import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('id');
  if (!jobId) return NextResponse.json({ error: 'No job ID' }, { status: 400 });

  const statusRes = await fetch(`https://api.shotstack.io/edit/stage/renders/${jobId}`, {
    headers: {
      'x-api-key': process.env.SHOTSTACK_API_KEY || '',
    },
  });
  const statusData = await statusRes.json();

  // Adjust this to match Shotstack's real status/response structure
  return NextResponse.json({
    status: statusData.data?.attributes?.status, // 'done', 'failed', 'queued', etc.
    url: statusData.data?.attributes?.url || null, // direct video URL when ready
  });
}