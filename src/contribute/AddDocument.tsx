import { Button, Flex, Input, Stack, Text } from '@chakra-ui/react'
import { FC, useState } from 'react'
import { FieldDefinition, FieldType, Value, Values } from './CrudEditor.tsx'
import { isUndefined, toNumber } from 'lodash/fp'
import { getFieldName } from './getFieldName.ts'

interface FieldEditorProps {
  fieldType: FieldType
  value: Value | undefined
  onChange: (value: Value) => void
}

const FieldEditor: FC<FieldEditorProps> = ({ fieldType, value, onChange }) => {
  if (fieldType === 'string') {
    return (
      <Input
        type="text"
        value={(value as string | undefined) ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  if (fieldType === 'number') {
    return (
      <Input
        type="number"
        value={(value as number | undefined) ?? ''}
        onChange={e => onChange(toNumber(e.target.value))}
      />
    )
  }

  if (fieldType === 'date') {
    return (
      <Input
        type="date"
        value={(value as string | undefined) ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    )
  }
}

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
            fieldType={field.type}
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
