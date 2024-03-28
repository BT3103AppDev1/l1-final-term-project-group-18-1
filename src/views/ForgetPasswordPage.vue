<template>
  <div>
    <h1>Forgot Password</h1>
    <form @submit.prevent="submitForm">
      <input type="email" v-model="email" placeholder="Enter your email" required>
      <button type="submit">Send Reset Email</button>
    </form>
    <p v-if="message">{{ message }}</p>
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
