const OpenAI = require('openai');
const { env } = require('../config/env');

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

const systemPrompt = `
You are MindMate, a deeply supportive and emotionally intelligent AI friend for Indian college students.

Core Behavior:
- Talk like a real close friend (not a teacher, not an AI)
- Be natural, warm, and human-like
- Match user's language (Hinglish, Hindi, English)
- Match user's tone (casual, emotional, serious)
- If user says "bhai", respond like a friend would

Conversation Style:
- First understand the user's emotion, then respond
- Always acknowledge feelings before giving suggestions
- Replies should feel personal, not generic
- Use simple, relatable language (like real conversations)
- You can use Hinglish naturally when needed
- Also ask follow-up questions to show you care and want to understand more

Length:
- Responses can be longer (8–20 lines when needed)
- Do not be overly short
- Let the conversation flow naturally

Memory Awareness:
- Remember context from previous messages
- Do not ask the same things again
- Refer back to what the user said earlier if relevant
- Make the user feel like you are actually listening

Emotional Support:
- If user is stressed, sad, lonely, anxious → respond with empathy first
- Do NOT jump directly into solutions
- Slowly guide, don’t lecture
- Be calm, reassuring, and understanding

Critical Safety:
- If user mentions self-harm, suicide, or harming themselves:
  - STOP normal conversation
  - Respond with care and urgency
  - Encourage contacting someone they trust
  - Suggest India helpline: AASRA (91-9820466726)
  - Never act casual in such situations

Goal:
Make the user feel heard, understood, emotionally supported, and less alone after every reply.

Examples:
User: "sun bhai"
AI: "bol bhai kya chal raha hai?"
`;

function buildFallbackReply(text) {
  const lower = String(text || '').toLowerCase();

  if (/(suicide|kill myself|self harm|hurt myself|die)/.test(lower)) {
    return `I am really glad you said this out loud. You deserve immediate human support right now, not to handle this alone.

Please contact someone you trust right away and reach out to emergency or crisis support in your area now. If you feel in immediate danger, call emergency services right now.

Stay with one person if you can. Can you message or call one trusted person this minute?`;
  }

  if (/(stress|studies|exam|focus|assignment|college|marks)/.test(lower)) {
    return `That sounds exhausting, and it makes sense that your mind feels overloaded.

When study stress builds up, the brain often starts treating everything like an emergency. That does not mean you are weak or failing. It usually means you are carrying too much at once.

Try this for just 10 minutes: pick one tiny task only, mute distractions, and tell yourself you are not finishing everything today, only starting one thing. What is the smallest study task you could do first?`;
  }

  if (/(lonely|alone|nobody|isolated)/.test(lower)) {
    return `That kind of loneliness can feel very heavy, especially when people are around but you still feel unseen.

You do not need to force yourself to feel okay right now. Sometimes the first step is simply noticing what you are missing most: comfort, connection, understanding, or rest.

Would it help to talk about when this lonely feeling hits you the most?`;
  }

  if (/(overthink|anxious|anxiety|panic|worry)/.test(lower)) {
    return `That sounds like your mind is running faster than your body can comfortably hold.

Overthinking often happens when something inside you is trying very hard to protect you. We do not have to fight it immediately. First, we can slow the moment down.

Take one slow breath and name the biggest thought in one sentence. What is the thought that keeps looping most right now?`;
  }

  return `I am here with you, and what you are feeling matters.

You do not need to explain everything perfectly. We can go one step at a time and make this conversation simple.

What feels hardest right now: your thoughts, your mood, your studies, or something happening with people around you?`;
}

async function chatWithMindmate(req, res) {
  const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
  const trimmedMessages = messages
    .slice(-12)
    .filter((item) => item && typeof item.content === 'string' && typeof item.role === 'string')
    .map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: item.content
    }));

  const latestUserText = [...trimmedMessages].reverse().find((item) => item.role === 'user')?.content || '';

  if (!client) {
    return res.json({
      reply: buildFallbackReply(latestUserText),
      source: 'fallback'
    });
  }

  try {
    const response = await Promise.race([
      client.responses.create({
        model: 'gpt-4o-mini',
        instructions: systemPrompt,
        input: trimmedMessages.map((item) => ({
          role: item.role,
          content: item.content
        })),
        max_output_tokens: 350
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('MindMate request timed out')), 12000);
      })
    ]);

    return res.json({
      reply: response.output_text?.trim() || buildFallbackReply(latestUserText),
      source: 'openai'
    });
  } catch (error) {
    console.error('MindMate fallback triggered:', error.message);
    return res.json({
      reply: buildFallbackReply(latestUserText),
      source: 'fallback'
    });
  }
}

module.exports = { chatWithMindmate };

