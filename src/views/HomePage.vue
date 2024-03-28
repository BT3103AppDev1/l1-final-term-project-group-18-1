<template>
    <div>
      <h1>Home Page</h1>
    </div>
    <Logout />
    <SearchBar />
</template>

<script>
import Logout from '../components/Logout.vue'
import SearchBar from '@/components/SearchBar.vue';

export default {
  components: {
    Logout,
    SearchBar
  }
}
</script>