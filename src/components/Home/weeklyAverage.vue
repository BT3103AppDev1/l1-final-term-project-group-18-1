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
    import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
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
        // beforeDestroy() {
        //     if (this.unsubscribe) {
        //         this.unsubscribe(); // Call the unsubscribe function on component destroy
        //     }
        // },
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
                    const now = new Date();
                    //const now = new Date('2024-03-29'); //testing
                    const [year, weekNumber] = this.getWeekNumber(now);
                    const weekDocId = `${this.username}_${year}_week_${weekNumber}`;

                    let docRef = doc(db, 'recycledDataSummary', weekDocId);
                    let docSnapshot = await getDoc(docRef);

                    if (!docSnapshot.exists()) {
                        console.log("Current week's document does not exist. Fetching the most recent available document.");
                        const queryRef = query(
                            collection(db, 'recycledDataSummary'),
                            where('username', '==', this.username),
                            orderBy('year', 'desc'),
                            orderBy('weekNumber', 'desc'),
                            limit(1)
                        );
                        const querySnapshot = await getDocs(queryRef);
                        if (!querySnapshot.empty) {
                            docSnapshot = querySnapshot.docs[0];
                            console.log("Found a recent document instead." + docSnapshot.id);
                        }
                    }

                    if (docSnapshot.exists()) {
                        const documentData = docSnapshot.data();
                        const totalWeeksRecycled = documentData.currWeekCount || 0;
                        const totalWeeklyAvgSum = documentData.currWeeklyAvgSum || 0;
                        this.averageDays = totalWeeksRecycled > 0 ? Math.round(totalWeeklyAvgSum / totalWeeksRecycled) : 0;
                    } else {
                        console.log("No recent documents available.");
                        this.averageDays = 0;
                    }
                } catch (error) {
                    console.error("Error fetching recycled data:", error);
                    this.averageDays = 0;
                }
            },
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
