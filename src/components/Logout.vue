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

<style scoped>
  button {
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #457247;
    background-color: #457247;
    color: white;
    cursor: pointer;
    transition: background-color 0.1s;
  }
  button:active {
    background-color: #3b5e3b;
  }
</style>