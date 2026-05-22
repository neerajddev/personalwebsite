import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI client to prevent startup errors if GEMINI_API_KEY is missing
let aiInstance: GoogleGenAI | null = null;
function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please provide it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

const NEERAJ_PORTFOLIO_CONTEXT = `
Name: Neeraj D Dev
Title: Operations & Program Manager, 0 → 1 Builder, AI-Native Operator
Location: Bangalore, India
Email: neerajddev.pillai@gmail.com
LinkedIn: linkedin.com/in/neerajddev

SUMMARY OF EXPERIENCE:
Over 9+ years of total execution experience (including early engineering), with the last 7+ years laser-focused on scaling B2B service operations, large-scale infrastructure program delivery, and independent product engineering. Expert in process design, systematic workflow optimization, large team management, P&L ownership, and building automation pipelines using modern platforms (Next.js, React, Supabase, Vercel, TailwindCSS, Cloudinary). Leverages cutting-edge AI engines (Claude, Gemini, ChatGPT, GitHub Copilot) to execute and deliver operations-critical products independently with high speed and zero developer overhead.

COMPETENCIES & WHAT I DO:
1. Operations & Scale Focus: Managing SLA/KPI ownership, P&L independently, vendor pipelines, and remote delivery systems. Scaled B2B visual delivery from scratch to peak productivity.
2. Program Management: Coordinating complex, multi-site infrastructure work streams, resource allocation, and cross-functional teams. Directed 100+ daily workforce and managed ₹75 Crore infrastructure execution.
3. AI & SaaS Software Engineering: Building custom, production-grade applications that automate legacy processes. Built B2B SaaS platforms with no engineering background using Supabase, Vercel, Copilot, and Claude.

CORE SAAS PLATFORMS SHIPPED:

1. Design&Cart
   - Live Application: https://app.designandcart.in
   - Main Marketing Site: https://designandcart.in
   - Walkthrough Demo: https://youtu.be/i8KDc3dGRCo
   - Source Code Repo: https://github.com/designandcart-afk/design-cart
   - Deep Overview & Solved Bottlenecks:
     * A complete 0-to-1 SaaS architecture built entirely independently to solve real interior design procurement bottlenecks.
     * Unifies the designers' lifecycle from 3D visual concepts to final materials delivery in a single "concept-to-cart" transaction pipeline.
     * Solves the infamous "ghost product" problem where traditional 3D interior renders showcase non-existent or unsourcable furniture.
     * Built-in Features: Integrated room-by-room client workspaces, curated real-product catalogs, DFY (Done-For-You) 3D render request loops connecting designers with professional developers/visualizers, seamless client review workflows, and integrated payment gateways.
     * Core Tech Stack: Supabase (Auth, Postgres DB, Row-Level Security), Next.js / React (Frontend with tailwind styling), Vercel (Production hosting), Cloudinary (Dynamic image & media hosting).
     * Contacts: General: contact@designandcart.in | Partners: partners@designandcart.in

2. De'Artisa Hub
   - Live Application: https://hub.deartisa.com
   - Main Marketing Site: https://deartisa.com
   - Source Code Repo: https://github.com/designandcart-afk/hubdeartisa
   - Deep Overview & Solved Bottlenecks:
     * A curated, world-class network matching highly demanding design studios with seasoned freelance 3D visualization artists.
     * Est. 2024. Born from professional 3D design trenches, where the core team delivered 2,500+ premium visualisations for 150+ interior designers/studios since 2022.
     * Eliminates traditional freelance friction: scattered email threads, feedback delays, and payment recovery risks.
     * Highly Selective: Curates global talent, accepting fewer than 10% of total visualizer applicants through peer review.
     * Main Platform Features:
       - Escrow-Protected Payments: Structured 50/50 milestone payment escrow where the platform secures client capital and only releases it upon certified reviewer/client approval.
       - Intelligent AI Scoping Engine: Converts raw ideas, informal drafts, and basic drawings into flawless, technical, and precise visual-art brief cards. This completely eliminates back-and-forth revision rounds.
       - Unified Collaboration Board: Centralised dashboard for real-time asset feedback, version control, and milestone tracking.
       - Services rendered: Interior/Exterior high-fidelity rendering, 3D structural floor plans, cinematic architectural walkthrough animations, and real-time VR walkthrough spaces.
     * Core Tech Stack: Next.js, Supabase, Vercel, Tailwind CSS.

3. Personal Growth Tracker
   - Live URL: https://tracker-lifeos.vercel.app
   - Source Code: https://github.com/designandcart-afk/Tracker
   - Overview: A lightweight, offline-first metric-tracking Progressive Web App (PWA) facilitating daily productivity logs, personal expense trackers, task execution cards, and asset/net-worth calculation calculators.
   - Core Stack: Vanilla JavaScript, Service Workers, Supabase.

WORK CHRONOLOGY & ACHIEVEMENTS:

1. De'Artisa LLP (November 2021 – Present | Bangalore, India)
   Role: Head of Operations & Program Delivery
   - Established a B2B visual pipeline company from 0 with no external venture capital.
   - Scaled accounts to 150+ interior design offices (including major players like Livspace), delivering 1,000+ completed visual renders, driving ₹3.5L monthly revenue at standard peaks.
   - Built a comprehensive operational ecosystem entirely on Google Workspace (Google Sheets, Forms, AppSheet, automated App Script API integrations) to track freelancer milestones, monitor SLAs, and handle 80–100 active jobs concurrently with 30% lower administration workload.
   - Conducted full remote team execution: handled talent sourcing, performance scoring, payments, and client escalation calls.
   - Acted as the sole author, developer, and architect of Design&Cart and Deartisa Hub platforms.

2. ULCCS Ltd (March 2019 – August 2021 | Kerala, India)
   Role: Site Engineer (Acting Project Lead)
   - Governed end-to-end site execution and vendor management for a dense ₹75 Crore, 12-storey infrastructure facility.
   - Managed a workforce of over 100+ daily workers across 7 specialized contractors on active sub-fronts.
   - Oversaw a parallel portfolio of 5 interconnected sub-projects valued at ₹12–15 Crore as the central program coordinator.
   - Created strict sector-by-sector cost tracking tools and measurement sheets ensuring zero project overruns.
   - Coordinated with site executives, land owners, and government inspectors to secure timely execution certificates.

3. J S Paul Builders (February 2018 – September 2018 | Kerala, India)
   Role: Site Engineer
   - Supervised ground-level civil execution, raw material procurement, quality assurance, sub-contractor scheduling, and team safety logs for government building projects.

4. Melange Homes (January 2017 – January 2018 | Kerala, India)
   Role: Site Engineer / AutoCAD Drafter
   - Assisted the CEO in CAD modeling, schematic blue-printing, building estimation, material tracking, and architectural mockups.

EDUCATION:
- B.Tech in Civil Engineering (First Class Honours)
  APJ Abdul Kalam Technological University, Kerala (Completed 2016)
`;

