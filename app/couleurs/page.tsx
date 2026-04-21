'use client';

import { useState, useRef } from 'react';
import {
  ArpeggioType,
  ARPEGGIO_INTERVALS,
  ARPEGGIO_SYMBOL,
  DEGREE_NOTE_NAMES,
  NOTE_NAMES,
} from '@/lib/music';

// ── Piano samples (Salamander) ──────────────────────────────────────────────
const BASE_URL = 'https://tonejs.github.io/audio/salamander/';
const SAMPLE_MAP: Record<string, string> = {
  A0:'A0.mp3', C1:'C1.mp3', 'D#1':'Ds1.mp3', 'F#1':'Fs1.mp3',
  A1:'A1.mp3', C2:'C2.mp3', 'D#2':'Ds2.mp3', 'F#2':'Fs2.mp3',
  A2:'A2.mp3', C3:'C3.mp3', 'D#3':'Ds3.mp3', 'F#3':'Fs3.mp3',
  A3:'A3.mp3', C4:'C4.mp3', 'D#4':'Ds4.mp3', 'F#4':'Fs4.mp3',
  A4:'A4.mp3', C5:'C5.mp3', 'D#5':'Ds5.mp3', 'F#5':'Fs5.mp3',
  A5:'A5.mp3', C6:'C6.mp3', 'D#6':'Ds6.mp3', 'F#6':'Fs6.mp3',
  A6:'A6.mp3', C7:'C7.mp3', 'D#7':'Ds7.mp3', 'F#7':'Fs7.mp3',
  A7:'A7.mp3', C8:'C8.mp3',
};

