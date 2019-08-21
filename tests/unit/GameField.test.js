import { shallowMount, createLocalVue } from '@vue/test-utils';

import GameField from '@/components/GameField';
import variables from '@/variables';

const localVue = createLocalVue();

const propsData = {gameField: {id: 1, name: 'Demo', rows: [[2, 2]], columns: [[2], [2]]}};

describe('GameField', () => {
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

  describe('checkLine function', () => {
    it('checks nothing when nothing is selected', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.checkLine([1, 2, 3], [])).toEqual([false, false, false]);
    });

    it('checks everything when everything is selected', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.checkLine([1, 2, 3], [1, 2, 3])).toEqual([true, true, true]);
    });

    it('checks first math from list', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.checkLine([1, 1, 1], [1])).toEqual([true, false, false]);
    });

    it('checks correctly any cases', () => {
      const wrapper = shallowMount(GameField, {localVue, propsData});

      expect(wrapper.vm.checkLine([1, 2, 3, 1], [1, 2, 3])).toEqual([true, true, true, false]);
      expect(wrapper.vm.checkLine([1, 2, 3, 4], [3, 4, 7])).toEqual([false, false, true, true]);
      expect(wrapper.vm.checkLine([1, 2, 2, 2, 1], [1, 2, 1, 2, 1])).toEqual([true, true, true, false, true]);
    });
  });
});