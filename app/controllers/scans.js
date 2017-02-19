'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
    var json_attributes = ['id', 'amount', 'createdAt'];

    var product_attributes = ['id', 'barcode', 'indirectBarcode'];

    var recipe_attributes = ['id'];

    var user_attributes = ['id', 'userNumber', 'name']

    var scans = {};

    scans.list = function(req, res) {
      console.log("list Scans"+JSON.stringify(req.body));

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

        models.Scan.findAll({
          attributes: json_attributes,
          where: {userId: returnUser.id},
          include: [ {
            model: models.Product,
            attributes: ['barcode', 'indirectBarcode', 'name'],
          },
          {
            model: models.Recipe,
            attributes: ['id', 'name']
          }]
        }).then(function(returnthings) {
          res.json(returnthings);
        }).catch(utils.handleError(res));
      })
    };

    scans.create = function(req, res) {
      console.log("create Scan");
      console.log(req.body.userNumber);
      models.User.findOne({
        where: {userNumber: req.body.userNumber}, attributes: user_attributes
      }).then(function(returnUser) {
        if (!returnUser) {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end('User with user code not found.');
          throw null;
        }

        models.Product.findOne({
          where: {indirectBarcode: req.body.barcode}, attributes: product_attributes
        }).then(function(returnProduct) {
          if (!returnProduct) {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('Product with barcode not found');
            throw null;
          }

          models.Recipe.findOne({
            where: {id: req.body.recipe}, attributes: recipe_attributes
          }).then(function(returnRecipe) {

            var recipe = getRecipeId(returnRecipe);

            models.Scan.create({
              amount:     req.body.amount,
              productId:  returnProduct.id,
              userId:     returnUser.id,
              recipeId:   recipe,
            }).then(function(returnScan) {
              res.status(201).json(returnScan);
            }).catch(Sequelize.UniqueConstraintError, function(err) {
              console.error(err);
              res.status(422).json({
                message: err.errors[0].message,
              });
            }).catch(utils.handleError(res));
          })
        })
      })
    };

    function getRecipeId(recipe) {
        if(recipe) {
          recipe.id;
        }
        return null;
    }

    return scans;
  };
