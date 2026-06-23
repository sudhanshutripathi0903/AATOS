import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';
import cors from 'cors'; // <-- Yeh naya guard hai

dotenv.config();

const app = express();

// CORS ko fully allow kar do taaki Vercel se request aa sake
app.use(cors({
  origin: '*', // Isse har jagah se secure access allow ho jayega
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const port = process.env.PORT || 5000;

// Database Connection Setup
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test Endpoint: Check system online status
app.get('/api/status', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({ status: "ONLINE", database: "CONNECTED", timestamp: dbCheck.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "DEGRADED", error: err.message });
  }
});

// Core Endpoint: Execute and log hacker instructions
app.post('/api/execute', async (req, res) => {
  const { command, token } = req.body;

  // Security Verification
  if (!token || token !== process.env.AGENT_SECRET_TOKEN) {
    return res.status(403).json({ error: "❌ ACCESS DENIED: INVALID ENCRYPTION KEY" });
  }

  try {
    const queryText = 'INSERT INTO logs(command, executed_at) VALUES($1, NOW()) RETURNING *';
    await pool.query(queryText, [command]);

    res.json({ 
      feedback: `[SECURE_NODE]: Payload '${command}' processed & permanently logged in database.` 
    });
  } catch (err) {
    res.status(500).json({ error: "Database Logging Failed", details: err.message });
  }
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        command TEXT NOT NULL,
        executed_at TIMESTAMP NOT NULL
      );
    `);
    console.log("🗄️ PostgreSQL Logs Table Initialized Successfully.");
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
  }
};

app.listen(port, '0.0.0.0', async () => {
  await initDb();
  console.log(`🤖 Main Agent Core Server listening at http://0.0.0.0:${port}`);
});