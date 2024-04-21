<template>
    <div>
      <header>
        <Logout />
      </header>
      <main>
        <h1>Home Page</h1>
        <SearchBar />
      </main>
    </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import Logout from '../components/Logout.vue'

export default {
  components: {
    Logout,
    SearchBar
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
