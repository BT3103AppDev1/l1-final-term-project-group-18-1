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
        <label for="reminder-type">Type of Reminder:</label>
        <select id="reminder-type" v-model="event.reminderType" @change="onReminderTypeChange">
          <option disabled value="">Please select one</option>
          <option>Bring a reusable bag along!</option>
          <option>Leave now to catch the bus!</option>
          <option>Bring my meal container</option>
          <option value="custom">Create a custom reminder</option>
        </select>
      </div>

      <div class="form-group" v-if="event.reminderType === 'custom'">
        <label for="reminder-description">Custom Reminder Description:</label>
        <input type="text" id="reminder-description" v-model="event.reminderDescription" placeholder="Enter custom reminder">
      </div>

      <div class="form-group" v-if="event.reminderType || event.reminderTime">
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
import { auth, db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default {
  name: 'CreateEventModal',
  data() {
    return {
      event: {
        title: '',
        start: '',
        end: '',
        allDay: false,
        reminderType: '',
        reminderDescription: '',
        reminderTime: null
      },
      isReminderRequired: false
    };
  },
  methods: {
    onReminderTypeChange() {
      if (this.event.reminderType !== 'custom') {
        this.event.reminderDescription = '';
      }
      this.isReminderRequired = this.event.reminderType || this.event.reminderTime;
    },
    saveEvent() {
      // Ensure all necessary fields are filled in
      if (!this.event.title || !this.event.start || !this.event.end) {
        alert("Please fill in all required fields.");
        return;
      }

      // Check if reminders-related fields are filled in if required
      if (this.isReminderRequired && (!this.event.reminderType || !this.event.reminderTime)) {
        alert("Please fill in both reminders-related fields.");
        return;
      }

      // Save event to Firestore
      addDoc(collection(db, 'users', auth.currentUser.uid, 'events'), {
        ...this.event,
        created: new Date() // Capture the creation date of the event
      })
      .then(() => {
        alert('Event successfully added!');
        this.$emit('close');
      })
      .catch(error => {
        console.error('Error adding document: ', error);
        alert('Error saving the event. Please try again.');
      });
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
  padding: 30px;
  z-index: 1000;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  width: 40%;
}
.form-group input,
.form-group select,
.form-group .action-buttons button {
  width: 100%;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.form-group select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-position: right 10px top 50%;
  background-repeat: no-repeat;
  background-size: 12px;
  cursor: pointer;
  display: block;
}
.form-group input::placeholder,
.form-group select::placeholder {
  color: grey;
}
.form-group input:valid {
  color: black;
}
.form-group select::-ms-expand {
  display: none;
}
.form-group select:hover {
  border-color: #888;
}
</style>
