<template>
  <div v-if="poster">
    <h2>{{ poster.title }}</h2>
    <img :src="poster.imageURL" :alt="poster.title" class="poster-image" />
    <!-- Add more details if you have -->
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

@media (min-width: 768px) { /* Adjust for larger screens */
  .poster-image {
    width: 500px; /* Fixed width on larger screens */
  }
}


/* Style for the title */
h2 {
  text-align: center; /* Centers the title text */
  margin-top: 20px; /* Adds space above the title */
}

</style>
