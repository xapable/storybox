"use strict";
/**
 * Cloud Functions for Storybox — T2Q Quiz Generation
 *
 * Deploy: firebase deploy --only functions
 * Set DeepSeek API key: firebase functions:config:set deepseek.key="YOUR_API_KEY"
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateT2Q = void 0;
const logger = __importStar(require("firebase-functions/logger"));
const https_1 = require("firebase-functions/v2/https");
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const SYSTEM_PROMPT = `You are a T2Q story generator. Output only valid T2Q content using the format:
- > Speaker: Text for conversation
- ? Question text
- Numbered options 1) ... 2) ...
- = correct number (1-indexed)
- Blank lines between scenes.
Do not output any extra text, markdown, or explanations. Output only the T2Q content.`;
exports.generateT2Q = (0, https_1.onCall)({ cors: true }, async (request) => {
    const topic = request.data.topic?.trim();
    if (!topic) {
        throw new Error("Topic is required.");
    }
    // In v2 Cloud Functions, functions.config() values are injected as env vars
    // with the pattern: DEEPSEEK_KEY (uppercased, dot becomes underscore)
    const apiKey = process.env.DEEPSEEK_KEY;
    if (!apiKey) {
        logger.error("DEEPSEEK_KEY not configured");
        throw new Error("AI generation is not configured. Set DEEPSEEK_KEY.");
    }
    logger.info(`Generating T2Q for topic: ${topic}`);
    const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Topic: ${topic}` },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });
    if (!response.ok) {
        const errText = await response.text();
        logger.error(`DeepSeek API error: ${response.status} ${errText}`);
        throw new Error(`AI generation failed: ${response.status}`);
    }
    const data = (await response.json());
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
        logger.error("Empty response from DeepSeek", data);
        throw new Error("AI returned an empty response. Try again.");
    }
    logger.info(`Generated ${content.split("\n").length} lines of T2Q`);
    return { content };
});
//# sourceMappingURL=index.js.map