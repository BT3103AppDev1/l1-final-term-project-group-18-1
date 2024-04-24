<template>
  <div v-if="poster">
    <h2>{{ poster.title }}</h2>
    <img :src="poster.imageURL" :alt="poster.title" class="poster-image" />
  </div>

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
  width: 100%; /* Make the image responsive to its container's width */
  max-width: 800px; /* Maximum width the image can grow to */
  max-height: 600px; /* Maximum height the image can grow to, helps with very tall images */
  height: auto; /* Maintain the aspect ratio */
  object-fit: contain; /* Cover the frame; can use 'contain' to avoid cropping */
  display: block; /* Remove inline element spacing */
  margin: 0 auto; /* Center the image horizontally */
}

/* Style for the title */
h2 {
  text-align: center; /* Centers the title text */
  margin-top: 20px; /* Adds space above the title */
}


</style>