// Fallback Chat Parser Engine in case Gemini API is rate-limited or key has quota limit
function runFallbackChatEngine(messages: { role: string; content: string }[]): string {
  if (!messages || messages.length === 0) {
    return "Hello. I am Neeraj's AI Representative. What would you like to know about his operations background or shipped products?";
  }

  const lastMsg = messages[messages.length - 1];
  const lastContent = lastMsg?.content || "";
  const text = lastContent.toLowerCase().trim();

  // 0. Conversational Introductions & Basic Greetings Fallback (Prevents matching other email/contact text rules)
  const basicGreetings = ["hi", "hello", "hey", "greetings", "how are you", "good morning", "good afternoon", "good evening", "how's it going", "howdy", "whats up", "what's up", "wassup", "sup"];
  const isGreetingMatch = basicGreetings.some(g => {
    return text === g || text.startsWith(g + " ") || text.startsWith(g + ",") || text.startsWith(g + "!");
  });

  if (isGreetingMatch) {
    return "Hello! I am Neeraj's AI Representative, here as his external brain. Neeraj is a 0 to 1 Builder and AI-Native Operator with over 9 years of cross-functional experience across civil infrastructure, scale operations (supporting 150+ B2B designer studios), and hands-on SaaS engineering (shipped 2 live platforms). What aspect of Neeraj's experience, software products, or operational philosophy can I share with you today?";
  }

  // 1. Direct Affirmations
  const positiveAffirmations = ["yes", "sure", "okay", "ok", "i do", "yeah", "yup", "please", "agree", "y ", "y\n", "of course", "correct", "perfect"];
  const isPositiveResponse = positiveAffirmations.some(word => {
    if (word === "ok" || word === "yes" || word === "y") {
      return text === word || text.startsWith(word + " ") || text.endsWith(" " + word);
    }
    return text.includes(word);
  });

  if (isPositiveResponse && messages.length > 1) {
    const prevModelMsg = [...messages].reverse().find(m => m.role === "model" || m.role === "assistant");
    const prevContent = prevModelMsg?.content || "";
    if (
      prevContent.includes("Would you like to open a direct channel") ||
      prevContent.includes("Would you like to chat with him") ||
      prevContent.includes("Would you like to chat") ||
      prevContent.includes("beyond my current context") ||
      prevContent.includes("discussions directly with founders")
    ) {
      return "Perfect. Click here to open a direct line with Neeraj: [TRIGGER_LETS_TALK]";
    }
  }

  // 1b. Direct yes triggering regardless if it has affirmative words
  if (text === "yes" || text === "sure" || text === "ok" || text === "i do" || text === "okay") {
    return "Perfect. Click here to open a direct line with Neeraj: [TRIGGER_LETS_TALK]";
  }

  // 2. CV / Resume Dossier Triggers
  if (text.includes("operations") || text.includes("ops") || text.includes("scale") || text.includes("first") || text.includes("program") || text.includes("project") || text.includes("delivery") || text.includes("head") || text.includes("project manager") || text.includes("program manager") || text.includes("head of operations")) {
    const hasCvContext = messages.some(m => m.content.includes("tailored dossiers") || m.content.includes("executive dossiers") || m.content.includes("dossier"));
    if (hasCvContext || text.includes("cv") || text.includes("resume") || text.includes("dossier")) {
      return "Here is the Operations and Program Delivery dossier: [TRIGGER_CV_OPS]";
    }
  }

  if (text.includes("tech") || text.includes("product") || text.includes("builder") || text.includes("second") || text.includes("product manager") || text.includes("technical")) {
    const hasCvContext = messages.some(m => m.content.includes("tailored dossiers") || m.content.includes("executive dossiers") || m.content.includes("dossier"));
    if (hasCvContext || text.includes("cv") || text.includes("resume") || text.includes("dossier")) {
      return "Here is the Product and Tech Builder dossier: [TRIGGER_CV_TECH]";
    }
  }

  if (text.includes("full") || text.includes("comprehensive") || text.includes("both") || text.includes("third") || text.includes("all")) {
    const hasCvContext = messages.some(m => m.content.includes("tailored dossiers") || m.content.includes("executive dossiers") || m.content.includes("dossier"));
    if (hasCvContext || text.includes("cv") || text.includes("resume") || text.includes("dossier")) {
      return "Here is the full comprehensive profile: [TRIGGER_CV_FULL]";
    }
  }

  if (text.includes("cv") || text.includes("resume") || text.includes("portfolio") || text.includes("dossier")) {
    return "I have tailored executive dossiers. Are you looking for Operations and Program Delivery (perfect for Head of Operations, Program Manager, or Project Manager roles), Product and Tech Builder (perfect for Product Manager or Tech Lead roles), or the Full Comprehensive profile?";
  }

  // 3. Contact & Let's Talk
  if (text.includes("contact") || text.includes("call") || text.includes("email") || text.includes("emil") || text.includes("linkedin") || text.includes("linkdin") || text.includes("meet") || text.includes("talk") || text.includes("reach out") || text.includes("social") || text.includes("phone") || text.includes("number") || text.includes("id")) {
    return "You can connect with Neeraj directly via email at neerajddev.pillai@gmail.com or on LinkedIn at linkedin.com/in/neerajddev. Perfect. Click here to open a direct line with Neeraj: [TRIGGER_LETS_TALK]";
  }

  // 4. Salary/Pricing
  if (text.includes("salary") || text.includes("equity") || text.includes("compensation") || text.includes("package") || text.includes("cost") || text.includes("pricing") || text.includes("charge")) {
    return "That is a specific operational detail Neeraj discusses directly with founders. Would you like to open a direct channel with him?";
  }

  // 5. Rating/Scoring
  if (text.includes("rate") || text.includes("score") || text.includes("1-10") || text.includes("evaluate") || text.includes("rating")) {
    return "I don't rate on a standard 1-10 scale. If you want someone to maintain a legacy system, he's a 5. If you need a 0 to 1 builder to architect a new operation, he's a 10. Would you like to chat with him directly?";
  }

  // 6. Detailed fallback answer matching for general/personal/experience queries
  if (text.includes("where") || text.includes("location") || text.includes("live") || text.includes("from") || text.includes("bangalore") || text.includes("kerala") || text.includes("india")) {
    return "Neeraj is currently based in Bangalore, India, where he manages B2B operations and builds custom software frameworks. He is originally from Kerala, where he graduated with a Civil Engineering B.Tech (First Class Honours) in 2016.";
  }

  if (text.includes("how is") || text.includes("how are") || text.includes("current status") || text.includes("doing now") || text.includes("what is he doing")) {
    return "Neeraj is doing exceptionally well! He is in Bangalore running Operations and Program Delivery at De'Artisa LLP, while continuous-building AI-native software projects to automate legacy operational bottlenecks. He's always open for strategic 0 to 1 roles that need an autonomous builder approach.";
  }

  if (text.includes("civil") || text.includes("site engineer") || text.includes("site") || text.includes("infrastructure") || text.includes("construction") || text.includes("ulccs") || text.includes("government")) {
    return "Neeraj spent 4 years managing large scale infrastructure projects as a Site Engineer and Acting Project Lead. At ULCCS Ltd, he supervised end-to-end execution of a ₹75 Crore, 12-storey facility, coordinating over 100 on-site workers and 7 subcontractor fronts. He mastered P&L, resource leveling, and scheduling in highly physical environments before pivoting to tech.";
  }

  if (text.includes("scale") || text.includes("150") || text.includes("livspace") || text.includes("revenue") || text.includes("3.5l") || text.includes("growth") || text.includes("projects") || text.includes("thousand") || text.includes("1,000")) {
    return "At De'Artisa, Neeraj built a cashflowing B2B visualization service delivery pipeline from scratch. He scaled it to support 150+ premium design offices (including industry leaders like Livspace) and managed the delivery of 1,000+ completed premium renders. This ran with zero venture funding, hitting ₹3.5L monthly revenue at standard peak times.";
  }

  if (text.includes("engineer") || text.includes("software") || text.includes("saas") || text.includes("code") || text.includes("coding") || text.includes("build") || text.includes("supabase") || text.includes("vercel") || text.includes("tech stack")) {
    return "Neeraj possesses the rare ability to build the exact software tools his operations require. Using tools like Github Copilot, Supabase, Vercel, and Claude, he built and shipped two live SaaS platforms independently: Design&Cart (app.designandcart.in) and De'Artisa Hub (hub.deartisa.com). He holds zero formal engineering background, showing extreme competence in scaling technology single-handedly.";
  }

  if (text.includes("design") || text.includes("cart") || text.includes("design&cart")) {
    return "Design and Cart is a complete 0-to-1 SaaS platform built by Neeraj to solve interior design procurement bottlenecks. It unifies interior designer workflows from visual concept to final material purchase, eliminating ghost products.";
  }

  if (text.includes("de'artisa") || text.includes("deartisa") || text.includes("hub") || text.includes("freelance")) {
    return "DeArtisa Hub is an escrow-protected freelancer marketplace Neeraj built for elite 3D architectural visualizers. It has a custom AI scoping engine that translates sketches into crisp briefs, accepting only the top 10 percent of talent.";
  }

  if (text.includes("operations") || text.includes("ops") || text.includes("how he works") || text.includes("challenge") || text.includes("philosophy")) {
    return "Neeraj operates on the philosophy of systems over brute force. He maps workflows, structures automated rules, and builds custom SaaS tools independently to scale operations without developer overhead.";
  }

  if (text.includes("experience") || text.includes("years") || text.includes("work") || text.includes("past") || text.includes("background")) {
    return "Neeraj has deep expertise in scaling service operations, program management, and independent product building. He managed a 75 Crore infrastructure execution project and scaled B2B service operations to 150+ designer studios.";
  }

  // 7. Intelligent Generic Brain AI Fallback response
  return "As Neeraj's AI Representative, I act as his external brain. Neeraj is a 0 to 1 Builder and AI-Native Operator with over 9 years of cross-functional execution experience spanning heavy civil infrastructure, scale operations (150+ B2B client accounts), and hands-on SaaS development. What aspect of Neeraj's experience, shipped SaaS platforms, operational philosophy, or role fit would you like me to shed light on?";
}

