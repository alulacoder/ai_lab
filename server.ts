import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Lab Mentor Endpoint
app.post('/api/lab-assistant', async (req, res) => {
  try {
    const { prompt, history = [], currentExperiment, difficulty = 'guided' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful offline/demo response with rich scientific insight
      return res.json({
        text: `[Lab Mentor - Local Mode]: Regarding ${currentExperiment?.title || 'your investigation'}: Great question! When observing this phenomenon, remember to look closely at the variable relationships. In this experiment, notice how changing the input parameters directly impacts the system equilibrium. Try testing extreme bounds to see if the reaction rate or field equations behave linearly or exponentially!`,
      });
    }

    const expContext = currentExperiment
      ? `CURRENT EXPERIMENT: "${currentExperiment.title}" in Department: "${currentExperiment.department}".
Summary: ${currentExperiment.description || 'Hands-on laboratory simulation'}.
Current parameters/state: ${JSON.stringify(currentExperiment.currentData || {})}.`
      : 'User is exploring the laboratory overview.';

    const systemInstruction = `You are Dr. Aetheria, the Chief Scientific Advisor and resident AI mentor at the Aetheria Virtual Science Laboratory.
You guide researchers, students, and curious minds through virtual scientific investigations across Chemistry, Biology, Physics, Astronomy, Genetics, Earth Science, Forensics, and Engineering.

${expContext}
USER EXPERTISE LEVEL: ${difficulty === 'advanced' ? 'Advanced / Academic (use exact thermodynamic equations, reaction mechanisms, differential formulas, and precise SI units)' : 'Beginner / Guided Learner (use intuitive physical analogies, step-by-step reasoning, clear non-jargon explanations, and encouraging hints)'}.

Core Guidelines:
1. Explain the underlying scientific mechanics of the specific experiment they are operating.
2. If the user asks for answers or how to solve an experiment objective, provide smart hints that lead them to discover it themselves.
3. If they share simulation data or observations, help them interpret what the numbers, spectra, or graphs mean.
4. Keep responses structured, concise, and engaging (2-4 paragraphs maximum, with markdown formatting).
5. Suggest an intriguing follow-up experiment or parameter change to test next.`;

    const contents = [
      ...history.slice(-6).map((msg: { role: string; text: string }) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      })),
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI Request timeout')), 4500)
    );

    let replyText = '';
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: { systemInstruction },
        }),
        timeoutPromise,
      ]);
      replyText = response.text || '';
    } catch (genError: any) {
      console.warn('AI response timed out or failed, using expert local guidance:', genError?.message);
      replyText = generateContextualScientificResponse(currentExperiment, prompt, difficulty);
    }

    return res.json({ text: replyText || 'Observation logged. Let us analyze the experimental data further.' });
  } catch (error: any) {
    console.error('Error in /api/lab-assistant:', error);
    return res.json({
      text: "Dr. Aetheria: I've logged your observation. When analyzing this phenomenon, observe how changing the control variables shifts the system equilibrium. Try testing boundary conditions to see if the reaction rate or field equations respond linearly or exponentially!",
    });
  }
});

function generateContextualScientificResponse(
  currentExperiment: any,
  prompt: string,
  difficulty: string
): string {
  const isAdv = difficulty === 'advanced';
  const expTitle = currentExperiment?.title || 'Scientific Investigation';
  const dept = currentExperiment?.department || 'Science';
  const pLower = prompt.toLowerCase();

  if (pLower.includes('hint') || pLower.includes('solve')) {
    return `**Dr. Aetheria's Hint for ${expTitle}:**
Notice how the governing formula links the variables. Focus on the relationship between your independent variable and the observed readout. For instance, ask yourself: if you double the input value, does the output double (linear), quadruple (quadratic), or change inversely? Check the units on your telemetry display to confirm the expected relationship!`;
  }

  if (pLower.includes('data') || pLower.includes('interpret') || pLower.includes('number')) {
    return `**Data Analysis for ${expTitle}:**
Your current telemetry readings reflect the system operating at steady-state equilibrium. In ${dept}, these values represent the balance between competing physical or chemical forces. Look at whether the system is currently in a linear region or approaching an asymptotic limit or threshold!`;
  }

  if (pLower.includes('next') || pLower.includes('suggest') || pLower.includes('related')) {
    return `**Follow-up Recommendation:**
After investigating **${expTitle}**, I recommend testing boundary conditions—try setting one variable to its minimum and another to its maximum to observe extreme limits. Afterwards, check out the complementary experiments in the **${dept}** department or explore our **Equipment Catalog**!`;
  }

  return `**Dr. Aetheria's Scientific Analysis (${expTitle}):**

${isAdv
  ? `In this experiment within ${dept}, the system state is governed by conservation laws and thermodynamic potential. The observables respond according to the differential equations of the medium. Notice how varying your parameters alters the energetic landscape and drives the reaction kinetics or wave mechanics.`
  : `In this experiment within ${dept}, you are exploring how energy and matter interact. When you adjust the controls, you can see direct cause-and-effect: increasing one factor speeds up or amplifies the outcome, while opposing forces balance it out.`}

Try adjusting your sliders to test extreme limits, and observe the live changes in your telemetry readouts!`;
}

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
