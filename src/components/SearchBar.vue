<template>
    <div class = "search-bar">  
        <!-- text input bound to the searchQuery data property, any changes to this input update searchQuery in real-time 
         @input adds an event listener for the input event, everytime user types something 'fetchSuggestion' method is called
         focus event hides the placeholder, blur eveent checks if searchQuery is empty and toggle the visibility of the placeholder-->
        <input type="text" v-model="searchQuery" class="search-input" 
        :placeholder="showPlaceholder ? 'What will you be recycling today?':'' "
        @input="fetchSuggestions" 
        @focus="showPlaceholder = false"
        @blur = "showPlaceholder = !searchQuery">
        <button @click="fetchSuggestions" class="search-button">Recycle Item Now</button>
        <!-- : is short for v-bind so that vue won't register the whole thing as a string -->
        <!-- button that manually triggers the fetch suggestions method -->
        <ul v-if="suggestions.length" class="suggestions-dropdown">
        <!-- ul a conditionally rendered unordered list that shows if there are any suggestions, li list item for each suggestions using vue's v-for
          key is used to maintain the internal consistency of the list when list updates-->
          <li v-for="suggestion in suggestions" :key="suggestion.id"
            @click="selectItem(suggestion)">
            {{ suggestion.name }}
          </li>
        </ul>
    </div>
</template>

<script>
  import { db } from '../firebaseConfig.js'; // imports the firebase configuration 
  import { collection, query, where, getDocs } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        searchQuery: '',
        showPlaceholder: true,
        suggestions: [], //store suggestions here
        isAutofilling: false, //boolean to indicate autofill so it won't fetch suggestions again
      };
    },
    watch: { //watch to remove dropdown list when user clears the search field 
    searchQuery(value) {
      if (value.trim() === '') {
        this.suggestions = [];
      } else {
        this.fetchSuggestions();
      }
      }
    },

    methods:{
      async fetchSuggestions() {
         if(this.isAutofilling){
           return; //do not fetch anything if it is autofilling     
         }
         console.log("called fetchsuggestions")
         const input = this.searchQuery.trim().toLowerCase(); // converts input to lowercase
         console.log("Querying for:", input + " to " + input + '\uf8ff');
         if (this.searchQuery.trim().length >= 2) { //this first check if user's input has more than 2 characters
         console.log("getting into if")
         const itemsRef = collection(db, "recyclableItemDetails"); // this creates a reference to the "recyclableItemDetails collection"
         const q = query(itemsRef, 
                         where("name", ">=", input), 
                         where("name", "<=", input + '\uf8ff')); //"<=, >= and \uf8ff effectively searches for 
                                                                           //cany names that start with specified query string, achieving the start with search functionality"
         const querySnapshot = await getDocs(q);
         console.log("Query Snapshot:", querySnapshot);
         console.log("Documents fetched: ", querySnapshot.docs.length);
         if (this.searchQuery.trim()) { // Check if the input is still not empty
            this.suggestions = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
            console.log("Fetched documents: ", this.suggestions);
         } else {
           this.suggestions = [];
           console.log("not getting any results")
         }
        } else {
          console.log ('waiting for more input before suggesting to optimise suggestion function')
        }
      },
  
      selectItem(suggestion) {
        this.isAutofilling = true, //change to isautofill
        console.log("Suggestion selected:", suggestion);
        this.searchQuery = suggestion.name; // Autofill the search bar
        this.showPlaceholder = false;
        this.suggestions = []; // clear suggestions after selection 

        this.$nextTick(() => { //using next tick to run this line after vue has updated the dom and autofilled
          this.isAutofilling = false; //set it back to false
        })
      },
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
  border: 1px solid #ccc;
  border-radius: 20px;
  border-right: none;
  background: white url('@/assets/searchIcon.png');
  background-repeat:no-repeat;
  background-position: 10px center;
  background-size: 40px 40px;
  text-align:center;
}
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

.suggestions-dropdown {
  display:block;
  top: 100%;; /*set top offset to 100% of the height of the search bar container */
  width: 800px; /*match the width of the search-bar container */
  left: 0; /* align the left edge of the search-bar container */
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: absolute;
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

.suggestions-dropdown li:hover {
  background-color: #f9f9f9;
}

</style>