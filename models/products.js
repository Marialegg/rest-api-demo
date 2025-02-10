const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Products = sequelize.define('Products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // tipo: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     unique: true,
   // },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    tableName: 'products20270311',
    timestamps: false,
});

module.exports = Products;
