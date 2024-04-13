<template>
  <div>
    <h1>Sync your Google Calendar with Eco Harbour</h1>
    <h3>Unlock a seamless integration of eco-friendly reminders to encourage sustainable living in your faily activities.</h3>
    <GoogleLoginButton @authenticated="handleAuthentication"/>
  </div>
</template>

<script>
import GoogleLoginButton from '@/components/GoogleLoginButton.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'CalendarPage',
  components: {
    GoogleLoginButton
  },
  setup() {
    const router = useRouter();
    
    const handleAuthentication = () => {
      router.push({ name: 'Events' });
    };

    return { handleAuthentication };
  },
}
</script>
