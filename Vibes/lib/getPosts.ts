import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/firestoreConfig'
import { PostMedia } from '@/contexts/AppContext'

export type postType = {
    description: string
    mood: string
    tags: string[]
    authorId: string
    authorUsername: string
    media: PostMedia
}

export async function getPosts(): Promise<postType[]> {
    const ref = collection(db, 'posts');
    const snapshot = await getDocs(ref);

    return snapshot.docs.map(doc => {
        const data = doc.data();

        return {
            id: doc.id,
            authorId: data.authorId,
            authorUsername: data.authorUsername,
            description: data.description,
            tags: data.tags ?? [],
            mood: data.mood,
            media: data.media,
            createdAt: data.createdAt
        };
    });
}