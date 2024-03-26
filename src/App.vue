<template>
  <div id="app">
    <!-- Navigation Bar -->
    <NavigationBar />

    <!-- Main content area where the routed components will be displayed -->
    <router-view />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';

export default {
  name: 'App',

  components: {
    NavigationBar
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  text-align: center;
}
</style>
