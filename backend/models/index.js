'use strict';

const dbConfig = require("../config/config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.js")(sequelize, Sequelize);
db.Post = require("./post.js")(sequelize, Sequelize);
db.Comment = require("./comment.js")(sequelize, Sequelize);
db.Like = require("./like.js")(sequelize, Sequelize);

db.User.hasMany(db.Like);
db.User.hasMany(db.Comment);
db.User.hasMany(db.Post);

db.Post.belongsTo(db.User, {
  foreignKey: {
    allowNull: false
  },
  onDelete:'CASCADE',
});
db.Post.hasMany(db.Like);
db.Post.hasMany(db.Comment);

db.Comment.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete:'CASCADE',
});
db.Comment.belongsTo(db.Post, {
  foreignKey: 'postId',
  as: 'post',
  onDelete:'CASCADE',
});

db.Like.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete:'CASCADE',
});
db.Like.belongsTo(db.Post, {
  foreignKey: 'postId',
  as: 'post',
  onDelete:'CASCADE',
});

module.exports = db;
