export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('artists', 'description', {
    type: Sequelize.TEXT,
    allowNull: true,
    after: 'specialty'
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('artists', 'description');
};
