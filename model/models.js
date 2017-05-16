'use strict';

var database_db = process.env.HUNGA_DB_DB;
var database_user = process.env.HUNGA_DB_USER;
var database_psw = process.env.HUNGA_DB_PSW;

var Sequelize = require('sequelize');

if(database_db) {
  var database = exports.database = new Sequelize(database_db, database_user, database_psw);
} else {
  var database = exports.database = new Sequelize('sqlite://development.sqlite');
}

var Scan = exports.Scan = database.define('scan',
  {
    id: {
     type: Sequelize.INTEGER(11),
     allowNull: false,
     primaryKey: true,
     autoIncrement: true,
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
  },
  {
     createdAt: 'createdAt',
     updatedAt: 'updatedAt',
   });

var User = exports.User = database.define('user',
  {
    id: {
     type: Sequelize.INTEGER(11),
     allowNull: false,
     primaryKey: true,
     autoIncrement: true,
    },
    userNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
     createdAt: 'createdAt',
     updatedAt: 'updatedAt',
});

var Product = exports.Product = database.define('product',
 {
   id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
   },
   barcode: {
     type: Sequelize.STRING,
     allowNull: false,
     unique: false,
   },
   indirectBarcode: {
     type: Sequelize.STRING,
     allowNull: false,
     unique: true,
   },
   name: {
     type: Sequelize.STRING,
     allowNull: false,
   },
   baseAmount: {
     type: Sequelize.INTEGER,
     allowNull: false,
     unique: false,
   },
   baseUnit: {
     type: Sequelize.STRING,
     allowNull: false,
     unique: false,
   },
   itemGood: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
   },
   solid: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
   },
   weight: {
     type: Sequelize.INTEGER,
     allowNull: false,
   },
   kcal: {
     type: Sequelize.DECIMAL,
     allowNull: false,
   },
   fat: {
     type: Sequelize.DECIMAL,
     allowNull: false,
   },
   satFat: {
     type: Sequelize.DECIMAL,
     allowNull: false,
   },
   carb: {
     type: Sequelize.DECIMAL,
     allowNull: false,
   },
   sugar: {
     type: Sequelize.DECIMAL,
     allowNull: false,
   },
   protein: {
     type: Sequelize.DECIMAL,
     allowNull: false,
   },
   salt: {
     type: Sequelize.DECIMAL,
     allowNull: false,
   },
   phe: {
     type: Sequelize.DECIMAL,
     allowNull: false,
   },
   isPheCalculated: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
   },
   isSugarAdded: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
   },
   unprocessed: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
   },
   containsAlcohol: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
   },
   containsCaffein: {
     type: Sequelize.BOOLEAN,
     allowNull: false,
   },
   comment: {
     type: Sequelize.STRING,
   },
   ShelfLife: {
     type: Sequelize.INTEGER,
     defaultValue: 7,
   }
 },
 {
   createdAt: 'createdAt',
   updatedAt: 'updatedAt',
 });

var FoodGroup = exports.FoodGroup = database.define('foodGroup',
 {
   id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
   },
   name: {
     type: Sequelize.STRING,
     allowNull: false,
     unique: true,
   },
 },
 {
   createdAt: 'createdAt',
   updatedAt: 'updatedAt',
});

var EquivalenceGroup = exports.EquivalenceGroup = database.define('equivalenceGroup',
{
  id: {
   type: Sequelize.INTEGER(11),
   allowNull: false,
   primaryKey: true,
   autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
},
{
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

var Recipe = exports.Recipe = database.define('recipe',
{
  id: {
   type: Sequelize.INTEGER(11),
   allowNull: false,
   primaryKey: true,
   autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  numberOfPersons: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  fixedProportions: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  private: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
},
{
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

var MealType = exports.MealType = database.define('mealtype',
{
  id: {
   type: Sequelize.INTEGER(11),
   allowNull: false,
   primaryKey: true,
   autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
{
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

var Meal = exports.Meal = database.define('meal',
{
  id: {
   type: Sequelize.INTEGER(11),
   allowNull: false,
   primaryKey: true,
   autoIncrement: true,
  }
},
{
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

var Ingredient = exports.Ingredient = database.define('ingredient',
{
  id: {
   type: Sequelize.INTEGER(11),
   allowNull: false,
   primaryKey: true,
   autoIncrement: true,
  },
  weight: {
    type: Sequelize.DOUBLE,
  },
  generalizable: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
},
{
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

var Favorite = exports.Favorite = database.define('favorite',
{
  id: {
   type: Sequelize.INTEGER(11),
   allowNull: false,
   primaryKey: true,
   autoIncrement: true,
  },
},
{
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

var StorageItem = exports.StorageItem = database.define('storageItem',
{
  id: {
   type: Sequelize.INTEGER(11),
   allowNull: false,
   primaryKey: true,
   autoIncrement: true,
  },
  packagingsize: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  percentageUsed: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  shelfLife: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false,
  }
},
{
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

FoodGroup.hasMany(Product);
Product.belongsTo(FoodGroup);

EquivalenceGroup.hasMany(Product);
Product.belongsTo(EquivalenceGroup);

Ingredient.belongsTo(Recipe);
Ingredient.belongsTo(Product);

Recipe.hasMany(Ingredient);
Recipe.belongsTo(User);
Recipe.hasMany(Meal);

Scan.belongsTo(Product);
Scan.belongsTo(Recipe);
Scan.belongsTo(User);

User.hasMany(Scan);
User.hasMany(Recipe);

MealType.hasMany(Meal);

Meal.belongsTo(Recipe);
Meal.belongsTo(MealType);
Meal.belongsTo(User);

Favorite.belongsTo(User);
Favorite.belongsTo(Product);

StorageItem.belongsTo(Product);
Product.hasMany(StorageItem);
StorageItem.belongsTo(User);
User.hasMany(StorageItem);
