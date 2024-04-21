<template>
  <div class="find-friends">
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Add Friend"
        class="search-input"
      />
      <button class="search-button" @click="searchUsers">
        <span class="search-icon">+</span>
      </button>
    </div>

    <!-- Overlay -->
    <div v-if="showNotification" class="overlay" @click="closeNotification"></div>

    <!-- Notification -->
    <div v-if="showNotification" class="notification">
      <p>Friend request sent! <br> Username: <span>@{{ lastRequestedUsername }}</span></p>
      <button class="close-btn" @click="closeNotification">×</button>
    </div>

    <ul class="search-results" v-if="searchResults.length">
      <li v-for="user in searchResults" :key="user.id">
        {{ user.username }}
        <button @click="handleSendFriendRequest(user.id)">Send Request</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      showNotification: false,
      lastRequestedUsername: '',
    };
  },
  methods: {
    async searchUsers() {
      if (this.searchQuery.trim() === '') {
        alert('Please enter a search query.');
        return;
      }

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', this.searchQuery.trim()));

      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          this.searchResults = [];
          alert('No users found with that username. Please try a different search.');
        } else {
          this.searchResults = querySnapshot.docs.map(doc => ({
            id: doc.id,
            username: doc.data().username,
            name: doc.data().name,
          }));
        }
      } catch (error) {
        console.error('Error searching users:', error);
        alert('Failed to search for users. Please try again.');
      }
    },

    async handleSendFriendRequest(friendId) {
      try {
        const auth = getAuth();
        if (!auth.currentUser) {
          alert('You must be logged in to send friend requests.');
          return;
        }

        const userId = auth.currentUser.uid;

        if (userId === friendId) {
          alert('You cannot send a friend request to yourself.');
          return;
        }

        const friendRequestsRef = collection(db, 'friendRequests');
        const existingRequestQuery = query(
          friendRequestsRef,
          where('fromId', '==', userId),
          where('toId', '==', friendId)
        );
        const existingRequestSnapshot = await getDocs(existingRequestQuery);

        if (!existingRequestSnapshot.empty) {
          alert('You have already sent a friend request to this user.');
          return;
        }

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.error('Current user document does not exist.');
          alert('An error occurred. Please try again.');
          return;
        }

        const username = userSnap.data().username;
        const name = userSnap.data().name;

        await addDoc(friendRequestsRef, {
          fromId: userId,
          fromUsername: username,
          fromName: name,
          toId: friendId,
          status: 'pending'
        });

        this.lastRequestedUsername = this.searchResults.find(user => user.id === friendId).username;
        this.showNotification = true;
      } catch (error) {
        console.error('Failed to send friend request:', error);
        alert('Failed to send friend request. Please try again.');
      }
    },

    closeNotification() {
      this.showNotification = false;
    }
  },
};
</script>


<style scoped>
.find-friends {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-input {
  padding: 8px;
  font-size: 16px;
  border: none;
  outline: none;
  width: 100%;
}

.search-button {
  padding: 0 12px;
  border: none;
  background-color: #F5F5F5;
  cursor: pointer;
  border-radius: 0 4px 4px 0; 
}

.search-icon {
  display: block;
  color: #D32F2F;
  font-size: 24px;
  line-height: 0; 
}

button:hover {
  background-color: #E0E0E0; 
}

.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #D5EDDE; 
  color: #457247; 
  border: 2px solid #457247; 
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 400px;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  position: relative; 
}

.notification .close-btn {
  position: absolute; 
  top: 5px; 
  right: 5px; 
  background-color: transparent;
  border: none;
  color: #FF5252; 
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.notification p {
  margin: 0;
  font-weight: bold;
  text-align: center; 
}

.notification span {
  font-weight: normal;
}

.close-btn {
  background-color: transparent;
  border: none;
  color: red;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998; 
}

</style>
