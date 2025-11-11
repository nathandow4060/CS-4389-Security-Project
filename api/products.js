import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const BACKEND_URL = "https://gamevault-backend-a1ce.onrender.com/products";
    const ADMIN_USER = process.env.BACKEND_ADMIN_USER;
    const ADMIN_PASS = process.env.BACKEND_ADMIN_PASS;

    if (!ADMIN_USER || !ADMIN_PASS) {
      console.error("Missing admin credentials!");
      return res.status(500).send("Server misconfigured: missing credentials");
    }

    const response = await fetch(BACKEND_URL, {
      headers: {
        "Authorization": "Basic " + Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString("base64"),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend returned non-OK status:", response.status, text);
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Proxy fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch products", details: err.message });
  }
}
