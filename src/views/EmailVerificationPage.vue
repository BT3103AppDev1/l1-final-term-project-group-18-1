<template>
    <div class="email-verification-container">
        <div class="image-container">
            <img src="@/assets/emailtick.png" alt="emailtick"/>
        </div>

        <h1 class="main-title">One final step! We need to verify your email.</h1>
        <p class="description">Please check your inbox for verification link.</p>
        <p class="small-text">Can't find it? Please check your spam folder.</p>
        <button @click="loginpage">I've Verified My Email</button>
    </div>
    <!-- Banner Image Section -->
    <div class="banner-section">
    <img src="@/assets/Banner.png" alt="EcoHarbour Banner" class="banner-image" />
  </div>
</template>

<script>
import { auth } from '../firebaseConfig'
import {reload} from 'firebase/auth'

export default {
    name: 'EmailVerification',
    methods: {
        loginpage() {
            this.$router.push({ name: 'Login' });
        }
    }
};
</script>

<style scoped>
.email-verification-container {
    height: 90vh;
    padding-top: 10vh;
    position: relative;
    z-index: 2;
}

.main-title {
  font-size: 2rem;
  color: #457247;
}

.small-text {
  font-size: 0.8rem;
  margin-top: 1rem;
}

.description {
  font-size: 1rem;
  color: #666666;
  max-width: 1000px;
  margin: 1em auto;
}

button {
  background-color: #95e1f1;
  border: 1px solid #457247;
  color: black;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1em;
  margin: 5px;
  transition: background-color 0.1s;
}

.banner-section {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: 1;
}

.banner-image {
  width: 100%;
  height: auto;
  display: block;
}
</style>