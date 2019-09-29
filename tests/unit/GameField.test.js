import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

import GameField from '@/components/GameField';
import variables from '@/variables';
import * as ActionsTypes from "../../src/store/actions-types";

const localVue = createLocalVue();
localVue.use(Vuex);

const propsData = {gameData: {id: 1, name: 'Demo', rows: [[2, 2]], columns: [[2], [2]]}};

describe('GameField', () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        currentLanguage: '',
        /** @type GameModel */
        gameData: null,
        gameProcess: [],
        /** @type GameModel[] */
        gamesList: [],
        gamesListLoadingStatus: '',
        gamesState: {}
      },
      getters: {
        gameState: jest.fn()
      },
      actions: {
        [ActionsTypes.LOAD_GAME_PROCESS]: jest.fn(),
        [ActionsTypes.SAVE_GAME_PROCESS]: jest.fn(),
        [ActionsTypes.LOAD_GAMES_STATE]: jest.fn(),
        [ActionsTypes.SET_GAME_STATE]: jest.fn(),
        [ActionsTypes.LOAD_GAME_DATA]: jest.fn(),
        [ActionsTypes.LOAD_GAMES]: jest.fn(),
      }
    });
  });

  it('returns right size of rows', () => {
    const propsData = {gameData: {id: 1, name: 'Demo', rows: [[1], [1], [1]], columns: [[1], [2]]}};
    const wrapper = shallowMount(GameField, {localVue, propsData});
    expect(wrapper.vm.fieldHeight).toEqual(3);
  });

  it('returns right size of columns', () => {
    const propsData = {gameData: {id: 1, name: 'Demo', rows: [[1], [1], [1]], columns: [[1], [2]]}};
    const wrapper = shallowMount(GameField, {localVue, propsData});
    expect(wrapper.vm.fieldWidth).toEqual(2);
  });

  describe('clean method', () => {
    it('removes filled cells statuses', () => {
      /** @type Wrapper */
      const wrapper = shallowMount(GameField, {localVue, store, propsData});
      wrapper.vm.setCellState(variables.CELL_FILLED, 1, 1);
      expect(wrapper.find('.game span:nth-child(1)').classes()).toContain('filled');
      wrapper.vm.clean();
      expect(wrapper.find('.game span:nth-child(1)').classes()).not.toContain('filled');
    });
  });

  describe('getFilledSubsequences function', () => {
    it('returns empty array when nothing is selected', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.getFilledSubsequences([variables.CELL_EMPTY, variables.CELL_EMPTY, variables.CELL_EMPTY])).toEqual([]);
    });

    it('returns one subsequence when everything is selected', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.getFilledSubsequences([variables.CELL_FILLED, variables.CELL_FILLED, variables.CELL_FILLED])).toEqual([3]);
    });

    it('returns one subsequence when there is one subsequence', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      const
        empty = variables.CELL_EMPTY,
        filled = variables.CELL_FILLED;

      expect(wrapper.vm.getFilledSubsequences([empty, filled, filled, filled, empty, empty])).toEqual([3]);
    });

    it('works correct with more than one subsequence', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      const
        empty = variables.CELL_EMPTY,
        filled = variables.CELL_FILLED;

      expect(wrapper.vm.getFilledSubsequences([empty, filled, filled, filled, empty, filled, filled, empty])).toEqual([3, 2]);
    });
  });

  describe('checkFilledSubsequences function', () => {
    it('checks nothing when nothing is selected', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.checkFilledSubsequences([1, 2, 3], [])).toEqual([false, false, false]);
    });

    it('checks everything when everything is selected', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.checkFilledSubsequences([1, 2, 3], [1, 2, 3])).toEqual([true, true, true]);
    });

    it('checks first math from list', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.checkFilledSubsequences([1, 1, 1], [1])).toEqual([true, false, false]);
    });

    it('checks correctly any cases', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.checkFilledSubsequences([1, 2, 3, 1], [1, 2, 3])).toEqual([true, true, true, false]);
      expect(wrapper.vm.checkFilledSubsequences([1, 2, 3, 4], [3, 4, 7])).toEqual([false, false, true, true]);
      expect(wrapper.vm.checkFilledSubsequences([1, 2, 2, 2, 1], [1, 2, 1, 2, 1])).toEqual([true, true, true, false, true]);
    });
  });
});