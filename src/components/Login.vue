<template>
    <div class="container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Login</button>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
      };
    },
    methods: {
      async login() {
        const auth = getAuth();
        try {
          await signInWithEmailAndPassword(auth, this.email, this.password);
          this.$router.push({ name: 'Home' }); // Redirect to home page after successful login
        } catch (error) {
          this.errorMessage = error.message; // Show error message on login failure
        }
      },
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  .container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
  }
  </style>
  