import { about } from '@/config/About';
import { systemPrompt } from '@/config/ChatPrompt';
import { experiences } from '@/config/Experience';
import { heroConfig, socialLinks } from '@/config/Hero';
import { projects } from '@/config/Projects';
import { createParser } from 'eventsource-parser';
import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.array(z.object({ text: z.string() })),
      }),
    )
    .optional()
    .default([]),
});

function sanitizeInput(input: string): string {
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /system prompt/gi,
    /you are now/gi,
    /act as/gi,
    /pretend to be/gi,
    /ignore all previous/gi,
    /forget everything/gi,
    /new instructions/gi,
    /override/gi,
    /bypass/gi,
    /hack/gi,
    /exploit/gi,
    /inject/gi,
    /prompt injection/gi,
    /system message/gi,
    /role play/gi,
    /character/gi,
    /persona/gi,
    /behave as/gi,
    /respond as/gi,
  ];

  let sanitized = input;

  injectionPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }

  return sanitized;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

function checkRateLimit(clientIP: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  clientData.count++;
  rateLimitStore.set(clientIP, clientData);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - clientData.count,
  };
}

function streamAssistantText(text: string, rateLimitRemaining?: number) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
      controller.close();
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
      ...(typeof rateLimitRemaining === 'number'
        ? { 'X-RateLimit-Remaining': rateLimitRemaining.toString() }
        : {}),
    },
  });
}

function buildFallbackResponse(message: string): string {
  const normalizedMessage = message.toLowerCase();
  const skills = heroConfig.skills.map((skill) => skill.name).join(', ');
  const emailLink =
    socialLinks.find((link) => link.name === 'Email')?.href ??
    'mailto:ashrafkhan.connect@gmail.com';
  const xLink = socialLinks.find((link) => link.name === 'X')?.href;
  const linkedinLink = socialLinks.find((link) => link.name === 'LinkedIn')?.href;
  const githubLink = socialLinks.find((link) => link.name === 'Github')?.href;

  if (/^(hi|hello|hey|hii)\b/.test(normalizedMessage)) {
    return `Hi! I'm ${about.name}. I work with **${skills}** and focus on building reliable Java backend services plus clean web experiences.`;
  }

  if (
    normalizedMessage.includes('project') ||
    normalizedMessage.includes('recent work')
  ) {
    const recentProjects = projects.slice(0, 3);

    return [
      'Here are a few recent projects from my portfolio:',
      ...recentProjects.map(
        (project) =>
          `- **${project.title}**: ${project.description}${
            project.live ? ` ([Live](${project.live}))` : ''
          }`,
      ),
    ].join('\n');
  }

  if (
    normalizedMessage.includes('skill') ||
    normalizedMessage.includes('technology') ||
    normalizedMessage.includes('stack')
  ) {
    return `My core stack is **${skills}**. I focus on Java backend development with Spring Boot, database work, REST APIs, Docker-based setup, and UI planning in Figma.`;
  }

  if (
    normalizedMessage.includes('experience') ||
    normalizedMessage.includes('work')
  ) {
    const latestExperience = experiences.slice(0, 3);

    return [
      'My experience is currently focused on Java backend demo work:',
      ...latestExperience.map(
        (experience) =>
          `- **${experience.position}** at ${experience.company} (${experience.startDate} - ${experience.endDate})`,
      ),
    ].join('\n');
  }

  if (
    normalizedMessage.includes('contact') ||
    normalizedMessage.includes('email') ||
    normalizedMessage.includes('hire')
  ) {
    return [
      'You can contact me here:',
      `- **Email:** [ashrafkhan.connect@gmail.com](${emailLink})`,
      xLink ? `- **X:** [@ashrafkhanlive](${xLink})` : '',
      linkedinLink ? `- **LinkedIn:** [ashraf-khan-code](${linkedinLink})` : '',
      githubLink ? `- **GitHub:** [ashrafkhanlive](${githubLink})` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  return `I'm ${about.name}, a Full Stack Java Developer. I can tell you about my **skills**, **projects**, **experience**, or how to **contact** me.`;
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: RATE_LIMIT_WINDOW / 1000,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW).toString(),
          },
        },
      );
    }

    const body = await request.json();
    const validatedData = chatSchema.parse(body);
    const sanitizedMessage = sanitizeInput(validatedData.message);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Using local chat fallback.');
      return streamAssistantText(
        buildFallbackResponse(sanitizedMessage),
        rateLimit.remaining,
      );
    }

    // Prepare the request body for Gemini REST API
    const requestBody = {
      contents: [
        {
          parts: [{ text: systemPrompt }],
          role: 'user',
        },
        {
          parts: [
            { text: 'I understand. I will act as your portfolio assistant.' },
          ],
          role: 'model',
        },
        // Add conversation history
        ...validatedData.history.map((msg) => ({
          ...msg,
          parts: msg.parts.map((part) => ({
            ...part,
            text: msg.role === 'user' ? sanitizeInput(part.text) : part.text,
          })),
        })),
        // Add current message
        {
          parts: [{ text: sanitizedMessage }],
          role: 'user',
        },
      ],
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    };

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

    let response: Response;
    try {
      response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error(`Gemini API error: ${response.status}`);
        return streamAssistantText(
          buildFallbackResponse(sanitizedMessage),
          rateLimit.remaining,
        );
      }
    } catch (error) {
      console.error('Gemini request failed. Using local chat fallback:', error);
      return streamAssistantText(
        buildFallbackResponse(sanitizedMessage),
        rateLimit.remaining,
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const parser = createParser({
            onEvent: (event) => {
              try {
                const data = JSON.parse(event.data);
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  // Send as Server-Sent Event format
                  const sseData = `data: ${JSON.stringify({ text })}\n\n`;
                  controller.enqueue(encoder.encode(sseData));
                }
              } catch (parseError) {
                console.error('Parse error:', parseError);
              }
            },
          });

          if (!response.body) {
            throw new Error('No response body');
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            parser.feed(decoder.decode(value));
          }

          // Send completion signal
          controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = `data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
