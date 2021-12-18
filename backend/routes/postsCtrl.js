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
                    models.Posts.create({
                        content: content,
                        attachment: ( !!(attachment) ? `${req.protocol}://${req.get('host')}/images/${attachment}` : null),
                        likes: 0,
                        dislikes: 0,
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

        models.Posts.findAll({
            order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],
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

    }
}