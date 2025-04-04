'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_device', 'environment_id', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true, // Puede no estar asignado a un entorno
      references: {
        model: 'environments',
        key: 'id',
      },
      onDelete: 'SET NULL', // Si se elimina el entorno, el dispositivo sigue existiendo
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('user_device', 'environment_id');
  },
};