<!-- 
  FriendRequests component: 
  - displays the user's full list of current friend requests
  - supports the function of accepting and rejecting friend requests
-->

<template>
  <div class="friend-requests">
    <ul v-if="requests.length > 0">
      <li v-for="request in requests" :key="request.id" class="request-item">
        <div class="request-info">
          <div class="request-name">{{ request.fromName }}</div>
          <div class="request-username">@{{ request.fromUsername }}</div>
        </div>
        <div class="request-actions">
          <button @click="acceptRequest(request.id)" class="accept-btn">✔</button>
          <button @click="rejectRequest(request.id)" class="reject-btn">✖</button>
        </div>
      </li>
    </ul>
    <div v-else class="no-requests">
      No incoming friend requests.
    </div>
  </div>
</template>


<script>
import { db } from '@/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc, writeBatch } from 'firebase/firestore';



export default {
  data() {
    return {
      requests: [],
    };
  },
  created() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, set up the listener.
      this.listenForFriendRequests();
    } else {
      // User is not signed in.
      console.log('No user logged in');
    }
  });
},
  methods: {
    listenForFriendRequests() {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.log('No user logged in');
        return;
      }
      const userId = auth.currentUser.uid;
      const q = query(collection(db, 'friendRequests'), where('toId', '==', userId), where('status', '==', 'pending'));

      onSnapshot(q, (querySnapshot) => {
        this.requests = querySnapshot.docs.map(docSnapshot => ({
          id: docSnapshot.id,
          fromUsername: docSnapshot.data().fromUsername,
          fromName: docSnapshot.data().fromName
        }));
      }, (error) => {
        console.error("Error fetching real-time friend requests:", error);
      });
    },

    async acceptRequest(requestId) {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.error('No user logged in');
        return;
      }

      const userId = auth.currentUser.uid;
      const userRef = doc(db, 'users', userId);
      let userUsername;
      let userName;
      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          userUsername = userDoc.data().username;
          userName = userDoc.data().name;
        } else {
          console.error("User document not found");
          return;
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
        return;
      }

      const friendRequestRef = doc(db, 'friendRequests', requestId);

      try {
        const friendRequestSnap = await getDoc(friendRequestRef);
        if (!friendRequestSnap.exists()) {
          console.error('Friend request not found.');
          return;
        }
        
        const friendRequestData = friendRequestSnap.data();
        const friendId = friendRequestData.fromId;
        const friendUsername = friendRequestData.fromUsername;
        const friendName = friendRequestData.fromName

        const batch = writeBatch(db);

        batch.update(friendRequestRef, { status: 'accepted' });

        const friendsRef = collection(db, 'friends');
        batch.set(doc(friendsRef), {
          userId1: userId,
          username1: userUsername, 
          userId2: friendId,
          username2: friendUsername,
          name1: userName,
          name2: friendName
        });

        await batch.commit();

        this.requests = this.requests.filter(request => request.id !== requestId);

        console.log('Friend request accepted and friend added.');
      } catch (error) {
        console.error("Error accepting friend request:", error);
      }
    },

    async rejectRequest(requestId) {
      try {
        await updateDoc(doc(db, 'friendRequests', requestId), { status: 'rejected' });
        this.requests = this.requests.filter(request => request.id !== requestId);
        console.log("Friend request rejected.");
      } catch (error) {
        console.error("Error rejecting friend request:", error);
      }
    },
  },
};
</script>



<style scoped>
.friend-requests {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px; 
  justify-content: center; 
}

.friend-requests h2 {
  color: #333;
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 10px;
  align-self: center;
}

.friend-requests ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

.request-item {
  background-color: #F2D74A;
  margin-bottom: 10px;
  border-radius: 20px; 
  display: flex;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  font-size: 18px;
}

.request-info {
  display: flex;
  flex-direction: column;
}

.request-name {
  font-weight: bold;
  color: #333333;
  font-size: 20px;
  align-self: flex-start;
}
.request-username {
  color: #333333;
}

.request-actions {
  display: flex;
  align-items: center;
}

.reject-btn {
  background-color: transparent; 
  color: black;
  border: none; 
  cursor: pointer;
  font-size: 1.5rem; 
}

.accept-btn {
  background-color: transparent; 
  color: black;
  border: none; 
  cursor: pointer;
  font-size: 1.5rem; 
  margin-left: 110px;
}

.accept-btn:before, .reject-btn:before {
  content: ""; 
  display: inline-block;
  height: 20px;
  background-size: contain;
}

</style>
