import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('video');
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const role = formData.get('role') as string;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Invalid video file' }, { status: 400 });
    }

    // Get signed upload URL from Shotstack
    const getUploadUrlRes = await fetch('https://api.shotstack.io/ingest/stage/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SHOTSTACK_API_KEY || '',
      },
      body: JSON.stringify({ filename: (file as any).name || 'upload.mp4' }),
    });
    const uploadUrlData = await getUploadUrlRes.json();

    if (
      !getUploadUrlRes.ok ||
      !uploadUrlData?.data?.attributes?.url ||
      !uploadUrlData?.data?.attributes?.id
    ) {
      console.error('Shotstack upload URL error:', uploadUrlData);
      return NextResponse.json({ error: 'Failed to get upload URL', details: uploadUrlData }, { status: 500 });
    }

    const { url: signedUrl, id: sourceId } = uploadUrlData.data.attributes;

    // Upload video to signed URL
    const fileBuffer = Buffer.from(await (file as Blob).arrayBuffer());
    const uploadRes = await fetch(signedUrl, {
      method: 'PUT',
      body: fileBuffer,
      headers: { 'x-amz-acl': 'public-read' }, 
    });
    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Upload to signed URL failed:', errorText);
      return NextResponse.json({ error: 'Upload failed', details: errorText }, { status: 500 });
    }

    // Poll until video is ready in Shotstack (status: ready)
    let status = 'pending', videoUrl = null, maxTries = 15, tries = 0;
    while (status !== 'ready' && tries < maxTries) {
      await new Promise(r => setTimeout(r, 2000)); // Wait 2s between checks
      const detailsRes = await fetch(
        `https://api.shotstack.io/ingest/stage/sources/${sourceId}`,
        {
          headers: { 'x-api-key': process.env.SHOTSTACK_API_KEY || '' },
        }
      );
      const detailsData = await detailsRes.json();
      status = detailsData.data?.attributes?.status;
      videoUrl = detailsData.data?.attributes?.source;
      tries++;
    }
    if (status !== 'ready' || !videoUrl) {
      return NextResponse.json({ error: 'Video not ready after upload', details: { status, tries } }, { status: 500 });
    }

    console.log('Shotstack Render Payload:', JSON.stringify({
  id: 'cd62cd98-b231-46c4-bf4b-8866afd6d0f7',
  merge: [
    { find: 'TEXT_VAR_140', replace: firstName },
    { find: 'TEXT_VAR_226', replace: lastName },
    { find: 'TEXT_VAR_656', replace: role },
    { find: 'VIDEO_SRC', replace: videoUrl },
  ],
}, null, 2));

    // Render using the template
    const renderRes = await fetch('https://api.shotstack.io/edit/stage/templates/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.SHOTSTACK_API_KEY || '',
      },
      body: JSON.stringify({
        id: 'cd62cd98-b231-46c4-bf4b-8866afd6d0f7',
        merge: [
          { find: 'TEXT_VAR_140', replace: firstName },
          { find: 'TEXT_VAR_226', replace: lastName },
          { find: 'TEXT_VAR_656', replace: role },
          { find: 'VIDEO_SRC', replace: videoUrl },
        ],
      }),
    });
    const renderData = await renderRes.json();

    const jobId = renderData?.response?.id;
    if (!jobId) {
      console.error('Shotstack renderData missing id:', renderData);

      console.error('Shotstack ValidationError details:', JSON.stringify(renderData?.response?.error?.details, null, 2));
      
      return NextResponse.json({ error: 'No render job ID', details: renderData }, { status: 500 });
    }

    return NextResponse.json({ id: jobId });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 });
  }
}