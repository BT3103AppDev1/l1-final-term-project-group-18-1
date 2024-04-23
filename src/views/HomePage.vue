<template>
  <div>
    <main>
      <h1>Home Page</h1>
      <!-- Events display section -->
      <div class="events-container">
        <h2>Upcoming Events</h2>
        <ul>
          <li v-for="event in upcomingEvents" :key="event.id">
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
      console.log('Accessing upcoming events from store:', this.$store.state.upcomingEvents);
      return this.$store.state.upcomingEvents;
    }
  }
};
</script>

<style>
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #f8f9fa;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
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
}
</style>
