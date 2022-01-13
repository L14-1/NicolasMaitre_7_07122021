'use strict';

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("Like", {
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
  });

  return Like;
};