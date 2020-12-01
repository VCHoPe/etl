exports.up = async function (knex) {
  await knex.schema.createTable('teritorial_units', (table) => {
    table.increments()
    table.string('name')
  })

  await knex.schema.createTable('communities', (table) => {
    table.increments()
    table.string('name')
  })

  await knex.schema.createTable('institution_types', (table) => {
    table.increments()
    table.string('name')
  })

  await knex.schema.createTable('locality', (table) => {
    table.increments()
    table.string('name')
  })

  await knex.schema.createTable('street_type', (table) => {
    table.increments()
    table.string('name')
  })

  await knex.schema.createTable('address', (table) => {
    table.increments()
    table.integer('locality_id').unsigned().references('id').inTable('locality')
    table.string('name_locality')
    table.integer('street_type_id').unsigned().references('id').inTable('street_type')
    table.string('name_street')
    table.string('house_number')
  })

  await knex.schema.createTable('medical_unit', (table) => {
    table.increments()
    table.integer('teritorial_unit_id').unsigned().references('id').inTable('teritorial_units')
    table.integer('community_id').unsigned().references('id').inTable('communities')
    table.string('name_administrative_teritorial_unit')
    table.string('coatuu')
    table.string('name_medical_institution')
    table.string('name_object')
    table.integer('institution_type_id').unsigned().references('id').inTable('institution_types')
    table.integer('address_id').unsigned().references('id').inTable('address')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('medical_unit')
  await knex.schema.dropTable('address')
  await knex.schema.dropTable('street_type')
  await knex.schema.dropTable('locality')
  await knex.schema.dropTable('institution_types')
  await knex.schema.dropTable('communities')
  await knex.schema.dropTable('teritorial_units')
}
