const API_KEY = "AIzaSyBIHn48u9TfGYMxai7FU5pIC7rzE1vBJ7A"; // Ganti dengan key valid
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const analyzeSkin = async (imageBase64) => {
    // Strip the prefix e.g., "data:image/jpeg;base64,"
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const payload = {
        contents: [
            {
                parts: [
                    {
                        text: `Anda adalah AI Dermatologist premium. Analisis foto wajah ini. 
Kembalikan HANYA JSON block tanpa format markdown.
{
  "overall_score": 88,
  "skin_type": "Kombinasi",
  "hydration_level": 75,
  "acne_severity": "Rendah",
  "wrinkles": "Ringan",
  "summary": "Analisis dari AI: Kulit Anda terawat dengan baik. Teruskan hidrasi rutin."
}`
                    },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Data
                        }
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Gemini API Error", err);
            throw new Error('Gagal menghubungi AI Analyzer');
        }

        const data = await response.json();
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        let parsedJson = null;
        try {
            const cleanString = textResponse.replace(/```json/gi, '').replace(/```/gi, '').trim();
            parsedJson = JSON.parse(cleanString);
        } catch (parseErr) {
            console.error("Failed to parse AI JSON response", textResponse, parseErr);
            throw new Error("Respons AI tidak valid");
        }

        return parsedJson;
    } catch (error) {
        console.error("Error during skin analysis:", error);
        throw error;
    }
};
