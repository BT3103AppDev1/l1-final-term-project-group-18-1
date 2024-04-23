<template>
    <div class="modal">
      <span class="close-btn" @click="close">&times;</span>
      <h2>Shop</h2>
        
      <div class="items-container"> 
        <div class="item-container" v-for="item in shopItems" :key="item.id">
          <div class="item-box">
            <img :src="item.imageURL" :alt="item.name" class="item-image"/>
            <p>{{ item.funfact }}</p>
            <p>Fertiliser: {{ item.fertiliser }}</p>
          </div>
          <div class="qty-box">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" v-model="item.quantity" min="0" step="1" class="qty-input">
          </div>
        </div>
      </div>
  
      <div>
        <button type="confirm" class="confirm-btn">Confirm</button>
      </div>
  
    </div>
  </template>
  
  
  <script>
  import { ref, onMounted } from 'vue';
  import { db } from '@/firebaseConfig';
  import { collection, getDocs } from 'firebase/firestore';
  
  export default {
    methods: {
      close() {
        this.$emit("close");
      },
      addToCart(item) {
        // Logic to add the item to the cart
        console.log("Adding item to cart:", item);
      }
    },
    setup() {
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
        shopItems
      };
    }
  };
  </script>
  
  
  
  <style scoped>
  /* Scoped styles for the component */
  
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
    font-size: 12px;
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
  
  .qty-box {
    margin-top: 5px; /* Add space between item box and quantity box */
  }
  
  .qty-input {
    width: 50px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
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
  
  </style>
  