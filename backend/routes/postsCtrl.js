const models = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

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
                        likes: 0,
                        dislikes: 0,
                        userLikes: null,
                        userDislikes: null,
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
    likePost: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = req.params.id;

        // Params
        var likeOrDislike = req.body.likeOrDislike;

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['id', 'bio', 'name', 'lastname', 'imageUrl'],
                    where: { id: userId }
                }).then(function (userFound) {
                    done(null, userFound);
                }).catch(function (err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            function (userFound, done) {
                models.Post.findOne({
                    attributes: ['id', 'likes', 'dislikes', 'userLikes', 'userDislikes'],
                    where: { id: postId }
                }).then(function (postFound) {
                    done(null, postFound, userFound);
                }).catch(function (err) {
                    console.log(err);
                    return res.status(500).json({ 'error': 'unable to find post' });
                });
            },
            function (postFound, userFound, done) {
                if (userFound) {
                    if (likeOrDislike == 1) {
                        let usersWhoLiked = [];
                        var usersWhoDisliked = [];

                        let totalLikes = postFound.likes
                        var totalDislikes = postFound.dislikes

                        if (postFound.userLikes == null) {
                            if (postFound.userDislikes == null || !(JSON.parse(postFound.userDislikes).includes(userFound.id))) {
                                usersWhoLiked.push(userFound.id);
                                totalLikes = totalLikes + 1; 
                            } else {
                                usersWhoDisliked = JSON.parse(postFound.userDislikes);
                                let index = usersWhoDisliked.indexOf(userFound.id);
                                usersWhoDisliked.splice(index, 1);
                                totalDislikes = totalDislikes -1;

                                usersWhoLiked.push(userFound.id);
                                totalLikes = totalLikes + 1; 
                            }
                        } else {
                            if (postFound.userDislikes == null || !(JSON.parse(postFound.userDislikes).includes(userFound.id))) {
                                usersWhoLiked = JSON.parse(postFound.userLikes)
                                if (!usersWhoLiked.includes(userFound.id)) {
                                    usersWhoLiked.push(userFound.id)
                                    totalLikes = totalLikes + 1;
                                }
                            } else {
                                usersWhoDisliked = JSON.parse(postFound.userDislikes);
                                let index = usersWhoDisliked.indexOf(userFound.id);
                                usersWhoDisliked.splice(index, 1);
                                totalDislikes = totalDislikes -1;

                                usersWhoLiked = JSON.parse(postFound.userLikes)
                                if (!usersWhoLiked.includes(userFound.id)) {
                                    usersWhoLiked.push(userFound.id)
                                    totalLikes = totalLikes + 1;
                                }
                            }
                        }
                        models.Post.update({
                            likes: totalLikes,
                            dislikes: totalDislikes,
                            userLikes: usersWhoLiked,
                            userDislikes: usersWhoDisliked,
                        },
                        {
                            where: { id: postId } 
                        })
                        .then(function () {
                            done(postFound);
                        }).catch(function (err) {
                            res.status(500).json({ 'error': 'cannot like post' });
                        });
                    } else if (likeOrDislike == -1) {
                        let usersWhoLiked = [];
                        var usersWhoDisliked = [];

                        let totalLikes = postFound.likes
                        var totalDislikes = postFound.dislikes

                        if (postFound.userDislikes == null) {
                            if (postFound.userLikes == null || !(JSON.parse(postFound.userLikes).includes(userFound.id))) {
                                usersWhoDisliked.push(userFound.id);
                                totalDislikes = totalDislikes + 1; 
                            } else {
                                usersWhoLiked = JSON.parse(postFound.userLikes);
                                let index = usersWhoLiked.indexOf(userFound.id);
                                usersWhoLiked.splice(index, 1);
                                totalLikes = totalLikes -1;

                                usersWhoDisliked.push(userFound.id);
                                totalDislikes = totalDislikes + 1; 
                            }
                        } else {
                            if (postFound.userLikes == null || !(JSON.parse(postFound.userLikes).includes(userFound.id))) {
                                usersWhoDisliked = JSON.parse(postFound.userDislikes)
                                if (!usersWhoDisliked.includes(userFound.id)) {
                                    usersWhoDisliked.push(userFound.id)
                                    totalDislikes = totalDislikes + 1;
                                }
                            } else {
                                usersWhoLiked = JSON.parse(postFound.userLikes);
                                let index = usersWhoLiked.indexOf(userFound.id);
                                usersWhoLiked.splice(index, 1);
                                totalLikes = totalLikes -1;

                                usersWhoDisliked = JSON.parse(postFound.userDislikes)
                                if (!usersWhoDisliked.includes(userFound.id)) {
                                    usersWhoDisliked.push(userFound.id)
                                    totalDislikes = totalDislikes + 1;
                                }
                            }
                        }
                        models.Post.update({
                            likes: totalLikes,
                            dislikes: totalDislikes,
                            userLikes: usersWhoLiked,
                            userDislikes: usersWhoDisliked,
                        },
                        {
                            where: { id: postId } 
                        })
                        .then(function () {
                            done(postFound);
                        }).catch(function (err) {
                            res.status(500).json({ 'error': 'cannot dislike post' });
                        });
                    };
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                };        
            },
        ], function (postFound) {
            if (postFound) {
                return res.status(201).json(postFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update post likes' });
            }
        });
    }
}