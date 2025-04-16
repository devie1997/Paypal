const axios = require('axios');

// Replace with your real sandbox credentials
const clientId = 'AZujXTewsePsbnFAyo3ccXSIlXvmoIb4ffGyB4HRkk1ZpEYMvNVr_2QQdtI5LuDzoek9z13R2mGsxY4L';
const clientSecret = 'EEG5oDJ2zQCQ3AqT2CwIZ3iwVnseYgW4OpvrYlcR_5tsbn6IMo8PS7DQDkWWmPpk_z5kIh5USOKqwJp0';

async function getAccessToken() {
  const response = await axios({
    method: 'post',
    url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  });

  return response.data.access_token;
}

getAccessToken()
  .then(token => {
    console.log('Access Token:', token);
  })
  .catch(err => {
    console.error('Error getting token:', err.response?.data || err.message);
  });