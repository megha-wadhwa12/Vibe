import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firestoreConfig';

export interface UpdateUserProfileParams {
  uid: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  avatar?: string | null;
}

export async function updateUserProfile({
  uid,
  firstName,
  lastName,
  username,
  bio,
  avatar,
}: UpdateUserProfileParams) {
  const userRef = doc(db, 'users', uid);
  
  const updateData: any = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (username !== undefined) updateData.username = username;
  if (bio !== undefined) updateData.bio = bio;
  if (avatar !== undefined) updateData.avatar = avatar;

  await updateDoc(userRef, updateData);
  return updateData;
}

