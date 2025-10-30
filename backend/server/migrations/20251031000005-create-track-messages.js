export const up = async (queryInterface, Sequelize) => {
    await queryInterface.createTable('track_messages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      track_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tracks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
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

    // Add index on track_id for faster lookups
  await queryInterface.addIndex('track_messages', ['track_id']);
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('track_messages');
};
