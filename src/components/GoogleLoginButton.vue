<template>
  <button @click="handleAuthClick">Sync with Google Calendar</button>
</template>

<script>
import { initGoogleAPI } from '@/utils/googleApi';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default {
  name: 'GoogleLoginButton',
  methods: {
    async handleAuthClick() {
      try {
        await initGoogleAPI(); // Ensure API is initialized
        const GoogleAuth = window.gapi.auth2.getAuthInstance();

        if (!GoogleAuth.isSignedIn.get()) {
          await GoogleAuth.signIn({
            prompt: 'select_account'
          });
        }

        // Get the Firebase user's info
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          throw new Error('Not authenticated with Firebase.');
        }

        // Get the Google user's info
        const googleUser = GoogleAuth.currentUser.get();
        const authResponse = googleUser.getAuthResponse(true);

        // Check if userEmail exists and is valid
        const userEmail = googleUser.getBasicProfile().getEmail();
        if (!userEmail) {
          throw new Error('User email is undefined or invalid.');
        }

        // Prepare the data to be stored
        const userData = {
          userEmail: userEmail,
          calendarSynced: true,
          accessToken: authResponse.access_token,
          accessTokenExpirationTime: new Date().getTime() + (60 * 60 * 1000), 
          // Include the refresh token only if it's provided
          ...(authResponse.refresh_token ? { googleRefreshToken: authResponse.refresh_token } : {}),
        };

        // Store the tokens in Firebase Firestore under the user's document
        const userRef = doc(db, 'users', firebaseUser.uid, 'calendar', firebaseUser.uid);
        await setDoc(userRef, userData, { merge: true });

        this.$emit('authenticated'); // Emit an event on successful authentication
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    }
  }
}
</script>
