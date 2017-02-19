'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
 var json_attributes = ['id'];
 var user_attributes = ['id', 'userNumber', 'name'];
 var recipe_attributes = ['id', 'name', 'numberOfPersons', 'fixedProportions'];
 var mealtype_attributes = ['id', 'name'];

 var meals = {};

 meals.list = function(req, res) {
    console.log("list meals");

    models.User.findOne({
      where: {userNumber: req.params.userNumber},
      attributes: user_attributes
    }).then(function(returnUser) {
      if (!returnUser) {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end('User with user code not found.');
          throw null;
        }

        models.Meal.findAll({
          attributes: json_attributes,
          where: {userId: returnUser.id},
          include: [{
            model: models.Recipe,
            attributes: recipe_attributes,
          },
          {
            model: models.MealType,
            attributes: mealtype_attributes,
          }]
        }).then(function(returnthings) {
          res.json(returnthings);
        }).catch(utils.handleError(res));
      });
    };

    meals.create = function(req, res) {
      console.log("create Recipe");

      models.User.findOne({
        where: {userNumber: req.body.userNumber},
        attributes: user_attributes
      }).then(function(returnUser) {
        if (!returnUser) {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end('User with user code not found.');
          throw null;
        }

        models.Meal.create({
          name:             req.body.name,
          recipeId:         req.body.recipeId,
          mealtypeId:       req.body.mealtypeId,
          userId:           returnUser.id,
        }).then(function(returnThing) {
          res.status(201).json(returnThing);
        }).catch(Sequelize.UniqueConstraintError, function(err) {
          console.error(err);
          res.status(422).json({
            message: err.errors[0].message,
          });
        }).catch(utils.handleError(res));
      });
    };

    return meals;
}
