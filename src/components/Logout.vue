<template>
  <button @click="logout" v-if="user">Logout</button>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { getGoogleAuth } from "@/utils/googleApi";  // Import getGoogleAuth

export default {
  name: 'Logout',
  data() {
    return {
      user: null,
    };
  },

  mounted() {
    const auth = getAuth();
    this.user = auth.currentUser;
  },

  methods: {
    async logout() {
      const auth = getAuth();
      try {
        const GoogleAuth = getGoogleAuth(); // Get Google Auth instance
        if (GoogleAuth && GoogleAuth.isSignedIn.get()) {
          await GoogleAuth.signOut();  // Sign out from Google
        }
        await signOut(auth);  // Sign out from Firebase
        this.$router.push({name: 'Login'});
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    }
  }
};
</script>
