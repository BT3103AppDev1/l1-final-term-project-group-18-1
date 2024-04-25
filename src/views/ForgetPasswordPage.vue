<template>
  <div>
    <br>
    <img src="../assets/pw_reset.png">
    <h1 class="title">Forgot Password</h1>
    <h3>Enter your email and we'll send you a link to rest your password.</h3><br>
    <form @submit.prevent="submitForm">
      <input class="email" type="email" v-model="email" placeholder="Enter your email" required>
      <button type="submit">Submit</button>
    </form>
    <p class="message" v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import firebaseApp from '../firebaseConfig.js'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
const auth = getAuth(firebaseApp);

export default {
  data() {
    return {
      email: '',
      message: ''
    };
  },
  methods: {
    async submitForm() {
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.message = 'Reset link sent! Check your email.';
      } catch (error) {
        this.message = error.message;
      }
    }
  }
};
</script>

<style>
  .email {
    width: 20%;
  }
  img {
    width: 10%;
    height: auto; /* keeps the image aspect ratio */
  }
  .title,
  .message {
    color: #457247 !important;
  }
</style>