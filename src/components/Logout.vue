<template>
  <button @click="logout" v-if="user">Logout</button>
</template>

<script>
import { getAuth } from "firebase/auth";

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
        this.$router.push({name: 'Login'});
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    }
  }
};
</script>
