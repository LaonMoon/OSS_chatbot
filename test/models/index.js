const Sequelize = require('sequelize');
const Menu = require('./menu');
const Review = require('./review');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.Menu = Menu;
db.Review = Review;

Menu.init(sequelize);
Review.init(sequelize);

Menu.associate(db);
Review.associate(db);

module.exports = db;
