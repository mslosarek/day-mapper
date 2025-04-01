import { NextResponse } from 'next/server';

// Helper to get API key from environment variables
const getApiKey = (): string => {
  const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;

  if (!apiKey) {
    console.error('GOOGLE_AI_STUDIO_API_KEY is not defined in environment variables');
    throw new Error('API key is not configured');
  }

  return apiKey;
};

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log('Server received todo items:', data);

    // Get API key (will throw error if not configured)
    const apiKey = getApiKey();

    // Here you would use the API key to call Google AI Studio
    // For now, just logging that we have the key
    console.log('Using Google AI Studio with API key:', apiKey.substring(0, 3) + '...' + apiKey.substring(apiKey.length - 3));

    const aiModel = 'gemini-2.0-flash';

    // Create the prompt for the AI
    const prompt = {
      contents: [{
        parts: [{
          text: `
**Role:** You are a Friendly Task Sequencer AI called DayMapper. Your goal is to take a list of tasks, along with context, and create a simple, logical schedule.

**Objective:** Generate a suggested schedule for the provided tasks. For each scheduled item, clearly state the task, the suggested time, and provide a concise reason *why* it's placed at that time and in that order, referencing the given constraints. The final output must be a JSON object containing the schedule, suitable for frontend rendering. Include a simple visual element (like an emoji or a relevant icon keyword) for each task.

**Input Analysis - Consider these factors when creating the schedule:**

1.  **Priorities:** Identify tasks explicitly marked as high priority or non-skippable.
2.  **Deadlines:** Account for any specified deadlines.
3.  **Time Dependencies:** Note tasks that depend on time of day (e.g., school hours, store opening times, daylight).
4.  **Location:** Consider grouping tasks by location (e.g., outdoor tasks, errands).
5.  **Energy Levels:** (Optional, if context given) Place demanding tasks when energy might be higher.
6.  **Task Duration:** Factor in estimated time needed for each task.
7.  **Context:** Use any background information provided (e.g., "it's a school day," "focus needed").

**Output Requirements:**

1.  **Format:** The entire output must be a single JSON object.
2.  **Structure:**
    *   The JSON object should have a top-level key named \`summary\`.
    *   The value of \`summary\` should be a string that summarizes the schedule it can be funny or it can be straight forward.
    *   The JSON object should have a top-level key named \`plan\`.
    *   The value of \`plan\` should be an array of objects.
    *   Each object in the array represents a scheduled task and must contain the following keys:
        *   \`time\`: (String) The suggested start time (e.g., "11:00 AM").
        *   \`task\`: (String) The name of the task.
        *   \`duration_minutes\`: (Number, optional) Estimated duration in minutes, if inferrable or provided. If it is an exercise, double the duration to allow for warmup and cool down.
        *   \`reasoning\`: (String) A brief explanation for the timing/order, referencing constraints.
        *   \`visual_element\`: an MUI icon name from https://mui.com/material-ui/material-icons/ . These icons are available in the MUI icon library and should be pascal case.
        *   \`category\`: (String, optional) A category like "Work", "Personal", "Home", "Family", "Errand".

**Input Tasks and Constraints:**
Tasks:
${data.items.map((item: { text: string }) => `*   ${item.text}`).join('\n')}

Constraints/Context:
*   It's a weekday (assume standard work/school hours apply).

**Generate the JSON schedule based on the input above.**
          `
        }]
      }]
    };

    console.log('Sending prompt to AI:', prompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    const result = await response.json();

    // Simulate processing time to show loader
    // await new Promise(resolve => setTimeout(resolve, 1500));

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    // Extract JSON from the markdown response if it's wrapped in ```json blocks
    let scheduleJson = responseText;
    if (responseText && responseText.includes('```json')) {
      scheduleJson = responseText.replace(/```json\n|\n```/g, '').trim();
    }

    try {
      scheduleJson = JSON.parse(scheduleJson);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON response from AI',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    console.log('Schedule JSON:', scheduleJson);

    return NextResponse.json({
      success: true,
      message: 'Todo items processed with AI',
      schedule: scheduleJson || 'Unable to generate schedule'
    });
  } catch (error) {
    console.error('Error processing todo items:', error);

    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
