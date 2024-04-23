<template>
  <div class="modal">
    <form @submit.prevent="saveEvent">
      <h2>Create New Event</h2> 

      <label for="title">Event Title:</label>
      <input type="text" id="title" v-model="event.title" placeholder="Event Title" required>

      <label for="start">Start:</label>
      <input type="datetime-local" id="start" v-model="event.start" required>

      <label for="end">End:</label>
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
      allDay: false
    }
  };
},
methods: {
  saveEvent() {
    const startTime = new Date(this.event.start);
    const endTime = new Date(this.event.end)
    const eventToSave = {
      ...this.event
    };

    this.$emit('save', eventToSave);
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