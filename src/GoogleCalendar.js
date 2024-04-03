import axios from 'axios';

const clientId = import.meta.env.VUE_APP_GOOGLE_CLIENT_ID;
const apiKey = import.meta.env.VUE_APP_GOOGLE_API_KEY;
const redirectUri = 'http://localhost:5173/SyncedCalendar'; // Replace with your actual redirect URI

class GoogleCalendar {
  static getAuthUrl() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: redirectUri,
      client_id: clientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/calendar.events',
      ].join(' '),
    };
    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
  }

  // In GoogleCalendar.js
    static async fetchTokens(code) {
    const url = 'http://localhost:3000/auth/token'; // Backend endpoint
    try {
      const response = await axios.post(url, { code }); // Send only the code
      return response.data; // The backend handles the exchange
    } catch (error) {
      console.error('Error fetching tokens', error);
      throw error; // Rethrow the error to be caught by the calling function
    }
  }
  
}

export default GoogleCalendar;
