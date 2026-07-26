import { getAdvice, AdviceResult } from './api';

/**
 * Career advice now goes through the FastAPI backend (POST /advice), which holds
 * the Gemini API key server-side. The previous implementation called Gemini
 * directly from the browser with an exposed key — never do that in production.
 */
export const getInternshipRecommendations = async (
  userPrompt: string,
): Promise<AdviceResult | null> => {
  try {
    return await getAdvice(userPrompt);
  } catch (error) {
    console.error('Advice backend error:', error);
    return null;
  }
};
