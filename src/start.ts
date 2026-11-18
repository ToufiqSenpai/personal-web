import { createStart } from '@tanstack/react-start'
import { payloadDocAdapter } from '@/lib/serialization'

export const startInstance = createStart(() => ({
  serializationAdapters: [payloadDocAdapter],
}))
