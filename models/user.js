'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    account: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    login: {
      type: DataTypes.BOOLEAN
    },
    logintimeAt: {
      type: DataTypes.DATE
    }
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    }),
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
  }
  return User
}
