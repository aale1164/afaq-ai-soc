"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Map as MapIcon, Radio, Cpu, Activity, Users, 
  Server, User, Clock, Flame, Target, AlertTriangle, PlayCircle,
  Maximize, Minimize, Monitor, CheckCircle2, VolumeX, Volume2, LayoutGrid, Eye
} from "lucide-react";

// ==========================================
// 1. ENTERPRISE SAAS PREPARATION (MOCKS)
// ==========================================
const SESSION = {
  user: "AALE AL-RASHIDI",
  role: "Senior Commander",
  node: "BURAYDAH-NODE-ALPHA",
  status: "SECURE"
};

// ==========================================
// 2. LIVE CAMERA ECOSYSTEM (Verified Map & Aspect Fixes)
// ==========================================
const ALL_CAMERAS = [
  { id: "CAM-01", name: "محيط الحرم المكي", ai: "Public Live Feed", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/GavTnwpVcNw?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", filter: "contrast(1.05)" },
  { id: "CAM-02", name: "محيط الحرم المدني", ai: "Public Live Feed", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/naaOMgZbIHQ?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", filter: "contrast(1.05)" },
  { id: "CAM-03", name: "تقاطع شيبويا الذكي", ai: "Traffic AI Monitoring", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/dfVK7ld38Ys?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", filter: "contrast(1.1) brightness(0.9)" },
  { id: "CAM-04", name: "البث الإخباري - العربية", ai: "News Monitoring", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/n7eQejkXbnM?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", filter: "contrast(1.05)" },
  { id: "CAM-05", name: "البث الإخباري - تلفزيون سوريا", ai: "Regional Monitoring", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/ZN0aK3V0ds0?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", filter: "contrast(1.05)" },
  { id: "CAM-06", name: "البث الإخباري - قطر", ai: "Strategic Monitoring", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/d020NL_oFAY?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", filter: "contrast(1.1)" },
  { id: "CAM-07", name: "قناة الوثائقية", ai: "Intelligence Feed", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/TiPYdMXt_XI?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", filter: "contrast(1.05)" },
  { id: "CAM-08", name: "التحليل التكتيكي للحشود والمركبات", ai: "Crowd / Traffic AI", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/HpdO5Kq3o7Y?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", filter: "contrast(1.1)" }
];

// ==========================================
// 3. BULLETPROOF MEDIA RENDERER (Object-Fit Cover Hack)
// ==========================================
const MediaRenderer = ({ cam, isExpanded, isMuted }: { cam: any, isExpanded: boolean, isMuted: boolean }) => {
  const [hasError, setHasError] = useState(false);
  const effectivelyMuted = !isExpanded || isMuted;

  // Native MP4 Fallback
  if (cam.type !== "youtube" || hasError) {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#020305] overflow-hidden z-[1]">
        <video 
          src={cam.fallbackUrl || cam.url} 
          autoPlay loop muted={effectivelyMuted} playsInline 
          style={{ filter: cam.filter }} 
          className="absolute inset-0 w-full h-full object-cover opacity-95 pointer-events-none" 
        />
      </div>
    );
  }

  // Live YouTube Stream with massive 250% scale to guarantee NO black bars on any grid ratio
  const baseUrl = cam.url.replace(/&mute=[01]/g, "");
  const finalUrl = `${baseUrl}&mute=${effectivelyMuted ? "1" : "0"}`;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#020305] overflow-hidden z-[1]">
      <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] sm:w-[200%] sm:h-[200%] 2xl:w-[150%] 2xl:h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-95">
        <iframe 
          src={finalUrl} 
          onError={() => setHasError(true)}
          allow="autoplay; encrypted-media" 
          className="w-full h-full border-none pointer-events-none"
          tabIndex={-1}
          style={{ filter: cam.filter }}
        />
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN APPLICATION
// ==========================================
export default function AfaqEnterpriseSOC() {
  const [mounted, setMounted] = useState(false);
  const [sysState, setSysState] = useState("NORMAL"); 
  const [focusedCamIds, setFocusedCamIds] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  useEffect(() => { 
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  // --- Tactical Escalation Engine ---
  const handleSimulateAI = () => {
    if (sysState === "NORMAL") {
      setSysState("ESCALATED");
      setFocusedCamIds(["CAM-08"]); 
      setIsAudioMuted(true); 
      
      const newIncidents = [
        { id: "INC-994", cam: "CAM-08", type: "HIGH DENSITY CROWD ANOMALY", time: new Date().toLocaleTimeString(), duration: "LIVE", status: "RECORDING", severity: "CRITICAL" }
      ];
      setIncidents([...newIncidents, ...incidents]);
    } else {
      setSysState("NORMAL");
      setFocusedCamIds([]);
      setIsAudioMuted(true);
      setIncidents(prev => prev.map(inc => inc.status === "RECORDING" ? { ...inc, status: "SAVED CLIP", duration: "00:02:14" } : inc));
    }
  };

  const handleCameraClick = (id: string) => {
    if (sysState === "ESCALATED") return; 
    setFocusedCamIds(focusedCamIds.includes(id) ? [] : [id]);
    setIsAudioMuted(true); 
  };

  // Adaptive Side Panels
  const Panel = ({ title, action = null, children, className = "" }: any) => (
    <div className={`bg-[#0A0D14]/90 backdrop-blur-md border border-white/10 rounded-xl flex flex-col shadow-2xl relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5 shrink-0 z-10">
        <h3 className="text-[11px] font-bold text-slate-200 uppercase tracking-[0.15em] font-english">{title}</h3>
        {action}
      </div>
      <div className="flex-1 overflow-y-auto p-4 gap-3 flex flex-col scrollbar-hide z-0 relative">
        {children}
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen xl:h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#020305] text-slate-300 flex flex-col font-arabic selection:bg-blue-500/30">
      
      {/* Global CSS Injector */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Orbitron:wght@500;700&display=swap');
        .font-arabic { font-family: 'IBM Plex Sans Arabic', sans-serif; }
        .font-english { font-family: 'Inter', sans-serif; }
        .font-orbitron { font-family: 'Orbitron', sans-serif; letter-spacing: 0.1em; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15));
          background-size: 100% 4px;
          pointer-events: none;
        }
        .vignette {
          box-shadow: inset 0 0 100px rgba(0,0,0,0.95);
          pointer-events: none;
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.06'/%3E%3C/svg%3E");
          pointer-events: none;
        }
      `}} />

      {/* --- RESPONSIVE HEADER --- */}
      <header className="w-full shrink-0 min-h-[64px] bg-[#0A0D14]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 xl:py-0 flex flex-col xl:flex-row items-center justify-between shadow-2xl z-40 gap-4 xl:gap-0">
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-english font-medium w-full xl:w-auto">
          <div className="flex items-center gap-2 text-slate-200 font-orbitron">
            <Clock className="w-4 h-4 text-slate-500" />
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </div>
          <div className="hidden xl:block w-px h-5 bg-white/10" />
          <button onClick={handleSimulateAI} className={`text-[10px] font-bold px-5 py-2 rounded-md transition-all duration-300 border backdrop-blur-md ${sysState === 'ESCALATED' ? 'bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'}`}>
            {sysState === 'ESCALATED' ? 'RESOLVE INCIDENT' : 'SIMULATE AI ESCALATION'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-full xl:w-auto order-first xl:order-none pb-3 xl:pb-0 border-b border-white/5 xl:border-0">
          <div className="text-[16px] sm:text-[18px] font-orbitron font-bold text-white tracking-[0.25em] flex items-center gap-2 drop-shadow-lg">
            <Server className="w-5 h-5 text-emerald-500" /> AFAQ-AI-SOC
          </div>
          <div className="text-[9px] font-english text-emerald-500/80 tracking-widest uppercase mt-0.5">{SESSION.node}</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-english font-medium w-full xl:w-auto">
          <div className="hidden sm:flex items-center gap-2 text-emerald-400/90">
            <ShieldCheck className="w-4 h-4" /> SECURE LINK
          </div>
          <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-md backdrop-blur-md">
            <span className="text-slate-400 text-[9px] tracking-widest">INCIDENTS</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sysState === 'ESCALATED' ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10 text-slate-300'}`}>
              {sysState === 'ESCALATED' ? '01' : '00'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 xl:border-l border-white/10 xl:pl-5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-bold text-white">{SESSION.user}</span>
              <span className="text-[9px] text-blue-400/80">{SESSION.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- TRULY RESPONSIVE MAIN WORKSPACE --- */}
      {/* On desktop: 3 columns. On mobile: stacked single column */}
      <main className="flex-1 flex flex-col xl:flex-row gap-4 p-3 sm:p-4 overflow-x-hidden overflow-y-auto xl:overflow-hidden relative z-10">
        
        {/* === LEFT PANEL: AI INTELLIGENCE === */}
        <aside className="w-full xl:w-[300px] 2xl:w-[340px] shrink-0 flex flex-col gap-4 h-auto xl:h-full order-2 xl:order-1">
          
          <Panel title="Threat Intelligence" action={<Activity className="w-4 h-4 text-emerald-500" />}>
            <div className="flex items-center gap-6 h-full p-2">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0 drop-shadow-2xl">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="42" stroke={sysState === 'ESCALATED' ? '#EF4444' : '#10B981'} strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={sysState === 'ESCALATED' ? '42' : '220'} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[18px] font-orbitron font-bold text-white drop-shadow-md">{sysState === 'ESCALATED' ? '84%' : '08%'}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4 w-full h-full">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                   <span className="text-[10px] font-english text-slate-500 tracking-widest">TREND</span>
                   <span className={`text-[12px] font-english font-bold ${sysState === 'ESCALATED' ? 'text-red-400' : 'text-emerald-400'}`}>{sysState === 'ESCALATED' ? 'SURGING ↗' : 'STABLE →'}</span>
                </div>
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-english text-slate-500 tracking-widest">LEVEL</span>
                   <span className={`text-[12px] font-english font-bold ${sysState === 'ESCALATED' ? 'text-red-400' : 'text-emerald-400'}`}>{sysState === 'ESCALATED' ? 'CRITICAL' : 'LOW'}</span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Active Recommendations" className="xl:flex-1 min-h-[160px]">
            {sysState === "ESCALATED" ? (
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg shadow-lg">
                  <div className="flex items-start gap-3.5">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    <div className="flex flex-col gap-2">
                      <span className="text-[12px] font-english font-bold text-white">HIGH DENSITY CROWD ANOMALY</span>
                      <span className="text-[11px] font-arabic text-slate-300">98.4% دقة الذكاء الاصطناعي - CAM-08</span>
                      <span className="text-[11px] font-arabic text-blue-400/90 cursor-pointer hover:text-blue-300 hover:underline transition-colors mt-1">يوصى بتوجيه دوريات المرور وتفعيل خطة الانتشار فوراً.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[12px] text-slate-500 text-center py-6 font-english flex items-center justify-center h-full">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500/50"/> All vectors secure.</span>
              </div>
            )}
          </Panel>

          <Panel title="System Telemetry" className="hidden xl:flex xl:flex-none">
             <div className="space-y-5 pt-2">
                <div>
                  <div className="flex justify-between text-[10px] font-english text-slate-400 mb-2 tracking-widest"><span>GPU ACCELERATION</span><span className="text-white font-orbitron">48%</span></div>
                  <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5"><div className="bg-blue-500 h-full w-[48%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-english text-slate-400 mb-2 tracking-widest"><span>CPU OVERHEAD</span><span className="text-white font-orbitron">36%</span></div>
                  <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-white/5"><div className="bg-emerald-500 h-full w-[36%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" /></div>
                </div>
             </div>
          </Panel>
        </aside>

        {/* === CENTER WORKSPACE: TACTICAL GRID OR FULLSCREEN === */}
        {/* On mobile, this scales naturally. On Desktop, it fills the exact remaining height smoothly */}
        <section className="flex-1 w-full flex flex-col min-h-[65vh] xl:min-h-0 order-1 xl:order-2 relative z-20">
           
           {/* FULLSCREEN FIXED OVERLAY (When a camera is maximized) */}
           <AnimatePresence>
             {focusedCamIds.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 exit={{ opacity: 0, scale: 0.95 }} 
                 transition={{ duration: 0.3, ease: "easeOut" }}
                 className="fixed inset-0 z-[100] w-screen h-screen bg-[#020305] flex flex-col overflow-hidden"
               >
                  {/* Expanded Camera View */}
                  <div className="flex-1 w-full h-full relative bg-black flex flex-col">
                    {focusedCamIds.map(camId => {
                      const cam = ALL_CAMERAS.find(c => c.id === camId);
                      const isThreat = sysState === "ESCALATED" && camId === "CAM-08";

                      return (
                        <div key={`full-${camId}`} className="relative w-full h-full flex flex-col">
                           {/* Massive Cinematic Header */}
                           <div className="absolute top-0 inset-x-0 h-[64px] bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between px-6 z-40 pointer-events-none">
                              <div className="flex items-center gap-4 w-1/2">
                                <span className="text-[10px] md:text-[12px] font-bold text-white bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-md shrink-0 tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">LIVE</span>
                                <span className="text-[16px] md:text-[20px] font-bold text-white truncate drop-shadow-xl">{cam?.name}</span>
                              </div>
                              
                              <div className="flex items-center justify-end gap-4 shrink-0 pointer-events-auto w-1/2">
                                {isThreat && <span className="text-[12px] text-white font-bold bg-red-600 px-4 py-1 rounded-md animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)] tracking-widest hidden sm:block">REC</span>}
                                <span className="text-[12px] text-slate-200 font-english bg-black/60 backdrop-blur-md px-3 py-1 rounded-md tracking-widest hidden md:block border border-white/10">{cam?.ai}</span>
                                <span className="text-[12px] font-orbitron text-emerald-400 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 hidden sm:block">{cam?.fps} FPS</span>
                                
                                {/* Audio Toggle */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setIsAudioMuted(!isAudioMuted); }} 
                                  className={`p-2.5 rounded-md transition-all backdrop-blur-md border ${isAudioMuted ? 'bg-black/60 text-slate-300 hover:bg-white/10 border-white/10' : 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.4)]'}`}
                                >
                                  {isAudioMuted ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
                                </button>
                                
                                {/* Collapse / Exit Fullscreen Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleCameraClick(camId); }} 
                                  className="text-white hover:text-red-400 bg-black/60 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 p-2.5 rounded-md transition-all backdrop-blur-md shadow-lg flex items-center gap-2"
                                >
                                  <Minimize className="w-5 h-5"/>
                                  <span className="hidden md:block text-[11px] font-english font-bold tracking-widest pr-1">COLLAPSE</span>
                                </button>
                              </div>
                           </div>

                           <div className="flex-1 relative w-full h-full bg-[#020305]">
                             <MediaRenderer cam={cam} isExpanded={true} isMuted={isAudioMuted} />
                             
                             <div className="scanlines absolute inset-0 z-10" />
                             <div className="noise absolute inset-0 z-10" />
                             <div className="vignette absolute inset-0 z-10" />
                             
                             {/* Tactical HUD Overlay for Fullscreen */}
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-10">
                               <div className="w-full h-[2px] bg-emerald-500/50" />
                               <div className="h-full w-[2px] bg-emerald-500/50 absolute" />
                               <div className="w-[30vw] h-[30vw] border-[2px] border-emerald-500/50 rounded-full absolute" />
                               <div className="w-[40vw] h-[40vw] border border-emerald-500/30 rounded-full absolute border-dashed" />
                             </div>
                             
                             {/* AI Escalation Threat Box */}
                             {isThreat && (
                               <div className="absolute inset-0 pointer-events-none z-20">
                                 <div className="absolute top-24 right-8 bg-black/80 backdrop-blur-xl border border-red-500/50 p-5 rounded-lg shadow-[0_0_40px_rgba(239,68,68,0.3)] hidden sm:block">
                                    <div className="text-[16px] font-english font-bold text-red-500 mb-2 flex items-center gap-3"><Flame className="w-5 h-5"/> SEVERE CROWD DENSITY DETECTED</div>
                                    <div className="text-[12px] font-orbitron text-white tracking-[0.2em]">98.4% AI CONFIDENCE • LOCK ENGAGED</div>
                                 </div>
                                 <motion.div animate={{ scale: [1, 1.01, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute top-1/4 left-1/4 w-[50%] h-[50%] border-[3px] border-red-500/80 bg-red-500/10 rounded-md">
                                   <div className="absolute -bottom-8 right-0 text-[11px] font-english font-bold bg-red-600 text-white px-3 py-1 tracking-widest rounded-sm shadow-lg">TARGET IDENTIFIED</div>
                                   {/* Corner Brackets */}
                                   <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-red-500" />
                                   <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-red-500" />
                                   <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-red-500" />
                                   <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-red-500" />
                                 </motion.div>
                               </div>
                             )}
                           </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Horizontal Interactive Dock (Bottom of Fullscreen) */}
                  <div className="h-[140px] xl:h-[180px] w-full shrink-0 flex gap-3 p-3 bg-[#0A0D14]/90 backdrop-blur-xl border-t border-white/10 overflow-x-auto scrollbar-hide snap-x z-40 relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    {ALL_CAMERAS.filter(c => !focusedCamIds.includes(c.id)).map(cam => (
                      <div key={`thumb-${cam.id}`} onClick={() => handleCameraClick(cam.id)} className="min-w-[200px] xl:min-w-[280px] shrink-0 bg-black border border-white/10 rounded-lg flex flex-col overflow-hidden cursor-pointer hover:border-blue-500/60 transition-all relative group snap-start shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        
                        <div className="absolute top-0 inset-x-0 h-[32px] bg-gradient-to-b from-black/90 to-transparent flex items-start px-3 pt-2 z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                           <span className="text-[10px] font-bold text-white truncate whitespace-nowrap drop-shadow-md">{cam.name}</span>
                        </div>

                        <div className="flex-1 relative w-full h-full bg-[#020305]">
                          <MediaRenderer cam={cam} isExpanded={false} isMuted={true} />
                          <div className="vignette absolute inset-0 z-10" />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* --- REGULAR TACTICAL GRID (Visible when no camera is expanded) --- */}
           {!focusedCamIds.length && (
              <div className="flex-1 w-full h-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2 gap-3 sm:gap-4 p-1">
                  {ALL_CAMERAS.map((cam) => {
                    const isThreat = sysState === "ESCALATED" && cam.id === "CAM-08";
                    return (
                      <motion.div 
                        layoutId={`cam-${cam.id}`} 
                        key={`grid-${cam.id}`} 
                        onClick={() => handleCameraClick(cam.id)} 
                        className={`relative flex flex-col min-h-[250px] sm:min-h-[300px] xl:min-h-0 w-full h-full bg-[#020305] border-[2px] ${isThreat ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.25)]' : 'border-[#1C2230]'} rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all group`}
                      >
                        {/* Camera Header Overlay */}
                        <div className="absolute top-0 inset-x-0 h-[38px] bg-gradient-to-b from-black/90 to-black/0 flex items-center justify-between px-3 z-30 pointer-events-none">
                            <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                               <span className="text-[8px] font-bold text-white bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded shadow-sm shrink-0 tracking-widest">LIVE</span>
                               <span className="text-[11px] font-bold text-white truncate whitespace-nowrap drop-shadow-md">{cam.name}</span>
                            </div>
                            <div className="flex items-center justify-end gap-2 shrink-0 pointer-events-auto opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                               <span className="text-[9px] text-slate-300 font-english bg-black/50 backdrop-blur-md px-2 py-1 rounded-md truncate hidden sm:block border border-white/5">{cam.ai}</span>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleCameraClick(cam.id); }} 
                                 className="text-white bg-black/50 hover:bg-blue-500/30 border border-white/5 hover:border-blue-500/50 hover:text-blue-300 p-1.5 rounded-md transition-all backdrop-blur-md shadow-lg"
                               >
                                 <Maximize className="w-4 h-4"/>
                               </button>
                            </div>
                        </div>
                        
                        {/* Video Layer */}
                        <div className="flex-1 relative w-full h-full bg-[#020305]">
                            <MediaRenderer cam={cam} isExpanded={false} isMuted={true} />
                            
                            <div className="scanlines absolute inset-0 z-10" />
                            <div className="noise absolute inset-0 z-10" />
                            <div className="vignette absolute inset-0 z-10" />

                            {/* Escalation Overlay in Grid View */}
                            {isThreat && (
                               <div className="absolute inset-0 pointer-events-none z-20">
                                 <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-1/4 left-1/4 w-[50%] h-[50%] border-[2px] border-red-500/80 bg-red-500/10 rounded-sm">
                                   <div className="absolute -bottom-6 right-0 text-[8px] font-english font-bold bg-red-600 text-white px-2 py-0.5 tracking-widest rounded-sm">TARGET ACQUIRED</div>
                                 </motion.div>
                               </div>
                            )}
                        </div>
                      </motion.div>
                    )
                  })}
              </div>
           )}
        </section>

        {/* === RIGHT PANEL: MAP & TIMELINE === */}
        <aside className="w-full xl:w-[300px] 2xl:w-[340px] shrink-0 flex flex-col gap-4 h-auto xl:h-full order-3 relative z-10">
          
          <Panel title="Tactical Operations Map" action={<span className="text-[9px] text-emerald-400 flex items-center gap-1.5 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> SECURE</span>} className="hidden xl:flex xl:flex-none">
            <div className="w-full aspect-[4/3] bg-[#05070A] border border-white/5 rounded-lg relative overflow-hidden flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
              <MapIcon className="w-16 h-16 text-slate-700/40 absolute" />
              
              <div className="absolute top-[25%] left-[25%] flex items-center gap-1 text-[9px] font-english text-slate-400 drop-shadow-md"><Monitor className="w-3 h-3 text-blue-500"/> CAM-01</div>
              <div className="absolute bottom-[25%] right-[25%] flex items-center gap-1 text-[9px] font-english text-slate-400 drop-shadow-md"><Monitor className="w-3 h-3 text-blue-500"/> CAM-06</div>
              
              {sysState === "ESCALATED" && (
                <div className="absolute top-[45%] right-[45%]">
                   <div className="absolute w-6 h-6 bg-red-500 rounded-full animate-ping opacity-40" />
                   <div className="w-3 h-3 bg-red-500 rounded-full relative border-2 border-[#05070A]" />
                   <div className="absolute -top-5 left-5 text-[9px] font-english font-bold text-red-400 flex items-center gap-1 drop-shadow-md whitespace-nowrap"><Target className="w-3 h-3"/> CAM-08</div>
                </div>
              )}
            </div>
          </Panel>

          <Panel title="Incident Escalations" className="min-h-[160px] xl:min-h-0 xl:flex-none" action={<span className="text-[11px] font-orbitron font-bold text-slate-400">{sysState === 'ESCALATED' ? '1' : '0'}</span>}>
            {sysState === "ESCALATED" ? (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500 p-3 rounded-r-md shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-english font-bold text-red-400 flex items-center gap-2 tracking-widest">DENSITY ANOMALY</span>
                    <span className="text-[9px] font-english font-bold text-white bg-red-600 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(239,68,68,0.6)] tracking-widest">CRITICAL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-300 font-arabic truncate pr-4">CAM-08 • التحليل التكتيكي للحشود</span>
                    <span className="text-[10px] text-slate-500 font-orbitron shrink-0">{currentTime.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[12px] text-slate-500 text-center py-6 font-english h-full flex items-center justify-center">All feeds nominal.</div>
            )}
          </Panel>

          <Panel title="AI Recording Ledger" className="flex-1 min-h-[250px] xl:min-h-0" action={<div className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer hover:text-white transition-colors tracking-widest">TODAY</div>}>
             <div className="flex-1 overflow-y-auto space-y-5 relative pl-4 before:absolute before:inset-y-0 before:left-1 before:w-px before:bg-white/10 pt-2 pb-4">
                
                {incidents.map((inc) => (
                  <div key={inc.id} className="relative pl-4 opacity-90 hover:opacity-100 transition-opacity">
                    <div className={`absolute left-[-20px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#0A0D14] ${inc.status === 'RECORDING' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[10px] font-orbitron text-slate-400 tracking-wider">{inc.time}</span>
                      <span className={`text-[9px] font-orbitron font-bold flex items-center gap-1.5 tracking-widest ${inc.status === 'RECORDING' ? 'text-red-400 bg-red-500/10 px-1.5 rounded' : 'text-slate-500'}`}>
                        {inc.status === 'RECORDING' ? <div className="w-1.5 h-1.5 bg-red-500 rounded-full"/> : <PlayCircle className="w-3.5 h-3.5"/>}
                        {inc.status === 'RECORDING' ? 'REC' : inc.duration}
                      </span>
                    </div>
                    <div className="text-[11px] font-english text-slate-200 font-medium leading-relaxed">{inc.cam} • {inc.type}</div>
                  </div>
                ))}

                <div className="relative pl-4 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="absolute left-[-20px] top-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-[#0A0D14]" />
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[10px] font-orbitron text-slate-400 tracking-wider">06:21:33 AM</span>
                    <span className="text-[9px] font-orbitron text-slate-500 flex items-center gap-1.5 tracking-widest"><PlayCircle className="w-3.5 h-3.5"/> 00:02:45</span>
                  </div>
                  <div className="text-[11px] font-english text-slate-400 font-medium">CAM-01 • Crowd Flow Analysis</div>
                </div>

             </div>
          </Panel>

        </aside>
      </main>
    </div>
  );
}