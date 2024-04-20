<template>
  <div>
    <div class="page-header">
      <h1>Farm Page</h1>
      <div class="header-buttons">
        <router-link to="/Social" class="button">Social</router-link>
        <router-link to="/Shop" class="button">Shop</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/assets/DefaultFarm.png'

  export default{
    data() {
      return {
        farmImageURL: require('@/assets/DefaultFarm.pn')
      }
    }
  }
</script>

<style>
.farm-page{
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/DefaultFarm.png'); 
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover; /* Cover the entire page */
  position: relative; /* If you need to position elements inside */
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: top;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.button {
  padding: 10px;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

</style>
