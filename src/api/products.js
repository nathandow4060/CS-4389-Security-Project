import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // Backend URL
    const BACKEND_URL = "https://gamevault-backend-a1ce.onrender.com/products";

    // Admin credentials (use environment variables in Vercel)
    const ADMIN_USER = process.env.BACKEND_ADMIN_USER;
    const ADMIN_PASS = process.env.BACKEND_ADMIN_PASS;

    // Fetch from backend with Basic Auth
    const response = await fetch(BACKEND_URL, {
      headers: {
        "Authorization": "Basic " + Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString("base64")
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.status(200).json(data); // send JSON to frontend
  } catch (err) {
    console.error("Proxy fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
