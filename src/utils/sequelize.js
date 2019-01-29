const Sequelize = require('sequelize');
const {connection_key} = require('../../config/database.js');

const sequelize = new Sequelize(connection_key.database, connection_key.user, connection_key.password, {
  host: connection_key.host,
  port: connection_key.port,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8',
    timestamps: true,
    freezeTableName: true
  }
})

//test, could be removed in the future if stable
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection from Sequelize has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const _DB_users = sequelize.define('users', {
  id: {type: Sequelize.INTEGER(10).UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true},
  created: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
  status: Sequelize.TEXT('tiny'),
  email: {type: Sequelize.STRING(127), allowNull: false},
  first_name: {type: Sequelize.STRING(63), allowNull: false},
  last_name: {type: Sequelize.STRING(63), allowNull: false},
  account: {type: Sequelize.STRING(127), allowNull: false}
})

const _DB_users_apply = sequelize.define('users_apply', {
  id_user: {type: Sequelize.INTEGER(10).UNSIGNED, allowNull: false},
  status: Sequelize.TEXT('tiny'),
  created: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},
  token_email: {type: Sequelize.STRING(1023), allowNull: false}
})

const _DB_verifications = sequelize.define('verifications', {
  id_user: Sequelize.INTEGER,
  updatedAt: Sequelize.DATE,
  email: Sequelize.STRING(127),
  password: Sequelize.STRING(63)
})

const _DB_units = sequelize.define('units', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    id_author:  Sequelize.INTEGER,
    url_pic_layer0: Sequelize.STRING(255),
    url_pic_layer1: Sequelize.STRING(255),
    established: Sequelize.DATE,
    id_primer:  Sequelize.INTEGER,
})
const _DB_marks = sequelize.define('marks', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    id_unit: Sequelize.INTEGER,
    id_author:  Sequelize.INTEGER,
    layer:  Sequelize.INTEGER,
    portion_top: Sequelize.FLOAT(12,9),
    portion_left: Sequelize.FLOAT(12,9),
    serial:  Sequelize.INTEGER,
    editor_content: Sequelize.STRING(1023),
    created: Sequelize.DATE
},{
  createdAt: false,
  updatedAt: false,
  paranoid: true
})
const _DB_nouns = sequelize.define('nouns', {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    name: Sequelize.STRING(255),
    established: Sequelize.DATE
})
const _DB_attribution = sequelize.define('attribution', {
  id_noun: Sequelize.INTEGER,
  id_unit: Sequelize.INTEGER,
  id_author: Sequelize.INTEGER,
  established: Sequelize.DATE
})

const _DB_sheets = sequelize.define('sheets', {
  id_user: {type: Sequelize.INTEGER, unique: true},
  gender: Sequelize.INTEGER,
  birthYear: Sequelize.STRING(7),
  birthMonth: Sequelize.STRING(7),
  birthDate: Sequelize.STRING(7),
  residence: Sequelize.STRING(127)
})

sequelize.sync({
  force: false //force true would drop the existed table
}).then(()=>{
  //Sequelize will add 'id' automatically(and as a primaryKey),
  //so we need to remove it if we don't like
  _DB_users_apply.removeAttribute('id');
  _DB_verifications.removeAttribute('id');
  _DB_attribution.removeAttribute('id');
  _DB_sheets.removeAttribute('id');
  console.log('Sequelize: complete sync to database');
}).catch(error=>{
  console.error('Error in Sequelize: when initation: '+ error);
})

module.exports = {
    _DB_users: _DB_users,
    _DB_users_apply: _DB_users_apply,
    _DB_verifications: _DB_verifications,
    _DB_units: _DB_units,
    _DB_marks: _DB_marks,
    _DB_nouns: _DB_nouns,
    _DB_sheets: _DB_sheets,
    _DB_attribution: _DB_attribution
}
