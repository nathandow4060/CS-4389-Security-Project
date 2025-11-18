export default async function handler(req, res) {
  const backendUrl = `${process.env.VITE_API_URL}/api/user/profile`;
  
  // Get user token from request headers
  const userToken = req.headers.authorization;
  
  if (!userToken) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const headers = {
      "Authorization": userToken, // Forward user's JWT token
      "Content-Type": "application/json",
    };

    // For GET requests
    if (req.method === "GET") {
      const response = await fetch(backendUrl, {
        method: "GET",
        headers,
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }
    
    // For PUT requests (update profile)
    if (req.method === "PUT") {
      const response = await fetch(backendUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("Error forwarding profile request:", err);
    return res.status(500).json({ error: "Failed to process profile request" });
  }
}