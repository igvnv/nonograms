import Vue from 'vue';
import Vuex from 'vuex';
import {SET_GAME_DATA, SET_GAMES_LIST, SET_GAMES_LIST_LOADING_STATUS} from './mitation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gameData: null,
    gamesList: [],
    gamesListLoadingStatus: '',
  },
  mutations: {
    [SET_GAME_DATA]: function (state, gameData) {
      state.gameData = gameData;
    },
    [SET_GAMES_LIST_LOADING_STATUS]: function (state, newStatus) {
      switch (newStatus) {
        case 'loading':
        case 'done':
        case 'error':
          break;
        default:
          console.error(`Invalid games list loading status: ${newStatus}`);
          newStatus = 'error';
      }

      state.gamesListLoadingStatus = newStatus;
    },

    [SET_GAMES_LIST]: function (state, gamesList) {
      state.gamesList = gamesList;
    }
  },
  actions: {
    loadGameData: async function ({state, commit, dispatch}, payload) {
      commit(SET_GAME_DATA, null);

      if (!state.gamesList.length) {
        await dispatch('loadGames');
      }

      let gameData = state.gamesList.find(game => game.id == payload);

      if (gameData) {
        commit(SET_GAME_DATA, gameData);
      }
      else {
        console.error(`Game ${payload} not found`);
      }
    },

    loadGames: async function ({state, commit}) {
      // Games list has been loaded earlier.
      if (state.gamesList.length > 0) return;

      commit(SET_GAMES_LIST, []);
      commit(SET_GAMES_LIST_LOADING_STATUS, 'loading');

      // TODO: Add asynchronous loading games from backend
      commit(SET_GAMES_LIST, [
        {
          'id': 1,
          'name': 'Easy',
          'rows': [
            [2],
            [3],
            [2],
            [2],
            [5]
          ],
          'columns': [
            [1],
            [1, 1],
            [5],
            [5],
            [1]
          ]
        },
        {
          'id': 2,
          'name': 'I love JS!',
          'rows': [
            [20],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 2, 4, 1],
            [1, 2, 6, 1],
            [1, 2, 2, 2, 1],
            [1, 2, 3, 1],
            [1, 2, 4, 1],
            [1, 2, 3, 1],
            [1, 2, 3, 1],
            [1, 2, 2, 2, 3, 1],
            [1, 6, 6, 1],
            [1, 4, 4, 1],
            [1, 1],
            [20]
          ],
          'columns': [
            [20],
            [1, 1],
            [1, 1],
            [1, 1],
            [1, 2, 1],
            [1, 3, 1],
            [1, 2, 1],
            [1, 2, 1],
            [1, 10, 1],
            [1, 9, 1],
            [1, 1],
            [1, 3, 2, 1],
            [1, 5, 3, 1],
            [1, 2, 2, 2, 1],
            [1, 2, 2, 2, 1],
            [1, 3, 6, 1],
            [1, 2, 4, 1],
            [1, 2, 1],
            [1, 1],
            [20]
          ]
        }
      ]);
      commit(SET_GAMES_LIST_LOADING_STATUS, 'done');
    }
  }
})
