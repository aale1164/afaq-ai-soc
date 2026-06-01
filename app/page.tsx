"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Map as MapIcon, Radio, Cpu, Activity, Users, 
  Server, User, Clock, Flame, Target, AlertTriangle, PlayCircle,
  Maximize, Minimize, Monitor, CheckCircle2, VolumeX, Volume2
} from "lucide-react";

// ==========================================
// 1. ENTERPRISE SAAS PREPARATION (MOCKS)
// ==========================================
const SESSION = {
  user: "AALE AL-RASHIDI",
  role: "Security Operator",
  node: "BURAYDAH-NODE-ALPHA",
  status: "SECURE"
};

// ==========================================
// 2. LIVE CAMERA ECOSYSTEM (Verified Global Map)
// ==========================================
const ALL_CAMERAS = [
  // TOP ROW: Verified Public Live Streams
  { id: "CAM-01", name: "محيط الحرم المكي", ai: "Public Live Feed", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/GavTnwpVcNw?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", filter: "contrast(1.05)" },
  { id: "CAM-02", name: "محيط الحرم المدني", ai: "Public Live Feed", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/gRYuU5KB-6Y?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", filter: "contrast(1.05)" },
  { id: "CAM-03", name: "تقاطع شيبويا الذكي", ai: "Traffic AI Monitoring", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/dfVK7ld38Ys?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", filter: "contrast(1.1) brightness(0.9)" },
  { id: "CAM-04", name: "البث الإخباري - العربية", ai: "News Monitoring", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/n7eQejkXbnM?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", filter: "contrast(1.05)" },
  
  // BOTTOM ROW: Mixed Streams & Dedicated Native AI Feed
  { id: "CAM-05", name: "البث الإخباري - تلفزيون سوريا", ai: "Regional Monitoring", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/ZN0aK3V0ds0?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", filter: "contrast(1.05)" },
  { id: "CAM-06", name: "البث الإخباري - قطر", ai: "Strategic Monitoring", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/d020NL_oFAY?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", filter: "contrast(1.1)" },
  { id: "CAM-07", name: "قناة الوثائقية", ai: "Intelligence Feed", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/TiPYdMXt_XI?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", filter: "contrast(1.05)" },
  
  // CAM-08: NATIVE AI ESCALATION TARGET
  { id: "CAM-08", name: "التحليل التكتيكي للحشود والمركبات", ai: "Crowd / Traffic AI", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/HpdO5Kq3o7Y?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", filter: "contrast(1.1)" }
];

// ==========================================
// 3. BULLETPROOF MEDIA RENDERER
// ==========================================
const MediaRenderer = ({ cam, isExpanded, isMuted }: { cam: any, isExpanded: boolean, isMuted: boolean }) => {
  const [hasError, setHasError] = useState(false);
  const effectivelyMuted = !isExpanded || isMuted;

  if (cam.type !== "youtube" || hasError) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden z-[1]">
        <video 
          src={cam.fallbackUrl || cam.url} 
          autoPlay loop muted={effectivelyMuted} playsInline 
          style={{ filter: cam.filter }} 
          className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none bg-black" 
        />
      </div>
    );
  }

  const baseUrl = cam.url.replace(/&mute=[01]/g, "");
  const finalUrl = `${baseUrl}&mute=${effectivelyMuted ? "1" : "0"}`;

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden z-[1]">
      <div className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90 bg-black">
        <iframe 
          src={finalUrl} 
          onError={() => setHasError(true)}
          allow="autoplay; encrypted-media" 
          className="w-full h-full border-none pointer-events-none bg-black"
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

  // --- Tactical Escalation Engine (Re-routed to CAM-08 Traffic Analytics) ---
  const handleSimulateAI = () => {
    if (sysState === "NORMAL") {
      setSysState("ESCALATED");
      setFocusedCamIds(["CAM-08"]); // Auto-maximize the High-Density AI Surveillance Loop
      setIsAudioMuted(true); 
      
      const newIncidents = [
        { id: "INC-994", cam: "CAM-08", type: "HIGH DENSITY CROWD ANOMALY", time: new Date().toLocaleTimeString(), duration: "00:00:01", status: "RECORDING", severity: "CRITICAL" }
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
    if (sysState === "ESCALATED") return; // Lock focus during active AI escalation
    setFocusedCamIds(focusedCamIds.includes(id) ? [] : [id]);
    setIsAudioMuted(true); 
  };

  const Panel = ({ title, action = null, children, className = "" }: any) => (
    <div className={`bg-[#0C1017] border border-[#1C2230] rounded flex flex-col min-h-0 shadow-sm relative overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1C2230] bg-[#0F131C] shrink-0 z-10">
        <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-english">{title}</h3>
        {action}
      </div>
      <div className="flex-1 overflow-y-auto p-2.5 gap-2.5 flex flex-col scrollbar-hide z-0 relative">
        {children}
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="h-screen w-full bg-[#05070A] text-slate-300 flex flex-col overflow-hidden select-none font-arabic">
      
      {/* Global Realism Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Orbitron:wght@500;700&display=swap');
        .font-arabic { font-family: 'IBM Plex Sans Arabic', sans-serif; }
        .font-english { font-family: 'Inter', sans-serif; }
        .font-orbitron { font-family: 'Orbitron', sans-serif; letter-spacing: 0.5px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15));
          background-size: 100% 4px;
          pointer-events: none;
        }
        .vignette {
          box-shadow: inset 0 0 60px rgba(0,0,0,0.9);
          pointer-events: none;
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
          pointer-events: none;
        }
      `}} />

      {/* --- TOPBAR --- */}
      <header className="h-[48px] bg-[#0C1017] border-b border-[#1C2230] px-4 flex items-center justify-between shrink-0 shadow-md z-30">
        <div className="flex items-center gap-4 text-[10px] font-english font-medium">
          <div className="flex items-center gap-1.5 text-slate-200 font-orbitron w-[85px]">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </div>
          <div className="w-px h-4 bg-[#1C2230]" />
          <button onClick={handleSimulateAI} className={`text-[9px] font-bold px-3 py-1.5 rounded transition-all duration-300 border ${sysState === 'ESCALATED' ? 'bg-red-500/10 text-red-400 border-red-500/30 ring-1 ring-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-[#121722] text-slate-300 border-[#1C2230] hover:bg-[#1C2230] hover:text-white'}`}>
            {sysState === 'ESCALATED' ? 'RESOLVE THREATS' : 'SIMULATE ESCALATION'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-[14px] font-orbitron font-bold text-white tracking-widest flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-500" /> AFAQ-AI-SOC-01
          </div>
          <div className="text-[8px] font-english text-emerald-500 tracking-widest uppercase">{SESSION.node}</div>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-english font-medium">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE SESSION
          </div>
          <div className="flex items-center gap-2 bg-[#121722] border border-[#1C2230] px-2 py-1 rounded">
            <span className="text-slate-400">ACTIVE INCIDENTS</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sysState === 'ESCALATED' ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'}`}>
              {sysState === 'ESCALATED' ? '01' : '00'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 border-l border-[#1C2230] pl-4">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <div className="flex flex-col leading-none">
              <span>{SESSION.user}</span>
              <span className="text-[8px] text-blue-400">{SESSION.role}</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex gap-2.5 p-2.5 overflow-hidden min-h-0 bg-[#020305]">
        
        {/* --- LEFT PANEL: AI INTELLIGENCE --- */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-2.5 min-h-0">
          <Panel title="AI Threat Score" action={<Activity className="w-3.5 h-3.5 text-emerald-500" />}>
            <div className="flex items-center gap-4 p-2">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="#1C2230" strokeWidth="6" fill="none" />
                  <circle cx="32" cy="32" r="28" stroke={sysState === 'ESCALATED' ? '#EF4444' : '#10B981'} strokeWidth="6" fill="none" strokeDasharray="175" strokeDashoffset={sysState === 'ESCALATED' ? '40' : '150'} className="transition-all duration-1000" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[14px] font-orbitron font-bold text-white">{sysState === 'ESCALATED' ? '84%' : '08%'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between text-[9px] font-english">
                   <span className="text-slate-500">TREND</span>
                   <span className={`font-bold ${sysState === 'ESCALATED' ? 'text-red-400' : 'text-emerald-400'}`}>{sysState === 'ESCALATED' ? 'INCREASING ↗' : 'STABLE →'}</span>
                </div>
                <div className="flex justify-between text-[9px] font-english">
                   <span className="text-slate-500">THREAT LEVEL</span>
                   <span className={`font-bold ${sysState === 'ESCALATED' ? 'text-red-400' : 'text-emerald-400'}`}>{sysState === 'ESCALATED' ? 'HIGH' : 'LOW'}</span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="AI Recommendations" className="flex-1">
            {sysState === "ESCALATED" ? (
              <div className="space-y-2">
                <div className="bg-[#121722] border border-[#1C2230] p-2.5 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-english font-bold text-slate-200">HIGH DENSITY CROWD ANOMALY</span>
                      <span className="text-[9px] font-arabic text-slate-400">98% دقة - CAM-08</span>
                      <span className="text-[9px] font-arabic text-blue-400 cursor-pointer hover:underline">يوصى بتوجيه دوريات المرور وتفعيل خطة الانتشار</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-slate-500 text-center py-4 font-english flex items-center justify-center h-full">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500"/> No critical recommendations.</span>
              </div>
            )}
          </Panel>

          <Panel title="System Health" action={<span className="text-[8px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">OPTIMAL</span>}>
             <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-[9px] font-english text-slate-400 mb-1"><span>GPU USAGE</span><span className="text-white font-orbitron">48%</span></div>
                  <div className="w-full bg-[#121722] h-1.5 rounded"><div className="bg-blue-500 h-full w-[48%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-english text-slate-400 mb-1"><span>CPU USAGE</span><span className="text-white font-orbitron">36%</span></div>
                  <div className="w-full bg-[#121722] h-1.5 rounded"><div className="bg-emerald-500 h-full w-[36%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] font-english text-slate-400 mb-1"><span>STORAGE</span><span className="text-white font-orbitron">82%</span></div>
                  <div className="w-full bg-[#121722] h-1.5 rounded"><div className="bg-red-400 h-full w-[82%]" /></div>
                </div>
             </div>
          </Panel>
        </aside>

        {/* --- CENTER WORKSPACE: TACTICAL CAMERA GRID --- */}
        <section className="flex-1 flex flex-col min-w-0 bg-[#0A0D14] border border-[#1C2230] rounded p-1.5 shadow-inner relative overflow-hidden">
           
           <div className="absolute inset-0 pointer-events-none opacity-[0.15] z-0">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
           </div>

           <div className={`flex-1 z-10 min-h-0 ${focusedCamIds.length === 0 ? 'grid grid-cols-4 grid-rows-2 gap-1.5' : 'flex flex-col gap-1.5'}`}>
              
              {/* --- ESCALATED / FOCUS VIEW --- */}
              {focusedCamIds.length > 0 && (
                <>
                  {/* Primary Focus Area */}
                  <div className={`flex-1 grid gap-1.5 grid-cols-1 min-h-0`}>
                    {focusedCamIds.map(camId => {
                      const cam = ALL_CAMERAS.find(c => c.id === camId);
                      const isThreat = sysState === "ESCALATED" && camId === "CAM-08";

                      return (
                        <motion.div layoutId={`cam-${camId}`} key={`main-${camId}`} className={`relative bg-black border-[2px] ${isThreat ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)]' : 'border-[#1C2230]'} rounded overflow-hidden flex flex-col`}>
                           
                           {/* DEDICATED OVERLAY HEADER (Expanded) */}
                           <div className="absolute top-0 inset-x-0 h-[28px] bg-black/50 backdrop-blur flex items-center justify-between px-2 z-30 pointer-events-none border-b border-white/5">
                              <div className="flex items-center gap-2 overflow-hidden w-1/2">
                                <span className="text-[8px] font-bold text-white bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.5 rounded shrink-0">LIVE</span>
                                <span className="text-[10px] font-bold text-white truncate whitespace-nowrap drop-shadow-md">{cam?.name}</span>
                              </div>
                              <div className="flex items-center justify-end gap-2 shrink-0 pointer-events-auto w-1/2">
                                {isThreat && <span className="text-[9px] text-red-500 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 animate-pulse">REC</span>}
                                <span className="text-[9px] text-slate-300 font-english bg-black/40 px-1.5 py-0.5 rounded truncate max-w-[80px] hidden sm:block">{cam?.ai}</span>
                                <span className="text-[9px] font-orbitron text-slate-400 bg-black/40 px-1.5 py-0.5 rounded">{cam?.fps} FPS</span>
                                
                                {/* Audio Toggle Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setIsAudioMuted(!isAudioMuted); }} 
                                  className={`p-1 rounded transition-all hover:bg-blue-500/20 hover:shadow-[0_0_8px_rgba(96,165,250,0.4)] ${isAudioMuted ? 'text-slate-400' : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'}`}
                                >
                                  {isAudioMuted ? <VolumeX className="w-3.5 h-3.5"/> : <Volume2 className="w-3.5 h-3.5"/>}
                                </button>
                                
                                {/* Minimize Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleCameraClick(camId); }} 
                                  className="text-slate-300 hover:text-blue-400 hover:bg-blue-500/20 p-1 rounded transition-all hover:shadow-[0_0_8px_rgba(96,165,250,0.4)]"
                                >
                                  <Minimize className="w-3.5 h-3.5"/>
                                </button>
                              </div>
                           </div>

                           <div className="flex-1 relative bg-black">
                             <MediaRenderer cam={cam} isExpanded={true} isMuted={isAudioMuted} />
                             
                             {/* Cinematic Effects (Z-10) */}
                             <div className="scanlines absolute inset-0 z-10" />
                             <div className="noise absolute inset-0 z-10" />
                             <div className="vignette absolute inset-0 z-10" />
                             
                             {/* Passive HUD Crosshair */}
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-[0.05]">
                               <div className="w-full h-[1px] bg-white" />
                               <div className="h-full w-[1px] bg-white absolute" />
                               <div className="w-32 h-32 border border-white rounded-full absolute" />
                             </div>
                             
                             {/* Active Threat Overlays (Z-20) */}
                             {isThreat && (
                               <div className="absolute inset-0 pointer-events-none z-20">
                                 <div className="absolute top-10 right-4 bg-[#0A0D14]/90 backdrop-blur border border-[#1C2230] p-2 rounded shadow-lg">
                                    <div className="text-[12px] font-english font-bold text-red-500 mb-0.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> DENSITY ANOMALY</div>
                                    <div className="text-[9px] font-orbitron text-slate-300">98.4% AI CONFIDENCE</div>
                                 </div>
                                 <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-1/4 left-1/4 w-[50%] h-[50%] border-[2px] border-red-500/80 bg-red-500/10">
                                   <div className="absolute -bottom-5 right-0 text-[9px] font-english font-bold bg-red-500 text-black px-1.5 py-0.5">MULTI-TARGET TRACKING</div>
                                 </motion.div>
                               </div>
                             )}
                           </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Secondary Horizontal Dock */}
                  <div className="h-[140px] shrink-0 flex gap-1.5 overflow-x-auto scrollbar-hide">
                    {ALL_CAMERAS.filter(c => !focusedCamIds.includes(c.id)).map(cam => (
                      <div key={`thumb-${cam.id}`} onClick={() => handleCameraClick(cam.id)} className="w-[200px] shrink-0 bg-black border border-[#1C2230] rounded flex flex-col overflow-hidden cursor-pointer hover:border-blue-500/50 transition-colors relative group">
                        
                        {/* Mini Header Overlay */}
                        <div className="absolute top-0 inset-x-0 h-[24px] bg-black/50 backdrop-blur flex items-center px-2 z-20 pointer-events-none border-b border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                           <span className="text-[8px] font-bold text-white truncate whitespace-nowrap drop-shadow-md">{cam.name}</span>
                        </div>

                        <div className="flex-1 relative">
                          <MediaRenderer cam={cam} isExpanded={false} isMuted={true} />
                          <div className="vignette absolute inset-0 z-10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* --- NORMAL VIEW (4x2 Grid) --- */}
              {focusedCamIds.length === 0 && (
                <AnimatePresence>
                  {ALL_CAMERAS.map((cam) => {
                    const isThreat = sysState === "ESCALATED" && cam.id === "CAM-08";
                    return (
                      <motion.div 
                        layoutId={`cam-${cam.id}`} 
                        key={`grid-${cam.id}`} 
                        onClick={() => handleCameraClick(cam.id)} 
                        className={`relative flex flex-col bg-black border-[2px] ${isThreat ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-[#1C2230]'} rounded overflow-hidden cursor-pointer hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(96,165,250,0.1)] transition-all group`}
                      >
                        {/* DEDICATED OVERLAY HEADER (Grid) */}
                        <div className="absolute top-0 inset-x-0 h-[28px] bg-black/50 backdrop-blur flex items-center justify-between px-2 z-30 pointer-events-none border-b border-white/5">
                            <div className="flex items-center gap-2 overflow-hidden w-2/3">
                               <span className="text-[7px] font-bold text-white bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.5 rounded shrink-0">LIVE</span>
                               <span className="text-[9px] font-bold text-white truncate whitespace-nowrap drop-shadow-md">{cam.name}</span>
                            </div>
                            <div className="flex items-center justify-end gap-1.5 shrink-0 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity w-1/3">
                               <span className="text-[7px] text-slate-300 font-english bg-black/40 px-1 py-0.5 rounded truncate max-w-[60px] hidden sm:block">{cam.ai}</span>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleCameraClick(cam.id); }} 
                                 className="text-slate-300 hover:text-blue-400 hover:bg-blue-500/20 p-1 rounded transition-all hover:shadow-[0_0_8px_rgba(96,165,250,0.4)]"
                               >
                                 <Maximize className="w-3.5 h-3.5"/>
                               </button>
                            </div>
                        </div>
                        
                        {/* Video Render */}
                        <div className="flex-1 relative bg-black">
                            <MediaRenderer cam={cam} isExpanded={false} isMuted={true} />
                            
                            {/* Cinematic Effects */}
                            <div className="scanlines absolute inset-0 z-10" />
                            <div className="noise absolute inset-0 z-10" />
                            <div className="vignette absolute inset-0 z-10" />

                            {/* Threat Overlay for Grid View (if Escalated but not expanded yet) */}
                            {isThreat && (
                               <div className="absolute inset-0 pointer-events-none z-20">
                                 <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute top-1/4 left-1/4 w-[50%] h-[50%] border-[2px] border-red-500/80 bg-red-500/10">
                                   <div className="absolute -bottom-5 right-0 text-[7px] font-english font-bold bg-red-500 text-black px-1 py-0.5">MULTI-TARGET TRACKING</div>
                                 </motion.div>
                               </div>
                            )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}

           </div>
        </section>

        {/* --- RIGHT PANEL: MAP & TIMELINE --- */}
        <aside className="w-[260px] shrink-0 flex flex-col gap-2.5 min-h-0">
          
          <Panel title="Tactical Map" action={<span className="text-[8px] text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> LIVE</span>}>
            <div className="w-full aspect-[4/3] bg-[#0A0D14] border border-[#1C2230] rounded relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
              <MapIcon className="w-12 h-12 text-slate-700/50 absolute" />
              
              <div className="absolute top-[20%] left-[30%] flex items-center gap-1 text-[7px] font-english text-slate-400"><Monitor className="w-2 h-2 text-blue-500"/> CAM-01</div>
              <div className="absolute bottom-[20%] right-[30%] flex items-center gap-1 text-[7px] font-english text-slate-400"><Monitor className="w-2 h-2 text-blue-500"/> CAM-06</div>
              
              {sysState === "ESCALATED" && (
                <div className="absolute top-[40%] right-[40%]">
                   <div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping opacity-50" />
                   <div className="w-2 h-2 bg-red-500 rounded-full relative" />
                   <div className="absolute -top-3 left-3 text-[7px] font-english text-red-400 flex items-center gap-0.5"><Monitor className="w-2 h-2"/> CAM-08</div>
                </div>
              )}
            </div>
          </Panel>

          <Panel title="Live Incidents" action={<span className="text-[10px] font-orbitron font-bold text-slate-400">{sysState === 'ESCALATED' ? '1' : '0'}</span>}>
            {sysState === "ESCALATED" ? (
              <div className="space-y-2">
                <div className="bg-[#121722] border-l-2 border-red-500 p-2 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-english font-bold text-red-400 flex items-center gap-1.5">DENSITY ANOMALY</span>
                    <span className="text-[8px] font-english font-bold text-red-500 bg-red-500/10 px-1 rounded">CRITICAL</span>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[8px] text-slate-400 font-english">CAM-08 • التحليل التكتيكي للحشود والمركبات</span>
                    <span className="text-[8px] text-slate-500 font-orbitron">{currentTime.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-slate-500 text-center py-4 font-english h-full flex items-center justify-center">All systems secure.</div>
            )}
          </Panel>

          <Panel title="AI Recording Timeline" className="flex-1" action={<div className="flex items-center gap-1 text-[8px] text-slate-400 cursor-pointer hover:text-slate-200">TODAY</div>}>
             <div className="flex-1 overflow-y-auto space-y-3 relative pl-2 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-[#1C2230]">
                
                {incidents.map((inc) => (
                  <div key={inc.id} className="relative pl-3 opacity-90 hover:opacity-100 transition-opacity">
                    <div className={`absolute left-[-2.5px] top-1 w-1.5 h-1.5 rounded-full ring-2 ring-[#0C1017] ${inc.status === 'RECORDING' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-orbitron text-slate-400">{inc.time}</span>
                      <span className={`text-[7px] font-orbitron flex items-center gap-1 ${inc.status === 'RECORDING' ? 'text-red-500' : 'text-slate-500'}`}>
                        {inc.status === 'RECORDING' ? <div className="w-1 h-1 bg-red-500 rounded-full"/> : <PlayCircle className="w-2.5 h-2.5"/>}
                        {inc.status === 'RECORDING' ? 'REC' : inc.duration}
                      </span>
                    </div>
                    <div className="text-[9px] font-english text-slate-300 mt-0.5 font-medium">{inc.cam} • {inc.type}</div>
                  </div>
                ))}

                <div className="relative pl-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="absolute left-[-2.5px] top-1 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-[#0C1017]" />
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-orbitron text-slate-400">06:21:33 AM</span>
                    <span className="text-[7px] font-orbitron text-slate-500 flex items-center gap-1"><PlayCircle className="w-2.5 h-2.5"/> 00:02:45</span>
                  </div>
                  <div className="text-[9px] font-english text-slate-400 mt-0.5 font-medium">CAM-01 • Crowd Flow</div>
                </div>

             </div>
          </Panel>

        </aside>
      </main>
    </div>
  );
}