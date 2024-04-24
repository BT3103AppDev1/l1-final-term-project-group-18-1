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
      <div v-if="loading" class="loading-spinner">
            Loading...
       </div>
     </div>
  </template>
  
  <script>
  import { db } from '../firebaseConfig'; 
  import { collection, addDoc, doc, getDoc, setDoc, query, updateDoc, where, getDocs, increment } from 'firebase/firestore'; 
  import { getAuth } from 'firebase/auth';  // Import getAuth function to access authentication

  
  export default {
    data() {
      return {
        itemCount: '', 
        errorMessage: '', // Initialize error message as empty
        isClean: false, // Tracks the state of the checkbox
        username: '',
        loading: false
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
       getWeekNumber(d) {
            // Copy date so don't modify original
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            // Get first day of year
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            // Calculate full weeks to nearest Thursday
            const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
            // Return array of year and week number
            return [d.getUTCFullYear(), weekNo];
       },
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
        this.loading = true;
        console.log("Received item as:", this.item);

        //const now = new Date();
        const now = new Date('2024-05-09');//testing
        const day = now.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day of the week as a string
        const month = now.toLocaleString('default', { month: 'long' }); // Get the current month as a string
        const dayField = day + 'Count'; // Create the field name, e.g., 'MondayCount'
        const monthField = month + 'Count'; // Create the field name for the month, e.g., 'JanuaryCount'

         const [year, weekNumber] = this.getWeekNumber(now);

        // Basic validation for item details
        if (!this.item || !this.item.name) {
            this.errorMessage = 'Item details are not available. Please try again.';
            this.loading = false;
            return; // Stop further execution if no item or item name
        }

        // Validation for user inputs
        if (!this.isClean) {
            this.errorMessage = 'Please ensure that all items are clean/rinsed.';
            this.loading = false;
            return;
        }

        if (this.itemCount === '' || this.itemCount === null) {
            this.errorMessage = 'Please do not leave the quantity field empty.';
            this.loading = false;
            return;
        }

        if (this.itemCount <= 0) {
            this.errorMessage = 'Please enter a quantity more than 0.';
            this.loading = false;
            return;
        }     
        
        try {
            //logging item in recycledDatabase
            // construct a query to find existing document of user and item in database
            const itemsRef = collection(db, "recycledDatabase");
            const q = query(itemsRef, where("username", "==", this.username), where("itemName", "==", this.item.name));
        
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
            // query to find existing document in users collection by username
            const usersRef = collection(db, "users");
            const p = query(usersRef, where("username", "==", this.username));
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
            // const querySnapshotSummary = await getDocs(r);
            // if (querySnapshotSummary.empty) {
            //     await addDoc(summaryRef, {
            //         username: this.username,
            //         [dayField]: this.itemCount, 
            //         [monthField]: this.itemCount, 
            //         currWeekCount: 1, 
            //         currWeeklyAvgSum:0,
            //     });
            //     console.log("created document for user to store in recycledDataSummary");
            // } else {
            //     querySnapshotSummary.forEach(async (doc) => {
            //         await updateDoc(doc.ref, {
            //             [dayField]: increment(this.itemCount),  
            //             [monthField]: increment(this.itemCount),  
            //         });
            //     });
            //     console.log("Item quantity updated successfully for each day.");
            // }

            
            //get currentWeekCount for user 

            let currWeekCount = await this.retrieveCurrWeekCount(this.username);
            
            //get the days logged for this week
            const daysLogged = await this.countLoggedDays(this.username, year, weekNumber, dayField);

            //get the currentAvgSum across the whole database
            const totalAvg = await this.sumUserWeeklyAverages(this.username,dayField);

            // query to find existing document in recycledDataSummary collection by week
            const summaryRef = collection(db, "recycledDataSummary");
            //const r = query(summaryRef, where("username", "==", this.username));
            const weekDocId = `${this.username}_${year}_week_${weekNumber}`;
            const weeklyDocRef = doc(summaryRef, weekDocId);

            const weeklyDocSnap = await getDoc(weeklyDocRef);

            if (!weeklyDocSnap.exists()) {
                console.log("updating week count from" + currWeekCount)
                currWeekCount++
                console.log("updated to" + currWeekCount)
                await setDoc(weeklyDocRef, {
                    username: this.username,
                    year: year,
                    weekNumber: weekNumber,
                    [dayField]: this.itemCount, 
                    [monthField]: this.itemCount, 
                    currWeekCount: currWeekCount, 
                    currWeekAvg: 1,
                    currWeeklyAvgSum: totalAvg,
            });
            console.log("Created new document for the week.");
            } else {     
                await updateDoc(weeklyDocRef, {
                    [dayField]: increment(this.itemCount),
                    [monthField]: increment(this.itemCount),
                    currWeekAvg:daysLogged,
                    currWeeklyAvgSum: totalAvg,
                });
                console.log("Updated document for the week.");
            }
            
        this.resetInputs();
        alert("Item logged and fertilisers updated successfully!");
        } catch (error) {
            console.error("Error logging item:", error);
            this.errorMessage = 'Failed to log the item. Please try again.';
            this.loading = false;
        } finally {
            this.loading = false;
        }
    },
    
    // Reset input fields after successful logging
    resetInputs() {
        this.itemCount = ''; // Reset to default value
        this.isClean = false; // Reset checkbox
        this.errorMessage = ''; // Clear any error messages
    },
    async countLoggedDays(username, year, weekNumber, currentDayField) {
        const weekDocId = `${username}_${year}_week_${weekNumber}`;
        const weeklyDocRef = doc(db, "recycledDataSummary", weekDocId);

        try {
            const docSnap = await getDoc(weeklyDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const dayFields = [
                    'MondayCount', 'TuesdayCount', 'WednesdayCount', 
                    'ThursdayCount', 'FridayCount', 'SaturdayCount', 'SundayCount'
                ];
                let daysLogged = dayFields.filter(day => data[day] && data[day] > 0).length;

                // Check if the current day is being logged for the first time
                if (currentDayField && (!data[currentDayField] || data[currentDayField] === 0)) {
                    daysLogged += 1;  // Increment to account for the new day being logged
                    console.log(`Logging new activity for ${currentDayField}, total days logged this week now ${daysLogged}.`);
                } else {
                    console.log(`${daysLogged} days logged this week including today.`);
                }
                return daysLogged;
            } else {
                // If the document doesn't exist, today's logging would be the first day.
                console.log("No activity logged this week. Starting with today as the first day.");
                return 1;  // Return 1 since today is being logged
            }
        } catch (error) {
            console.error("Failed to retrieve the week's log:", error);
            return -1;  // Indicate an error
        }
    },
    async sumUserWeeklyAverages(username, currentDayField ) {
        const summaryRef = collection(db, "recycledDataSummary");
        const queryRef = query(summaryRef, where("username", "==", username));
        try {
            const querySnapshot = await getDocs(queryRef);
            let totalAverage = 0;
            let toAdd = false;
            querySnapshot.forEach(doc => {
                const data = doc.data();

                if (data.currWeekAvg) {
                    totalAverage += data.currWeekAvg; // Sum up all currWeekAvg values
                }

                if (currentDayField && (!data[currentDayField] || data[currentDayField] === 0)) {
                    toAdd = true;
                    console.log(`Accounting new activity for current log, totalAverageSum now ${totalAverage}.`);
                } else {
                    console.log(`${totalAverage} not affected by current log.`);
                }
            });

            if(toAdd){
                totalAverage+=1;
            }

            console.log(`Total average for ${username}: ${totalAverage}`);
            return totalAverage;
        } catch (error) {
            console.error("Failed to calculate total average:", error);
            return -1;  // Indicate an error
        }
    },
    async retrieveCurrWeekCount(username){
        // Query the user's summary document and see if they have already started logging items to initialise week counter
            const queryRef = query(collection(db, "recycledDataSummary"), where("username", "==", this.username));
            let currWeekCount = 0;
            try{
                const querySnapshotWeekCount = await getDocs(queryRef);
                if(querySnapshotWeekCount) {
                    currWeekCount = querySnapshotWeekCount.size;
                } 
                console.log("Current week count:", currWeekCount);
                return currWeekCount;
            } catch (error) {
                console.error("Error fetching documents:", error);
            }       
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
    .loading-spinner {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        height: 100px;  
    }

    .loading-spinner::after {
        content: '';
        width: 20px;
        height: 20px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

  </style>
  
