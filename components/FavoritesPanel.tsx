'use client';
import { useEffect, useState } from 'react';
import { User, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Favorite, subscribeFavorites, addFavorite, removeFavorite } from '@/lib/favorites';
import { NOTE_NAMES, DEGREE_LABELS, DEGREE_CHORD_TYPE, ARPEGGIO_SYMBOL, SCALE_INTERVALS } from '@/lib/music';

interface Props {
  keyNote: number;
  degreeIndex: number;
  chordName: string;
  onSelect: (keyNote: number, degreeIndex: number) => void;
}

export default function FavoritesPanel({ keyNote, degreeIndex, chordName, onSelect }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [favs, setFavs] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (!u) {
        const { user: anon } = await signInAnonymously(auth);
        setUser(anon);
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    return subscribeFavorites(user.uid, setFavs);
  }, [user]);

  const isFav = favs.some(f => f.keyNote === keyNote && f.degreeIndex === degreeIndex);

  async function toggle() {
    if (!user) return;
    if (isFav) {
      const f = favs.find(f => f.keyNote === keyNote && f.degreeIndex === degreeIndex);
      if (f) await removeFavorite(f.id);
    } else {
      await addFavorite(user.uid, keyNote, degreeIndex, chordName);
    }
  }

  if (loading) return null;

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${isFav
              ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          <span>{isFav ? '★' : '☆'}</span>
          {isFav ? 'Sauvegardé' : 'Sauvegarder'}
        </button>
        <span className="text-xs text-gray-500">{favs.length} favori{favs.length > 1 ? 's' : ''}</span>
      </div>

      {favs.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">Favoris</p>
          <div className="flex flex-wrap gap-2">
            {favs.map(fav => {
              const type = DEGREE_CHORD_TYPE['major'][fav.degreeIndex];
              const sym  = ARPEGGIO_SYMBOL[type];
              const root = NOTE_NAMES[(fav.keyNote + SCALE_INTERVALS['major'][fav.degreeIndex]) % 12];
              return (
                <button
                  key={fav.id}
                  onClick={() => onSelect(fav.keyNote, fav.degreeIndex)}
                  className="group flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-1.5 text-sm transition-colors"
                >
                  <span className="font-semibold text-white">{root}{sym}</span>
                  <span className="text-gray-400 text-xs">
                    {NOTE_NAMES[fav.keyNote]} / {DEGREE_LABELS[fav.degreeIndex]}
                  </span>
                  <span
                    onClick={e => { e.stopPropagation(); removeFavorite(fav.id); }}
                    className="ml-1 text-gray-500 hover:text-red-400 cursor-pointer"
                  >×</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
