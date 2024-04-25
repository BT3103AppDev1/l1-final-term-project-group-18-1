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

      <div class="form-group">
        <label for="reminder-type">Add Eco-Friendly Reminders:</label>
        <select id="reminder-type" v-model="event.reminderType" @change="onReminderTypeChange">
          <option class="placeholder" disabled value="">Please select one</option>
          <option v-for="reminder in reminders" :key="reminder.id" :value="reminder.message">{{ reminder.message }}</option>
          <option class="custom-reminder-option" value="custom">Create a custom reminder</option>
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

      <div v-if="!isEndTimeValid" class="error">
        End time must be after start time.
      </div>

      <div v-if="!isReminderValid" class="error">
        Please fill in both reminder-related fields.
      </div>

      <div class="form-group action-buttons">
        <button class="button1" type="submit" :disabled="!isEndTimeValid || !isReminderValid">Save Event</button>
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
      if (!this.event.start || !this.event.end) {
        return true
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
      const reminderRef = collection(db, 'reminders');
      getDocs(reminderRef)
        .then(querySnapshot => {
          this.reminders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        })
        .catch(error => {
          console.error("Error fetching reminders:", error);
        });
    },
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

        // Schedule desktop notification for reminder
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
                  reminderMessage = this.event.reminderDescription;
                } else {
                  reminderMessage = this.event.reminderType;
                }
                new Notification(`Reminder: ${reminderMessage}`, {
                  body: `For Event: ${this.event.title}`,
                });
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    let reminderMessage = '';
                    if (this.event.reminderType === 'custom') {
                      reminderMessage = this.event.reminderDescription;
                    } else {
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
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
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
.form-group input::placeholder,
.form-group select::placeholder,
#remindertype .placeholder {
  color: grey !important;
}
.reminder-type-form-group input::placeholder,
.reminder-type-form-group select::placeholder {
  color: grey !important;
}
.reminder-type-form-group {
  padding-left: 10px; /* Adjust this value to suit your layout */
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

.error {
  color: #457247;
  margin-top: -10px;
  margin-bottom: 10px;
}

</style>