require('dotenv').config()
const express = require('express');
const cors= require('cors');
const {GoogleGenAI} = require('@google/genai');

const app=express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    const reply =
      result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ reply });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "AI response failed" });
  }
});


app.listen(5000, ()=>{
    console.log("Server is running on port 5000");
});



// const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// main();