<template>
    <div class="modal">
      <form @submit.prevent="saveReminder">
        <label for="title">Reminder Title:</label>
        <input type="text" id="title" v-model="reminder.title" required>
  
        <label for="start">Start Time:</label>
        <input type="datetime-local" id="start" v-model="reminder.start" required>

        <button type="submit">Save Reminder</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </form>
    </div>
</template>
  
<script>
export default {
  name: 'AddReminderModal',
  data() {
    return {
      reminder: {
        title: '',
        start: '',
        allDay: false
      }
    };
  },
  methods: {
    saveReminder() {
      // Set end time to 1 minute after start time before emitting save
      const startTime = new Date(this.reminder.start);
      const endTime = new Date(startTime.getTime() + 60000); // 60,000 milliseconds = 1 minute
      const reminderToSave = {
        ...this.reminder,
        end: endTime.toISOString()
      };

      this.$emit('save', reminderToSave);
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
