'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'average_rating', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('products', 'review_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'average_rating');
    await queryInterface.removeColumn('products', 'review_count');
  }
};
