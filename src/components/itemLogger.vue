<template>
    <div class="item-logger"> 
      <input
        type="number"
        v-model.number="itemCount" 
        placeholder="Enter quantity..."
        class="item-count-input"
        min="1"
      /> 
      <label>
      <input type="checkbox" v-model="isClean" />
            Item is clean/rinsed
      </label>
      <button @click="logItem">Let's Recycle</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p> <!-- Error message will show up if it exists -->
     </div>
  
  </template>
  
  <script>
  import { db } from '../firebaseConfig'; 
  import { collection, addDoc, doc, getDoc } from 'firebase/firestore'; 
  import { getAuth } from 'firebase/auth';  // Import getAuth function to access authentication
  
  export default {
    data() {
      return {
        itemCount: 1, // Default to 1, assuming they are recycling at least one item
        errorMessage: '', // Initialize error message as empty
        isClean: false, // Tracks the state of the checkbox
        username: '',
        item: null,
      };
    },
    props: {
        searchQuery: String,
        item: Object,
    },
    computed: {
        isInputValid() {
            return this.itemCount && this.itemCount > 0 && this.isClean && this.username; // Check if the input is a number and greater than 0
        }
    },
    mounted() {
        this.fetchUsername();
    },
    methods: {
      async fetchUsername() {
        const auth = getAuth();
        const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    this.username = userSnap.data().username;
                } else {
                    console.log("No such user!");
                }
            } else {
                console.log("No user is signed in.");
            }
     },
      async logItem() {
            // Check if item is available and has a name
            console.log("received item as" + this.item)
            if (!this.item || !this.item.name) {
                //this.errorMessage = 'Item details are not available. Please try again.';
                return; // Stop further execution if no item or item name
            }
            if (this.isInputValid) {
                await addDoc(collection(db, "recycledDatabase"), {
                    itemName: this.item.name, // Assuming you have the item's name
                    quantity: this.itemCount,
                    isClean: this.isClean,
                    username: this.username, // Use the username from data
                });
            console.log("Item logged successfully.");
            this.itemCount = ''; // Reset the itemCount
            this.errorMessage = ''; // Clear any error message
            this.isClean = false; //reset the status
        } else {
            this.errorMessage = !this.itemCount || this.itemCount <= 0 ? 'Please enter a valid quantity (at least 1).' : 
                                !this.isClean ? 'Please ensure the item is clean/rinsed before logging.' : '';
        }
        },
    },
  };
  </script>
  
  <style scoped>
    .error-message {
        color: red;
    }
  </style>
  