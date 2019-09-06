import { shallowMount, createLocalVue } from '@vue/test-utils';

import GameKeyboard from '@/components/GameKeyboard';
import variables from '@/variables';

const localVue = createLocalVue();

describe('GameKeyboard', () => {
  describe('dPad', () => {
    it('has #dPad block', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('#dPad').exists()).toBe(true);
    });

    it('has "up" button', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('#dPad button.up').exists()).toBe(true);
    });

    it('has "right" button', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('#dPad button.right').exists()).toBe(true);
    });

    it('has "down" button', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('#dPad button.down').exists()).toBe(true);
    });

    it('has "left" button', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('#dPad button.left').exists()).toBe(true);
    });

    it('emits "move" event with "up" payload on button.up click', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      wrapper.find('#dPad button.up').trigger('click');

      expect(wrapper.emitted('move').length).toBe(1);
      expect(wrapper.emitted('move')[0]).toEqual(['up']);
    });

    it('emits "move" event with "right" payload on button.right click', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      wrapper.find('#dPad button.right').trigger('click');

      expect(wrapper.emitted('move').length).toBe(1);
      expect(wrapper.emitted('move')[0]).toEqual(['right']);
    });

    it('emits "move" event with "down" payload on button.down click', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      wrapper.find('#dPad button.down').trigger('click');

      expect(wrapper.emitted('move').length).toBe(1);
      expect(wrapper.emitted('move')[0]).toEqual(['down']);
    });

    it('emits "move" event with "left" payload on button.left click', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      wrapper.find('#dPad button.left').trigger('click');

      expect(wrapper.emitted('move').length).toBe(1);
      expect(wrapper.emitted('move')[0]).toEqual(['left']);
    });
  });

  describe('Keyboard mode', () => {
    it('has #keyboardMode block', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('#keyboardMode').exists()).toBe(true);
    });

    it('has "select" mode', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('button.select').exists()).toBe(true);
    });

    it('has "cancel" mode', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('button.cancel').exists()).toBe(true);
    });

    it('has "clean" mode', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('button.clean').exists()).toBe(true);
    });

    it('sets "select" mode by default', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('button.select').classes()).toContain('selected');
    });

    it('changes selected mode after click on "cancel" button', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      expect(wrapper.find('button.cancel').classes()).not.toContain('selected');
      wrapper.find('button.cancel').trigger('click');
      expect(wrapper.find('button.select').classes()).not.toContain('selected');
      expect(wrapper.find('button.cancel').classes()).toContain('selected');
    });

    it('emits "select" event with "CELL_FILLED" payload on button.select press', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      wrapper.find('button.select').trigger('click');

      expect(wrapper.emitted('select').length).toBe(1);
      expect(wrapper.emitted('select')[0]).toEqual([variables.CELL_FILLED]);
    });

    it('emits "select" event with "CELL_FILLED" payload on ENTER key press', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      let event = new KeyboardEvent('keyup', {code: 'Enter'});
      document.dispatchEvent(event);

      expect(wrapper.emitted('select').length).toBe(1);
      expect(wrapper.emitted('select')[0]).toEqual([variables.CELL_FILLED]);
    });

    it('emits "select" event with "CELL_FILLED" payload on SPACE key press', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      let event = new KeyboardEvent('keyup', {code: 'Space'});
      document.dispatchEvent(event);

      expect(wrapper.emitted('select').length).toBe(1);
      expect(wrapper.emitted('select')[0]).toEqual([variables.CELL_FILLED]);
    });

    it('emits "select" event with "CELL_FILLED" payload on key Z press', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      let event = new KeyboardEvent('keyup', {code: 'KeyZ'});
      document.dispatchEvent(event);

      expect(wrapper.emitted('select').length).toBe(1);
      expect(wrapper.emitted('select')[0]).toEqual([variables.CELL_FILLED]);
    });

    it('emits "select" event with "CELL_CANCELLED" payload on key X press', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      let event = new KeyboardEvent('keyup', {code: 'KeyX'});
      document.dispatchEvent(event);

      expect(wrapper.emitted('select').length).toBe(1);
      expect(wrapper.emitted('select')[0]).toEqual([variables.CELL_CANCELLED]);
    });

    it('emits "select" event with "CELL_EMPTY" payload on key C press', () => {
      const wrapper = shallowMount(GameKeyboard, {localVue});
      let event = new KeyboardEvent('keyup', {code: 'KeyC'});
      document.dispatchEvent(event);

      expect(wrapper.emitted('select').length).toBe(1);
      expect(wrapper.emitted('select')[0]).toEqual([variables.CELL_EMPTY]);
    });
  });
});
