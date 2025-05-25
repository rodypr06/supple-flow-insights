import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export function useAIInsights(userId: string) {
  return useQuery({
    queryKey: ['ai-insights', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Get user's recent intakes
      const intakes = await db.intakes.list(userId);
      if (!intakes?.length) return null;

      // Get user's supplements
      const supplements = await db.supplements.list(userId);
      if (!supplements?.length) return null;

      // Prepare data for AI analysis
      const intakeData = intakes.map(intake => ({
        supplement: intake.supplements.name,
        dosage: intake.dosage,
        takenAt: intake.taken_at,
        notes: intake.notes
      }));

      const supplementData = supplements.map(supp => ({
        name: supp.name,
        recommendedDosage: supp.recommended_dosage,
        unit: supp.dosage_unit
      }));

      // Generate AI insights
      const prompt = `
        Analyze the following supplement intake data and provide personalized insights:
        
        Recent Intakes:
        ${JSON.stringify(intakeData, null, 2)}
        
        Supplements:
        ${JSON.stringify(supplementData, null, 2)}
        
        Please provide:
        1. A brief analysis of intake patterns
        2. Any potential concerns or recommendations
        3. Suggestions for optimization
        Keep the response concise and actionable.
      `;

      try {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          max_tokens: 500
        });

        return completion.choices[0]?.message?.content || null;
      } catch (error) {
        console.error('Error generating AI insights:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2
  });
} 