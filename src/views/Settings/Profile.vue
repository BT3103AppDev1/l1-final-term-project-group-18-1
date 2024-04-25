<template>
  <div class="profile-page">
    <h1>Profile</h1>
      <text class="content"><span class="label">Email:</span> {{ user.email }}</text>
      <text class="content"><span class="label">Name:</span> {{ user.name }}</text>
      <text class="content"><span class="label">Username:</span> {{ user.username }}</text>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'Profile',
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const user = ref({
      email: '',
      name: '',
      username: ''
    });

    const fetchUserData = async (uid) => {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        user.value = { ...user.value, ...docSnap.data() };
      } else {
        console.error("No such document!");
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, (userAuth) => {
        if (userAuth) {
          user.value.email = userAuth.email;
          fetchUserData(userAuth.uid);
        } else {
          console.error('User is not signed in.');
        }
      });
    });

    return { user }; 
  }
};
</script>

<style>
.profile-page {
  margin-left: 20px;
}
.profile-page h1 {
  margin-right: 1150px;
  font-weight: bold;
}

.content {
  padding: 10px 0;
  font-size: 16px;
  display: flex;
}

.label {
  font-weight: bold;
  margin-right: 5px; /* Add spacing between label and content */
}
</style>
