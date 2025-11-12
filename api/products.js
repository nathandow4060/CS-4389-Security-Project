export default async function handler(req, res) {
  const backendUrl = "https://gamevault-backend-a1ce.onrender.com/products";

  const username = "admin"; // your backend username
  const password = "S3BAuALH3bk3hsokEtXugVy86cSDHEkk"; // your backend password

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
