'use strict';
module.exports = (sequelize, DataTypes) => {
  var Like = sequelize.define('Like', {
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Post',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
  }, {});
  Like.associate = function(models) {
    // associations can be defined here

    models.Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete:'CASCADE',
    }),
    models.Like.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post',
      onDelete:'CASCADE',
    });
  };
  return Like;
};