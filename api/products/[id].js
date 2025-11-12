// api/products/[id].js
export default async function handler(req, res) {
  const { id } = req.query;
  const backendUrl = `https://gamevault-backend-a1ce.onrender.com/products/${id}`;

  const username = "admin";
  const password = "S3BAuALH3bk3hsokEtXugVy86cSDHEkk";
  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(backendUrl, {
      headers: { Authorization: authHeader }
    });

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ data }); // wrap in `data` to match api.js expectation
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).send("Failed to fetch product");
  }
}
