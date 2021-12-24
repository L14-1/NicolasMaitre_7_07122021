'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        
        models.Post.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          },
          onDelete:'CASCADE',
        }),
        models.Post.hasMany(models.Like),
        models.Post.hasMany(models.Comment)
      }
    }
  });
  return Post;
};