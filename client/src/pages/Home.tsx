import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const [logs, setLogs] = useState<Array<{ text: string; type: "user" | "system" | "warning"; isCode?: boolean }>>([]);
  const [command, setCommand] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [showAuthPanel, setShowAuthPanel] = useState(true); // Isko BYPASS ke liye pehle se khula rakh rahe hain
  const [isProcessing, setIsProcessing] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("agent_key");
    if (savedKey) {
      setAuthKey(savedKey);
    } else {
      setLogs([{ text: "⚠️ CRITICAL ERR: DECRYPTION KEY MISSING. ACCESS DENIED.", type: "warning" }]);
    }
  }, []);

  useEffect(() => {
    const bootLines = [
      "INITIALIZING CORES...",
      "ESTABLISHING SECURE TUNNEL...",
      "CONNECTING TO CLOUD NODE...",
      "DECRYPTING SYSTEM PROTOCOLS...",
      "AGENT ACTIVE AND STANDING BY.",
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < bootLines.length) {
        setLogs((prev) => [...prev, { text: bootLines[index], type: "system" }]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.random() * 128);
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [logs]);

  const handleAuthKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setAuthKey(newKey);
    localStorage.setItem("agent_key", newKey);
  };

  const handleExecute = async () => {
    if (!command.trim()) return;
    setLogs((prev) => [...prev, { text: `HUMAN>>; ${command}`, type: "user" }]);
    const currentCmd = command;
    setCommand("");
    setIsProcessing(true);

    try {
     const response = await fetch('https://open-claw-backend.onrender.com/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: currentCmd, token: authKey })
      });
      const data = await response.json();
      
      if (response.ok) {
        setLogs((prev) => [...prev, { text: data.feedback, type: "system" }]);
      } else {
        setLogs((prev) => [...prev, { text: data.error, type: "warning" }]);
      }
    } catch (error) {
      setLogs((prev) => [...prev, { text: "⚠️ CONNECTION FAILED: Server offline.", type: "warning" }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', color: '#00ff66', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', zIndex: 9999 }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }} />
      
      {/* Top Header */}
      <div style={{ padding: '10px', borderBottom: '1px solid #00ff66', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'between', fontSize: '12px', fontWeight: 'bold' }}>
        <div>[SYSTEM://CREATIVE_HUMAN_AGNT_v2.6]</div>
        <div style={{ marginLeft: 'auto' }}>[SYS_STATUS: ONLINE]</div>
      </div>

      {/* Password Key Box (Ab ekdum hidden aur secure) */}
<div style={{ padding: '10px', borderBottom: '1px solid #00ff66', background: '#050508' }}>
  <span style={{ fontSize: '11px' }}>[ENTER AUTH KEY]: </span>
  <input 
    type="password" 
    value={authKey} 
    onChange={handleAuthKeyChange} 
    placeholder="ENTER SECRET TOKEN..." 
    style={{ background: 'black', border: '1px solid #00ff66', backgroundColor: 'black', color: '#00ff66', fontSize: '11px', padding: '2px 5px', width: '70%', outline: 'none' }} 
  />
</div>

      {/* Terminal Logs View */}
      <div ref={streamRef} style={{ flex: 1, overflowY: 'auto', padding: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {logs.map((log, idx) => (
          <div key={idx} style={{ color: log.type === 'user' ? '#00ffe0' : log.type === 'warning' ? '#ff0033' : '#00ff66' }}>
            {log.text}
          </div>
        ))}
      </div>

      {/* Bottom Command Box */}
      <div style={{ padding: '10px', borderTop: '1px solid #00ff66', background: 'rgba(0,0,0,0.9)', display: 'flex', gap: '5px' }}>
        <span style={{ fontWeight: 'bold' }}>&gt;</span>
        <input 
          type="text" 
          value={command} 
          onChange={(e) => setCommand(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleExecute()} 
          placeholder="TYPE COMMAND HERE..." 
          style={{ flex: 1, background: 'transparent', border: 'none', color: '#00ff66', outline: 'none', fontSize: '12px' }} 
        />
        <button onClick={handleExecute} style={{ background: 'transparent', border: '1px solid #00ff66', color: '#00ff66', padding: '2px 10px', fontSize: '11px', cursor: 'pointer' }}>
          [EXECUTE]
        </button>
      </div>
    </div>
  );
}