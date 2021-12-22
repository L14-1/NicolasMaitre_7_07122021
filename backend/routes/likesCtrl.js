// Imports
var models   = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib = require('async');

// Constants
const DISLIKED = 0;
const LIKED    = 1;

// Routes
module.exports = {
  likePost:  async function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var postId = parseInt(req.params.postId);

    if (postId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    const likeFound = await models.Like.findOne({
      where: { postId: postId, userId: userId },
    });

    if (likeFound) {
      console.log(likeFound)
      models.Like.destroy({
        where: { postId: postId, userId: userId}
      });
      res.status(200).send({ 'message': 'unliked this post'})
    } else {
      models.Like.create({
        postId: postId,
        userId: userId,
        isLike: 1,
      });
      res.status(200).send({ 'message': 'like this post'})
    }
    

  },
  dislikePost: function(req, res) {
   // Getting auth header
   var headerAuth  = req.headers['authorization'];
   var userId      = jwtUtils.getUserId(headerAuth);

   // Params
   var postId = parseInt(req.params.postId);

   if (postId <= 0) {
     return res.status(400).json({ 'error': 'invalid parameters' });
   }

   asyncLib.waterfall([
    function(done) {
       models.Post.findOne({
         where: { id: postId }
       })
       .then(function(postFound) {
         done(null, postFound);
       })
       .catch(function(err) {
         return res.status(500).json({ 'error': 'unable to verify post' });
       });
     },
     function(postFound, done) {
       if(postFound) {
         models.User.findOne({
           where: { id: userId }
         })
         .then(function(userFound) {
           done(null, postFound, userFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify user' });
         });
       } else {
         res.status(404).json({ 'error': 'post already liked' });
       }
     },
     function(postFound, userFound, done) {
       if(userFound) {
         models.Like.findOne({
           where: {
             userId: userId,
             postId: postId
           }
         })
         .then(function(userAlreadyLikedFound) {
            done(null, postFound, userFound, userAlreadyLikedFound);
         })
         .catch(function(err) {
           return res.status(500).json({ 'error': 'unable to verify is user already liked' });
         });
       } else {
         res.status(404).json({ 'error': 'user not exist' });
       }
     },
     function(postFound, userFound, userAlreadyLikedFound, done) {
      if(!userAlreadyLikedFound) {
        postFound.addUser(userFound, { isLike: DISLIKED })
        .then(function (alreadyLikeFound) {
          done(null, postFound, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to set user reaction' });
        });
      } else {
        if (userAlreadyLikedFound.isLike === LIKED) {
          userAlreadyLikedFound.update({
            isLike: DISLIKED,
          }).then(function() {
            done(null, postFound, userFound);
          }).catch(function(err) {
            res.status(500).json({ 'error': 'cannot update user reaction' });
          });
        } else {
          res.status(409).json({ 'error': 'post already disliked' });
        }
      }
     },
     function(postFound, userFound, done) {
        postFound.update({
         likes: postFound.likes - 1,
       }).then(function() {
         done(postFound);
       }).catch(function(err) {
         res.status(500).json({ 'error': 'cannot update post like counter' });
       });
     },
   ], function(postFound) {
     if (postFound) {
       return res.status(201).json(postFound);
     } else {
       return res.status(500).json({ 'error': 'cannot update post' });
     }
   });
  }
}