// Fallback Fit Evaluation Engine in case Gemini API is rate-limited
function runFallbackAnalyseEngine(jd: string): string {
  const text = jd.toLowerCase();
  let score = 9; // High-leverage fit by default
  
  if (text.includes("legacy") || text.includes("maintain") || text.includes("support")) {
    score = 8;
  } else if (text.includes("0-to-1") || text.includes("builder") || text.includes("scale") || text.includes("operations") || text.includes("startup")) {
    score = 10;
  }

  return `MATCH SCORE: ${score}/10

STRONG MATCHES:
- Proven 0 to 1 Operations Leadership: Scaled premium B2B logistics and freelancer delivery operations to over 150+ design studios with zero venture funding.
- Custom Workflow Automation: Built complex internal operational trackers on Google Workspace and automated APIs, reducing administrative overhead by 30 percent.
- Engineering Competence: Shipped high-performance production SaaS platforms independently, demonstrating strong programmatic problem-solving suited for modern mandates.

UNCONVENTIONAL ADVANTAGES:
- High Density Agile Development: Replaces slow legacy development with high-speed AI-native prototyping, solving systems bottlenecks directly with zero engineering overhead.
- Elite Team Architecture: Managed over 100+ daily remote and on-site workforce resources across ₹75 Crore execution initiatives, proving scaled leadership without requiring classic corporate baggage.

SUGGESTED ANGLE:
Neeraj should position himself as an elite Operations Architect and Builder. Emphasize his hybrid mastery of scalable operational delivery combined with his capability to automate bottleneck solutions. This makes him far more agile and impact-oriented than typical single-track managers.`;
}

