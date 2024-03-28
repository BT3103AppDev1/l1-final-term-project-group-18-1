<template>
    <div class = "search-bar">
        <input type="text" v-model="searchQuery" class="search-input" 
        :placeholder="showPlaceholder ? 'What will you be recycling today?':'' "
        @input="searchItems" 
        @focus="showPlaceholder = false"
        @blur = "showPlaceholder = !searchQuery"
        >
        <button @click="searchItems" class="search-button">Recycle Item Now</button>
        <!-- : is short for v-bind so that vue won't register the whole thing as a string -->
        <ul v-if="suggestions.length">
          <li v-for="suggestion in suggestions" :key="suggestion.id">
            {{ suggestion.name }}
          </li>
        </ul>
    </div>
</template>

<script>
  import { db } from '../firebaseConfig.js'; // Adjust the path as needed
  import { collection, query, where, getDocs } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        searchQuery: '',
        showPlaceholder: true,
        suggestions: [], //store suggestions here
      };
    },
    methods:{
      async fetchSuggestions() {
        if (this.searchQuery.trim().length > 2) {
        const itemsRef = collection(db, "items");
        const q = query(itemsRef, 
                        where("name", ">=", this.searchQuery), 
                        where("name", "<=", this.searchQuery + '\uf8ff'));
        const querySnapshot = await getDocs(q);
        this.suggestions = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        } else {
          this.suggestions = [];
        }
      }
    },
    watch:{
      searchQuery() {
        this.searchItems;
      }
    }
  };
</script>

<style scoped> 
/* scoped can help us make sure that the style for the search bar don't affect other elements and global stules don't affect my component */

.search-bar{
  position: 500px;
  display: flex;
  align-items:center;
}


.search-input::placeholder{
  font-size: 1.2rem;
}
.search-input{
  width: 800px;
  padding: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  border-right: none;
  background: white url('@/assets/searchIcon.jpg');
  background-repeat:no-repeat;
  background-position: 10px center;
  background-size: 25px 25px;
  text-align:center;
}
.search-button{
 background-image: url('@/assets/recycleIcon.jpg');
 background-size: contain;
 background-repeat: no-repeat;
}

</style>