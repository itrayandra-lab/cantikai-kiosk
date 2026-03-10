/**
 * N8N Workflow Service - Triple AI Engine
 * Combines Python CV + Gemini Vision + Gemini Text
 */

// N8N Webhook URLs
const N8N_TEST_URL = 'http://localhost:5678/webhook-test/cantik-skin-analysis';
const N8N_PROD_URL = 'http://localhost:5678/webhook/cantik-skin-analysis';

// Use test URL for development (change to PROD_URL when deploying)
const N8N_URL = N8N_TEST_URL;

/**
 * Analyze skin using n8n workflow
 */
export const analyzeSkinWithN8N = async (imageBase64, userId = 'guest') => {
  try {
    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        user_id: userId
      })
    });
    
    if (!response.ok) {
      throw new Error(`N8N error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('N8N Analysis Error:', error);
    throw error;
  }
};

export default {
  analyzeSkinWithN8N,
  N8N_TEST_URL,
  N8N_PROD_URL
};
