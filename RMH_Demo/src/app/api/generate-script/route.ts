import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { form } = req.body;

  const aiRes = await fetch(process.env.VISLA_KEY!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: form }),
  });

  if (!aiRes.ok) {
    return res.status(aiRes.status).json({ error: 'AI failed' });
  }

  const { generatedText } = await aiRes.json();
  res.status(200).json({ script: generatedText });
}