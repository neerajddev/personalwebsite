
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Production-stable Gemini AI client for Vercel serverless
let aiInstance: any = null;
function getAi() {
	if (!aiInstance) {
		let apiKey = process.env.GEMINI_API_KEY;
		if (!apiKey) {
			throw new Error("GEMINI_API_KEY is missing.");
		}
		// Sanitize the key to remove invisible characters
		apiKey = apiKey.trim().replace(/[\r\n]/g, "");
		aiInstance = new GoogleGenerativeAI(apiKey);
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

// ...existing code from server.ts (all endpoints, helpers, and export default app)

// Fallback Chat Parser Engine in case Gemini API is rate-limited or key has quota limit
function runFallbackChatEngine(messages: { role: string; content: string }[]): string {
	// ...existing code...
}

// Fallback Fit Evaluation Engine in case Gemini API is rate-limited
function runFallbackAnalyseEngine(jd: string): string {
	// ...existing code...
}

// Feature 1: Chat endpoint
app.post("/api/chat", async (req, res) => {
	// ...existing code...
});

// Feature 2: Role Fit Analyser endpoint
app.post("/api/analyse", async (req, res) => {
	// ...existing code...
});

// Helper for Supabase lazy client initialization
let supabaseInstance: any = null;
function getSupabase() {
	// ...existing code...
}

// In-Memory Fallback State (Ensures instant working prototype in dev even with missing db keys)
interface ContactMessage {
	// ...existing code...
}

let inMemoryContacts: ContactMessage[] = [];
const ipRateLimitMap: Record<string, string[]> = {};
function checkIpRateLimit(ip: string): boolean {
	// ...existing code...
}
function registerIpSubmission(ip: string) {
	// ...existing code...
}

const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|edu|gov|io|co|in|info|biz|me|cc|tv|us|ca|uk|ua))/i;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{8,14}\b/;

function verifyAdminAuth(req: express.Request): boolean {
	// ...existing code...
}

// 1. Contact Form Submission
app.post("/api/contacts", async (req, res) => {
	// ...existing code...
});

// 2. Admin Login Verification
app.post("/api/admin/login", (req, res) => {
	// ...existing code...
});

// 3. Get All Messages (Fully Protected)
app.get("/api/contacts", async (req, res) => {
	// ...existing code...
});

// 4. Update Status (Fully Protected)
app.put("/api/contacts/:id/status", async (req, res) => {
	// ...existing code...
});

export default app;
