<template>
  <div class="page">
    <main>
      <h1 class="main-title">Thank you for making the Earth a better place!</h1>
      <!-- Events display section -->
      <div class="events-container">
        <h2 class="second-heading">Upcoming Events</h2>
        <div class="events-list">
          <div class="event" v-for="event in formattedUpcomingEvents" :key="event.id">
            <div class="event-box">
              <strong>{{ event.title }}</strong><br>
              {{ event.start }} to {{ event.end }}
            </div>
          </div>
        </div>
      </div>
      <div class = "button-container">
          <searchButton />
      </div>  
      <div class="sectionHeader">
          <p class="regularText">Statistics</p>      
      </div>
       <div>
        <p class="regularText">You have recycled</p>
          <numberDisplay/>
          <p class="regularText">items so far.</p>
      </div>
      <br>
      <div>
          <p class="regularText">Your recycled items this month:</p>
          <pieChart />
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

export default {
  components: {
    searchButton,
    pieChart,
    numberDisplay,
    weeklyAverage,
    barChart
  },
  computed: {
    upcomingEvents() {
      return this.$store.state.upcomingEvents;
    },
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
  padding-bottom: 20px;
  padding-top: 20px;
}

.main-title {
  font-weight: bold; 
  color: #457247;
} 

main {
  padding-top: 60px;
}

.sectionHeader{
  display:flex;
  padding-top: 10px;
}
.events-container {
  margin-top: 20px;
  background-color: #ffe1b0;
  padding: 20px;
  border-radius: 10px; /* Rounded corners */
}

.events-container h2 {
  margin-top: 0;
}

.event-box {
  padding: 10px;
  background-color: #ffffff; /* White background */
  border-radius: 8px; /* Rounded corners */
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Shadow effect */
  color: #333333; /* Dark grey text color */
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
