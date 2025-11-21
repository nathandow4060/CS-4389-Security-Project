// api/purchase.js - FIXED to forward user JWT token
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const backendUrl = `${process.env.VITE_API_URL}/api/purchase`;
  const username = process.env.BACKEND_ADMIN_USER;
  const password = process.env.BACKEND_ADMIN_PASS;
  
  // Basic auth for backend access
  const basicAuth = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
  
  // Get user's JWT token from request
  const userToken = req.headers.authorization;
  
  if (!userToken) {
    return res.status(401).json({ error: "Authentication required. Please log in." });
  }

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Authorization": userToken,  // Forward user's JWT token (Bearer token)
        "Content-Type": "application/json",
        "X-Admin-Auth": basicAuth,   // Send admin auth as custom header if needed
      },
      body: JSON.stringify(req.body),
    });

    if (response.status === 204) {
      return res.status(204).end();
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error("Error forwarding purchase:", err);
    return res.status(500).json({ error: "Failed to complete purchase" });
  }
}