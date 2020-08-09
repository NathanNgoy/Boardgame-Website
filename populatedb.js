#! /usr/bin/env node

console.log('This script populates some test board games and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Product = require('./models/product')
var Category = require('./models/category')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = []
var categories = []

function productCreate(name, description, category, price, stock, cb) {
  productDetail = { 
    name: name, 
    description: description, 
    category: category, 
    price: price, 
    stock: stock };
  
  var product = new Product(productDetail);
       
  product.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Product: ' + product);
    products.push(product)
    cb(null, product);
  }  );
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate("Strategy", callback);
        },
        function(callback) {
          categoryCreate("Card Game", callback);
        },
        function(callback) {
          categoryCreate("Mystery", callback);
        },
        function(callback) {
          categoryCreate("Party Games", callback);
        }
        ],
        // optional callback
        cb);
}


function createProducts(cb) {
    async.parallel([
        function(callback) {
          productCreate("Pandemic", "Four diseases have broken out in the world and it is up to a team of specialists in various fields to find cures for these diseases before mankind is wiped out. Players must work together, playing to their characters' strengths and planning their strategy of eradication before the diseases overwhelm the world with ever-increasing outbreaks.", categories[0], 40, 32, callback);
        },
        function(callback) {
          productCreate("Sushi Go", "Pass The Sushi! In this fast-playing card game, the goal is to grab the best combination of sushi dishes as they whiz by. Score points for making the most maki rolls or for collecting a full set of sashimi.", categories[1], 15, 23, callback);
        },
        function(callback) {
          productCreate("Codenames", "Codenames is a 2015 card game for 4–8 players designed by Vlaada Chvátil and published by Czech Games Edition. Two teams compete by each having a spymaster give one-word clues that can point to multiple words on the board.", categories[0], 16, 4, callback);
        },
        function(callback) {
          productCreate("Betrayal at House on The Hill", "The house on the hill has a wicked reputation. Those who dare to darken its door often leave steeped in madness and despair — if they leave at all.Now the horror reaches new heights with Widow's Walk, the first-ever expansion for the critically acclaimed board game Betrayal at House on the Hill. The house is expanded with the addition of twenty new rooms, including the roof, a previously unexplored floor.", categories[2], 50, 9, callback);
        },
        function(callback) {
          productCreate("Mysterium", "A horrible crime has been committed on the grounds of Warwick Manor and it's up to the psychic investigators to get to the bottom of it. In Mysterium, one player takes on the role of the ghost and, over the course of a week, tries to lead the investigators to their culprit. Each night the team will be met with visions, but what is the ghost trying to tell you? Can the psychics determine the weapon, location, and killer - or will a violent criminal pull off the perfect murder?", categories[2], 45, 13, callback);
        },
        function(callback) {
          productCreate("Scythe", "Scythe is an engine-building game set in an alternate-history 1920s period. It is a time of farming and war, broken hearts and rusted gears, innovation and valor. In Scythe, each player represents a character from one of five factions of Eastern Europe who are attempting to earn their fortune and claim their faction's stake in the land around the mysterious Factory. Players conquer territory, enlist new recruits, reap resources, gain villagers, build structures, and activate monstrous mechs.", categories[0], 90, 7, callback);
        },
        function(callback) {
          productCreate("Secret Hitler", "Secret Hitler is a social deduction game for 5-10 people about finding and stopping the Secret Hitler. Players are secretly divided into two teams: the liberals, who have a majority, and the fascists, who are hidden to everyone but each other. If the liberals can learn to trust each other, they have enough votes to control the elections and save the day. But the fascists will say whatever it takes to get elected, advance their agenda, and win the game.", categories[3], 30, 5, callback);
        }
        ],
        // optional callback
        cb);
}

console.log("Inserting into database");
async.series([
    createCategories,
    createProducts
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
      console.log("Inserted")
    }
    // All done, disconnect from database
    mongoose.connection.close();
});