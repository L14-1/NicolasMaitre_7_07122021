const express = require("express");
const usersCtrl = require("./routes/usersCtrl");
const postsCtrl = require("./routes/postsCtrl");
const likesCtrl = require('./routes/likesCtrl');
const commentsCtrl = require('./routes/commentsCtrl');
const multer = require('./middleware/multer-config');
const multerAttachment = require('./middleware/multer-config-attachment');


// Router

exports.router = (function() {
    const apiRouter = express.Router();

    // Users routes
    apiRouter.route("/users/register/").post(usersCtrl.register);
    apiRouter.post('/users/login/', usersCtrl.login);
    apiRouter.route("/users/me/").get(usersCtrl.getUserProfile);
    apiRouter.put('/users/me/', multer, usersCtrl.updateUserProfile);

    // Posts routes
    apiRouter.post('/posts/new/', multerAttachment, postsCtrl.createPost);
    apiRouter.route("/posts/").get(postsCtrl.listPosts);

    // Likes route
    apiRouter.post('/posts/:postId/vote/like', likesCtrl.likePost);

    // Comment routes
    apiRouter.post('/posts/:postId/comment', commentsCtrl.commentPost);

    return apiRouter;
})();