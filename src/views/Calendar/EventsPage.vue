
<template>
    <br><br>
    <h1>Your Events</h1>
    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  
  export default {
    name: 'EventsPage',
    components: {
      FullCalendar // register the FullCalendar component
    },
    data() {
      return {
        // FullCalendar options
        calendarOptions: {
          plugins: [dayGridPlugin], // use the dayGridPlugin
          initialView: 'dayGridMonth', // show the calendar in monthly view
          events: [], // we will populate this array with our events
          eventTimeFormat: { 
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short',
          },
        },
      };
    },
    mounted() {
      this.loadEvents(); // load events after the component mounts
    },
    methods: {
      loadEvents() {
        // Check if gapi is loaded and if the user is authenticated
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
              start: event.start.dateTime || event.start.date, // All-day events may not have a dateTime
              end: event.end.dateTime || event.end.date, // All-day events may not have a dateTime
              allDay: !event.start.dateTime // All-day event if there's no dateTime
            }));
            
            // Update calendar options with the fetched events
            this.calendarOptions = { ...this.calendarOptions, events };
          }).catch(error => {
            console.error("Error fetching events: ", error);
          });
        } else {
          // Handle the user not being signed in or gapi not being loaded
          console.error("The user is not signed in or the Google API client is not loaded.");
        }
      }
    }
  };
</script>

<style>
#app, .content, .container {
  width: 100%;
  max-width: none;
}

.calendar-container {
  padding: 0;
  margin: 0;
  height: calc(100vh - 100px) /* Minus off height of navbar */
}
.fc {
  /* Allow the calendar to expand fully within its container */
  width: 100% !important;
  height: 100% !important;
}

</style>
