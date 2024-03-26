<template>
    <nav class="navbar">
      <img src="@/assets/logo.png" class="navbar-logo" />
  
      <div class="nav-links">
        <!-- Common links (all have) -->
        <router-link to="/" class="nav-item">Home</router-link>
        <router-link to="/About" class="nav-item">About</router-link>
        <router-link to="/Resources" class="nav-item">Resources</router-link>
  
        <!-- Conditional links (only landing page)-->
        <template v-if="currentRoute === '/'">
            <router-link to="/Login" class="nav-item nav-item-button">Log In</router-link>
            <router-link to="/SignUp" class="nav-item nav-item-button">Sign Up</router-link>
        </template>
      </div>
      
      <!-- (only if signed in)-->
      <template v-if="isAuthenticated">
        <div class="nav-links">
          <router-link to="/Home" class="nav-item">Farm</router-link>
          <router-link to="/Calendar" class="nav-item">Calendar</router-link>
          <router-link to="/Settings" class="nav-item">Settings</router-link>
          <!-- Omit the user info display for now -->
        </div>
      </template>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isAuthenticated: false,
      };
    },
    computed: {
      currentRoute() {
        return this.$route.path;
      },
    },
  };
  </script>

  <style>
 
  .navbar {
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    background-color: #ffffff; 
    color: #457247; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    z-index: 1000; 
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 2rem;
    box-sizing: border-box; 
  }
  
  .navbar-logo {
    max-height: 50px; 
  }
  
  .nav-links {
    display: flex;
    align-items: center; 
    list-style-type: none; 
}
  
  .nav-item {
    margin: 0 1rem;
    font-size: 1.2em;
    color: #457247;
    text-decoration: none;
    display: flex;
    align-items: center;
    height: 40px;
}
  
  .nav-item:hover {
    color: #345830; 
    text-decoration: underline;
  }

  .nav-item-button {
    padding: 10px 20px;
    border: 2px solid #457247; 
    border-radius: 20px; 
    color: #457247; 
    font-size: 1.2em;
    background-color: transparent; 
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
    line-height: 1; 
    margin: 0 1rem;
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
}

  .nav-item-button:hover {
  background-color: #457247; 
  color: #ffffff; 
}
  
  body {
    padding-top: 70px; 
  }
  
  @media (max-width: 768px) {
    .nav-links {
      flex-direction: column;
      align-items: center;
    }
  
    .nav-item {
      margin: 0.5rem 0;
    }
  }
  </style>  