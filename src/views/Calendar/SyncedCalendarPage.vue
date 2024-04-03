<template>
    <div>
      <h1>Synced Calendar Page</h1>
    </div>
  </template>
  
  <script>
  import GoogleCalendar from '../../GoogleCalendar.js';
  
  export default {
    name: 'SyncedCalendarPage',
    beforeRouteEnter(to, from, next) {
      // Grab the code from the query string
      const code = to.query.code;
      if (code) {
        next(vm => {
          vm.exchangeCodeForToken(code);
        });
      } else {
        next();
      }
    },
    methods: {
      async exchangeCodeForToken(code) {
        // Use the code to fetch tokens
        try {
          const response = await GoogleCalendar.fetchTokens(code);
          // Process the tokens, e.g. store them in Vuex or localStorage
          console.log('Tokens received:', response);
        } catch (error) {
          console.error('Error fetching tokens:', error);
          // Handle the error
        }
      },
    },
  };
  </script>
  