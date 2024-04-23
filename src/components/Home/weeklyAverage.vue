<template>
    <div class="weekly-average">
      <div class="average-text">On average, you recycle items</div>
      <div class="trees">
        <!-- Render all seven tree icons -->
        <img v-for="n in 7" :key="n" :src="treeIcon" 
             :class="['tree-icon', { 'faded': n > averageDays }]" 
             alt="Tree icon" />
      </div>
      <div class="average-text">
        <span class ="average-number">{{ averageDays }}</span> days a week
    </div>
    </div>
  </template>
  
  
  
<script>
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
    import { db } from '@/firebaseConfig';
    import treeIcon from '@/assets/treeIcon.png';

    export default {
        data() {
            return {
                treeIcon, 
                username: '',
                averageDays: 0,
            };
        }, 
        mounted() {
            this.initialiseDataWithDelay();
        },
        methods: {
            initialiseDataWithDelay() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User is signed in, fetching data.");
                    this.fetchUsername();
                } else {
                    console.error("No user is signed in.");
                }
            });
            },
            async fetchUsername() {
                console.log("fetching username")
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    console.log("user exists")
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        this.username = userSnap.data().username;
                        this.fetchData();
                    } else {
                        console.error("No such user!");
                    }
                } else {
                    console.error("No user is signed in.");
                }
            },
            
            async fetchData() {
                try {
                const queryRef = collection(db, 'recycledDataSummary'); // Reference to the collection
                const q = query(queryRef, where('username', '==', this.username)); // Create a query against the collection
                const querySnapshot = await getDocs(q); // Execute the query

                let totalDaysRecycled = 0;
                let totalWeeks = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const daysRecycledThisWeek = [
                        'MondayCount',
                        'TuesdayCount',
                        'WednesdayCount',
                        'ThursdayCount',
                        'FridayCount',
                        'SaturdayCount',
                        'SundayCount'
                    ].reduce((count, day) => {
                        // Count each day where the value is greater than 0
                        return count + (data[day] > 0 ? 1 : 0);
                    }, 0);

                    totalDaysRecycled += daysRecycledThisWeek;
                    totalWeeks += 1; // Increase for each document processed
                });

                    // Calculate the average if totalWeeks is greater than zero
                    if (totalWeeks > 0) {
                        this.averageDays = Math.round(totalDaysRecycled / totalWeeks);
                    } else {
                        this.averageDays = 0;
                    }
                } catch (error) {
                    console.error("Error fetching recycled data:", error);
                    // Handle your error state here
                }
                    
            },
       
        },

    }
</script>

<style scoped>
.trees {
  /* Style the tree icon container */
  display: flex;
  justify-content: center; /* Center icons if needed */
}

.tree-icon {
  /* Style for each tree icon */
  width: 50px; /* Set a specific width */
  height: auto; /* Maintain aspect ratio */
  margin: 0 5px; /* Add some space between icons */
  transition: opacity 0.3s; /* Smooth transition for the opacity change */
}

 
.tree-icon.faded {
  opacity: 0.3; /* Faded icons will have reduced opacity */
}

.average-text{
  font-size: 25px;
  text-align: center;
  color:#457247;
  font-weight:bold;
  margin-top:20px;
  margin-bottom: 20px;
}

.average-number{
  font-size: 45px;
  text-align: center;
  color:#457247;
  font-weight:bold;
  margin-top:20px;
  margin-bottom: 20px; 
  line-height:1;
}
</style>
