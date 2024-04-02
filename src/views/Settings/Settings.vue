<template>
  <div class="settings-wrapper">

    <div class="settings-menu">
      <button @click="changeComponent('Profile')">Profile</button>
      <button @click="changeComponent('Notifications')">Notifications</button>
      <button @click="changeComponent('ContactUs')">Contact Us</button>
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
export default {
  data() {
    return {
      currentComponent: 'Profile', // Default component
    };
  },
  components: {
    Profile,
    Notifications,
    ContactUs,
  },
  methods: {
    changeComponent(component) {
      this.currentComponent = component;
    },
  },
};
</script>

<style>
/* Add your styles here */
.settings-wrapper {
  display: flex;
  flex-direction: row;
}
.settings-menu {
  display: flex;
  flex-direction: column;
  /* Assuming a fixed width sidebar */
  width: 200px;
  padding: 20px;
  border-right: 2px solid #bebebe; /* Border between menu and content */
  height: 50vh;
}

.settings-menu button {
  background: none;
  border: none;
  color: #000; /* Set to your preferred text color */
  padding: 10px 0;
  text-align: left;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
}

.settings-menu button:hover {
  color: #028a0f; /* Change to the color you want on hover */
}


.settings-content {
  padding: 20px;
  flex-grow: 1;
  min-width: 800px;
}
</style>