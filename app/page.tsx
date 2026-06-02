// ==========================================
// types/index.ts
// ==========================================
export type CameraType = 'youtube' | 'video';

export interface Camera {
  id: string;
  name: string;
  ai: string;
  fps: number;
  type: CameraType;
  url: string;
  fallbackUrl: string;
  filter: string;
}

export type SystemState = 'NORMAL' | 'ESCALATED';

export interface Incident {
  id: string;
  cam: string;
  type: string;
  time: string;
  duration: string;
  status: 'RECORDING' | 'SAVED CLIP';
  severity: string;
}

export interface AppSession {
  user: string;
  role: string;
  node: string;
  status: string;
}

// ==========================================
// constants/cameras.ts
// ==========================================
import { Camera } from '../types';

export const ALL_CAMERAS: Camera[] = [
  { id: "CAM-01", name: "محيط الحرم المكي", ai: "Public Live Feed", fps: 60, type: "youtube", url: "https://www.youtube.com/embed/GavTnwpVcNw?autoplay=1&mute=1&controls=0&playsinline=1", fallbackUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", filter: "contrast(1.05)" },
  // ... باقي الكاميرات
];

// ==========================================
// hooks/useCurrentTime.ts
// ==========================================
import { useState, useEffect } from 'react';

export function useCurrentTime(interval = 1000): Date {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return time;
}

// ==========================================
// hooks/useFullscreen.ts
// ==========================================
import { useState, useEffect, useCallback, RefObject } from 'react';

export function useFullscreen(ref: RefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(document.fullscreenElement === ref.current);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, [ref]);

  return { isFullscreen, toggle };
}

// ==========================================
// hooks/useSystemState.ts (useReducer)
// ==========================================
import { useReducer, useCallback } from 'react';
import { Incident, SystemState } from '../types';

interface State {
  sysState: SystemState;
  incidents: Incident[];
}

type Action =
  | { type: 'ESCALATE'; incident: Incident }
  | { type: 'RESOLVE' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ESCALATE':
      return {
        sysState: 'ESCALATED',
        incidents: [action.incident, ...state.incidents],
      };
    case 'RESOLVE':
      return {
        sysState: 'NORMAL',
        incidents: state.incidents.map(inc =>
          inc.status === 'RECORDING' ? { ...inc, status: 'SAVED CLIP', duration: '00:02:14' } : inc
        ),
      };
    default:
      return state;
  }
}

const initialIncident = (): Incident => ({
  id: `INC-${Math.floor(Math.random() * 9000)}`,
  cam: "CAM-08",
  type: "HIGH DENSITY CROWD ANOMALY",
  time: new Date().toLocaleTimeString(),
  duration: "LIVE",
  status: "RECORDING",
  severity: "CRITICAL",
});

export function useSystemState() {
  const [state, dispatch] = useReducer(reducer, {
    sysState: 'NORMAL',
    incidents: [],
  });

  const simulateAI = useCallback(() => {
    if (state.sysState === 'NORMAL') {
      dispatch({ type: 'ESCALATE', incident: initialIncident() });
    } else {
      dispatch({ type: 'RESOLVE' });
    }
  }, [state.sysState]);

  return { ...state, simulateAI };
}

// ==========================================
// components/MediaRenderer.tsx (مُحسَّن)
// ==========================================
import React, { useState, useCallback } from 'react';
import { Camera } from '../types';

interface Props {
  cam: Camera;
  isMuted: boolean;
}

const MediaRenderer: React.FC<Props> = React.memo(({ cam, isMuted }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => setHasError(true), []);

  if (cam.type !== 'youtube' || hasError) {
    return (
      <video
        src={cam.fallbackUrl || cam.url}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        style={{ filter: cam.filter }}
        className="w-full h-full object-cover bg-black pointer-events-none"
      />
    );
  }

  const baseUrl = cam.url.replace(/&mute=[01]/g, '');
  const finalUrl = `${baseUrl}&mute=${isMuted ? '1' : '0'}`;

  return (
    <iframe
      src={finalUrl}
      onError={handleError}
      allow="autoplay; encrypted-media"
      className="w-full h-full border-none bg-black pointer-events-none"
      tabIndex={-1}
      style={{ filter: cam.filter }}
    />
  );
});

