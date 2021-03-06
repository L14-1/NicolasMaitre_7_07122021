const jwt = require('jsonwebtoken');
require('dotenv').config();

//Exported functions
module.exports ={
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        process.env.TOKEN,
        {
            expiresIn: '1h'
        })
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: function(authorization) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null) {
          try {
            var jwtToken = jwt.verify(token, process.env.TOKEN);
            if(jwtToken != null) 
              userId = jwtToken.userId;
          } catch(err) { }
        }
        return userId;
      }
}