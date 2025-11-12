// api/products/[id].js
export default async function handler(req, res) {
    const { id } = req.query;

    // Log the ID being fetched
    console.log("Fetching product with ID:", id);

    // Use environment variables
    const backendUrl = `${process.env.VITE_API_URL}/products/${id}`;
    const username = process.env.BACKEND_ADMIN_USER;
    const password = process.env.BACKEND_ADMIN_PASS;
    const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

    try {
        const response = await fetch(backendUrl, {
            headers: { Authorization: authHeader }
        });

        if (!response.ok) {
            return res.status(response.status).send(`Backend returned status ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json({ data }); // wrap in `data` to match api.js
    } catch (err) {
        console.error("Error fetching product by ID:", err);
        res.status(500).send("Failed to fetch product");
    }
}

