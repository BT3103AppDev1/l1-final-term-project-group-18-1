<script setup>
import LandingPage from './components/LandingPage.vue';
import About from './components/About.vue';
import Login from './components/Login.vue';
import SignUp from './components/SignUp.vue';
import Settings from './components/Settings.vue';
</script>

<template>
  <div id="app">
    <nav id="navbar">
      <router-link to="/">Home</router-link> 
      <router-link to="/About">About</router-link> 
      <div class="nav-item resources">
        Resources
        <div class="dropdown-menu">
          <router-link to="/resources/Infographics">Infographics</router-link>
          <router-link to="/resources/BlueBinLocator">Blue Bin Locator</router-link>
        </div>
      </div> 
      <router-link to="Login">Login</router-link>
      <router-link to="/SignUp">Sign Up</router-link>
      <router-link to="/Settings">Settings</router-link>
    </nav>
    <router-view></router-view>
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


/* all these for infographics and bluebinlocator*/
.nav-item {
  position: relative;
  padding: 20px; 
  
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

