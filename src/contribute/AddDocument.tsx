import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { FieldDefinition, Value, Values } from './CrudEditor.tsx'
import { isUndefined } from 'lodash/fp'
import { getFieldName } from './getFieldName.ts'
import { FieldEditor } from './FieldEditor.tsx'

interface AddDocumentProps {
  fields: FieldDefinition[]
  onAdd: (values: Values) => void
}

export const AddDocument: FC<AddDocumentProps> = ({ fields, onAdd }) => {
  const fieldNames = fields.map(field => field.name)
  const emptyValues = Object.fromEntries(
    fieldNames.map(name => [name, undefined])
  )

  const [values, setValues] =
    useState<Record<string, Value | undefined>>(emptyValues)

  const add = () => {
    onAdd(values as Values)
    setValues(emptyValues)
  }

  const canAdd = Object.values(values).every(value => !isUndefined(value))

  return (
    <Flex direction="row">
      {fields.map(field => (
        <Stack key={field.name} p="1em">
          <Text>{getFieldName(field.name)}</Text>
          <FieldEditor
            field={field}
            value={values[field.name]}
            onChange={(value: Value) =>
              setValues(values => ({ ...values, [field.name]: value }))
            }
          />
        </Stack>
      ))}

      <Stack p="1em ">
        <Stack>
          <Text>&nbsp;</Text>
          <Button colorScheme="blue" isDisabled={!canAdd} onClick={add}>
            Add
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}
