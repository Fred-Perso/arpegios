import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, query, where, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Minimal chord representation stored in Firestore (name/notes are computed on load)
export interface StoredChord {
  rootIdx: number;
  type: string;
  beats: number;
}

export interface GridDoc {
  id: string;
  uid: string;
  name: string;
  bars: StoredChord[][];
  savedAt: Timestamp;
}

export function subscribeGrids(uid: string, cb: (grids: GridDoc[]) => void) {
  const q = query(collection(db, 'grids'), where('uid', '==', uid));
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as GridDoc)))
  );
}

export async function saveGrid(
  uid: string,
  name: string,
  bars: StoredChord[][],
): Promise<void> {
  await addDoc(collection(db, 'grids'), {
    uid, name,
    bars: bars.map(bar => bar.map(({ rootIdx, type, beats }) => ({ rootIdx, type, beats }))),
    savedAt: Timestamp.now(),
  });
}

export async function deleteGrid(id: string): Promise<void> {
  await deleteDoc(doc(db, 'grids', id));
}
