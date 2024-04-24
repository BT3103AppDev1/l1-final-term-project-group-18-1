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

    <teleport to="body">
      <div v-if="showNotification" class="overlay" @click="closeNotification"></div>
      <div v-if="showNotification" class="notification">
        <p>Friend request sent! <br> Username: <span>@{{ potentialFriend.username }}</span></p>
        <button class="close-btn" @click="closeNotification">×</button>
      </div>

      <div v-if="showAddFriendModal" class="overlay" @click="closeNotification"></div>
      <div v-if="showAddFriendModal" class="notification add-friend-notification">
        <p>Add Friend <br> Username: <span>@{{ potentialFriend.username }}</span></p>
        <div class="button-container">
          <button class="confirm-btn" @click="handleSendFriendRequest(potentialFriend.id)">Confirm</button>
        </div>
        <button class="close-btn" @click="closeAddFriendNotification">×</button>
      </div>
  </teleport>

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
      showAddFriendModal: false,
      potentialFriend: null,
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
          alert('No users found with that username. Please try a different search.');
        } else {

          const userDoc = querySnapshot.docs[0];
          this.potentialFriend = {
            id: userDoc.id,
            username: userDoc.data().username,
            name: userDoc.data().name,
          };
          this.showAddFriendModal = true; 
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
        this.showAddFriendModal = false
        this.showNotification = true;
      } catch (error) {
        console.error('Failed to send friend request:', error);
        alert('Failed to send friend request. Please try again.');
      }
    },

    closeNotification() {
      this.showNotification = false;
    },

    closeAddFriendNotification() {
      this.showAddFriendModal = false;
    },

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


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px;
  background-color: #D5EDDE; 
  border: 6px solid #457247; 
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  min-width: 450px; 
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 24px;
  color: #457247; 
}

.close-btn:hover {
  color: #ff5252; 
}

.notification p {
  text-align: center; 
  font-size: 20px;
  font-weight: 500;
  color: #47525E; 
}

.notification span {
  color: #47525E; 
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: center; 
  margin-top: 20px; 
}

.confirm-btn {
  padding: 8px 16px;
  border: none;
  background-color: #47525E;
  color: white;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}

.confirm-btn:hover {
  background-color: #37474F;
}


</style>
