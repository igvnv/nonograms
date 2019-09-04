import Vue from 'vue';

/**
 * Replaces all letters and numbers in the input string to asterisks.
 *
 * Must be used with `v-html` because of emoji symbols in HTML representation.
 * Example:
 * ```html
 * <span v-html="$options.filters.hideText('Text to hide')"></span>
 * ```
 */
export const hideTextFilter = function (value) {
  return value.replace(/[aA-zZ0-9]/g, '&#10033;');
};

Vue.filter('hideText', hideTextFilter);