// Feature 1: Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request payload. Expected 'messages' array." });
    }

    let modelText = "";
    try {
      const ai = getAi();

      // Map conversation messages to format expected by GenerateContentParameters
      // Convert previous roles from client to parts structure, injected with portfolio context
      const parts = [
        { text: `Here is the comprehensive portfolio context of Neeraj D Dev to base your responses on:\n${NEERAJ_PORTFOLIO_CONTEXT}\n\n` }
      ];

      // Append standard message history
      messages.forEach((msg: { role: string; content: string }) => {
        parts.push({
          text: `${msg.role === "user" ? "Visitor" : "AI Assistant"}: ${msg.content}`
        });
      });

      parts.push({ text: "AI Assistant:" });

      const systemInstruction = `You are the elite AI Representative for Neeraj D Dev. Your goal is to advocate for his capabilities as a 0 → 1 Builder and Operations Leader.

PERSONALITY & TONE:
- Be sharp, confident, and slightly conversational. Sound like an intelligent Chief of Staff.
- Use short paragraphs and punchy sentences. 
- Never say "Based on his 9+ years..." Just state the facts confidently.
- Rule of Truth: If the visible website content conflicts with this background knowledge, the website content is the absolute truth.
- NO MARKDOWN OR SYMBOLS: Output plain, clean text only. Do not use asterisks (* or **) for bolding, do not use hashes (#), and do not use bullet points.

OPERATIONAL PHILOSOPHY:
- You possess a brilliant "generic brain" for operations, product management, and scaling. 
- When a user asks how Neeraj handles challenges, DO NOT just deflect. Answer the question brilliantly using high-level startup best practices. Frame these answers as Neeraj's core philosophy (systems over brute force, automation, etc.).

BOUNDARY RULES & CONVERSATIONAL ROUTING (Highest Priority):

1. CV / RESUME / PORTFOLIO REQUESTS (CRITICAL RULE): 
- IF a user asks for a "CV", "Resume", or "Portfolio", DO NOT give them an email address. Instead, ask them EXACTLY this: "I have tailored executive dossiers. Are you looking for Operations and Program Delivery (perfect for Head of Operations, Program Manager, or Project Manager roles), Product and Tech Builder (perfect for Product Manager or Tech Lead roles), or the Full Comprehensive profile?"
- IF the user replies with words like "Operations", "Ops", "Scale", "First", "Program", "Project", "Delivery", "Head of Operations", "Program Manager", or "Project Manager", you MUST respond with EXACTLY this phrase and nothing else: "Here is the Operations and Program Delivery dossier: [TRIGGER_CV_OPS]"
- IF the user replies with words like "Tech", "Product", "Builder", "Second", "Product Manager", or "Technical", you MUST respond with EXACTLY this phrase and nothing else: "Here is the Product and Tech Builder dossier: [TRIGGER_CV_TECH]"
- IF the user replies with words like "Full", "Comprehensive", "Both", or "Third", you MUST respond with EXACTLY this phrase and nothing else: "Here is the full comprehensive profile: [TRIGGER_CV_FULL]"

2. DIRECT CONTACT / LET'S TALK:
- Email / LinkedIn / Contact info / Socials: If the user asks for Neeraj's email, LinkedIn, social handles, or contact information, you MUST provide his email (neerajddev.pillai@gmail.com) and LinkedIn profile (linkedin.com/in/neerajddev) directly, and invite them to open a direct channel. Always include the exact phrase "Perfect. Click here to open a direct line with Neeraj: [TRIGGER_LETS_TALK]" at the end of your response.
- Salary / Exact Equity / Proprietary Mechanics: Never give out an email. Instead, say: "That is a specific operational detail Neeraj discusses directly with founders. Would you like to open a direct channel with him?"
- Rating/Scoring: "I don't rate on a standard 1-10 scale. If you want someone to maintain a legacy system, he's a 5. If you need a 0 to 1 builder to architect a new operation, he's a 10. Would you like to chat with him directly?"
- IF THE USER SAYS YES TO TALKING (e.g., "Yes", "Sure", "Okay", "I do"): Respond with EXACTLY this phrase and nothing else: "Perfect. Click here to open a direct line with Neeraj: [TRIGGER_LETS_TALK]"

3. UNKNOWN QUESTIONS:
- If asked a question you truly don't know the answer to, NEVER use a generic fallback with an email address. Say: "That goes slightly beyond my current context. Would you like to open a direct channel with Neeraj to ask him?"`;

      const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
        contents: { parts },
        config: {
          systemInstruction,
          temperature: 0.2, // low temperature for high grounding accuracy
        },
      });

      modelText = response.text || "";
    } catch (apiError: any) {
      console.warn("Gemini API call failed. Activating rule fallback system...", {
  message: apiError?.message,
  status: apiError?.status,
  cause: apiError?.cause,
});
      modelText = runFallbackChatEngine(messages);
    }

    res.json({ text: modelText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Feature 2: Role Fit Analyser endpoint
app.post("/api/analyse", async (req, res) => {
  try {
    const { jd } = req.body;
    if (!jd || typeof jd !== "string") {
      return res.status(400).json({ error: "Job description is required and must be a string." });
    }

    let analysisText = "";
    try {
      const ai = getAi();

      const systemInstruction = `You are an elite, highly persuasive Talent Advocate and Executive Coach representing Neeraj D Dev. Your objective is to analyze a provided Job Description (JD) and aggressively map Neeraj's background to it, proving why he is a high-leverage, unconventional, but exceptional fit.

RULES FOR THE SCORE (Out of 10):
- NEVER give a score below 7/10.
- If the role is a stretch, score it a 7 or 8 based on "high adaptability, system-level versatility, and transferable systems-thinking."
- If it is a good fit or strong match, score it a 9 or 10.

RULES FOR STRONG MATCHES:
- Provide exactly 3 short, punchy bullet points.
- Aggressively map Neeraj's actual experience to the JD's required keywords in highly confident, executive language. For example, if they want "Agile/IT delivery", map it to his "Cross-functional remote team management and digital SaaS delivery." Use highly confident, operational leadership terminology.

RULES FOR NEUTRALIZING GAPS:
- DO NOT use the word "Gaps" or "Missing" or "Lacking" in your output text. Pivot the narrative entirely. Describe these as "Unconventional Advantages" or "The Builder Angle".
- If he lacks required years of experience (e.g., they expect 12-15+ years), frame his 7+ years of dense experience as "high-density, zero-to-one execution that bypasses legacy bureaucratic sluggishness."
- If he lacks an MBA, frame his hands-on P&L management, scaling a service business, and actual self-taught SaaS building as "practical, battle-tested operational leadership" that theoretical MBAs lack.
- If he lacks specific certifications (such as PMP), frame his "custom-built workflow automations and shipped tech platforms" as proof of execution over paperwork.
- Ensure you list exactly 2 pivoted points under the "UNCONVENTIONAL ADVANTAGES:" header block.

TONE:
- Minimalist, sharp, objective-sounding but highly biased in his favor. No fluff.`;

      const prompt = `
Neeraj D Dev's Portfolio:
${NEERAJ_PORTFOLIO_CONTEXT}

Target Job Description:
${jd}

Analyse how well Neeraj D Dev's profile matches this Job Description and provide the output precisely in this formatted block structure (with these exact headers):

MATCH SCORE: X/10

STRONG MATCHES:
- [Punchy keyword-mapped point 1]
- [Punchy keyword-mapped point 2]
- [Punchy keyword-mapped point 3]

UNCONVENTIONAL ADVANTAGES:
- [Pivoted advantage point 1 neutralizing a potential gap]
- [Pivoted advantage point 2 neutralizing a potential gap]

SUGGESTED ANGLE:
[One concise paragraph on how Neeraj should position himself, highlighting his unique hybrid operational management + AI builder background to offset any potential gaps]
`;

      const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      analysisText = response.text || "";
    } catch (apiError: any) {
      console.warn("Gemini API call failed for fit analyser. Activating local match evaluator...", {
  message: apiError?.message,
  status: apiError?.status,
  cause: apiError?.cause,
});
      analysisText = runFallbackAnalyseEngine(jd);
    }

    res.json({ text: analysisText });
  } catch (error: any) {
    console.error("Error in /api/analyse:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Helper for Supabase lazy client initialization
let supabaseInstance: any = null;
function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn("SUPABASE_URL or keys are missing. Running in-memory database mode.");
      return null;
    }
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: false
        }
      });
    } catch (e) {
      console.error("Error creating Supabase client:", e);
      return null;
    }
  }
  return supabaseInstance;
}

