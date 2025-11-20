import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function llm(system, user) {
  const res = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    temperature: 0.7,
  });
  return res.choices[0]?.message?.content ?? '';
}
