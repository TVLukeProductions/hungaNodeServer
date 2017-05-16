'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
    var json_attributes = ['id', 'packagingsize', 'percentageUsed', 'shelfLife'];

    var product_attributes = ['id', 'barcode', 'indirectBarcode', 'name', 'weight', 'ShelfLife'];

    var user_attributes = ['id', 'userNumber', 'name']

    var storageItems = {};

    storageItems.list = function(req, res) {
      console.log("list Storage Items"+JSON.stringify(req.body));

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

        models.StorageItem.findAll({
          attributes: json_attributes,
          where: {userId: returnUser.id},
          include: [ {
            model: models.Product,
            attributes: ['barcode', 'indirectBarcode', 'name'],
          }]
        }).then(function(returnthings) {
          res.json(returnthings);
        }).catch(utils.handleError(res));
      })
    };

    storageItems.create = function(req, res) {
        console.log("create StorgeItem");
        console.log(req.body.userNumber);
        models.User.findOne({
            where: {
                userNumber: req.body.userNumber
            },
            attributes: user_attributes
        }).then(function(returnUser) {
            if (!returnUser) {
                res.writeHead(404, {
                    'content-type': 'text/plain'
                });
                res.end('User with user code not found.');
                throw null;
            }

            models.Product.findOne({
                where: {
                    indirectBarcode: req.body.barcode
                },
                attributes: product_attributes
            }).then(function(returnProduct) {
                if (!returnProduct) {
                    res.writeHead(404, {
                        'content-type': 'text/plain'
                    });
                    res.end('Product with barcode not found');
                    throw null;
                }

                models.StorageItem.create({
                    packagingsize: returnProduct.weight,
                    percentageUsed: 0,
                    userId: returnUser.id,
                    shelfLife: returnProduct.ShelfLife,
                }).then(function(returnStorageItem) {
                    res.status(201).json(returnStorageItem);
                }).catch(Sequelize.UniqueConstraintError, function(err) {
                    console.error(err);
                    res.status(422).json({
                        message: err.errors[0].message,
                    });
                }).catch(utils.handleError(res));
            })
        })
    };

    storageItems.modify = function(req, res) {
      console.log("moidy product")
      models.StorageItem.findOne({
        where: {id: req.params.id}
      }).then(function(storageItem) {
        if (!storageItem) {
          res.writeHead(404, {'content-type': 'text/plain'});
          res.end('NOT FOUND');
          throw null;
        }

        storageItem.percentageUsed  = req.body.percentageUsed
        return storageItem.save().then(function() {
          res.json(utils.filterObject(json_attributes, storageItem));
        });
      }).catch(utils.handleError(res));
    };

    return storageItems;
};
