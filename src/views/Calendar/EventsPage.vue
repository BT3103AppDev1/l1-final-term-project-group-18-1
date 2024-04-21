<template>
  <div>
    <h1>Your Events</h1>
    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { initGoogleAPI } from '@/utils/googleApi'; // Ensure the path to initGoogleAPI is correct

export default {
  name: 'EventsPage',
  components: {
    FullCalendar // Register the FullCalendar component
  },
  data() {
    return {
      // FullCalendar options
      calendarOptions: {
        plugins: [dayGridPlugin], // Use the dayGridPlugin
        initialView: 'dayGridMonth', // Show the calendar in monthly view
        events: [], // We will populate this array with our events
        eventTimeFormat: { 
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short',
        },
      },
      pollInterval: null,
    };
  },
  mounted() {
    this.initializeAndLoadEvents();
  },
  beforeDestroy() {
    this.stopPolling(); // Stop the polling when the component is destroyed
  },
  methods: {
    async initializeAndLoadEvents() {
      try {
        await initGoogleAPI(); // Ensure Google API is initialized
        this.loadEvents(); // Initially load events after the API is ready
        this.startPolling(); // Start auto-loading of data
      } catch (error) {
        console.error('Failed to initialize Google API:', error);
      }
    },
    loadEvents() {
      if (window.gapi && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        // Fetch events from Google Calendar
        window.gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          // Map over the events and adjust them for FullCalendar
          const events = response.result.items.map(event => ({
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            allDay: !event.start.dateTime
          }));
          // Update calendar options with the fetched events
          this.calendarOptions = { ...this.calendarOptions, events };
        }).catch(error => {
          console.error("Error fetching events: ", error);
        });
      } else {
        console.error('User is not signed in.');
      }
    },
    startPolling() {
      this.pollInterval = setInterval(this.loadEvents, 10000); // Poll every 10 seconds
    },
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
      }
    }
  }
}
</script>

<style>
#app, .content, .container {
  width: 100%;
  max-width: none;
}

.calendar-container {
  padding: 0;
  margin: 0;
  height: calc(100vh - 100px); /* Minus off height of navbar */
}

.fc {
  /* Allow the calendar to expand fully within its container */
  width: 100% !important;
  height: 100% !important;
}
</style>
