<script setup>
import LandingPage from './views/LandingPage.vue'
import About from './views/About.vue'
import Login from './views/LoginPage.vue'
import SignUp from './views/SignUpPage.vue'
import Infographics from './views/Resource/Infographics.vue'
import BlueBinLocator from './views/Resource/BlueBinLocator.vue'
import Settings from './views/Settings/Settings.vue'
import EditProfile from './views/Settings/EditProfile.vue' 
import Notifications from './views/Settings/Notifications.vue' 
import ContactUs from './views/Settings/ContactUs.vue' 
import NavigationBar from './components/NavigationBar.vue';
</script>

<template>
  <div id="app">
    <nav id="navbar">
      <router-link to="/">Home</router-link>
      <router-link to="/About">About</router-link>
      <router-link to="Login">Login</router-link>
      <router-link to="/SignUp">Sign Up</router-link>
      <div class="nav-item resources">
        Resources
        <div class="dropdown-menu">
          <router-link to="/resources/Infographics">Infographics</router-link>
          <router-link to="/resources/BlueBinLocator">Blue Bin Locator</router-link>
        </div>
      </div> 
      <router-link to="/Settings">Settings</router-link>
    </nav>
    <NavigationBar />
    <router-view/>
  </div>
 </template>


<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
#app {
  text-align: center;
}
/* all these for infographics and bluebinlocator*/
.nav-item {
  position: relative;
  margin-bottom: 20px; 
  margin-right: 10px;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  box-shadow: 0 8px 16px 0 rgb(255, 255, 255);
  padding: 12px 16px;
  z-index: 1;
}
.resources:hover .dropdown-menu {
  display: grid;
}
</style>

