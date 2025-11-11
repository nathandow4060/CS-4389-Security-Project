// src/api.js

const API_BASE = "/api"; // base path to your Vercel serverless functions

/**
 * Fetch all products
 * @returns {Promise<Array>} array of products
 */
export async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch products from backend:", err);
    return [];
  }
}

/**
 * Fetch a single product by ID
 * @param {number|string} id - product ID
 * @returns {Promise<Object|null>} product object or null if not found
 */
export async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_BASE}/products?id=${id}`);
    if (!response.ok) throw new Error(`Failed to fetch product with id ${id}`);
    const data = await response.json();

    // If backend returns array for lookup, find the product
    if (Array.isArray(data)) {
      return data.find((p) => String(p.id) === String(id)) || null;
    }

    return data || null;
  } catch (err) {
    console.error(`Failed to fetch product by ID: ${id}`, err);
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
