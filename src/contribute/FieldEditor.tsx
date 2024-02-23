import { FieldDefinition, Value } from './CrudEditor.tsx'
import { FC, useEffect, useState } from 'react'
import { Input, Select } from '@chakra-ui/react'
import { toNumber } from 'lodash/fp'
import { BSON } from 'realm-web'

import { CRUDService, HasId } from '../services/crud.ts'
import ObjectId = BSON.ObjectId
import Document = BSON.Document

interface SelectRefProps {
  service: CRUDService<HasId>
  displayFieldName: string
  value: Value | undefined
  onChange: (value: ObjectId) => void
}

const SelectRef: FC<SelectRefProps> = ({
  service,
  displayFieldName,
  value,
  onChange
}) => {
  const [documents, setDocuments] = useState<(Document & HasId)[]>([])

  useEffect(() => {
    service.list().then(documents => {
      setDocuments(documents)
    })
  }, [service])

  return (
    <Select
      value={(value as string | undefined) ?? ''}
      onChange={e => onChange(ObjectId.createFromHexString(e.target.value))}
    >
      {documents.map(document => (
        <option
          key={document._id.toHexString()}
          value={document._id.toHexString()}
        >
          {document[displayFieldName]}
        </option>
      ))}
    </Select>
  )
}

interface FieldEditorProps {
  fieldDefinition: FieldDefinition
  value: Value | undefined
  onChange: (value: Value) => void
}

export const FieldEditor: FC<FieldEditorProps> = ({
  fieldDefinition,
  value,
  onChange
}) => {
  if (fieldDefinition.type === 'ref') {
    return (
      <SelectRef
        service={fieldDefinition.service}
        displayFieldName={fieldDefinition.displayFieldName}
        value={value}
        onChange={id => onChange(id)}
      />
    )
  }

  if (fieldDefinition.type === 'string') {
    return (
      <Input
        type="text"
        value={(value as string | undefined) ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  if (fieldDefinition.type === 'number') {
    return (
      <Input
        type="number"
        value={(value as number | undefined) ?? ''}
        onChange={e => onChange(toNumber(e.target.value))}
      />
    )
  }

  if (fieldDefinition.type === 'date') {
    return (
      <Input
        type="date"
        value={(value as string | undefined) ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    )
  }
}
