 apiauthsignup.js
export default async function handler(req, res) {
   Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message 'Method not allowed' });
  }

  const backendUrl = `${process.env.VITE_API_URL}authsignup`;
  
  try {
    const response = await fetch(backendUrl, {
      method 'POST',
      headers {
        'Content-Type' 'applicationjson',
      },
      body JSON.stringify(req.body),
    });
    
    if (!response.ok) {
       Forward the error response from backend
      const errorData = await response.json().catch(() = ({ 
        message `Backend returned status ${response.status}` 
      }));
      return res.status(response.status).json(errorData);
    }
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error during signup', err);
    res.status(500).json({ 
      message 'Failed to connect to authentication service',
      error err.message 
    });
  }
}