const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../connect');
const Model = Sequelize.Model;
class User extends Model { }
User.init({
  // attributes
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT('tiny'),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  inviter: {
    type: DataTypes.STRING,
    allowNull: true
  },
  //0 delete, 1 normal, 2 pending, 3 reject, 4 initial
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'school_name'
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'subject_name'
  }
}, {
  sequelize,
  freezeTableName: true,
  tableName: 'tb_user',
});

class Question extends Model { }
Question.init({

  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  picture: {
    type: DataTypes.TEXT('tiny'),
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  //0 delete, 1 normal, 2 pending, 3 reject, 4 initial
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.ARRAY,
    allowNull: true,
  },
  options: {
    type: DataTypes.ARRAY,
    allowNull: true,
  }
}, {
  sequelize,
  freezeTableName: true,
  tableName: 'tb_question',
});

module.exports = {
  'User': User,
  'Question': Question
}
