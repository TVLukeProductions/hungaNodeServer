'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');
var request = require("request");

var productsUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=3p7TknjQeaN_jbjGjGUdVw4bUOWsO4cNcdAi37YZM0w6i1FmGAAkgSMml3nvZUFeXi7Jj4wAMdgBGNui15TY5xZrcDho1Tkom5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnA6jcA7Nq2DOwLHeq86ZVdDR21B7RLCtUsG9tPSc2C4bZEvXH9QWcVL9vo9Jm_rowdfBe1rpHpxl&lib=MBy3a7lvnNWtvPlX4tNuP4FfO1xjPWmpv';

module.exports = function(models) {
    var json_attributes = ['name'];

    var transfer = {};

    transfer.doit= function(req, res) {
        console.log("Do Transfer");
        webrequest(productsUrl, function(products) {
          console.log(products.length);
          var start = parseInt(req.params.start);
          var end = parseInt(req.params.end);
          //Food groups
          createFoodGroups(products, start, end);
          createEqGroups(products, start, end);
          createProducts(products, start, end);
          res.status(200);
          res.json({
            message: 'Done'
          })
          return;
        });
      };

      function createProducts(products, start, end){
        for(var i in products) {
          if(i < start || i > end) {
            console.log('out...');

          } else {
          console.log(i);
          var product = products[i];
            var p = {};
            p['barcode']=product['Barcode'];
            p['indirectBarcode']=product['Inderect Barcode'];
            p['name']=product['Name'];
            p['baseAmount']=product['Basismenge'];
            p['baseUnit']=product['Basiseinheit'];
            p['itemGood']=product['Stueckgut'];
            p['solid']=product['fest'];
            p['weight']=product['gewicht'];
            p['foodGroup']=product['Basic Food Group'];
            p['equivalenceGroup']=product['Equivalencegroup'];
            p['kcal']=product['kcal100'];
            p['fat']=product['Fat100g'];
            p['satFat']=product['gesatFett100'];
            p['carb']=product['Kohlenhydrate100g'];
            p['sugar']=product['ZuckerInKohlenhydrate100g'];
            p['protein']=product['Eiweis100'];
            p['salt']=product['Salz100g'];
            p['phe']=product['phe100'];
            p['isPheCalculated']=product['istPheValueCalculated'];
            p['isSugarAdded']=product['AdditionalSuggar'];
            p['unprocessed']=product['unprocessed food'];
            p['containsAlcohol']=product['containsAlcohol'];
            p['containsCaffein']=product['containsCaffine'];
            webpost('http://localhost:64645/products', p, function(body) {

            });
          }
        }
      }

      function createEqGroups(products, start, end) {
        for(var i in products) {
          if(i < start || i > end) {

          } else {
            var product = products[i];
            if(product['Name'] != product['Equivalencegroup']) {
              var eqgroup = {};
              eqgroup['name']=product['Equivalencegroup'];
              webpost('http://localhost:64645/equivalencegroups', eqgroup, function(body) {

              });
            }
          }
        }
      }

      function createFoodGroups(products, start, end) {
        for(var i in products) {
          if(i < start || i > end) {

          } else {
            var product = products[i];
            var foodgroup = {};
            foodgroup['name']=product['Basic Food Group'];
            webpost('http://localhost:64645/foodgroups', foodgroup, function(body) {

            });
          }
        }
      }

      function webrequest(requestUrl, callback) {
        console.log("web request");
        request({
          url: requestUrl,
          json: true
        }, function(error, response, body) {
          console.log(error);
          if (response && !error && (response.statusCode === 200 || response.statusCode === 201)) {
            console.log(response.statusCode);
            callback(body);
            return;
          }
        });
      }

      function webpost(requestUrl, payload, callback) {
        console.log("web request");
        console.log(payload);
        request({
          method: "POST",
          url: requestUrl,
          json: payload
        }, function(error, response, body) {
          callback(body);
        });
      }

      return transfer;
  };
