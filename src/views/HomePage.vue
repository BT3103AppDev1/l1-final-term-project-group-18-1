<template>
    <div>
      <header>
        <Logout />
      </header>
      <main>
        <h1>Home Page</h1>
        <searchButton />
      </main>
    </div>
</template>

<script>
import searchButton from '../components/Home/searchButton.vue'
import Logout from '../components/Logout.vue'

export default {
  components: {
    Logout,
    searchButton,
  }
}
</script>

<style>
  header{
    position:fixed;
    bottom:0;
    left:90;
    width:100%;
  }
</style>
