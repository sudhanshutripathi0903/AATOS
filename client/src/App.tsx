import React, { useState, useEffect, useRef } from 'react';
import './index.css';

interface HistoryItem {
  type: 'user' | 'ai';
  text: string;
}

function App() {
  const [pin, setPin] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isSlidingOut, setIsSlidingOut] = useState<boolean>(false);
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false);
  
  const [command, setCommand] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'ai', text: 'Greetings, Commander. I am AATOS, your orbital intelligence core. Security protocols initialized.' }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streams, setStreams] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const streamTexts = [
      '01001110 01000101 01011000 01010101',
      'import { quantum } from "@aatos/core"',
      'SAT_LINK: ESTABLISHED // LATENCY: 12ms',
      'NASA_API: CONNECTED // ISRO_DATA: SYNCED',
      'AATOS_MODEL: LOADED // ENCRYPTION: ACTIVE',
      'TELEMETRY: NOMINAL // ORBIT: STABLE'
    ];

    const interval = setInterval(() => {
      setStreams(prev => {
        const next = [...prev, streamTexts[Math.floor(Math.random() * streamTexts.length)]];
        if (next.length > 6) next.shift();
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "2005") {
      setIsSlidingOut(true);
      setTimeout(() => setIsUnlocked(true), 600);
    } else {
      alert("❌ ACCESS DENIED: ENCRYPTION KEY MISMATCH");
      setPin('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    if (!isChatStarted) setIsChatStarted(true);

    const userMove: HistoryItem = { type: 'user', text: command };
    setHistory(prev => [...prev, userMove]);
    const currentCmd = command;
    setCommand('');
    setIsLoading(true);

    try {
      const response = await fetch('https://open-claw-backend.onrender.com/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: currentCmd, token: "2005" })
      });
      const data = await response.json();
      setHistory(prev => [...prev, { type: 'ai', text: data.feedback || data.error }]);
    } catch (err: any) {
      setHistory(prev => [...prev, { type: 'ai', text: `System Core Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scanlines relative min-h-screen w-full bg-[#050508] text-gray-200 font-rajdhani overflow-hidden flex flex-col z-10">
      
      {/* 🌌 CSS DYNAMIC COSMIC BACKGROUND */}
      <div className="space-bg-css fixed inset-0 pointer-events-none z-0"></div>

      {/* 🛰️ TELEMETRY STREAMS */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden opacity-20">
        {streams.map((txt, i) => (
          <div 
            key={i} 
            className="absolute font-mono text-[10px] text-cyan-400 whitespace-nowrap"
            style={{ 
              left: `${(i * 18) % 85 + 5}%`, 
              top: `${(i * 25) % 65 + 15}%`,
            }}
          >
            {txt}
          </div>
        ))}
      </div>
      
      {/* 🔐 SECURITY PIN PANEL */}
      {!isUnlocked && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#050508]/95 backdrop-blur-3xl transition-all duration-700 ease-in-out ${isSlidingOut ? 'translate-x-full opacity-0' : 'translate-x-0'}`}>
          <div className="text-center p-8 rounded-2xl border border-cyan-500/20 bg-[#0a0a12] max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="font-orbitron text-xl font-bold tracking-widest text-white mb-2">AATOS CORE LOCK</h2>
            <p className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest mb-6">Enter Authorization Token</p>
            <form onSubmit={handlePinSubmit} className="flex items-center gap-2 border border-cyan-400/30 rounded-xl px-4 py-2 bg-black/40">
              <input 
                type="password" 
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••" 
                className="w-full bg-transparent border-none outline-none text-center font-mono text-2xl tracking-[0.5em] text-cyan-400"
              />
              <button type="submit" className="p-2 text-cyan-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="glass-panel border-b border-cyan-500/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <h1 className="font-orbitron text-xl font-bold tracking-wider text-white">AATOS<span className="text-cyan-400">AI</span></h1>
                  <p className="text-[10px] font-mono text-cyan-400/60 tracking-[0.3em] uppercase hidden sm:block">Orbital Intelligence Terminal</p>
              </div>
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5">
                      <div className="status-dot"></div>
                      <span className="text-xs font-mono text-cyan-400/80">CORE SECURE</span>
                  </div>
              </div>
          </div>
      </header>

      {/* ORBIT RINGS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <div className="orbital-ring w-[280px] h-[280px]" style={{ animationDuration: '25s' }}></div>
          <div className="orbital-ring w-[550px] h-[550px] border-purple-400/10" style={{ animationDuration: '40s', animationDirection: 'reverse' }}></div>
      </div>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex flex-col justify-between max-w-4xl w-full mx-auto p-4 z-10 relative">
        {!isChatStarted && (
          <div className="text-center my-auto py-8">
            <h1 className="font-orbitron text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              AATOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">INTELLIGENCE</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto font-rajdhani">
              Harnessing multi-cluster data streams under elite space agency control node environments.
            </p>
          </div>
        )}

        {isChatStarted && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[60vh] mb-4 mt-2">
            {history.map((item, index) => (
              <div key={index} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`holo-card rounded-xl p-4 max-w-2xl text-base ${item.type === 'user' ? 'border-r-4 border-r-cyan-400 bg-cyan-500/5' : 'border-l-4 border-l-purple-500 bg-purple-500/5'}`}>
                  <p className="text-gray-200 font-rajdhani leading-relaxed whitespace-pre-line">{item.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="holo-card rounded-xl p-4 w-32 flex items-center justify-center">
                  <span className="text-xs font-mono text-cyan-400 animate-pulse">SYNTHESIZING...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* INPUT BOX CONTROL */}
        <div className={`w-full transition-all duration-500 ease-in-out ${!isChatStarted ? 'my-auto max-w-xl mx-auto' : 'mt-auto'}`}>
          <div className="glass-panel border border-cyan-500/20 rounded-2xl p-3 shadow-2xl">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input 
                type="text" 
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Ask anything about the cosmos, code, or operational vectors..." 
                className="flex-1 bg-[#050508]/60 border border-cyan-500/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-400/40 transition-all outline-none"
              />
              <button type="submit" className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
