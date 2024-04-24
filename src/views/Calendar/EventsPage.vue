<template>
    <div>
      <h1>Events Page</h1>
      <button @click="showAddEventModal = true">Add Event</button>
      <AddEvent v-if="showAddEventModal" @close="showAddEventModal = false" @save="handleSave" />
  
      <FullCalendar :options="calendarOptions" />
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebaseConfig';
  import { collection, query, onSnapshot } from 'firebase/firestore';
  import AddEvent from './AddEvent.vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';

  export default {
    components: {
      AddEvent,
      FullCalendar
    },
    data() {
      return {
        showAddEventModal: false,
        events: [],
        calendarOptions: {
          plugins: [dayGridPlugin],
          initialView: 'dayGridMonth',
          events: this.events,
          eventTimeFormat: { // like '14:30', for 2:30pm
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }
        }
      };
    },
    methods: {
      handleSave(eventData) {
        console.log('Event saved', eventData);
        this.showAddEventModal = false; // Close modal after saving
      }
    },
    async mounted() {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'users', user.uid, 'events'));
        this.unsubscribe = onSnapshot(q, (snapshot) => {
          this.events = snapshot.docs.map(doc => ({
            title: doc.data().title,
            start: doc.data().start,
            end: doc.data().end
          }));
          this.calendarOptions.events = this.events;
        });
      } else {
        console.error('User not logged in');
      }
    }
  };
  </script>
  