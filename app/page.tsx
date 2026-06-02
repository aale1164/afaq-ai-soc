"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Map as MapIcon,
  Activity,
  Server,
  User,
  Clock,
  Target,
  AlertTriangle,
  PlayCircle,
  Maximize,
  Minimize,
  Monitor,
  CheckCircle2,
  VolumeX,
  Volume2,
  Expand,
} from "lucide-react";

// ==========================================
// 1. الأنواع الصارمة (TypeScript Types)
// ==========================================
type CameraType = "youtube" | "video";

interface Camera {
  id: string;
  name: string;
  ai: string;
  fps: number;
  type: CameraType;
  url: string;
  fallbackUrl: string;
  filter: string;
}

type SystemStatus = "NORMAL" | "ESCALATED";

interface Incident {
  id: string;
  cam: string;
  type: string;
  time: string;
  duration: string;
  status: "RECORDING" | "SAVED_CLIP";
  severity: "CRITICAL" | "LOW";
}

// ==========================================
// 2. الثوابت والبيانات
// ==========================================
const SESSION = {
  user: "AALE AL-RASHIDI",
  role: "Senior Commander",
  node: "BURAYDAH-NODE-ALPHA",
  status: "SECURE",
} as const;

const ALL_CAMERAS: Camera[] = [
  {
    id: "CAM-01",
    name: "محيط الحرم المكي",
    ai: "Public Live Feed",
    fps: 60,
    type: "youtube",
    url: "https://www.youtube.com/embed/GavTnwpVcNw?autoplay=1&mute=1&controls=0&playsinline=1",
    fallbackUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    filter: "contrast(1.05)",
  },
  {
    id: "CAM-02",
    name: "محيط الحرم المدني",
    ai: "Public Live Feed",
    fps: 30,
    type: "youtube",
    url: "https://www.youtube.com/embed/naaOMgZbIHQ?autoplay=1&mute=1&controls=0&playsinline=1",
    fallbackUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    filter: "contrast(1.05)",
  },
  {
    id: "CAM-03",
    name: "تقاطع شيبويا الذكي",
    ai: "Traffic AI Monitoring",
    fps: 60,
    type: "youtube",
    url: "https://www.youtube.com/embed/dfVK7ld38Ys?autoplay=1&mute=1&controls=0&playsinline=1",
    fallbackUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    filter: "contrast(1.1) brightness(0.9)",
  },
  {
    id: "CAM-04",
    name: "البث الإخباري - العربية",
    ai: "News Monitoring",
    fps: 30,
    type: "youtube",
    url: "https://www.youtube.com/embed/n7eQejkXbnM?autoplay=1&mute=1&controls=0&playsinline=1",
    fallbackUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    filter: "contrast(1.05)",
  },
  {
    id: "CAM-05",
    name: "البث الإخباري - تلفزيون سوريا",
    ai: "Regional Monitoring",
    fps: 30,
    type: "youtube",
    url: "https://www.youtube.com/embed/ZN0aK3V0ds0?autoplay=1&mute=1&controls=0&playsinline=1",
    fallbackUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    filter: "contrast(1.05)",
  },
  {
    id: "CAM-06",
    name: "البث الإخباري - قطر",
    ai: "Strategic Monitoring",
    fps: 60,
    type: "youtube",
    url: "https://www.youtube.com/embed/d020NL_oFAY?autoplay=1&mute=1&controls=0&playsinline=1",
    fallbackUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    filter: "contrast(1.1)",
  },
  {
    id: "CAM-07",
    name: "قناة الوثائقية",
    ai: "Intelligence Feed",
    fps: 30,
    type: "youtube",
    url: "https://www.youtube.com/embed/TiPYdMXt_XI?autoplay=1&mute=1&controls=0&playsinline=1",
    fallbackUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    filter: "contrast(1.05)",
  },
  {
    id: "CAM-08",
    name: "التحليل التكتيكي للحشود والمركبات",
    ai: "Crowd / Traffic AI",
    fps: 60,
    type: "youtube",
    url: "https://www.youtube.com/embed/HpdO5Kq3o7Y?autoplay=1&mute=1&controls=0&playsinline=1",
    fallbackUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    filter: "contrast(1.1)",
  },
];

// ==========================================
// 3. الخطافات المخصصة (Custom Hooks)
// ==========================================
function useCurrentTime(interval = 1000): Date {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return time;
}