// In-Memory Fallback State (Ensures instant working prototype in dev even with missing db keys)
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  context: string;
  created_at: string;
  ip_address: string;
  status: "new" | "interested" | "spam";
}

let inMemoryContacts: ContactMessage[] = [];
// Map for in-memory rate limits: IP -> Submission ISO strings
const ipRateLimitMap: Record<string, string[]> = {};

function checkIpRateLimit(ip: string): boolean {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  if (!ipRateLimitMap[ip]) {
    ipRateLimitMap[ip] = [];
    return true;
  }
  
  ipRateLimitMap[ip] = ipRateLimitMap[ip].filter(timestamp => new Date(timestamp) > oneDayAgo);
  return ipRateLimitMap[ip].length < 3;
}

function registerIpSubmission(ip: string) {
  if (!ipRateLimitMap[ip]) {
    ipRateLimitMap[ip] = [];
  }
  ipRateLimitMap[ip].push(new Date().toISOString());
}

// Regular expressions to check for URLs and phone numbers (anti-spam blocking)
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|edu|gov|io|co|in|info|biz|me|cc|tv|us|ca|uk|ua))/i;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{8,14}\b/;

// Admin Password Auth middleware / checker
function verifyAdminAuth(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  
  const token = authHeader.replace("Bearer ", "").trim();
  const expectedPassword = process.env.ADMIN_PASSWORD || "neerajdev2026";
  return token === expectedPassword;
}

