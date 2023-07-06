const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

module.exports = {
  format_time: function (date) {
    return date.toLocaleTimeString();
  },

  time_passed: function (date) {
    return dayjs(date).fromNow();
  },

  latestIndex: function (array) {
    return array[array.length - 1];
  },

  sentOrReceived: function (string) {
    if (string.startsWith('Sent')) {
      return true;
    } else {
      return false;
    }
  },
};
