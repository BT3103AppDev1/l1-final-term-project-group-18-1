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
  height: 80vh; /* Stretch to full viewport height */
  width: 80vw; /* Stretch to full viewport width */
  margin: 0; /* Remove default margin */
  padding-top: 0; /* Adjust this as needed if you have a header */
}

.row {
  display: flex;
  height: 100%; /* Take full height of the container */
}

.column {
  display: flex;
  flex-direction: column;
}

.left {
  flex: 3;
  border-right: 2px solid #ccc; /* This creates a vertical line divider */
}

.right {
  flex: 1;
  align-items: flex-start;
  padding-left: 30px; /* Increased space between the vertical line and the right column content */
}

/* Add a class for the component FindFriends to add margin */
.find-friends-component {
  margin-bottom: 30px; /* Adjust the space as needed */
}

</style>
