module.exports = {
  client: 'postgresql',
  connection: {
    database: 'etl',
    user:     'postgres',
    password: '040800'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}
