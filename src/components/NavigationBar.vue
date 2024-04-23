<template>
  <nav class="navbar">
    <img src="@/assets/logo.png" class="navbar-logo" />

    <div class="nav-links">
      <!-- Common links -->
      <router-link to="/" class="nav-item">About</router-link>

      <!-- Dropdown for Resources -->
      <div class="nav-item resources">
        <router-link to="/resources/ResourcesPage" class="dropdown-item">Resources</router-link>
        <div class="dropdown-menu">
          <router-link to="/resources/Infographics" class="dropdown-item">Infographics</router-link>
          <router-link to="/resources/ThriftLocator" class="dropdown-item">Thrift Locator</router-link>
        </div>
      </div>

      <!-- Conditional links for authenticated users -->
      <router-link to="/Home" class="nav-item" v-if="isAuthenticated">Home</router-link>
      <router-link to="/Farm" class="nav-item" v-if="isAuthenticated">Farm</router-link>
      <router-link to="/Calendar" class="nav-item" v-if="isAuthenticated">Calendar</router-link>
      <router-link to="/Settings" class="nav-item" v-if="isAuthenticated">Settings</router-link>
      <span class="vertical-line" v-if="isAuthenticated"></span>
      
      <!-- Log In and Sign Up buttons for non-authenticated users -->
      <router-link to="/Login" class="auth-item-button" v-if="!isAuthenticated">Log In</router-link>
      <router-link to="/SignUp" class="auth-item-button" v-if="!isAuthenticated">Sign Up</router-link>
    </div>

    <!-- User info and fertiliser details to show when signed in -->
    <div class="user-info" v-if="isAuthenticated">
      <div class="user-details">
        <img src="@/assets/usericon.png" class="user-icon" />
        <span class="username">{{ username }}</span>
      </div>
      <div class="fertiliser-info">
        <img src="@/assets/fertiliser.png" class="fertiliser-icon" />
        <span class="fertiliser-amount">{{ fertiliser }}</span>
      </div>
    </div>
  </nav>
</template>



<script>
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

export default {
  data() {
    return {
      isAuthenticated: false,
      username: this.username || '',
      fertiliser: this.fertiliser || 0,
    };
  },
  async created() {
    onAuthStateChanged(auth, async (user) => {
      this.isAuthenticated = !!user;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.username = userData.username;
          this.fertiliser = userData.fertiliser || 0;
        } else {
          console.log('No such document!');
        }
      }
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
  max-height: 90px;
  min-width: 200px;
  height: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  list-style-type: none;
  padding: 15px 0;
  margin-left: 400px;
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
  color: var(--background-color);
  background-color: var(--primary-color);
  padding: 10px 20px;
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
  color: var(--background-color); 
  background-color: var(--primary-color); 
  border-color: var(--primary-color); 
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

.nav-item.resources:hover > .dropdown-item {
  color: var(--background-color);
  background-color: var(--primary-color);
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-right: 50px;
}

.user-details {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
}

.username {
  margin-left: 8px;
}

.fertiliser-amount {
  margin-left: 8px;
}

.fertiliser-info {
  display: flex;
  flex-direction: row;
  align-items: left;
}

.user-icon, .fertiliser-icon {
  width: 25px;
  height: 25px;
}

.vertical-line {
  display: inline-block;
  margin-left: 40px;
  margin-right: 10px;
  height: 50px;
  width: 2px;
  background-color: var(--primary-color);
  vertical-align: middle;
}

.auth-item-button {
  margin: 0 1rem;
  font-size: 1.2em;
  color: var(--primary-color); 
  text-decoration: none;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;
  padding: 10px 20px;
  border: 2px solid var(--primary-color); 
  border-radius: 20px; 
  background-color: transparent; 
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.auth-item-button:hover {
  color: var(--background-color); 
  background-color: var(--primary-color); 
  border-color: var(--primary-color); 
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
    border: 1px solid var(--primary-color);
  }
}
  </style>