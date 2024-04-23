<template>
    <div class="farm">
        <div class="buttons-menu">
            <router-link to="/SocialPage" class="button">Social</router-link>
            <button @click="openModal" class="button">Shop</button>
        </div>
        <ShopModal v-if="showModal" @close="closeModal" />
  </div>
</template>

<script>
import ShopModal from "@/components/ShopModal.vue";

export default {
  components: {
    ShopModal
  },
  data() {
    return {
      showModal: false
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
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
</style>
  