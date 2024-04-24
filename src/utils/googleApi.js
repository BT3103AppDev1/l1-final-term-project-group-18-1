import { loadGapiInsideDOM } from 'gapi-script';

const clientId = '418474568916-0mrtl2ahl7imqkh2ndph6mht98eto6v1.apps.googleusercontent.com';
const apiKey = 'AIzaSyBct-xjhUx_cOyrGbk4XGrKpu3dIgNhW4E';
const scope = 'https://www.googleapis.com/auth/calendar';

let googleAuthInstance = null;

export async function initGoogleAPI() {
    await loadGapiInsideDOM();
    return new Promise((resolve, reject) => {
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
              apiKey: 'AIzaSyBct-xjhUx_cOyrGbk4XGrKpu3dIgNhW4E',
              clientId: '418474568916-0mrtl2ahl7imqkh2ndph6mht98eto6v1.apps.googleusercontent.com',
              discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
              scope: 'https://www.googleapis.com/auth/calendar'
            }).then(() => {
                googleAuthInstance = window.gapi.auth2.getAuthInstance();
                resolve(window.gapi);
            }).catch(error => {
                reject(error);
            });
        });
    });
}

export async function signInToGoogle() {
    await loadGapiInsideDOM();
  
    return new Promise((resolve, reject) => {
      window.gapi.load('auth2', async () => {
        try {
          const auth2 = await window.gapi.auth2.init({
            client_id: clientId,
            scope: scope
          });
  
          const GoogleUser = await auth2.signIn();
  
          const authResponse = GoogleUser.getAuthResponse();
          const accessToken = authResponse.access_token;
  
          resolve({ accessToken });
        } catch (error) {
          reject(error);
        }
      });
    });
}

export function getGoogleAuth() {
    return googleAuthInstance;
}
