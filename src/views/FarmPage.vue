<template>
  <div class="farm">

      <!-- Display social and shop buttons -->
      <div class="buttons-menu">
          <router-link to="/SocialPage" class="farm-button">Social</router-link>
          <button @click="openModal" class="farm-button">Shop</button>
      </div>
      <ShopModal v-if="showModal" @close="closeModal" @item-purchased="handleItemPurchased"/>

      <!-- Display farm items -->
      <div class="farm-items">
        <div v-for="(item, index) in farmItems" :key="index" class="item"
          :style="{ top: item.top + 'px', left: item.left + 'px', width: item.width + 'px', height: item.height + 'px' }"
          @mousedown="startDrag($event, index)">
          <img :src="item.imageURL" :alt="item.name" class="item-image" />
        </div>
      </div>

      <!-- Default farm background -->
      <p class="instruction-text">Grow your farm! Drag then click to move farm elements.</p>
      <div class="background"></div>

  </div>
</template>

<script>
import ShopModal from "@/components/ShopModal.vue";
import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  components: {
    ShopModal
  },
  data() {
    return {
      showModal: false,
      farmItems: [],
      currentUser: null
    };
  },
  mounted() {
    const userId = this.$route.params.userId; 
    if (userId) {
      this.fetchFarmItems(userId); 
    } else {
      this.initialiseDataWithDelay(); 
    }
  },
  methods: {
    handleItemPurchased(newItem) {
      // Add the new item to the farmItems array
      this.farmItems.push({
        ...newItem,
        top: 0,  // Default positions
        left: 0
      });
    },
    initialiseDataWithDelay() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User is signed in, fetching data.");
          this.currentUser = user; 
          this.fetchFarmItems(); 
        } else {
          console.error("No user is signed in.");
        }
      });
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async fetchFarmItems(userId = null) {
      const userToFetch = userId || this.currentUser?.uid;
      if (!userToFetch) {
        console.error("No user ID available to fetch farm items.");
        return;
      }

      try {
        const userFarmDocRef = doc(db, 'farm', userToFetch);
        const userFarmDocSnapshot = await getDoc(userFarmDocRef);

        if (userFarmDocSnapshot.exists()) {
          const farmItemsData = userFarmDocSnapshot.data().items || [];
          this.farmItems = farmItemsData.map(item => ({
            id: item.id,
            imageURL: item.imageURL,
            top: item.top || 0, 
            left: item.left || 0,
            width: item.width,
            height: item.height
          }));
          console.log('Farm items fetched successfully for user:', userToFetch);
        } else {
          console.error('Farm data does not exist for user:', userToFetch);
          this.farmItems = []; 
        }
      } catch (error) {
        console.error('Error fetching farm items for user:', userToFetch, error);
      }
    },

    async startDrag(event, index) {
      console.log('startDrag called with item:', this.farmItems[index]);
      const item = this.farmItems[index];
      const initialMouseX = event.clientX;
      const initialMouseY = event.clientY;
      const initialItemX = item.left;
      const initialItemY = item.top;
      console.log('Mouse down at:', event.clientX, event.clientY);

      const handleDrag = (e) => {
        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;
        item.left = initialItemX + dx;
        item.top = initialItemY + dy;
      };

      const endDrag = async () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', endDrag);
        await this.updateItemPosition(item);
      };

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', endDrag);
    },

    async updateItemPosition(item) {
      try {
          const userId = this.currentUser.uid;
          const userFarmDocRef = doc(db, 'farm', userId);
          const userFarmDocSnapshot = await getDoc(userFarmDocRef);

          if (userFarmDocSnapshot.exists()) {
              const items = userFarmDocSnapshot.data().items || [];
              const updatedItems = items.map(existingItem => {
                  if (existingItem.id === item.id) {
                      return {
                          ...existingItem,
                          left: item.left,
                          top: item.top,
                      };
                  } else {
                      return existingItem;
                  }
              });

              await updateDoc(userFarmDocRef, { items: updatedItems });
              console.log('Item position updated successfully.');
          } else {
              console.error('User document does not exist.');
          }
      } catch (error) {
          console.error('Error updating item position:', error);
      }
  }


  }
};
</script>

<style>
  .farm {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 8%;
    right: 0;
    width: 100vw;
    height: 92vh;
    overflow: hidden;
  }

  .instruction-text {
      position: absolute;
      top: 0%;
      left: 1%;
  }

  .background {
    background-image: url('src/assets/defaultFarm.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .buttons-menu {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 1%;
    margin-right: 1%;
  }

  .farm-button {
    display: flex;
    justify-content: center; /* Center the content horizontally */
    align-items: center;
    width: 100px;
    height: 40px;
    background-color: #357B9A;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    padding: 0px;
    border: 0px;
    margin: 0px;
    text-decoration: none;
  }

  .button:hover {
    background-color: #357B9A; /* Keep the same color as default */
  }

  .farm-items {
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
  }

  .item {
    width: calc(20% - 10px); /* Adjust item width*/
    margin-top: 0%;
    z-index: 1;
    position: absolute; /* Position items absolutely for dragging */
  }

  .item-image {
    width: 100%;
    height: auto;
  } 
</style>