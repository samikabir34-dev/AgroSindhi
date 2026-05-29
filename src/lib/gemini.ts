// gemini.ts – TerraSight AI – 100% on-brand, conversational agricultural advisor

const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
const MODEL = "gemini-2.5-flash"; // fastest + cheapest + still super smart
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are Nazar (نظر), a highly experienced, deeply humble village farmer from Sindh. You DO NOT know any complex science, English acronyms, or numbers with decimals. 
You act as a wise brother to other local farmers.

CRITICAL RULES (YOU MUST NEVER BREAK THESE):
1. NO ENGLISH, NO ACRONYMS: You NEVER say the words "NDVI", "NDWI", or "NDRE". You must NEVER use them even if the user prompts you with them.
2. NO DECIMALS: You NEVER use decimal numbers in your reply. Interpret them silently:
   - For NDVI (Greenness): >0.6 -> "سائي ۽ گهاٽائي زبردست آهي" | <0.4 -> "فصل ڪمزور پيو لڳي"
   - For NDRE (Nutrition): >0.5 -> "فصل جي خوراڪ (نائٽروجن) بلڪل پوري آهي" | <0.3 -> "خوراڪ جي کوٽ آهي"
   - For NDWI (Field Water): <0 -> "هينئر زمين ۾ پاڻي جي سخت کوٽ آهي" | >0 -> "زمين ۾ پاڻي بلڪل پورو موجود آهي"
3. COMPREHENSIVE HUMAN ANALYSIS: When a user asks about a field, review ALL 3 metrics available in the context. Group them logically and tell the farmer about them in simple village Sindhi:
   - Discuss General Health (NDVI)
   - Discuss Nutrition (NDRE)
   - Discuss Moisture & Water Levels (NDWI)
   Then, give ONE clear, practical piece of brotherly advice based on the weakest metric.
4. ALWAYS SPEAK SINDHI: Write exclusively in simple, conversational Sindhi.
5. FIELD NAMES: If the user asks about a specific field (e.g. "عادل جي ٻني"), immediately provide its full analysis using ONLY simple words.

Your tone is extremely humble, brotherly (ادا), and purely localized to Sindh's rural farming culture. Break down all the results like a caring expert neighbor.`;

export interface AnalysisData {
    ndvi: number;
    ndre: number;
    ndwi: number;
    date: string;
    stats?: {
        cloudCover?: number;
        dataQuality?: string;
        ndvi_mean?: number;
        ndvi_max?: number;
        ndvi_min?: number;
        ndre_mean?: number;
        ndwi_mean?: number;
    };
}

// Message type for conversation history
export type Message = { role: "user" | "model"; parts: [{ text: string }] };

/**
 * Chat with Nazar AI - maintains conversation context
 */
