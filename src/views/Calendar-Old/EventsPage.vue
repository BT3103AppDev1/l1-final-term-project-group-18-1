<template>
  <div>
    <br><br><br>
    <h1>Your Events</h1>
    <button @click="showCreateEventModal = true">Add Event</button>
    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>
    <CreateEventModal
      v-if="showCreateEventModal"
      @close="showCreateEventModal = false"
      @save="addEvent"/>
    <EditEventModal
      v-if="showEditEventModal"
      :event="selectedEvent"
      @close="showEditEventModal = false"
      @update="updateEvent"
      @delete="deleteEvent"/>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { initGoogleAPI } from '@/utils/googleApi';
import CreateEventModal from '@/components/CreateEventModal.vue';
import EditEventModal from '@/components/EditEventModal.vue';
import { auth, db } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'

export default {
  name: 'EventsPage',
  components: {
    FullCalendar,
    CreateEventModal,
    EditEventModal,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: [],
        // format displayed on calendar
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        },
        eventContent: this.renderEventContent, // Custom render method for events
        eventClick: this.handleEventClick,
      },
      pollInterval: null,
      showCreateEventModal: false,
      showEditEventModal: false,
      selectedEvent: {
        id: '',
        title: '',
        start: '',
        end: '',
        reminderDescription: '',
        reminderTime: '',
      },
    };
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists() && userDocSnap.data().calendarSynced) {
        this.initializeAndLoadEvents();
      } else {
        this.$router.push({ name: 'Calendar' });
      }
    } else {
      // Stop polling if the user signs out
      this.stopPolling();
    }
  });
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    // loading of events
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
    async loadEvents() {
      // First, check if the Firebase user is signed in
      const firebaseUser = auth.currentUser;

      if (firebaseUser) {
        try {
          // Fetch the Firestore document for the current user
          const userDocRef = doc(db, 'users', firebaseUser.uid, 'calendar', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          // Check if the document exists and contains a googleAccessToken
          if (userDocSnap.exists() && userDocSnap.data().accessToken) {
            const googleAccessToken = userDocSnap.data().accessToken;
            // Set the access token for the Google API client
            window.gapi.client.setToken({ access_token: googleAccessToken });

            // Now, make the API call to Google Calendar
            const response = await window.gapi.client.calendar.events.list({
              'calendarId': 'primary',
              //'timeMin': (new Date()).toISOString(),
              'showDeleted': false,
              'singleEvents': true,
              'maxResults': 2500,
              'orderBy': 'startTime'
            });

            // Process the events response from Google Calendar
            const fetchedEvents = response.result.items.filter(event => event.status !== 'cancelled').map(event => ({
              title: event.summary,
              start: event.start.dateTime || event.start.date,
              end: event.end.dateTime || event.end.date,
              allDay: !event.start.dateTime,
              type: event.extendedProps?.private?.type || 'event',
              reminderDescription: event.extendedProperties?.private?.reminderDescription || '',
              reminderTime: event.extendedProperties?.private?.reminderTime || '',
            }));
            
            // Update the calendarOptions with the fetched events
            this.calendarOptions.events = fetchedEvents;
            this.$store.dispatch('updateUpcomingEvents', this.upcomingEvents);

          } else {
            console.error('No Google access token found in Firestore.');
            // Consider redirecting the user to re-authenticate with Google
          }
        } catch (error) {
          console.error("Error fetching events: ", error);
          // Handle errors such as Firestore read failure or Google API request failure
        }
      } else {
        console.error('Firebase user is not signed in.');
        // Redirect the user to sign in with Firebase or handle this case appropriately
      }
    },

    // getting the most updated version of the calendar
    startPolling() {
      this.pollInterval = setInterval(this.loadEvents, 10000);
    },
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
      }
    },
    
    /* Add events to calendar */
    addEvent(eventDetails) {
      const event = {
        summary: eventDetails.title,
        start: {
          dateTime: new Date(eventDetails.start).toISOString(),
          timeZone: 'Asia/Singapore'
        },
        end: {
          dateTime: new Date(eventDetails.end).toISOString(),
          timeZone: 'Asia/Singapore'
        },
        extendedProps: { 
          private: {
            type: 'event',
            reminderDescription: String(eventDetails.reminderDescription), // This is a custom property
            reminderTime: String(eventDetails.reminderTime), // Convert to string to ensure it's preserved
          }
        }
      };

      window.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      }).then(response => {
        // Event added successfully
        this.calendarOptions.events.push({
        id: response.result.id,
        title: response.result.summary,
        start: response.result.start.dateTime || response.result.start.date,
        end: response.result.end.dateTime || response.result.end.date,
        allDay: response.result.start.date ? true : false,
        // extendedProps: {
        //  private: {
        //    reminderDescription: response.result.extendedProps.private.reminderDescription,
        //    reminderTime: response.result.extendedProps.private.reminderTime,
        //  }
        //}
      });
      // Call any other methods you might need to update the UI, etc.
      this.scheduleNotification(eventDetails);
      this.showCreateEventModal = false;
      }).catch(error => {
        console.error("Error adding event to Google Calendar: ", error);
      });
    },

    /* editing events */
    handleEventClick(info) {
      this.selectedEvent = {
        id: info.event.id, // This is important for identifying the event in update/delete operations
        title: info.event.title,
        start: info.event.startStr, 
        end: info.event.endStr, 
        // reminderDescription: info.event.extendedProps.private.reminderDescription,
        // reminderTime: info.event.extendedProps.private.reminderTime,
      };
      this.showEditEventModal = true;
    },

    async updateEvent(updatedEventDetails) {
      try {
        // Make an API call to update the event in Google Calendar
        await window.gapi.client.calendar.events.update({
          calendarId: 'primary',
          eventId: updatedEventDetails.id, // Ensure this is passed from the EditEventModal
          resource: updatedEventDetails
        });

        // Refresh the events on the calendar after the update
        await this.loadEvents();
        this.showEditEventModal = false;
      } catch (error) {
        console.error("Error updating event: ", error);
        // Handle the error appropriately
      }
    },

    async deleteEvent(eventId) {
      try {
        // Make an API call to delete the event from Google Calendar
        await window.gapi.client.calendar.events.delete({
          calendarId: 'primary',
          eventId: eventId
        });

        // Refresh the events on the calendar after the delete
        await this.loadEvents();
        this.showEditEventModal = false;
      } catch (error) {
        console.error("Error deleting event: ", error);
        // Handle the error appropriately
      }
    },

    renderEventContent(arg) {
      let timeString = new Date(arg.event.start).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      let element = document.createElement('div');
      if (arg.event.extendedProps.type === 'reminder') {
        element.innerHTML = `<span class="reminder-icon">&#x1F514;</span> ${timeString} ${arg.event.title}`;
        element.classList.add('reminder-event');
      } else {
        element.innerHTML = `<span class="event-icon">&#x1F4C5;</span> ${timeString} ${arg.event.title}`;
        element.classList.add('regular-event');
      }
      return { domNodes: [element] };
    },
    scheduleNotification(eventDetails) {
      if ("Notification" in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            const localTimeOfEvent = new Date(eventDetails.start).getTime();
            const reminderTime = (eventDetails.reminderTime || 0) * 60000; // convert minutes to milliseconds
            const timeUntilReminder = localTimeOfEvent - new Date().getTime() - reminderTime;
            
            if (timeUntilReminder > 0) {
              // Schedule the notification if the reminder time is in the future
              setTimeout(() => {
                new Notification(`Reminder: ${eventDetails.reminderDescription}`, {
                body: `Event: ${eventDetails.title} starts at ${new Date(eventDetails.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`,
              // You can add other notification options here, such as icon
              });
              }, timeUntilReminder);
            } else {
              alert("Reminder time is in the past. No notification scheduled.");
            }
          }
        });
      }
    },
  },
  computed: {
    upcomingEvents() {
      const now = new Date();
      const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      return this.calendarOptions.events.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart >= now && eventStart <= twentyFourHoursLater;
      }).map(event => {
        return {
          ...event,
        };
      });
    }
  },

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
.regular-event {
  color: #5bc0de; /* Styling for regular events */
}
.reminder-icon, .event-icon {
  padding-right: 5px;
}
</style>