'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
  var json_attributes = ['id', 'name'];

  var foodgroup = {};

  foodgroup.list = function(req, res) {
    console.log("list Food Groups");

    models.FoodGroup.findAll({
      attributes: json_attributes
    }).then(function(returnthings) {
      res.json(returnthings);
    }).catch(utils.handleError(res));
  };

  foodgroup.create = function(req, res) {
    console.log("create Equivalence Groups");

    models.FoodGroup.create({
      name:             req.body.name,
    }).then(function(returnFoodGroup) {
      res.status(201).json(returnFoodGroup);
    }).catch(Sequelize.UniqueConstraintError, function(err) {
      console.error(err);
      res.status(422).json({
        message: err.errors[0].message,
      });
    }).catch(utils.handleError(res));
  };

  return foodgroup;
};
