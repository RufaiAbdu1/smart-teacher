const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  console.log("Received question:", question);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: question
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Full OpenRouter response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.json({ answer: "Sorry, the AI did not return a valid response." });
    }

    const answer = data.choices[0].message.content;
    console.log("AI reply:", answer);
    res.json({ answer });

  } catch (error) {
    console.error("Error contacting OpenRouter:", error);
    res.json({ answer: "An error occurred while contacting the AI service." });
  }
});

app.listen(PORT, () => {
  console.log(`Smart-Teacher server is running on port ${PORT}`);
});
