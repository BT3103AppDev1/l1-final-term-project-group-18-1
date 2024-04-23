<template>
  <div>
    <main>
      <h1 class="main-title">Thank you for making the Earth a better place!</h1>
      <!-- Events display section -->
      <div class="events-container">
        <h2>Upcoming Events</h2>
        <ul>
          <li v-for="event in formattedUpcomingEvents" :key="event.id">
            <strong>{{ event.title }}</strong> - {{ event.start }} to {{ event.end }}
            <!-- Conditionally render the description if it exists -->
            <p v-if="event.description">{{ event.description }}</p>
          </li>
        </ul>
      </div>
      <SearchBar />
    </main>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue';

export default {
  components: {
    SearchBar // Corrected component registration
  },
  computed: {
    upcomingEvents() {
      return this.$store.state.upcomingEvents;
    },
    formattedUpcomingEvents() {
      return this.upcomingEvents.map(event => ({
        ...event,
        start: new Date(event.start).toLocaleString(), // Format 'start' date
        end: new Date(event.end).toLocaleString() // Format 'end' date
      }));
    }
  }
};
</script>

<style>
.main-title {
  font-weight: bold; 
  color: #457247;
}

main {
  padding-top: 60px;
}

.events-container h2 {
  margin-top: 20px;
}

.events-container ul {
  list-style-type: none;
  padding: 0;
}

.events-container li {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  width: auto; /* Adjusted for potentially wider formatted date strings */
}
</style>
