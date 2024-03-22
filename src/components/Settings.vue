<template>
  <div class="settings-wrapper">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      Settings > {{ breadcrumb }}
    </div>

    <div class="settings-menu">
      <button @click="changeComponent('EditProfile')">Edit Profile</button>
      <button @click="changeComponent('Notifications')">Notifications</button>
      <button @click="changeComponent('ContactUs')">Contact Us</button>
    </div>
    
    <div class="settings-content">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import EditProfile from './EditProfile.vue';
import Notifications from './Notifications.vue';
import ContactUs from './ContactUs.vue';

export default {
  data() {
    return {
      currentComponent: 'EditProfile', // Default component
      breadcrumb: 'Edit Profile', // Default breadcrumb
    };
  },
  components: {
    EditProfile,
    Notifications,
    ContactUs,
  },
  methods: {
    changeComponent(component) {
      this.currentComponent = component;
      // Update breadcrumb based on the component
      switch (component) {
        case 'EditProfile':
          this.breadcrumb = 'Edit Profile';
          break;
        case 'Notifications':
          this.breadcrumb = 'Notifications';
          break;
        case 'ContactUs':
          this.breadcrumb = 'Contact Us';
          break;
      }
    },
  },
};
</script>

<style>
/* Add your styles here */
.breadcrumb {
  /* Breadcrumb styling */
  margin-bottom: 20px; /* Add some space below the breadcrumb */
}

.settings-wrapper {
  display: flex;
  flex-direction: column;
}


.settings-menu {
  display: flex;
  flex-direction: column;
  width: 200px; /* Adjust based on your design */
}

.settings-menu button {
  margin-bottom: 10px;
}

.settings-content {
  flex-grow: 1;
  min-width: 600px;
}


</style>
