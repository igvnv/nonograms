import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import AppHeader from '@/components/AppHeader';
import messages from '@/i18n/';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VueI18n);

const router = new VueRouter();
const i18n = new VueI18n({locale: 'en', messages});

/** @return Wrapper<AppHeader> */
function getShallowMount() {
  return shallowMount(AppHeader, {localVue, router, i18n});
}

describe('AppHeader', () => {
  describe('Fancy Logo', () => {
    it('adds class .cancelled to logo cell on click', () => {
      const wrapper = getShallowMount();
      const logoCell = wrapper.find('#logo span:nth-child(1)');
      expect(logoCell.classes()).not.toContain('cancelled');
      logoCell.trigger('click');
      expect(logoCell.classes()).toContain('cancelled');
    });

    it('removes class .cancelled from logo cell on the second click', () => {
      const wrapper = getShallowMount();
      const logoCell = wrapper.find('#logo span:nth-child(1)');
      logoCell.trigger('click');
      logoCell.trigger('click');
      expect(logoCell.classes()).not.toContain('cancelled');
    });

    it('changes favicon on logo cell click', () => {
      const wrapper = getShallowMount();

      // Add a link element for favicon like in index.html
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = 'favicon.png';
      document.head.appendChild(link);

      const logoCell = wrapper.find('#logo span:nth-child(1)');
      logoCell.trigger('click');
      expect(link.href).toMatch(/favicon-xoox.png$/);
    });
  });

  describe('Mobile menu', () => {
    it('does not have .opened class for header menu by default', () => {
      const wrapper = getShallowMount();
      expect(wrapper.find('.headerMenu').classes()).not.toContain('opened');
    });

    it('adds .opened class for header menu by click on burger', () => {
      const wrapper = getShallowMount();
      wrapper.find('.burger').trigger('click');
      expect(wrapper.find('.headerMenu').classes()).toContain('opened');
    });

    it('removes .opened class for header menu by second click on burger', () => {
      const wrapper = getShallowMount();
      wrapper.find('.burger').trigger('click');
      wrapper.find('.burger').trigger('click');
      expect(wrapper.find('.headerMenu').classes()).not.toContain('opened');
    });

    it('removes .opened class for header menu by click on any other element on page', () => {
      const wrapper = getShallowMount();

      const anyOtherElement = document.createElement('button');
      document.body.appendChild(anyOtherElement);

      wrapper.find('.burger').trigger('click');
      anyOtherElement.click();

      expect(wrapper.find('.headerMenu').classes()).not.toContain('opened');
    });
  });
});