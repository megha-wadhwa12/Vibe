import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/firestoreConfig'
import { PostMedia } from '@/contexts/AppContext'

export type CreatePostInput = {
  description: string
  mood: string
  tags: string[]
  authorId: string
  authorUsername: string
  media: PostMedia
}

export async function createPost(data: CreatePostInput) {
  const docRef = await addDoc(collection(db, 'posts'), {
    description: data.description,
    mood: data.mood,
    tags: data.tags,
    authorId: data.authorId,
    authorUsername: data.authorUsername,
    createdAt: serverTimestamp(),
    media: data.media
  })

  return docRef.id
}

export function extractTags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || []
  return matches.map(tag => tag.slice(1).toLowerCase())
}
