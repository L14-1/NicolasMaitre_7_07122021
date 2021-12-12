// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class User extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       models.User.hasMany(models.POSTS);
//     }
//   };
//   User.init({
//     email: DataTypes.STRING,
//     name: DataTypes.STRING,
//     lastname: DataTypes.STRING,
//     password: DataTypes.STRING,
//     bio: DataTypes.STRING,
//     isAdmin: DataTypes.BOOLEAN
//   }, {
//     sequelize,
//     modelName: 'User',
//   });
//   return User;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function (models) {
        // assooiations can be defined here:

        models.User.hasMany(models.POSTS);
      }
    }
  });
  return User;
};