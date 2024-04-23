<template>
    <div class="farm">
        <div class="buttons-menu">
            <router-link to="/SocialPage" class="button">Social</router-link>
            <button @click="openModal" class="button">Shop</button>
        </div>
        <ShopModal v-if="showModal" @close="closeModal" />

        <!-- Display farm items -->
        <div class="farm-items"> 
            <div v-for="(item, index) in farmItems" :key="index" class="item">
                <img v-for="n in item.quantity" :key="n" :src="item.imageURL" :alt="item.name" class="item-image" />
            </div>
        </div>
    </div>
</template>

<script>
import ShopModal from "@/components/ShopModal.vue";
import { db, auth } from '@/firebaseConfig';
import { collection, doc, getDoc } from 'firebase/firestore';
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
        this.initialiseDataWithDelay();
    },
    methods: {
        initialiseDataWithDelay() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User is signed in, fetching data.");
                    this.currentUser = user; // Set the currentUser
                    this.fetchFarmItems(); // Fetch farm items
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
        async fetchFarmItems() {
            try {
                const userId = this.currentUser.uid; // Use UID instead of username
                const userFarmDocRef = doc(collection(db, 'farm'), userId);
                const userFarmDocSnapshot = await getDoc(userFarmDocRef);

                if (userFarmDocSnapshot.exists()) {
                    const farmItemsData = userFarmDocSnapshot.data().items || [];
                    // Extract imageURL from each farm item
                    this.farmItems = farmItemsData.map(item => ({
                        imageURL: item.imageURL,
                        quantity: item.quantity
                    }));
                }
            } catch (error) {
                console.error('Error fetching farm items:', error);
            }
        }
    }
};
</script>


<style>
    .farm {
    display: flex;
    flex-direction: column; 
    background-image: url('src/assets/defaultFarm.png'); 
    background-size: cover; 
    background-position: center; 
    background-repeat: no-repeat;
    position: fixed;
    top: 8%;
    right: 0px;
    width: 100vw;  
    height: 92vh;
    }

    .buttons-menu {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 1%;
    margin-right: 1%; 
    }

    .button {
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
    }

    .button:hover {
    background-color: #357B9A; /* Keep the same color as default */
}

.farm-items {
    display: flex;
}

.item {
    width: calc(20% - 10px); /* Adjust item width */
    margin-top: 20%;
}

.item-image {
    width: 100%;
    height: auto;
}
</style>
