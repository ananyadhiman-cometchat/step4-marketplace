const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
// Watchman's watch-project hangs on this machine; Node's watcher + raised ulimit is reliable.
config.resolver.useWatchman = false;
module.exports = config;
