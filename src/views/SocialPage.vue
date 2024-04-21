<template>
  <div class="social-container">
    <div class="friends-section">
      <h2>FRIENDS</h2>
      <FriendsList />
    </div>
    <div class="divider"></div>
    <div class="interaction-area">
      <div class="find-friends">
        <FindFriends />
      </div>
      <div class="friend-requests">
        <FriendRequests />
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
  },
}
</script>

<style scoped>
.social-container {
  display: flex;
  align-items: flex-start;
}

.friends-section {
  flex: 1;
  padding: 10px;
  text-align: left;
}

.divider {
  width: 1px;
  background-color: #ccc;
  height: 100%;
}

.interaction-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px;
}

.find-friends {
  margin-bottom: 20px;
}

.friend-requests {
  flex-grow: 1;
}
</style>
