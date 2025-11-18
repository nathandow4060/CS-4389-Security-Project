const API_BASE = '/api';

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

export async function getProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch product with ID ${id}: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}


// Login and Signup Frontend Helper

export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function signup(username, email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
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
