import { FC, useEffect } from 'react'
import { RouteNames, router } from './router.ts'

export interface RedirectProps {
  route: RouteNames
}

export const Redirect: FC<RedirectProps> = ({ route }) => {
  useEffect(() => {
    router.replace(route)
  }, [route])

  return null
}
