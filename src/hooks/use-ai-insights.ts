import { useQuery } from '@tanstack/react-query';
import { useTodayIntakes } from './use-intakes';
import { useSupplements } from './use-supplements';
import OpenAI from 'openai';
import { supplementGuidelines } from '@/lib/supplement-guidelines';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const useAIInsights = (user: string) => {
  const { data: intakes } = useTodayIntakes(user);
  const { data: supplements } = useSupplements(user);

  return useQuery({
    queryKey: ['ai-insights', user, intakes, supplements],
    queryFn: async () => {
      if (!intakes || !supplements) return null;

      // Prepare the data for the AI
      const intakeData = intakes.map(intake => {
        const supplement = supplements.find(s => s.id === intake.supplement_id);
        return {
          supplement: supplement?.name,
          quantity: intake.quantity,
          capsule_mg: supplement?.capsule_mg || null,
          time: new Date(intake.taken_at).toLocaleTimeString()
        };
      });

      const supplementData = supplements.map(supplement => ({
        name: supplement.name,
        maxDosage: supplement.max_dosage,
        capsule_mg: supplement.capsule_mg || null
      }));

      // Calculate kratom-specific values
      const kratomIntakes = intakeData.filter(intake => 
        intake.supplement?.toLowerCase().includes('kratom')
      );
      const capsuleMg = supplementGuidelines.kratom.capsuleSize;
      const totalKratomCapsules = kratomIntakes.reduce((total, intake) => {
        if (intake.capsule_mg) {
          return total + Math.round(intake.quantity);
        }
        return total + intake.quantity;
      }, 0);
      const totalKratomGrams = totalKratomCapsules * capsuleMg / 1000;
      const doses = totalKratomCapsules / 7; // 7 capsules = ~1 dose (5–8 range)

      // Create the prompt for the AI
      const prompt = `Given the following supplement intake data for today:
${JSON.stringify(intakeData, null, 2)}

And the supplement information:
${JSON.stringify(supplementData, null, 2)}

Kratom Guidelines (for 700mg capsules):
- Grams per day: 12–16g
- Capsules per day: 17–23 max
- Per dose: 5–8 capsules (3x/day)
- Upper ceiling: Don't exceed 23/day

Today's kratom intake: ${totalKratomCapsules} capsules (${totalKratomGrams.toFixed(1)}g), approx. ${doses.toFixed(1)} doses

Please provide a brief, actionable insight about the user's supplement intake pattern. Focus on:
1. Consistency in timing
2. Dosage optimization
3. Potential interactions or timing improvements
4. Any notable patterns
5. For kratom specifically:
   - Compare current intake against the above guidelines
   - Suggest appropriate dosage adjustments
   - Highlight any safety concerns
   - Recommend timing optimizations

Keep the response concise (2-3 sentences) and actionable. Do not mention beginner or starting low guidance.`;

      try {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          max_tokens: 150
        });

        return completion.choices[0]?.message?.content || null;
      } catch (error) {
        console.error('Error generating AI insight:', error);
        return null;
      }
    },
    enabled: !!user && !!intakes && !!supplements,
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
  });
}; 