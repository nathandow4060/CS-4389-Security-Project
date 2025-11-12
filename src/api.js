const API_BASE = import.meta.env.VITE_API_URL

export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Use backend endpoint /products/:id
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch product with ID ${id}: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || null; // assuming backend responds with { data: { ...product } }
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}



/*
// -------------------- AUTH --------------------
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid login");
  return res.json();
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

// -------------------- CART --------------------
export async function addToCart(productId, quantity) {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}
*/
