<script>
  import Login from '../components/Login.vue'

  export default {
    components: {
      Login
    },
    methods: {
      goToForgotPassword() {
        this.$router.push({ name: 'ForgetPassword' }); // Use the route name or path
      },
      goToSignup() {
        this.$router.push({ name: 'Sign Up' });
      }
    }
  }
</script>

<template>
  <div id="main">
    <div id="welcome" style="text-align: center;">
      <h1 style="color:#457247;">Welcome Back to EcoHarbour</h1>
      <p style="color:#457247;">
        Thank you for your efforts in protecting our environment and paving the way for a sustainable
        future where the well-being of our planet is at the forefront of our actions and decisions.
      </p>
      <br>
    </div>
    <Login />
    <div style="text-align: center;">
      <a href="#" class="forgot-password" @click.prevent="goToForgotPassword">Forgot your password?</a>
      <p>Don't have an account? <a href="#" @click.prevent="goToSignup">Sign up</a></p>
    </div>
  </div>
  <!-- Banner Image Section -->
  <div class="banner-section">
    <img src="@/assets/Banner.png" alt="EcoHarbour Banner" class="banner-image" />
  </div>
</template>

<style>
    #main {
        position: relative;
        z-index: 2;
        display: block;
        justify-content: center;
        align-items: center;
        width: 60%;
        margin: 0 auto;
        margin-top: 10vh;
    }
    input {
        margin: 5px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #457247;
    }
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
    #show {
        display: flex;
        justify-content: flex-end;
        margin: 5px;
    }

.banner-section {
  position: fixed;
  z-index: 1;
  bottom: 0;
  left: 0;
  width: 100vw;
}

.banner-image {
  width: 100%;
  height: auto;
  display: block;
}
</style>
