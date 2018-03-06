module.exports = {
  up: queryInterface => (
    queryInterface.bulkInsert('roles', [
      {
        tag: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        tag: 'manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {})
  ),
  down: queryInterface => queryInterface.bulkDelete('roles', null, {}),
};
