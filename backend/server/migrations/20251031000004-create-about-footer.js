export const up = async (queryInterface, Sequelize) => {
    await queryInterface.createTable('about_footer', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      profile_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profile_image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      main_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      quote: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('about_footer');
};
