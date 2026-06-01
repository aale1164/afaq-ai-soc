export default function Sidebar() {
  return (
    <div className="w-72 bg-dark-900 border-r border-dark-700 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            S
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Sentinel</h1>
            <p className="text-[10px] text-neutral-500 -mt-1">AI SECURITY</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-1">
        <div className="flex items-center gap-3 px-4 py-3 bg-dark-800 rounded-xl text-white">
          <span>🏠</span>
          <span className="font-medium">Dashboard</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-dark-800 rounded-xl text-neutral-400 hover:text-white transition-colors cursor-pointer">
          <span>📹</span>
          <span>Live Cameras</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-dark-800 rounded-xl text-neutral-400 hover:text-white transition-colors cursor-pointer">
          <span>⚠️</span>
          <span>Alerts</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-dark-800 rounded-xl text-neutral-400 hover:text-white transition-colors cursor-pointer">
          <span>📊</span>
          <span>Analytics</span>
        </div>
      </div>

      <div className="p-4 border-t border-dark-700 text-xs text-emerald-500">
        ● 24 Cameras Online
      </div>
    </div>
  );
}