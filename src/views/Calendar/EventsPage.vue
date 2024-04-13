<template>
    <div>
      <h1>Your Events</h1>
      <ul v-if="events.length">
        <li v-for="event in events" :key="event.id">
          {{ event.summary }} - {{ event.start.dateTime }}
        </li>
      </ul>
      <p v-else>No events found.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EventsPage',
    data() {
      return {
        events: []
      };
    },
    mounted() {
      this.listEvents();
    },
    methods: {
      listEvents() {
        // Ensure the Google API client is loaded and signed in
        if (window.gapi && window.gapi.client) {
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
        } else {
          console.error("The Google API client is not loaded or the user is not authenticated.");
          // Handle the error case here. Redirect back to login page or show error message.
        }
      }
    }
  }
  </script>
  