export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const webhookUrl = 'https://webhook-881347689916.europe-west3.run.app/?api_key=w4343432434';
    const response = await fetch(webhookUrl);
    const data = await response.text();
    
    console.log('Webhook response:', data);
    
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
