<template>
  <div class="modal">
    <span class="close-btn" @click="close">&times;</span>
    <h2>Shop</h2>
      
    <div class="items-container"> 
      <div class="item-container" v-for="item in shopItems" :key="item.id">
        <div class="item-box">
          <img :src="item.imageURL" :alt="item.name" class="item-image"/>
          <p>Fun Fact: {{ item.funfact }}</p><br>
          <div class="fertiliser-container">
            <img src="@/assets/fertiliser.png" alt="Fertiliser" class="fertiliser-icon">
            <span class="fertiliser-number">{{ item.fertiliser }}</span>
          </div>
        </div>
        <div class="buy-item">
          <input type="radio" :id="'item_' + item.id" :value="item" v-model="selectedItem" class="item-radio">
        </div>
      </div>
    </div>

    <div>
      <p v-if="noItemsChosen" class="message">Please select an item to purchase.</p>
      <p v-if="notEnoughFertilisers" class="message">You do not have enough fertilisers to buy this item.</p>
      <p v-if="successfulPurchase" class="message">Successful purchase!</p>
    </div>

    <button type="confirm" class="confirm-btn" @click="confirmPurchase">Confirm</button>

  </div>
</template>
  
  <script>
    import { ref, onMounted } from 'vue';
    import { db, auth } from '@/firebaseConfig';
    import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from 'firebase/firestore';

    export default {
    data() {
        return {
        selectedItem: null,
        noItemsChosen: false,
        notEnoughFertilisers: false,
        successfulPurchase: false,
        currentUser: null,
        }
    },
    methods: {
        async close() {
            this.$emit("close");
        },

        async confirmPurchase() {
        if (!this.selectedItem) {
            this.noItemsChosen = true; //show msg: please select an item to purchase 
            setTimeout(() => {
                this.noItemsChosen = false;
            }, 4000);
        }

        try {
            // Fetch the user's fertiliser count
            this.currentUser = auth.currentUser;
            if (!this.currentUser) {
                console.log('No user logged in');
            }
            const userId = this.currentUser.uid;
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);
            const userFertilisers = userDoc.data().fertiliser;

            // Check if the user has enough fertilisers 
            if (userFertilisers < this.selectedItem.fertiliser) {
                this.notEnoughFertilisers = true; //show msg: You do not have enough fertilisers to buy this item.
                setTimeout(() => {
                    this.notEnoughFertilisers = false;
                }, 4000);
            } else { 
                // Else, user has enough fertilisers, proceed with the purchase
                this.successfulPurchase = true; //show msg: Successful purchase!
                setTimeout(() => {
                    this.successfulPurchase = false;
                }, 4000);

                // For the purchased item to be reflected in farm automatically
                this.$emit('item-purchased', this.selectedItem);

                // Deduct fertilisers from user's account
                await updateDoc(userRef, { fertiliser: userFertilisers - this.selectedItem.fertiliser });

                // Update the fertiliser count in the global state
                this.$store.commit('updateFertiliser', userFertilisers - this.selectedItem.fertiliser);
                console.log('Fertiliser count updated successfully in global.')

                // Store purchase information in the "farm" collection
                await this.storePurchaseInfo();

                // Reset selected item to unclick the radio button
                this.selectedItem = null;
            }
        } catch (error) {
            console.error("Error confirming purchase:", error);
        }
        },

        async storePurchaseInfo() {
            try {
                const userId = this.currentUser.uid;
                const farmCollectionRef = collection(db, "farm");
                const userFarmDocRef = doc(farmCollectionRef, userId);

                const farmDocSnapshot = await getDoc(userFarmDocRef);

                if (farmDocSnapshot.exists()) {
                    // If user already exists, update it
                    const existingFarmItems = farmDocSnapshot.data().items || [];
                    const newItemRef = doc(collection(db, 'farm'));
                    const newItemId = newItemRef.id; // Generate a unique ID for every new item bought

                    const updatedFarmItems = [
                        ...existingFarmItems,
                        {
                            id: newItemId,
                            name: this.selectedItem.name,
                            imageURL: this.selectedItem.imageURL,
                            top: 0,
                            left: 0,
                            width: this.selectedItem.width, 
                            height: this.selectedItem.height 
                        }
                    ];

                    await updateDoc(userFarmDocRef, { items: updatedFarmItems });
                } else {
                    // If the document doesn't exist, create a new one with the purchased item
                    const newItemRef = doc(collection(db, 'farm'));
                    const newItemId = newItemRef.id; // Generate a unique ID for the new item
                    const farmItem = {
                        username: this.currentUser.uid,
                        items: [{
                            id: newItemId,
                            name: this.selectedItem.name,
                            imageURL: this.selectedItem.imageURL,
                            top: 0,
                            left: 0,
                            width: this.selectedItem.width, 
                            height: this.selectedItem.height 
                        }]
                    };
                    await setDoc(userFarmDocRef, farmItem);
                }
                console.log('Purchase information stored successfully.');
            } catch (error) {
                console.error("Error storing purchase information:", error);
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
            const shopItemData = { id: doc.id, ...doc.data() };
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

.item-box {
  position: relative;
}

.fertiliser-container {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

.fertiliser-icon {
  height: auto;
  margin-right: 5px;
  margin-bottom: 20px;
}

.fertiliser-number {
  font-size: 20px; 
  margin-bottom: 20px;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 65%;
  height: 70%;
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
  bottom: 40px; 
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
    margin-top: 90px;
    color:var(--primary-color);
    font-size: 16px;
  }

  

.fertiliser-icon {
  height: auto;
  margin-right: 5px;
}

.fertiliser-icon img{
  height: 150px; 
  width: auto;
}
</style>

