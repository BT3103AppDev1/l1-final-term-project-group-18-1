<template>
  <button @click="handleAuthClick">Continue with Google</button>
</template>

<script>
import { initGoogleAPI } from '@/utils/googleApi';

export default {
  name: 'GoogleLoginButton',
  methods: {
    async handleAuthClick() {
      try {
        await initGoogleAPI();  // Ensure API is initialized
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        if (!GoogleAuth.isSignedIn.get()) {
          await GoogleAuth.signIn();
        }
        this.$emit('authenticated');  // Emit an event on successful authentication
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    }
  }
}
</script>