'use strict';

var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var path = require('path');

var models = require('../model/models');

var products = require('./controllers/products')(models);
var foodgroups = require('./controllers/foodgroups')(models);
var equivalenceGroups = require('./controllers/equivalenceGroups')(models);
var recipes = require('./controllers/recipes')(models);
var ingredients = require('./controllers/ingredients')(models);
var scans = require('./controllers/scans')(models);
var users = require('./controllers/users')(models)
var mealtypes = require('./controllers/mealtypes')(models)
var meals = require('./controllers/meals')(models)
var transfer = require('./controllers/transfer')(models)
var favorites = require('./controllers/favorites')(models)


var app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

cors({
  credentials: true,
  origin: true
});
app.use(cors()); // Support cross orgin requests

// Map routes to controller functions
app.get('/products', products.list);
app.get('/products/:barcode', products.show);
app.post('/products', products.create);
app.delete('/products/:barcode', products.destroy);
app.put('/products', products.modify);

app.get('/foodgroups', foodgroups.list);
app.post('/foodgroups', foodgroups.create);

app.get('/equivalencegroups', equivalenceGroups.list);
app.post('/equivalencegroups', equivalenceGroups.create);

app.get('/recipes/:userNumber', recipes.list);
app.get('/recipes/:id', recipes.show);
app.post('/recipes', recipes.create);

app.post('/users', users.create);
app.get('/users/:userId', users.show);

app.get('/scans/:userNumber', scans.list);
app.post('/scans', scans.create);

app.get('/ingredients', ingredients.list);
app.post('/ingredients', ingredients.create);

app.get('/mealtypes', mealtypes.list);
app.post('/mealtypes', mealtypes.create);
app.delete('/mealtypes/:id', mealtypes.destroy);

app.get('/meals/:userNumber', meals.list);
app.post('/meals', meals.create);

app.get('/favorites/:userNumber', favorites.list);
app.post('/favorites', favorites.create)
app.delete('/favorites/:userNumber/:barcode', favorites.destroy);

app.get('/transfer/:start/:end', transfer.doit)



// Export app object
module.exports = app;
