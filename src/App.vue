<script setup>
import LandingPage from './components/LandingPage.vue';
import About from './components/About.vue';
import Resources from './components/Resources.vue';
import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue';
</script>

<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> 
      <router-link to="/About">About</router-link> 
      <router-link to="Resources">Resources</router-link> |
      <router-link to="Login">Login</router-link>
      <router-link to="/SignUp">SignUp</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style>
/* Add styles for active router link */
.router-link-active {
  color: grey;
}
</style>