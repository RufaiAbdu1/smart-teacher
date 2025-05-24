import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chatbot API route
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  console.log('Received question:', question);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
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
    console.error('Error:', error);
    res.json({ answer: 'An error occurred while contacting the chatbot.' });
  }
});

app.listen(PORT, () => {
  console.log(`Smart-Teacher server is running on port ${PORT}`);
});
