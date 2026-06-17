import { useState, useEffect, FormEvent, useRef } from "react";
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
  MessageSquare,
  TrendingUp,
  Workflow,
  Lock,
  Star,
  Trash2,
  Eye,
  RefreshCw,
  ArrowLeft,
  LogOut,
  ShieldAlert,
  Search,
  Menu,
  User,
  CornerDownLeft
} from "lucide-react";


export default function App() {
  const [copied, setCopied] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Custom router state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    // Overwrite pushState to automatically dispatch state changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function (state, title, url) {
      const result = originalPushState.apply(this, [state, title, url]);
      handleLocationChange();
      return result;
    };
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Contact Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactFormStep, setContactFormStep] = useState<1 | 2 | 3 | "success">(1);
  const [contactSubject, setContactSubject] = useState("");
  const [contactContext, setContactContext] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [websiteHoneypot, setWebsiteHoneypot] = useState(""); // Anti-spam honey helper
  const [contactIsSubmitting, setContactIsSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  // Admin Panel States
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminContacts, setAdminContacts] = useState<any[]>([]);
  const [adminContactsLoading, setAdminContactsLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [adminFilter, setAdminFilter] = useState<"all" | "new" | "interested" | "spam">("all");
  const [adminMsgMode, setAdminMsgMode] = useState<"supabase" | "in_memory">("in_memory");
  const [adminActionLoadingId, setAdminActionLoadingId] = useState<string | null>(null);

  const getWordCount = (val: string) => {
    const words = val.trim().split(/\s+/).filter(Boolean);
    return words.length;
  };

  // Step validation helpers
  const URL_REGEX_CLIENT = /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|edu|gov|io|co|in|info|biz|me|cc|tv|us|ca|uk|ua)/i;
  const PHONE_REGEX_CLIENT = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{8,14}\b/;

  const subjectWords = getWordCount(contactSubject);
  const contextWords = getWordCount(contactContext);

  const isStep1Valid = subjectWords > 0 && subjectWords <= 15;
  const hasStep2UrlError = URL_REGEX_CLIENT.test(contactContext);
  const hasStep2PhoneError = PHONE_REGEX_CLIENT.test(contactContext);
  const isStep2Valid = contextWords >= 25 && !hasStep2UrlError && !hasStep2PhoneError;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
  const isStep3Valid = contactName.trim().length > 0 && isEmailValid;

  const handleContactSubmit = async (e: FormEvent) => {
    if (e) e.preventDefault();
    if (contactIsSubmitting) return;

    if (!isStep3Valid) {
      setContactError("Full name and a valid email address are required.");
      return;
    }

    setContactIsSubmitting(true);
    setContactError(null);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          subject: contactSubject,
          context: contactContext,
          website: websiteHoneypot
        })
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        throw new Error(errObj.error || "Failed to submit request.");
      }

      setContactFormStep("success");
      setContactSubject("");
      setContactContext("");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setWebsiteHoneypot("");
    } catch (err: any) {
      console.error(err);
      setContactError(err.message || "An unexpected error occurred during submit.");
    } finally {
      setContactIsSubmitting(false);
    }
  };

  // Admin authentication check and retrieval
  const checkAdminAuthOnLoad = () => {
    const sessionStr = localStorage.getItem("admin-session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (Date.now() < session.expiresAt) {
          setIsAdminAuthenticated(true);
          return session.token;
        } else {
          localStorage.removeItem("admin-session");
        }
      } catch (e) {
        // Safe fail
      }
    }
    setIsAdminAuthenticated(false);
    return null;
  };

  const fetchAdminContacts = async (token?: string) => {
    const authPass = token || adminPasswordInput || (JSON.parse(localStorage.getItem("admin-session") || "{}").token);
    if (!authPass) return;

    setAdminContactsLoading(true);
    setAdminLoginError(null);

    try {
      const res = await fetch("/api/contacts", {
        headers: {
          "Authorization": `Bearer ${authPass}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Incorrect password or access token.");
      }

      const data = await res.json();
      setAdminContacts(data.contacts || []);
      setAdminMsgMode(data.mode || "in_memory");
      setIsAdminAuthenticated(true);
      
      const sessionObj = {
        token: authPass,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      };
      localStorage.setItem("admin-session", JSON.stringify(sessionObj));
    } catch (err: any) {
      console.error(err);
      setAdminLoginError(err.message || "Access authentication failed.");
      setIsAdminAuthenticated(false);
    } finally {
      setAdminContactsLoading(false);
    }
  };

  const handleAdminLogin = (e: FormEvent) => {
    if (e) e.preventDefault();
    fetchAdminContacts(adminPasswordInput);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin-session");
    setIsAdminAuthenticated(false);
    setAdminContacts([]);
    setAdminPasswordInput("");
  };

  const updateContactStatus = async (contactId: string, newStatus: "new" | "interested" | "spam") => {
    const activePass = JSON.parse(localStorage.getItem("admin-session") || "{}").token;
    if (!activePass) return;

    setAdminActionLoadingId(contactId);

    try {
      const res = await fetch(`/api/contacts/${contactId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activePass}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error("Failed to update status on server.");
      }

      setAdminContacts(prev => prev.map(c => c.id === contactId ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error(err);
      alert("Error updating status. Please try again.");
    } finally {
      setAdminActionLoadingId(null);
    }
  };

  useEffect(() => {
    if (currentPath === "/admin") {
      const activeToken = checkAdminAuthOnLoad();
      if (activeToken) {
        fetchAdminContacts(activeToken);
      }
    }
  }, [currentPath]);

  // Chat Feature states
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);

  // Focus modal input when modal opens
  useEffect(() => {
    if (isChatModalOpen) {
      const timer = setTimeout(() => {
        modalInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isChatModalOpen]);

  // Escape key and CMD/CTRL+K listener to close/open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsChatModalOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsChatModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fit Analyser states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleFitModalOpen, setIsRoleFitModalOpen] = useState(false);
  const [jdInput, setJdInput] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

  const handleSendMessage = async (e?: FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const userMessage = (customText || chatInput).trim();
    if (!userMessage || isChatLoading) return;

    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, { role: "user", content: userMessage }]
        })
      });

      if (!response.ok) {
  const errorText = await response.text();
  throw new Error(errorText || "Failed to get API response");
}

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "model", content: data.text || "I was unable to formulate a response. Please reach out to Neeraj directly." }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        { role: "model", content: "Great question — reach out to Neeraj directly at neerajddev.pillai@gmail.com" }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAnalyseFit = async () => {
    if (!jdInput.trim() || isAnalysing) return;

    setIsAnalysing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: jdInput })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze Job Description");
      }

      const data = await response.json();
      setAnalysisResult(data.text);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "Something went wrong while mapping the fit. Please try again.");
    } finally {
      setIsAnalysing(false);
    }
  };

  const parseAnalysisResult = (text: string | null) => {
    if (!text) return null;
    
    let matchScore = "N/A";
    let strongMatches: string[] = [];
    let gapsToAddress: string[] = [];
    let suggestedAngle = "";

    try {
      const scoreMatch = text.match(/MATCH SCORE:\s*([^\n]+)/i);
      if (scoreMatch) {
        matchScore = scoreMatch[1].trim();     
      }

      // Extract strong matches segment
      const strongMatchBlock = text.match(/STRONG MATCHES:([\s\S]*?)(?:GAPS TO ADDRESS:|UNCONVENTIONAL ADVANTAGES:|THE BUILDER ANGLE:|SUGGESTED ANGLE:|$)/i);
      if (strongMatchBlock) {
        strongMatches = strongMatchBlock[1]
          .split("\n")
          .map(l => l.replace(/^[-*•\s\d.]+\s*/, "").trim())
          .filter(l => l.length > 5);
      }

      // Extract unconventional advantages/gaps segment
      const gapsBlock = text.match(/(?:GAPS TO ADDRESS:|UNCONVENTIONAL ADVANTAGES:|THE BUILDER ANGLE:)([\s\S]*?)(?:SUGGESTED ANGLE:|$)/i);
      if (gapsBlock) {
        gapsToAddress = gapsBlock[1]
          .split("\n")
          .map(l => l.replace(/^[-*•\s\d.]+\s*/, "").trim())
          .filter(l => l.length > 5);
      }

      // Extract suggested angle
      const angleBlock = text.match(/SUGGESTED ANGLE:([\s\S]*)/i);
      if (angleBlock) {
        suggestedAngle = angleBlock[1].trim();
      }
    } catch (e) {
      console.warn("Failed parsing, rendering fallback", e);
    }

    const isParsed = strongMatches.length > 0 || gapsToAddress.length > 0 || suggestedAngle.length > 0;
    
    return {
      score: matchScore,
      strongMatches,
      gapsToAddress,
      suggestedAngle,
      rawText: text,
      isParsed
    };
  };

  useEffect(() => {
    const anchor = document.getElementById("chat-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [chatMessages, isChatLoading, isChatModalOpen]);

  return (
    <div className="min-h-screen bg-transparent text-[#f9fafb] font-sans relative selection:bg-[#3b82f6] selection:text-white overflow-x-hidden antialiased">
      
      {/* 4.6 ADMIN CONSOLE PAGE OVERLAY */}
      {currentPath === "/admin" && (
        <div className="fixed inset-0 min-h-screen w-screen bg-[#111827] z-[5000] overflow-y-auto font-sans relative">
          {/* Dynamic ambient grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293733_1px,transparent_1px),linear-gradient(to_bottom,#1f293733_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          
          {/* Admin Header */}
          <header className="border-b border-slate-800 bg-[#111827]/90 sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigateTo("/")}
                  className="p-2 -ml-2 rounded border border-slate-800 hover:border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/5 transition-all text-xs flex items-center gap-1.5 cursor-pointer bg-[#1f2937]/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-mono uppercase">Portfolio</span>
                </button>
                <div className="h-6 w-[1px] bg-slate-805" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 px-2 py-0.5 rounded">
                    CONSOLE
                  </span>
                  <span className="hidden sm:inline text-sm font-bold tracking-tight text-white uppercase font-sans">
                    Admin Engine
                  </span>
                </div>
              </div>

              {isAdminAuthenticated && (
                <button
                  onClick={handleAdminLogout}
                  className="py-2 px-4 rounded border border-red-900/40 hover:border-red-500 text-red-500 hover:bg-red-950/20 transition-all font-mono text-xs flex items-center gap-2 cursor-pointer bg-red-950/5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </header>

          {/* Admin Body Content */}
          <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 relative z-10">
            {!isAdminAuthenticated ? (
              /* Login Form Container */
              <div className="max-w-md mx-auto my-12">
                <div className="bg-[#1f2937]/50 border border-slate-800 p-8 rounded shadow-2xl relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 font-mono text-[9px] text-[#f9fafb]/10 p-2 uppercase tracking-wide">SECURE_GATEWAY_v1.0</div>
                  <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded bg-[#111827] border border-slate-800 flex items-center justify-center text-[#3b82f6]">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>

                  <h2 className="text-xl font-bold font-sans text-white text-center mb-1 uppercase tracking-tight">Admin Authentication</h2>
                  <p className="text-xs text-[#f9fafb]/50 text-center mb-6 max-w-xs mx-auto">
                    Access restricted to Neeraj's administration. Please type the authorization security passcode to continue.
                  </p>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                        Passcode key:
                      </label>
                      <input
                        type="password"
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        placeholder="••••••••••••••"
                        className="w-full bg-[#111827] text-white border border-slate-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#3b82f6] placeholder-slate-650 font-mono text-center tracking-widest"
                        required
                        autoFocus
                      />
                    </div>

                    {adminLoginError && (
                      <div className="p-3 bg-red-950/40 border border-red-950/60 rounded text-xs text-red-400 flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{adminLoginError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={adminContactsLoading}
                      className="w-full font-mono text-xs font-bold uppercase tracking-wider bg-[#3b82f6] hover:bg-[#3b82f6]/95 text-white py-3.5 rounded transition-all flex items-center justify-center gap-2 cursor-pointer border-0 active:scale-98"
                    >
                      {adminContactsLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Authorize Console</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* Dashboard Content View */
              <div className="space-y-8 animate-fade-in">
                
                {/* Top Row counts & Status indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  
                  {/* Stat 1: Total */}
                  <div className="bg-[#1f2937]/30 border border-slate-800 p-5 rounded">
                    <span className="font-mono text-[10px] text-slate-400 block tracking-widest uppercase mb-1">TOTAL LEADS</span>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="text-3xl font-extrabold text-white">{adminContacts.length}</span>
                      <span className="text-[10px] font-mono text-[#3b82f6] bg-[#3b82f6]/10 px-2 py-0.5 rounded border border-[#3b82f6]/20 uppercase">
                        Leads
                      </span>
                    </div>
                  </div>

                  {/* Stat 2: New */}
                  {(() => {
                    const newCount = adminContacts.filter(c => c.status === "new").length;
                    return (
                      <div className="bg-[#1f2937]/30 border border-slate-800 p-5 rounded">
                        <span className="font-mono text-[10px] text-emerald-400 block tracking-widest uppercase mb-1">👀 NEW</span>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-3xl font-extrabold text-white">{newCount}</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                            New
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Stat 3: Interested */}
                  {(() => {
                    const intCount = adminContacts.filter(c => c.status === "interested").length;
                    return (
                      <div className="bg-[#1f2937]/30 border border-slate-800 p-5 rounded">
                        <span className="font-mono text-[10px] text-amber-500 block tracking-widest uppercase mb-1">⭐ INTERESTED</span>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-3xl font-extrabold text-white">{intCount}</span>
                          <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                            Interested
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Stat 4: Spam */}
                  {(() => {
                    const spamCount = adminContacts.filter(c => c.status === "spam").length;
                    return (
                      <div className="bg-[#1f2937]/30 border border-slate-800 p-5 rounded">
                        <span className="font-mono text-[10px] text-red-500 block tracking-widest uppercase mb-1">🗑️ SPAM</span>
                        <div className="flex justify-between items-baseline mt-1">
                          <span className="text-3xl font-extrabold text-white">{spamCount}</span>
                          <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase">
                            Spam
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Filter bar & Fetch Indicator */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: "all", label: "All Contacts" },
                      { id: "new", label: "New Messages" },
                      { id: "interested", label: "Interested" },
                      { id: "spam", label: "Spam Blocked" }
                    ].map((filterTab) => {
                      const isActive = adminFilter === filterTab.id;
                      return (
                        <button
                          key={filterTab.id}
                          onClick={() => setAdminFilter(filterTab.id as any)}
                          className={`px-4 py-2 text-xs font-mono rounded tracking-wider uppercase cursor-pointer border transition-all ${
                            isActive
                              ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                              : "bg-[#1f2937]/30 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          {filterTab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto font-mono text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Mode: <strong className="text-slate-300 uppercase">{adminMsgMode.replace("_", " ")}</strong></span>
                    </div>
                    <button
                      onClick={() => fetchAdminContacts()}
                      className="p-1.5 rounded border border-slate-800 hover:border-[#3b82f6] hover:text-[#3b82f6] cursor-pointer transition-colors bg-[#1f2937]/45 flex items-center gap-1"
                      title="Refresh Data Logs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Messages Body cards layout */}
                <div className="space-y-6">
                  {(() => {
                    const filteredList = adminContacts.filter(
                      c => adminFilter === "all" ? true : c.status === adminFilter
                    );

                    if (filteredList.length === 0) {
                      return (
                        <div className="border border-slate-800/80 bg-[#1f2937]/10 p-16 text-center rounded">
                          <div className="w-12 h-12 bg-[#111827] border border-slate-800 flex items-center justify-center shrink-0 mx-auto text-slate-500 mb-4 rounded">
                            <FileText className="w-5 h-5" />
                          </div>
                          <h4 className="text-sm font-mono font-bold tracking-wider text-slate-400 mb-1">
                            No Submissions Found
                          </h4>
                          <p className="text-xs text-slate-500 max-w-xs mx-auto font-sans">
                            There are currently no contacts matching the '{adminFilter}' status filter criteria.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 gap-6">
                        {filteredList.map((contact) => {
                          const dateFormatted = new Date(contact.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          });

                          return (
                            <div 
                              key={contact.id}
                              style={{ borderTopWidth: '2px' }}
                              className={`border border-slate-800 p-6 rounded bg-[#1f2935]/20 relative overflow-hidden transition-all duration-300 ${
                                contact.status === "spam" ? "opacity-60" : "hover:border-slate-700"
                              } ${
                                contact.status === "new" ? "border-t-emerald-500" :
                                contact.status === "interested" ? "border-t-amber-500" : "border-t-red-500/40"
                              }`}
                            >
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                {/* Left Side: Meta & Content info */}
                                <div className="space-y-4 flex-1">
                                  <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Name */}
                                    <h3 className="font-bold text-base text-white">
                                      {contact.name}
                                    </h3>
                                    <span className="text-xs text-slate-500 font-mono">•</span>
                                    {/* Date Sub */}
                                    <span className="font-mono text-[10px] text-slate-500">
                                      {dateFormatted}
                                    </span>
                                    {/* IP Address */}
                                    {contact.ip_address && (
                                      <>
                                        <span className="text-xs text-slate-500 font-mono">•</span>
                                        <span className="font-mono text-[9px] text-slate-600">
                                          IP: {contact.ip_address}
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  {/* Contact Methods Row */}
                                  <div className="flex flex-wrap gap-4 text-xs font-mono">
                                    <a 
                                      href={`mailto:${contact.email}`}
                                      className="text-[#3b82f6] hover:underline flex items-center gap-1.5"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                      <span>{contact.email}</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>

                                    {contact.phone && (
                                      <div className="text-slate-400 flex items-center gap-1.5">
                                        <span>📳 Phone:</span>
                                        <span className="text-slate-300">{contact.phone}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Answers Grid */}
                                  <div className="space-y-3.5 pt-2">
                                    {/* Subject (Step 1 Output) */}
                                    <div>
                                      <span className="block font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">
                                        What's on mind (15-word limit)
                                      </span>
                                      <div className="bg-[#111827] border border-slate-800 px-4 py-2.5 rounded text-sm text-[#f9fafb]/90 italic font-medium font-sans">
                                        "{contact.subject}"
                                      </div>
                                    </div>

                                    {/* Context (Step 2 Output) */}
                                    <div>
                                      <span className="block font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">
                                        Detailed Context (25-word minimum)
                                      </span>
                                      <div className="bg-[#111827]/40 border border-slate-800 px-4 py-3.5 rounded text-xs sm:text-sm text-[#f9fafb]/75 font-light whitespace-pre-line leading-relaxed font-sans">
                                        {contact.context}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side: Status Admin Actions */}
                                <div className="lg:w-48 shrink-0 flex flex-wrap lg:flex-col gap-2 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 justify-end lg:justify-start">
                                  <span className="hidden lg:block font-mono text-[9px] text-[#f9fafb]/30 tracking-widest uppercase mb-1 font-bold">
                                    STATUS ACTIONS
                                  </span>

                                  <button
                                    onClick={() => updateContactStatus(contact.id, "new")}
                                    disabled={adminActionLoadingId === contact.id}
                                    className={`w-full font-mono text-[10px] uppercase py-2.5 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                                      contact.status === "new"
                                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-bold"
                                        : "bg-[#1f2937]/50 text-slate-400 border-slate-800 hover:text-emerald-400"
                                    }`}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>👀 New</span>
                                  </button>

                                  <button
                                    onClick={() => updateContactStatus(contact.id, "interested")}
                                    disabled={adminActionLoadingId === contact.id}
                                    className={`w-full font-mono text-[10px] uppercase py-2.5 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                                      contact.status === "interested"
                                        ? "bg-amber-500/20 text-amber-500 border-amber-500/50 font-bold"
                                        : "bg-[#1f2937]/50 text-slate-400 border-slate-800 hover:text-amber-500"
                                    }`}
                                  >
                                    <Star className="w-3.5 h-3.5" />
                                    <span>⭐ Starred</span>
                                  </button>

                                  <button
                                    onClick={() => updateContactStatus(contact.id, "spam")}
                                    disabled={adminActionLoadingId === contact.id}
                                    className={`w-full font-mono text-[10px] uppercase py-2.5 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                                      contact.status === "spam"
                                        ? "bg-red-500/20 text-red-500 border-red-500/50 font-bold"
                                        : "bg-[#1f2937]/50 text-slate-400 border-slate-800 hover:text-red-400"
                                    }`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>🗑️ Spam</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

              </div>
            )}
          </main>
        </div>
      )}

      {/* iOS Fluid Glass Animated Mesh background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-10]">
        <div className="absolute inset-0 bg-[#070a13]" /> {/* Dark underlying base */}
        {/* Cobalt Blob */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 80, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -left-1/4 w-[85vw] h-[85vw] rounded-full bg-blue-600/10 blur-[130px]"
        />
        {/* Violet Blob */}
        <motion.div
          animate={{
            x: [0, -100, 60, 0],
            y: [0, 80, -50, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-violet-600/10 blur-[140px]"
        />
        {/* Teal Blob */}
        <motion.div
          animate={{
            x: [0, 50, -60, 0],
            y: [0, 90, -70, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/3 w-[70vw] h-[70vw] rounded-full bg-teal-600/5 blur-[120px]"
        />
      </div>

      {/* Primary Navigation Hub */}
      <header className="fixed top-0 left-0 right-0 w-full z-[1000] bg-slate-900/30 backdrop-blur-3xl saturate-150 border border-transparent border-t-white/10 border-l-white/10 md:border-b-white/5 border-b shadow-2xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 group">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-[#f9fafb] group-hover:text-[#3b82f6] transition-colors duration-200 uppercase whitespace-nowrap">
              NEERAJ D DEV
            </span>
          </a>
          
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-xs font-mono tracking-wider xl:tracking-widest uppercase">
            {[
              { id: "about", val: "The Pivot" },
              { id: "capabilities", val: "Capabilities" },
              { id: "projects", val: "SaaS Shipped" },
              { id: "experience", val: "Timeline" },
              { id: "contact", val: "Connect" }
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  className={`transition-colors duration-200 hover:text-[#3b82f6] relative py-1.5 whitespace-nowrap ${
                    isActive ? "text-[#3b82f6]" : "text-[#f9fafb]/60"
                  }`}
                >
                  {link.val}
                  {isActive && (
                    <motion.div 
                      layoutId="currentNavIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b82f6]" 
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRoleFitModalOpen(true)}
              id="header-role-match-btn"
              className="hidden sm:inline-flex text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 border border-[#3b82f6]/30 hover:border-[#3b82f6]/50 text-[#3b82f6] px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Evaluate Fit</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsContactModalOpen(true)}
              id="header-lets-talk-btn"
              className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-[#3b82f6] hover:bg-[#3b82f6]/95 border border-transparent text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-305 inline-flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-lg shadow-[#3b82f6]/15 hover:shadow-[#3b82f6]/25 whitespace-nowrap"
            >
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Let's Talk</span>
            </motion.button>

            {/* Mobile Hamburger Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open global navigation"
              className="lg:hidden p-2 text-slate-300 hover:text-[#3b82f6] rounded-lg bg-white/5 hover:bg-slate-800/40 transition-colors cursor-pointer border border-white/5"
            >
              <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </motion.button>
          </div>
        </div>
      </header>
{currentPath === "/" && (
  <div className="fixed top-[112px] sm:top-[120px] left-0 right-0 z-[900] px-4 sm:px-6 lg:px-12 pointer-events-none">
    <div className="max-w-7xl mx-auto flex justify-center relative">
      <div className="absolute inset-x-8 -inset-y-3 bg-black/30 blur-2xl rounded-full" />
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsChatModalOpen(true)}
        className="relative pointer-events-auto w-full max-w-3xl bg-white/[0.08] backdrop-blur-3xl saturate-150 border border-white/15 hover:bg-white/[0.11] hover:border-white/25 shadow-2xl shadow-black/30 rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 group ring-1 ring-white/[0.08]"
      >
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white/75 group-hover:text-white transition-colors shrink-0" />
          <span className="text-white/75 font-sans font-light text-xs sm:text-sm md:text-base truncate select-none">
            Ask Neeraj's AI Agent anything...
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <kbd className="hidden sm:inline-flex text-[8px] font-mono font-bold text-white/55 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md uppercase tracking-wider select-none">
            ASK CONSOLE
          </kbd>
          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10 border border-white/10 group-hover:bg-white/15 transition-all">
            <ChevronRight className="w-3 h-3 text-white/75 transition-colors" />
          </div>
        </div>
      </motion.button>
    </div>
  </div>
)}
      {/* --- RESPONSIVE MOBILE & TABLET FLYOUT NAVIGATION DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark background modal overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[1900] bg-black/70 backdrop-blur-sm lg:hidden"
            />
            
            {/* Staggered entry navigation tray */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xs sm:max-w-sm z-[1950] border-l border-white/5 flex flex-col justify-between shadow-2xl lg:hidden"
              style={{
                backgroundColor: "rgba(10, 15, 26, 0.98)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)"
              }}
            >
              <div className="p-5 sm:p-6">
                {/* Header context */}
                <div className="flex items-center justify-between pb-5 border-b border-white/5 mb-6 sm:mb-8">
                  <span className="text-xs sm:text-sm font-bold tracking-wider text-[#f9fafb] uppercase">
                    NEERAJ D DEV
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer border-0"
                    aria-label="Close global navigation"
                  >
                    <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>

                {/* Vertical interactive list with high readability */}
                <div className="flex flex-col gap-4 font-mono text-xs sm:text-sm tracking-wider sm:tracking-widest uppercase text-left">
                  {[
                    { id: "about", val: "The Pivot" },
                    { id: "capabilities", val: "Capabilities" },
                    { id: "projects", val: "SaaS Shipped" },
                    { id: "experience", val: "Timeline" },
                    { id: "contact", val: "Connect" }
                  ].map((link, index) => {
                    const isActive = activeSection === link.id;
                    return (
                      <motion.a
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        key={link.id}
                        href={`#${link.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`py-3 px-3.5 rounded-xl flex items-center justify-between transition-all duration-200 ${
                          isActive 
                            ? "bg-[#3b82f6]/10 text-[#3b82f6] font-bold" 
                            : "text-[#f9fafb]/60 hover:bg-white/[0.02] hover:text-[#3b82f6]"
                        }`}
                      >
                        <span>{link.val}</span>
                        <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-[#3b82f6] translate-x-0.5" : "text-slate-500 opacity-40"} transition-all`} />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Action Suite in mobile menu footer */}
              <div className="p-5 sm:p-6 border-t border-white/5 space-y-3.5 bg-black/40">
                {/* Role match engine button block */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => setIsRoleFitModalOpen(true), 240);
                  }}
                  className="w-full font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#3b82f6]/15 hover:bg-[#3b82f6]/25 border border-[#3b82f6]/30 text-[#3b82f6] py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span>Evaluate Fit</span>
                </button>
                
                {/* Secondary Lets Talk direct reachout */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => setIsContactModalOpen(true), 240);
                  }}
                  className="w-full font-mono text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#3b82f6] hover:bg-[#3b82f6]/95 border border-transparent text-white py-3 rounded-xl transition-all duration-305 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#3b82f6]/10"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Contact</span>
                </button>

                <div className="text-center font-mono text-[8px] text-slate-500 select-none uppercase tracking-widest pt-2 opacity-50">
                  SYSTEM PORTFOLIO ROUTER
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* 1. HERO SECTION */}
        <section id="hero" className="pt-40 sm:pt-44 md:pt-52 pb-12 md:pb-28 flex flex-col justify-center min-h-[calc(100vh-80px)] scroll-mt-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
            {/* Left Text Block */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-3 sm:mb-4"
              >
                <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.35em] text-[#3b82f6] uppercase">
                  NEERAJ D DEV
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] uppercase mb-6 sm:mb-8"
              >
                Operations & <br />
                Program Manager.<br />
                <span className="text-[#3b82f6]">0 → 1 Builder.</span><br />
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

              {/* Chat console is the primary entry point below */}
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
                I'm Neeraj — an operations and program manager based in Bangalore. I bring 9+ years of total execution experience, with the last 7+ years laser-focused on scaling B2B service operations, large-scale infrastructure delivery, and independent product development.
              </p>
              
              <p>
                My career has been anything but linear. I started on construction sites coordinating a <strong className="text-[#f9fafb] font-medium">₹75 Crore infrastructure project</strong>, managing 100+ daily workforce and 7 subcontractors. Then I pivoted — built a 3D visualization delivery business from scratch, grew it to <strong className="text-[#f9fafb] font-medium">₹3.5L monthly revenue</strong>, managed 150+ client accounts and 1,000+ projects with a small remote team. Then I taught myself to build software using AI tools and shipped multiple working platforms — no engineering team, no coding background.
              </p>
              
              <p>
                I think in systems. I measure everything. And I use AI not as a novelty but as a core operating advantage — daily, practically, and obsessively. What drives me is simple: I want to be in rooms where hard problems are being solved, and I want to be the person who builds the system that solves them.
              </p>
              
              {/* Key numbers metrics */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-[#f9fafb]/50">
                <div className="bg-slate-900/30 backdrop-blur-3xl saturate-150 border border-transparent border-t-white/10 border-l-white/10 shadow-2xl shadow-black/40 p-5 rounded relative overflow-hidden group hover:bg-slate-800/25 transition-all duration-300">
                  <div className="text-[#3b82f6] text-xl font-bold mb-1 font-sans">9+ Years</div>
                  <div>Cross-Discipline Execution</div>
                </div>
                <div className="bg-slate-900/30 backdrop-blur-3xl saturate-150 border border-transparent border-t-white/10 border-l-white/10 shadow-2xl shadow-black/40 p-5 rounded relative overflow-hidden group hover:bg-slate-800/25 transition-all duration-300">
                  <div className="text-[#3b82f6] text-xl font-bold mb-1 font-sans">1000+</div>
                  <div>Commercial Deliverables</div>
                </div>
                <div className="bg-slate-900/30 backdrop-blur-3xl saturate-150 border border-transparent border-t-white/10 border-l-white/10 shadow-2xl shadow-black/40 p-5 rounded relative overflow-hidden group hover:bg-slate-800/25 transition-all duration-300">
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
            <div className="md:col-span-2 group bg-slate-900/30 backdrop-blur-3xl saturate-150 border border-transparent border-t-white/10 border-l-white/10 shadow-2xl shadow-black/40 rounded-lg p-8 sm:p-12 transition-all duration-300 hover:bg-slate-800/25 relative overflow-hidden flex flex-col md:flex-row justify-between gap-8">
              <div className="absolute top-[-40px] right-[-40px] w-72 h-72 bg-gradient-to-bl from-[#3b82f6]/5 to-transparent blur-3xl pointer-events-none group-hover:from-[#3b82f6]/10" />
              
              <div className="max-w-xl relative z-10">
                <div className="w-12 h-12 rounded bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 text-[#3b82f6]">
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
            <div className="group bg-slate-900/30 backdrop-blur-3xl saturate-150 border border-transparent border-t-white/10 border-l-white/10 shadow-2xl shadow-black/40 rounded-lg p-8 sm:p-12 transition-all duration-300 hover:bg-slate-800/25 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div className="absolute top-[-30px] right-[-30px] w-52 h-52 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 text-[#3b82f6]">
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
            <div className="group bg-slate-900/30 backdrop-blur-3xl saturate-150 border border-transparent border-t-white/10 border-l-white/10 shadow-2xl shadow-black/40 rounded-lg p-8 sm:p-12 transition-all duration-300 hover:bg-slate-800/25 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
              <div className="absolute top-[-30px] right-[-30px] w-52 h-52 bg-gradient-to-bl from-[#3b82f6]/5 to-transparent blur-2xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 text-[#3b82f6]">
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
              Projects & Builds
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
                
                <div className="space-y-4">
                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    A complete 0-to-1 SaaS architecture built entirely independently to solve a real operational bottleneck.
                  </p>
                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    An all-in-one workspace and procurement system for interior designers that unifies the entire workflow from 3D concept to final delivery.
                  </p>
                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    By integrating room-by-room space management with a curated catalog of real, purchasable products, it solves the infamous "ghost product" problem where 3D renders show non-existent or unsourcable items. Designers can select real catalog items, request beautiful photorealistic 3D renders from the core team, and let clients review and pay seamlessly within a unified concept-to-cart transaction pipeline that eliminates manual vendor search and coordination chaos.
                  </p>
                </div>
                
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
                
                <div className="space-y-4">
                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    A premium, escrow-secured collaboration network and project engine that connects discerning studios and interior designers with the top 10% of 3D visualization artists.
                  </p>
                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    Engineered to bring absolute order to freelancing, De'Artisa Hub features an intelligent scoping engine that formats raw ideas into bulletproof technical briefs. It protects both parties with a secure 50/50 escrow payment gateway (releasing funds only upon explicit sign-offs) and provides a clean, zero-noise centralized workspace for real-time milestone reviews, file delivery, and photorealistic revisions.
                  </p>
                </div>
                
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

                <div className="space-y-4">
                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    A vanilla JavaScript productivity and finance dashboard built as a responsive, installable PWA with no frontend framework.
                  </p>

                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    The app includes daily task and habit tracking, priority-based task creation, repeat scheduling, done/partial/skipped/exempt states, task filtering, day sealing, missed-day recovery, and localStorage persistence so every day maintains its own task record.
                  </p>

                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    It also includes a multi-view progress dashboard for day, week, month, and year analytics, plus a finance module for bank balances, credit cards, EMIs, loans, expenses, income, money owed, net worth, cash flow, payoff tracking, and financial health insights.
                  </p>

                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    Built with localStorage-first persistence, optional Supabase sync, custom date handling, PIN lock security, service-worker support, and a mobile-friendly bottom navigation experience.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["Vanilla JS", "LocalStorage", "PWA", "Service Worker", "Supabase Sync", "Finance Dashboard", "PIN Security"].map((tag) => (
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
                    href="https://github.com/neerajddev/Tracker" 
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

            {/* Project 4: LinkAI Post */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center group pb-16 last:border-0 last:pb-0">
              <div className="lg:col-span-6 flex flex-col gap-6" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-[#3b82f6] transition-colors">
                      Typomatic AI
                    </h3>
                  </div>
                  <p className="text-[#3b82f6] font-mono text-xs tracking-widest uppercase font-bold">
                    Cross-Platform LinkedIn Automation App
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    Typomatic AI is a cross-platform mobile app that helps founders and B2B professionals generate LinkedIn posts, plan multi-post campaigns, schedule content, and auto-publish through cloud sync even when the phone is offline.
                  </p>

                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    The app integrates Google Gemini for topic, article, sector, and context-based post generation, with length controls, draft editing, LinkedIn-safe sanitization, and campaign generation for up to 30 posts in one run.
                  </p>

                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    It includes sector-based news discovery, on-demand AI summaries, a campaign planner, schedule previews, smart peak-time suggestions, an engagement heatmap, LinkedIn OAuth, direct publishing, and a Supabase-backed auto-publishing queue.
                  </p>

                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    Built with Kotlin Multiplatform and Compose Multiplatform using MVVM, Room KMP, Ktor, Supabase Auth/Postgres/RLS, Edge Functions, pg_cron, client-side encryption, PIN lock, and LinkedIn OAuth + Posts API.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["Kotlin Multiplatform", "Compose Multiplatform", "Gemini API", "Supabase", "Edge Functions", "pg_cron", "LinkedIn OAuth", "Room KMP", "Ktor"].map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-wider uppercase bg-slate-800 text-[#f9fafb]/70 px-3 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs tracking-wider">
                  <a 
                    href="https://drive.google.com/file/d/1pjZwxwKXtxzRvz43LPXZGd65vtLw2sUk/view?usp=drive_link" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-[#3b82f6] hover:text-white font-semibold group/link"
                  >
                    ANDROID APK <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>

                  <a 
                    href="https://github.com/inddev123-wq/TypoMaticAI" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-[#f9fafb]/60 hover:text-[#3b82f6] group/link"
                  >
                    GITHUB <ArrowUpRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

                <p className="text-[11px] text-[#f9fafb]/45 font-light leading-relaxed max-w-xl">
                  Android APK available for testing. iOS build runs locally via Xcode; public iOS distribution is pending Apple Developer Program enrollment.
                </p>
              </div>

              <div className="lg:col-span-6">
                <div className="w-full aspect-[16/10] bg-[#1f2937] border border-slate-700 rounded flex flex-col items-center justify-center p-6 text-center hover:border-[#3b82f6]/40 transition-colors duration-300 relative overflow-hidden group/img">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 via-transparent to-amber-500/5 pointer-events-none" />
                  <div className="absolute top-3 left-3 font-mono text-[9px] text-[#f9fafb]/25 z-0">ANDROID_BUILD_PREVIEW</div>

                  <div className="w-[210px] max-w-full rounded-[28px] border border-slate-700 bg-[#111827] p-3 shadow-2xl shadow-black/40 relative z-10">
                    <div className="h-2 w-16 rounded-full bg-slate-700 mx-auto mb-4" />
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-5 h-5 text-[#3b82f6]" />
                        <div>
                          <div className="h-2 w-24 bg-slate-600 rounded mb-1" />
                          <div className="h-1.5 w-16 bg-slate-700 rounded" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-700 rounded" />
                        <div className="h-2 w-11/12 bg-slate-700 rounded" />
                        <div className="h-2 w-9/12 bg-slate-700 rounded" />
                      </div>
                      <div className="grid grid-cols-5 gap-1 pt-2">
                        {[35, 55, 80, 45, 65].map((height, index) => (
                          <div key={index} className="h-16 bg-slate-800 rounded flex items-end overflow-hidden">
                            <div className="w-full bg-[#3b82f6]" style={{ height: `${height}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <img
                    src="typomatic-ai.png"
                    alt="Typomatic AI Android App"
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />

                  <span className="font-mono text-[10px] text-[#f9fafb]/80 font-bold tracking-wide uppercase z-10 mt-5">
                    [ Image Placeholder: Typomatic AI App Screenshot ]
                  </span>
                  <span className="text-[10px] text-[#f9fafb]/45 mt-1 z-10">
                    Cross-platform LinkedIn campaign planner and auto-publishing dashboard
                  </span>
                </div>
              </div>
            </div>

            {/* Project: Warranty Vault & Concierge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center group pb-16 last:border-0 last:pb-0">
              <div className="lg:col-span-6 flex flex-col gap-6" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-[#3b82f6] transition-colors">
                      Warranty Vault & Concierge
                    </h3>
                    <span className="font-mono text-[9px] tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded">
                      In Development
                    </span>
                  </div>

                  <p className="text-[#3b82f6] font-mono text-xs tracking-widest uppercase font-bold">
                    Offline-First Warranty Tracker & AI Complaint Assistant
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    Warranty Vault & Concierge is an offline-first personal utility app for storing, tracking, and escalating product warranties securely from a local device-first vault.
                  </p>

                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    The app uses on-device OCR through Google ML Kit to extract receipt and invoice data, then applies Gemini-assisted parsing to structure warranty metadata and draft professional support escalation emails.
                  </p>

                  <p className="text-[#f9fafb]/80 font-light leading-[1.65] text-base sm:text-lg">
                    Architecturally, it follows a feature-first Flutter structure with Riverpod state management, secure local authentication, modular OCR and AI services, local warranty records, support ticket tracking, and adaptive routing for web and native experiences.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["Flutter", "Dart", "Riverpod", "ML Kit OCR", "Gemini API", "Secure Storage", "Offline-First"].map((tag) => (
                    <span key={tag} className="font-mono text-[10px] tracking-wider uppercase bg-slate-800 text-[#f9fafb]/70 px-3 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="w-full aspect-[16/10] bg-[#374151] border border-slate-700 rounded flex flex-col items-center justify-center p-6 text-center hover:border-[#3b82f6]/40 transition-colors duration-300 relative overflow-hidden group/img">
                  <img 
                    src="warranty-vault.png" 
                    alt="Warranty Vault & Concierge App"
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="absolute top-3 left-3 font-mono text-[9px] text-[#f9fafb]/25 z-0">
                    VAULT_APP_PREVIEW
                  </div>

                  <div className="w-12 h-12 rounded bg-[#111827]/40 border border-slate-700 flex items-center justify-center text-[#3b82f6] mb-3 group-hover/img:scale-105 transition-transform duration-300 z-0">
                    <Lock className="w-5 h-5" />
                  </div>

                  <span className="font-mono text-[10px] text-[#f9fafb]/80 font-bold tracking-wide uppercase z-0">
                    [ Image Placeholder: Warranty Vault App Screenshot ]
                  </span>

                  <span className="text-[10px] text-[#f9fafb]/45 mt-1 z-0">
                    Secure warranty vault, OCR capture, and AI complaint concierge
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
            <p className="text-slate-400 text-sm italic mt-2">
              A 9-year progression from ground-level civil infrastructure to automated digital operations.
            </p>
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
                  <p className="text-xs text-[#f9fafb]/50">Head of Operations & Program Delivery</p>
                </div>

                <div>
                  <div className="absolute left-2.5 w-3.5 h-3.5 rounded-full bg-slate-700 ring-4 ring-[#111827] mt-[0.35rem]" />
                  <div className="font-mono text-xs font-bold text-[#f9fafb]/50 tracking-widest uppercase">Mar 2019 – Aug 2021</div>
                  <p className="text-sm font-bold text-[#f9fafb] mt-1">ULCCS Ltd</p>
                  <p className="text-xs text-[#f9fafb]/50">Site Engineer (Acting Project Lead)</p>
                </div>

                <div>
                  <div className="absolute left-2.5 w-3.5 h-3.5 rounded-full bg-slate-700 ring-4 ring-[#111827] mt-[0.35rem]" />
                  <div className="font-mono text-xs font-bold text-[#f9fafb]/50 tracking-widest uppercase">Jan 2017 – Sep 2018</div>
                  <p className="text-sm font-bold text-[#f9fafb] mt-1">Earlier Career</p>
                  <p className="text-xs text-[#f9fafb]/50">Site Engineer</p>
                </div>

              </div>
            </div>

            {/* Timeless narratives & structured records */}
            <div className="lg:col-span-8 space-y-14">
              
              {/* De'Artisa */}
              <div className="relative group p-6 -m-6 hover:bg-[#1f2937]/30 rounded transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5 group-hover:text-[#3b82f6] transition-colors duration-200">
                  De'Artisa LLP <span className="text-sm font-normal text-[#f9fafb]/45 italic font-sans">(Nov 2021 – Present | Bangalore)</span>
                </h3>
                <p className="text-xs font-mono text-[#3b82f6] tracking-wider mb-4 uppercase font-bold">
                  Head of Operations & Program Delivery
                </p>
                <ul className="text-[#f9fafb]/80 font-light text-base leading-[1.65] space-y-2.5 list-none pl-0">
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Built a B2B service delivery business from zero — no funding, no playbook, no team. Grew to 150+ client accounts and ₹3.5L monthly revenue at peak.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Designed and ran a full operational system using Google Workspace — real-time project tracking, SLA monitoring, freelancer coordination, and client communication pipelines handling 80–100 active projects simultaneously.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Managed complete P&L independently — pricing, vendor contracts, payments, and margin optimisation.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Built and managed a distributed remote team end-to-end — hiring, onboarding, daily KPI tracking, quality scoring, and offboarding.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Owned all client escalation management — converting high-stakes situations into long-term retention consistently.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Reduced administrative overhead by 30% through workflow automation using Google Forms, AppSheet, and API integrations.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Independently built and deployed two SaaS platforms — Design&Cart and Deartisa Hub — using Supabase, Vercel, GitHub Copilot, and Cloudinary with zero external engineering support.
                  </li>
                </ul>
              </div>

              {/* ULCCS */}
              <div className="relative group p-6 -m-6 hover:bg-[#1f2937]/30 rounded transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5 group-hover:text-[#3b82f6] transition-colors duration-200">
                  ULCCS Ltd <span className="text-sm font-normal text-[#f9fafb]/45 italic font-sans">(Mar 2019 – Aug 2021 | Ernakulam & Alappuzha, Kerala)</span>
                </h3>
                <p className="text-xs font-mono text-[#3b82f6] tracking-wider mb-4 uppercase font-bold">
                  Site Engineer (Acting Project Lead)
                </p>
                <ul className="text-[#f9fafb]/80 font-light text-base leading-[1.65] space-y-2.5 list-none pl-0">
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Led end-to-end execution of a ₹75 Crore, 12-storey infrastructure project — coordinating 100+ daily workforce across 7 specialised subcontractors.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Managed a concurrent portfolio of 5 sub-projects valued at ₹12–15 Crore combined — optimising cross-site resource allocation and milestone tracking.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Conducted regular coordination meetings with project managers, junior engineers, and site leaders to assess weekly and monthly targets.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Managed contractor activities weekly — validating work accuracy for prompt payment processing.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Built sector-wise cost-tracking systems and daily measurement verification protocols — achieving zero cost overruns across all sites.
                  </li>
                  <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#3b82f6]">
                    Aligned enterprise clients, government regulatory bodies, and external contractors to deliver all milestones strictly on schedule.
                  </li>
                </ul>
              </div>

              {/* Site Engineer */}
              <div className="relative group p-6 -m-6 hover:bg-[#1f2937]/30 rounded transition-colors duration-300">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1.5 group-hover:text-[#3b82f6] transition-colors duration-200">
                  Earlier Career <span className="text-sm font-normal text-[#f9fafb]/45 italic font-sans">(Jan 2017 – Sep 2018 | Kerala)</span>
                </h3>
                <p className="text-xs font-mono text-[#3b82f6] tracking-wider mb-4 uppercase font-bold">
                  Site Engineer
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">Melange Homes</h4>
                    <ul className="text-[#f9fafb]/80 font-light text-base leading-[1.65] space-y-2 list-none pl-0">
                      <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-slate-500">
                        Supported CEO across AutoCAD drafting, exterior design, on-site labour and material management, client coordination, and project estimation.
                      </li>
                      <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-slate-500">
                        Interpreted construction blueprints and directed masons for precise execution.
                      </li>
                      <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-slate-500">
                        Labour and materials regulation ensuring efficient daily site operations.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2">Government Corporation Contractor</h4>
                    <ul className="text-[#f9fafb]/80 font-light text-base leading-[1.65] space-y-2 list-none pl-0">
                      <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-slate-500">
                        Supervised construction site operations ensuring compliance with safety regulations and project timelines.
                      </li>
                      <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-slate-500">
                        Conducted quality control checks to ensure workmanship met project specifications.
                      </li>
                      <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-slate-500">
                        Managed crew scheduling to avoid delays across active sites.
                      </li>
                    </ul>
                  </div>
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
                href="https://www.linkedin.com/in/neerajddev"
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
                  linkedin.com/in/neerajddev
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
            className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6 bg-[#111827]/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-[24px] p-6 sm:p-8 flex flex-col shadow-2xl shadow-black/80 overflow-hidden"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(31, 41, 55, 0.4)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)'
              }}
            >
              {/* Close Button top right */}
              <button 
                onClick={() => setShowCVModal(false)}
                className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-850/40 hover:bg-slate-800/80 transition-colors cursor-pointer border-0 select-none"
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

      {/* --- PREMIUM MULTI-STEP LET'S TALK MODAL --- */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactModalOpen(false)}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-[#111827]/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-[24px] p-6 sm:p-8 flex flex-col shadow-2xl shadow-black/80 overflow-y-auto max-h-[90vh]"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(31, 41, 55, 0.4)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)'
              }}
            >
              {/* iOS Grab Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5 shrink-0" />

              {/* Close Button */}
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-850/40 hover:bg-slate-800/80 transition-colors cursor-pointer border-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Split layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2 text-left">
                
                {/* Left Column: Direct Contact Hub */}
                <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 pb-6 lg:pb-0 lg:pr-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-1 font-sans">
                        Let's Talk
                      </h3>
                      <p className="text-xs text-slate-300 font-light font-sans leading-relaxed">
                        Evaluations, custom programs, or business bottlenecks? Reach out directly using the coordinates below, or trigger an automated pipeline check.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Email Card */}
                      <div 
                        onClick={handleCopyEmail}
                        className="group bg-white/5 border border-white/5 hover:border-[#3b82f6]/40 p-4 rounded-xl cursor-pointer transition-all duration-300 relative select-none"
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <Mail className="w-4 h-4 text-[#3db0ff]" />
                          <span className="font-mono text-[8px] text-[#f9fafb]/30 uppercase tracking-widest font-bold">COPY COORD</span>
                        </div>
                        <div className="text-[9px] font-mono text-[#f9fafb]/40 mb-0.5 uppercase tracking-wide">Direct Email</div>
                        <div className="text-xs font-semibold truncate text-[#f9fafb] group-hover:text-[#3db0ff] transition-colors font-mono">
                          neerajddev.pillai@gmail.com
                        </div>
                        
                        <AnimatePresence>
                          {copied && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute bottom-2 right-2 bg-[#3b82f6] text-white text-[8px] font-mono px-2 py-0.5 rounded flex items-center gap-1"
                            >
                              <Check className="w-2.5 h-2.5 animate-pulse" /> Copied!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* LinkedIn Card */}
                      <a 
                        href="https://www.linkedin.com/in/neerajddev"
                        target="_blank"
                        referrerPolicy="no-referrer"
                        rel="noreferrer"
                        className="group bg-white/5 border border-white/5 hover:border-[#3b82f6]/40 p-4 rounded-xl transition-all duration-300 block no-underline select-none"
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <Linkedin className="w-4 h-4 text-[#3db0ff]" />
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#f9fafb]/25 group-hover:text-[#3db0ff] transition-colors" />
                        </div>
                        <div className="text-[9px] font-mono text-[#f9fafb]/40 mb-0.5 uppercase tracking-wide">LinkedIn Profile</div>
                        <div className="text-xs font-semibold truncate text-[#f9fafb] group-hover:text-[#3db0ff] transition-colors font-mono">
                          linkedin.com/in/neerajddev
                        </div>
                      </a>

                      {/* Location HQ Card */}
                      <div className="bg-white/5 border border-white/5 p-4 rounded-xl select-none">
                        <div className="flex justify-between items-start mb-2.5">
                          <MapPin className="w-4 h-4 text-[#3db0ff]" />
                          <span className="font-mono text-[8px] text-[#f9fafb]/30 tracking-widest font-bold">HQ</span>
                        </div>
                        <div className="text-[9px] font-mono text-[#f9fafb]/40 mb-0.5 uppercase tracking-wide">Location Coords</div>
                        <div className="text-xs font-semibold text-[#f9fafb]">
                          Bangalore, India
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest hidden lg:block select-none">
                    ⚡ Fast Routing Pipeline
                  </div>
                </div>

                {/* Right Column: Multi-Step Request Engine */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Progress Bar Header */}
                    <div className="mb-5 font-mono">
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#f9fafb]/45 mb-2.5 font-bold">
                        <span>Executive Engagement Pipeline</span>
                        <span className="text-[#3b82f6]">
                          {contactFormStep === "success" ? "Completed" : `Step ${contactFormStep} of 3`}
                        </span>
                      </div>
                      <div className="w-full bg-[#111827]/40 h-1.5 rounded overflow-hidden">
                        <motion.div
                          animate={{
                            width: 
                              contactFormStep === 1 ? "33.3%" :
                              contactFormStep === 2 ? "66.6%" : "100%"
                          }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="bg-[#3b82f6] h-full"
                        />
                      </div>
                    </div>

                    {/* Steps Animation Presence */}
                    <AnimatePresence mode="wait">
                      {contactFormStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.22 }}
                          className="space-y-5"
                        >
                          <div>
                            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-1 font-sans">
                              What's on your mind?
                            </h3>
                            <p className="text-xs text-slate-300 font-light font-sans leading-relaxed">
                              Provide a raw business statement, opening role name, or automation proposal. Max 15 words.
                            </p>
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={contactSubject}
                              onChange={(e) => setContactSubject(e.target.value)}
                              placeholder="e.g., Hiring Neeraj to setup systems, automate structures, or trigger operations"
                              className="w-full bg-[#111827]/60 text-white border border-slate-700/60 rounded px-4 py-3.5 text-sm focus:outline-none focus:border-[#3b82f6] placeholder-slate-600 font-sans"
                              autoFocus
                            />
                            
                            {/* Live word counter */}
                            <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono">
                              <span className={subjectWords > 15 ? "text-red-400 font-bold" : "text-slate-500"}>
                                {subjectWords} / 15 words
                              </span>
                              {subjectWords > 15 && (
                                <span className="text-red-400 text-right font-bold">Must be 15 words or fewer</span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end pt-3">
                            <button
                              type="button"
                              onClick={() => setContactFormStep(2)}
                              disabled={!isStep1Valid}
                              className={`font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 border-0 ${
                                isStep1Valid
                                  ? "bg-[#3b82f6] hover:bg-[#3b82f6]/95 text-white shadow-md shadow-[#3b82f6]/10"
                                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              <span>Continue</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {contactFormStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.22 }}
                          className="space-y-5"
                        >
                          <div>
                            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-1 font-sans">
                              Tell me more about it
                            </h3>
                            <p className="text-xs text-slate-300 font-light font-sans leading-relaxed">
                              Briefly describe the operational bottlenecks, tech stack, or objectives. Requires at least 25 words. No URLs or phone numbers.
                            </p>
                          </div>

                          <div className="relative">
                            <textarea
                              value={contactContext}
                              onChange={(e) => setContactContext(e.target.value)}
                              placeholder="Provide details about your project scope, timeline, operational needs, or team architecture. Feel free to explain standard system operations..."
                              rows={5}
                              className="w-full bg-[#111827]/60 text-white border border-slate-700/60 rounded p-4 text-xs sm:text-sm focus:outline-none focus:border-[#3b82f6] placeholder-slate-600 resize-none font-sans"
                              autoFocus
                            />
                            
                            {/* Live word counter */}
                            <div className="flex justify-between items-center mt-2 text-[10px] font-mono">
                              <span className={contextWords < 25 ? "text-amber-500" : "text-emerald-400 font-bold"}>
                                {contextWords} / 25 words minimum
                              </span>
                              {hasStep2UrlError && (
                                <span className="text-red-400 text-right font-bold">❌ Links or URLs are not permitted</span>
                              )}
                              {hasStep2PhoneError && (
                                <span className="text-red-400 text-right font-bold">❌ Phone numbers are not permitted here</span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between pt-3">
                            <button
                              type="button"
                              onClick={() => setContactFormStep(1)}
                              className="font-mono text-xs text-slate-400 hover:text-white underline cursor-pointer bg-transparent border-0"
                            >
                              Back
                            </button>

                            <button
                              type="button"
                              onClick={() => setContactFormStep(3)}
                              disabled={!isStep2Valid}
                              className={`font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 border-0 ${
                                isStep2Valid
                                  ? "bg-[#3b82f6] hover:bg-[#3b82f6]/95 text-white shadow-md shadow-[#3b82f6]/10"
                                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              <span>Perfect</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {contactFormStep === 3 && (
                        <form
                          key="step-3"
                          onSubmit={handleContactSubmit}
                          className="space-y-5"
                        >
                          <div>
                            <h3 className="text-xl font-extrabold text-white uppercase tracking-tight mb-1 font-sans">
                              Who is reaching out?
                            </h3>
                            <p className="text-xs text-slate-300 font-light font-sans leading-relaxed">
                              Let's collect your executive credentials for communication back-routing.
                            </p>
                          </div>

                          <div className="space-y-4">
                            {/* Honeypot Anti-spam (Hidden from screen & users) */}
                            <div className="sr-only opacity-0 absolute pointer-events-none" style={{ left: '-9999px' }}>
                              <label>Do not fill if you are human:</label>
                              <input
                                type="text"
                                value={websiteHoneypot}
                                onChange={(e) => setWebsiteHoneypot(e.target.value)}
                                tabIndex={-1}
                                placeholder="Your website URL address..."
                              />
                            </div>

                            {/* Full Name */}
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                                Your Full Name <span className="text-[#3b82f6] font-bold">*</span>
                              </label>
                              <input
                                type="text"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder="Jane Doe"
                                className="w-full bg-[#111827]/60 text-white border border-slate-700/60 rounded px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#3b82f6] placeholder-slate-600 font-sans"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Email */}
                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                                  Email Address <span className="text-[#3b82f6] font-bold">*</span>
                                </label>
                                <input
                                  type="email"
                                  value={contactEmail}
                                  onChange={(e) => setContactEmail(e.target.value)}
                                  placeholder="jane@organization.com"
                                  className="w-full bg-[#111827]/60 text-white border border-slate-700/60 rounded px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#3b82f6] placeholder-slate-600 font-sans"
                                  required
                                />
                              </div>

                              {/* Phone (Optional) */}
                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                                  Contact Phone <span className="text-slate-500 font-light">(Optional)</span>
                                </label>
                                <input
                                  type="tel"
                                  value={contactPhone}
                                  onChange={(e) => setContactPhone(e.target.value)}
                                  placeholder="+1 (234) 567-8910"
                                  className="w-full bg-[#111827]/60 text-white border border-slate-700/60 rounded px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#3b82f6] placeholder-slate-600 font-sans"
                                />
                              </div>
                            </div>
                          </div>

                          {contactError && (
                            <div className="p-3 bg-red-955/40 border border-red-900/40 rounded text-xs text-red-400 font-light">
                              {contactError}
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t border-slate-800/60 mt-4">
                            <button
                              type="button"
                              onClick={() => setContactFormStep(2)}
                              className="font-mono text-xs text-slate-400 hover:text-white underline cursor-pointer bg-transparent border-0"
                            >
                              Back
                            </button>

                            <button
                              type="submit"
                              disabled={!isStep3Valid || contactIsSubmitting}
                              className={`font-mono text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 border-0 ${
                                isStep3Valid && !contactIsSubmitting
                                  ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/10"
                                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              {contactIsSubmitting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                  <span>Submitting...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                  <span>Launch Request</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}

                      {contactFormStep === "success" && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center py-6 space-y-6"
                        >
                          <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500 flex items-center justify-center text-emerald-400 animate-pulse">
                              <Check className="w-8 h-8" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="font-extrabold text-2xl tracking-tight text-white uppercase font-sans">
                              Awesome, received!
                            </h3>
                            <p className="text-sm font-sans text-slate-300 max-w-sm mx-auto leading-relaxed font-light">
                              Thanks for reaching out—looking forward to connecting soon.
                            </p>
                          </div>

                          <div className="pt-4">
                            <button
                              type="button"
                              onClick={() => {
                                setIsContactModalOpen(false);
                                setContactFormStep(1);
                              }}
                              className="font-mono text-xs uppercase tracking-widest px-6 py-3.5 border border-slate-800 hover:border-[#3b82f6] text-white hover:bg-[#3b82f6]/5 transition-all rounded-lg cursor-pointer bg-[#111827]/40"
                            >
                              Return to Portfolio
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

              </div>

              {/* Secure footer credit */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-500 select-none">
                <span>SECURED CORE ENGINE</span>
                <span>NO BOTS ALLOWED</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PREMIUM COMPACT WATERFLUID ROLE FIT ANALYSER MODAL --- */}
      <AnimatePresence>
        {isRoleFitModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsRoleFitModalOpen(false)}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#111827]/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-[24px] p-4 sm:p-6 md:p-8 flex flex-col shadow-2xl shadow-black/80 overflow-y-auto max-h-[94vh] sm:max-h-[90vh]"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(31, 41, 55, 0.45)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)'
              }}
            >
              {/* iOS Grab Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 shrink-0" />
 
              {/* Close Button */}
              <button
                onClick={() => setIsRoleFitModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-slate-800/80 transition-colors cursor-pointer border-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
 
              <div className="mb-4 sm:mb-6 font-mono shrink-0 select-none">
                <div className="flex justify-between items-center text-[8px] sm:text-[10px] uppercase tracking-widest text-[#f9fafb]/45 mb-1.5 font-bold">
                  <span>04.5 / AI MANDATE BENCHMARKING</span>
                  <span className="text-[#3db0ff]">ACTIVE SCANNER</span>
                </div>
                <div className="h-[1px] w-full bg-white/5" />
              </div>
 
              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start text-left">
                {/* Left Column: Context Input */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight mb-1 font-sans">
                      STRATEGIC ALIGNMENT EVALUATOR
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-light leading-relaxed font-sans mt-1.5">
                      Evaluating Neeraj for an open mandate, operations program, or automation workflow? Run his interactive AI benchmark analyzer to instantly test custom suitability matches.
                    </p>
                  </div>
 
                  <div className="bg-black/25 border border-white/5 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 font-mono text-[8px] text-[#f9fafb]/20 p-2 select-none pointer-events-none">CONTEXT_INPUT_STREAM</div>
                    
                    <label className="block text-[9px] sm:text-[10px] font-mono text-[#f9fafb]/50 tracking-wider uppercase mb-2">
                      PROJECT SCOPE OR MANDATE:
                    </label>
                    
                    <textarea
                      value={jdInput}
                      onChange={(e) => setJdInput(e.target.value)}
                      placeholder="Tell me what you're building, the operational bottlenecks you're facing, or the scope of the mandate..."
                      rows={5}
                      className="w-full bg-[#111827]/70 text-[#f9fafb] border border-white/5 rounded-xl p-3 text-xs font-sans focus:outline-none focus:border-[#3db0ff]/80 transition-colors resize-none placeholder-slate-550"
                    />
 
                    <div className="mt-4 flex flex-col gap-2.5">
                      <button
                        onClick={handleAnalyseFit}
                        disabled={isAnalysing || !jdInput.trim()}
                        className={`group w-full font-mono text-xs font-semibold tracking-wider uppercase px-5 py-3 sm:py-3.5 rounded-xl transition-all duration-300 inline-flex items-center justify-center cursor-pointer border-0 ${
                          isAnalysing || !jdInput.trim()
                            ? "bg-white/5 text-slate-500 cursor-not-allowed"
                            : "bg-[#3db0ff] hover:bg-[#3db0ff]/95 text-white active:scale-[0.98] shadow-lg shadow-[#3db0ff]/10"
                        }`}
                      >
                        {isAnalysing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                            Evaluating alignment...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            EVALUATE ALIGNMENT
                          </>
                        )}
                      </button>
 
                      <p className="text-[9px] text-slate-400 text-center font-sans tracking-wide leading-normal">
                        Powered by Gemini AI — alignment report extracted directly from live portfolio assets.
                      </p>
                    </div>
                  </div>
                </div>
 
                {/* Right Column: Match Output Workspace */}
                <div className="lg:col-span-7">
                  <div className="border border-white/5 bg-black/15 min-h-[220px] sm:min-h-[355px] rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden font-sans">
                    <div className="absolute top-4 right-4 font-mono text-[8px] sm:text-[9px] text-[#f9fafb]/20 select-none uppercase tracking-widest pointer-events-none">
                      Match_Output_Workspace
                    </div>
 
                    <AnimatePresence mode="wait">
                      {isAnalysing ? (
                        <motion.div
                          key="analysing-modal"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 flex flex-col items-center justify-center py-8 text-center"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#111827]/40 border border-dashed border-[#3db0ff] flex items-center justify-center relative mb-4 animate-pulse">
                            <Cpu className="w-5 h-5 text-[#3db0ff] animate-spin" style={{ animationDuration: '4s' }} />
                          </div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-2">
                            Mapping Strategic Fit
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-[#f9fafb]/50 max-w-sm leading-relaxed px-2 font-light">
                            Gemini AI is mapping Neeraj's operations depth, SaaS execution, and systems-building track record against the context you provided...
                          </p>
                        </motion.div>
                      ) : analysisError ? (
                        <motion.div
                          key="error-modal"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 flex flex-col items-center justify-center py-8 text-center text-red-400"
                        >
                          <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-900/60 flex items-center justify-center mb-4 text-red-500">
                            <X className="w-5 h-5" />
                          </div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider mb-2">
                            Analysis Interrupted
                          </h4>
                          <p className="text-[11px] max-w-sm leading-relaxed mx-auto text-red-300 font-light">
                            {analysisError}
                          </p>
                        </motion.div>
                      ) : analysisResult ? (
                        <motion.div
                          key="result-modal"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4 flex-1 text-left"
                        >
                          {(() => {
                            const parsed = parseAnalysisResult(analysisResult);
                            if (!parsed || !parsed.isParsed) {
                              return (
                                <div className="prose prose-invert max-w-none text-xs text-[#f9fafb]/80 font-light whitespace-pre-line leading-relaxed">
                                  {analysisResult}
                                </div>
                              );
                            }
 
                            const matchScoreNumber = parseFloat(parsed.score) || 0;
                            const scorePercentage = Math.min(100, Math.max(0, (matchScoreNumber / 10) * 100));
                            
                            return (
                              <div className="space-y-4 sm:space-y-5">
                                {/* Score Row */}
                                <div className="bg-[#111827]/40 border border-white/5 p-3 sm:p-4 rounded-xl flex flex-row items-center justify-between gap-3 sm:gap-4">
                                  <div className="flex-1 w-full font-mono">
                                    <div className="flex justify-between items-center mb-1.5 text-[8px] sm:text-[9px] tracking-wider uppercase text-[#f9fafb]/50">
                                      <span>Role Match Score</span>
                                      <span className="text-[#3db0ff] font-bold">{parsed.score}</span>
                                    </div>
                                    <div className="w-full bg-[#111827] border border-white/5 h-1.5 rounded overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scorePercentage}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="bg-[#3db0ff] h-full"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center justify-center px-2.5 py-1 sm:px-3 sm:py-1.5 border border-[#3db0ff]/30 bg-[#3db0ff]/5 rounded-lg min-w-[60px] sm:min-w-[70px]">
                                    <span className="font-sans text-xl sm:text-2xl font-extrabold text-[#3db0ff] leading-none text-center">
                                      {parsed.score.split('/')[0]}
                                    </span>
                                    <span className="font-mono text-[7px] sm:text-[8px] text-[#f9fafb]/40 tracking-widest uppercase mt-0.5">
                                      Score
                                    </span>
                                  </div>
                                </div>
 
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {/* Strong Matches Block */}
                                  <div className="space-y-2 font-sans">
                                    <h4 className="font-sans text-[10px] font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-1.5 font-sans">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                      Strong Matches:
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {parsed.strongMatches.map((point, index) => (
                                        <li key={index} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] leading-relaxed text-[#f9fafb]/75 font-sans">
                                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                          <span>{point}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
 
                                  {/* Unconventional Advantages Block */}
                                  <div className="space-y-2 font-sans">
                                    <h4 className="font-sans text-[10px] font-bold text-amber-500 tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-1.5 font-sans">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                      Unconventional Advantages:
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {parsed.gapsToAddress.map((point, index) => (
                                        <li key={index} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] leading-relaxed text-[#f9fafb]/75 font-sans">
                                          <Star className="w-3 h-3 text-amber-500 shrink-0 mt-0.5 fill-amber-500/20" />
                                          <span>{point}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
 
                                {/* Suggested Angle Box */}
                                <div className="bg-[#3db0ff]/5 border border-[#3db0ff]/20 p-3 sm:p-4 rounded-xl relative overflow-hidden">
                                  <div className="absolute top-0 right-0 bg-[#3db0ff]/10 text-[#3db0ff] font-mono text-[7px] sm:text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-bl select-none">
                                    Advisor Angle
                                  </div>
                                  <h4 className="font-sans text-[8px] sm:text-[9px] text-[#3db0ff] font-bold tracking-widest uppercase mb-1.5 font-sans">
                                    Positioning Focus:
                                  </h4>
                                  <p className="text-[10px] sm:text-[11px] leading-relaxed font-light text-[#f9fafb]/80 font-sans">
                                    {parsed.suggestedAngle}
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle-modal"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 flex flex-col items-center justify-center py-8 text-center"
                        >
                          <div className="w-10 h-10 rounded bg-[#111827] border border-white/5 flex items-center justify-center text-slate-500 mb-3 block">
                            <FileText className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#f9fafb]/40 mb-1">
                            Awaiting Context
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 max-w-xs leading-normal font-sans font-light">
                            Paste a role brief, founder mandate, operating challenge, or investment thesis to assess where Neeraj's execution profile creates leverage.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
 
                    <div className="mt-4 pt-3 border-t border-white/5 text-[8px] sm:text-[9px] font-mono text-slate-500 flex justify-between items-center select-none font-light">
                      <span>SYSTEM_CODE: G-FIT_v1.0</span>
                      <span>STATUS: SECURE_SCAN</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liquid Glass Command Console Modal */}
      <AnimatePresence>
        {isChatModalOpen && (
          <motion.div
            key="liquid-glass-command-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatModalOpen(false)}
            className="fixed inset-0 z-[5000] bg-slate-950/80 backdrop-blur-3xl flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              layout
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-slate-900/30 backdrop-blur-3xl saturate-150 border border-transparent border-t-white/10 border-l-white/10 shadow-2xl shadow-black/40 rounded-3xl sm:rounded-[32px] overflow-hidden flex flex-col"
            >
              {/* Header block with close and minimize */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <span className="text-[#3b82f6] animate-pulse text-xs sm:text-sm">✦</span>
                  <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-slate-300 uppercase">
                    AI Command Console & Operations Assistant
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsChatModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors border-0 cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                    title="Minimize & Close"
                  >
                    <kbd className="hidden sm:inline-block bg-slate-850 border border-slate-700 px-1 py-0.5 rounded text-[9px]">ESC</kbd>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable messages history inside the console */}
              <div className="flex-1 max-h-[350px] overflow-y-auto p-5 sm:p-7 space-y-4 scrollbar-thin bg-slate-950/60">
                {chatMessages.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
                      <Sparkles className="w-8 h-8 text-[#3b82f6] relative animate-pulse" />
                    </div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono mb-1.5">Operations AI Standby</h3>
                    <p className="text-xs text-slate-400 max-w-sm font-sans font-light leading-relaxed">
                      Ask Neeraj's authorized AI representative anything about operations, automations, startup shipping, or key background stats.
                    </p>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 sm:gap-4 items-start ${
                          msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-slate-800 text-white border border-slate-705 shadow-sm"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <User className="w-3.5 h-3.5" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`max-w-[85%] rounded-xl px-3.5 py-2 sm:py-2.5 leading-relaxed font-sans text-xs sm:text-sm ${
                            msg.role === "user"
                              ? "bg-[#3b82f6] text-white border-transparent shadow-sm"
                              : "bg-slate-900 border border-slate-800 text-[#f9fafb]/90 shadow-sm"
                          }`}
                        >
                          {(() => {
                            const hasLetsTalk = msg.content.includes("[TRIGGER_LETS_TALK]");
                            const hasCvOps = msg.content.includes("[TRIGGER_CV_OPS]");
                            const hasCvTech = msg.content.includes("[TRIGGER_CV_TECH]");
                            const hasCvFull = msg.content.includes("[TRIGGER_CV_FULL]");
                            
                            const cleanedContent = msg.content
                              .replace("[TRIGGER_LETS_TALK]", "")
                              .replace("[TRIGGER_CV_OPS]", "")
                              .replace("[TRIGGER_CV_TECH]", "")
                              .replace("[TRIGGER_CV_FULL]", "")
                              .trim();

                            const formatMessageText = (text: string) => {
                              const combinedRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|((?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/[a-zA-Z0-9_-]+|app\.designandcart\.in|hub\.deartisa\.com|designandcart\.in|deartisa\.com)[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)/gi;
                              const tokens = text.split(combinedRegex);
                              return tokens.map((token, i) => {
                                if (!token) return null;
                                if (token.includes('@') && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(token)) {
                                  return (
                                    <a 
                                      key={i} 
                                      href={`mailto:${token}`} 
                                      className="text-[#60a5fa] hover:text-[#93c5fd] underline font-medium break-all"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {token}
                                    </a>
                                  );
                                }
                                if (
                                  token.includes("linkedin.com") || 
                                  token.includes("designandcart.in") || 
                                  token.includes("deartisa.com")
                                ) {
                                  const url = token.startsWith("http") ? token : `https://${token}`;
                                  return (
                                    <a 
                                      key={i} 
                                      href={url} 
                                      className="text-[#60a5fa] hover:text-[#93c5fd] underline font-medium break-all"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {token}
                                    </a>
                                  );
                                }
                                return token;
                              });
                            };

                            return (
                              <>
                                <p className="whitespace-pre-line leading-relaxed">{formatMessageText(cleanedContent)}</p>
                                
                                {hasLetsTalk && (
                                  <div className="mt-3">
                                    <button
                                      onClick={() => {
                                        setIsChatModalOpen(false);
                                        setIsContactModalOpen(true);
                                      }}
                                      className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-[#3b82f6] hover:bg-[#3b82f6]/95 border border-transparent text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-305 inline-flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-lg shadow-[#3b82f6]/15 hover:shadow-[#3b82f6]/25 whitespace-nowrap active:scale-95 border-0"
                                    >
                                      <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                      <span>Let's Talk</span>
                                    </button>
                                  </div>
                                )}

                                {hasCvOps && (
                                  <div className="mt-3 text-left">
                                    <a
                                      href="/Neeraj_Dev_Operations.html"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg shadow-black/20 backdrop-blur-md flex items-center gap-2 border border-white/10 no-underline cursor-pointer inline-flex w-fit"
                                    >
                                      <span>✦ Download Operations & Program Delivery CV</span>
                                    </a>
                                  </div>
                                )}

                                {hasCvTech && (
                                  <div className="mt-3 text-left">
                                    <a
                                      href="/Neeraj_Dev_Builder.html"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg shadow-black/20 backdrop-blur-md flex items-center gap-2 border border-white/10 no-underline cursor-pointer inline-flex w-fit"
                                    >
                                      <span>✦ Download Product & Tech Builder CV</span>
                                    </a>
                                  </div>
                                )}

                                {hasCvFull && (
                                  <div className="mt-3 text-left">
                                    <a
                                      href="/NeerajDDev_CV_Final.html"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg shadow-black/20 backdrop-blur-md flex items-center gap-2 border border-white/10 no-underline cursor-pointer inline-flex w-fit"
                                    >
                                      <span>✦ Download Full Comprehensive Profile</span>
                                    </a>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ))}

                    {/* Loading State Bubble */}
                    {isChatLoading && (
                      <div className="flex gap-4 items-start">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-800 text-white border border-slate-705 shadow-sm">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <div className="bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Scroll Anchor */}
                <div id="chat-anchor" />
              </div>

              {/* Massive Input Field Container */}
              <div className="flex items-center gap-3 py-4 px-5 sm:py-5 sm:px-7 bg-slate-950/95 border-t border-slate-800/80 relative shrink-0">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={modalInputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="✦ Ask my AI Agent about my 9+ years of operations experience..."
                  className="flex-1 bg-transparent text-[#f9fafb] text-sm sm:text-base md:text-lg focus:outline-none placeholder-slate-400 font-sans border-0 font-light focus:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                
                {/* Action or Send Key */}
                <div className="flex items-center gap-2">
                  {isChatLoading ? (
                    <div className="w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!chatInput.trim()}
                      className="inline-flex text-[9px] font-mono font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded gap-1 items-center uppercase select-none transition-all cursor-pointer active:scale-95 disabled:opacity-40"
                    >
                      <CornerDownLeft className="w-2.5 h-2.5 text-slate-300" /> ENTER
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
