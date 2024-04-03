<template>
  <div class="profile-page">
    <h1>Profile</h1>
    <!-- Display the email outside the form -->
    <div class="user-email">
      <strong class="email-spacing">Registered Email: </strong> {{ user.email }}
    </div>

    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Name:</label>
        <input id="name" type="text" v-model="user.name" />
      </div>
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" type="text" v-model="user.username" />
      </div>
      <button type="submit" class="btn">Update Profile</button>
      <p v-if="showSuccessMessage" class="success-message">Profile updated successfully!</p>
    </form>

  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

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
    const showSuccessMessage = ref(false); // Add this line

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
          user.value.email = userAuth.email; // Assuming the email is directly available
          fetchUserData(userAuth.uid);
        } else {
          console.error('User is not signed in.');
        }
      });
    });

    const updateProfile = async () => {
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        return;
      }
      const uid = auth.currentUser.uid;
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        name: user.value.name,
        username: user.value.username
      });
      showSuccessMessage.value = true; // Show success message

      // Hide success message after 3 seconds
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 4000);
    };

    return { user, updateProfile, showSuccessMessage }; // Update return
  }
};
</script>

<style scoped>

/* Styles for the email display */
.user-email {
  padding: 10px 0;
  font-size: 0.9rem;
  font-size: 18px;
  display: flex;
}

/* Form group styles */
.form-group {
  display: flex;
  margin-bottom: 1rem;
  flex-direction: column;
  font-size: 16px;
}

/* Input and label styles */
.form-group label {
  display: flex;
}

.form-group input, .form-group textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px
}

/* Style for the save button */
.btn {
  background-color: green;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

/* Additional styling for success message */
.success-message {
  margin-top: 0.3rem;
  color: green;
  font-size: 16px;
}
</style>
