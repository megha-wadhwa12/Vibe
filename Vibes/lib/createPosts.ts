import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/firestoreConfig'

type CreatePostInput = {
  description: string
  mood: string
  tags: string[]
  authorId: string
  authorUsername: string
}

export async function createPost(data: CreatePostInput) {
  const docRef = await addDoc(collection(db, 'posts'), {
    description: data.description,
    mood: data.mood,
    tags: data.tags,
    authorId: data.authorId,
    authorUsername: data.authorUsername,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export function extractTags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || []
  return matches.map(tag => tag.slice(1).toLowerCase())
}
