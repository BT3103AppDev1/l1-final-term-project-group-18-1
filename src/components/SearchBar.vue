<template>
    <div class = "search-bar">  
        <!-- text input bound to the searchQuery data property, any changes to this input update searchQuery in real-time 
         @input adds an event listener for the input event, everytime user types something 'fetchSuggestion' method is called
         focus event hides the placeholder, blur eveent checks if searchQuery is empty and toggle the visibility of the placeholder-->
        <input type="text" v-model="searchQuery" class="search-input" 
        :placeholder="placeholderText"
        @input="fetchSuggestions" 
        @focus="showPlaceholder = false"
        @blur = "showPlaceholder = !searchQuery">
        <!-- : is short for v-bind so that vue won't register the whole thing as a string -->
        <!-- button that manually triggers the fetch suggestions method -->
  
        <ul v-if="searchQuery" class="suggestions-dropdown">
            <!-- Show "No result found" if there are no suggestions -->
            <li v-if="suggestions.length === 0 && displayNoResult" class="no-results">
                No result found (Please contact us if you think there is an issue)
            </li>
            <!-- List items for each suggestion -->
            <li v-else v-for="suggestion in suggestions" :key="suggestion.id"
                  @click="selectItem(suggestion)">
                    {{ suggestion.name }}
            </li>
          </ul>
    </div>
</template>

<script>
  import { compileScript } from 'vue/compiler-sfc';
import { db } from '../firebaseConfig.js'; // imports the firebase configuration 
  import { collection, query, where, getDocs } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        searchQuery: '',
        showPlaceholder: true,
        suggestions: [], //store suggestions here
        isAutofilling: false, //boolean to indicate autofill so it won't fetch suggestions again
        displayNoResult: false,
      };
    },
    watch: { //watch to remove dropdown list when user clears the search field 
    searchQuery(value) {
      if (value.trim() === '') {
        this.suggestions = [];
        this.displayNoResult = false;
      } else {
        this.fetchSuggestions();
      }
      }
    },
    computed: {
      placeholderText() {
        if (this.showPlaceholder) {
          return "What will you be recycling today?";
        } else {
          return this.searchQuery; //use the route param as a placeholder
        } 
      }
    },

    methods:{
      async fetchSuggestions() {
        console.log("fetching suggestions")
         if(this.isAutofilling){
           return; //do not fetch anything if it is autofilling     
         }
         const input = this.searchQuery.trim().toLowerCase(); // converts input to lowercase
         if (this.searchQuery.trim().length >= 2) { //this first check if user's input has more than 2 characters
            const itemsRef = collection(db, "recyclableItemDetails"); // this creates a reference to the "recyclableItemDetails collection"
            const q = query(itemsRef, 
                            where("name", ">=", input), 
                            where("name", "<=", input + '\uf8ff')); //"<=, >= and \uf8ff effectively searches for 
                                                                              //cany names that start with specified query string, achieving the start with search functionality"
            const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) { 
              this.suggestions = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
              this.displayNoResult = false;
          } else {
            this.suggestions = [];
            this.displayNoResult = true;
          }
          } else {
            console.log ('waiting for more input before suggesting to optimise suggestion function')
            this.displayNoResult = true;
          }
          console.log("current suggestion length" + this.suggestions.length)
      },
  
      selectItem(suggestion) {
        this.isAutofilling = true, //change to isautofill
        this.searchQuery = suggestion.name; // Autofill the search bar
        this.showPlaceholder = false;
        this.suggestions = []; // clear suggestions after selection 
        this.$emit('update-query', this.searchQuery); //emitting query to parent
        this.displayNoResult = false; //reset to false

        this.$nextTick(() => { //using next tick to run this line after vue has updated the dom and autofilled
          this.isAutofilling = false; //set it back to false
        })

        this.searchItem();
      },

      searchItem(){
        if (this.searchQuery.trim()) {
          // Use the router to navigate to the search result page of the item with the searchQuery as a parameter, 
          this.$router.push({ name: 'SearchPage', params: { searchQuery: this.searchQuery } });
        } else {
          alert("Please enter an item to recycle in the search bar.");
        }
      }
    }
  }
</script>

<style scoped> 
/* scoped can help us make sure that the style for the search bar don't affect other elements and global stules don't affect my component */

.search-bar{
  position: relative;
  display: flex;
  align-items:center;
}

.search-input::placeholder{
  font-size: 1.2rem;
}
.search-input{
  width: 800px;
  padding: 1.2rem;
  border: 2px solid #ccc;
  border-radius: 20px;
  background: white url('@/assets/searchIcon.png');
  background-repeat:no-repeat;
  background-position: 10px center;
  background-size: 40px 40px;
  text-align:center;
  z-index: 1001;
}

.suggestions-dropdown {
  display:block;
  top: 100%;; /*set top offset to 100% of the height of the search bar container */
  width: 850px; /*match the width of the search-bar container */
  left: 0; /* align the left edge of the search-bar container */
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: absolute;
  background-color: white;
  /*background: white; */
  /*background-color: yellow*/;
  z-index: 1000; /* Ensure it sits above other content */
}

.suggestions-dropdown li {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  color: black;
}

.suggestions-dropdown li:last-child {
  border-bottom: none;
}

ul.suggestions-dropdown li.no-results {
    padding: 10px;
    color: #999;
    cursor: default; /* More specific, should override other cursor settings */
    background-color: transparent;
}

ul.suggestions-dropdown li.no-results:hover {
    background-color: transparent;
}


</style>