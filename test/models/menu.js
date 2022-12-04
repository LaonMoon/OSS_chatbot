const Sequelize = require('sequelize');

module.exports = class Menu extends Sequelize.Model {
    static init(sequelize) {
        return super.init( {
                name: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    unique: true,
                },
                avg_rate: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                review_count: {
                    type: Sequelize.INTEGER(100),
                    allowNull: false,
                },
                type: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                },
                date: {
                    type: Seauelize.STRING(10),
                    allowNull: false,
                },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Menu',
            tableName: 'menus',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Menu.hasMany(db.Review, { foreignKey: 'menu_name', sourceKey: 'id'});
    }

};