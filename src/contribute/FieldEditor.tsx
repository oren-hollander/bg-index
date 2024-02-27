import { FieldDefinition, RefFieldDefinition, Value } from './CrudEditor.tsx'
import { FC, useEffect, useState } from 'react'
import { Input, Select } from '@chakra-ui/react'
import { toNumber } from 'lodash/fp'
import { BSON } from 'realm-web'

import { HasId } from '../services/crud.ts'
import ObjectId = BSON.ObjectId
import Document = BSON.Document

interface SelectRefProps {
  field: RefFieldDefinition
  value: Value | undefined
  onChange: (value: ObjectId) => void
}

const SelectRef: FC<SelectRefProps> = ({ field, value, onChange }) => {
  const [documents, setDocuments] = useState<(Document & HasId)[]>([])

  useEffect(() => {
    field.service.query().then(setDocuments)
  }, [field.service])

  return (
    <Select
      placeholder={`Select ${field.title}`}
      value={(value as string | undefined) ?? ''}
      onChange={e => onChange(ObjectId.createFromHexString(e.target.value))}
    >
      {documents.map(document => (
        <option
          key={document._id.toHexString()}
          value={document._id.toHexString()}
        >
          {document[field.displayFieldName]}
        </option>
      ))}
    </Select>
  )
}

interface FieldEditorProps {
  field: FieldDefinition
  value: Value | undefined
  onChange: (value: Value) => void
}

export const FieldEditor: FC<FieldEditorProps> = ({
  field,
  value,
  onChange
}) => {
  if (field.type === 'ref') {
    return (
      <SelectRef field={field} value={value} onChange={id => onChange(id)} />
    )
  }

  if (field.type === 'string') {
    return (
      <Input
        type="text"
        value={(value as string | undefined) ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  if (field.type === 'number') {
    return (
      <Input
        type="number"
        value={(value as number | undefined) ?? ''}
        onChange={e => onChange(toNumber(e.target.value))}
      />
    )
  }

  if (field.type === 'date') {
    return (
      <Input
        type="date"
        value={(value as string | undefined) ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    )
  }
}
