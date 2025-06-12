
import { DEEP_AI_API_KEY, DEEP_AI_TEXT_TO_IMAGE_URL } from '../constants';
import { DeepAiResponse } from '../types';

export const generateImageWithDeepAI = async (prompt: string): Promise<DeepAiResponse> => {
  if (!prompt.trim()) {
    throw new Error('Prompt cannot be empty.');
  }

  const formData = new FormData();
  formData.append('text', prompt);

  const response = await fetch(DEEP_AI_TEXT_TO_IMAGE_URL, {
    method: 'POST',
    headers: {
      'api-key': DEEP_AI_API_KEY,
      'Accept': 'application/json', // Explicitly state expected response type
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `DeepAI API Error: ${response.status} ${response.statusText}`;
    try {
        const errorData = await response.json();
        // Use errorData.err if available, otherwise the full stringified errorData, or a fallback.
        if (errorData && errorData.err) {
            errorMessage += ` - ${errorData.err}`;
        } else if (errorData && typeof errorData === 'string') {
            errorMessage += ` - ${errorData}`;
        } else if (errorData && typeof errorData.message === 'string') {
            errorMessage += ` - ${errorData.message}`;
        } else if (errorData) {
            errorMessage += ` - ${JSON.stringify(errorData)}`;
        }
    } catch (e) {
        // If parsing errorData fails, the original errorMessage is still useful.
        // console.error("Could not parse DeepAI error response", e);
    }
    throw new Error(errorMessage);
  }

  const data: DeepAiResponse = await response.json();
  if (!data.output_url) {
    throw new Error('DeepAI API did not return an output URL.');
  }
  return data;
};
