import { createStore } from 'vuex';

export default createStore({
  state: {
    upcomingEvents: [],
    fertiliser: 0,
  },
  mutations: {
    setUpcomingEvents(state, events) {
      state.upcomingEvents = events;
    },
    resetState(state) {
      // Reset the state object
      state.upcomingEvents = [];
    },
    updateFertiliser(state, newValue) {
      state.fertiliser = newValue;
    },
  },
  actions: {
    updateUpcomingEvents({ commit }, events) {
      commit('setUpcomingEvents', events);
    },
    logout({ commit }) {
      commit('resetState');
    }
  }
});
