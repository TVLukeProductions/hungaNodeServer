'use strict';

var Sequelize = require('sequelize');
var models = require('../model/models');

var Promise = Sequelize.Promise;

var Product = models.Product;
var FoodGroup = models.FoodGroup;
var EquivalenceGroup = models.EquivalenceGroup;
var Recipe = models.Recipe;
var Ingredient = models.Ingredient;
var Scan = models.Scan;
var User = models.User;
var Meal = models.Meal;
var MealType = models.MealType;
var Favorites = models.Favorites;

namespace('db', function() {

  desc('Create tables');
  task('create', {async: true}, function() {
  console.log('Create tables');

    models.database.sync().then(complete);
  });

  desc('Insert seed data');
  task('seed', {async: true}, function() {
    console.log('Insert seed data');

    var p = [];

    p.push(Product.bulkCreate([
       {
         barcode: '4071800000862',
         indirectBarcode: '4071800000862',
         name: '1688 Steinofen Brot',
         baseAmount: 1,
         baseUnit: 'Scheibe',
         itemGood: true,
         solid: true,
         weight: 50,
         kcal: 220,
         fat: 1.5,
         satFat: -1,
         carb: 21,
         sugar: 0.9,
         protein: 7.1,
         salt: 0.6,
         phe: 355,
         isPheCalculated: true,
         isSugarAdded: true,
         unprocessed: false,
         containsAlcohol: false,
         containsCaffein: false,
         comment: '',
      }
    ]));

    p.push(FoodGroup.bulkCreate([
      {
        name: 'Grains',
      },
      {
        name: 'Proc. Vegetables',
      },
      {
        name: 'Vegetables',
      },
      {
        name: 'Fruit',
      },
      {
        name: 'Proc. Fruit',
      },
      {
        name: 'Diary',
      },
      {
        name: 'Confections - Sweet',
      },
      {
        name: 'Drink',
      },
      {
        name: 'Confections - Salty',
      },
      {
        name: 'Ingredient',
      },
      {
        name: 'Meat',
      }
    ]));

    p.push(Recipe.bulkCreate([
      {
        id: '1',
        name: 'Testrezept1',
        numberOfPersons: 1,
        fixedProportions: false,
      }
    ]));

    p.push(Ingredient.bulkCreate([
      {
        weight: 30,
        recipeId: 1,
        productId: 1,
      }
    ]));

    p.push(User.bulkCreate([
      {
        userNumber: '1234567',
        name: 'testUser',
      }
    ]));

    Promise.all(p).then(complete);
  });

  desc('Drop database');
    task('drop', {async: true}, function() {
    console.log('Drop tables');

    Promise.each([Product, FoodGroup, EquivalenceGroup, MealType, Recipe, Meal, Ingredient,
    Scan, User], function(table) {
      return table.drop();
    }).then(complete);
  });
});
