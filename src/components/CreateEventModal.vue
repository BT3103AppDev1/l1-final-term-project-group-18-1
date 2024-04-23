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

      <!-- This input field will be shown only when 'Create a custom reminder' is selected -->
      <div class="form-group" v-if="event.reminderType === 'custom'">
        <label for="reminder-description">Custom Reminder Description:</label>
        <input type="text" id="reminder-description" v-model="event.reminderDescription" placeholder="Enter custom reminder">
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
        reminderType: '', // Type of the reminder
        reminderDescription: '', // Custom description of the reminder
        reminderTime: null // Time before the event when the reminder should be sent (in minutes)
      }
    };
  },
  methods: {
    onReminderTypeChange() {
      // Clear the custom reminder description if the user goes back to a predefined reminder
      if (this.event.reminderType !== 'custom') {
        this.event.reminderDescription = this.event.reminderType;
      }
    },
    saveEvent() {
      const eventToSave = {
        ...this.event
      };

      // If the reminder type is not custom, use the type as the description
      if (this.event.reminderType !== 'custom') {
        eventToSave.reminderDescription = this.event.reminderType;
      }

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
  padding: 30px;
  z-index: 1000;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  width: 40%; /* Adjust the width as needed */
}

/* Styles for both input and select elements */
.form-group input,
.form-group select,
.form-group .action-buttons button {
  width: 100%;
  padding: 10px; /* Adjust padding to match your inputs */
  margin-bottom: 5px;
  border: 1px solid #ccc; /* Adjust border to match your inputs */
  border-radius: 4px; /* Rounded corners, if your inputs have them */
  box-sizing: border-box; /* To make sure padding does not affect the total width */
}

/* Style adjustments for select element */
.form-group select {
  -webkit-appearance: none; /* To remove default styling in Webkit browsers */
  -moz-appearance: none; /* To remove default styling in Firefox */
  appearance: none; /* To remove default styling */
  background-image: url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>'); /* Arrow icon */
  background-position: right 10px top 50%; /* Position for the arrow icon */
  background-repeat: no-repeat;
  background-size: 12px; /* Adjust size of the arrow icon */
  cursor: pointer; /* To indicate it's a dropdown */
  display: block;
}

/* Placeholder color */
.form-group input::placeholder,
.form-group select::placeholder {
  color: grey;
}

.form-group input:valid {
  color: black;
}

/* To remove default styling in IE */
.form-group select::-ms-expand {
  display: none;
}

/* You can also add a hover effect if you like */
.form-group select:hover {
  border-color: #888; /* Slightly darker border on hover */
}

</style>
