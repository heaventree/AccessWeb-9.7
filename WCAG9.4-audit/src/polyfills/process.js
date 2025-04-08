/**
 * Process object polyfill for browser environments
 */

const process = {
  env: {
    NODE_ENV: 'development'
  },
  nextTick: function(fn, ...args) {
    setTimeout(() => fn(...args), 0);
  },
  browser: true,
  cwd: function() { return '/'; },
  version: '',
  versions: {},
  platform: 'browser'
};

export default process;