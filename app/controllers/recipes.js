'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
    var json_attributes = ['id', 'name', 'numberOfPersons', 'fixedProportions', 'userId'];

    var user_attributes = ['id', 'userNumber', 'name']

    var product_attributes = ['id']

    var recipes = {};

    recipes.list = function(req, res) {
      console.log("list Reciped");

      models.User.findOne({
        where: {userNumber: req.params.userNumber},
        attributes: user_attributes
      }).then(function(returnUser) {
        if (!returnUser) {
          models.User.create({
            name:             "",
            userNumber:       req.params.userNumber
          }).then(function(returnThing) {
            console.log("new user");
            console.log(JSON.stringify(returnThing));
            returnUser = returnThing;
          });
        }

        models.Recipe.findAll({
          attributes: json_attributes,
          where: {userId: returnUser.id},
          include: [ {
            model: models.Ingredient,
            attributes: ['weight', 'generalizable'],
            include: [ {
              model: models.Product,
              attributes: ['indirectBarcode', 'name'],
              include: [{
                model: models.EquivalenceGroup,
                attributes: ['name'],
                required: false,
              }]
            }]
          },
          {
            model: models.Meal,
            attributes: ['id'],
            include: [ {
              model: models.MealType,
              attributes: ['id', 'name']
            }]
          },
          {
            model: models.User,
            attributes: ['name'],
          }]
        }).then(function(returnthings) {
          res.json(returnthings);
        }).catch(utils.handleError(res));
      });
    };

    recipes.create = function(req, res) {
      console.log("create Recipe");
      var jsoninput = req.body;
      console.log(JSON.stringify(jsoninput));
      console.log(JSON.stringify(jsoninput['ingredients']))
      models.User.findOne({
        where: {userNumber: req.body.userNumber},
        attributes: user_attributes
      }).then(function(returnUser) {
        if (!returnUser) {
          models.User.create({
            name:             "",
            userNumber:       req.params.userNumber
          }).then(function(returnThing) {
            console.log("new user");
            console.log(JSON.stringify(returnThing));
            returnUser = returnThing;
          });
        }

        models.Recipe.create({
          name:             req.body.name,
          numberOfPersons:  req.body.numberOfPersons,
          fixedProportions: req.body.fixedProportions,
          userId:           returnUser.id,
        }).then(function(returnThing) {
          for(var j in jsoninput['ingredients']) {
            models.Product.findOne({
              where: {indirectBarcode: jsoninput['ingredients'][j]['barcode']}, attributes: product_attributes
            }).then(function(returnProduct) {
              models.Ingredient.create({
                weight:             jsoninput['ingredients'][j]['amount'],
                generalizable:      jsoninput['ingredients'][j]['generalizable'],
                productId:          returnProduct.id,
                recipeId:           returnThing.id
              });
            });
            console.log(JSON.stringify(jsoninput['ingredients'][j]));
          }
          models.Recipe.findOne({
            where: {id: returnThing.id}, attributes: json_attributes
          }).then(function(returnThingNew) {
            res.status(201).json(returnThingNew);
          });
        }).catch(Sequelize.UniqueConstraintError, function(err) {
          console.error(err);
          res.status(422).json({
            message: err.errors[0].message,
          });
        }).catch(utils.handleError(res));
      });
    };

    recipes.show = function(req, res) {
        console.log("get Recipe");

        models.Recipe.findOne({
          where: {id: req.params.id},
          attributes: json_attributes,
          include: [ {
            model: models.Ingredient,
            attributes: ['weight'],
            include: [ {
              model: models.Product,
              attributes: ['indirectBarcode', 'name'],
              include: [{
                model: models.EquivalenceGroup,
                attributes: ['name'],
                required: false,
              }]
            }]
          },
          {
            model: models.User,
            attributes: ['name'],
          }]
        }).then(function(returnThing) {
          if (!returnThing) {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('Not found');
            throw null;
          }

          res.json(returnThing);
        }).catch(utils.handleError(res));
    };

    recipes.destroy = function(req, res) {
     console.log("destroy Recipe");

     models.User.findOne({
       where: {userNumber: req.params.userNumber},
       attributes: user_attributes
     }).then(function(returnUser) {
       models.Recipe.findOne({
         where: {
           id: req.params.id,
           userId: returnUser.id
         }, attributes: json_attributes
       }).then(function(returnThingNew) {
           models.Recipe.destroy({
             where: {id: req.params.id}
           }).then(function(deleted) {
             res.json({
               message: 'Product deleted.'
             });
           });
       });
     }).catch(utils.handleError(res));
   };

    return recipes;
  };
