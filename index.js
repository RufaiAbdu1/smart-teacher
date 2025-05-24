import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Handle file paths in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chat API route
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  console.log('Received question:', question);
console.log('OPENROUTER_API_KEY value:', process.env.OPENROUTER_API_KEY ? '[HIDDEN]' : 'MISSING');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful Smart-Teacher assistant for answering biology and chemistry questions." },
          { role: "user", content: question }
        ]
      })
    });

    const result = await response.json();
    console.log('OpenRouter response:', result);

    if (result.choices && result.choices.length > 0) {
      const answer = result.choices[0].message.content.trim();
      res.json({ answer });
    } else {
      res.json({ answer: 'No answer received from AI.' });
    }
  } catch (error) {
    console.error('Error contacting OpenRouter:', error);
    res.json({ answer: 'An error occurred while contacting the chatbot.' });
  }
});

// Fallback route for SPA (single page app)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Smart-Teacher server is running on port ${PORT}`);
});
