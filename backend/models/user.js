'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function (models) {
        // assooiations can be defined here:

        models.User.hasMany(models.Post);
        models.User.hasMany(models.Like);
        models.User.hasMany(models.Comment);
      }
    }
  });
  return User;
};