MediaRenderer.displayName = 'MediaRenderer';

// ==========================================
// components/Panel.tsx (مع TypeScript)
// ==========================================
import React from 'react';

interface PanelProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Panel: React.FC<PanelProps> = React.memo(({ title, action, children, className = '' }) => (
  <div className={`bg-[#0C1017] border border-[#1C2230] rounded-xl flex flex-col shadow-2xl relative overflow-hidden ${className}`}>
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1C2230] bg-[#0F131C] shrink-0 z-10">
      <h3 className="text-[11px] font-bold text-slate-200 uppercase tracking-widest font-english">{title}</h3>
      {action}
    </div>
    <div className="flex-1 overflow-y-auto p-4 gap-3 flex flex-col scrollbar-hide z-0 relative">
      {children}
    </div>
  </div>
));

Panel.displayName = 'Panel';

// ==========================================
// components/CameraTile.tsx (محسن مع Hooks)
// ==========================================
import React, { useRef, useState, useCallback } from 'react';
import { Camera, SystemState } from '../types';
import { useFullscreen } from '../hooks/useFullscreen';
import MediaRenderer from './MediaRenderer';
import { Expand, Minimize, Volume2, VolumeX } from 'lucide-react';

interface CameraTileProps {
  cam: Camera;
  sysState: SystemState;
}

const CameraTile: React.FC<CameraTileProps> = React.memo(({ cam, sysState }) => {
  const tileRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(tileRef);
  const [isMuted, setIsMuted] = useState(true);

  const isThreat = sysState === 'ESCALATED' && cam.id === 'CAM-08';

  const toggleAudio = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  }, []);

  const handleToggleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFullscreen();
  }, [toggleFullscreen]);

  return (
    <div
      ref={tileRef}
      className={`relative flex flex-col w-full h-full bg-black border-[2px] ${
        isThreat
          ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
          : 'border-[#1C2230]'
      } rounded-xl overflow-hidden group transition-colors hover:border-blue-500/40`}
    >
      {/* Tactical Header Overlay */}
      <div className="absolute top-0 inset-x-0 h-[42px] bg-gradient-to-b from-black/90 to-transparent flex items-start justify-between px-3 pt-2.5 z-30 pointer-events-none transition-opacity">
        <div className="flex items-center gap-2.5 overflow-hidden w-2/3">
          <span className="text-[8px] font-bold text-white bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded shadow-sm shrink-0 tracking-widest">
            LIVE
          </span>
          <span className={`text-[11px] font-bold text-white truncate drop-shadow-md ${isFullscreen ? 'text-[16px]' : ''}`}>
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
            onClick={toggleAudio}
            className={`p-1.5 rounded-md transition-all backdrop-blur-md border ${
              !isMuted
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                : 'bg-black/60 text-slate-300 hover:bg-white/10 border-white/10'
            }`}
            aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleToggleFullscreen}
            className="text-white bg-black/60 hover:bg-blue-500/30 border border-white/10 p-1.5 rounded-md transition-all backdrop-blur-md shadow-lg"
            aria-label={isFullscreen ? 'إنهاء وضع ملء الشاشة' : 'ملء الشاشة'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-blue-400" /> : <Expand className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Video Payload */}
      <div className="flex-1 w-full h-full relative">
        <MediaRenderer cam={cam} isMuted={isMuted} />
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
    </div>
  );
});

CameraTile.displayName = 'CameraTile';

// ==========================================
// components/ThreatIntelligence.tsx
// ==========================================
import React from 'react';
import { SystemState } from '../types';
import { Activity } from 'lucide-react';
import Panel from './Panel';

interface Props {
  sysState: SystemState;
}

