<template>
  <div class="friends-list">
    <h2>Your Friends</h2>
    <ul v-if="friends.length > 0">
      <li v-for="friend in friends" :key="friend.id" class="friend-item">
  <div class="friend-info">
    <div class="friend-name">{{ friend.name }}</div>
    <div class="friend-username">@{{ friend.username }}</div>
  </div>
  <div class="friend-buttons">
    <button @click="visitFriendFarm(friend.id)" class="visit-farm-btn">
      <img src="@/assets/door.png" alt="Visit Farm">
    </button>
    <button @click="promptGiftFertiliser(friend.id, friend.username)" class="gift-btn">
      <img src='@/assets/fertiliser.png' alt="Gift Fertiliser">
    </button>
    <button @click="promptDeleteConfirmation(friend.id, friend.username)" class="delete-friend-btn">×</button>
  </div>
</li>

    </ul>
    <div v-else class="no-friends">
      You have no friends added.
    </div>

    <!-- Gift Fertiliser Modal -->
    <teleport to="body">
      <div v-if="showGiftModal" class="overlay" @click="cancelGift"></div>
      <div v-if="showGiftModal" class="gift-modal">
        <button class="close-btn" @click="cancelGift">×</button>
        <h3>Gift Fertiliser</h3>
        <div class="gift-input">
          <label for="fertiliserAmount">Amount:</label>
          <input type="number" id="fertiliserAmount" v-model="fertiliserAmount" min="1">
        </div>
        <p>To: @{{ friendToGiftUsername }}</p>
        <button @click="confirmGift" class="confirm-btn">Confirm</button>
        <p v-if="showFailureMessage" class="failure-message">Insufficient fertiliser balance.</p>
      </div>
    </teleport>

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

    <teleport to="body">
      <div v-if="showGiftSuccessNotification" class="overlay" @click="closeGiftSuccessNotification"></div>
      <div v-if="showGiftSuccessNotification" class="gift-success-notification">
        <button class="close-btn" @click="closeGiftSuccessNotification">×</button>
        <h3>Success!</h3>
        <p>Username: @{{ friendToGiftUsername }}</p>
      </div>
    </teleport>
  </div>
</template>



<script>
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDoc, getDocs, doc, deleteDoc, runTransaction } from 'firebase/firestore';


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
      fertiliserAmount: 1,
      showGiftSuccessNotification: false,
      showFailureMessage: false,
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
        const querySnapshot1 = await getDocs(
          query(
            collection(db, 'friends'),
            where('userId1', '==', friendId)
          )
        );

        const querySnapshot2 = await getDocs(
          query(
            collection(db, 'friends'),
            where('userId2', '==', friendId)
          )
        );

        const combinedSnapshot = [...querySnapshot1.docs, ...querySnapshot2.docs];

        combinedSnapshot.forEach(doc => {
          deleteDoc(doc.ref);
        });

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

    visitFriendFarm(userId) {
    this.$router.push({ name: 'FriendFarm', params: { userId: userId }});
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

          if (!currentUserDoc.exists() || !friendDoc.exists()) {
            throw new Error("Document does not exist!");
          }

          const currentUserFertilisers = currentUserDoc.data().fertiliser;
          const friendFertilisers = friendDoc.data().fertiliser;

          if (this.fertiliserAmount > currentUserFertilisers) {
            throw new Error("Insufficient fertiliser.");
          }

          transaction.update(currentUserDocRef, { fertiliser: currentUserFertilisers - this.fertiliserAmount });
          transaction.update(friendDocRef, { fertiliser: friendFertilisers + this.fertiliserAmount });
        });

        this.showGiftSuccessNotification = true;
      } catch (error) {
        console.error('Transaction failed: ', error);
        this.showFailureMessage = true;
        setTimeout(() => {
          this.showFailureMessage = false;
        }, 4000); 
        return; 
      }

      this.showGiftModal = false;
      this.fertiliserAmount = 1;
    },

    cancelGift() {
      this.showGiftModal = false;
    },

    closeGiftSuccessNotification() {
      this.showGiftSuccessNotification = false;
    },

  },
};
</script>


<style scoped>

.friends-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 350px; 
}

.friends-list h2 {
  color: #457247;
  font-weight: bold;
  margin-bottom: 15px;
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
  align-items: left;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  font-size: 18px;
}

.friend-info {
  margin-top: 0px;
  display: flex;
  flex-direction: column;
}

.friend-name {
  font-weight: bold;
  color: #333333;
  font-size: 20px;
  text-align: left;
}

.friend-username {
  color: #333333;
  text-align: left;
}

.delete-friend-btn {
  background-color: transparent;
  color: black; 
  border: none;
  font-size: 1.5em; 
  cursor: pointer;
  align-items: right;
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

.delete-confirmation-modal h3 {
  font-weight: bold;
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
}

.gift-btn img {
  height: 50px; 
  width: auto;
}

.gift-modal {
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
  color: #47525E;
}

.gift-modal h3 {
  margin-bottom: 20px;
  color: #47525E;
  font-weight: bold;
  font-size: 28px;
}
.gift-modal p {
  margin-bottom: 20px;
  color: #47525E;
}

.gift-success-notification {
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
  color: #47525E;
}
.gift-success-notification h3 {
  font-weight: bold;
}

.failure-message {
  margin-top: 0.3rem;
  color: red !important;
  font-size: 13px;
}
.visit-farm-btn img {
  height: 50px; 
  width: auto;
}

.visit-farm-btn {
  background-color: #79BCD9;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center; 
  justify-content: right;
}

.friends-list ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

.friend-item {
  display: flex;
  justify-content: space-between; /* Distributes space between info and buttons */
  align-items: center; /* Vertical alignment of the contents */
  background-color: #79BCD9;
  margin-bottom: 10px;
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.friend-info {
  flex: 1; /* Allows the friend info to take up the remaining space */
}

.friend-buttons {
  display: flex;
  gap: 10px; /* Space between buttons */
}

/* Styles for buttons */
.visit-farm-btn, .gift-btn, .delete-friend-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center; /* Center items inside the button */
  justify-content: center;
}

.visit-farm-btn img, .gift-btn img {
  height: 40px; /* Adjust size as necessary */
  width: auto; /* Maintain aspect ratio */
}

.delete-friend-btn {
  font-size: 1.5em;
  color: black;
}



</style> 