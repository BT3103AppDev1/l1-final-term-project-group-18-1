<template>
    <div class="modal">
      <form @submit.prevent="saveEvent">
        <h2>Edit Event</h2>
        
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
          <button type="submit">Save Changes</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebaseConfig';
  import { doc, updateDoc } from 'firebase/firestore';
  
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
        event: {
          title: '',
          start: '',
          end: '',
          allDay: false,
          reminderType: '',
          reminderDescription: '',
          reminderTime: null
        }
      };
    },
    async mounted() {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'events', this.eventId);
        const docSnap = await docRef.get();
        if (docSnap.exists()) {
          this.event = docSnap.data();
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    },
    methods: {
      async saveEvent() {
        try {
          const docRef = doc(db, 'users', auth.currentUser.uid, 'events', this.eventId);
          await updateDoc(docRef, {
            title: this.event.title,
            start: this.event.start,
            end: this.event.end,
            reminderType: this.event.reminderType,
            reminderDescription: this.event.reminderDescription,
            reminderTime: this.event.reminderTime
          });
          alert('Event successfully updated!');
          this.$emit('close');
        } catch (error) {
          console.error('Error updating document:', error);
          alert('Error updating the event. Please try again.');
        }
      },
      cancelEdit() {
        this.$emit('close');
      },
      onReminderTypeChange() {
        if (this.event.reminderType !== 'custom') {
          this.event.reminderDescription = '';
        }
      }
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
  