function useFullscreen(ref: React.RefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(document.fullscreenElement === ref.current);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [ref]);

  const enter = useCallback(async () => {
    try {
      if (ref.current) await ref.current.requestFullscreen();
    } catch (err) {
      console.error(err);
    }
  }, [ref]);

  const exit = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggle = useCallback(() => {
    isFullscreen ? exit() : enter();
  }, [isFullscreen, enter, exit]);

  return { isFullscreen, toggle };
}

// إدارة الحالة الكلية
type Action =
  | { type: "ESCALATE"; incident: Incident }
  | { type: "RESOLVE" }
  | { type: "SET_FOCUS"; camId: string | null }
  | { type: "SET_AUDIO"; camId: string | null };

interface State {
  status: SystemStatus;
  incidents: Incident[];
  focusedCamId: string | null;
  activeAudioCamId: string | null;
}

const initialState: State = {
  status: "NORMAL",
  incidents: [],
  focusedCamId: null,
  activeAudioCamId: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ESCALATE":
      return {
        ...state,
        status: "ESCALATED",
        focusedCamId: "CAM-08",
        activeAudioCamId: null,
        incidents: [action.incident, ...state.incidents],
      };
    case "RESOLVE":
      return {
        ...state,
        status: "NORMAL",
        focusedCamId: null,
        activeAudioCamId: null,
        incidents: state.incidents.map((inc) =>
          inc.status === "RECORDING"
            ? { ...inc, status: "SAVED_CLIP", duration: "00:02:14" }
            : inc
        ),
      };
    case "SET_FOCUS":
      return {
        ...state,
        focusedCamId: action.camId,
        activeAudioCamId: null, // إعادة تعيين الصوت عند تغيير التركيز
      };
    case "SET_AUDIO":
      return {
        ...state,
        activeAudioCamId:
          state.activeAudioCamId === action.camId ? null : action.camId,
      };
    default:
      return state;
  }
}

function useSOC() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const simulateAI = useCallback(() => {
    if (state.status === "NORMAL") {
      const incident: Incident = {
        id: `INC-${Math.floor(Math.random() * 9000)}`,
        cam: "CAM-08",
        type: "HIGH DENSITY CROWD ANOMALY",
        time: new Date().toLocaleTimeString(),
        duration: "LIVE",
        status: "RECORDING",
        severity: "CRITICAL",
      };
      dispatch({ type: "ESCALATE", incident });
    } else {
      dispatch({ type: "RESOLVE" });
    }
  }, [state.status]);

  const toggleFocus = useCallback(
    (camId: string) => {
      if (state.status === "ESCALATED") return; // ممنوع تغيير التركيز أثناء التصعيد
      dispatch({
        type: "SET_FOCUS",
        camId: state.focusedCamId === camId ? null : camId,
      });
    },
    [state.status, state.focusedCamId]
  );

  const toggleAudio = useCallback((camId: string) => {
    dispatch({ type: "SET_AUDIO", camId });
  }, []);

  return { ...state, simulateAI, toggleFocus, toggleAudio };
}

// ==========================================
// 4. المكونات الفرعية (Sub-components)
// ==========================================

// مشغل الوسائط
const MediaRenderer = memo(function MediaRenderer({
  cam,
  isMuted,
}: {
  cam: Camera;
  isMuted: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => setHasError(true), []);

  const videoStyle: React.CSSProperties = { filter: cam.filter };

  if (cam.type !== "youtube" || hasError) {
    return (
      <video
        src={cam.fallbackUrl || cam.url}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        style={videoStyle}
        className="absolute inset-0 w-full h-full object-cover bg-black pointer-events-none"
      />
    );
  }

  const baseUrl = cam.url.replace(/&mute=[01]/g, "");
  const finalUrl = `${baseUrl}&mute=${isMuted ? "1" : "0"}`;

  return (
    <iframe
      src={finalUrl}
      onError={handleError}
      allow="autoplay; encrypted-media"
      className="absolute inset-0 w-full h-full border-none bg-black pointer-events-none"
      tabIndex={-1}
      style={videoStyle}
    />
  );
});

// لوحة عامة
const Panel = memo(function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0C1017] border border-[#1C2230] rounded-xl flex flex-col shadow-2xl relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1C2230] bg-[#0F131C] shrink-0 z-10">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-english">
          {title}
        </h3>
        {action}
      </div>
      <div className="flex-1 overflow-y-auto p-4 gap-3 flex flex-col scrollbar-hide z-0 relative">
        {children}
      </div>
    </div>
  );
});

