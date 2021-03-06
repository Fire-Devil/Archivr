var User = require('./api/user/userModel');
var config = require('./config/environment');
var jwt = require('express-jwt');
var router = require('express').Router();

module.exports = function applicationRouter(app) {

  /**
   * middleware for handling username param
   * this is probably the place check if
   * this is a valid username and also get access to the user id
   */
  router.param('username', function(req, res, next, username) {
    // find the user
    User.findOne({ username: username }, function(err, user) {
      // there was an error
      if (err) return res.status(500).end();
      // the user doesn't exist
      if (!user) return res.status(404).end();
      // found the user
      if (user) {
        // the user exists, attach their ID to the request
        req.foundUser = user;
        // continue
        return next();
      } else {
        return next(new Error('Unable to find user.'));
      }

    });
  });

  /**
   * mounts JWT checker to all routes prefixed with /api
   * the idea is this should deserialize the JWT and attach
   * the user to req.user when the user is authenticated
   */
  router.use('/api', jwt({
    secret: config.jwtTokenSecret,
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
      console.log('REQUEST, ', req.headers);
      if(req.headers['x-access-token']){
        return req.headers['x-access-token'];
      }
      return null;
    }
  }));


  /**
   *  routes must be mounted to the same router to utilize
   *  .params('username') middleware.  We want to have the req.foundUser
   *  available on all these routes if the user exists.
   */
  require('./api/auth')(router);
  require('./api/user')(router);
  require('./api/screenshot')(router);

  /**
   * catch all other routes and send back to
   * index for angular to handle
   */
  router.get('/*', function(req, res, next) {
    res.render('index');
  });

  app.use(router);

};
