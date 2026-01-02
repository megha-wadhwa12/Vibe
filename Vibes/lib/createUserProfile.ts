import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/firestoreConfig'

export type CreateUserProfileParams = {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dob: {
    day: number;
    month: number;
    year: number;
  } | null;
  avatar?: string | null;
};
export async function createUserProfile({
  uid,
  email,
  username,
  firstName,
  lastName,
  dob,
  avatar,
}: CreateUserProfileParams) {
  const data = {
    uid,
    email,
    username,
    firstName,
    lastName,
    dob,
    bio: '',
    avatar,
    createdAt: serverTimestamp()
  }
  const usersRef = doc(db, 'users', uid);

  const snapshot = await getDoc(usersRef)
  if (snapshot.exists()) return

  await setDoc(usersRef, {
    uid,
    email,
    username,
    firstName,
    lastName,
    dob,
    bio: '',
    avatar: null,
    createdAt: serverTimestamp()
  })
}