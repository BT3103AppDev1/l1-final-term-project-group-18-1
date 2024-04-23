import { createStore } from 'vuex';

export default createStore({
  state: {
    upcomingEvents: []
  },
  mutations: {
    setUpcomingEvents(state, events) {
      state.upcomingEvents = events;
    }
  },
  actions: {
    updateUpcomingEvents({ commit }, events) {
      commit('setUpcomingEvents', events);
    }
  }
});
