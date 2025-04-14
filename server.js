const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const apiKey = process.env.OPENROUTER_API_KEY;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3-haiku', // Adjust to desired model
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        const data = await response.json();

        const botReply = data.choices?.[0]?.message?.content || "⚠️ Bot didn't respond.";
        res.json({ reply: botReply });

    } catch (err) {
        console.error('🔥 Error talking to OpenRouter:', err);
        res.status(500).json({ reply: "⚠️ Server error while contacting OpenRouter." });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
