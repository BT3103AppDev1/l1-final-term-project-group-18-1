<template>
  <div>
    <GoogleLoginButton @authenticated="listEvents"/>  <!-- Listen to authenticated event -->
    <ul v-if="events.length">
      <li v-for="event in events" :key="event.id">{{ event.summary }} - {{ event.start.dateTime }}</li>
    </ul>
  </div>
</template>

<script>
import GoogleLoginButton from '../../components/GoogleLoginButton.vue'

export default {
  name: 'CalendarPage',
  components: {
    GoogleLoginButton
  },
  data() {
    return {
      events: []
    };
  },
  methods: {
    listEvents() {
      window.gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      }).then(response => {
        this.events = response.result.items;
      }).catch(error => {
        console.error("Error fetching events:", error);
      });
    }
  }
}
</script>