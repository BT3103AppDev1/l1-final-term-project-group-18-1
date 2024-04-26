<template>
  <div class="modal">
    <form @submit.prevent="saveEvent">
      <h2 class="modaltitle">Create New Event</h2>
      
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

      <!-- There are 2 different kinds of reminders: pre-set reminders from firebase and custom reminders -->
      <div class="form-group">
        <label for="reminder-type">Add Eco-Friendly Reminders:</label>
        <select id="reminder-type" v-model="event.reminderType" @change="onReminderTypeChange">
          <option class="placeholder" disabled value="">Please select one</option>
          <option v-for="reminder in reminders" :key="reminder.id" :value="reminder.message">{{ reminder.message }}</option>
          <option class="custom-reminder-option" value="custom">Create a custom reminder</option>
        </select>
      </div>

      <!--If custom reminder type is chosen, the field custom reminder description will be shown.-->
      <div class="form-group" v-if="event.reminderType === 'custom'">
        <label for="reminder-description">Custom Reminder Description:</label>
        <input type="text" id="reminder-description" v-model="event.reminderDescription" placeholder="Enter custom reminder">
      </div>

      <div class="form-group" v-if="event.reminderType || event.reminderTime">
        <label for="reminder-time">Reminder Time Before Event (minutes):</label>
        <input type="number" id="reminder-time" v-model="event.reminderTime" placeholder="Minutes before event">
      </div>
      
      <!--Displaying of message if the time input is invalid.-->
      <div v-if="!isEndTimeValid" class="error">
        End time must be after start time.
      </div>

      <!-- Displaying of message to ensure that users submit the required fields for setting of reminders.-->
      <!--It is possible to create an event without a reminder. However, if the user fills in one of the reminder fields, they have to fill in all reminder fields.-->
      <div v-if="!isReminderValid" class="error">
        Please fill in all reminder-related fields.
      </div>

      <div class="form-group action-buttons">
        <!--Prevent creation of event if there are invalid inputs or missing fields.-->
        <button class="button1" type="submit" :disabled="!isEndTimeValid || !isReminderValid">Save Event</button>
        <!--Close the modal when user clicks on cancel-->
        <button class="button2" type="button" @click="$emit('close')">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import { auth, db } from '@/firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

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
      isReminderRequired: false,
      reminders: [],
    };
  },
  mounted() {
    this.fetchReminders(); // Fetch reminders when component is mounted
  },
  computed: {
    isEndTimeValid() {
      // user will still be filling in the fields
      if (!this.event.start || !this.event.end) {
        return true
        // both dates are filled in but the end date is before the start date
      } else {
        return this.event.start && this.event.end && new Date(this.event.end) > new Date(this.event.start);
      }
    },
    isReminderValid() {
      // suggested reminders
      if (this.event.reminderType && this.event.reminderType != 'custom') {
        return this.event.reminderTime;
      }
      // custom type chosen
      else if (this.event.reminderType == 'custom') {
        // if the reminder description or reminder time field is filled in, there will be a reminder for users to fill in all reminder-related fields.
        if (this.event.reminderDescription || this.event.reminderTime) {
          return this.event.reminderDescription && this.event.reminderTime;
        }
      } else {
        return true
      }
    }
  },
  methods: {
    fetchReminders() {
      // retrieve pre-set reminders from firebase reminders collection 
      const reminderRef = collection(db, 'reminders');
      getDocs(reminderRef)
        .then(querySnapshot => {
          this.reminders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        })
        .catch(error => {
          console.error("Error fetching reminders:", error);
        });
    },
    // to display the custom reminder description field if user chooses to set a custom reminder
    onReminderTypeChange() {
      if (this.event.reminderType !== 'custom') {
        this.event.reminderDescription = '';
      }
      this.isReminderRequired = this.event.reminderType || this.event.reminderTime;
    },
    saveEvent() {
      // Ensure all necessary fields are filled in
      if (!this.event.title || !this.event.start || !this.event.end || !this.isReminderValid) {
        alert("Please fill in all required fields.");
        return;
      }

      // Save event to Firestore
      addDoc(collection(db, 'users', auth.currentUser.uid, 'events'), {
        ...this.event,
        created: new Date() // Capture the creation date of the event
      })
      .then(() => {
        this.$emit('close');

        if (this.event.reminderType && this.event.reminderTime) {
          const eventStartTime = new Date(this.event.start).getTime();
          const currentTime = Date.now();
          const notificationTime = eventStartTime - (this.event.reminderTime * 60000); // Convert minutes to milliseconds
          
          // Check if the notification time is in the future
          if (notificationTime > currentTime) {
            // Schedule desktop notification for reminder
            setTimeout(() => {
              // Check if permission is granted for notifications
              if (Notification.permission === "granted") {
                let reminderMessage = '';
                if (this.event.reminderType === 'custom') {
                  // the reminder message input by user
                  reminderMessage = this.event.reminderDescription;
                } else {
                  // pre-set reminder
                  reminderMessage = this.event.reminderType;
                }
                new Notification(`Reminder: ${reminderMessage}`, {
                  body: `For Event: ${this.event.title}`,
                });
              } else if (Notification.permission !== "denied") {
                // ask for permission to send desktop notifcation
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    let reminderMessage = '';
                    if (this.event.reminderType === 'custom') {
                      // custom-reminder
                      reminderMessage = this.event.reminderDescription;
                    } else {
                      // pre-set reminder
                      reminderMessage = this.event.reminderType;
                    }
                    new Notification(`Reminder: ${reminderMessage}`, {
                      body: `For Event: ${this.event.title}`,
                    });
                  }
                });
              }
            }, notificationTime - currentTime);
          } else {
            console.error('Notification time is in the past. Skipping notification.');
          }
        }
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
  padding: 20px;
  z-index: 100001;
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
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 10px;
}
.modaltitle,
.custom-reminder-option {
  color:#457247;
}
.button1,
.button2 {
  width: 60%;
  align-self: center;
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

.reminder-type-form-group {
  padding-left: 10px; /* Adjust this value to suit your layout */
}
.form-group input {
  color: black;
}
.form-group select::-ms-expand {
  display: none;
}
.form-group select:hover {
  border-color: #888;
}
.form-group input::placeholder,
.form-group select::placeholder {
  color: black; 
}

.input {
  color: black;
}
.error {
  color: #457247;
  margin-top: -10px;
  margin-bottom: 10px;
}

</style>