<template>
  <div>
    <br><br>
    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb">
      <router-link to="/resources/ResourcesPage">Resources</router-link>
      >
      Infographics
    </nav>

    <h1>Infographics</h1>
  <div class="poster-container">
    <div v-for="poster in posters" :key="poster.id" class="poster-item">
      <button @click="goToPosterDetail(poster.id)" class="poster-button">
        {{ poster.title }}
      </button>
    </div>
  </div>
</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const posters = ref([]);
    const router = useRouter();

    onMounted(async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "infographics"));
        posters.value = querySnapshot.docs.map(doc => {
          const posterData = { id: doc.id, ...doc.data() };
          console.log(posterData); // Log to see the structure of posterData
          return posterData;
        });
      } catch (error) {
        console.error("Error fetching posters: ", error);
      }
    });


    function goToPosterDetail(id) {
      router.push({ name: 'PosterDetail', params: { id } });
    }

    return {
      posters,
      goToPosterDetail
    };
  }
};
</script>

<style scoped>
.poster-container {
  margin: 10px;
  width: 90vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.poster-item {
  display: inline;
  margin-right: 10px;
}

.poster-button {
  margin-top: 0px;
  border-radius: 20px;
  width: 200px;
  height: 200px;
  background-color: rgb(31, 95, 65); /* Green background */
  color: white; /* Text color */
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 20px;
}

.poster-button:hover {
  background-color: rgb(0, 51, 34); /* Darker shade of green on hover */
}

/* Style for the breadcrumb */
.breadcrumb {
  padding: 10px 0;
  font-size: 16px;
}

.breadcrumb a {
  color: #457247; /* Adjust color as needed */
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}


</style>