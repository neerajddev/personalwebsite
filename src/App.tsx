import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus,
  Mail, 
  Linkedin, 
  MapPin, 
  ExternalLink, 
  Download, 
  FileText, 
  X, 
  Check, 
  Copy,
  ChevronRight,
  Sparkles,
  Layers,
  Milestone,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  Workflow
} from "lucide-react";


export default function App() {
  const [copied, setCopied] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "capabilities", "projects", "experience", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("neerajddev.pillai@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-[#f9fafb] font-sans relative selection:bg-[#3b82f6] selection:text-white overflow-x-hidden antialiased">
      
      {/* Dynamic ambient grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293733_1px,transparent_1px),linear-gradient(to_bottom,#1f293733_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Primary Navigation Hub */}
      <header className="fixed top-0 left-0 right-0 w-full z-[1000] border-b border-slate-800/80" style={{ backgroundColor: "rgba(17, 24, 39, 0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5 group">
            <span className="font-mono text-xs font-semibold tracking-wider bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-2 py-0.5 rounded">
              NDD
            </span>
            <span className="text-sm font-bold tracking-tight text-[#f9fafb] group-hover:text-[#3b82f6] transition-colors duration-200">
              NEERAJ D DEV
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase">
            {[
              { id: "about", val: "The Pivot" },
              { id: "capabilities", val: "Capabilities" },
              { id: "projects", val: "SaaS Shipped" },
              { id: "experience", val: "Timeline" },
              { id: "contact", val: "Connect" }
            ].map((link) => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                className={`transition-colors duration-200 hover:text-[#3b82f6] relative py-1.5 ${
                  activeSection === link.id ? "text-[#3b82f6]" : "text-[#f9fafb]/60"
                }`}
              >
                {link.val}
                {activeSection === link.id && (
                  <motion.div 
                    layoutId="currentNavIndicator" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6]" 
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCVModal(true)}
              id="header-cv-btn"
              className="text-xs font-mono font-medium tracking-wider uppercase border border-slate-700 hover:border-[#3b82f6] hover:text-[#3b82f6] px-4 py-2 rounded-sm transition-all duration-300 inline-flex items-center cursor-pointer bg-transparent"
            >
              Resume
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-12">

        {/* 1. HERO SECTION */}
        <section id="hero" className="pt-28 md:pt-36 py-12 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)] scroll-mt-20">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="font-mono text-xs font-bold tracking-[0.35em] text-[#3b82f6] uppercase">
                NEERAJ D DEV
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] uppercase mb-8"
            >
              Operations & <br />
              Program Manager.<br />
              <span className="text-[#3b82f6]">Builder.</span><br />
              AI-Native Operator.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#f9fafb]/70 font-light max-w-xl mb-12 leading-[1.6]"
            >
              I don't wait for systems to exist. <strong className="font-medium text-[#f9fafb]">I build them.</strong>
            </motion.p>

            {/* Micro-interactive Action Hub */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <button 
                onClick={() => setShowCVModal(true)}
                id="hero-download-cv-btn"
                className="group relative inline-flex items-center justify-center bg-[#3b82f6] hover:bg-[#3b82f6]/95 text-white font-semibold text-sm tracking-widest uppercase px-8 py-4.5 rounded-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#3b82f6]/10 hover:shadow-[#3b82f6]/20 cursor-pointer border-0"
              >
                <Download className="w-4 h-4 mr-2 group-hover:translate-y-[1px] transition-transform" />
                Download CV
              </button>

              <a 
                href="https://www.linkedin.com/in/neeraj-d-dev-b2091b159/" 
                target="_blank" 
                referrerPolicy="no-referrer" 
                rel="noreferrer"
                id="hero-linkedin-btn"
                className="inline-flex items-center justify-center border border-slate-700 hover:border-[#f9fafb]/70 text-[#f9fafb] hover:text-[#f9fafb] font-semibold text-sm tracking-widest uppercase px-8 py-4.5 rounded-sm transition-all duration-300 transform hover:scale-[1.02] hover:bg-slate-800/40"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                View LinkedIn
              </a>
            </motion.div>
          </div>

          {/* Right Column: Styled Portrait Placeholder */}
          <div className="lg:col-span-5 h-[340px] sm:h-[450px] lg:h-[490px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="w-full h-full relative"
            >
              {/* Layout Accents */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/20 to-transparent rounded transform rotate-2 scale-[0.99] pointer-events-none" />
              
              <div className="absolute inset-0 bg-[#1f2937] rounded border border-slate-800/80 hover:border-[#3b82f6]/55 transition-colors duration-500 overflow-hidden flex flex-col items-center justify-center p-8 text-center group">
                <img 
                  src="headshot.jpg" 
                  alt="Neeraj D Dev" 
                  referrerPolicy="no-referrer"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                
                <div className="absolute top-4 left-4 font-mono text-[9px] text-[#f9fafb]/30 uppercase tracking-widest z-0">
                  PORTRAIT_CONTAINER
                </div>
                
                {/* Exquisite system diagram representation */}
                <div className="mb-6 w-24 h-24 rounded-full bg-[#111827] border border-slate-700 flex items-center justify-center relative group-hover:border-[#3b82f6] transition-colors duration-500 z-0">
                  <div className="absolute inset-1.5 rounded-full border border-dashed border-slate-800 group-hover:border-[#3b82f6]/30 transition-colors duration-500" />
                  <Workflow className="w-8 h-8 text-slate-500 group-hover:text-[#3b82f6] transition-colors duration-500" />
                </div>
                
                <span className="font-mono text-[10px] text-[#f9fafb]/70 font-semibold uppercase tracking-wider block mb-1 z-0">
                  [ Image Placeholder: Portrait ]
                </span>
                <span className="text-[11px] text-[#f9fafb]/45 max-w-xs leading-relaxed z-0">
                  Neeraj D Dev — Operational Specialist & AI Architect based in Bangalore.
                </span>

                <div className="absolute bottom-4 right-4 font-mono text-[9px] text-[#f9fafb]/30 z-0">
                  SYSTEM_STATUS: ACTIVE
                </div>
              </div>
            </motion.div>
          </div>

        </section>

        {/* 2. ABOUT ME SECTION */}
        <section id="about" className="py-24 sm:py-32 border-t border-slate-800/80 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Left Stick Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <span className="font-mono text-xs text-[#3b82f6] tracking-widest block mb-3 uppercase font-bold">01 / PERSPECTIVE</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase leading-none">
                The Pivot
              </h2>
              <div className="w-8 h-[3px] bg-[#3b82f6] mt-6" />
            </div>

            {/* Right content column */}
            <div className="lg:col-span-8 space-y-8 text-[#f9fafb]/80 text-base sm:text-lg leading-[1.65] font-light">
              <p className="text-xl sm:text-2xl font-light text-[#f9fafb] leading-relaxed tracking-tight border-l-2 border-[#3b82f6]/60 pl-6">
                I'm Neeraj — an operations and program manager based in Bangalore with 7+ years of experience spanning large-scale infrastructure delivery, B2B service operations, and independent product development.
              </p>
              
              <p>
                My career has been anything but linear. I started on construction sites coordinating a <strong className="text-[#f9fafb] font-medium">₹75 Crore infrastructure project</strong>, managing 100+ daily workforce and 7 subcontractors. Then I pivoted — built a 3D visualization delivery business from scratch, grew it to <strong className="text-[#f9fafb] font-medium">₹3.5L monthly revenue</strong>, managed 115+ client accounts and 1,000+ projects with a small remote team. Then I taught myself to build software using AI tools and shipped multiple working platforms — no engineering team, no coding background.
              </p>
              
              <p>
                I think in systems. I measure everything. And I use AI not as a novelty but as a core operating advantage — daily, practically, and obsessively. What drives me is simple: I want to be in rooms where hard problems are being solved, and I want to be the person who builds the system that solves them.
              </p>
              
              {/* Key numbers metrics */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-[#f9fafb]/50">
                <div className="border border-slate-800/80 p-5 rounded bg-[#1f2937]/50 relative overflow-hidden group hover:border-[#3b82f6]/30 transition-colors duration-300">
                  <div className="text-[#3b82f6] text-xl font-bold mb-1 font-sans">7+ Years</div>
                  <div>Cross-Discipline Operations</div>
                </div>
                <div className="border border-slate-800/80 p-5 rounded bg-[#1f2937]/50 relative overflow-hidden group hover:border-[#3b82f6]/30 transition-colors duration-300">
                  <div className="text-[#3b82f6] text-xl font-bold mb-1 font-sans">1000+</div>
                  <div>Commercial Deliverables</div>
                </div>
                <div className="border border-slate-800/80 p-5 rounded bg-[#1f2937]/50 relative overflow-hidden group hover:border-[#3b82f6]/30 transition-colors duration-300">
                  <div className="text-[#3b82f6] text-xl font-bold mb-1 font-sans">AI-Native</div>
                  <div>Full-Stack Operator</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. WHAT I DO (BENTO BOX GRID) */}
        <section id="capabilities" className="py-24 sm:py-32 border-t border-slate-800/80 scroll-mt-20">
          
          <div className="mb-16">
            <span className="font-mono text-xs text-[#3b82f6] tracking-widest block mb-3 uppercase font-bold">02 / COMPETENCY MATRIX</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              What I Do
            </h2>
          </div>

          {/* Elegant Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Box 1: Operations & Delivery - Wide horizontal row (Top-level) */}
            <div className="md:col-span-2 group bg-[#1f2937] border border-slate-800/80 hover:border-[#3b82f6]/40 rounded-lg p-8 sm:p-12 transition-all duration-300 hover:translate-y-[-4px] relative overflow-hidden flex flex-col md:flex-row justify-between gap-8 shadow-md">
              <div className="absolute top-[-40px] right-[-40px] w-72 h-72 bg-gradient-to-bl from-[#3b82f6]/5 to-transparent blur-3xl pointer-events-none group-hover:from-[#3b82f6]/10" />
              
              <div className="max-w-xl relative z-10">
                <div className="w-12 h-12 rounded bg-[#111827] border border-slate-800 flex items-center justify-center mb-6 text-[#3b82f6]">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-[#3b82f6] transition-colors">
                  Operations & Delivery
                </h3>
                <p className="text-[#f9fafb]/80 font-light leading-[1.6] text-sm sm:text-base">
                  End-to-end program management, SLA and KPI ownership, P&L management, vendor pipelines, and risk mitigation. I've run delivery operations managing hundreds of parallel workstreams — and built the systems to make that possible without burning out.
                </p>
              </div>

              <div className="flex flex-col justify-end text-left md:text-right min-w-[200px]">
                <span className="font-mono text-[9px] text-[#f9fafb]/40 tracking-widest uppercase mb-1">OPERATING METRICS</span>
                <span className="text-xs font-mono text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-3 py-1 rounded inline-block self-start md:self-end">
                  SLA Accountability • P&L Ownership
                </span>
              </div>
            </div>

            {/* Box 2: Program Management (Square Column) */}
            <div className="group bg-[#1f2937] border border-slate-800/80 hover:border-[#3b82f6]/40 rounded-lg p-8 sm:p-12 transition-all duration-300 hover:translate-y-[-4px] relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-md">
              <div className="absolute top-[-30px] right-[-30px] w-52 h-52 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded bg-[#111827] border border-slate-800 flex items-center justify-center mb-6 text-[#3b82f6]">
                  <Milestone className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-[#3b82f6] transition-colors">
                  Program Management
                </h3>
                <p className="text-[#f9fafb]/75 font-light leading-[1.65] text-sm sm:text-base">
                  Milestone tracking, resource allocation, and stakeholder management. I've coordinated projects ranging from ₹75 Crore infrastructure builds to 1,000+ parallel B2B service projects.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 font-mono text-[10px] text-[#f9fafb]/40 uppercase flex justify-between items-center">
                <span>Infrastructure & Digital Builds</span>
                <span className="text-[#3b82f6]">Resource Optimization</span>
              </div>
            </div>

            {/* Box 3: AI & Automation (Square Column) */}
            <div className="group bg-[#1f2937] border border-slate-800/80 hover:border-[#3b82f6]/40 rounded-lg p-8 sm:p-12 transition-all duration-300 hover:translate-y-[-4px] relative overflow-hidden flex flex-col justify-between min-h-[360px] shadow-md">
              <div className="absolute top-[-30px] right-[-30px] w-52 h-52 bg-gradient-to-bl from-[#3b82f6]/5 to-transparent blur-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded bg-[#111827] border border-slate-800 flex items-center justify-center mb-6 text-[#3b82f6]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-[#3b82f6] transition-colors">
                  AI & Automation
                </h3>
                <p className="text-[#f9fafb]/75 font-light leading-[1.65] text-sm sm:text-base">
                  I use Claude, ChatGPT, and Gemini daily for operational workflows. I've built working SaaS platforms using GitHub Copilot, Supabase, Vercel, and Cloudinary with zero formal engineering background.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 font-mono text-[10px] text-[#f9fafb]/40 uppercase flex justify-between items-center">
                <span>Autonomous Platforms Shipped</span>
                <span className="text-[#3b82f6]">Copilot • Supabase Stack</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. PROJECTS SECTION */}
        <section id="projects" className="py-24 sm:py-32 border-t border-slate-800/80 scroll-mt-20">
          
          <div className="mb-16">
            <span className="font-mono text-xs text-[#3b82f6] tracking-widest block mb-3 uppercase font-bold">03 / FUNCTIONAL PRODUCTS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              Projects Shipped
            </h2>
          </div>

          <div className="space-y-16">
            
            {/* Project 1: Design&Cart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center group pb-16 border-b border-slate-800/80 last:border-0 last:pb-0">
              
              <div className="lg:col-span-6 flex flex-col gap-6" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight group-hover:text-[#3b82f6] transition-colors">
                    Design&Cart
                  </h3>
                  <p className="text-[#3b82f6] font-mono text-xs tracking-widest uppercase font-bold">
                    B2B SaaS Platform for Interior Designers
                  </p>
                </div>
                
                <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                  Connects interior designers with 3D visualization artists and product vendors through a structured marketplace. Built entirely independently to solve a real operational bottleneck.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {["Supabase", "Vercel", "Next.js", "Cloudinary", "GitHub Copilot"].map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-wider uppercase bg-slate-800 text-[#f9fafb]/70 px-3 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs tracking-wider">
                  <a 
                    href="https://app.designandcart.in" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center text-[#3b82f6] hover:text-white font-semibold group/link"
                  >
                    LIVE <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                  <a 
                    href="https://designandcart.in" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-[#f9fafb]/60 hover:text-[#3b82f6] group/link"
                  >
                    MAIN SITE <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                  <a 
                    href="https://youtu.be/i8KDc3dGRCo" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-[#f9fafb]/60 hover:text-[#3b82f6] group/link"
                  >
                    VIDEO WALKTHROUGH <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                  <a 
                    href="https://github.com/designandcart-afk/design-cart" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-[#f9fafb]/60 hover:text-[#3b82f6] group/link"
                  >
                    GITHUB <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Mock Preview Area */}
              <div className="lg:col-span-6">
                <div className="w-full aspect-[16/10] bg-[#374151] border border-slate-700 rounded flex flex-col items-center justify-center p-6 text-center hover:border-[#3b82f6]/40 transition-colors duration-300 relative overflow-hidden group/img">
                  <img 
                    src="designandcart.png" 
                    alt="Design&Cart Platform" 
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute top-3 left-3 font-mono text-[9px] text-[#f9fafb]/25 z-0">RATIO_16_10</div>
                  <div className="w-12 h-12 rounded bg-[#111827]/40 border border-slate-700 flex items-center justify-center text-[#3b82f6] mb-3 group-hover/img:scale-105 transition-transform duration-300 z-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] text-[#f9fafb]/80 font-bold tracking-wide uppercase z-0">
                    [ Image Placeholder: Platform Screenshot ]
                  </span>
                  <span className="text-[10px] text-[#f9fafb]/45 mt-1 z-0">
                    Design&Cart Marketplace Orchestration View
                  </span>
                </div>
              </div>

            </div>

            {/* Project 2: Deartisa Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center group pb-16 border-b border-slate-800/80 last:border-0 last:pb-0">
              
              <div className="lg:col-span-6 flex flex-col gap-6" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight group-hover:text-[#3b82f6] transition-colors">
                    Deartisa Hub
                  </h3>
                  <p className="text-[#3b82f6] font-mono text-xs tracking-widest uppercase font-bold">
                    Designer & Freelancer Marketplace
                  </p>
                </div>
                
                <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                  An operational dashboard built to systematise and scale a service business managing 115+ accounts. Features automated brief generation and milestone tracking.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "Supabase", "Vercel", "TailwindCSS"].map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-wider uppercase bg-slate-800 text-[#f9fafb]/70 px-3 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs tracking-wider">
                  <a 
                    href="https://hub.deartisa.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center text-[#3b82f6] hover:text-white font-semibold group/link"
                  >
                    LIVE <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                  <a 
                    href="https://deartisa.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-[#f9fafb]/60 hover:text-[#3b82f6] group/link"
                  >
                    MAIN SITE <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                  <a 
                    href="https://github.com/designandcart-afk/hubdeartisa" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-[#f9fafb]/60 hover:text-[#3b82f6] group/link"
                  >
                    GITHUB <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Mock Preview Area */}
              <div className="lg:col-span-6">
                <div className="w-full aspect-[16/10] bg-[#374151] border border-slate-700 rounded flex flex-col items-center justify-center p-6 text-center hover:border-[#3b82f6]/40 transition-colors duration-300 relative overflow-hidden group/img">
                  <img 
                    src="deartisahub.png" 
                    alt="Deartisa Hub" 
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute top-3 left-3 font-mono text-[9px] text-[#f9fafb]/25 z-0">RATIO_16_10</div>
                  <div className="w-12 h-12 rounded bg-[#111827]/40 border border-slate-700 flex items-center justify-center text-[#3b82f6] mb-3 group-hover/img:scale-105 transition-transform duration-300 z-0">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] text-[#f9fafb]/80 font-bold tracking-wide uppercase z-0">
                    [ Image Placeholder: Platform Screenshot ]
                  </span>
                  <span className="text-[10px] text-[#f9fafb]/45 mt-1 z-0">
                    Automated Brief Generator Dashboard & Analytics
                  </span>
                </div>
              </div>

            </div>

            {/* Project 3: Growth Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center group pb-16 last:border-0 last:pb-0">
              
              <div className="lg:col-span-6 flex flex-col gap-6" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight group-hover:text-[#3b82f6] transition-colors">
                    Growth Tracker
                  </h3>
                  <p className="text-[#3b82f6] font-mono text-xs tracking-widest uppercase font-bold">
                    Personal Productivity App
                  </p>
                </div>
                
                <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                  A production-grade PWA built for internal metrics tracking, task management, and complex financial calculations.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {["Vanilla JS", "Supabase", "PWA", "Service Worker"].map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-wider uppercase bg-slate-800 text-[#f9fafb]/70 px-3 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs tracking-wider">
                  <a 
                    href="https://tracker-lifeos.vercel.app" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center text-[#3b82f6] hover:text-white font-semibold group/link"
                  >
                    LIVE <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                  <a 
                    href="https://github.com/designandcart-afk/Tracker" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-[#f9fafb]/60 hover:text-[#3b82f6] group/link"
                  >
                    GITHUB <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right Mock Preview Area */}
              <div className="lg:col-span-6">
                <div className="w-full aspect-[16/10] bg-[#374151] border border-slate-700 rounded flex flex-col items-center justify-center p-6 text-center hover:border-[#3b82f6]/40 transition-colors duration-300 relative overflow-hidden group/img">
                  <img 
                    src="growthtracker.png" 
                    alt="Growth Tracker" 
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute top-3 left-3 font-mono text-[9px] text-[#f9fafb]/25 z-0">RATIO_16_10</div>
                  <div className="w-12 h-12 rounded bg-[#111827]/40 border border-slate-700 flex items-center justify-center text-[#3b82f6] mb-3 group-hover/img:scale-105 transition-transform duration-300 z-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] text-[#f9fafb]/80 font-bold tracking-wide uppercase z-0">
                    [ Image Placeholder: Platform Screenshot ]
                  </span>
                  <span className="text-[10px] text-[#f9fafb]/45 mt-1 z-0">
                    System Metrics & Net Worth Tracking Panel
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 5. EXPERIENCE SECTION */}
        <section id="experience" className="py-24 sm:py-32 border-t border-slate-800/80 scroll-mt-20">
          
          <div className="mb-16">
            <span className="font-mono text-xs text-[#3b82f6] tracking-widest block mb-3 uppercase font-bold">04 / THE JOURNEY</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
              Work Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Minimalist vertical timeline on left */}
            <div className="lg:col-span-4 relative">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800" />
              
              <div className="space-y-12 pl-12 relative">
                
                <div>
                  <div className="absolute left-2.5 w-3.5 h-3.5 rounded-full bg-[#3b82f6] ring-4 ring-[#111827] mt-[0.35rem]" />
                  <div className="font-mono text-xs font-bold text-[#3b82f6] tracking-widest uppercase">Nov 2021 – Present</div>
                  <p className="text-sm font-bold text-[#f9fafb] mt-1">De'Artisa LLP</p>
                  <p className="text-xs text-[#f9fafb]/50">Head of Operations & Delivery</p>
                </div>

                <div>
                  <div className="absolute left-2.5 w-3.5 h-3.5 rounded-full bg-slate-700 ring-4 ring-[#111827] mt-[0.35rem]" />
                  <div className="font-mono text-xs font-bold text-[#f9fafb]/50 tracking-widest uppercase">Mar 2019 – Aug 2021</div>
                  <p className="text-sm font-bold text-[#f9fafb] mt-1">ULCCS Ltd</p>
                  <p className="text-xs text-[#f9fafb]/50">Senior Project Manager</p>
                </div>

                <div>
                  <div className="absolute left-2.5 w-3.5 h-3.5 rounded-full bg-slate-700 ring-4 ring-[#111827] mt-[0.35rem]" />
                  <div className="font-mono text-xs font-bold text-[#f9fafb]/50 tracking-widest uppercase">Jan 2017 – Sep 2018</div>
                  <p className="text-sm font-bold text-[#f9fafb] mt-1">Earlier Career</p>
                  <p className="text-xs text-[#f9fafb]/50">Site Engineer</p>
                </div>

              </div>
            </div>

            {/* Timeless narratives (NO BULLETS, clean paragraph layout) */}
            <div className="lg:col-span-8 space-y-14">
              
              {/* De'Artisa */}
              <div className="relative group p-6 -m-6 hover:bg-[#1f2937]/30 rounded transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5 group-hover:text-[#3b82f6] transition-colors duration-200">
                  De'Artisa LLP <span className="text-sm font-normal text-[#f9fafb]/45 italic font-sans">(Nov 2021 – Present)</span>
                </h3>
                <p className="text-xs font-mono text-[#3b82f6] tracking-wider mb-4 uppercase font-bold">
                  Head of Operations & Program Delivery
                </p>
                <div className="text-[#f9fafb]/80 font-light text-base sm:text-lg leading-[1.65] space-y-4">
                  <p>
                    Built a B2B service delivery business from absolute zero. Managed 150+ client accounts, delivering 1,000+ projects and hitting ₹3.5L monthly revenue.
                  </p>
                  <p>
                    Architected the entire operational infrastructure using Google Workspace and later custom SaaS platforms. Orchestrated diverse freelancer pools and spearheaded critical account negotiations.
                  </p>
                </div>
              </div>

              {/* ULCCS */}
              <div className="relative group p-6 -m-6 hover:bg-[#1f2937]/30 rounded transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5 group-hover:text-[#3b82f6] transition-colors duration-200">
                  ULCCS Ltd <span className="text-sm font-normal text-[#f9fafb]/45 italic font-sans">(Mar 2019 – Aug 2021)</span>
                </h3>
                <p className="text-xs font-mono text-[#3b82f6] tracking-wider mb-4 uppercase font-bold">
                  Senior Project Manager
                </p>
                <div className="text-[#f9fafb]/80 font-light text-base sm:text-lg leading-[1.65] space-y-4">
                  <p>
                    Led end-to-end execution of a ₹75 Crore, 12-storey infrastructure project.
                  </p>
                  <p>
                    Built sector-wise cost-tracking systems achieving zero cost overruns and aligned diverse stakeholders to deliver strictly on schedule. Guided multi-layered operational protocols involving more than 100 daily coordinators.
                  </p>
                </div>
              </div>

              {/* Site Engineer */}
              <div className="relative group p-6 -m-6 hover:bg-[#1f2937]/30 rounded transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5 group-hover:text-[#3b82f6] transition-colors duration-200">
                  Earlier Career <span className="text-sm font-normal text-[#f9fafb]/45 italic font-sans">(Jan 2017 – Sep 2018)</span>
                </h3>
                <p className="text-xs font-mono text-[#3b82f6] tracking-wider mb-4 uppercase font-bold">
                  Site Engineer
                </p>
                <div className="text-[#f9fafb]/80 font-light text-base sm:text-lg leading-[1.65]">
                  <p>
                    Supervised residential and government infrastructure projects, managing daily site operations, resource loading, and compliance. Ensured zero critical delays or safety incidents across active operational sites.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 6. CONTACT SECTION */}
        <section id="contact" className="py-24 sm:py-36 border-t border-slate-800/80 scroll-mt-20">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            
            <span className="font-mono text-xs text-[#3b82f6] tracking-widest block mb-3 uppercase font-bold">
              05 / COMMUNICATIONS
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 uppercase">
              LET'S BUILD SOMETHING
            </h2>

            <p className="text-[#f9fafb]/60 font-light text-base sm:text-lg max-w-lg mb-14 leading-[1.65]">
              Looking to operationalize workflows, automate structures, or integrate program safety pipelines? Get in touch immediately.
            </p>

            {/* Executive Interaction Hub */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mb-16">
              
              {/* Card 1: Copy Email */}
              <div 
                onClick={handleCopyEmail}
                className="group bg-[#1f2937] border border-slate-800/80 hover:border-[#3b82f6]/40 p-6 rounded cursor-pointer transition-all duration-300 hover:translate-y-[-4px] relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <Mail className="w-5 h-5 text-[#3b82f6]" />
                  <span className="font-mono text-[9px] text-[#f9fafb]/30 uppercase tracking-widest font-bold">COPY COORD</span>
                </div>
                <div className="text-xs font-mono text-[#f9fafb]/40 mb-1">Email</div>
                <div className="text-sm font-semibold truncate text-[#f9fafb] group-hover:text-[#3b82f6] transition-colors">
                  neerajddev.pillai@gmail.com
                </div>
                
                <AnimatePresence>
                  {copied && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-2 right-2 bg-[#3b82f6] text-white text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5" /> Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card 2: LinkedIn Link */}
              <a 
                href="https://www.linkedin.com/in/neeraj-d-dev-b2091b159/"
                target="_blank"
                referrerPolicy="no-referrer"
                rel="noreferrer"
                className="group bg-[#1f2937] border border-slate-800/80 hover:border-[#3b82f6]/40 p-6 rounded transition-all duration-300 hover:translate-y-[-4px] block"
              >
                <div className="flex justify-between items-start mb-4">
                  <Linkedin className="w-5 h-5 text-[#3b82f6]" />
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#f9fafb]/25 group-hover:text-[#3b82f6] transition-colors" />
                </div>
                <div className="text-xs font-mono text-[#f9fafb]/40 mb-1">LinkedIn Network</div>
                <div className="text-sm font-semibold truncate text-[#f9fafb] group-hover:text-[#3b82f6] transition-colors">
                  linkedin.com/in/neeraj-d-dev...
                </div>
              </a>

              {/* Card 3: Location */}
              <div className="bg-[#1f2937] border border-slate-800/80 p-6 rounded hover:border-[#3b82f6]/20 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <MapPin className="w-5 h-5 text-[#3b82f6]" />
                  <span className="font-mono text-[9px] text-[#f9fafb]/30 tracking-widest font-bold">HQ</span>
                </div>
                <div className="text-xs font-[#f9fafb]/40 mb-1 font-mono text-[#f9fafb]/40">Location</div>
                <div className="text-sm font-semibold text-[#f9fafb]">
                  Bangalore, India
                </div>
              </div>

            </div>

            <div className="text-[11px] font-mono text-[#f9fafb]/20 tracking-wider">
              Designed with bespoke Executive Palette • Inter Typographical Framework
            </div>

          </div>
        </section>

      </main>

      <footer className="border-t border-slate-800/80 bg-[#111827] py-8 text-center text-xs font-mono text-[#f9fafb]/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© {new Date().getFullYear()} Neeraj D Dev. Systems Architect.</div>
          <div className="flex gap-4">
            <a href="#about" className="hover:text-[#3b82f6] transition-colors">About</a>
            <span>•</span>
            <a href="#capabilities" className="hover:text-[#3b82f6] transition-colors">Capabilities</a>
            <span>•</span>
            <a href="#projects" className="hover:text-[#3b82f6] transition-colors">Projects</a>
          </div>
        </div>
      </footer>

      {/* --- PREMIUM INTERACTIVE MULTI-ROLE DOWNLOAD MODAL --- */}
      <AnimatePresence>
        {showCVModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCVModal(false)}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-[#111827]/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#1f2937] rounded-lg border border-slate-700 p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Close Button top right */}
              <button 
                onClick={() => setShowCVModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/40 hover:bg-slate-800/80 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight text-white uppercase">Select Focus Area</h3>
                  <div className="h-[2px] w-8 bg-[#3b82f6] mt-1" />
                </div>
              </div>

              <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
                Select a track below. It will automatically generate and open a premium interactive document in a new tab, where you can instantly read, print, or download it as a high-fidelity PDF.
              </p>

              {/* Focus Tracks - Action Blocks */}
              <div className="space-y-3.5">
                {/* Button 1: Operations Focus */}
                <a 
                  href="/Neeraj_Dev_Operations.html" 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowCVModal(false)}
                  className="block w-full text-left p-4.5 rounded bg-[#111827] hover:bg-[#111827]/80 border border-slate-800 hover:border-[#3b82f6]/55 transition-all duration-300 group cursor-pointer no-underline"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-sm sm:text-base text-white group-hover:text-[#3b82f6] transition-colors">
                      Operations & Scale Focus
                    </span>
                    <Download className="w-4 h-4 text-slate-500 group-hover:text-[#3b82f6] group-hover:translate-y-[1px] transition-all duration-300" />
                  </div>
                  <p className="text-[11px] text-slate-400/80 leading-normal font-light">
                    7+ years scaling B2B execution, leading multi-stakeholder programs, and ₹75 Crore infrastructure execution.
                  </p>
                </a>

                {/* Button 2: Tech Builder Focus */}
                <a 
                  href="/Neeraj_Dev_Builder.html" 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowCVModal(false)}
                  className="block w-full text-left p-4.5 rounded bg-[#111827] hover:bg-[#111827]/80 border border-slate-800 hover:border-[#3b82f6]/55 transition-all duration-300 group cursor-pointer no-underline"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-sm sm:text-base text-white group-hover:text-[#3b82f6] transition-colors">
                      Product & Tech Builder Focus
                    </span>
                    <Download className="w-4 h-4 text-slate-500 group-hover:text-[#3b82f6] group-hover:translate-y-[1px] transition-all duration-300" />
                  </div>
                  <p className="text-[11px] text-slate-400/80 leading-normal font-light">
                    Deployment of B2B SaaS platforms (Next.js, Supabase, Vercel) and automated AI-driven business workflows.
                  </p>
                </a>

                {/* Button 3: Full Profile */}
                <a 
                  href="/NeerajDDev_CV_Final.html" 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowCVModal(false)}
                  className="block w-full text-left p-4.5 rounded bg-[#3b82f6] hover:bg-[#3b82f6]/90 border border-[#3b82f6] hover:border-white/20 transition-all duration-300 group cursor-pointer shadow-lg shadow-[#3b82f6]/10 no-underline"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-sm sm:text-base text-white">
                      Full Comprehensive Profile
                    </span>
                    <Download className="w-4 h-4 text-white/80 group-hover:translate-y-[1px] transition-transform" />
                  </div>
                  <p className="text-[11px] text-white/70 leading-normal font-light">
                    Complete strategic career profile combining executive logistics operations with modern technical product engineering.
                  </p>
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>⚡ Interactive HTML & Print Engine</span>
                <span>Auto-creates PDF via Print / Save</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
