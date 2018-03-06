module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    'role', // model name
    {
      tag: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      freezeTableName: true, // avoid plural model names
      tableName: 'roles',
    },
  );

  role.associate = ({ User, Role }) => {
    Role.hasMany(User);
  };

  return role;
};
