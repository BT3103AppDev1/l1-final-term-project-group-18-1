<template>
  <div class="modal">
    <form @submit.prevent="submitEvent">
      <h2>Create New Event</h2> 

      <label for="title">Event Title:</label>
      <input type="text" id="title" v-model="event.title" placeholder="Event Title" required>

      <label for="start">Start Time:</label>
      <input type="datetime-local" id="start" v-model="event.start" required>

      <label for="end">End Time:</label>
      <input type="datetime-local" id="end" v-model="event.end" required>

      <button type="submit">Save Event</button>
      <button type="button" @click="$emit('close')">Cancel</button> 
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateEventModal',
  data() {
    return {
      event: {
        title: '',
        start: '',
        end: '',
        allDay: false,
      }
    };
  },
  methods: {
    submitEvent() {
      // Convert strings to Date objects for comparison
      const startDateTime = new Date(this.event.start);
      const endDateTime = new Date(this.event.end);

      // Ensure date and time checks are appropriate
      if (startDateTime >= endDateTime) {
        alert("The end time must be after the start time.");
        return;
      }

      // Ensure both dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        alert("Please enter valid start and end times.");
        return;
      }

      // Emitting the custom event object instead of the native event
      this.$emit('submit', {
        title: this.event.title,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        allDay: this.event.allDay
      });
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  z-index: 1000;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</style>