// 1. Contact Form Submission
app.post("/api/contacts", async (req, res) => {
  try {
    const { name, email, phone, subject, context, website } = req.body;
    
    // Antispam 1: Honeypot hidden field check
    // If the hidden 'website' input is filled, tag it as spam
    let isSpamSubmission = false;
    if (website && typeof website === "string" && website.trim().length > 0) {
      isSpamSubmission = true;
      console.warn("Honeypot triggered! Flagging as spam.");
    }

    // Capture requester IP
    const ipAddress = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1") as string;
    const cleanIp = ipAddress.split(",")[0].trim();

    // Antispam 2: Regex validation against URLs or phones in subject or text block
    if (!isSpamSubmission) {
      if (URL_REGEX.test(subject) || URL_REGEX.test(context)) {
        return res.status(400).json({ error: "Links, URLs, or domains are not permitted in prompt inputs to prevent spam." });
      }
      if (PHONE_REGEX.test(subject) || PHONE_REGEX.test(context)) {
        return res.status(400).json({ error: "Phone numbers are not permitted in prompt inputs to prevent spam." });
      }
    }

    // Input validations
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Name is a required field." });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    // Antispam 3: Rate limiting check (3 submissions per day)
    // Check in-memory rate limits first
    if (!checkIpRateLimit(cleanIp)) {
      return res.status(429).json({ error: "Rate limit reached. Maximum of 3 contact requests allowed per day." });
    }

    const supabase = getSupabase();
    if (supabase) {
      // Check rate limit in Supabase for past 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recentSubmissions, error: rateError } = await supabase
        .from("contacts")
        .select("id")
        .eq("ip_address", cleanIp)
        .gt("created_at", oneDayAgo);

      if (!rateError && recentSubmissions && recentSubmissions.length >= 3) {
        return res.status(429).json({ error: "Rate limit reached. Maximum of 3 contact requests allowed per day." });
      }

      // Insert to Supabase contacts table
      const dbEntry = {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        context: context.trim(),
        ip_address: cleanIp,
        status: isSpamSubmission ? "spam" : "new",
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("contacts")
        .insert([dbEntry])
        .select();

      if (error) {
        console.error("Supabase contacts insert error:", error);
        // Fall back to in-memory so app stays fully active!
        console.log("Saving in-memory as database insert failed (table might not exist yet).");
      } else {
        registerIpSubmission(cleanIp);
        return res.json({ success: true, message: "Stored successfully in Supabase DB", data });
      }
    }

    // In-memory fallback
    const mockEntry: ContactMessage = {
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      subject: subject.trim(),
      context: context.trim(),
      created_at: new Date().toISOString(),
      ip_address: cleanIp,
      status: isSpamSubmission ? "spam" : "new"
    };

    inMemoryContacts.push(mockEntry);
    registerIpSubmission(cleanIp);
    res.json({ success: true, message: "Saved inside dynamic mockup memory fallback.", data: [mockEntry] });
  } catch (err: any) {
    console.error("Submission failed entirely:", err);
    res.status(500).json({ error: err.message || "Generic server failure while processing request." });
  }
});

// 2. Admin Login Verification
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const expectedPassword = process.env.ADMIN_PASSWORD || "neerajdev2026";
  
  if (password === expectedPassword) {
    return res.json({ success: true, token: expectedPassword });
  } else {
    return res.status(401).json({ error: "Incorrect admin passcode. Please check Settings > Secrets or use server default." });
  }
});

