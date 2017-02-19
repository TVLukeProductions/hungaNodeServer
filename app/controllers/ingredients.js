'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
    var json_attributes = ['id', 'weight', 'productId', 'recipeId'];

    var product_attributes = ['id', 'barcode', 'indirectBarcode', 'name',
      'baseAmount', 'baseUnit', 'itemGood', 'solid', 'weight',
      'kcal','fat', 'satFat', 'carb', 'sugar', 'protein', 'salt',
      'phe', 'isPheCalculated', 'isSugarAdded', 'unprocessed',
      'containsAlcohol', 'containsCaffein', 'comment', 'foodGroupId', 'createdAt',
      'updatedAt'];

    var recipe_attributes = ['id', 'name', 'numberOfPersons', 'fixedProportions'];

    var ingredients = {};

    ingredients.list = function(req, res) {
      console.log("list Ingredients");

      models.Ingredient.findAll({
        attributes: json_attributes,
        include: [{
          model: models.Recipe,
          attributes: recipe_attributes,
        },
        {
          model: models.Product,
          attributes: product_attributes,
        }]
      }).then(function(returnthings) {
        res.json(returnthings);
      }).catch(utils.handleError(res));
    };

    ingredients.create = function(req, res) {
      console.log("create Ingredient");

      models.Product.findOne({
        where: {indirectBarcode: req.body.barcode}, attributes: product_attributes
      }).then(function(returnProduct) {
        if (!returnProduct) {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end('Product with barcode not found');
          throw null;
        }

        models.Recipe.findOne({
          where: {id: req.body.recipe},
          attributes: recipe_attributes
        }).then(function(returnRecipe) {
          if (!returnRecipe) {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('Recipe with id not found');
            throw null;
          }

          models.Ingredient.create({
            weight:             req.body.weight,
            generalizable:      req.body.generalizable,
            productId:          returnProduct.id,
            recipeId:           returnRecipe.id
          }).then(function(returnIngredient) {
            res.status(201).json(returnIngredient);
          }).catch(Sequelize.UniqueConstraintError, function(err) {
            console.error(err);
            res.status(422).json({
              message: err.errors[0].message,
            });
          }).catch(utils.handleError(res));

        });
      });
    };

    return ingredients;
  };
