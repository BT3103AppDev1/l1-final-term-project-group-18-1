<template>
  <div>
    <br><br><br>
    <h1>Your Events</h1>
    <button @click="showAddReminderModal = true">Add Reminder</button>
    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>
    <add-reminder-modal
      v-if="showAddReminderModal"
      @close="showAddReminderModal = false"
      @save="addReminder"/>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { initGoogleAPI } from '@/utils/googleApi';
import AddReminderModal from '@/components/AddReminderModal.vue';

export default {
  name: 'EventsPage',
  components: {
    FullCalendar,
    AddReminderModal
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: [],
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: 'short',
        },
      },
      pollInterval: null,
      showAddReminderModal: false,
    };
  },
  mounted() {
    this.initializeAndLoadEvents();
  },
  beforeDestroy() {
    this.stopPolling();
  },
  methods: {
    initializeAndLoadEvents() {
      this.initGoogleAPIAndLoadEvents();
      this.startPolling();
    },
    async initGoogleAPIAndLoadEvents() {
      try {
        await initGoogleAPI();
        this.loadEvents();
      } catch (error) {
        console.error('Failed to initialize Google API:', error);
      }
    },
    loadEvents() {
      if (window.gapi && window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        window.gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const fetchedEvents = response.result.items.map(event => ({
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            allDay: !event.start.dateTime
          }));
          this.calendarOptions.events = [...new Map(fetchedEvents.concat(this.calendarOptions.events)
            .map(event => [event['start'], event])).values()];
        }).catch(error => {
          console.error("Error fetching events: ", error);
        });
      } else {
        console.error('User is not signed in.');
      }
    },
    startPolling() {
      this.pollInterval = setInterval(this.loadEvents, 10000);
    },
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
      }
    },
    addReminder(reminder) {
      const event = {
        summary: reminder.title,
        start: {
          dateTime: new Date(reminder.start).toISOString(),
          timeZone: 'Asia/Singapore' // Set to Singapore timezone
        },
        end: {
          dateTime: new Date(reminder.end || new Date(reminder.start).setHours(new Date(reminder.start).getHours() + 1)).toISOString(), // Ensure 'end' is after 'start'
          timeZone: 'Asia/Singapore' // Set to Singapore timezone
        }
      };

      window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      }).then(response => {
        console.log("Event created: ", response);
        this.calendarOptions.events.push({
          title: response.result.summary,
          start: response.result.start.dateTime,
          end: response.result.end.dateTime,
          allDay: !response.result.start.dateTime
        });
        this.scheduleNotification(reminder);
        this.showAddReminderModal = false;
      }).catch(error => {
        console.error("Error adding event to Google Calendar: ", error);
        alert("Failed to add event to Google Calendar: " + error.result.error.message);
      });
    },

    scheduleNotification(reminder) {
      if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const localTimeOfReminder = new Date(reminder.start); // Already in local time if your system clock is set to Singapore
            const timeUntilReminder = localTimeOfReminder.getTime() - new Date().getTime(); // Calculate the time until the reminder in milliseconds
            setTimeout(() => {
              new Notification(reminder.title);
            }, timeUntilReminder);
          }
        });
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
  height: calc(100vh - 100px); /* Adjusted for navbar */
}
.fc {
  width: 100% !important;
  height: 100% !important;
}
</style>
