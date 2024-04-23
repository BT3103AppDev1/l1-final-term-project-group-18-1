<template>
  <div class="friends-list">
    <h2>Your Friends</h2>
    <ul v-if="friends.length > 0">
      <li v-for="friend in friends" :key="friend.id" class="friend-item">
        <div class="friend-info">
          <div class="friend-name">{{ friend.name }}</div>
          <div class="friend-username">@{{ friend.username }}</div>
        </div>
        <button @click="promptGiftFertiliser(friend.id, friend.username)" class="gift-btn">
          <img src='@/assets/fertiliser.png' alt="Gift Fertiliser">
        </button>
        <button @click="promptDeleteConfirmation(friend.id, friend.username)" class="delete-friend-btn">×</button>
      </li>
    </ul>
    <div v-else class="no-friends">
      You have no friends added.
    </div>

    <!-- Gift Fertiliser Modal -->
    <div v-if="showGiftModal" class="gift-modal">
      <p>How many fertilisers do you want to gift to @{{ friendToGiftUsername }}?</p>
      <input type="number" v-model="fertiliserAmount" min="1">
      <button @click="confirmGift">Confirm</button>
      <button @click="cancelGift">Cancel</button>
    </div>

    <!-- Delete Confirmation Notification -->
    <teleport to="body">
      <div v-if="showDeleteConfirmation" class="overlay" @click="cancelDelete"></div>
      <div v-if="showDeleteConfirmation" class="delete-confirmation-modal">
        <button class="close-btn" @click="cancelDelete">×</button>
        <h3>Delete friend</h3>
        <p>Username: @{{ friendToDeleteUsername }}</p>
        <button @click="confirmDeleteFriend" class="delete-confirm-btn">Confirm</button>
      </div>
    </teleport>
  </div>
</template>


<script>
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, doc, deleteDoc, runTransaction } from 'firebase/firestore';

export default {
  data() {
    return {
      friends: [],
      showDeleteConfirmation: false,
      friendToDelete: null,
      friendToDeleteUsername: '',
      showGiftModal: false,
      friendToGiftId: '',
      friendToGiftUsername: '',
      fertiliserAmount: 1, // default to 1
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
        friendsList.push({ id: data.userId2, username: data.username2, name: data.name2 });
      });
      querySnapshot2.forEach((doc) => {
        const data = doc.data();
        friendsList.push({ id: data.userId1, username: data.username1, name: data.name1 });
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

    promptDeleteConfirmation(friendId, friendUsername) {
      this.friendToDelete = friendId;
      this.friendToDeleteUsername = friendUsername;
      this.showDeleteConfirmation = true;
    },

    confirmDeleteFriend() {
      if (this.friendToDelete) {
        this.deleteFriend(this.friendToDelete);
        this.showDeleteConfirmation = false;
        this.friendToDelete = null;
      }
    },

    cancelDelete() {
      this.showDeleteConfirmation = false;
      this.friendToDelete = null;
    },

    promptGiftFertiliser(friendId, username) {
      this.friendToGiftId = friendId;
      this.friendToGiftUsername = username;
      this.showGiftModal = true;
    },

    async confirmGift() {
  const auth = getAuth();
  const currentUserUid = auth.currentUser ? auth.currentUser.uid : null;
  const currentUserDocRef = doc(db, 'users', currentUserUid);
  const friendDocRef = doc(db, 'users', this.friendToGiftId);

  
  try {
    await runTransaction(db, async (transaction) => {
      const currentUserDoc = await transaction.get(currentUserDocRef);
      const friendDoc = await transaction.get(friendDocRef);

      if (!currentUserDoc.exists || !friendDoc.exists) {
        console.error('Document does not exist:', currentUserDoc.exists ? 'Friend document missing' : 'Current user document missing');
        throw new Error("One of the documents does not exist!");
      }

      const currentUserFertilisers = currentUserDoc.data().fertiliser;
      const friendFertilisers = friendDoc.data().fertiliser;

      // Make sure the current user has enough fertiliser to gift
      if (this.fertiliserAmount > currentUserFertilisers) {
        throw new Error("Insufficient fertilisers to gift.");
      }

      transaction.update(currentUserDocRef, { fertiliser: currentUserFertilisers - this.fertiliserAmount });
      transaction.update(friendDocRef, { fertiliser: friendFertilisers + this.fertiliserAmount });
    });

    alert('Fertilisers sent successfully!');
  } catch (error) {
    console.error('Transaction failed: ', error);
    alert('Failed to send fertilisers. Please try again.');
  }

  this.showGiftModal = false;
  this.fertiliserAmount = 1; // reset to default
},

    cancelGift() {
      this.showGiftModal = false;
    },
  },
};
</script>


<style scoped>
.friends-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px; 
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
  border-radius: 20px; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
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
  color: black; 
  border: none;
  font-size: 1.2em; 
  cursor: pointer;
}

.no-friends {
  color: #333333;
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

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.delete-confirmation-modal {
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
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #47525E;
}

.delete-confirmation-modal p {
  margin-bottom: 20px;
  color: #47525E;
}

.delete-confirm-btn {
  padding: 8px 16px;
  border: none;
  background-color: #47525E;
  color: white;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
}


.gift-btn {
  background-color: #79BCD9;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: right;
  justify-content: center;
}

.gift-btn img {
  height: 50px; /* Adjust size as necessary */
  width: auto;
}

.gift-modal {
  position: fixed;
}
</style> 
