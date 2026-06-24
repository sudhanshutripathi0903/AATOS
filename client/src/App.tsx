import React, { useState } from 'react';
import './index.css'; 

interface HistoryItem {
  type: 'user' | 'ai';
  text: string;
}

function App() {
  const [command, setCommand] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'ai', text: '[SYSTEM_CORE]: AATOS Intel Core Engine Active.' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const userMove: HistoryItem = { type: 'user', text: `C:\\USER\\SUDHANSHU> ${command}` };
    setHistory(prev => [...prev, userMove]);
    const currentCmd = command;
    setCommand('');

    try {
      // ✅ Tumhara live backend link yahan perfectly config ho gaya hai:
      const response = await fetch('https://open-claw-backend.onrender.com/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command: currentCmd, 
          token: "2005" // Tumhara secure PIN encryption key
        })
      });
      const data = await response.json();
      
      setHistory(prev => [...prev, { type: 'ai', text: data.feedback || data.error }]);
    } catch (err: any) {
      setHistory(prev => [...prev, { type: 'ai', text: `System Core Error: ${err.message}` }]);
    }
  };

  return (
  return (
    <>
      {/* ISRO Space Motion Graphics Layers */}
      <div className="space-bg"></div>
      <div className="nebula-glow"></div>

      {/* Aapka Pehle Waala Terminal Container */}
      <div className="terminal-container">
        {/* Header */}
        <div className="terminal-header">
          <span className="terminal-title">AATOS CORE TERMINAL v2.6</span>
          <div className="status-dot"></div>
        </div>
        
        {/* ... baaki saara code bilkul same rahega ... */}

export default App;
