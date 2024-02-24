import { FC, useEffect, useState } from 'react'
import { CRUDService, HasId } from './services/crud.ts'
import { Value, Values } from './contribute/CrudEditor.tsx'
import { BSON } from 'realm-web'
import ObjectId = BSON.ObjectId
import { isString } from 'lodash/fp'

interface CollectionValueProps {
  service: CRUDService<HasId>
  id: ObjectId
  fieldName: string
  format?(value: string): string
}

export const CollectionValue: FC<CollectionValueProps> = ({
  service,
  id,
  fieldName,
  format
}) => {
  const [value, setValue] = useState<Value>()

  useEffect(() => {
    service.get(id).then(doc => {
      if (doc) {
        setValue((doc as unknown as Values)[fieldName])
      }
    })
  }, [service, id, fieldName])

  if (value instanceof ObjectId) {
    return value.toHexString()
  } else {
    if (format && isString(value)) {
      return format(value)
    } else {
      return value ?? null
    }
  }
}
