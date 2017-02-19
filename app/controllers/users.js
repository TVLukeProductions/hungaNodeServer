'use strict';

var utils = require('./utils');

var trim = require('trim');
var Sequelize = require('sequelize');

module.exports = function(models) {
    var json_attributes = ['name'];

    var users = {};

    users.show = function(req, res) {
        console.log("get User");

        models.User.findOne({
          where: {userNumber: req.params.userId}, attributes: json_attributes
        }).then(function(returnUser) {
          if (!returnUser) {
            models.User.create({
              name:             "",
              userNumber:       req.params.userId
            }).then(function(returnThing) {
              console.log("new user");
              console.log(JSON.stringify(returnThing));
              returnUser = returnThing;
            });
          }

          res.json(returnUser);
        }).catch(utils.handleError(res));
    };

    users.create = function(req, res) {
      console.log("create User");

      var uNumber = req.body.userNumber;
      var uName = req.body.name;

      if(!uNumber) {
        uNumber = randomString();
      }

      models.User.create({
        name:             req.body.name,
        userNumber:       uNumber
      }).then(function(returnThing) {
        res.status(201).json(returnThing);
      }).catch(Sequelize.UniqueConstraintError, function(err) {
        console.error(err);
        res.status(422).json({
          message: err.errors[0].message,
        });
      }).catch(utils.handleError(res));
    };

    function randomString()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 30; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    return users;
  };
