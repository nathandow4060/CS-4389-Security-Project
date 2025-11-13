export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const backendUrl = `${process.env.VITE_API_URL}/purchase`;
  const username = process.env.BACKEND_ADMIN_USER;
  const password = process.env.BACKEND_ADMIN_PASS;

  // Basic Auth header
  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: req.body, // forward raw body
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    console.error("Error forwarding purchase:", err);
    return res.status(500).json({ error: "Failed to complete purchase" });
  }
}