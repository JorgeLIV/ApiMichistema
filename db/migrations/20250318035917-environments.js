'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('environments', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
      },
      color: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true,
      },
      user_id: { // Relaciona el entorno con un usuario
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false, // Un entorno siempre debe pertenecer a un usuario
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE', // Si se elimina el usuario, se eliminan sus entornos
        onUpdate: 'CASCADE',
      },
      active: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('environments');
  },
};