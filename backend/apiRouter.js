const express = require("express");
const usersCtrl = require("./routes/usersCtrl");
const postsCtrl = require("./routes/postsCtrl");
const multer = require('./middleware/multer-config');



// Router

exports.router = (function() {
    const apiRouter = express.Router();

    // Users routes
    apiRouter.route("/users/register/").post(usersCtrl.register);
    // apiRouter.route("/users/login/").post(usersCtrl.login);
    apiRouter.post('/users/login/', usersCtrl.login);
    apiRouter.route("/users/me/").get(usersCtrl.getUserProfile);
    
    // apiRouter.route("/users/me/").put(usersCtrl.updateUserProfile);
    apiRouter.put('/users/me/', multer, usersCtrl.updateUserProfile);

    // Posts routes
    apiRouter.route("/posts/new/").post(postsCtrl.createPost);
    apiRouter.route("/posts/").get(postsCtrl.listPosts);

    return apiRouter;
})();