<template>
  <div class="modal">
    <span class="close-btn" @click="close">&times;</span>
    <h2>Shop</h2>
      
    <div class="items-container"> 
      <div class="item-container" v-for="item in shopItems" :key="item.id">
        <div class="item-box">
          <img :src="item.imageURL" :alt="item.name" class="item-image"/>
          <p>Fun Fact: {{ item.funfact }}</p><br>
          <p>Fertiliser: {{ item.fertiliser }}</p>
        </div>
        <div class="buy-item">
          <input type="radio" :id="'item_' + item.id" :value="item" v-model="selectedItem" class="item-radio">
        </div>
      </div>
    </div>

    <div>
      <button type="confirm" class="confirm-btn" @click="confirmPurchase">Confirm</button>
      <p v-if="noItemsChosen" class="message">Please select an item to purchase.</p>
      <p v-if="notEnoughFertilisers" class="message">You do not have enough fertilisers to buy this item.</p>
      <p v-if="successfulpurchase" class="message">Successful purchase!</p>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { db, auth } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      selectedItem: null,
      noItemsChosen: false,
      notEnoughFertilisers: false,
      successfulpurchase: false
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },

    async confirmPurchase() {
      if (!this.selectedItem) {
        this.noItemsChosen = true; //show msg: please select an item to purchase 
        this.messageTimeout = setTimeout(() => { // Set a timeout to hide the message after 4 seconds
          this.noItemsChosen = false;
        }, 4000);
      }

      try {
        // Fetch the user's fertiliser count
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log('No user logged in');
        }
        const userId = currentUser.uid;
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        const userFertilisers = userDoc.data().fertiliser;

        // Check if the user has enough fertilisers 
        if (userFertilisers < this.selectedItem.fertiliser) {
          this.notEnoughFertilisers = true; //show msg: You do not have enough fertilisers to buy this item.
          this.messageTimeout = setTimeout(() => { // Set a timeout to hide the message after 4 seconds
            this.notEnoughFertilisers = false;
          }, 4000);
        } else {
          // User has enough fertilisers, 
          this.successfulpurchase = true; //show msg: You do not have enough fertilisers to buy this item.
          this.messageTimeout = setTimeout(() => { // Set a timeout to hide the message after 4 seconds
            this.successfulpurchase = false;
          }, 4000);
          //
          // 
          // then still need to display onto the farm 
          //
          //
          await updateDoc(userRef, { fertiliser: userFertilisers - this.selectedItem.fertiliser });
        }

      } catch (error) {
        console.error("Error confirming purchase:", error);
      }
    }

  },
  setup() {
    // fetch shop items 
    const shopItems = ref([]);

    const fetchShopItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "farmItems"));
        shopItems.value = querySnapshot.docs.map(doc => {
          const shopItemData = { id: doc.id, ...doc.data(), quantity: 0 };
          return shopItemData;
        })
      } catch (error) {
        console.error("Error fetching shop items: ", error);
      }
    };

    onMounted(fetchShopItems);

    return {
      shopItems,
    };
  },

  beforeUnmount() {
    clearTimeout(this.messageTimeout);
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 65%;
  height: 65%;
  transform: translate(-50%, -50%);
  background: #D5EDDE; 
  padding: 20px;
  z-index: 1000;
  border: 1px solid #457247;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  font-weight: bold;
}

p {
  font-size: 13px;
}

.items-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item-container {
  width: calc(25% - 10px); /* 25% relative to parent box and 10px away from each other */
  margin-top: 20px; /* Add space between item containers */
}

.item-box {
  background-color: #B7CFC1;
  padding: 10px;
  border-radius: 8px;
  min-height: 280px;
  max-height: 300px;
}

.item-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.buy-item {
  margin-top: 5px; /* Add space between item box and radio box */
}

.close-btn {
  color: #CF701E;
  position: absolute;
  top: 1%; 
  right: 2%; 
  font-size: 24px; 
  font-weight: bold; 
  cursor: pointer;
}

.confirm-btn {
  position: absolute;
  bottom: 20px; 
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--primary-color);
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
}

.message {
    margin-top: 0.3rem;
    color:var(--primary-color);
    font-size: 16px;
  }

</style>
