'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    dislikes : DataTypes.INTEGER,
    userLikes : DataTypes.JSON,
    userDislikes : DataTypes.JSON
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        
        models.Post.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return Post;
};