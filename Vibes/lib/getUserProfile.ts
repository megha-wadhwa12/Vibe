import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestoreConfig';

export async function getUserProfile(uid: string) {
  const ref = doc(db, 'users', uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error('User profile not found');
  }

  return snapshot.data();
}
