import { createStore } from 'vuex';

export default createStore({
  state: {
    fertiliser: 0,
  },
  mutations: {
    updateFertiliser(state, newValue) {
      state.fertiliser = newValue;
    },
  },
})