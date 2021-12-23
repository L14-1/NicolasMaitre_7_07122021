// Imports
var models   = require('../models');
var jwtUtils = require('../utils/jwt.utils');


// Routes
module.exports = {
  commentPost:  async function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var postId = parseInt(req.params.postId);

    if (postId <= 0 || userId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    let userInfos = await models.User.findOne({
        attributes: ['id', 'name', 'lastname', 'imageUrl'],
        where: { id: userId }
    })

    models.Comment.create({
        postId: postId,
        userId: userId,
        name: userInfos.name,
        lastname: userInfos.lastname,
        imageUrl: userInfos.imageUrl,
        comment: req.body.comment,
    });

    res.status(200).send({ 'message': 'comment posted'})

  }
}