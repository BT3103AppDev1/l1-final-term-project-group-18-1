<template>
  <button @click="handleAuthClick">Sync with Google Calendar</button>
</template>

<script>
import { initGoogleAPI } from '@/utils/googleApi';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import the needed functions from the auth module
import { doc, setDoc } from 'firebase/firestore'; // Import the needed functions from the firestore module
import { auth, db } from '@/firebaseConfig';

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

        // Get the Firebase user's ID from the authentication state
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          throw new Error('Not authenticated with Firebase.');
        }

        // Assuming the user is now signed in, get the Google user's info
        const googleUser = GoogleAuth.currentUser.get();
        const authResponse = googleUser.getAuthResponse(true);

        // Prepare the data to be stored, checking for undefined refresh token
        const userData = {
          googleAccessToken: authResponse.access_token,
          // Include the refresh token only if it's provided
          ...(authResponse.refresh_token ? { googleRefreshToken: authResponse.refresh_token } : {}),
        };

        // Store the tokens in Firebase Firestore under the user's document
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, userData, { merge: true });

        this.$emit('authenticated'); // Emit an event on successful authentication
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    }
  }
}
</script>