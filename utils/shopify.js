const shopifyFetch = async (endpoint) => {
  if (!process.env.SHOPIFY_URL) {
    throw new Error('SHOPIFY_URL is not defined in environment variables');
  }

  const url = process.env.SHOPIFY_URL;
  const [credentials] = url.match(/https:\/\/(.*?)@/)[1].split('@');
  const baseUrl = url.replace(/https:\/\/.*?@/, 'https://');
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(credentials).toString('base64')}`
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

export { shopifyFetch }; 