import { NextResponse }     from 'next/server';
import type { NextRequest } from 'next/server';
import type { EducationEntry, CertEntry } from '@/lib/types'

type Step1Data = {
  firstName: string;
  lastName: string;
  displayName: string;
  location: string;
  languages: string[];
  about: string;
};


type Step2Data = {
  role: string
  skills: { name: string }[]
  education:  EducationEntry[]
  cert_award: CertEntry[]
}


type FormData = Step1Data & Step2Data;

export async function POST(request: NextRequest) {
  const { form } = (await request.json()) as { form: FormData };


  const prompt = `
Carefully analyze the following information: 
First name:     ${form.firstName}
Last name:      ${form.lastName}
Display name:   ${form.displayName}
Location:       ${form.location}
Languages: ${Array.isArray(form.languages) ? form.languages.join(', ') : 'N/A'}
About:          ${form.about}
Role:           ${form.role}
Skills: ${Array.isArray(form.skills) ? form.skills.map(s => s.name).join(', ') : 'N/A'}
Education:      ${form.education
      .map(e => `${e.title} at ${e.university} (${e.year})`)
      .join('; ')}
Certifications: ${form.cert_award
      .map(c => `${c.name} from ${c.from} (${c.year})`)
      .join('; ')}

You’re an AI scriptwriter. You must generate a spoken script where:
• The Introduction takes up approximately 1/6 of the script,
• The Core Message takes up 2/3 of the script,
• The Conclusion takes up 1/6 of the script.
• This structure scales proportionally, whether the script is closer to 135 or 200 words, excluding the cues. It must be at least 135 words and no more than 200 words, excluding cues. 
• There are exactly three sections: [Introduction], [Core Message], and [Conclusion].  
• Introduction: State the speaker’s name and one key detail (profession, passion, or role).  
• Core message:  
  – What they do (skills/expertise).  
  – Why it matters (impact or achievement).  
  – A fun fact or unique quality.  
• Conclusion: End with an invitation or goal (e.g., “Let’s connect to…”).  
• Uses a warm, confident tone, natural pauses, and cues for body language (smile, eye contact).  
• Keeps the language clear, engaging, and concise.  

Output only the final script with these three headings—no extra labels or timestamps.

Use exactly these three headings on their own lines, without any asterisks or styling:
Introduction
Core Message
Conclusion

  `.trim();

  const aiRes = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command-a-03-2025',
      message: prompt,
      max_tokens: 300,
      temperature: 0.2,
    }),
  });

  if (!aiRes.ok) {
    const status = aiRes.status;
    let errorText: string;
    try {
      errorText = (await aiRes.text()) || '(no response body)';
    } catch (e) {
      errorText = '(error reading response body)';
    }
    console.error(`Cohere API failed [status ${status}]: ${errorText}`);
    return NextResponse.json(
      { error: `Cohere API error ${status}: ${errorText}` },
      { status: 502 }
    );
  }

  const { text } = await aiRes.json();
  const script = (text || '').trim();

  return NextResponse.json({ script });
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}