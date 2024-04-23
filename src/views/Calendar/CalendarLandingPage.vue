<template>
    <div class="loading-container">
      Loading...
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  import { auth, db } from '@/firebaseConfig';
  import { doc, getDoc } from 'firebase/firestore';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
  
      onMounted(async () => {
        const user = auth.currentUser;
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().calendarSynced) {
        router.push({ name: 'Events' }); // User has synced, redirect to events page
        } else {
        router.push({ name: 'Calendar' }); // User has not synced, redirect to sync page
        }
        }) 
      }
    };
  </script>
  
  <style>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 24px;
    font-weight: bold;
  }
  </style>
  