'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
  trainers = require('../../app/controllers/trainers.server.controller');

module.exports = function(app) {
  // Article Routes
  app.route('/trainers')
    .get(trainers.list)
    .post(users.requiresLogin, trainers.create);

  app.route('/trainers/:trainerId')
    .get(trainers.read)
    .put(users.requiresLogin, trainers.hasAuthorization, trainers.update)
    .delete(users.requiresLogin, trainers.hasAuthorization, trainers.delete);

  // Finish by binding the article middleware
  app.param('trainerId', trainers.trainerByID);
};
