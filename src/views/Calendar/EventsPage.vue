<template>
    <div>
      <h1 class="main-title">
        Stay Organised, Live Sustainably: Your Eco-Friendly Calendar
      </h1>
      <button class = "add-event-button" @click="showAddEventModal = true">
        Add Event
        </button>
      <AddEventModal v-if="showAddEventModal" @close="showAddEventModal = false" @save="handleSave" />
      <FullCalendar :options="calendarOptions"/>
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebaseConfig';
  import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
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
          events: this.events,
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
      initializeDataWithUserCheck() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("User is signed in, initializing data.");
            await this.initializeUserData();
          } else {
            console.error("No user is signed in. Redirecting to login.");
          }
        });
      },
      async initializeUserData() {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, 'users', user.uid, 'events'));
          this.unsubscribe = onSnapshot(q, (snapshot) => {
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
      this.initializeDataWithUserCheck();
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
  