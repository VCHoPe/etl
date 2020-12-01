const fs = require('fs')
const csv = require('fast-csv')
const { snakeCase, keys, reduce } = require('lodash')
const knexFile = require('./knexfile')

const knex = require('knex')(knexFile)

const extract = (fileName) => {
  return new Promise((resolve) => {
    let headers = []
    const rows = []

    const fileStream = fs.createReadStream(fileName, 'utf8')
    const csvParser = csv
      .parseStream(fileStream, { delimiter: ';' })
      .on('data', async (data) => {
        csvParser.pause()

        if (!headers.length) {
          headers = data
        } else {
          const object = reduce(data, (acc, curr, index) => {
            acc[snakeCase(headers[index])] = curr
            return acc
          }, {})

          await knex('medical_help_info').insert(object)

          rows.push(object)
        }

        csvParser.resume()
      })
      .on('end', () => {
        resolve(rows)
      })
  })
}

const getOrCreateEntityByName = async (entity, nameValue) => {
  const entityObject = await knex.select().from(entity).where({ name: nameValue }).first()
  if (entityObject) {
    return entityObject
  }

  const result = await knex(entity).insert({ name: nameValue }).returning('*')
  return result[0]
}


const transformAndLoad = async () => {
  const rows = await knex('medical_help_info').select()

  for (let i=0; i<rows.length; i++) {
    const row = rows[i]

    const teritorialUnit = await getOrCreateEntityByName('teritorial_units', row.administrative_teritorial_unit)
    const community = await getOrCreateEntityByName('communities', row.community_type)
    const institutionType = await getOrCreateEntityByName('institution_types', row.type_institution)
    const locality = await getOrCreateEntityByName('locality', row.locality)
    const streetType = await getOrCreateEntityByName('street_type', row.street)

    const address = await knex('address').insert({
      locality_id: locality.id,
      name_locality: row.name_locality,
      street_type_id: streetType.id,
      name_street: row.name_street,
      house_number: row.house_number
    }).returning('*')

    await knex('medical_unit').insert({
      teritorial_unit_id: teritorialUnit.id,
      community_id: community.id,
      name_administrative_teritorial_unit: row.name_administrative_teritorial_unit,
      coatuu: row.coatuu,
      name_medical_institution: row.name_medical_institution,
      name_object: row.name_object,
      institution_type_id: institutionType.id,
      address_id: address && address[0] && address[0].id
    }).returning('*')
  }
}

const etl = async () => {
  await extract('dataset.csv')
  await transformAndLoad()
  await knex.destroy()
}

etl()
  .then(() => console.log('ETL Process finished'))
  .catch((err) => console.log('ETL Process error', err))