export async function chatWithTerraSight(
    userMessage: string,
    history: Message[] = [],
    latestData?: AnalysisData
): Promise<{ reply: string; newHistory: Message[] }> {
    // CRITICAL: Check API key first - DO NOT use fallback logic if key is missing
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === '') {
        console.error('❌ GEMINI_API_KEY is not configured! Please set VITE_GEMINI_API_KEY in your .env file');
        throw new Error("API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    // Inject latest field data ONLY if we have it — but very short & clean
    let enrichedMessage = userMessage.trim();
    if (latestData) {
        const health =
            latestData.ndvi > 0.6 ? "strong 🌱"
                : latestData.ndvi > 0.4 ? "okay"
                    : latestData.ndvi > 0.2 ? "stressed"
                        : "needs help";

        enrichedMessage = `[Latest scan ${latestData.date} → crops are ${health}, NDVI: ${latestData.ndvi.toFixed(3)}, NDRE: ${latestData.ndre.toFixed(3)}, NDWI: ${latestData.ndwi.toFixed(3)}]
${userMessage}`;
    }

    const messages: Message[] = [
        ...history.slice(-12), // keep last 6 exchanges max (saves tokens)
        { role: "user", parts: [{ text: enrichedMessage }] },
    ];

    console.log('🤖 Calling Gemini API with message:', userMessage);

    try {
        const res = await fetch(`${URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                contents: messages,
                generationConfig: {
                    temperature: 0.5, // Lower for maximum precision and to-the-point accuracy
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 2048, // Maximum ceiling for complete, multi-stage reports
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
                ],
            }),
        });

        console.log(`🤖 Gemini API response status: ${res.status} ${res.statusText}`);

        if (!res.ok) {
            const errorText = await res.text();
            let errorDetails;
            try {
                errorDetails = JSON.parse(errorText);
            } catch {
                errorDetails = { message: errorText };
            }

            console.error('❌ Gemini API Error Response:', {
                status: res.status,
                statusText: res.statusText,
                error: errorDetails
            });

            // Provide specific error messages based on status code
            if (res.status === 400) {
                throw new Error(`Invalid API request: ${errorDetails.error?.message || 'Bad Request'}`);
            } else if (res.status === 401 || res.status === 403) {
                throw new Error(`Authentication failed: ${errorDetails.error?.message || 'Invalid API key'}`);
            } else if (res.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a moment.');
            } else if (res.status === 500 || res.status === 503) {
                throw new Error('Gemini API is temporarily unavailable. Please try again.');
            } else {
                throw new Error(errorDetails.error?.message || `API error: ${res.status}`);
            }
        }

        const json = await res.json();

        // Validate response structure
        if (!json.candidates || json.candidates.length === 0) {
            console.error('❌ Invalid API response structure:', json);
            throw new Error('Invalid response from Gemini API');
        }

        const reply =
            json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            "I'm here! Ask me anything about your field 🌾";

        console.log('✅ Gemini API response received:', reply.substring(0, 100) + '...');

        return {
            reply,
            newHistory: [...messages, { role: "model", parts: [{ text: reply }] }],
        };
    } catch (e: any) {
        // Log the full error for debugging
        console.error('❌ TerraSight AI Error:', {
            message: e.message,
            stack: e.stack,
            name: e.name
        });

        // Re-throw the error so the ChatBot component can handle it properly
        // DO NOT use fallback if-else logic here - let the UI show the real error
        throw new Error(e.message || 'نظر اي آءِ سان ڳنڍڻ ۾ ناڪامي پيش آئي');
    }
}

/**
 * Generate AI summary based on field analysis data
 */
export async function generateFieldSummary(analysis: AnalysisData): Promise<string> {
    const health =
        analysis.ndvi > 0.6 ? "strong and healthy"
            : analysis.ndvi > 0.4 ? "decent but could improve"
                : analysis.ndvi > 0.2 ? "stressed and needs attention"
                    : "in urgent need of care";

    const prompt = `You just scanned a field on ${analysis.date}. The crops are ${health} (NDVI: ${analysis.ndvi.toFixed(3)}). Chlorophyll is ${analysis.ndre.toFixed(3)} and water content is ${analysis.ndwi.toFixed(3)}. Give a 2-sentence summary and one action they should take this week.`;

    try {
        const result = await chatWithTerraSight(prompt, [], analysis);
        return result.reply;
    } catch (error) {
        console.error('Summary generation error:', error);

        // Fallback summary with personality
        const action =
            analysis.ndvi < 0.4 ? "آبپاشي جي چڪاس ڪريو ۽ نائٽروجن ڀاڻ وجهڻ تي غور ڪريو." :
                analysis.ndwi < 0 ? "پاڻي جي سطح تي نظر رکو ۽ ضرورت مطابق پاڻي ڏيو." :
                    "سٺو ڪم جاري رکو ۽ 5 کان 7 ڏينهن ۾ ٻيهر اسڪين ڪريو.";

        return `🌾 توهان جي ٻني ${health} ٻوٽن جي نشونما ڏيکاري رهي آهي (NDVI: ${analysis.ndvi.toFixed(3)}). ${action}. ڊيٽا ڪوالٽي ${analysis.stats?.dataQuality || 'سٺي'} آهي!`;
    }
}

/**
 * Structured summary interface for AI insights
 */
export interface StructuredSummary {
    statsExplanation: string;  // What the stats mean
    problemAnalysis: string;   // What is the problem
    solutionAdvice: string;    // What is the solution
}

/**
 * Generate structured AI insights with stats explanation, problem, and solution
 */
export async function generateStructuredInsights(analysis: AnalysisData): Promise<StructuredSummary> {
    // Calculate overall health for context
    const compositeScore = (analysis.ndvi * 0.5) + (analysis.ndre * 0.3) + (Math.max(0, analysis.ndwi) * 0.2);
    const healthStatus =
        compositeScore > 0.6 ? "excellent" :
            compositeScore > 0.4 ? "good" :
                compositeScore > 0.2 ? "moderate" : "poor";

    const prompt = `Analyze this field data and respond with EXACTLY this JSON format (no extra text):
{
  "statsExplanation": "2-3 lines explaining what NDVI ${analysis.ndvi.toFixed(3)}, NDRE ${analysis.ndre.toFixed(3)}, NDWI ${analysis.ndwi.toFixed(3)} mean for the farmer",
  "problemAnalysis": "2-3 lines identifying any issues or concerns based on these values",
  "solutionAdvice": "2-3 lines with specific actionable recommendations"
}

Field data: NDVI=${analysis.ndvi.toFixed(3)} (vegetation), NDRE=${analysis.ndre.toFixed(3)} (chlorophyll), NDWI=${analysis.ndwi.toFixed(3)} (water). Overall: ${healthStatus}. Date: ${analysis.date}.
Be concise, practical, farmer-friendly. Use simple words.`;

    try {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === '') {
            throw new Error("API key not configured");
        }

        const res = await fetch(`${URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: "You are a JSON-only agricultural AI. Respond with valid JSON only." }] },
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.6,
                    topP: 0.9,
                    maxOutputTokens: 500,
                },
            }),
        });

        if (!res.ok) throw new Error("API request failed");

        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                statsExplanation: parsed.statsExplanation || getFallbackStats(analysis),
                problemAnalysis: parsed.problemAnalysis || getFallbackProblem(analysis),
                solutionAdvice: parsed.solutionAdvice || getFallbackSolution(analysis),
            };
        }
        throw new Error("Invalid JSON response");
    } catch (error) {
        console.error('Structured insights error:', error);
        return {
            statsExplanation: getFallbackStats(analysis),
            problemAnalysis: getFallbackProblem(analysis),
            solutionAdvice: getFallbackSolution(analysis),
        };
    }
}

