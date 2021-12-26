const bcrypt = require("bcrypt");
const jwtUtils = require('../utils/jwt.utils');
const models = require('../models');
const asyncLib = require('async');
const fs = require('fs');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

// Routes 
module.exports = {
    register: function (req, res) {

        // Params

        let email = req.body.email;
        let name = req.body.name;
        let lastname = req.body.lastname;
        let password = req.body.password;
        let bio = req.body.bio;

        if (email == null || name == null || lastname == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (name.length >= 15 || name.length <= 2) {
            return res.status(400).json({ 'error': 'wrong name (length must be 2 - 15)' });
        }
        if (lastname.length >= 15 || lastname.length <= 2) {
            return res.status(400).json({ 'error': 'wrong lastname (length must be 2 - 15)' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid (length 4 - 8 & at least one digit' });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            },
            function (userFound, bcryptedPassword, done) {
                var newUser = models.User.create({
                    email: email,
                    name: name,
                    lastname: lastname,
                    password: bcryptedPassword,
                    bio: bio,
                    isAdmin: 0
                })
                    .then(function (newUser) {
                        done(newUser);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    });
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add user' });
            }
        });
    },
    login: function (req, res) {

        // Params
        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { email: email }
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
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },
    getUserProfile: function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({ 'error': 'wrong token' });

        models.User.findOne({
            attributes: ['id', 'email', 'name', 'lastname', 'bio', 'imageUrl'],
            where: { id: userId }
        }).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }).catch(function (err) {
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },
    updateUserProfile: function (req, res) {
        // Getting auth header
        // console.log('mon fichier', req.file, "body", req.body);
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var bio = req.body.bio;
        var name = req.body.name;
        var lastname = req.body.lastname;

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
                if (userFound) {
                    if (!!(userFound.imageUrl)) {
                        var filename = userFound.imageUrl.split('/images/')[1];
                    }

                    userFound.update({
                        bio: (bio ? bio : userFound.bio),
                        name: (name ? name : userFound.name),
                        lastname: (lastname ? lastname : userFound.lastname),
                        imageUrl: ( !!(req.file) ? ( fs.unlink(`images/${filename}`, () => { }), `${req.protocol}://${req.get('host')}/images/${req.file.filename}` ) : userFound.imageUrl ),
                    }).then(function () {
                        done(userFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'cannot update user' });
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
            }
        });
    },
    getOneUserProfile : async function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var Id = jwtUtils.getUserId(headerAuth);

        if (Id < 0) 
            return res.status(400).json({ 'error': 'wrong token' });
        
        
        userId = req.params.userId
       
        if (userId < 0) {
            return res.status(400).json({ 'error': 'wrong token' });
        }

        models.User.findOne({
            attributes: ['id', 'bio', 'name', 'lastname', 'imageUrl'],
            where: { id: userId }
        }).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }).catch(function (err) {
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
        
    },
    deleteAccount : async function (req, res) {
        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var Id = jwtUtils.getUserId(headerAuth);

        var userId = parseInt(req.params.userId);

        if (Id < 0) 
            return res.status(400).json({ 'error': 'wrong token' });
        
        let userFound = await models.User.findOne({
            where: { id: userId }
        });

        let postFounds = await models.Post.findAll({
            where: { userId: userId}
        });

        if (userFound) {
            if (userFound.imageUrl != null) {
                var filename = userFound.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                   
                    for ( let i = 0; i < postFounds.length; i++ ) {
                        if (postFounds[i].attachment) {
                            var attachment = postFounds[i].attachment.split('/images/')[1];
                            fs.unlink(`images/${attachment}`, () => {
                                models.Comment.destroy({
                                    where: { postId: postFounds[i].id}
                                });
                                models.Like.destroy({
                                    where: { postId: postFounds[i].id}
                                });
                                models.Post.destroy({
                                    where: { id: postFounds[i].id}
                                });
                            })
                        } else {
                            models.Comment.destroy({
                                where: { postId: postFounds[i].id}
                            });
                            models.Like.destroy({
                                where: { postId: postFounds[i].id}
                            });
                            models.Post.destroy({
                                where: { id: postFounds[i].id}
                            });
                        }
                    };
                    models.Comment.destroy({
                        where: { userId: userId}
                    });
                    models.Like.destroy({
                        where: { userId: userId}
                    });
                    models.User.destroy({
                        where: { id: userId }
                    });
                })
                res.status(200).send({ 'message': 'user deleted'})
            } else {
               
                for ( let i = 0; i < postFounds.length; i++ ) {
                    if (postFounds[i].attachment) {
                        var attachment = postFounds[i].attachment.split('/images/')[1];
                        fs.unlink(`images/${attachment}`, () => {
                            models.Comment.destroy({
                                where: { postId: postFounds[i].id}
                            });
                            models.Like.destroy({
                                where: { postId: postFounds[i].id}
                            });
                            models.Post.destroy({
                                where: { id: postFounds[i].id}
                            });
                        })
                    } else {
                        models.Comment.destroy({
                            where: { postId: postFounds[i].id}
                        });
                        models.Like.destroy({
                            where: { postId: postFounds[i].id}
                        });
                        models.Post.destroy({
                            where: { id: postFounds[i].id}
                        });
                    }
                };
                models.Comment.destroy({
                    where: { userId: userId}
                });
                models.Like.destroy({
                    where: { userId: userId}
                });
                models.User.destroy({
                    where: { id: userId }
                });
                res.status(200).send({ 'message': 'user deleted'})
            }
        } else {
            res.status(400).json({ 'error': 'user not found' });
        }

    }
};