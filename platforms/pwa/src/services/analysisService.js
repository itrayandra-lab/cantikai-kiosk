/**
 * Analysis Service - AI-Only (No Python Backend)
 * Direct integration with Gemini & Groq APIs
 * Version 5.0 - Pure AI Analysis
 */

import { analyzeSkinWithAI as analyzeWithAIOnly, checkAIHealth } from './aiAnalysisService';

/**
 * Main analysis function - AI-Only (No Python)
 * Uses Gemini Vision + Gemini Pro for comprehensive analysis
 */
export const analyzeSkinCV = async (imageBase64) => {
    console.warn('⚠️ analyzeSkinCV is deprecated. Use analyzeSkinWithAI instead.');
    return analyzeSkinWithAI(imageBase64);
};

/**
 * Complete AI-powered skin analysis
 * Gemini Vision + Gemini Pro (No Python Backend)
 */
export const analyzeSkinWithAI = async (imageBase64) => {
    try {
        console.log('🚀 Starting AI-Only Analysis (v5.0)...');
        
        // Call new AI-only service
        const result = await analyzeWithAIOnly(imageBase64);
        
        if (!result.success) {
            throw new Error(result.error || 'Analysis failed');
        }
        
        console.log('✅ AI Analysis complete');
        
        // Return in format compatible with existing UI
        return {
            ...result.data,
            // Backward compatibility
            cv_analysis: result.data,
            vision_analysis: result.data.facial_zones || {},
            ai_insights: result.data.ai_insights,
            engine: result.data.engine,
            analysis_version: result.data.analysis_version
        };
    } catch (error) {
        console.error('❌ AI Analysis Error:', error);
        throw error;
    }
};

/**
 * Wrinkle analysis only (faster) - DEPRECATED
 * Now uses full AI analysis
 */
export const analyzeWrinkles = async (imageBase64) => {
    console.warn('⚠️ analyzeWrinkles is deprecated. Use analyzeSkinWithAI instead.');
    const result = await analyzeSkinWithAI(imageBase64);
    return {
        wrinkle_severity: result.wrinkles?.wrinkle_severity || 0,
        wrinkle_count: result.wrinkles?.wrinkle_count || 0,
        severity: result.wrinkles?.severity || 'Unknown',
        regions: result.wrinkles?.regions || {}
    };
};

/**
 * Pore analysis only - DEPRECATED
 * Now uses full AI analysis
 */
export const analyzePores = async (imageBase64) => {
    console.warn('⚠️ analyzePores is deprecated. Use analyzeSkinWithAI instead.');
    const result = await analyzeSkinWithAI(imageBase64);
    return {
        pore_density: result.pores?.pore_density || 0,
        texture_score: result.pores?.texture_score || 0,
        visibility: result.pores?.visibility || 'Unknown',
        regions: result.pores?.regions || {}
    };
};

/**
 * Check AI services health
 */
export const checkBackendHealth = async () => {
    return await checkAIHealth();
};
