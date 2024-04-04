<template>
    <button id="btn" @click="logout()" v-if="user">Logout</button>
</template>

<script>
import '@/firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {
  name: 'Logout',

  data() {
    return {
      user: false,
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
      }
    });
  },

  methods: {
    logout() {
      const auth = getAuth();
      const user = auth.currentUser;
      signOut(auth, user)
        .then(() => {
          this.$router.push({name: 'Login'})
        })
        .catch((error) => {
          console.log(error.message);
        });

    }
  }
};
</script>

<style>
  #btn{
    width:180px;
    font-weight: bold;
    cursor: pointer;
  }
</style>
