<template>
  <div class="loading-container">
    Loading...
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { auth, db } from '@/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { getGoogleAuth, initGoogleAPI } from '@/utils/googleApi';

export default {
  setup() {
    const router = useRouter();

    onMounted(async () => {
      if (!auth.currentUser) {
        console.error("No authenticated user found.");
        router.push({ name: 'Login' });
        return;
      }
      const userDocRef = doc(db, 'users', auth.currentUser.uid, 'calendar', auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      const GoogleAuth = getGoogleAuth();

      if (docSnap.exists() && docSnap.data().calendarSynced && GoogleAuth) {
        const googleUser = GoogleAuth.currentUser.get();
        
        if (googleUser && googleUser.getBasicProfile().getEmail() === docSnap.data().userEmail) {
          const accessTokenExpirationTime = docSnap.data().calendar?.accessTokenExpirationTime;
          const now = new Date().getTime();

          if (!accessTokenExpirationTime || accessTokenExpirationTime < now) {
            await signInAgain();
            return;
          }
          router.push({ name: 'Events' });
        }
      } else {
        router.push({ name: 'Calendar' });
      }
    });

    const signInAgain = async () => {
      try {
        await initGoogleAPI();
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        
        if (!GoogleAuth.isSignedIn.get()) {
          await GoogleAuth.signIn({ prompt: 'select_account' });
        }
        
        const googleUser = GoogleAuth.currentUser.get();
        const authResponse = googleUser.getAuthResponse(true);
        const accessToken = authResponse.access_token;
        
        await updateUserAccessToken(accessToken, auth.currentUser.uid);
        router.push({ name: 'Events' });
      } catch (error) {
        console.error('Error during Google sign-in:', error);
      }
    };
    
    const updateUserAccessToken = async (accessToken, userId) => {
      const userAccessTokenDocRef = doc(db, 'users', userId, 'calendar', userId);
      await setDoc(userAccessTokenDocRef, {
        accessToken: accessToken,
        accessTokenExpirationTime: new Date().getTime() + (60 * 60 * 1000)
      }, { merge: true });
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
