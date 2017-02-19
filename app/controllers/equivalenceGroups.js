'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
  var json_attributes = ['id', 'name'];

  var equivalenceGroup = {};

  equivalenceGroup.list = function(req, res) {
    console.log("list Equivalence Groups");

    models.EquivalenceGroup.findAll({
      attributes: json_attributes
    }).then(function(returnthings) {
      res.json(returnthings);
    }).catch(utils.handleError(res));
  };

  equivalenceGroup.create = function(req, res) {
    console.log("create Equivalence Groups");

    models.EquivalenceGroup.create({
      name:             req.body.name,
    }).then(function(returnThing) {
      res.status(201).json(returnThing);
    }).catch(Sequelize.UniqueConstraintError, function(err) {
      console.error(err);
      res.status(422).json({
        message: err.errors[0].message,
      });
    }).catch(utils.handleError(res));
  };

  equivalenceGroup.destroy = function(req, res) {
   console.log("destroy Equivalence Groups");

   models.EquivalenceGroup.destroy({
     where: {name: req.params.name}
   }).then(function(deleted) {
     res.json({
       message: 'Equivalence Group deleted.'
     });
   }).catch(utils.handleError(res));
  };


  return equivalenceGroup;
};
