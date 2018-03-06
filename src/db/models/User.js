module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user', // model name
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'set null',
      },
    },
    {
      freezeTableName: true, // avoid plural model names
      tableName: 'users',
    },
  );

  user.associate = ({ User, Role }) => {
    User.belongsTo(Role);
  };

  return user;
};