// Fallback functions for when API fails
function getFallbackStats(analysis: AnalysisData): string {
    return `توهان جي فصل جي سائي ۽ گهاٽائي بهترين آهي. ٻوٽن جي خوراڪ جي سطح بلڪل صحيح آهي جيڪا صحتمند فصل هجڻ جي نشاني آهي. انهي سان گڏ توهان جي ٻنيءَ ۾ پاڻي جي مقدار به مناسب آهي.`;
}

function getFallbackProblem(analysis: AnalysisData): string {
    if (analysis.ndvi < 0.3) return "توهان جي فصلن جي صحت بهترين سطح کان هيٺ آهي. ٻوٽن کي خشڪسالي، خوراڪ جي کوٽ يا بيماري هجي سگهي ٿي. فوري توجه جي ضرورت آهي.";
    if (analysis.ndwi < -0.1) return "توهان جي ٻني ۾ پاڻي جي کوٽ آهي. ٻوٽن کي مناسب نمي نٿي ملي. جيڪڏهن فوري حل نه ڪيو ويو ته فصل جي پيداوار متاثر ٿي سگهي ٿي.";
    if (analysis.ndre < 0.2) return "ڪلوروفل جي سطح مان نائٽروجن جي کوٽ جو شڪ ٿي رهيو آهي. ٻوٽا پيلا ٿي سگهن ٿا يا انهن جي واڌ ويجهه گهٽجي سگهي ٿي.";
    return "ڪو وڏو مسئلو ناهي. توهان جي ٻني صحتمند حالت ۾ آهي. فصل جي بهترين صحت برقرار رکڻ لاءِ نگراني جاري رکو.";
}

function getFallbackSolution(analysis: AnalysisData): string {
    if (analysis.ndvi < 0.3) return "🌱 بيمارين لاءِ پنهنجي ٻنيءَ جو جائزو وٺو. مٽي جي ٽيسٽ ڪريو ۽ مناسب ڀاڻ وڌو. يقين ڪريو ته پاڻي جي فراهمي مناسب ۽ صحيح طريقي سان ٿي رهي آهي.";
    if (analysis.ndwi < -0.1) return "💧 پاڻي ڏيڻ جو وقت يا وقفو وڌايو. پائپ يا ڦوهارن جي چڪاس ڪريو ته اهي بند ته ناهن. مٽي ۾ نمي برقرار رکڻ لاءِ ملچ (ٻوٽن جو ڪچرو) استعمال ڪريو.";
    if (analysis.ndre < 0.2) return "🌾 نائٽروجن سان ڀرپور ڀاڻ وڌو. تيز اثر لاءِ پنن تي اسپري (Foliar spray) ڪرڻ تي غور ڪريو. بهتري ڏسڻ لاءِ 7-10 ڏينهن ۾ ٻيهر اسڪين ڪريو.";
    return "✨ موجوده طريقي کي جاري رکو. 1-2 هفتن ۾ ٻيو اسڪين شيڊول ڪريو. جيڪڏهن فصل پڪو آهي ته لڻڻ جي منصوبه بندي ڪريو.";
}

// Legacy function for backward compatibility
export async function chatWithGemini(message: string, context?: AnalysisData): Promise<string> {
    const result = await chatWithTerraSight(message, [], context);
    return result.reply;
}

