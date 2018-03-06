module.exports = {
  up: queryInterface => (
    queryInterface.bulkInsert('users', [
      {
        email: 'test1@test.com',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'test2@test.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {})
  ),
  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
