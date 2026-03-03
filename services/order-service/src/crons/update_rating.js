const cron = require('node-cron');
const { updateProductRatings } = require('../services/rating_cron_service');

// Runs every day at midnight UTC
const start = () => {
  cron.schedule('0 0 * * *', async () => {
    await updateProductRatings();
  }, {
    timezone: 'UTC',
  });

  console.log('[RatingCron] Scheduled — runs daily at 00:00 UTC');
};

module.exports = { start };