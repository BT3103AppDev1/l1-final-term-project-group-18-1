<template>
  <div class="settings-wrapper">

    <div class="settings-menu">
      <div class="profile-notifications-contactus-buttons"> 
        <font-awesome-icon icon="user" class = "usericon"/>
        <button @click="changeComponent('Profile')">Profile</button>
        <button @click="changeComponent('Notifications')">Notifications</button>
        <button @click="changeComponent('ContactUs')">Contact Us</button>
      </div>
      <div class="logout-button"> 
        <Logout/>
      </div>
    </div>
    

    <div class="settings-content">
      <component :is="currentComponent"></component>
    </div>

  </div>
</template>

<script>
import Profile from './Profile.vue';
import Notifications from './Notifications.vue';
import ContactUs from './ContactUs.vue';
import Logout from '@/components/Logout.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

library.add(faUser) //to add in the user icon 

export default {
  data() {
    return {
      currentComponent: 'Profile', // Default component
    };
  },
  components: {
    FontAwesomeIcon,
    Profile,
    Notifications,
    ContactUs,
    Logout,
  },
  methods: {
    changeComponent(component) {
      this.currentComponent = component;
    },
  },
};
</script>

<style scoped>
/* Styles for the layout of settings page  */
.settings-wrapper {
  display: flex;
  flex-direction: row;
}

.settings-content {
  padding: 20px;
  flex-grow: 1;
  min-width: 800px;
}

/* specific style for the buttons */ 
.settings-menu {
  display: flex;
  flex-direction: column;
  /* Assuming a fixed width sidebar */
  width: 200px;
  padding: 20px;
  border-right: 2px solid #bebebe; /* Border between menu and content */
  height: 50vh;
}

.profile-notifications-contactus-buttons {
  display: flex; /* Use flexbox layout */
  flex-direction: column; /* Stack buttons vertically */
  align-items: flex-start; /* Align items to the start of the container */
}

.usericon {
  margin-right: 5px;
}

.profile-notifications-contactus-buttons button {
  background: none;
  border: none;
  color: #000; /* Set to your preferred text color */
  padding: 10px 0;
  text-align: left;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  display: flex; /* Use flexbox layout */
  align-items: center; /* Align items vertically */
}

.profile-notifications-contactus-buttons button:hover {
  color: #457247; /* Change to the color you want on hover */
}

.logout-button {
  margin: 5px;
  margin-top: 20vh;
}

.logout-button button {
  border-radius: 5px;
  border: 1px solid #457247;
  background-color: #457247;
  color: white;
  cursor: pointer;
  transition: background-color 0.1s;
}
</style>

