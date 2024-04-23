<template>
  <div>
    <main>
      <h1 class="main-title">Thank you for making the Earth a better place!</h1>
      <!-- Events display section -->
      <div class="events-container">
        <h2 class="second-heading">Upcoming Events</h2>
        <div class="events-list">
          <div class="event" v-for="event in formattedUpcomingEvents" :key="event.id">
            <div class="event-box">
              <strong>{{ event.title }}</strong><br>
              {{ event.start }} to {{ event.end }}
            </div>
          </div>
        </div>
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

.events-container {
  margin-top: 20px;
  background-color: #ffe1b0;
  padding: 20px;
  border-radius: 10px; /* Rounded corners */
}

.events-container h2 {
  margin-top: 0;
}

.event-box {
  padding: 10px;
  background-color: #ffffff; /* White background */
  border-radius: 8px; /* Rounded corners */
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow effect */
  color: #333333; /* Dark grey text color */
}

.second-heading {
  color: #333333;
}
</style>
