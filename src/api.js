const API_BASE_URL =
import.meta.env.VITE_API_URL || "http://localhost:3000"; //use the backend server or do local



//to use this API in a file use: import { *insertCommand* } from "../../api; 
export async function getProducts() {
 //THIS IS EXAMPLE CODE AND HASN"T BEEN TESTETD
  const res = await fetch(`${API_BASE_URL}/products`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
/* Add more commands for the frontend to backendas needed
// Get one product by ID
export async function getProductById(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  return res.json();
}

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
