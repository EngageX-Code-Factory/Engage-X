import { GoogleGenAI, Type, Schema } from '@google/genai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { startDate = 'Today', endDate = 'Next Week' } = body;

    // Connect to Supabase to fetch real user events
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let fixedEventsPrompt = "The student currently has ZERO registered events for this week. Return an empty schedule with empty event arrays for all 7 days.";

    if (user) {
      const { data } = await supabase
        .from('my_events')
        .select(`
          events (
            id,
            title,
            event_date,
            event_time
          )
        `)
        .eq('user_id', user.id);

      if (data && data.length > 0) {
        const studentEvents = data.map((item: any) => item.events).filter(Boolean);

        if (studentEvents.length > 0) {
          const eventsListText = studentEvents
            .map((e: any) => `- "${e.title}" on ${e.event_date} at ${e.event_time} (ID: ${e.id})`)
            .join('\n');

          fixedEventsPrompt = `The student is officially registered for these exact events:\n${eventsListText}\n\nYou MUST place these exact events on their precise dates and times in the schedule.`;
        }
      }
    }

    const prompt = `You are an incredibly strict data formatting AI for a university student portal. 
Your ONLY job is to take the student's exact registered events and map them into a structured 7-day JSON schedule.

The upcoming week starts on ${startDate} and ends on ${endDate}.
Ensure the 'date' number and 'dayLabel' logically flow for the next 7 days starting from ${startDate}.

${fixedEventsPrompt}

CRITICAL RULES:
1. DO NOT invent, hallucinate, or generate ANY new events, study blocks, free times, or classes.
2. The ONLY events that should appear in the 'events' array are the exact ones listed above.
3. If a day has no events from the list above, its 'events' array MUST be empty [].
4. Give each listed event the 'event' or 'club' type.

Even though you are not inventing events, YOU MUST generate 3 smart, actionable tips summarizing their upcoming week based on their load, using icons like 'Zap', 'Info', 'CheckCircle', or 'AlertTriangle'. Also provide a realistic 'balanceScore' from 0-100 based on their registered load.

Return a strict JSON object explicitly matching the required schema. Ensure the root is the object, not wrapped in markdown blockquotes.`;

    // Define the strict response schema
    const scheduleSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        balanceScore: {
          type: Type.NUMBER,
          description: "A score from 0 to 100 indicating how well-balanced the student's schedule is between academics and extracurriculars."
        },
        fullWeek: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayLabel: { type: Type.STRING, description: "E.g., 'SUN', 'MON'" },
              date: { type: Type.NUMBER, description: "The day of the month" },
              isToday: { type: Type.BOOLEAN, nullable: true },
              isBusy: { type: Type.BOOLEAN, nullable: true },
              isFreeAfternoon: { type: Type.BOOLEAN, nullable: true },
              featured: {
                type: Type.OBJECT,
                nullable: true,
                properties: {
                  time: { type: Type.STRING },
                  title: { type: Type.STRING }
                }
              },
              events: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.NUMBER },
                    time: { type: Type.STRING, description: "E.g., '10:00 AM'" },
                    endTime: { type: Type.STRING, description: "Intelligently estimate the end time based on the event type. E.g., '11:30 AM'" },
                    title: { type: Type.STRING },
                    type: { type: Type.STRING, description: "Must be exactly one of: 'club', 'academic', 'event', 'featured'" },
                    recommended: { type: Type.BOOLEAN, nullable: true },
                    gap: { type: Type.BOOLEAN, nullable: true }
                  }
                }
              }
            }
          }
        },
        tips: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              iconName: { type: Type.STRING, description: "Must be one of: 'Zap', 'Info', 'CheckCircle', 'AlertTriangle'" },
              text: { type: Type.STRING },
              color: { type: Type.STRING, description: "Tailwind text color, e.g., 'text-indigo-400', 'text-teal-400', 'text-orange-400'" }
            }
          }
        }
      },
      required: ["balanceScore", "fullWeek", "tips"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: scheduleSchema,
      }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate AI schedule' }, { status: 500 });
  }
}
