/**
 * AI Analysis Service — async polling via backend → n8n
 * Flow: POST /analyze → dapat session_id → polling GET /analyze/:id/result
 */

const BACKEND_API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const POLLING_STAGES = [
    { after: 0,     pct: 10, label: 'Mengirim gambar ke AI...' },
    { after: 8000,  pct: 25, label: 'AI menganalisis kulit...' },
    { after: 20000, pct: 40, label: 'Mendeteksi kondisi kulit...' },
    { after: 40000, pct: 55, label: 'Mencari produk yang cocok...' },
    { after: 60000, pct: 70, label: 'Menyusun laporan akhir...' },
    { after: 80000, pct: 80, label: 'Hampir selesai...' },
];

/**
 * Map response n8n ke struktur yang diexpect AnalysisResult.jsx
 */
function mapN8nToAnalysisData(n8nData) {
    const m = n8nData.ai_metrics || {};
    const issues = m.detected_issues || [];

    const findIssue = (kws) => issues.find(i => kws.some(k => (i.issue||'').toLowerCase().includes(k)));
    const acneIssue    = findIssue(['acne','jerawat','komedo']);
    const wrinkleIssue = findIssue(['wrinkle','kerutan','garis']);
    const pigmentIssue = findIssue(['pigment','hiperpigment','flek','pih']);
    const poreIssue    = findIssue(['pore','pori']);

    const sevScore = (sev, good=90) => ({ berat: 25, sedang: 50, ringan: 75 }[sev] || good);

    // Build ai_insights dari output HTML + detected_issues
    // FE render: main_concerns, recommendations, product_recommendations, skincare_routine
    const aiInsights = {
        summary:        n8nData.summary || '',
        output:         n8nData.output  || '',  // HTML fragment — dirender via dangerouslySetInnerHTML

        // main_concerns dari detected_issues
        main_concerns: issues.map(i => `${i.issue}${i.location ? ' (' + i.location + ')' : ''}`),

        // product_recommendations dari n8n DB query
        product_recommendations: (n8nData.recommended_products || []).map(p => ({
            name:      p.name,
            category:  p.category,
            brand:     p.brand,
            reason:    p.resume || p.concerns || '',
            addresses: p.concerns ? p.concerns.split(',').map(c => c.trim()) : [],
            slug:      null,
            image_url: p.image_url || ''
        })),

        // Tidak ada data terstruktur dari n8n untuk ini — kosongkan agar tidak render section kosong
        recommendations:   null,
        skincare_routine:  null,
        timeline:          null,
        key_insights:      null,
        skin_type_analysis: m.analysis_method || null,
    };

    return {
        overall_score:          n8nData.overall_score || parseInt(String(n8nData.skin_health_percentage || m.skin_health_percentage || '0').replace('%','').trim()) || 0,
        skin_health_percentage: n8nData.skin_health_percentage || m.skin_health_percentage || '0%',
        summary:                n8nData.summary || '',
        skin_type:              m.skin_type || 'Tidak dapat ditentukan',
        fitzpatrick_type:       m.fitzpatrick_type || 'Tidak dapat ditentukan',
        analysis_method:        m.analysis_method || '',
        analysis_version:       'n8n-gemini-v1',
        engine:                 'n8n + Google Gemini Vision',

        detected_issues:   issues,
        priority_concerns: issues.map(i => ({ concern: i.issue, severity: i.severity, zones: i.location ? [i.location] : [], advice: '' })),

        acne:        { acne_score: sevScore(acneIssue?.severity), acne_count: acneIssue ? 1 : 0, severity: acneIssue?.severity || 'normal' },
        wrinkles:    { wrinkle_severity: wrinkleIssue ? sevScore(wrinkleIssue.severity, 10) : 10, wrinkle_count: wrinkleIssue ? 1 : 0, severity: wrinkleIssue?.severity || 'minimal' },
        pigmentation:{ uniformity_score: sevScore(pigmentIssue?.severity, 85), dark_spot_count: pigmentIssue ? 1 : 0, severity: pigmentIssue?.severity || 'ringan' },
        pores:       { pore_score: sevScore(poreIssue?.severity, 80), visibility: poreIssue?.severity || 'minimal', enlarged_count: poreIssue ? 1 : 0 },

        ai_insights: aiInsights,
        ai_report:   aiInsights,

        product_recommendations: aiInsights.product_recommendations,
        keywords_used:           n8nData.keywords_used || [],
        tokens_used:             n8nData.tokens_used || {},
        db_id:                   n8nData.db_id || null,
        analyzed_at:             new Date().toISOString(),
    };
}

/**
 * Main: kirim gambar ke BE, polling sampai selesai
 * @param {string} imageBase64
 * @param {boolean} skipValidation
 * @param {Function} onProgress - callback({ pct, label })
 */
export const analyzeSkinWithAI = async (imageBase64, skipValidation = false, onProgress = null) => {
    const startTime = Date.now();
    const notify = (pct, label) => { if (typeof onProgress === 'function') onProgress({ pct, label }); };

    notify(5, 'Mempersiapkan analisis...');

    // Step 1: Kirim ke BE
    const initRes = await fetch(`${BACKEND_API_URL}/api/v2/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: imageBase64, skip_validation: skipValidation })
    });

    if (!initRes.ok) {
        const err = await initRes.json().catch(() => ({}));
        throw new Error(err.error || `Gagal memulai analisis: ${initRes.status}`);
    }

    const { session_id } = await initRes.json();
    if (!session_id) throw new Error('Tidak mendapat session_id dari server');

    notify(10, 'Mengirim gambar ke AI...');

    // Step 2: Simulasi stage awal sambil polling
    const stageTimers = POLLING_STAGES.map(s => setTimeout(() => notify(s.pct, s.label), s.after));

    // Step 3: Polling
    const POLL_INTERVAL = 2500;
    const MAX_WAIT = 300000; // 5 menit
    const pollStart = Date.now();

    try {
        while (Date.now() - pollStart < MAX_WAIT) {
            await sleep(POLL_INTERVAL);

            const pollRes = await fetch(`${BACKEND_API_URL}/api/v2/analyze/${session_id}/result`);
            const pollData = await pollRes.json();

            if (pollData.status === 'processing') {
                // Gunakan pct real dari n8n push jika ada
                if (pollData.pct && pollData.pct > 10) notify(pollData.pct, pollData.stage);
                continue;
            }

            if (pollData.status === 'error') throw new Error(pollData.error || 'Analisis gagal');

            if (pollData.status === 'done') {
                stageTimers.forEach(clearTimeout);
                notify(95, 'Memetakan hasil analisis...');

                const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                const mapped = mapN8nToAnalysisData(pollData.data);

                notify(100, 'Selesai!');
                console.log(`✅ Analysis complete in ${duration}s | score: ${mapped.overall_score}`);

                return { success: true, data: { ...mapped, processing_time: duration } };
            }
        }
        throw new Error('Analisis timeout — coba lagi');
    } finally {
        stageTimers.forEach(clearTimeout);
    }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

