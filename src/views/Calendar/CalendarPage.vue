<template>
  <div>
    <h1>Calendar Page</h1>
    <button @click="signInWithGoogle">Sign in with Google</button>
    <button @click="goToSyncedCalendar">Go to Synced Calendar</button>
  </div>
</template>

<script>
import GoogleCalendar from '../../GoogleCalendar.js';

export default {
  methods: {
    signInWithGoogle() {
      window.location = GoogleCalendar.getAuthUrl();
    },
    goToSyncedCalendar() {
      this.$router.push({ name: 'SyncedCalendar' });
    },
  },
}
</script>
