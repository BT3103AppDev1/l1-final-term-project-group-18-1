import { createStore } from 'vuex';

export default createStore({
  state: {
    upcomingEvents: [],
  },
  mutations: {
    setUpcomingEvents(state, events) {
      state.upcomingEvents = events;
    },
    resetState(state) {
      // Reset the state object
      state.upcomingEvents = [];
    }
  },
  actions: {
    updateUpcomingEvents({ commit }, events) {
      commit('setUpcomingEvents', events);
    },
    logout({ commit }) {
      commit('resetState');
      // Additional logout operations, like redirecting the user or clearing local storage
    }
  }
});
