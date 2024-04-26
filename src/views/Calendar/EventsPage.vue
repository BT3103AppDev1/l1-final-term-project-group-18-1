<template>
    <div>
      <h1 class="main-title">
        Stay Organised, Live Sustainably: Your Eco-Friendly Calendar
      </h1>
      <button class = "add-event-button" @click="showAddEventModal = true">
        Add Event
        </button>
      <!-- Modal for adding of events-->
      <AddEventModal v-if="showAddEventModal" @close="showAddEventModal = false" @save="handleSave" />
      <!-- Calendar display -->
      <FullCalendar :options="calendarOptions"/>
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebaseConfig';
  import { collection, query, onSnapshot } from 'firebase/firestore';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import AddEventModal from '@/components/AddEventModal.vue';
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  
  export default {
    components: {
      AddEventModal,
      FullCalendar
    },
    data() {
      return {
        showAddEventModal: false,
        selectedEvent: null,
        events: [],
        calendarOptions: {
          plugins: [dayGridPlugin],
          initialView: 'dayGridMonth',
          events: this.events, // events fetched from firebase
          eventColor: '#457247',
          eventTimeFormat: { // in 24h format
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
        this.showAddEventModal = false; 
        // Close showAddEventModal after saving
      },
      // ensure that user is signed in in order for data to be fetched
      initialiseDataWithUserCheck() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("User is signed in, initializing data.");
            await this.initialiseUserData();
          } else {
            console.error("No user is signed in. Redirecting to login.");
          }
        });
      },
      async initialiseUserData() {
        const user = auth.currentUser;
        if (user) {
          // go to user's event collection
          const q = query(collection(db, 'users', user.uid, 'events'));
          this.unsubscribe = onSnapshot(q, (snapshot) => {
            // retrieve event details required for display
            this.events = snapshot.docs.map(doc => ({
              id: doc.id,
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
    },
    mounted() {
      this.initialiseDataWithUserCheck();
    }
  };
  </script>
  
<style>
.main-title {
font-size: 2rem;
color: #457247;
}

.add-event-button {
width: 30%;
}

</style>
  