function midiToNote(midi: number): string {
  return `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

// Open shell voicing: root + 5th in bass (oct 3), 3rd + 7th one octave higher (oct 4).
// Keeps the guide tones (3rd & 7th — the notes that define chord quality) in a clear register
// where a semitone difference (e.g. Eb4 vs E4) is unambiguously audible.
function getChordNotes(rootNote: number, type: ArpeggioType): string[] {
  const [, third, fifth, seventh] = ARPEGGIO_INTERVALS[type];
  const rootMidi = 48 + rootNote; // C3 = 48
  return [
    midiToNote(rootMidi),                // root  — oct 3 bass
    midiToNote(rootMidi + fifth),        // 5th   — oct 3 bass
    midiToNote(rootMidi + 12 + third),   // 3rd   — oct 4, guide tone
    midiToNote(rootMidi + 12 + seventh), // 7th   — oct 4, guide tone
  ];
}

// ── Color palette — one color per chord quality ──────────────────────────────
type ChordColor = {
  name: string;
  hex: string;
  light: string;
  gradient: string;
  glow: string;
  emotion: string;
  desc: string;
};

const CHORD_COLORS: Record<ArpeggioType, ChordColor> = {
  Maj7: {
    name: 'Ambre',
    hex: '#f59e0b',
    light: '#fcd34d',
    gradient: 'from-amber-400/25 via-yellow-600/10 to-transparent',
    glow: '0 0 80px rgba(245,158,11,0.35)',
    emotion: 'Repos · Clarté · Lumière',
    desc: 'L\'accord le plus stable. La tonique au repos, lumineuse et résolue.',
  },
  m7: {
    name: 'Saphir',
    hex: '#6366f1',
    light: '#a5b4fc',
    gradient: 'from-indigo-500/25 via-blue-700/10 to-transparent',
    glow: '0 0 80px rgba(99,102,241,0.35)',
    emotion: 'Mélancolie · Douceur · Profondeur',
    desc: 'Fluide et mélancolique. Le degré II dans le II–V–I, couleur bleue du jazz.',
  },
  Dom7: {
    name: 'Braise',
    hex: '#f97316',
    light: '#fb923c',
    gradient: 'from-orange-500/25 via-red-600/10 to-transparent',
    glow: '0 0 80px rgba(249,115,22,0.35)',
    emotion: 'Tension · Désir · Mouvement',
    desc: 'L\'accord de dominante veut se résoudre. Chaleur, friction, énergie.',
  },
  m7b5: {
    name: 'Améthyste',
    hex: '#8b5cf6',
    light: '#c4b5fd',
    gradient: 'from-violet-500/25 via-purple-800/10 to-transparent',
    glow: '0 0 80px rgba(139,92,246,0.35)',
    emotion: 'Mystère · Ombre · Instabilité',
    desc: 'Semi-diminué. Sombre et envoûtant, antichambre de la résolution.',
  },
  mMaj7: {
    name: 'Jade',
    hex: '#10b981',
    light: '#6ee7b7',
    gradient: 'from-teal-400/25 via-emerald-600/10 to-transparent',
    glow: '0 0 80px rgba(16,185,129,0.35)',
    emotion: 'Ambiguïté · Beauté rare · Étrangeté',
    desc: 'La tierce mineure contre la septième majeure créent une tension douce-amère unique.',
  },
  'Maj7#5': {
    name: 'Orchidée',
    hex: '#d946ef',
    light: '#f0abfc',
    gradient: 'from-fuchsia-500/25 via-pink-700/10 to-transparent',
    glow: '0 0 80px rgba(217,70,239,0.35)',
    emotion: 'Suspension · Flottement · Irréel',
    desc: 'La quinte augmentée flotte hors de la tonalité. Couleur hors du temps.',
  },
  dim7: {
    name: 'Cramoisi',
    hex: '#dc2626',
    light: '#fca5a5',
    gradient: 'from-red-600/25 via-rose-900/10 to-transparent',
    glow: '0 0 80px rgba(220,38,38,0.35)',
    emotion: 'Dissonance · Symétrie · Maximum de tension',
    desc: 'Entièrement fait de tierces mineures. Symétrique, instable, intense.',
  },
};

// Existing degree index colors (R=0, 3rd=1, 5th=2, 7th=3)
const DEGREE_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7'];

const CHORD_ORDER: ArpeggioType[] = ['Maj7', 'm7', 'Dom7', 'm7b5', 'mMaj7', 'Maj7#5', 'dim7'];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CouleursPage() {
  const [rootNote, setRootNote] = useState(0);
  const [playing, setPlaying]   = useState<ArpeggioType | null>(null);
  const [loading, setLoading]   = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const samplerRef = useRef<any>(null);
  const loadedRef  = useRef(false);

  async function playChord(type: ArpeggioType) {
    if (playing || loading) return;

    try {
      const Tone = await import('tone');
      await Tone.start();

      const doPlay = () => {
        setPlaying(type);
        const notes = getChordNotes(rootNote, type);
        const now = Tone.now() + 0.05;
        notes.forEach((note, i) => {
          samplerRef.current.triggerAttackRelease(note, '2n', now + i * 0.04);
        });
        setTimeout(() => setPlaying(null), notes.length * 40 + 2800);
      };

      if (!loadedRef.current) {
        setLoading(true);
        const reverb = new Tone.Reverb({ decay: 3.5, wet: 0.3 }).toDestination();
        samplerRef.current = new Tone.Sampler({
          urls: SAMPLE_MAP,
          baseUrl: BASE_URL,
          release: 3,
          onload: () => {
            loadedRef.current = true;
            setLoading(false);
            doPlay();
          },
          onerror: (e: unknown) => {
            console.warn('Sampler error:', e);
            setLoading(false);
          },
        }).connect(reverb);
      } else {
        doPlay();
      }
    } catch (e) {
      console.warn('Audio error:', e);
      setLoading(false);
    }
  }

  const activeColor = playing ? CHORD_COLORS[playing] : null;

  return (
    <main className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── Dynamic background glow when playing ── */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: activeColor
            ? `radial-gradient(ellipse 60% 40% at 50% 0%, ${activeColor.hex}14, transparent 70%)`
            : 'none',
        }}
      />

      {/* ── HERO ── */}
      <section className="relative px-4 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-violet-300 uppercase tracking-widest mb-5">
          Synesthésie · Harmonie jazz
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
          <span className="text-white">Couleurs</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-300">
            Harmoniques
          </span>
        </h1>

        <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
          Chaque accord a une couleur, une texture, une émotion.
          Choisissez une tonique et entendez la palette de l'harmonie jazz.
        </p>

        {/* Current playing display */}
        <div className="mt-6 h-10 flex items-center justify-center">
          {playing && activeColor ? (
            <div className="flex items-center gap-3 animate-pulse">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75"
                  style={{ background: activeColor.hex }} />
                <span className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: activeColor.hex }} />
              </span>
              <span className="text-lg font-black" style={{ color: activeColor.light }}>
                {NOTE_NAMES[rootNote]}{ARPEGGIO_SYMBOL[playing]}
              </span>
              <span className="text-xs text-gray-400">{activeColor.emotion.split('·')[0].trim()}</span>
            </div>
          ) : (
            <p className="text-xs text-gray-600">
              {loading ? 'Chargement du piano…' : 'Cliquez un accord pour l\'entendre'}
            </p>
          )}
        </div>
      </section>

      {/* ── ROOT PICKER ── */}
      <section className="px-4 pb-8 max-w-3xl mx-auto">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3 text-center font-semibold">
          Tonique
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {NOTE_NAMES.map((note, i) => (
            <button
              key={i}
              onClick={() => setRootNote(i)}
              className={`w-11 h-11 rounded-xl font-bold text-sm transition-all ${
                rootNote === i
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30 scale-110'
                  : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </section>

      {/* ── CHORD COLOR CARDS ── */}
      <section className="px-4 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CHORD_ORDER.map((type) => {
            const color   = CHORD_COLORS[type];
            const isPlaying = playing === type;
            const isFaded   = playing && !isPlaying;

            return (
              <button
                key={type}
                onClick={() => playChord(type)}
                disabled={!!playing || loading}
                className={`group relative rounded-2xl border text-left transition-all duration-300 overflow-hidden
                  bg-gradient-to-br ${color.gradient} bg-gray-900/60
                  ${isPlaying
                    ? 'border-white/20 scale-[1.04] cursor-default'
                    : 'border-gray-800/60 hover:border-white/10 hover:scale-[1.02] cursor-pointer'
                  }
                  ${isFaded ? 'opacity-35' : 'opacity-100'}
                `}
                style={isPlaying ? { boxShadow: color.glow } : undefined}
              >
                {/* Inner glow pulse when playing */}
                {isPlaying && (
                  <div
                    className="absolute inset-0 animate-pulse rounded-2xl"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${color.hex}30, transparent 65%)` }}
                  />
                )}

                <div className="relative p-5">
                  {/* Color dot + playing indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-5 h-5 rounded-full ring-2 ring-white/10 shadow-sm"
                      style={{ background: color.hex }} />
                    {isPlaying && (
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75"
                          style={{ background: color.hex }} />
                        <span className="relative inline-flex rounded-full h-2 w-2"
                          style={{ background: color.hex }} />
                      </span>
                    )}
                  </div>

                  {/* Chord symbol — large */}
                  <div className="text-3xl font-black leading-none mb-1.5"
                    style={{ color: color.light }}>
                    {ARPEGGIO_SYMBOL[type]}
                  </div>

                  {/* Full chord name */}
                  <div className="text-white font-bold text-sm">
                    {NOTE_NAMES[rootNote]}{ARPEGGIO_SYMBOL[type]}
                  </div>

                  {/* Intervals */}
                  <div className="flex gap-1 mt-2.5 flex-wrap">
                    {DEGREE_NOTE_NAMES[type].map((label, i) => (
                      <span key={i}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          background: `${DEGREE_COLORS[i]}18`,
                          color: DEGREE_COLORS[i],
                          border: `1px solid ${DEGREE_COLORS[i]}40`,
                        }}>
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Color name + emotion */}
                  <div className="mt-3.5 pt-3 border-t border-white/5">
                    <p className="text-xs font-bold" style={{ color: color.light }}>{color.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                      {color.emotion.split('·')[0].trim()}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── LEGEND ── */}
      <section className="px-4 pb-20 max-w-3xl mx-auto">
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-300 mb-5">La palette complète</h2>
          <div className="grid gap-3">
            {CHORD_ORDER.map(type => {
              const color = CHORD_COLORS[type];
              return (
                <div key={type} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color.hex }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{ARPEGGIO_SYMBOL[type]}</span>
                      <span className="text-xs font-semibold" style={{ color: color.hex }}>{color.name}</span>
                      <span className="text-[10px] text-gray-600">{color.emotion}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{color.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
