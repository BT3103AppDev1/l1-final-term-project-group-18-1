<template>
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        <li v-for="event in events" :key="event.id">
          {{ event.title }} at {{ event.start }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UpcomingEvents',
    props: ['events']
  }
  </script>
  