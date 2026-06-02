"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Map as MapIcon, Radio, Cpu, Activity, Users, 
  Server, User, Clock, Flame, Target, AlertTriangle, PlayCircle,
  Maximize, Minimize, Monitor, CheckCircle2, VolumeX, Volume2, Expand
} from "lucide-react";

// ==========================================
// 1. ENTERPRISE SAAS PREPARATION
// ==========================================
const SESSION = {
  user: "AALE AL-RASHIDI",
  role: "Senior Commander",
  node: "BURAYDAH-NODE-ALPHA",
  status: "SECURE"
};

// ==========================================
// 2. LIVE CAMERA ECOSYSTEM
// ==========================================
const ALL_CAMERAS = [
  // TOP ROW
  { id: "CAM-01", name: "TRT1 LIVE - Arabic Translation", ai: "Live Translation", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/6_AnQrbFvY8?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", filter: "contrast(1.05)" },
  { id: "CAM-02", name: "محيط الحرم المدني", ai: "Public Live Feed", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/naaOMgZbIHQ?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", filter: "contrast(1.05)" },
  { id: "CAM-03", name: "تقاطع شيبويا الذكي", ai: "Traffic AI Monitoring", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/dfVK7ld38Ys?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", filter: "contrast(1.1) brightness(0.9)" },
  { id: "CAM-04", name: "البث الإخباري - العربية", ai: "News Monitoring", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/n7eQejkXbnM?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", filter: "contrast(1.05)" },
  
  // BOTTOM ROW
  { id: "CAM-05", name: "البث الإخباري - تلفزيون سوريا", ai: "Regional Monitoring", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/ZN0aK3V0ds0?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", filter: "contrast(1.05)" },
  { id: "CAM-06", name: "البث الإخباري - قطر", ai: "Strategic Monitoring", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/d020NL_oFAY?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", filter: "contrast(1.1)" },
  { id: "CAM-07", name: "قناة الوثائقية", ai: "Intelligence Feed", fps: 30, type: "youtube", url: "https://www.youtube.com/embed/TiPYdMXt_XI?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", filter: "contrast(1.05)" },
  // تم تحديث CAM-08 واستبداله بالبث الجديد
  { id: "CAM-08", name: "ATV LIVE - Arabic Translation", ai: "Live Translation", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/82O6yOy_XwE?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", filter: "contrast(1.1)" }
];

// ==========================================
// 3. MEDIA RENDERER
// ==========================================
const MediaRenderer = ({ cam, isMuted }: { cam: any, isMuted: boolean }) => {
  const [hasError, setHasError] = useState(false);

  if (cam.type !== "youtube" || hasError) {
    return (
      <video 
        src={cam.fallbackUrl || cam.url} 
        autoPlay loop muted={isMuted} playsInline 
        style={{ filter: cam.filter }} 
        className="w-full h-full object-cover bg-black pointer-events-none" 
      />
    );
  }

  const baseUrl = cam.url.replace(/&mute=[01]/g, "");
  const finalUrl = `${baseUrl}&mute=${isMuted ? "1" : "0"}`;

  return (
    <iframe 
      src={finalUrl} 
      onError={() => setHasError(true)}
      allow="autoplay; encrypted-media" 
      className="w-full h-full border-none bg-black pointer-events-none"
      tabIndex={-1}
      style={{ filter: cam.filter }}
    />
  );
};

// ==========================================
// 4. MOCK AI TRANSLATION ENGINE (TR-AR)
// ==========================================
const TranslationEngine = ({ camId, isFullscreen }: { camId: string, isFullscreen: boolean }) => {
  const [transIdx, setTransIdx] = useState(0);

  // Ready to be replaced with OpenAI Whisper / Gemini API WebSocket streams
  const MOCK_DATA = [
    { tr: "Şu anda canlı yayındayız, son gelişmeleri aktarıyoruz.", ar: "نحن في بث مباشر الآن، ننقل لكم آخر التطورات." },
    { tr: "Bölgedeki güvenlik güçleri önlemlerini artırdı.", ar: "زادت قوات الأمن في المنطقة من إجراءاتها." },
    { tr: "Olay yerinden en net görüntüleri sizlerle paylaşıyoruz.", ar: "نشارك معكم أوضح الصور من مكان الحدث." },
    { tr: "Hükümet yetkililerinden kısa süre içinde bir açıklama bekleniyor.", ar: "من المنتظر صدور بيان من المسؤولين الحكوميين قريباً." },
    { tr: "Trafik akışı ve kalabalık kontrolü sağlanmış durumda.", ar: "تم تأمين تدفق حركة المرور والسيطرة على الحشود." }
  ];

  useEffect(() => {
    // Only activate for translation-enabled cameras
    if (camId !== "CAM-01" && camId !== "CAM-08") return;
    
    // Simulate real-time API streaming delay
    const interval = setInterval(() => {
      setTransIdx((prev) => (prev + 1) % MOCK_DATA.length);
    }, 4500);
    
    return () => clearInterval(interval);
  }, [camId]);

  if (camId !== "CAM-01" && camId !== "CAM-08") return null;

  const current = MOCK_DATA[transIdx];

  return (
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-8 pb-3 px-4 z-30 pointer-events-none flex flex-col justify-end">
       <div className="flex flex-col gap-1 border-r-2 border-blue-500 pr-3 text-right w-full">
          <div className="flex items-center gap-2 justify-end mb-0.5">
            <span className="flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
            <span className="text-[8px] sm:text-[9px] font-english text-blue-400 tracking-widest uppercase">AI LIVE TRANSCRIPT (TR-AR)</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-english text-slate-400 italic drop-shadow-md" dir="ltr">{current.tr}</span>
          <span className={`font-arabic font-bold text-white drop-shadow-lg transition-all duration-300 ${isFullscreen ? 'text-[18px] sm:text-[22px]' : 'text-[13px] sm:text-[15px]'}`}>{current.ar}</span>
       </div>
    </div>
  );
};

// ==========================================
// 5. SHARED UI COMPONENTS
// ==========================================
const Panel = ({ title, action = null, children, className = "" }: any) => (
  <div className={`bg-[#0C1017] border border-[#1C2230] rounded-xl flex flex-col shadow-2xl relative overflow-hidden ${className}`}>
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1C2230] bg-[#0F131C] shrink-0 z-10">
      <h3 className="text-[11px] lg:text-[12px] font-bold text-slate-200 uppercase tracking-widest font-english">{title}</h3>
      {action}
    </div>
    <div className="flex-1 overflow-y-auto p-4 gap-3 flex flex-col scrollbar-hide z-0 relative">
      {children}
    </div>
  </div>
);

const CameraTile = ({ cam, sysState }: { cam: any, sysState: string }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);
  const isThreat = sysState === "ESCALATED" && cam.id === "CAM-08";

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === tileRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      tileRef.current?.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div 
      ref={tileRef} 
      className={`relative flex flex-col w-full h-full bg-black border-[2px] ${isThreat ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]' : 'border-[#1C2230]'} rounded-xl overflow-hidden group transition-colors hover:border-blue-500/40`}
    >
      {/* Tactical Header Overlay - Responsive Boundaries Fixed */}
      <div className="absolute top-0 inset-x-0 h-auto min-h-[42px] bg-gradient-to-b from-black/90 to-transparent flex items-start justify-between px-2 sm:px-3 pt-2 sm:pt-2.5 z-40 pointer-events-none transition-opacity">
        
        {/* Left Side: Badge & Title */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 pr-2">
          <span className="text-[8px] sm:text-[9px] font-bold text-white bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded shadow-sm shrink-0 tracking-widest">LIVE</span>
          <span className={`text-[10px] sm:text-[11px] font-bold text-white truncate drop-shadow-md ${isFullscreen ? 'text-[14px] sm:text-[16px]' : ''}`}>{cam.name}</span>
        </div>
        
        {/* Right Side: Controls (Always visible on mobile, fade-in on desktop) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0 pointer-events-auto opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
          {isThreat && <span className="text-[8px] sm:text-[9px] text-white font-bold bg-red-600 px-1.5 sm:px-2 py-0.5 rounded animate-pulse shadow-lg tracking-widest hidden sm:block">REC</span>}
          
          <button onClick={toggleAudio} className={`p-1.5 sm:p-2 rounded-md transition-all backdrop-blur-md border ${!isMuted ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-black/60 text-slate-300 hover:bg-white/10 border-white/10'}`}>
            {!isMuted ? <Volume2 className="w-3.5 h-3.5 sm:w-4 h-4"/> : <VolumeX className="w-3.5 h-3.5 sm:w-4 h-4"/>}
          </button>
          
          <button onClick={toggleFullscreen} className="text-white bg-black/60 hover:bg-blue-500/30 border border-white/10 p-1.5 sm:p-2 rounded-md transition-all backdrop-blur-md shadow-lg">
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 h-4 text-blue-400"/> : <Expand className="w-3.5 h-3.5 sm:w-4 h-4"/>}
          </button>
        </div>
      </div>
      
      {/* Video Payload */}
      <div className="flex-1 w-full h-full relative">
        <MediaRenderer cam={cam} isMuted={isMuted} />
        
        {/* Live Translation Engine */}
        <TranslationEngine camId={cam.id} isFullscreen={isFullscreen} />

        <div className="scanlines absolute inset-0 z-10" />
        <div className="vignette absolute inset-0 z-10" />
        
        {/* Threat Overlay */}
        {isThreat && (
          <div className="absolute inset-0 pointer-events-none z-20">
             <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] border-[2px] border-red-500/80 bg-red-500/10 rounded-sm">
               <div className="absolute -bottom-6 right-0 text-[8px] font-english font-bold bg-red-600 text-white px-2 py-0.5 tracking-widest rounded-sm">TARGET ACQUIRED</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. MAIN ARCHITECTURE
// ==========================================
export default function AfaqEnterpriseSOC() {
  const [mounted, setMounted] = useState(false);
  const [sysState, setSysState] = useState("NORMAL"); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => { 
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const handleSimulateAI = () => {
    if (sysState === "NORMAL") {
      setSysState("ESCALATED");
      setIncidents([{ id: `INC-${Math.floor(Math.random() * 9000)}`, cam: "CAM-08", type: "HIGH DENSITY CROWD ANOMALY", time: new Date().toLocaleTimeString(), duration: "LIVE", status: "RECORDING", severity: "CRITICAL" }, ...incidents]);
    } else {
      setSysState("NORMAL");
      setIncidents(prev => prev.map(inc => inc.status === "RECORDING" ? { ...inc, status: "SAVED CLIP", duration: "00:02:14" } : inc));
    }
  };

  return (
    <div dir="rtl" className="min-h-screen lg:h-screen w-full bg-[#05070A] text-slate-300 flex flex-col font-arabic overflow-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Orbitron:wght@500;700&display=swap');
        .font-arabic { font-family: 'IBM Plex Sans Arabic', sans-serif; }
        .font-english { font-family: 'Inter', sans-serif; }
        .font-orbitron { font-family: 'Orbitron', sans-serif; letter-spacing: 0.1em; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15));
          background-size: 100% 4px; pointer-events: none;
        }
        .vignette { box-shadow: inset 0 0 100px rgba(0,0,0,0.9); pointer-events: none; }
        
        /* STRICT FULLSCREEN OVERRIDES */
        :fullscreen { 
          width: 100vw !important; height: 100vh !important; 
          max-width: none !important; max-height: none !important;
          margin: 0 !important; padding: 0 !important;
          border: none !important; border-radius: 0 !important;
          background-color: #000 !important;
        }
        :-webkit-full-screen { 
          width: 100vw !important; height: 100vh !important; 
          max-width: none !important; max-height: none !important;
          margin: 0 !important; padding: 0 !important;
          border: none !important; border-radius: 0 !important;
          background-color: #000 !important;
        }
      `}} />

      {/* --- GLOBAL HEADER --- */}
      <header className="w-full shrink-0 min-h-[64px] bg-[#0A0D14] border-b border-[#1C2230] px-4 py-3 lg:py-0 flex flex-col lg:flex-row items-center justify-between shadow-2xl z-40 gap-3 lg:gap-0">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-english font-medium w-full lg:w-auto">
          <div className="flex items-center gap-2 text-slate-200 font-orbitron">
            <Clock className="w-4 h-4 text-slate-500" />
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </div>
          <div className="hidden sm:block w-px h-5 bg-[#1C2230]" />
          <button onClick={handleSimulateAI} className={`text-[10px] font-bold px-4 py-2 rounded-md transition-all duration-300 border ${sysState === 'ESCALATED' ? 'bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-black/40 text-slate-300 border-[#1C2230] hover:bg-[#1C2230] hover:text-white'}`}>
            {sysState === 'ESCALATED' ? 'RESOLVE INCIDENT' : 'SIMULATE AI ESCALATION'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center order-first lg:order-none lg:absolute lg:left-1/2 lg:-translate-x-1/2 pb-3 lg:pb-0 border-b border-[#1C2230] lg:border-0 w-full lg:w-auto">
          <div className="text-[16px] md:text-[18px] font-orbitron font-bold text-white tracking-[0.25em] flex items-center gap-2 drop-shadow-lg">
            <Server className="w-5 h-5 text-emerald-500" /> AFAQ-AI-SOC
          </div>
          <div className="text-[9px] font-english text-emerald-500/80 tracking-widest uppercase mt-0.5">{SESSION.node}</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-english font-medium w-full lg:w-auto">
          <div className="hidden sm:flex items-center gap-2 text-emerald-400/90">
            <ShieldCheck className="w-4 h-4" /> SECURE LINK
          </div>
          <div className="flex items-center gap-2.5 bg-black/40 border border-[#1C2230] px-3 py-1.5 rounded-md">
            <span className="text-slate-400 text-[9px] tracking-widest">INCIDENTS</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sysState === 'ESCALATED' ? 'bg-red-500 text-white animate-pulse' : 'bg-[#1C2230] text-slate-300'}`}>
              {sysState === 'ESCALATED' ? '01' : '00'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 lg:border-l border-[#1C2230] lg:pl-5">
            <div className="flex flex-col leading-tight items-end">
              <span className="text-[11px] font-bold text-white">{SESSION.user}</span>
              <span className="text-[9px] text-blue-400/80">{SESSION.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-[#1C2230] flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (Strictly completely separated, visible >= lg) */}
      {/* ========================================================= */}
      <div className="hidden xl:flex flex-1 w-full h-full overflow-hidden p-4 gap-4">
        
        {/* Desktop Left Sidebar */}
        <aside className="w-[320px] flex flex-col gap-4 h-full shrink-0">
          <Panel title="Threat Intelligence" action={<Activity className="w-4 h-4 text-emerald-500" />}>
            <div className="flex items-center gap-6 h-full p-2">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0 drop-shadow-2xl">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="42" stroke="#1C2230" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="42" stroke={sysState === 'ESCALATED' ? '#EF4444' : '#10B981'} strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={sysState === 'ESCALATED' ? '42' : '220'} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[18px] font-orbitron font-bold text-white drop-shadow-md">{sysState === 'ESCALATED' ? '84%' : '08%'}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4 w-full h-full">
                <div className="flex justify-between items-end border-b border-[#1C2230] pb-2">
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

          <Panel title="Active Recommendations" className="flex-1">
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

          <Panel title="System Telemetry">
             <div className="space-y-5 pt-2">
                <div>
                  <div className="flex justify-between text-[10px] font-english text-slate-400 mb-2 tracking-widest"><span>GPU ACCELERATION</span><span className="text-white font-orbitron">48%</span></div>
                  <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-[#1C2230]"><div className="bg-blue-500 h-full w-[48%] rounded-full" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-english text-slate-400 mb-2 tracking-widest"><span>CPU OVERHEAD</span><span className="text-white font-orbitron">36%</span></div>
                  <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-[#1C2230]"><div className="bg-emerald-500 h-full w-[36%] rounded-full" /></div>
                </div>
             </div>
          </Panel>
        </aside>

        {/* Desktop Center Widescreen Grid */}
        <section className="flex-1 h-full bg-[#0A0D14] border border-[#1C2230] rounded-xl p-3 shadow-inner relative overflow-hidden flex flex-col justify-center">
           <div className="absolute inset-0 pointer-events-none opacity-[0.10] z-0">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
           </div>
           
           <div className="relative z-10 w-full grid grid-cols-4 grid-rows-2 gap-3 h-full">
              {ALL_CAMERAS.map(cam => <CameraTile key={`desktop-${cam.id}`} cam={cam} sysState={sysState} />)}
           </div>
        </section>

        {/* Desktop Right Sidebar */}
        <aside className="w-[320px] flex flex-col gap-4 h-full shrink-0">
          <Panel title="Tactical Operations Map" action={<span className="text-[9px] text-emerald-400 flex items-center gap-1.5 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> SECURE</span>}>
            <div className="w-full aspect-[4/3] bg-[#05070A] border border-[#1C2230] rounded-lg relative overflow-hidden flex items-center justify-center shadow-inner">
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

          <Panel title="Incident Escalations" action={<span className="text-[11px] font-orbitron font-bold text-slate-400">{sysState === 'ESCALATED' ? '1' : '0'}</span>}>
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

          <Panel title="AI Recording Ledger" className="flex-1" action={<div className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer hover:text-white transition-colors tracking-widest">TODAY</div>}>
             <div className="flex-1 overflow-y-auto space-y-5 relative pl-4 before:absolute before:inset-y-0 before:left-1 before:w-px before:bg-[#1C2230] pt-2 pb-4">
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
             </div>
          </Panel>
        </aside>
      </div>

      {/* ========================================================= */}
      {/* MOBILE LAYOUT (Strictly separated, visible < xl) */}
      {/* ========================================================= */}
      <div className="flex xl:hidden flex-1 w-full flex-col p-3 sm:p-4 gap-4 overflow-y-auto">
        
        {/* Mobile Central Grid (Stacked 16:9 feeds) */}
        <section className="w-full flex flex-col gap-3">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {ALL_CAMERAS.map(cam => (
                 <div key={`mob-${cam.id}`} className="w-full aspect-video">
                   <CameraTile cam={cam} sysState={sysState} />
                 </div>
              ))}
           </div>
        </section>

        {/* Mobile Stats */}
        <Panel title="Threat Intelligence" className="min-h-[160px]">
            <div className="flex items-center gap-6 h-full p-2">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0 drop-shadow-2xl">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#1C2230" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="34" stroke={sysState === 'ESCALATED' ? '#EF4444' : '#10B981'} strokeWidth="6" fill="none" strokeDasharray="213" strokeDashoffset={sysState === 'ESCALATED' ? '30' : '180'} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[16px] font-orbitron font-bold text-white drop-shadow-md">{sysState === 'ESCALATED' ? '84%' : '08%'}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4 w-full h-full">
                <div className="flex justify-between items-end border-b border-[#1C2230] pb-2">
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

        <Panel title="Incident Escalations" className="min-h-[150px]">
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

      </div>
    </div>
  );
}