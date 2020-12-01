exports.up = function (knex) {
  return knex.schema.createTable('medical_help_info', (table) => {
    table.increments()
    table.string('administrative_teritorial_unit')
    table.string('community_type')
    table.string('name_administrative_teritorial_unit')
    table.string('coatuu')
    table.string('name_medical_institution')
    table.string('name_object')
    table.string('type_institution')
    table.string('locality')
    table.string('name_locality')
    table.string('street')
    table.string('name_street')
    table.string('house_number')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('medical_help_info')
}
