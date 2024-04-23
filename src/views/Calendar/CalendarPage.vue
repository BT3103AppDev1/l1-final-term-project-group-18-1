<template>
  <div>
    <h1 class = "main-title">Sync your Google Calendar with Eco Harbour</h1>
    <h3 class = "description">Unlock a seamless integration of eco-friendly reminders to encourage sustainable living in your daily activities.</h3>
    <GoogleLoginButton @authenticated="handleAuthentication"/>
  </div>
</template>

<script>
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc , getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import GoogleLoginButton from '@/components/GoogleLoginButton.vue';

export default {
  name: 'CalendarPage',
  components: {
    GoogleLoginButton
  },
  setup() {
    const router = useRouter();

    const handleAuthentication = async () => {
      // This function is called after Google authentication is successful
      const user = auth.currentUser;
      if (user) {
        // Set the calendarSynced flag in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { calendarSynced: true }, { merge: true });

        // Redirect to Events page
        router.push({ name: 'Events' });
      }
    };

    return { handleAuthentication };
  },
};
</script>

<style>
.main-title,
.subtitle {
  font-weight: bold; 
}

.main-title {
  font-size: 2rem;
  color: #457247;
}

.description {
  font-size: 1rem;
  color: #666666;
  max-width: 1000px;
  margin: 1em auto; 
}
</style>