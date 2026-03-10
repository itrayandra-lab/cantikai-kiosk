/**
 * Enhanced Gemini Service with Vision API
 * Provides AI-powered skin analysis recommendations
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Try different endpoint - v1beta with models prefix
const GEMINI_VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

/**
 * Analyze skin image with Gemini Vision
 */
export const analyzeWithGeminiVision = async (imageBase64, cvResults) => {
    try {
        // Remove data:image prefix if exists
        const base64Image = imageBase64.includes(',') 
            ? imageBase64.split(',')[1] 
            : imageBase64;

        const prompt = `You are a professional dermatologist AI assistant. Analyze this facial skin image and provide detailed insights.

Current Computer Vision Analysis Results:
- Overall Score: ${cvResults.overall_score}%
- Acne: ${cvResults.acne_severity} (${cvResults.acne_score}%)
- Wrinkles: ${cvResults.wrinkle_severity}% (${cvResults.wrinkle_count} lines)
- Pores: ${cvResults.pore_density}/cm²
- Pigmentation: ${cvResults.pigmentation_severity} (${cvResults.melanin_index}%)
- Hydration: ${cvResults.hydration_status} (${cvResults.hydration_level}%)
- Texture: ${cvResults.texture_severity} (${cvResults.smoothness_score}%)
- Redness: ${cvResults.redness_severity} (${cvResults.redness_score}%)
- Oiliness: ${cvResults.sebum_level} (${cvResults.oiliness_score}%)
- UV Damage: ${cvResults.uv_severity} (${cvResults.uv_damage_score}%)
- Skin Age: ${cvResults.predicted_age} years (${cvResults.age_category})
- Skin Type: ${cvResults.skin_type}
- Skin Tone: ${cvResults.fitzpatrick_type}
- Undertone: ${cvResults.undertone}

Please provide:
1. A comprehensive skin health assessment (2-3 sentences)
2. Top 3 specific concerns to address
3. Personalized skincare routine recommendations (morning & night)
4. Lifestyle tips for improvement
5. Ingredient recommendations to look for in products

Format your response in JSON:
{
  "assessment": "...",
  "concerns": ["concern1", "concern2", "concern3"],
  "morning_routine": ["step1", "step2", "step3"],
  "night_routine": ["step1", "step2", "step3"],
  "lifestyle_tips": ["tip1", "tip2", "tip3"],
  "recommended_ingredients": ["ingredient1", "ingredient2", "ingredient3"]
}`;

        const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        
        // Extract JSON from response
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Fallback if JSON parsing fails
        return {
            assessment: textResponse,
            concerns: [],
            morning_routine: [],
            night_routine: [],
            lifestyle_tips: [],
            recommended_ingredients: []
        };

    } catch (error) {
        console.error('Gemini Vision Analysis Error:', error);
        return null;
    }
};

/**
 * Get product recommendations based on skin analysis
 */
export const getProductRecommendations = async (skinAnalysis) => {
    try {
        const prompt = `Based on this skin analysis, recommend 5 specific skincare products:

Skin Profile:
- Type: ${skinAnalysis.skin_type}
- Concerns: Acne (${skinAnalysis.acne_severity}), Wrinkles (${skinAnalysis.wrinkle_severity}%), Pigmentation (${skinAnalysis.pigmentation_severity})
- Hydration: ${skinAnalysis.hydration_status}
- Oiliness: ${skinAnalysis.sebum_level}

Provide 5 product recommendations in JSON format:
{
  "products": [
    {
      "name": "Product Name",
      "type": "Cleanser/Serum/Moisturizer/etc",
      "key_ingredients": ["ingredient1", "ingredient2"],
      "benefits": "Why this product helps",
      "usage": "When and how to use"
    }
  ]
}`;

        const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return { products: [] };

    } catch (error) {
        console.error('Product Recommendation Error:', error);
        return { products: [] };
    }
};

/**
 * Get personalized skincare tips
 */
export const getPersonalizedTips = async (skinAnalysis) => {
    try {
        const prompt = `Provide 5 personalized skincare tips for someone with:
- Skin Type: ${skinAnalysis.skin_type}
- Age: ${skinAnalysis.predicted_age} years
- Main Concerns: ${skinAnalysis.acne_severity}, ${skinAnalysis.pigmentation_severity}

Format as JSON:
{
  "tips": [
    {
      "title": "Tip Title",
      "description": "Detailed tip",
      "frequency": "Daily/Weekly/etc"
    }
  ]
}`;

        const response = await fetch(`${GEMINI_VISION_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.6,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return { tips: [] };

    } catch (error) {
        console.error('Tips Generation Error:', error);
        return { tips: [] };
    }
};
