import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { CRUDService, HasId } from '../services/crud.ts'
import { Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { isDate } from 'lodash'
import { omit } from 'lodash/fp'
import { AddDocument } from './AddDocument.tsx'
import { getFieldName } from './getFieldName.ts'

export type Value = string | number
export type Values = Record<string, Value>
export type FieldType = 'date' | 'string' | 'number'

export interface FieldDefinition {
  name: string
  type: FieldType
}

interface CrudEditorProps {
  fields: FieldDefinition[]
  service: CRUDService<HasId>
}

export const CrudEditor: FC<CrudEditorProps> = ({ fields, service }) => {
  const [documents, setDocuments] = useState<(Values & HasId)[]>([])

  const fetchPlayers = useCallback(async () => {
    const documents = await service.list()
    setDocuments(documents as (Values & HasId)[])
  }, [service])

  useEffect(() => {
    fetchPlayers().catch(console.error)
  }, [fetchPlayers])

  const getValue = (value: Value): ReactNode => {
    if (isDate(value)) {
      return value.toISOString()
    } else {
      return value
    }
  }

  const getValues = (document: Values & HasId): Values => omit('_id', document)

  const addDocument = async (values: Values) => {
    await service.add(values)
    await fetchPlayers()
  }

  return (
    <Flex direction="column">
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
                const values = getValues(doc)
                return (
                  <Tr key={doc._id.toHexString()}>
                    {Object.entries(values).map(([key, value]) => (
                      <Td key={key}>{getValue(value)}</Td>
                    ))}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Flex>
      )}
    </Flex>
  )
}
