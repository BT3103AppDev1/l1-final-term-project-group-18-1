<template>
  <div class="upcoming-events">
    <ul>
      <li v-for="event in upcomingEvents" :key="event.id" class="event-item">
        <div>
          <b>{{ event.title }}</b>
        </div>
        <div>{{ formatDateTime(event.start) + ' to ' + formatDateTime(event.end)}}</div>
      </li>
    </ul>
    <div v-if="upcomingEvents.length === 0">No upcoming events in the next 24 hours.</div>
  </div>
</template>

<script>
import { auth, db } from '@/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default {
  name: 'UpcomingEvents',
  data() {
    return {
      upcomingEvents: []
    };
  },
  created() {
    this.fetchUpcomingEvents();
  },
  methods: {
    async fetchUpcomingEvents() {
      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Convert to local Singapore time
      const localNow = this.convertToSingaporeTime(now);
      const localNext24Hours = this.convertToSingaporeTime(next24Hours);

      const eventsRef = collection(db, 'users', auth.currentUser.uid, 'events');
      const q = query(
        eventsRef,
        where('start', '>=', localNow.toISOString()),
        where('start', '<', localNext24Hours.toISOString())
      );

      onSnapshot(q, (querySnapshot) => {
        this.upcomingEvents = [];
        querySnapshot.forEach((doc) => {
          const event = doc.data();
          event.id = doc.id;
          this.upcomingEvents.push(event);
        });
        console.log('Upcoming events within the next 24 hours:', this.upcomingEvents);
      });
    },

    convertToSingaporeTime(date) {
      // UTC+8 for Singapore
      const singaporeTimeOffset = 8 * 60 * 60 * 1000;
      return new Date(date.getTime() + singaporeTimeOffset);
    },

    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}, ${hours}:${minutes}`;
    }
  }
}
</script>

<style scoped>
.upcoming-events {
  margin-top: 20px;
}

.upcoming-events ul {
  list-style-type: none;
  padding: 0;
}

.event-item {
  background-color: white; 
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  width: 80%;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

.upcoming-events li {
  margin-bottom: 10px;
}
</style>
