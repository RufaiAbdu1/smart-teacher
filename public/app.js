import React, { useState } from 'react';

export default function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function askQuestion() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.error || 'Error getting answer');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h1>Smart-Teacher Chatbot</h1>
      <textarea
        rows="3"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '100%', fontSize: 16 }}
      />
      <button onClick={askQuestion} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? 'Asking...' : 'Ask'}
      </button>
      {answer && (
        <div style={{ marginTop: 20, whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: 10 }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
