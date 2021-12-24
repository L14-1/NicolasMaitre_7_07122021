// Imports
var models   = require('../models');
var jwtUtils = require('../utils/jwt.utils');


// Routes
module.exports = {
  likePost:  async function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var postId = parseInt(req.params.postId);

    if (postId <= 0 || userId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    const likeFound = await models.Like.findOne({
      where: { postId: postId, userId: userId },
    });

    if (likeFound) {
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
    

  }
}