// 3. Get All Messages (Fully Protected)
app.get("/api/contacts", async (req, res) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: "Access Denied. Passcode authorization required." });
  }

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Return database logs
        return res.json({ contacts: data, mode: "supabase" });
      }
      console.warn("Supabase fetch error (or table missing):", error);
    }
    
    // Return in-memory logs
    // Keep them sorted so latest is first
    const sortedInMemory = [...inMemoryContacts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    res.json({ contacts: sortedInMemory, mode: "in_memory" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch contact registries." });
  }
});

// 4. Update Status (Fully Protected)
app.put("/api/contacts/:id/status", async (req, res) => {
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: "Access Denied. Passcode authorization required." });
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!["new", "interested", "spam"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value. Must represent 'new', 'interested', or 'spam'." });
  }

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("contacts")
        .update({ status })
        .eq("id", id)
        .select();

      if (!error && data && data.length > 0) {
        return res.json({ success: true, data: data[0] });
      }
      console.warn("Supabase status update failed (falling back to memory):", error);
    }

    // In-Memory update
    const match = inMemoryContacts.find(c => c.id === id);
    if (match) {
      match.status = status as "new" | "interested" | "spam";
      return res.json({ success: true, message: "Updated in mockup fallback memory state", data: match });
    }

    res.status(404).json({ error: "Submission log not found with specific ID." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update item status." });
  }
});

// Serve Frontend using Vite or Static Assets
async function startServer() {

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
