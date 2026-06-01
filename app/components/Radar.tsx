"use client";
import { motion } from "framer-motion";

export default function Radar() {
  return (
    <div className="relative w-full aspect-square border border-emerald-500/30 rounded-full flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
      {/* الخطوط المتقاطعة */}
      <div className="absolute w-full h-[1px] bg-emerald-500/20" />
      <div className="absolute h-full w-[1px] bg-emerald-500/20" />
      <div className="absolute w-[60%] h-[60%] border border-emerald-500/10 rounded-full" />
      
      {/* ذراع المسح (Radar Blade) */}
      <div className="absolute inset-0 z-10 radar-blade" />

      {/* أهداف الرادار (Blips) - مواقع ثابتة ومتحركة */}
      <motion.div className="absolute top-[20%] left-[60%] w-2 h-2 bg-red-500 rounded-full animate-ping" />
      <motion.div className="absolute bottom-[30%] right-[40%] w-2 h-2 bg-emerald-400 rounded-full" />
      
      {/* نص المدى */}
      <div className="absolute top-2 left-2 text-[8px] text-emerald-600">450 NM</div>
    </div>
  );
}