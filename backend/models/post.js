'use strict';

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    content: {
      type: DataTypes.STRING
    },
    attachment: {
      type: DataTypes.STRING
    }
  });

  return Post;
};