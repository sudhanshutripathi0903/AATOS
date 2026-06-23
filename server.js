// server.js ke 'execute' endpoint ko isse badlo:
app.post('/api/execute', async (req, res) => {
  const { command, token } = req.body;

  if (!token || token !== process.env.AGENT_SECRET_TOKEN) {
    return res.status(403).json({ error: "❌ ACCESS DENIED: INVALID ENCRYPTION KEY" });
  }

  try {
    // 1. Storage clean-up
    await pool.query("DELETE FROM logs WHERE executed_at < NOW() - INTERVAL '7 days'");

    // 2. Correct Gemini AI Syntax
    const systemInstruction = `
      You are the core intelligence of the OpenClaw Agent Terminal (v2.6).
      The user is HUMAN_BOSS. 
      
      RULES:
      1. For normal text: Keep it short, technical, and in hacker terminal style.
      2. For CODE or structured text (like letters/notes): Break lines properly with paragraphs/indentation so it is highly readable. Do not dump text in one single line.
    `;

    // Sahi SDK configuration syntax
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: command,
      config: {
        systemInstruction: systemInstruction,
        // Taaki text clean format mein aaye
        responseMimeType: "text/plain" 
      }
    });

    const aiFeedback = aiResponse.text || "[SECURE_NODE]: Empty output from core node.";

    // 3. Database mein log karo
    const queryText = 'INSERT INTO logs(command, executed_at) VALUES($1, NOW()) RETURNING *';
    await pool.query(queryText, [`User: ${command} | AI: ${aiFeedback}`]);

    // Response wapas bhejo
    res.json({ feedback: aiFeedback });

  } catch (err) {
    console.error("Backend Error:", err);
    // Isse exact error message frontend par dikhega agar koi dikkat hui toh
    res.status(500).json({ error: `System Core Error: ${err.message}` });
  }
});