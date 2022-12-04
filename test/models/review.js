const Sequelize = require('sequelize');

module.exports = class Review extends Sequelize.Model {
    static init(sequelize) {
        return super.init( {
                menu_type: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                },
                review: {
                    type: Sequelize.STRING(150),
                    allowNull: false,
                },
                rate: {
                    type: Sequelize.INTEGER(1),
                    allowNull: false,
                },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Review',
            tableName: 'reviews',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Review.belongsTo(db.Menu, { foreignKey: 'menu_name', targetKey: 'id'});
    }
};