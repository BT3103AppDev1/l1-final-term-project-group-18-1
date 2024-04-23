<template>
    <div class="item-logger"> 
      <input
        type="number"
        v-model.number="itemCount" 
        placeholder="Enter quantity..."
        class="item-count-input"
        min="1"
      /> 
      <label class ="checkbox-label">
            <input type="checkbox" v-model="isClean" />
            <span class="checkbox-custom"></span>
            Item is clean/rinsed <span class="required-asterisk">*</span>
      </label>
      <span class="required-text"><span class="required-asterisk">*</span> Required</span>
      <button @click="logItem">Let's Recycle</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p> <!-- Error message will show up if it exists -->   
     </div>
  </template>
  
  <script>
  import { db } from '../firebaseConfig'; 
  import { collection, addDoc, doc, getDoc, query, updateDoc, where, getDocs, increment } from 'firebase/firestore'; 
  import { getAuth } from 'firebase/auth';  // Import getAuth function to access authentication

  
  export default {
    data() {
      return {
        itemCount: '', 
        errorMessage: '', // Initialize error message as empty
        isClean: false, // Tracks the state of the checkbox
        username: ''
      };
    },
    props: {
        searchQuery: String,
        item: Object,
    },
    //debugging
    watch: {
    item(newVal) {
        console.log("New item received in itemLogger:", newVal);
    }
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
                    console.log("fetched user")
                } else {
                    console.log("No such user!");
                }
            } else {
                console.log("No user is signed in.");
            }
     },
     
     async logItem() {
        console.log("Received item as:", this.item);

        const now = new Date();
        //const now = new Date('2024-11-29');//testing
        const day = now.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day of the week as a string
        const month = now.toLocaleString('default', { month: 'long' }); // Get the current month as a string
        const dayField = day + 'Count'; // Create the field name, e.g., 'MondayCount'
        const monthField = month + 'Count'; // Create the field name for the month, e.g., 'JanuaryCount'

        // Basic validation for item details
        if (!this.item || !this.item.name) {
            this.errorMessage = 'Item details are not available. Please try again.';
            return; // Stop further execution if no item or item name
        }

        // Validation for user inputs
        if (!this.isClean) {
            this.errorMessage = 'Please ensure that all items are clean/rinsed.';
            return;
        }

        if (this.itemCount === '' || this.itemCount === null) {
            this.errorMessage = 'Please do not leave the quantity field empty.';
            return;
        }

        if (this.itemCount <= 0) {
            this.errorMessage = 'Please enter a quantity more than 0.';
            return;
        }


          // construct a query to find existing document of user and item in database
            const itemsRef = collection(db, "recycledDatabase");
            const q = query(itemsRef, where("username", "==", this.username), where("itemName", "==", this.item.name));
        
        // query to find existing document in users collection by username
            const usersRef = collection(db, "users");
            const p = query(usersRef, where("username", "==", this.username));

        // query to find existing document in recycledDataSummary collection by username
            const summaryRef = collection(db, "recycledDataSummary");
            const r = query(summaryRef, where("username", "==", this.username));
        
        try {
            //logging item in recycledDatabase
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                await addDoc(itemsRef, {
                    itemName: this.item.name,
                    quantity: this.itemCount,
                    isClean: this.isClean,
                    username: this.username,
                });
                console.log("New item logged successfully.");
            } else {
                querySnapshot.forEach(async (doc) => {
                    const newQuantity = doc.data().quantity + this.itemCount;
                    await updateDoc(doc.ref, {
                        quantity: newQuantity,
                        isClean: this.isClean,
                    });
                });
                console.log("Item quantity updated successfully.");
            }
            
            //logging fertiliser and numRecycled for each in users collection
            const querySnapshotUsers = await getDocs(p);
            querySnapshotUsers.forEach(async (doc) => {
                const updateData = {
                    fertiliser: increment(this.itemCount),
                    numRecycled: increment(this.itemCount), // Increment numRecycled count
                };
                if (this.item.category === "metal") {
                    updateData.metalRecycled = increment(this.itemCount); // Increment metalRecycled count if item category is metal
                }
                if (this.item.category === "plastic") {
                    updateData.plasticRecycled = increment(this.itemCount); // Increment metalRecycled count if item category is metal
                }
                if (this.item.category === "paper") {
                    updateData.paperRecycled = increment(this.itemCount); // Increment metalRecycled count if item category is metal
                }
                if (this.item.category === "glass") {
                    updateData.glassRecycled = increment(this.itemCount); // Increment metalRecycled count if item category is metal
                }
                if (this.item.category === "e-waste") {
                    updateData.ewasteRecycled = increment(this.itemCount); // Increment metalRecycled count if item category is metal
                }
                await updateDoc(doc.ref, updateData);
                console.log("Fertilizer count updated successfully for user:", this.username);
            });


            //logging into recycledDataSummary
            const querySnapshotSummary = await getDocs(r);
            if (querySnapshotSummary.empty) {
                await addDoc(summaryRef, {
                    username: this.username,
                    [dayField]: this.itemCount, 
                    [monthField]: this.itemCount, 
                    currWeeklyAvg: 1,
                });
                console.log("created document for user to store in recycledDataSummary");
            } else {
                querySnapshotSummary.forEach(async (doc) => {
                    await updateDoc(doc.ref, {
                        [dayField]: increment(this.itemCount),  
                        [monthField]: increment(this.itemCount),  
                    });
                });
                console.log("Item quantity updated successfully for each day.");
            }

            
        this.resetInputs();
        alert("Item logged and fertilisers updated successfully!");
        } catch (error) {
            console.error("Error logging item:", error);
            this.errorMessage = 'Failed to log the item. Please try again.';
        }
    },

    // Reset input fields after successful logging
    resetInputs() {
        this.itemCount = ''; // Reset to default value
        this.isClean = false; // Reset checkbox
        this.errorMessage = ''; // Clear any error messages
    },

    },
  };
  </script>
  
  <style scoped>
    .error-message {
        color: red;
    }

    .required-asterisk{
        color: red;
    }
  </style>
  
