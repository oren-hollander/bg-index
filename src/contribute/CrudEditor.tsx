import { FC, useCallback, useEffect, useState } from 'react'
import { CRUDService, HasId } from '../services/crud.ts'
import { Box, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { omit } from 'lodash/fp'
import { AddDocument } from './AddDocument.tsx'
import { getFieldName } from './getFieldName.ts'
import { BSON } from 'realm-web'
import { CollectionValue } from '../CollectionValue.tsx'
import ObjectId = BSON.ObjectId
import { gray, white } from '../colors.ts'

export type Value = string | number | ObjectId
export type Values = Record<string, Value>

export interface RefFieldDefinition {
  type: 'ref'
  name: string
  title: string
  service: CRUDService<HasId>
  displayFieldName: string
}

export type ValueFieldType = 'date' | 'string' | 'number'

export interface ValueFieldDefinition {
  type: ValueFieldType
  name: string
}

export type FieldDefinition = RefFieldDefinition | ValueFieldDefinition

interface FieldValueProps {
  field: FieldDefinition
  value: Value
}

const FieldValue: FC<FieldValueProps> = ({ field, value }) => {
  if (value instanceof ObjectId) {
    const refField = field as RefFieldDefinition

    return (
      <CollectionValue
        service={refField.service}
        id={value}
        fieldName={refField.displayFieldName}
      />
    )
  } else {
    return value
  }
}

interface CrudEditorProps {
  fields: FieldDefinition[]
  service: CRUDService<HasId>
}

export const CrudEditor: FC<CrudEditorProps> = ({ fields, service }) => {
  const [documents, setDocuments] = useState<(Values & HasId)[]>([])

  const fetchDocuments = useCallback(async () => {
    const documents = await service.query()
    setDocuments(documents as (Values & HasId)[])
  }, [service])

  useEffect(() => {
    fetchDocuments().catch(console.error)
  }, [fetchDocuments])

  const getValues = (document: Values & HasId): Values => omit('_id', document)

  const addDocument = async (values: Values) => {
    await service.add(values)
    await fetchDocuments()
  }

  return (
    <Flex direction="column" bg={gray} color={white} h="100vh">
      <Box w="full">
        <AddDocument fields={fields} onAdd={addDocument} />
        {documents.length > 0 && (
          <Flex flex="1">
            <Table>
              <Thead>
                <Tr>
                  {Object.keys(getValues(documents[0])).map(key => (
                    <Th key={key}>{getFieldName(key)}</Th>
                  ))}
                </Tr>
              </Thead>

              <Tbody>
                {documents.map(doc => {
                  return (
                    <Tr key={doc._id.toHexString()}>
                      {fields.map(field => (
                        <Td key={field.name}>
                          <FieldValue value={doc[field.name]} field={field} />
                        </Td>
                      ))}
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}
