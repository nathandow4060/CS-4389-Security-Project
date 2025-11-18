// api/auth/signup.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const backendUrl = `${process.env.VITE_API_URL}/api/auth/signup`;
  const username = process.env.BACKEND_ADMIN_USER;
  const password = process.env.BACKEND_ADMIN_PASS;
  
  // Basic Auth header - matching your working pattern
  const authHeader = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
  
  console.log('Signup request to:', backendUrl);
  console.log('Request body:', req.body);
  
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(req.body),
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `Backend returned status ${response.status}` };
      }
      return res.status(response.status).json(errorData);
    }
    
    const data = await response.json();
    return res.status(201).json(data);
  } catch (err) {
    console.error('Error during signup:', err);
    return res.status(500).json({ 
      message: 'Failed to connect to authentication service',
      error: err.message 
    });
  }
}