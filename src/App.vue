<script setup>
import NavigationBar from './components/NavigationBar.vue';
</script>

<template>
  <div id="app">
    <div id = "nav">
      <NavigationBar />
    </div>

    <div>
      <router-view/>
    </div>
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
#nav {
  padding: 35px;
}
/* all these for infographics and locator*/
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