const ThreatIntelligence: React.FC<Props> = React.memo(({ sysState }) => {
  const escalated = sysState === 'ESCALATED';
  return (
    <Panel title="Threat Intelligence" action={<Activity className="w-4 h-4 text-emerald-500" />}>
      <div className="flex items-center gap-6 h-full p-2">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0 drop-shadow-2xl">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" stroke="#1C2230" strokeWidth="8" fill="none" />
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke={escalated ? '#EF4444' : '#10B981'}
              strokeWidth="8"
              fill="none"
              strokeDasharray="264"
              strokeDashoffset={escalated ? 42 : 220}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-[18px] font-orbitron font-bold text-white drop-shadow-md">
              {escalated ? '84%' : '08%'}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 w-full h-full">
          <div className="flex justify-between items-end border-b border-[#1C2230] pb-2">
            <span className="text-[10px] font-english text-slate-500 tracking-widest">TREND</span>
            <span className={`text-[12px] font-english font-bold ${escalated ? 'text-red-400' : 'text-emerald-400'}`}>
              {escalated ? 'SURGING ↗' : 'STABLE →'}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-english text-slate-500 tracking-widest">LEVEL</span>
            <span className={`text-[12px] font-english font-bold ${escalated ? 'text-red-400' : 'text-emerald-400'}`}>
              {escalated ? 'CRITICAL' : 'LOW'}
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
});

ThreatIntelligence.displayName = 'ThreatIntelligence';

// ==========================================
// components/IncidentPanel.tsx
// ==========================================
import React from 'react';
import { Incident, SystemState } from '../types';
import Panel from './Panel';
import { PlayCircle } from 'lucide-react';

interface Props {
  sysState: SystemState;
  incidents: Incident[];
  currentTime: string;
}

const IncidentPanel: React.FC<Props> = React.memo(({ sysState, incidents, currentTime }) => {
  const escalated = sysState === 'ESCALATED';
  return (
    <Panel
      title="Incident Escalations"
      action={
        <span className="text-[11px] font-orbitron font-bold text-slate-400">
          {escalated ? '1' : '0'}
        </span>
      }
      className="flex-1"
    >
      {escalated ? (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-red-500/10 to-transparent border-l-4 border-red-500 p-3 rounded-r-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-english font-bold text-red-400 flex items-center gap-2 tracking-widest">
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
              <span className="text-[10px] text-slate-500 font-orbitron shrink-0">{currentTime}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-[12px] text-slate-500 text-center py-6 font-english h-full flex items-center justify-center">
          All feeds nominal.
        </div>
      )}
    </Panel>
  );
});

IncidentPanel.displayName = 'IncidentPanel';

// ==========================================
// pages/index.tsx (المكون الرئيسي)
// ==========================================
import React, { useEffect, useState, Suspense } from 'react';
import { ShieldCheck, Map as MapIcon, Server, User, Clock, Maximize, Minimize, CheckCircle2, PlayCircle, Target, AlertTriangle } from 'lucide-react';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { useSystemState } from '../hooks/useSystemState';
import { ALL_CAMERAS } from '../constants/cameras';
import { CameraTile, Panel, ThreatIntelligence, IncidentPanel } from '../components';

const SESSION = {
  user: "AALE AL-RASHIDI",
  role: "Senior Commander",
  node: "BURAYDAH-NODE-ALPHA",
  status: "SECURE"
};

export default function AfaqEnterpriseSOC() {
  const [mounted, setMounted] = useState(false);
  const currentTime = useCurrentTime();
  const { sysState, incidents, simulateAI } = useSystemState();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // تجنب مشاكل التطابق بين الخادم والمتصفح

  return (
    <div dir="rtl" className="min-h-screen w-full bg-[#05070A] text-slate-300 flex flex-col font-arabic overflow-hidden">
      {/* Global CSS عبر Tailwind layers - مفضل وضعه في ملف globals.css لكننا نستخدمها هنا للتوضيح */}
      <style jsx global>{`
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15));
          background-size: 100% 4px; pointer-events: none;
        }
        .vignette { box-shadow: inset 0 0 100px rgba(0,0,0,0.9); pointer-events: none; }
        :fullscreen { width: 100vw !important; height: 100vh !important; border-radius: 0 !important; }
        :-webkit-full-screen { width: 100vw !important; height: 100vh !important; border-radius: 0 !important; }
      `}</style>

      {/* Header */}
      <header className="w-full shrink-0 h-[64px] bg-[#0A0D14] border-b border-[#1C2230] px-4 flex items-center justify-between shadow-2xl z-40">
        <div className="flex items-center gap-4 text-[11px] font-english font-medium">
          <div className="flex items-center gap-2 text-slate-200 font-orbitron">
            <Clock className="w-4 h-4 text-slate-500" />
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </div>
          <div className="hidden sm:block w-px h-5 bg-[#1C2230]" />
          <button
            onClick={simulateAI}
            className={`text-[10px] font-bold px-4 py-2 rounded-md transition-all duration-300 border ${
              sysState === 'ESCALATED'
                ? 'bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : 'bg-black/40 text-slate-300 border-[#1C2230] hover:bg-[#1C2230] hover:text-white'
            }`}
          >
            {sysState === 'ESCALATED' ? 'RESOLVE INCIDENT' : 'SIMULATE AI ESCALATION'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2">
          <div className="text-[16px] md:text-[18px] font-orbitron font-bold text-white tracking-[0.25em] flex items-center gap-2 drop-shadow-lg">
            <Server className="w-5 h-5 text-emerald-500" /> AFAQ-AI-SOC
          </div>
          <div className="text-[9px] font-english text-emerald-500/80 tracking-widest uppercase mt-0.5">{SESSION.node}</div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] font-english font-medium">
          <div className="flex items-center gap-2 text-emerald-400/90">
            <ShieldCheck className="w-4 h-4" /> SECURE LINK
          </div>
          <div className="flex items-center gap-2.5 bg-black/40 border border-[#1C2230] px-3 py-1.5 rounded-md">
            <span className="text-slate-400 text-[9px] tracking-widest">INCIDENTS</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sysState === 'ESCALATED' ? 'bg-red-500 text-white animate-pulse' : 'bg-[#1C2230] text-slate-300'}`}>
              {sysState === 'ESCALATED' ? '01' : '00'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 border-l border-[#1C2230] pl-5">
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

      {/* سطح المكتب (lg وأكبر) */}
      <div className="hidden lg:flex flex-1 w-full h-full overflow-hidden p-4 gap-4">
        <aside className="w-[320px] flex flex-col gap-4 h-full shrink-0">
          <ThreatIntelligence sysState={sysState} />
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

        <section className="flex-1 h-full bg-[#0A0D14] border border-[#1C2230] rounded-xl p-3 shadow-inner relative overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 pointer-events-none opacity-[0.10] z-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
          <Suspense fallback={<div className="text-white">Loading cameras...</div>}>
            <div className="relative z-10 w-full grid grid-cols-4 grid-rows-2 gap-3 h-full">
              {ALL_CAMERAS.map(cam => <CameraTile key={cam.id} cam={cam} sysState={sysState} />)}
            </div>
          </Suspense>
        </section>

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

          <IncidentPanel sysState={sysState} incidents={incidents} currentTime={currentTime.toLocaleTimeString()} />

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

      {/* الجوال (أقل من lg) */}
      <div className="flex lg:hidden flex-1 w-full flex-col p-3 sm:p-4 gap-4 overflow-y-auto">
        <section className="w-full flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {ALL_CAMERAS.map(cam => (
              <div key={`mob-${cam.id}`} className="w-full aspect-video">
                <CameraTile cam={cam} sysState={sysState} />
              </div>
            ))}
          </div>
        </section>
        <ThreatIntelligence sysState={sysState} />
        <IncidentPanel sysState={sysState} incidents={incidents} currentTime={currentTime.toLocaleTimeString()} />
      </div>
    </div>
  );
}