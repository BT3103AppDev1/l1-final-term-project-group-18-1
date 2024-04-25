<template>
    <div class="settings-wrapper">
        <div class="settings-menu">
            <div class="profile"> 
                <font-awesome-icon icon="user"/>
                <button @click="changeComponent('Profile')">Profile</button>
            </div>
            <div class="contactUs"> 
                <font-awesome-icon icon="phone"/>
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
  import ContactUs from './ContactUs.vue';
  import Logout from '@/components/Logout.vue'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faUser, faPhone } from '@fortawesome/free-solid-svg-icons'
  
  library.add(faUser) //to add in the user icon 
  library.add(faPhone) //to add in the phone icon 
  
  export default {
    data() {
      return {
        currentComponent: 'Profile', // Default component
      };
    },
    components: {
      FontAwesomeIcon,
      Profile,
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
    align-items: center;
  }
  
  /* specific style for the buttons */ 
  .settings-menu {
    margin-top: 110px;
    margin-left: 50px;
    display: flex;
    flex-direction: column;
    width: 200px;
    border-right: 2px solid #bebebe; /* Border between menu and content */
    height: 500px;
    flex-shrink: 0;
  }
  
  .profile,
  .contactUs {
    display: flex;
    align-items: center;
  }
  
  .profile button,
  .contactUs button {
    background: none;
    border: none;
    color: #000; 
    padding: 10px 0;
    text-align: left;
    width: 100%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  
  .profile button:hover,
  .contactUs button:hover,
  .profile:hover,
  .contactUs:hover{
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
  
  
  