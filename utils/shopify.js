const shopifyFetch = async (endpoint, options = {}) => {
  if (!process.env.SHOPIFY_URL) {
    throw new Error('SHOPIFY_URL is not defined in environment variables');
  }

  const url = process.env.SHOPIFY_URL;
  const [credentials] = url.match(/https:\/\/(.*?)@/)[1].split('@');
  const baseUrl = url.replace(/https:\/\/.*?@/, 'https://');
  
  try {
    console.log('Shopify request:', {
      url: `${baseUrl}${endpoint}`,
      method: options.method || 'GET',
      body: options.body
    });

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(credentials).toString('base64')}`
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Shopify API error response:', data);
      const error = new Error(`Shopify API error: ${response.statusText}`);
      error.response = data;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Shopify fetch error:', {
      message: error.message,
      status: error.status,
      response: error.response
    });
    throw error;
  }
}

export { shopifyFetch };