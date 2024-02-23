import { FC, useEffect, useState } from 'react'
import { CRUDService, HasId } from './services/crud.ts'
import { Value, Values } from './contribute/CrudEditor.tsx'
import { BSON } from 'realm-web'
import ObjectId = BSON.ObjectId

interface CollectionValueProps {
  service: CRUDService<HasId>
  id: ObjectId
  fieldName: string
}

export const CollectionValue: FC<CollectionValueProps> = ({
  service,
  id,
  fieldName
}) => {
  const [value, setValue] = useState<Value>()

  useEffect(() => {
    service.get(id).then(doc => {
      if (doc) {
        setValue((doc as unknown as Values)[fieldName])
      }
    })
  }, [service, id, fieldName])

  return value ?? null
}
