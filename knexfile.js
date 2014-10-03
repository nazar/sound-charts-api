// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'sound',
      user:     'postgres',
      password: 'password'
    },
    migrations: {
      tableName: 'migrations'
    }
  }


};