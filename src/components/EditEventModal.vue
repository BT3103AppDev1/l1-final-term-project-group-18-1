<template>
    <div class="modal" v-if="visible">
        <form @submit.prevent="submitForm">
            <h2>Edit Event</h2>

            <div class="form-group">
                <label for="edit-title">Event Title:</label>
                <input type="text" id="edit-title" v-model="eventDetails.title" required>
            </div>

            <div class="form-group">
                <label for="edit-start">Start:</label>
                <input type="datetime-local" id="edit-start" v-model="eventDetails.start" required>
            </div>

            <div class="form-group">
                <label for="edit-end">End:</label>
                <input type="datetime-local" id="edit-end" v-model="eventDetails.end" required>
            </div>

            <div class="form-group">
                <label for="edit-reminder-type">Type of Reminder:</label>
                <select id="edit-reminder-type" v-model="eventDetails.reminderType" @change="onReminderTypeChange">
                    <option disabled value="">Please select one</option>
                    <option>Bring a reusable bag along!</option>
                    <option>Leave now to catch the bus!</option>
                    <option>Bring my meal container</option>
                    <option value="custom">Custom reminder</option>
                </select>
            </div>

            <div class="form-group" v-if="eventDetails.reminderType === 'custom'">
                <label for="edit-reminder-description">Custom Reminder Description:</label>
                <input type="text" id="edit-reminder-description" v-model="eventDetails.reminderDescription" placeholder="Enter custom reminder">
            </div>

            <div class="form-group">
                <label for="edit-reminder-time">Reminder Time Before Event (minutes):</label>
                <input type="number" id="edit-reminder-time" v-model="eventDetails.reminderTime" placeholder="Minutes before event">
            </div>

            <div class="form-group action-buttons">
                <button type="button" @click="updateEvent">Update Event</button>
                <button type="button" @click="confirmDeleteEvent">Delete Event</button>
                <button type="button" @click="$emit('close')">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'EditEventModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        eventDetails: {
            type: Object,
            default: () => ({
                id: '',
                title: '',
                start: '',
                end: '',
                reminderType: '',
                reminderDescription: '',
                reminderTime: null
            })
        }
    },
    methods: {
        onReminderTypeChange() {
            // Clear the custom reminder description if the user goes back to a predefined reminder
            if (this.eventDetails.reminderType !== 'custom') {
                this.eventDetails.reminderDescription = this.eventDetails.reminderType;
            }
        },
        submitForm() {
            // Additional validation logic before update
            this.updateEvent();
        },
        updateEvent() {
            // Emit an event to the parent component to update the event
            this.$emit('update', this.eventDetails);
        },
        confirmDeleteEvent() {
            if (confirm("Are you sure you want to delete this event?")) {
                this.deleteEvent();
            }
        },
        deleteEvent() {
            // Emit an event to the parent component to delete the event
            this.$emit('delete', this.eventDetails.id);
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
    z-index: 1050; /* Increase z-index if needed to ensure it's above other content */
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    width: auto; /* Adjust width as needed */
    max-width: 500px; /* Maximum width of the modal */
    min-width: 300px; /* Minimum width of the modal */
    max-height: 90vh; /* Maximum height to ensure it doesn't go off screen */
    overflow-y: auto; /* Allows scrolling within the modal if content is too long */
    }

    /* Styles for both input and select elements */
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

    /* Style adjustments for select element */
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
    border-color: #888;
    }

    /* Ensure the modal is centered on mobile screens */
    @media (max-width: 768px) {
    .modal {
        width: 90%;
        margin: auto;
    }
    }
</style>
