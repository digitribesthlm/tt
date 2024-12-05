const shopifyFetch = async (endpoint, options = {}) => {
  if (!process.env.SHOPIFY_URL) {
    throw new Error('SHOPIFY_URL is not defined in environment variables');
  }

  const url = process.env.SHOPIFY_URL;
  const [credentials] = url.match(/https:\/\/(.*?)@/)[1].split('@');
  const baseUrl = url.replace(/https:\/\/.*?@/, 'https://');
  
  try {
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(credentials).toString('base64')}`
      }
    };

    // Only add body for PUT/POST requests
    if (options.body && ['PUT', 'POST'].includes(requestOptions.method)) {
      requestOptions.body = options.body;
    }

    console.log('Shopify request:', {
      url: `${baseUrl}${endpoint}`,
      method: requestOptions.method,
      body: requestOptions.body
    });

    const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
    
    let data;
    const textResponse = await response.text();
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      console.error('Failed to parse JSON response:', textResponse);
      throw new Error(`Invalid JSON response: ${textResponse}`);
    }

    if (!response.ok) {
      console.error('Shopify API error response:', data);
      const error = new Error(`Shopify API error: ${response.statusText}`);
      error.response = data;
      error.status = response.status;
      throw error;
    }

    // Get pagination info from Link header
    const linkHeader = response.headers.get('Link');
    let nextPageUrl = null;

    if (linkHeader) {
      const links = linkHeader.split(',');
      const nextLink = links.find(link => link.includes('rel="next"'));
      if (nextLink) {
        const match = nextLink.match(/\<([^>]+)\>/);
        if (match) {
          const fullUrl = match[1];
          // Extract just the path and query parameters
          const urlObj = new URL(fullUrl);
          nextPageUrl = urlObj.pathname.replace('/admin/api/2023-01/', '') + urlObj.search;
        }
      }
    }

    return {
      data,
      headers: response.headers,
      nextPage: nextPageUrl
    };
  } catch (error) {
    console.error('Shopify fetch error:', {
      message: error.message,
      status: error.status,
      response: error.response
    });
    throw error;
  }
};

export { shopifyFetch };