<template>
  <div class="friends-list">
    <h2>Your Friends</h2>
    <ul v-if="friends.length > 0">
      <li v-for="friend in friends" :key="friend.id" class="friend-item">
        <div class="friend-info">
          <div class="friend-name">{{ friend.name }}</div>
          <div class="friend-username">@{{ friend.username }}</div>
        </div>
        <button @click="deleteFriend(friend.id)" class="delete-friend-btn">×</button>
      </li>
    </ul>
    <div v-else class="no-friends">
      You have no friends added.
    </div>
  </div>
</template>

<script>
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      friends: [],
    };
  },
  created() {
      const auth = getAuth();
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.fetchFriends();
        } else {
          console.log('User logged out'); 
        }
      });
    },
  methods: {
    async fetchFriends() {
      const auth = getAuth();
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (!userId) {
        console.log('No user logged in');
        return;
      }
      const friendsRef = collection(db, 'friends');
      const q1 = query(friendsRef, where('userId1', '==', userId));
      const q2 = query(friendsRef, where('userId2', '==', userId));

      try {
        const friendsList = [];
        const querySnapshot1 = await getDocs(q1);
        const querySnapshot2 = await getDocs(q2);

        querySnapshot1.forEach((doc) => {
          const data = doc.data();
          friendsList.push({ id: doc.id, username: data.username2, name: data.name2 });
        });
        querySnapshot2.forEach((doc) => {
          const data = doc.data();
          friendsList.push({ id: doc.id, username: data.username1, name: data.name1});
        });

        this.friends = friendsList;
      } catch (error) {
        console.error("Error fetching friends list:", error);
      }
    },

    async deleteFriend(friendId) {
      try {
        await deleteDoc(doc(db, 'friends', friendId));
        this.friends = this.friends.filter(friend => friend.id !== friendId);
      } catch (error) {
        console.error('Error deleting friend:', error);
        alert('Failed to delete friend. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
.friends-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px; /* Adjust width as needed */
  margin: auto;
}

.friends-list h2 {
  color: #457247;
}

.friends-list ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

.friend-item {
  background-color: #79BCD9;
  margin-bottom: 10px;
  border-radius: 20px; /* Rounded corners */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional shadow */
}

.friend-info {
  display: flex;
  flex-direction: column;
}

.friend-name {
  font-weight: bold;
  color: #333333;
}

.friend-username {
  font-size: 0.9em;
  color: #333333;
}

.delete-friend-btn {
  padding: 5px;
  margin-left: 15px;
  background-color: transparent;
  color: black; /* Red color for the delete icon */
  border: none;
  font-size: 1.2em; /* Larger font size for the delete icon */
  cursor: pointer;
}

.no-friends {
  color: #333333;
}

/* If you need to add a specific size or style for the icons, you can add it here */
</style>