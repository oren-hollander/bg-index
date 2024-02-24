import { FC, useEffect, useState } from 'react'
import { BSON } from 'realm-web'
import ObjectId = BSON.ObjectId
import { Services } from '../services/services.ts'

const useEventTitle = (
  services: Services,
  streamId: ObjectId,
  fieldName: string
): string | undefined => {
  const [eventTitle, setEventTitle] = useState<string>()

  useEffect(() => {
    const fetchEventTitle = async () => {
      const stream = await services.streamService.get(streamId)
      if (stream) {
        const event = await services.eventService.get(stream.eventId)
        if (event) {
          setEventTitle(event.title)
        }
      }
    }

    fetchEventTitle().catch(console.error)
  }, [services.eventService, services.streamService, streamId, fieldName])

  return eventTitle
}

interface EventTitleProps {
  services: Services
  streamId: ObjectId
  fieldName: string
}

export const EventTitle: FC<EventTitleProps> = ({
  services,
  streamId,
  fieldName
}) => {
  return useEventTitle(services, streamId, fieldName)
}
