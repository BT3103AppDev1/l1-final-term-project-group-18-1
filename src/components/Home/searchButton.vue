<template>
        <button @click="clickBtn" class="search-button">Recycle Item Now</button>
</template>

<script>
  export default {
    methods:{
      clickBtn(){
        this.$router.push({ name: 'SearchPage', params: { searchQuery: 'sampleQuery' } });
      }
 
      }
  }
</script>

<style scoped> 
/* scoped can help us make sure that the style for the search bar don't affect other elements and global stules don't affect my component */
.search-button {
  display:flex;
  align-items: center;
  justify-content: center;
  padding:20px 20px; /*padding around the content*/
  font-weight:bold;
  font-size: 1rem;
  width: 250px;
  height: 70px;
  border-radius: 20px;
  background-image: url('@/assets/recycleIcon.png');
  background-repeat: no-repeat;
  background-position: 10px center; 
  background-size: 40px 40px; /*to scale the image */
  cursor:pointer;
}


</style>