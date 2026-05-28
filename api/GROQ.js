export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const body = await req.json();

  const groqBody = {
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1200,
    messages: body.system
      ? [{ role: 'system', content: body.system }, ...body.messages]
      : body.messages,
  };

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': '`Bearer ${process.env.GROQ_API_KEY}}`,
    },
    body: JSON.stringify(groqBody),
  });

  const data = await r.json();
  const text = data.choices?.[0]?.message?.content
    || data.error?.message
    || 'Sorry, could not generate a response.';

  return new Response(JSON.stringify({ content: [{ type: 'text', text }] }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}