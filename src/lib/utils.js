/* eslint no-control-regex: 0 */

/**
  Utility functions
*/

export function regExpEscape(s) {
  return String(s).replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, '\\$1').
      replace(/\x08/g, '\\x08');
}
