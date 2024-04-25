<template>
  <button @click="logout" v-if="isAuthenticated">Logout</button>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  name: 'Logout',

  data() {
    return {
      isAuthenticated: false,
    };
  },

  mounted() {
    const auth = getAuth();
    auth.onAuthStateChanged(user => {
      this.isAuthenticated = !!user;
    });
  },

  methods: {
    async logout() {
      const auth = getAuth();
      try {
        await signOut(auth);
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    }
  }
};
</script>
