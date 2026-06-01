export default function Topbar() {
  return (
    <header className="h-16 bg-dark-900 border-b border-dark-700 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium text-white">Control Center</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-dark-800 px-4 py-1.5 rounded-full text-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-400">LIVE</span>
        </div>

        <button className="text-xl hover:text-white transition-colors">🛎️</button>
        
        <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-sm font-medium">
          A
        </div>
      </div>
    </header>
  );
}