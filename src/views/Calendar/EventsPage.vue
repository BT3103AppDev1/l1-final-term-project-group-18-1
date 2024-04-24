<template>
    <div>
      <h1>Events Page</h1>
      <button @click="showAddEventModal = true">Add Event</button>
      <AddEvent v-if="showAddEventModal" @close="showAddEventModal = false" @save="handleSave" />
  
      <div v-if="events.length === 0">
        No events found.
      </div>
      <ul v-else>
        <li v-for="(event, index) in events" :key="index">
          <h2>{{ event.title }}</h2>
          <p>Start: {{ event.start }}</p>
          <p>End: {{ event.end }}</p>
          <!-- You can display other event details here -->
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { auth, db } from '@/firebaseConfig';
  import { collection, query, onSnapshot } from 'firebase/firestore';
  import AddEvent from './AddEvent.vue';
  
  export default {
    components: {
      AddEvent
    },
    data() {
      return {
        showAddEventModal: false,
        events: [],
        unsubscribe: null
      };
    },
    methods: {
      handleSave(eventData) {
        // handle event data, e.g., save to a database or state management
        console.log('Event saved', eventData);
        this.showAddEventModal = false; // Close modal after saving
      }
    },
    async mounted() {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, 'users', user.uid, 'events'));
          this.unsubscribe = onSnapshot(q, (snapshot) => {
            this.events = []; // Clear existing events
            snapshot.forEach((doc) => {
              this.events.push(doc.data());
            });
          });
        } else {
          console.error('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  };
  </script>
  