<template>
  <div class="modal">
    <form @submit.prevent="saveEvent">
      <h2>Create New Event</h2>
      
      <div class="form-group">
        <label for="title">Event Title:</label>
        <input type="text" id="title" v-model="event.title" placeholder="Event Title" required>
      </div>

      <div class="form-group">
        <label for="start">Start:</label>
        <input type="datetime-local" id="start" v-model="event.start" required>
      </div>

      <div class="form-group">
        <label for="end">End:</label>
        <input type="datetime-local" id="end" v-model="event.end" required>
      </div>

      <div class="form-group">
        <label for="reminder-description">Reminder Description:</label>
        <input type="text" id="reminder-description" v-model="event.reminderDescription" placeholder="Reminder Description">
      </div>

      <div class="form-group">
        <label for="reminder-time">Reminder Time Before Event (minutes):</label>
        <input type="number" id="reminder-time" v-model="event.reminderTime" placeholder="Minutes before event">
      </div>

      <div class="form-group action-buttons">
        <button type="submit">Save Event</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </div>
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
        reminderDescription: '',  // Description of the reminder
        reminderTime: null        // Time before the event when the reminder should be sent (in minutes)
      }
    };
  },
  methods: {
    saveEvent() {
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
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label,
.form-group input,
.form-group .action-buttons button {
  width: 100%;
  margin-bottom: 5px;
}

.form-group .action-buttons {
  display: flex;
  justify-content: space-between;
}

.form-group .action-buttons button {
  margin-top: 10px; /* Adds space above the buttons */
}
</style>
