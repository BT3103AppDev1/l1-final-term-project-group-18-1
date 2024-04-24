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
      <div class="sectionHeader">
          <p class="regularText" style="font-size:xx-large;">Statistics</p>
      </div>
       <div>
          <numberDisplay/>
      </div>
      <br>
      <div>
          <pieChart />
      </div>
      <div class ="communityPie">
        <communityPie />
      </div>
      <div class ="weeklyAvg">
        <weeklyAverage />
      </div>
      <div class ="barChart">
        <barChart />
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
  }
};
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
</style>
