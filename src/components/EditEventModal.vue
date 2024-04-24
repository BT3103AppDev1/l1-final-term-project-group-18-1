<template>
    <div class="modal">
      <form @submit.prevent="saveEvent">
        <h2 class="modaltitle">Edit Event</h2>
        
        <div class="form-group">
          <label for="title">Event Title:</label>
          <input type="text" id="title" v-model="editedEvent.title" placeholder="Event Title" required>
        </div>
  
        <div class="form-group">
          <label for="start">Start:</label>
          <input type="datetime-local" id="start" v-model="editedEvent.start" required>
        </div>
  
        <div class="form-group">
          <label for="end">End:</label>
          <input type="datetime-local" id="end" v-model="editedEvent.end" required>
        </div>
  
        <div class="form-group">
          <label for="reminder-type">Add Eco-Friendly Reminders:</label>
          <select id="reminder-type" v-model="editedEvent.reminderType" @change="onReminderTypeChange">
            <option value="">No Reminder</option>
            <option v-for="reminder in reminders" :key="reminder.id" :value="reminder.message">{{ reminder.message }}</option>
            <option value="custom">Custom</option>
        </select>
        </div>
  
        <div class="form-group" v-if="editedEvent.reminderType === 'custom'">
          <label for="reminder-description">Custom Reminder Description:</label>
          <input type="text" id="reminder-description" v-model="editedEvent.reminderDescription" placeholder="Enter custom reminder">
        </div>
  
        <div class="form-group" v-if="editedEvent.reminderType || editedEvent.reminderDescription">
          <label for="reminder-time">Reminder Time Before Event (minutes):</label>
          <input type="number" id="reminder-time" v-model="editedEvent.reminderTime" placeholder="Minutes before event">
        </div>
  
        <div v-if="!isEndTimeValid" class="error">
          End time must be after start time.
        </div>
  
        <div class="form-group action-buttons">
          <button class="button1" type="submit" :disabled="!isEndTimeValid">Save Changes</button>
          <button class="button2" type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
</template>
  
  <script>
  import { auth, db } from '@/firebaseConfig';
  import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
  
  export default {
    name: 'EditEventModal',
    props: {
      eventId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        editedEvent: {
          title: '',
          start: '',
          end: '',
          reminderType: '',
          reminderDescription: '',
          reminderTime: null
        },
        reminders: []
      };
    },
    computed: {
      isEndTimeValid() {
        return this.editedEvent.start < this.editedEvent.end;
      }
    },
    methods: {
      async fetchEventData() {
        try {
          const eventDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'events', this.eventId));
          if (eventDoc.exists()) {
            this.editedEvent = eventDoc.data();
          } else {
            console.error('Event does not exist');
          }

          const reminderRef = collection(db, 'reminders');
            getDocs(reminderRef)
                .then(querySnapshot => {
                this.reminders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                })
                .catch(error => {
                console.error("Error fetching reminders:", error);
                });
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      },
      async saveEvent() {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser.uid, 'events', this.eventId), this.editedEvent);
          this.$emit('close');
        } catch (error) {
          console.error('Error updating event:', error);
        }
      },
      onReminderTypeChange() {
        if (this.editedEvent.reminderType !== 'custom') {
          this.editedEvent.reminderDescription = '';
        }
      }
    },
    mounted() {
        this.fetchEventData();
    }
  };
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
  .placeholder {
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
  
  .error {
    color: #457247;
    margin-top: -10px;
    margin-bottom: 10px;
  }
  
  </style>
  