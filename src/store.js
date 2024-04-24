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
    updateFertiliser(state, newValue) {
      state.fertiliser = newValue;
    },
  },
  actions: {
    updateUpcomingEvents({ commit }, events) {
      commit('setUpcomingEvents', events);
    }
  }
});
