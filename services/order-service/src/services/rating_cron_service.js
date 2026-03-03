const { Review, sequelize } = require('../models');
const { Op, fn, col } = require('sequelize');
const axios = require('axios');
const config = require('../config');

// Fetch all distinct product_ids that have received reviews since the last run,
// compute their average score and review count, then push updates to product-service.
const updateProductRatings = async () => {
  console.log('[RatingCron] Starting product rating update...');

  try {
    const results = await Review.findAll({
      attributes: [
        'product_id',
        [fn('AVG', col('score')), 'average_rating'],
        [fn('COUNT', col('id')), 'review_count'],
      ],
      group: ['product_id'],
      raw: true,
    });

    if (results.length === 0) {
      console.log('[RatingCron] No reviews found, skipping.');
      return;
    }

    // Fire updates to product-service in parallel
    await Promise.all(
      results.map(({ product_id, average_rating, review_count }) =>
        axios.patch(
          `${config.services.product_service_url}/api/v1/products/${product_id}/rating`,
          {
            average_rating: parseFloat(parseFloat(average_rating).toFixed(2)),
            review_count: parseInt(review_count),
          }
        ).catch((err) => {
          // Log but don't throw — one failed update shouldn't abort the entire cron run
          console.error(`[RatingCron] Failed to update product ${product_id}:`, err.message);
        })
      )
    );

    console.log(`[RatingCron] Updated ratings for ${results.length} products.`);
  } catch (err) {
    console.error('[RatingCron] Fatal error:', err.message);
  }
};

module.exports = { updateProductRatings };