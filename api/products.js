export default async function handler(req, res) {
  const backendUrl = `${process.env.VITE_API_URL}/products`;

  const username = process.env.BACKEND_ADMIN_USER;
  const password = process.env.BACKEND_ADMIN_PASS;
  // Basic Auth header
  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(backendUrl, {
      headers: {
        "Authorization": authHeader
      }
    });

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Failed to fetch products");
  }
}
