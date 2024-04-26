<template>

  <!-- once poster is fetched successfully from firebase, display it -->
  <div v-if="poster">
    <h2>{{ poster.title }}</h2>
    <img :src="poster.imageURL" :alt="poster.title" class="poster-image" />
  </div>

  <!-- meanwhile, show "Loading..." -->
  <div v-else>
    Loading...
  </div>
  
</template>

<script>
import { ref, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const poster = ref(null);

    //fetch poster data 
    onMounted(async () => {
      try {
        const docRef = doc(db, "infographics", route.params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          poster.value = docSnap.data();
        } else {
          console.error("Document not found!");
        }
      } catch (error) {
        console.error("Error fetching poster details: ", error);
      }
    });

    return {
      poster
    };
  }
};
</script>

<style scoped>
.poster-image {
  width: 100%; 
  max-width: 800px; 
  max-height: 600px; 
  height: auto; 
  object-fit: contain; 
  display: block; 
  margin: 0 auto; 
}

h2 {
  text-align: center; 
  margin-top: 20px; 
}


</style>