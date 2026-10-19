import Anthropic from '@anthropic-ai/sdk';
import { sinFallback, tripFallback } from '@/lib/fallback';

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

// เลือก fallback ตามโหมด (ใช้เมื่อไม่มี key หรือ AI ล่ม)
const getFallback = (mode, meta) =>
  mode === 'trip' ? tripFallback(meta || {}) : sinFallback(meta || {});

export async function POST(request) {
  const { prompt, mode, meta } = await request.json();

  if (!prompt) {
    return Response.json({ error: 'ต้องส่ง prompt มาด้วย' }, { status: 400 });
  }

  // ยังไม่มี API key → โหมดไม่มี AI ใช้ข้อความสำเร็จรูป
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(getFallback(mode, meta));
  }

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content.find((b) => b.type === 'text')?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI ไม่ได้ตอบเป็น JSON');

    return Response.json(JSON.parse(match[0]));
  } catch (err) {
    console.error('Claude API error:', err);
    // AI ล่ม → ใช้ fallback แทน จะได้ไม่ค้าง
    return Response.json({ ...getFallback(mode, meta), aiError: String(err?.message || err) });
  }
}
