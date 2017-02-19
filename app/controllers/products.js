'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
  var json_attributes = ['barcode', 'indirectBarcode', 'name',
    'baseAmount', 'baseUnit', 'itemGood', 'solid', 'weight',
    'kcal','fat', 'satFat', 'carb', 'sugar', 'protein', 'salt',
    'phe', 'isPheCalculated', 'isSugarAdded', 'unprocessed',
    'containsAlcohol', 'containsCaffein', 'comment', 'createdAt',
    'updatedAt'];

    var json_attributes_with_Id = ['id', 'barcode', 'indirectBarcode', 'name',
      'baseAmount', 'baseUnit', 'itemGood', 'solid', 'weight',
      'kcal','fat', 'satFat', 'carb', 'sugar', 'protein', 'salt',
      'phe', 'isPheCalculated', 'isSugarAdded', 'unprocessed',
      'containsAlcohol', 'containsCaffein', 'comment', 'createdAt',
      'updatedAt', 'foodGroupId', 'equivalenceGroupId'];

  var foodGroup_attributes = ['id', 'name'];

  var eq_attributes = ['id', 'name'];

  var products = {};

  products.list = function(req, res) {
    console.log("list Products");

    models.Product.findAll({
      attributes: json_attributes,
      include: [ {
        model: models.FoodGroup,
        attributes: ['name']
      },
      {
        model: models.EquivalenceGroup,
        attributes: ['name']
      }]
    }).then(function(returnthings) {
      res.json(returnthings);
    }).catch(utils.handleError(res));
  };

  products.create = function(req, res) {
    console.log("create Product");

    models.FoodGroup.findOne({
      where: {name: req.body.foodGroup}, attributes: foodGroup_attributes
    }).then(function(returnFoodGroup) {
      if (!returnFoodGroup) {
        console.log("no food group...");
        res.writeHead(404, {'content-type': 'text/plain'});
        res.end('Food Group not found');
        throw null;
      }

      models.EquivalenceGroup.findOne({
        where: {name: req.body.equivalenceGroup},
        attributes: eq_attributes
      }).then(function(returnEquivalenceGroup) {
        console.log("eq group?");
        var eq = getEqId(returnEquivalenceGroup);
        console.log("eq->"+eq);
        models.Product.create({
          barcode:          req.body.barcode,
          indirectBarcode:  req.body.indirectBarcode,
          name:             req.body.name,
          baseAmount:       req.body.baseAmount,
          baseUnit:         req.body.baseUnit,
          itemGood:         req.body.itemGood,
          solid:            req.body.solid,
          weight:           req.body.weight,
          kcal:             req.body.kcal,
          fat:              req.body.fat,
          satFat:           req.body.satFat,
          carb:             req.body.carb,
          sugar:            req.body.sugar,
          protein:          req.body.protein,
          salt:             req.body.salt,
          phe:              req.body.phe,
          isPheCalculated:  req.body.isPheCalculated,
          isSugarAdded:     req.body.isSugarAdded,
          unprocessed:      req.body.unprocessed,
          containsAlcohol:  req.body.containsAlcohol,
          containsCaffein:  req.body.containsCaffein,
          comment:          req.body.comment,
          foodGroupId:      returnFoodGroup.id,
          equivalenceGroupId: eq,
        }).then(function(returnThing) {
          console.log(returnThing);
          res.status(201).json(returnThing);
        }).catch(Sequelize.UniqueConstraintError, function(err) {
          console.log("unique constraint error...");
          console.error(err);
          res.status(422).json({
            message: err.errors[0].message,
          });
        }).catch(utils.handleError(res));
      });
    });
  };

  products.show = function(req, res) {
      console.log("get Product");

      models.Product.findAll({
        where: {barcode: req.params.barcode}, attributes: json_attributes,
        include: [ {
          model: models.FoodGroup,
          attributes: ['name']
        },
        {
          model: models.EquivalenceGroup,
          attributes: ['name']
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

  products.modify = function(req, res) {
    console.log("moidy product")
    models.Product.findOne({
      where: {indirectBarcode: req.body.indirectBarcode}
    }).then(function(product) {
      if (!product) {
        res.writeHead(404, {'content-type': 'text/plain'});
        res.end('Not found');
        throw null;
      }

      //this does not work... at least not for the bolean values.
      product.barcode            = req.body.barcode || product.barcode;
      product.name               = req.body.name || product.name;
      product.baseAmount         = req.body.baseAmount || product.baseAmount;
      product.baseUnit           = req.body.baseUnit || product.baseUnit;
      if(req.body.itemGood != undefined) {
        product.itemGood           = req.body.itemGood;
      }
      product.solid              = req.body.solid || product.solid;
      product.weight             = req.body.weight || product.weight;
      product.kcal               = req.body.kcal || product.kcal;
      product.fat                = req.body.fat || product.fat;
      product.satFat             = req.body.satFat || product.satFat;
      product.carb               = req.body.carb || product.carb;
      product.sugar              = req.body.sugar || product.sugar;
      product.protein            = req.body.protein || product.protein;
      product.salt               = req.body.salt || product.salt;
      product.phe                = req.body.phe || product.phe;
      if(req.body.isPheCalculated != undefined) {
        product.isPheCalculated    = req.body.isPheCalculated;
      }
      product.isSugarAdded       = req.body.isSugarAdded || product.isSugarAdded;
      product.unprocessed        = req.body.unprocessed || product.unprocessed;
      product.containsAlcohol    = req.body.containsAlcohol || product.containsAlcohol;
      product.containsCaffein    = req.body.containsCaffein || product.containsCaffein;
      product.comment            = req.body.comment || product.comment;
      //product.foodGroupId        = req.body.foodGroup || product.foodGroupId;
      //product.equivalenceGroupId = req.body.equivalenceGroup || product.equivalenceGroupId;
      return product.save().then(function() {
        res.json(utils.filterObject(json_attributes, product));
      });
    }).catch(utils.handleError(res));
  };

  products.destroy = function(req, res) {
   console.log("destroy Products");

   models.Product.destroy({
     where: {indirectBarcode: req.params.barcode}
   }).then(function(deleted) {
     res.json({
       message: 'Product deleted.'
     });
   }).catch(utils.handleError(res));
  };

  function getEqId(eq) {
    if(eq) {
      console.log("true");
      console.log(eq.id);
      return eq.id
    }
    console.log("false");
    return null;
  }

  return products;
};
