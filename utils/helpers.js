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
};
