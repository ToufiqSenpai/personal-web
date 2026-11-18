import type { Article, Feed, Media, Profile, Project } from '@/payload-types'

// Payload documents are plain JSON at runtime and dehydrate fine, but the generated
// types are not provably serializable: `Media._transforms.encoding` carries a
// `{ [k: string]: unknown }` index signature, which `ValidateSerializable` rejects.
// Register the document types as serializable extensions so loaders and server
// functions can return them without a runtime Seroval adapter or `strict: false`.
declare module '@tanstack/router-core' {
  interface SerializableExtensions {
    PayloadDocument: Article | Feed | Media | Profile | Project
  }
}
