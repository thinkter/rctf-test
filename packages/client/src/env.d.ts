import type { FunctionComponent, SVGProps } from 'react'

declare global {
  namespace NodeJS {
    interface Process {
      env: {
        NODE_ENV: string
      }
    }
  }
}

declare module '*.svg' {
  const Component: FunctionComponent<SVGProps<SVGSVGElement>>
  export default Component
}
