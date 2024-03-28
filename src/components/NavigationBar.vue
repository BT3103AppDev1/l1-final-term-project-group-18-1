<template>
  <nav class="navbar">
    <img src="@/assets/logo.png" class="navbar-logo" />

    <div class="nav-links">
      <!-- Common links -->
      <router-link to="/Home" class="nav-item">Home</router-link>
      <router-link to="/About" class="nav-item">About</router-link>

      <!-- Dropdown for Resources -->
      <div class="nav-item resources">
        Resources
        <div class="dropdown-menu">
          <router-link to="/resources/Infographics" class="dropdown-item">Infographics</router-link>
          <router-link to="/resources/BlueBinLocator" class="dropdown-item">Blue Bin Locator</router-link>
        </div>
      </div>

      <!-- Conditional links -->
      <template v-if="showAuthButtons">
        <router-link to="/Login" class="nav-item nav-item-button">Log In</router-link>
        <router-link to="/SignUp" class="nav-item nav-item-button">Sign Up</router-link>
      </template>
    </div>

    <!-- Links to show when signed in -->
    <template v-if="isAuthenticated">
      <div class="nav-links">
        <router-link to="/Farm" class="nav-item">Farm</router-link>
        <router-link to="/Calendar" class="nav-item">Calendar</router-link>
        <router-link to="/Settings" class="nav-item">Settings</router-link>
        <!-- Omit the user info display for now -->
      </div>
    </template>
  </nav>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export default {
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
    });
  },
  computed: {
    showAuthButtons() {
      const noAuthRoutes = ['/Login', '/SignUp', '/ForgetPassword'];
      return !this.isAuthenticated && !noAuthRoutes.includes(this.$route.path);
    },
  },
};
</script>

<style>
 :root {
  --primary-color: #457247;
  --hover-color: #345830;
  --background-color: #ffffff;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--background-color);
  color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.025rem 0.5rem;
  box-sizing: border-box;
  height: 65px;
}

.navbar-logo {
  max-height: 50px;
}

.nav-links {
  display: flex;
  align-items: center;
  list-style-type: none;
  padding: 15px 0;
}

.nav-item,
.nav-item-button {
  margin: 0 1rem;
  font-size: 1.2em;
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s, background-color 0.3s;
  margin-top: 20px;
}

.nav-item:hover,
.nav-item-button:hover {
  color: var(--hover-color);
  text-decoration: underline;
}

.nav-item-button {
  padding: 10px 20px;
  border: 2px solid var(--primary-color);
  border-radius: 20px;
  background-color: transparent;
  cursor: pointer;
  line-height: 1;
  display: inline-flex;
  align-items: left;
  justify-content: right;
}

.nav-item-button:hover {
  background-color: var(--primary-color);
  color: var(--background-color);
}

.dropdown-item {
  white-space: nowrap;
  padding: 8px 16px;
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  color: var(--background-color);
  background-color: var(--primary-color);
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background-color: var(--background-color);
  z-index: 1;
}

.resources:hover .dropdown-menu {
  display: block;
}

@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    align-items: center;
    padding-top: 65px; 
  }

  .nav-item {
    margin: 0.5rem 0;
  }

  .dropdown-menu {
    left: 50%;
    transform: translateX(-50%);
  }
}
  </style>