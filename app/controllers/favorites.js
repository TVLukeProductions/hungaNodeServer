'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
  var json_attributes = ['id'];

  var product_attributes = ['id'];

  var user_attributes = ['id']

  var favorites = {};

  favorites.list = function(req, res) {
     console.log("list favorites");

     console.log(req.params.userNumber);
     models.User.findOne({
       where: {userNumber: req.params.userNumber},
       attributes: user_attributes
     }).then(function(returnUser) {
       console.log(returnUser.id);
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
         console.log(returnUser.id);
         models.Favorite.findAll({
           attributes: json_attributes,
           where: {userId: returnUser.id},
           include: [{
             model: models.User,
             attributes: user_attributes,
           },
           {
             model: models.Product,
             attributes: product_attributes
           }]
         }).then(function(returnthings) {
           res.json(returnthings);
         }).catch(utils.handleError(res));
       });
     };

     favorites.create = function(req, res) {
       console.log("create favorite");

       console.log(req.body.userNumber);
       console.log(req.body.barcode);
       models.User.findOne({
         where: {userNumber: req.body.userNumber},
         attributes: user_attributes
       }).then(function(returnUser) {
         console.log(returnUser.id);
         console.log(returnUser.userNumber);
         if (!returnUser) {
           res.writeHead(404, {'content-type': 'text/plain'});
           res.end('User with user code not found.');
           throw null;
         }

         console.log(returnUser.id);
         models.Product.findOne({
           where: {indirectBarcode: req.body.barcode},
           attributes: product_attributes
         }).then(function(returnProduct) {
           if (!returnProduct) {
             res.writeHead(404, {'content-type': 'text/plain'});
             res.end('Product with barcode code not found.');
             throw null;
           }

           console.log(returnUser.id);
           console.log(returnProduct.id);
           models.Favorite.create({
             userId:             returnUser.id,
             productId:          returnProduct.id
           }).then(function(returnThing) {
             res.status(201).json(returnThing);
           }).catch(Sequelize.UniqueConstraintError, function(err) {
             console.error(err);
             res.status(422).json({
               message: err.errors[0].message,
             });
           }).catch(utils.handleError(res));

         });

       });
     };

     favorites.destroy = function(req, res) {
       console.log("destroy favorites");

       console.log(req.params.userNumber);
       console.log(req.params.barcode);
       models.User.findOne({
         where: {userNumber: req.params.userNumber},
         attributes: user_attributes
       }).then(function(returnUser) {
         if (!returnUser) {
           res.writeHead(404, {'content-type': 'text/plain'});
           res.end('Product with barcode code not found.');
           throw null;
         }

         models.Product.findOne({
           where: {indirectBarcode: req.params.barcode},
           attributes: product_attributes
         }).then(function(returnProduct) {
           if (!returnProduct) {
             res.writeHead(404, {'content-type': 'text/plain'});
             res.end('Product with barcode code not found.');
             throw null;
           }

           models.Favorite.destroy({
             where: {
               productId: returnProduct.id,
               userId: returnUser.id
             }
           }).then(function(deleted) {
             res.json({
               message: 'Favorite deleted.'
             });
           }).catch(utils.handleError(res));

         });
       });
     };

  return favorites;
}
