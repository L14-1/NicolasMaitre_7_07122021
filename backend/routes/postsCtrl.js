const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');


const CONTENT_LIMIT = 5;
const ITEMS_LIMIT   = 50;

// Routes

module.exports = {
    createPost: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var content = req.body.content;
        var attachment = (!!(req.file) ? req.file.filename : null)

        if (content == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (content.length <= CONTENT_LIMIT) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { id: userId }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    models.Post.create({
                        content: content,
                        attachment: ( !!(attachment) ? `${req.protocol}://${req.get('host')}/images/${attachment}` : null),
                        UserId: userFound.id,
                    })
                    .then(function (newPost) {
                        done(newPost);
                    });

                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (newPost) {
            if (newPost) {
                return res.status(201).json(newPost);
            } else {
                return res.status(500).json({ 'error': 'cannot post this post' });
            }
        });

    },
    listPosts: function (req, res) {

        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Post.findAll({
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['name', 'lastname', 'imageUrl']
            },
            {
                model: models.Like,
                attributes: ['userId']
            },
            {
                model: models.Comment,
                attributes: ['id', 'userId', 'name', 'lastname', 'imageUrl', 'comment']
            }]
        }).then(function (posts) {
            if (posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ "error": "no posts found" });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ "error": "invalid fields" });
        });

    },
    deletePost: async function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        var postId = parseInt(req.params.postId);

        if (postId <= 0 || userId <= 0) {
        return res.status(400).json({ 'error': 'invalid parameters' });
        }

        let postFound = await models.Post.findOne({
            where: {id: postId}
        });

        if (postFound) {
            if (postFound.attachment) {
                var filename = postFound.attachment.split('/images/')[1];
                console.log(filename)
                fs.unlink(`images/${filename}`, () => {
                    models.Comment.destroy({
                        where: { postId: postId}
                    });
                    models.Like.destroy({
                        where: { postId: postId}
                    });
                    models.Post.destroy({
                        where: { id: postId}
                    });
                    res.status(200).send({ 'message': 'post deleted'})
                 })
            } else {
                models.Comment.destroy({
                    where: { postId: postId}
                });
                models.Like.destroy({
                    where: { postId: postId}
                });
                models.Post.destroy({
                    where: { id: postId}
                });
                res.status(200).send({ 'message': 'post deleted'})
            }
        } else {
            res.status(400).send({ 'error': 'cannot find post'})
        }
    },
    updatePost: async function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var postId = parseInt(req.params.postId);
        let newContent = req.body.content;

        if (postId <= 0 || userId <= 0) {
        return res.status(400).json({ 'error': 'invalid parameters' });
        }

        let postFound = await models.Post.findOne({
            where: {id: postId}
        });

        if (postFound) {
            if (!!(postFound.attachment)) {
                var filename = postFound.attachment.split('/images/')[1];
            }
            postFound.update({
                content: (newContent ? newContent : postFound.content),
                attachment: ( !!(req.file) ? ( fs.unlink(`images/${filename}`, () => { }), `${req.protocol}://${req.get('host')}/images/${req.file.filename}` ) : postFound.attachment )
            })
            res.status(200).send({ 'message': 'post updated'})
        } else {
            res.status(400).send({ 'error': 'cannot find post'})
        }
    },
}