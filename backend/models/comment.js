'use strict';
module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('Comment', {
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
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here

    models.Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    }),
    models.Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post',
    });
  };
  return Comment;
};