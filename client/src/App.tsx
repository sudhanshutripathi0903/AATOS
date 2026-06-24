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
      // YAHAN APNA RENDER KA ASLI URL DAALNA AGAR YAAD HO
      const response = await fetch('https://YOUR-RENDER-BACKEND-URL.onrender.com/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          command: currentCmd, 
          token: "2005" // Tumhara secure PIN encryption key [cite: 16, 19, 20]
        })
      });
      const data = await response.json();
      
      setHistory(prev => [...prev, { type: 'ai', text: data.feedback || data.error }]);
    } catch (err: any) {
      setHistory(prev => [...prev, { type: 'ai', text: `System Core Error: ${err.message}` }]);
    }
  };

  return (
    <div className="terminal-container">
      {/* Header */}
      <div className="terminal-header">
        <span className="terminal-title">AATOS CORE TERMINAL v2.6</span>
        <div className="status-dot"></div>
      </div>

      {/* Main Terminal Output Screens */}
      <div className="terminal-output">
        {history.map((item, index) => (
          <div key={index} className={item.type === 'user' ? 'user-command' : 'ai-response'}>
            {item.text}
          </div>
        ))}
      </div>

      {/* Bottom Input Area */}
      <form onSubmit={handleSubmit} className="terminal-input-form">
        <span style={{ color: '#00f2fe', marginRight: '10px', fontFamily: 'Fira Code, monospace' }}>&gt;</span>
        <input 
          type="text" 
          className="terminal-input"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter operational directive..."
          autoFocus
        />
        <button type="submit" className="terminal-button">Execute</button>
      </form>
    </div>
  );
}

export default App;
