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

  },
  deleteComment:  async function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var commentId = parseInt(req.params.commentId);

    if (commentId <= 0 || userId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    let userDeleting = await models.User.findOne({
      where: {id: userId}
    });

    let commentFound = await models.Comment.findOne({
      where: {id: commentId}
    });

    if (commentFound) {
      if (commentFound.userId == userId || userDeleting.isAdmin == 1) {
        models.Comment.destroy({
          where: { id: commentId}
        });
        res.status(200).send({ 'message': 'comment deleted'})
      } else {
        res.status(400).send({ 'error': 'user deleting is not admin'})
      }
    } else {
      res.status(400).send({ 'error': 'cannot find comment'})
    }
    


  },
  updateComment:  async function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var commentId = parseInt(req.params.commentId);
    let newComment = req.body.comment;

    if (commentId <= 0 || userId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    let commentFound = await models.Comment.findOne({
      where: {id: commentId}
    });

    if (commentFound) {
      commentFound.update({
        comment: (newComment ? newComment : commentFound.comment)
      })
      res.status(200).send({ 'message': 'comment updated'})
    } else {
      res.status(400).send({ 'error': 'cannot find comment'})
    }

  },
}