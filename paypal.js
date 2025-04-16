const express = require('express');
const app = express();
const PORT = 3000;
const axios = require('axios');

app.use(express.json());

const clientId = 'ATb_XD7vE3RRo6EB8cEUxrtXy2JSnuJda0hVuRxJAc6tbxTpd4wQoRc9fgLxNzohrF6TBlRdzHVHy5Ye';
const clientSecret = 'EGsC1eMUI1RqI524GvQKvxsWz13zJgS6BABaFPZ-0mQmQZA1G4rjpbOcXUIrNrhoZvk1Zs1stapwOOkG';
async function getAccessToken() {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      auth: {
        username: clientId,
        password: clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials',
    });

    console.log('🔑 Got access token');
    return response.data.access_token;
  } catch (err) {
    console.error('❌ Error getting access token:', err.response?.data || err.message);
    throw err;
  }
}


// 📦 Handle tracking data and send to PayPal
app.post('/receive-tracking', async (req, res) => {
  console.log('📦 Fulfillment server received tracking info:');
  console.log(req.body);

  try {
    const accessToken = await getAccessToken();

    // Example: Send tracking info to PayPal's tracking API
    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/shipping/trackers-batch',
      req.body, // assuming this is shaped correctly
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    console.log('📬 Sent tracking to PayPal:', response.data);
    res.send({ message: 'Tracking info sent to PayPal ✅', data: response.data });

  } catch (err) {
    console.error('❌ Error sending tracking to PayPal:', err.response?.data || err.message);
    res.status(500).send({ error: 'Failed to send tracking to PayPal' });
  }
});

app.listen(PORT, () => {
  console.log(`🚚 Fulfillment server running at http://localhost:${PORT}`);
});
