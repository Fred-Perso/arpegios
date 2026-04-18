import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, query, where, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Favorite {
  id: string;
  userId: string;
  keyNote: number;
  degreeIndex: number;
  label: string;
  createdAt: Timestamp;
}

export function subscribeFavorites(
  userId: string,
  cb: (favs: Favorite[]) => void,
) {
  const q = query(
    collection(db, 'favorites'),
    where('userId', '==', userId),
  );
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Favorite))),
  );
}

export async function addFavorite(
  userId: string,
  keyNote: number,
  degreeIndex: number,
  label: string,
) {
  await addDoc(collection(db, 'favorites'), {
    userId, keyNote, degreeIndex, label,
    createdAt: Timestamp.now(),
  });
}

export async function removeFavorite(id: string) {
  await deleteDoc(doc(db, 'favorites', id));
}
