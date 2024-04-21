<template>
  <div class="friend-requests">
    <h2>Incoming Friend Requests</h2>
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
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc, addDoc, writeBatch } from 'firebase/firestore';

export default {
  data() {
    return {
      requests: [],
    };
  },
  created() {
    this.listenForFriendRequests();
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
}

.friend-requests h2 {
  color: #333;
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
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.request-info {
  display: flex;
  flex-direction: column;
}

.request-name, .request-username {
  margin: 0; 
}

.request-actions {
  display: flex;
  align-items: center;
}

.accept-btn, .reject-btn {
  background-color: transparent; 
  color: black;
  border: none; 
  cursor: pointer;
  font-size: 1.2rem; 
  margin-left: 8px;
}

.accept-btn:before, .reject-btn:before {
  content: ""; 
  display: inline-block;
  width: 20px; 
  height: 20px;
  background-size: contain;
}

.no-requests {
  color: #333;
  margin-top: 20px;
}

</style>
