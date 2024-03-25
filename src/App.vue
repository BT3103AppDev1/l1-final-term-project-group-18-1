<script setup>
import LandingPage from './views/LandingPage.vue'
import About from './views/About.vue'
import Resources from './views/Resources.vue'
import Login from './views/LoginPage.vue'
import SignUp from './views/SignUpPage.vue'
</script>

<template>
  <div id="app">
    <nav id="navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/About">About</router-link>
      <router-link to="Resources">Resources</router-link>
      <router-link to="Login">Login</router-link>
      <router-link to="/SignUp">Sign Up</router-link>
    </nav>
    <router-view/>
    <!-- <Login /> -->
  </div>

</template>

<style>
/* ohno this was supp to change the curr tab to another colour but it doesnt work now */
.router-link-active {
  color: green;
}

#navbar {
  position: fixed; /* Fix the navbar at the top of the page */
  top: 0;
  right: 0;
  z-index: 1000; /* Ensure the navbar stays on top of other content */
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 10px;
  margin-left: 10px;
}

#navbar a {
  color: white;
  text-decoration: none;
  padding: 20px 0;
  width: fit-content;
  margin-right: 10px; /* Spacing between links */
}

</style>