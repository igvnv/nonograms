import { hideTextFilter } from '@/filters/hideText';

describe('hideText filter', () => {
  it('replaces letters and numbers', () => {
    expect(hideTextFilter('Abc 123!')).toEqual('&#10033;&#10033;&#10033; &#10033;&#10033;&#10033;!');
  });
});