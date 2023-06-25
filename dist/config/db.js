"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('horizon', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
try {
    //sequelize.authenticate();
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}
exports.default = sequelize;
