<template>
  <div>
    <h1>Social Features</h1>
    <FindFriends />
    <FriendRequests />
    <FriendsList />
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

