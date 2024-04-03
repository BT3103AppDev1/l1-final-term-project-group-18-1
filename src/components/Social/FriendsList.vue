<template>
    <div class="friends-list">
      <h2>Your Friends</h2>
      <ul v-if="friends.length > 0">
        <li v-for="friend in friends" :key="friend.id">
          {{ friend.username }}
        </li>
      </ul>
      <div v-else>
        You have no friends added.
      </div>
    </div>
  </template>
  
  <script>
  import { db } from '@/firebaseConfig';
  import { getAuth } from 'firebase/auth';
  import { collection, query, where, getDocs, doc } from 'firebase/firestore';
  
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
            alert('You must be logged in to send friend requests.');
            return;
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
            friendsList.push({ id: doc.id, username: data.username2 });
          });
          querySnapshot2.forEach((doc) => {
            const data = doc.data();
            friendsList.push({ id: doc.id, username: data.username1 });
          });

          this.friends = friendsList;
        } catch (error) {
          console.error("Error fetching friends list:", error);
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
  }
  
  .friends-list ul {
    list-style-type: none;
    padding: 0;
  }
  
  .friends-list li {
    margin-bottom: 10px;
  }
  </style>
  