// netlify/functions/gemini.js

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { model, payload } = JSON.parse(event.body);
  const apiKey = process.env.GEMINI_API_KEY; // Get the key from environment variables

  if (!apiKey) {
    return { statusCode: 500, body: "API key not configured." };
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error:", errorBody);
      return {
        statusCode: response.status,
        body: `API call failed: ${errorBody}`,
      };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Serverless function error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
