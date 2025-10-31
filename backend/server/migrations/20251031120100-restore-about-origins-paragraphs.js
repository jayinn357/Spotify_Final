export async function up(queryInterface, Sequelize) {
  // Table already has 'content' column - nothing to change
  // This migration is a no-op since the structure is already correct
}

export async function down(queryInterface, Sequelize) {
  // Nothing to revert
}
