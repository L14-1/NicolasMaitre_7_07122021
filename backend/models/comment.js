'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
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
    name: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    imageUrl: {
      type: DataTypes.STRING
    },
    comment: DataTypes.TEXT
  });

  return Comment;
};