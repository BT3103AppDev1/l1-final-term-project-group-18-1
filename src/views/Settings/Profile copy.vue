<template>
  <div class="profile-page">
    <h1>Profile</h1>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="email">Registered Email:</label>
        <input id="email" type="email" v-model="user.email" disabled class="input-disabled" />
      </div>
      <div class="form-group">
        <label for="name" class="sr-only">Name:</label>
        <input id="name" type="text" v-model="user.name" :maxlength="20" placeholder="Name" disabled class="input-disabled" />
      </div>
      <div class="form-group">
        <label for="username" class="sr-only">Username:</label>
        <input id="username" type="text" v-model="user.username" :maxlength="20" placeholder="Username" disabled class="input-disabled" />
      </div>
      <button type="submit" class="btn">Update Profile</button>
      <p v-if="showSuccessMessage" class="message">Profile updated successfully!</p>
      <p v-if="showFailedMessage" class="message">Please ensure name and username are filled in.</p>
    </form>
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
    const showSuccessMessage = ref(false); 
    const showFailedMessage = ref(false);

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

    const updateProfile = async () => {
      console.error('Profile updates are not allowed.');
    };

    return { user, updateProfile, showSuccessMessage, showFailedMessage }; 
  }
};
</script>

<style>
.settings-wrapper h1 {
  margin-right: 1150px;
  margin-bottom: 30px;
  font-weight: bold;
}

.user-email {
  padding: 10px 0;
  font-size: 0.9rem;
  font-size: 18px;
  display: flex;
}

.form-group {
  display: flex;
  margin-bottom: 1rem;
  flex-direction: column;
  font-size: 16px;
}

.form-group label {
  display: flex;
}

.form-group input, .form-group textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px
}

.btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.message {
  margin-top: 0.3rem;
  color: var(--primary-color);
  font-size: 16px;
}

.input-disabled {
  background-color: #e7e7e7; 
  color: #6c757d;
} 
</style>
