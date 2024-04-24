<template>
  <div class="social-page-container">
    <div class="row">
      <div class="column left">
        <friends-list/>
      </div>
      <div class="column right">
        <find-friends class="find-friends-component"/>
        <friend-requests/>
      </div>
    </div>
  </div>
</template>


<script>
import FindFriends from '@/components/Social/FindFriends.vue'
import FriendRequests from '@/components/Social/FriendRequests.vue'
import FriendsList from '@/components/Social/FriendsList.vue'

export default {
  components: {
    FindFriends,
    FriendRequests,
    FriendsList
  }
}
</script>

<style scoped>
.social-page-container {
  display: flex;
  flex-direction: column;
  height: 80vh; 
  width: 80vw; 
  margin: 0; 
  padding-top: 0; 
}

.row {
  display: flex;
  height: 100%; 
}

.column {
  display: flex;
  flex-direction: column;
}

.left {
  flex: 3;
  border-right: 2px solid #ccc; 
}

.right {
  flex: 1;
  align-items: flex-start;
  padding-left: 30px; 
}

.find-friends-component {
  margin-bottom: 30px; 
}

</style>