// دائرة التهديد
const ThreatCircle = memo(function ThreatCircle({
  status,
}: {
  status: SystemStatus;
}) {
  const escalated = status === "ESCALATED";
  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0 drop-shadow-2xl">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke="#1C2230"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="48"
          cy="48"
          r="42"
          stroke={escalated ? "#EF4444" : "#10B981"}
          strokeWidth="8"
          fill="none"
          strokeDasharray="264"
          strokeDashoffset={escalated ? "42" : "220"}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-orbitron font-bold text-white drop-shadow-md">
          {escalated ? "84%" : "08%"}
        </span>
      </div>
    </div>
  );
});

// معلومات التهديد
const ThreatIntelligence = memo(function ThreatIntelligence({
  status,
}: {
  status: SystemStatus;
}) {
  const escalated = status === "ESCALATED";
  return (
    <Panel
      title="Threat Intelligence"
      action={<Activity className="w-4 h-4 text-emerald-500" />}
    >
      <div className="flex items-center gap-6 h-full p-2">
        <ThreatCircle status={status} />
        <div className="flex flex-col justify-center gap-4 w-full h-full">
          <div className="flex justify-between items-end border-b border-[#1C2230] pb-2">
            <span className="text-[10px] font-english text-slate-500 tracking-widest">
              TREND
            </span>
            <span
              className={`text-xs font-english font-bold ${escalated ? "text-red-400" : "text-emerald-400"}`}
            >
              {escalated ? "SURGING ↗" : "STABLE →"}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-english text-slate-500 tracking-widest">
              LEVEL
            </span>
            <span
              className={`text-xs font-english font-bold ${escalated ? "text-red-400" : "text-emerald-400"}`}
            >
              {escalated ? "CRITICAL" : "LOW"}
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
});

// لوحة الحوادث
const IncidentPanel = memo(function IncidentPanel({
  status,
  incidents,
  currentTime,
}: {
  status: SystemStatus;
  incidents: Incident[];
  currentTime: string;
}) {
  return (
    <Panel
      title="Incident Escalations"
      action={
        <span className="text-xs font-orbitron font-bold text-slate-400">
          {status === "ESCALATED" ? "1" : "0"}
        </span>
      }
    >
      {status === "ESCALATED" ? (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500 p-3 rounded-r-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-english font-bold text-red-400 flex items-center gap-2 tracking-widest">
                DENSITY ANOMALY
              </span>
              <span className="text-[9px] font-english font-bold text-white bg-red-600 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(239,68,68,0.6)] tracking-widest">
                CRITICAL
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-300 font-arabic truncate pr-4">
                CAM-08 • التحليل التكتيكي للحشود
              </span>
              <span className="text-[10px] text-slate-500 font-orbitron shrink-0">
                {currentTime}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-500 text-center py-6 font-english h-full flex items-center justify-center">
          All feeds nominal.
        </div>
      )}
    </Panel>
  );
});

// سجل التسجيلات
const RecordingLedger = memo(function RecordingLedger({
  incidents,
}: {
  incidents: Incident[];
}) {
  return (
    <Panel
      title="AI Recording Ledger"
      className="flex-1"
      action={
        <div className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer hover:text-white transition-colors tracking-widest">
          TODAY
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto space-y-5 relative pl-4 before:absolute before:inset-y-0 before:left-1 before:w-px before:bg-[#1C2230] pt-2 pb-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="relative pl-4 opacity-90 hover:opacity-100 transition-opacity"
          >
            <div
              className={`absolute left-[-20px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#0A0D14] ${
                inc.status === "RECORDING"
                  ? "bg-red-500 animate-pulse"
                  : "bg-emerald-500"
              }`}
            />
            <div className="flex justify-between items-start mb-1.5">
              <span className="text-[10px] font-orbitron text-slate-400 tracking-wider">
                {inc.time}
              </span>
              <span
                className={`text-[9px] font-orbitron font-bold flex items-center gap-1.5 tracking-widest ${
                  inc.status === "RECORDING"
                    ? "text-red-400 bg-red-500/10 px-1.5 rounded"
                    : "text-slate-500"
                }`}
              >
                {inc.status === "RECORDING" ? (
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                ) : (
                  <PlayCircle className="w-3.5 h-3.5" />
                )}
                {inc.status === "RECORDING" ? "REC" : inc.duration}
              </span>
            </div>
            <div className="text-xs font-english text-slate-200 font-medium leading-relaxed">
              {inc.cam} • {inc.type}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
});

// خريطة العمليات
const TacticalMap = memo(function TacticalMap({
  status,
}: {
  status: SystemStatus;
}) {
  return (
    <Panel
      title="Tactical Operations Map"
      action={
        <span className="text-[9px] text-emerald-400 flex items-center gap-1.5 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
          SECURE
        </span>
      }
      className="hidden lg:flex lg:flex-none"
    >
      <div className="w-full aspect-[4/3] bg-[#05070A] border border-[#1C2230] rounded-lg relative overflow-hidden flex items-center justify-center shadow-inner">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <MapIcon className="w-16 h-16 text-slate-700/40 absolute" />
        <div className="absolute top-[25%] left-[25%] flex items-center gap-1 text-[9px] font-english text-slate-400 drop-shadow-md">
          <Monitor className="w-3 h-3 text-blue-500" /> CAM-01
        </div>
        <div className="absolute bottom-[25%] right-[25%] flex items-center gap-1 text-[9px] font-english text-slate-400 drop-shadow-md">
          <Monitor className="w-3 h-3 text-blue-500" /> CAM-06
        </div>
        {status === "ESCALATED" && (
          <div className="absolute top-[45%] right-[45%]">
            <div className="absolute w-6 h-6 bg-red-500 rounded-full animate-ping opacity-40" />
            <div className="w-3 h-3 bg-red-500 rounded-full relative border-2 border-[#05070A]" />
            <div className="absolute -top-5 left-5 text-[9px] font-english font-bold text-red-400 flex items-center gap-1 drop-shadow-md whitespace-nowrap">
              <Target className="w-3 h-3" /> CAM-08
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
});

// مكوّن الكاميرا الواحدة
const CameraTile = memo(function CameraTile({
  cam,
  status,
  isFocused,
  isAudioActive,
  onFocus,
  onFullscreen,
  onAudioToggle,
}: {
  cam: Camera;
  status: SystemStatus;
  isFocused: boolean;
  isAudioActive: boolean;
  onFocus: (id: string) => void;
  onFullscreen: (id: string) => void;
  onAudioToggle: (id: string) => void;
}) {
  const tileRef = useRef<HTMLDivElement>(null);
  const isThreat = status === "ESCALATED" && cam.id === "CAM-08";

  const handleClick = () => {
    if (status === "ESCALATED") return; // لا يمكن تغيير التركيز أثناء التصعيد
    if (!isFocused) onFocus(cam.id);
  };

  return (
    <motion.div
      ref={tileRef}
      layoutId={`cam-${cam.id}`}
      className={`relative bg-black border-[2px] rounded-xl overflow-hidden cursor-pointer group ${
        isThreat
          ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
          : "border-[#1C2230] hover:border-blue-500/40"
      }`}
      onClick={handleClick}
    >
      {/* الرأس المعلوماتي */}
      <div className="absolute top-0 inset-x-0 h-[42px] bg-gradient-to-b from-black/90 to-transparent flex items-start justify-between px-3 pt-2.5 z-30 pointer-events-none transition-opacity">
        <div className="flex items-center gap-2.5 overflow-hidden w-2/3">
          <span className="text-[8px] font-bold text-white bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded shadow-sm shrink-0 tracking-widest">
            LIVE
          </span>
          <span className="text-xs font-bold text-white truncate drop-shadow-md">
            {cam.name}
          </span>
        </div>
        <div className="flex items-center justify-end gap-2 shrink-0 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity w-1/3">
          {isThreat && (
            <span className="text-[9px] text-white font-bold bg-red-600 px-2 py-0.5 rounded animate-pulse shadow-lg tracking-widest">
              REC
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAudioToggle(cam.id);
            }}
            className={`p-1.5 rounded-md transition-all backdrop-blur-md border ${
              isAudioActive
                ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                : "bg-black/60 text-slate-300 hover:bg-white/10 border-white/10"
            }`}
            aria-label={isAudioActive ? "كتم الصوت" : "إلغاء الكتم"}
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFullscreen(cam.id);
            }}
            className="text-white bg-black/60 hover:bg-blue-500/30 border border-white/10 p-1.5 rounded-md transition-all backdrop-blur-md shadow-lg"
            aria-label="ملء الشاشة"
          >
            <Expand className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* الفيديو */}
      <div className="flex-1 relative w-full h-full aspect-video">
        <MediaRenderer cam={cam} isMuted={!isAudioActive} />
        <div className="scanlines absolute inset-0 z-10" />
        <div className="vignette absolute inset-0 z-10" />

        {isThreat && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] border-[2px] border-red-500/80 bg-red-500/10 rounded-sm">
              <div className="absolute -bottom-6 right-0 text-[8px] font-english font-bold bg-red-600 text-white px-2 py-0.5 tracking-widest rounded-sm">
                TARGET ACQUIRED
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// ==========================================
// 5. المكون الرئيسي
// ==========================================
export default function AfaqEnterpriseSOC() {
  const [mounted, setMounted] = useState(false);
  const currentTime = useCurrentTime();
  const {
    status,
    incidents,
    focusedCamId,
    activeAudioCamId,
    simulateAI,
    toggleFocus,
    toggleAudio,
  } = useSOC();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleNativeFullscreen = (camId: string) => {
    const elem = document.getElementById(`cam-${camId}`);
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  const focusedCameras = focusedCamId
    ? ALL_CAMERAS.filter((c) => c.id === focusedCamId)
    : [];

  const remainingCameras = ALL_CAMERAS.filter(
    (c) => c.id !== focusedCamId
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen lg:h-screen w-full bg-[#05070A] text-slate-300 flex flex-col overflow-x-hidden lg:overflow-hidden select-none font-arabic"
    >
      {/* الأنماط العالمية */}
      <style>{`
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
          box-shadow: inset 0 0 120px rgba(0,0,0,0.95);
          pointer-events: none;
        }
        :fullscreen { border-radius: 0 !important; }
        :-webkit-full-screen { border-radius: 0 !important; }
      `}</style>

      {/* الهيدر */}
      <header className="w-full shrink-0 h-16 bg-[#0A0D14] border-b border-[#1C2230] px-4 flex items-center justify-between shadow-2xl z-40">
        <div className="flex items-center gap-4 text-xs font-english font-medium">
          <div className="flex items-center gap-2 text-slate-200 font-orbitron">
            <Clock className="w-4 h-4 text-slate-500" />
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </div>
          <div className="hidden sm:block w-px h-5 bg-[#1C2230]" />
          <button
            onClick={simulateAI}
            className={`text-[10px] font-bold px-4 py-2 rounded-md transition-all duration-300 border ${
              status === "ESCALATED"
                ? "bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                : "bg-black/40 text-slate-300 border-[#1C2230] hover:bg-[#1C2230] hover:text-white"
            }`}
          >
            {status === "ESCALATED"
              ? "RESOLVE INCIDENT"
              : "SIMULATE AI ESCALATION"}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2">
          <div className="text-lg md:text-xl font-orbitron font-bold text-white tracking-[0.25em] flex items-center gap-2 drop-shadow-lg">
            <Server className="w-5 h-5 text-emerald-500" /> AFAQ-AI-SOC
          </div>
          <div className="text-[9px] font-english text-emerald-500/80 tracking-widest uppercase mt-0.5">
            {SESSION.node}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-english font-medium">
          <div className="flex items-center gap-2 text-emerald-400/90">
            <ShieldCheck className="w-4 h-4" /> SECURE LINK
          </div>
          <div className="flex items-center gap-2.5 bg-black/40 border border-[#1C2230] px-3 py-1.5 rounded-md">
            <span className="text-slate-400 text-[9px] tracking-widest">
              INCIDENTS
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                status === "ESCALATED"
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-[#1C2230] text-slate-300"
              }`}
            >
              {status === "ESCALATED" ? "01" : "00"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 border-l border-[#1C2230] pl-5">
            <div className="flex flex-col leading-tight items-end">
              <span className="text-xs font-bold text-white">
                {SESSION.user}
              </span>
              <span className="text-[9px] text-blue-400/80">
                {SESSION.role}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-[#1C2230] flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-3 lg:p-4 overflow-y-auto lg:overflow-hidden relative z-10 w-full">
        {/* اللوحة اليسرى */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4 lg:h-full order-2 lg:order-1">
          <ThreatIntelligence status={status} />
          <Panel title="Active Recommendations" className="flex-1">
            {status === "ESCALATED" ? (
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg shadow-lg">
                  <div className="flex items-start gap-3.5">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-english font-bold text-white">
                        HIGH DENSITY CROWD ANOMALY
                      </span>
                      <span className="text-[10px] font-arabic text-slate-300">
                        98.4% دقة الذكاء الاصطناعي - CAM-08
                      </span>
                      <span className="text-[10px] font-arabic text-blue-400/90 cursor-pointer hover:text-blue-300 hover:underline transition-colors mt-1">
                        يوصى بتوجيه دوريات المرور وتفعيل خطة الانتشار فوراً.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-6 font-english flex items-center justify-center h-full">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500/50" /> All
                  vectors secure.
                </span>
              </div>
            )}
          </Panel>

          <Panel title="System Telemetry">
            <div className="space-y-5 pt-2">
              <div>
                <div className="flex justify-between text-[10px] font-english text-slate-400 mb-2 tracking-widest">
                  <span>GPU ACCELERATION</span>
                  <span className="text-white font-orbitron">48%</span>
                </div>
                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-[#1C2230]">
                  <div className="bg-blue-500 h-full w-[48%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-english text-slate-400 mb-2 tracking-widest">
                  <span>CPU OVERHEAD</span>
                  <span className="text-white font-orbitron">36%</span>
                </div>
                <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden border border-[#1C2230]">
                  <div className="bg-emerald-500 h-full w-[36%] rounded-full" />
                </div>
              </div>
            </div>
          </Panel>
        </aside>

        {/* المنطقة المركزية */}
        <section className="flex-1 w-full flex flex-col min-h-[50vh] lg:min-h-0 bg-[#0A0D14] border border-[#1C2230] rounded-xl p-2 lg:p-3 shadow-inner relative overflow-hidden order-1 lg:order-2 z-20">
          <div className="absolute inset-0 pointer-events-none opacity-[0.10] z-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="flex-1 z-10 w-full lg:h-full flex flex-col gap-3">
            <AnimatePresence mode="wait">
              {focusedCamId ? (
                // وضع التركيز (كاميرا موسعة + شريط الكاميرات المصغرة)
                <React.Fragment key="focus-view">
                  <motion.div
                    className="flex-1 w-full min-h-[40vh] grid gap-3 grid-cols-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {focusedCameras.map((cam) => (
                      <CameraTile
                        key={cam.id}
                        cam={cam}
                        status={status}
                        isFocused={true}
                        isAudioActive={activeAudioCamId === cam.id}
                        onFocus={toggleFocus}
                        onFullscreen={handleNativeFullscreen}
                        onAudioToggle={toggleAudio}
                      />
                    ))}
                  </motion.div>

                  <div className="h-[120px] lg:h-[160px] w-full shrink-0 flex gap-3 overflow-x-auto scrollbar-hide snap-x">
                    {remainingCameras.map((cam) => (
                      <div
                        key={`thumb-${cam.id}`}
                        onClick={() => toggleFocus(cam.id)}
                        className="w-[180px] lg:w-[260px] shrink-0 bg-black border border-[#1C2230] rounded-xl flex flex-col overflow-hidden cursor-pointer hover:border-blue-500/60 transition-all group snap-start shadow-md"
                      >
                        <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/90 to-transparent flex items-start px-2.5 pt-1.5 z-20 pointer-events-none">
                          <span className="text-[10px] font-bold text-white truncate drop-shadow-md">
                            {cam.name}
                          </span>
                        </div>
                        <div className="flex-1 relative w-full h-full bg-black">
                          <MediaRenderer cam={cam} isMuted={true} />
                          <div className="vignette absolute inset-0 z-10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              ) : (
                // الشبكة العادية
                <motion.div
                  key="normal-grid"
                  className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 lg:grid-rows-2 gap-3 lg:gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {ALL_CAMERAS.map((cam) => (
                    <CameraTile
                      key={cam.id}
                      cam={cam}
                      status={status}
                      isFocused={false}
                      isAudioActive={false} // الصوت معطل في الشبكة
                      onFocus={toggleFocus}
                      onFullscreen={handleNativeFullscreen}
                      onAudioToggle={toggleAudio}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* اللوحة اليمنى */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4 h-auto lg:h-full order-3 relative z-10">
          <TacticalMap status={status} />
          <IncidentPanel
            status={status}
            incidents={incidents}
            currentTime={currentTime.toLocaleTimeString()}
          />
          <RecordingLedger incidents={incidents} />
        </aside>
      </main>
    </div>
  );
}