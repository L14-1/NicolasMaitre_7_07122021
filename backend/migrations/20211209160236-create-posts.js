'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    await queryInterface.createTable('POSTS', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idUSERS: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      attachment: {
        type: Sequelize.STRING
      },
      likes: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      dislikes: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('POSTS');
  }
};