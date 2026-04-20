import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, setDoc, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface AdminConfig {
  compPatterns: { active: boolean; voicing: string; vel: number }[][];
  drumPatterns: Record<string, boolean[]>[];
}

export function subscribeAdminConfig(cb: (cfg: AdminConfig | null) => void) {
  return onSnapshot(doc(db, 'config', 'admin'), snap => {
    if (!snap.exists()) { cb(null); return; }
    const d = snap.data();
    try {
      const compPatterns = d.compPatternsJson ? JSON.parse(d.compPatternsJson) : null;
      // compat: ancien champ drumSteps (objet plat) → wrappé en tableau
      const drumPatterns = d.drumPatterns ?? (d.drumSteps ? [d.drumSteps] : null);
      cb({ compPatterns, drumPatterns });
    } catch { cb(null); }
  });
}

// compPatterns sérialisé en JSON (Firestore n'accepte pas les arrays imbriqués)
// drumPatterns = array d'objets plats → supporté nativement
export async function saveAdminConfig(cfg: AdminConfig): Promise<void> {
  await setDoc(doc(db, 'config', 'admin'), {
    compPatternsJson: JSON.stringify(cfg.compPatterns),
    drumPatterns: cfg.drumPatterns,
  });
}

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
  key?: string;
  tips?: string;
  bars: { chords: StoredChord[] }[];
  savedAt: Timestamp;
}

export function subscribeGrids(cb: (grids: GridDoc[]) => void) {
  return onSnapshot(collection(db, 'grids'), snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as GridDoc)))
  );
}

export async function saveGrid(
  uid: string,
  name: string,
  bars: { chords: StoredChord[] }[],
  key?: string,
  tips?: string,
): Promise<void> {
  await addDoc(collection(db, 'grids'), {
    uid, name,
    ...(key  ? { key  } : {}),
    ...(tips ? { tips } : {}),
    bars: bars.map(bar => ({ chords: bar.chords.map(({ rootIdx, type, beats }) => ({ rootIdx, type, beats })) })),
    savedAt: Timestamp.now(),
  });
}

export async function deleteGrid(id: string): Promise<void> {
  await deleteDoc(doc(db, 'grids', id));
}
