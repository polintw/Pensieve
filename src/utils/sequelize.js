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
    timestamps: true
  }
});
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
    id: {type: Sequelize.INTEGER, primaryKey: true},
    created: Sequelize.DATE,
    status: Sequelize.TEXT('tiny'),
    first_name: Sequelize.STRING(127),
    last_name: Sequelize.STRING(127),
    account: Sequelize.STRING(255)
})

const _DB_users_apply = sequelize.define('users_apply', {
  id_user: Sequelize.INTEGER,
  status: Sequelize.TEXT('tiny'),
  created: Sequelize.DATE,
  token_email: Sequelize.STRING(1023)
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


sequelize.sync({force: false}).then(()=> { //force true would drop the existed table
  console.log('Sync to databse has completed from Sequelize.');
}).catch(error=>{
  console.error('Somthing wrong when sync to database from Sequelize.');
})

module.exports = {
    _DB_users: _DB_users,
    _DB_users_apply: _DB_users_apply,
    _DB_verifications: _DB_verifications,
    _DB_units: _DB_units,
    _DB_marks: _DB_marks,
    _DB_nouns: _DB_nouns,
    _DB_attribution: _DB_attribution
}
