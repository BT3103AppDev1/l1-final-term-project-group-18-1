<template>
    <div class="find-friends">
      <input
        type="text"
        v-model="searchQuery"
        @input="debounceSearch"
        placeholder="Search for friends..."
        class="search-input"
      />
      <button @click="searchUsers">Search</button>
  
      <ul class="search-results" v-if="searchResults.length">
        <li v-for="user in searchResults" :key="user.id">
          {{ user.username }}
          <button @click="() => handleSendFriendRequest(user.id)">Send Request</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { db } from '@/firebaseConfig';
  import { getAuth } from 'firebase/auth';
  import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
  import { debounce } from 'lodash-es';
  
  export default {
    data() {
      return {
        searchQuery: '',
        searchResults: [],
      };
    },
    methods: {
      searchUsers: debounce(async function() {
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
      }, 500), 
  
      async handleSendFriendRequest(friendId) {
        try {
          const auth = getAuth();
          if (!auth.currentUser) {
            alert('You must be logged in to send friend requests.');
            return;
          }
          const userId = auth.currentUser.uid;
  
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            console.error('Current user document does not exist.');
            alert('An error occurred. Please try again.');
            return;
          }
          const username = userSnap.data().username;
          const name = userSnap.data().name;
  
          const friendRequestsRef = collection(db, 'friendRequests');
          await addDoc(friendRequestsRef, {
            fromId: userId,
            fromUsername: username, 
            fromName: name,
            toId: friendId,
            status: 'pending'
          });
  
          alert('Friend request sent successfully!');
        } catch (error) {
          console.error('Failed to send friend request:', error);
          alert('Failed to send friend request. Please try again.');
        }
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
  
  .search-input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 300px;
  }
  
  button {
    padding: 10px 15px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  