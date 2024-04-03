const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config(); // if you're using dotenv to manage environment variables

const app = express();
app.use(bodyParser.json());

const googleClientId = process.env.VUE_APP_GOOGLE_CLIENT_ID; // Make sure to set this in your .env file
const googleClientSecret = process.env.VUE_APP_GOOGLE_CLIENT_SECRET; // Make sure to set this in your .env file
const googleRedirectUri = process.env.VUE_APP_GOOGLE_REDIRECT_URI; // Make sure to set this in your .env file

app.post('/auth/token', async (req, res) => {
  const { code } = req.body;

  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://oauth2.googleapis.com/token',
      data: {
        code: code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.json(tokenResponse.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
