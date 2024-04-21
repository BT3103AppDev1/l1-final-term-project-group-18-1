<template>
  <div>
    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb">
      <router-link to="/resources/ResourcesPage">Resources</router-link> 
      >
      Infographics
    </nav>

    <h1>Infographics</h1>
    
    <div v-for="poster in posters" :key="poster.id" class="poster-item">
      <button @click="goToPosterDetail(poster.id)" class="poster-button">
        {{ poster.title }}
      </button>
   
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
.poster-item {
  display: inline;
}

.poster-button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #457247; /* Green background */
  color: white; /* Text color */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 20px;
}

.poster-button:hover {
  background-color: #27792b; /* Darker green on hover */
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