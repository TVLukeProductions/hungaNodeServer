'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
    var json_attributes = ['id', 'name'];

    var mealtypes = {};

    mealtypes.list = function(req, res) {
      console.log("list mealtypes");

      models.MealType.findAll({
        attributes: json_attributes,
      }).then(function(returnthings) {
        res.json(returnthings);
      }).catch(utils.handleError(res));
    };

    mealtypes.create = function(req, res) {
      console.log("create Meal Type");

      models.MealType.create({
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

    mealtypes.show = function(req, res) {
        console.log("get MealType");

        models.MealType.findOne({
          where: {id: req.params.id},
          attributes: json_attributes,
        }).then(function(returnThing) {
          if (!returnThing) {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('Not found');
            throw null;
          }

          res.json(returnThing);
        }).catch(utils.handleError(res));
    };

    mealtypes.destroy = function(req, res) {
     console.log("destroy Meal Type");

       models.MealType.destroy({
         where: {id: req.params.id}
       }).then(function(deleted) {
         res.json({
           message: 'Meal Type deleted.'
         });
       }).catch(utils.handleError(res));
      };

    return mealtypes;
  };
