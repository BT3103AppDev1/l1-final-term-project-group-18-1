<template>
  <div class="loading-container">
    Loading...
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { getGoogleAuth, initGoogleAPI } from '@/utils/googleApi';

export default {
  setup() {
    const router = useRouter();

    onMounted(async () => {
      console.log(new Date().getTime())
      const user = auth.currentUser;
      // Calendar collections within individual users document
      console.log(user)
      const userDocRef = doc(db, 'users', user.uid, 'calendar', user.uid);
      const docSnap = await getDoc(userDocRef);
      const GoogleAuth = getGoogleAuth();

      if (GoogleAuth && docSnap.exists() && docSnap.data().calendarSynced) {
        const googleUser = GoogleAuth.currentUser.get();
        if (googleUser.getBasicProfile().getEmail() == docSnap.data().userEmail) {

          // Check if access token needs refreshing
          const accessTokenExpirationTime = docSnap.data().calendar.accessTokenExpirationTime;
          const now = new Date().getTime();
          if (!accessTokenExpirationTime || accessTokenExpirationTime < now) {
            // Access token has expired or not set, redirect to sign-in
            await signInAgain();
            return;
          }
          // Access token is still valid, proceed to events page
          router.push({ name: 'Events' });
      } 
    } else {
        // User has not synced, redirect to sync page
        router.push({ name: 'Calendar' });
      }
    });
    
    const signInAgain = async () => {
      try {
        await initGoogleAPI(); // Ensure Google API is initialized
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        
        if (!GoogleAuth.isSignedIn.get()) {
          await GoogleAuth.signIn({
            prompt: 'select_account'
          });
        }
        
        // After sign-in, update access token and expiration time in Firestore
        const googleUser = GoogleAuth.currentUser.get();
        const authResponse = googleUser.getAuthResponse(true);
        const accessToken = authResponse.access_token;
        
        // Update access token and expiration time in Firestore
        await updateUserAccessToken(accessToken, auth.currentUser.uid);
        
        // Redirect to events page
        router.push({ name: 'Events' });
      } catch (error) {
        console.error('Error during Google sign-in:', error);
      }
    };
    
    const updateUserAccessToken = async (accessToken, userId) => {
      // Update access token and expiration time in Firestore
      const updateUserAccessToken = async (accessToken, userId) => {
      // Update access token and expiration time in Firestore
      await setDoc(doc(db, 'users', userId, 'calendar', userId), {
        calendar: {
          accessToken: accessToken,
          accessTokenExpirationTime: new Date().getTime() + (60 * 60 * 1000) // Set expiration time to 1 hour from now
        }
      }, { merge: true });
      };
    };
  }
};
</script>

<style>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  font-weight: bold;
}
</style>
