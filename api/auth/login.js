// api/auth/login.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const backendUrl = process.env.VITE_API_URL + '/api/auth/login';
  
  console.log('Login request to:', backendUrl);
  
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      // Forward the error response from backend
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Backend returned status ' + response.status };
      }
      return res.status(response.status).json(errorData);
    }
    
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ 
      message: 'Failed to connect to authentication service',
      error: err.message 
    });
  }
}