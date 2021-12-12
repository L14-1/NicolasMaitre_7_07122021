// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class POSTS extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here

//       models.POSTS.belongsTo(models.User, {
//         foreignKey: {
//           allowNull: false
//         }
//       });
//     }
//   };
//   POSTS.init({
//     idUSERS: DataTypes.INTEGER,
//     content: DataTypes.STRING,
//     attachment: DataTypes.STRING,
//     likes: DataTypes.INTEGER,
//     dislikes: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'POSTS',
//   });
//   return POSTS;
// };

'use strict';
module.exports = (sequelize, DataTypes) => {
  var POSTS = sequelize.define('POSTS', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        
        models.POSTS.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });
  return POSTS;
};