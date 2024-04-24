<template>
  <div class="page">
    <main>
      <h1 class="main-title">Thank you for making the Earth a better place!</h1>
      <div class="notifs">
        <!-- Events display section -->
        <div class="events-container">
          <h2 class="second-heading">Upcoming Events</h2>
          <div class="events-list">
            <UpcomingEvents/>
          </div>
        </div>
        <!-- Friend requests section -->
        <div class="friend-requests">
          <FriendRequests />
        </div>
      </div>
      <div class = "button-container">
          <searchButton />
      </div>
      
      <!-- Adding line to divide statistics section -->
      <div class="horizontal-line"></div>

      <div class="sectionHeader">
          <p class="regularText" style="font-size:xx-large;">Statistics</p>
      </div>
      <div class = "noneGraph">
        <numberDisplay class="flex-item"/>
        <weeklyAverage class="flex-item"/>
      </div>
       
      <div>
          <pieChart v-if="hasRecycledDataSummary"/>
      </div>
      <div class ="communityPie">
        <communityPie v-if="hasRecycledDataSummary"/>
      </div>
      <div class ="barChart">
        <barChart v-if="hasRecycledDataSummary"/>
      </div>
    </main>
  </div>
</template>

<script>
import searchButton from '../components/Home/searchButton.vue'
import pieChart from '../components/Home/pieChart.vue'
import numberDisplay from '@/components/Home/numberDisplay.vue';
import weeklyAverage from '@/components/Home/weeklyAverage.vue';
import barChart from '@/components/Home/barChart.vue';
import UpcomingEvents from '@/components/UpcomingEvents.vue';
import FriendRequests from '@/components/Social/FriendRequests.vue';
import communityPie from '@/components/Home/communityPie.vue';

//for verifying if there are already data
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export default {
  components: {
    searchButton,
    pieChart,
    numberDisplay,
    weeklyAverage,
    barChart,
    FriendRequests,
    UpcomingEvents,
    communityPie,
  },
  computed: {
    formattedUpcomingEvents() {
      return this.upcomingEvents.map(event => ({
        ...event,
        start: new Date(event.start).toLocaleString(), // Format 'start' date
        end: new Date(event.end).toLocaleString() // Format 'end' date
      }));
    }
  }, 
  data() {
    return {
      username: '',
      hasRecycledDataSummary: false, //flag to see if user has recycled something
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
          onsole.log("User is signed in, fetching data.");
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
      async checkUserRecycledDataSummary() {
          // Reference to the 'recycledDataSummary' collection
          const recycledDataSummaryCollection = collection(db, 'recycledDataSummary');
          
          // Create a query against the collection for the username
          const q = query(recycledDataSummaryCollection, where('username', '==', this.username));
          try {
            const querySnapshot = await getDocs(q);

            // Check if the querySnapshot has any documents
            if (querySnapshot.empty) {
              // No document for the user
              this.hasRecycledDataSummary = false;
            } else {
              // There is at least one document for the user
              this.hasRecycledDataSummary = true;
            }
          } catch (error) {
            console.error('Error checking recycledDataSummary:', error);
            this.hasRecycledDataSummary = false;
          }
      },    
  },
}
</script>

<style scoped>
.page{
  display: flex;
  justify-content: center;
}

.button-container {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  margin-top: 20px;
  margin-bottom: 20px;
}

.main-title {
  font-weight: bold;
  color: #457247;
}

.noneGraph {
  display: flex; /* This enables Flexbox */
  justify-content: center; /* This centers the flex items horizontally */
  align-items: center; /* This centers the flex items vertically */
}

.flex-item {
  flex: 1; /* This ensures that each flex item takes up an equal amount of space */
}

main {
  margin-top: 60px;
}

.sectionHeader{
  margin-top: 10px;
}
.notifs {
  display: flex;
  justify-content: center; /* Center the children horizontally */
  align-items: flex-start; /* Align the children to the top */
  gap: 20px; /* Optional: Adds space between the children */
  width: 80vw;
}
.events-container, .friend-requests {
  flex: 1; /* Both children will take equal width */
  width: 600px;
  border-radius: 10px; /* Rounded corners */
}

.events-container {
  background-color: #F2D74A;
  padding-bottom: 10px;
}
.friend-requests {
  background-color: #95e1f1;
  padding-bottom: 10px;
}

.second-heading {
  color: #333333;
}

.weeklyAvg{
  margin-top: 80px;
}

.barChart{
  margin-top: 80px;
}

.regularText{
  font-size: 25px;
  text-align: center;
  color:#457247;
  font-weight:bold
}

.horizontal-line {
  border-top: 1.5px solid #333; /* Creates a line at the top of the element */
  margin-top: 70px;
  
}

</style>
