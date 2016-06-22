'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Trainer = mongoose.model('Trainer'),
  _ = require('lodash');

/**
 * Create a trainer
 */
exports.create = function(req, res) {
  var trainer = new Trainer(req.body);
  trainer.user = req.user;

  trainer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trainer);
    }
  });
};

/**
 * Show the current trainer
 */
exports.read = function(req, res) {
  res.json(req.trainer);
};

/**
 * Update a trainer
 */
exports.update = function(req, res) {
  var trainer = req.trainer;

  trainer = _.extend(trainer, req.body);

  trainer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trainer);
    }
  });
};

/**
 * Delete an trainer
 */
exports.delete = function(req, res) {
  var trainer = req.trainer;

  trainer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trainer);
    }
  });
};

/**
 * List of trainers
 */
exports.list = function(req, res) {
  Trainer.find().sort('-created').populate('user', 'displayName').exec(function(err, trainers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trainers);
    }
  });
};

/**
 * Trainer middleware
 */
exports.trainerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trainer is invalid'
    });
  }

  Trainer.findById(id).populate('user', 'displayName').exec(function(err, trainer) {
    if (err) return next(err);
    if (!trainer) {
      return res.status(404).send({
        message: 'Trainer not found'
      });
    }
    req.trainer = trainer;
    next();
  });
};

/**
 * Trainer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.trainer.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
