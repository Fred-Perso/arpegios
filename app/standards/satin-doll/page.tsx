'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';


type Status = 'loading' | 'ready' | 'playing' | 'paused';

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ── Chord chart ───────────────────────────────────────────────────────────────
type Cell = { chord: string; role: string; key?: string; note?: string; color: string; text: string };
type Section = { label: string; desc: string; rows: Cell[][] };

const CHART: Section[] = [
  {
    label: 'A',
    desc: 'La chaîne de II–V par mouvement de secondes (Dm7→G7 puis Em7→A7)',
    rows: [
      [
        { chord: 'Dm7', role: 'IIm7', key: 'Do majeur',    color: 'bg-blue-900/40 border-blue-700',   text: 'text-blue-300'  },
        { chord: 'G7',  role: 'V7',   key: 'Do majeur',    color: 'bg-red-900/40 border-red-700',     text: 'text-red-300'   },
        { chord: 'Dm7', role: 'IIm7', key: '(répétition)', color: 'bg-blue-900/40 border-blue-700',   text: 'text-blue-300'  },
        { chord: 'G7',  role: 'V7',   key: 'Do majeur',    color: 'bg-red-900/40 border-red-700',     text: 'text-red-300'   },
      ],
      [
        { chord: 'Em7',  role: 'IIIm7 → IIm7/Ré', key: '→ Ré majeur',   color: 'bg-blue-900/40 border-blue-700',    text: 'text-blue-300',   note: 'II–V secondaire' },
        { chord: 'A7',   role: 'V7/II',            key: '→ Ré majeur',   color: 'bg-red-900/40 border-red-700',      text: 'text-red-300'   },
        { chord: 'Em7',  role: 'IIIm7 → IIm7/Ré', key: '(répétition)',  color: 'bg-blue-900/40 border-blue-700',    text: 'text-blue-300'  },
        { chord: 'A7',   role: 'V7/II',            key: '→ Ré majeur',   color: 'bg-red-900/40 border-red-700',      text: 'text-red-300'   },
      ],
      [
        { chord: 'Am7',  role: 'IIm7/Sol', key: '→ Sol majeur', color: 'bg-blue-900/40 border-blue-700',   text: 'text-blue-300',   note: 'II–V secondaire' },
        { chord: 'D7',   role: 'V7/Sol',   key: '→ Sol majeur', color: 'bg-red-900/40 border-red-700',     text: 'text-red-300'   },
        { chord: 'Ab7',  role: 'sub V7',   key: 'Sub. tritonique de D7', color: 'bg-violet-900/40 border-violet-700', text: 'text-violet-300', note: 'Substitution triton' },
        { chord: 'G7',   role: 'V7',       key: 'Do majeur',    color: 'bg-red-900/40 border-red-700',     text: 'text-red-300'   },
      ],
      [
        { chord: 'Dm7',   role: 'IIm7',   key: 'Do majeur', color: 'bg-blue-900/40 border-blue-700',   text: 'text-blue-300'  },
        { chord: 'G7',    role: 'V7',     key: 'Do majeur', color: 'bg-red-900/40 border-red-700',     text: 'text-red-300'   },
        { chord: 'Cmaj7', role: 'I△7',    key: 'Do majeur', color: 'bg-amber-900/40 border-amber-700', text: 'text-amber-300' },
        { chord: 'Cmaj7', role: 'I△7',    key: '(résolution)',color: 'bg-amber-900/40 border-amber-700',text: 'text-amber-300' },
      ],
    ],
  },
  {
    label: 'B — Bridge',
    desc: 'Départ en Sol mineur (relatif) puis retour via F majeur',
    rows: [
      [
        { chord: 'Gm7',   role: 'Im7',    key: 'Sol mineur',   color: 'bg-blue-900/40 border-blue-700',   text: 'text-blue-300'  },
        { chord: 'C7',    role: 'V7',     key: 'Fa majeur',    color: 'bg-red-900/40 border-red-700',     text: 'text-red-300',  note: 'II–V/IV' },
        { chord: 'Gm7',   role: 'Im7',    key: '(répétition)', color: 'bg-blue-900/40 border-blue-700',   text: 'text-blue-300'  },
        { chord: 'C7',    role: 'V7',     key: 'Fa majeur',    color: 'bg-red-900/40 border-red-700',     text: 'text-red-300'   },
      ],
      [
        { chord: 'Fmaj7', role: 'IV△7',   key: 'Do majeur',    color: 'bg-amber-900/40 border-amber-700', text: 'text-amber-300' },
        { chord: 'Fmaj7', role: 'IV△7',   key: '(tenu)',       color: 'bg-amber-900/40 border-amber-700', text: 'text-amber-300' },
        { chord: 'Fmaj7', role: 'IV△7',   key: '',             color: 'bg-amber-900/40 border-amber-700', text: 'text-amber-300' },
        { chord: 'Fmaj7', role: 'IV△7',   key: '',             color: 'bg-amber-900/40 border-amber-700', text: 'text-amber-300' },
      ],
    ],
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SatinDollPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiRef = useRef<any>(null);

  const [status,     setStatus]     = useState<Status>('loading');
  const [currentMs,  setCurrentMs]  = useState(0);
  const [totalMs,    setTotalMs]    = useState(0);
  const [currentBar, setCurrentBar] = useState(0);
  const [totalBars,  setTotalBars]  = useState(0);
  const [error,      setError]      = useState<string | null>(null);

  const [volume,  setVolume]  = useState(100);
  const [tempo,   setTempo]   = useState(100);
  const [looping, setLooping] = useState(false);
  const [stave,   setStave]   = useState<'score-tab' | 'tab' | 'score'>('score');

  useEffect(() => {
    if (!containerRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let api: any;

    (async () => {
      try {
        const alphaTab = await import('@coderline/alphatab');
        const base = window.location.origin;

        const settings = new alphaTab.Settings();
        settings.core.scriptFile              = `${base}/alphatab/alphaTab.js`;
        settings.core.fontDirectory           = `${base}/alphatab/font/`;
        settings.player.enablePlayer          = true;
        settings.player.enableCursor          = true;
        settings.player.enableUserInteraction = true;
        settings.player.soundFont             = `${base}/alphatab/soundfont/sonivox.sf2`;
        settings.display.scale                = 1.0;
        // Start with score-only (no tab) since it's a lead sheet
        settings.display.staveProfile         = 1;

        api = new alphaTab.AlphaTabApi(containerRef.current!, settings);
        apiRef.current = api;

        api.scoreLoaded.on((score: any) => {
          setTotalBars(score.masterBars?.length ?? 0);
          setStatus('ready');
        });

        api.playerStateChanged.on((args: any) => {
          setStatus(args.state === 1 ? 'playing' : 'paused');
        });

        api.playerPositionChanged.on((args: any) => {
          setCurrentBar((args.currentBeat?.masterBarIndex ?? 0) + 1);
          setCurrentMs(args.currentTime ?? 0);
          setTotalMs(args.endTime ?? 0);
        });

        api.playerFinished.on(() => {
          setStatus('ready');
          setCurrentBar(0);
          setCurrentMs(0);
        });

        api.error.on((e: any) => {
          setError(`Erreur AlphaTab : ${e?.message ?? String(e)}`);
        });

        // Load MusicXML file
        const buf = await fetch('/tabs/satin-doll.musicxml').then(r => r.arrayBuffer());
        api.load(buf);

      } catch (e: any) {
        setError(`Init impossible : ${e?.message ?? String(e)}`);
      }
    })();

    return () => { try { api?.destroy(); } catch {} };
  }, []);

  const togglePlay = () => apiRef.current?.playPause();
  const stop = () => {
    apiRef.current?.stop();
    setStatus('ready');
    setCurrentBar(0);
    setCurrentMs(0);
  };

  function changeVolume(v: number) {
    setVolume(v);
    if (apiRef.current) apiRef.current.masterVolume = v / 100;
  }

  function changeTempo(v: number) {
    setTempo(v);
    if (apiRef.current) apiRef.current.playbackSpeed = v / 100;
  }

  function toggleLoop() {
    const next = !looping;
    setLooping(next);
    if (apiRef.current) apiRef.current.isLooping = next;
  }

  function changeStave(s: 'score-tab' | 'tab' | 'score') {
    setStave(s);
    if (!apiRef.current) return;
    const map: Record<string, number> = { 'score-tab': 0, 'score': 1, 'tab': 2 };
    apiRef.current.settings.display.staveProfile = map[s];
    apiRef.current.updateSettings();
    apiRef.current.render();
  }

  const isPlaying = status === 'playing';
  const hasScore  = status === 'ready' || status === 'playing' || status === 'paused';
  const progress  = totalMs > 0 ? (currentMs / totalMs) * 100 : 0;

  const togBtn = (active: boolean) =>
    `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
      active
        ? 'bg-orange-600 border-orange-500 text-white'
        : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white'
    }`;

  return (
    <>
      <style>{`
        .at-cursor-bar    { background: rgba(249,115,22,.12) !important; }
        .at-cursor-beat   { background: rgba(249,115,22,.80) !important; width: 3px !important; }
        .at-highlight *   { fill: #f97316 !important; stroke: #f97316 !important; }
        .at-selection div { background: rgba(249,115,22,.20) !important; }
      `}</style>

      <main className="min-h-screen bg-gray-900 text-white" style={{ paddingBottom: hasScore ? 80 : 24 }}>

        {/* ── Header ── */}
        <div className="px-4 pt-5 pb-3 border-b border-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start gap-3 flex-wrap">
              <Link href="/standards" className="text-orange-400 hover:text-orange-300 text-sm shrink-0 mt-1">
                ← Standards
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <div>
                    <h1 className="text-xl font-black text-white">Satin Doll</h1>
                    <p className="text-sm text-gray-400">Duke Ellington · Billy Strayhorn · 1953</p>
                  </div>
                  <div className="flex gap-2 flex-wrap ml-auto">
                    <span className="bg-amber-900/40 border border-amber-700/50 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full">
                      Do majeur
                    </span>
                    <span className="bg-gray-800 border border-gray-700 text-gray-400 text-xs font-mono px-2.5 py-1 rounded-full">
                      32 mesures · AABA
                    </span>
                    <span className="bg-gray-800 border border-gray-700 text-gray-400 text-xs font-mono px-2.5 py-1 rounded-full">
                      ♩ = 132
                    </span>
                  </div>
                </div>

                {/* Display controls */}
                {hasScore && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">Affichage :</span>
                    {(['score', 'score-tab', 'tab'] as const).map(s => (
                      <button key={s} onClick={() => changeStave(s)}
                        className={`px-2 py-1 rounded-lg text-[10px] border transition-all ${
                          stave === s
                            ? 'bg-orange-700 border-orange-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                        }`}>
                        {s === 'score-tab' ? '𝄞 + Tab' : s === 'tab' ? 'Tablature' : 'Partition'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Score area ── */}
        <div className="max-w-5xl mx-auto px-4 py-4">
          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3 mb-4">{error}</p>
          )}
          {status === 'loading' && !error && (
            <p className="text-sm text-gray-500 animate-pulse text-center py-16">⏳ Chargement de la partition…</p>
          )}
          <div
            ref={containerRef}
            className="rounded-2xl overflow-hidden bg-white"
            style={{ minHeight: hasScore ? 300 : 0 }}
          />
        </div>

        {/* ── Chord chart ── */}
        <div className="max-w-5xl mx-auto px-4 pb-6 space-y-4">
          {CHART.map(section => (
            <div key={section.label} className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-sm font-bold text-gray-200">Section {section.label}</h2>
                <p className="text-xs text-gray-500">{section.desc}</p>
              </div>
              <div className="space-y-2">
                {section.rows.map((row, ri) => (
                  <div key={ri} className="grid grid-cols-4 gap-2">
                    {row.map((cell, ci) => (
                      <div key={ci} className={`rounded-xl border px-3 py-2.5 ${cell.color}`}>
                        <p className={`font-black text-base leading-tight ${cell.text}`}>{cell.chord}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{cell.role}</p>
                        {cell.key && <p className="text-[9px] text-gray-600 mt-0.5 leading-tight">{cell.key}</p>}
                        {cell.note && (
                          <p className="text-[9px] mt-1 font-semibold text-orange-400">{cell.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Analysis notes */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-gray-800/30 border border-gray-700/40 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-400 mb-2">II–V par tons</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                La section A enchaîne trois II–V : <span className="text-white">Dm7–G7</span> (Do),{' '}
                <span className="text-white">Em7–A7</span> (Ré), <span className="text-white">Am7–D7</span> (Sol).
                Chaque paire monte d'un ton entier — une signature du style Ellington.
              </p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/40 rounded-xl p-4">
              <p className="text-xs font-bold text-violet-400 mb-2">Ab7 — substitution tritonique</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Le <span className="text-white">Ab7</span> remplace le <span className="text-white">D7</span> par substitution de triton.
                La basse descend chromatiquement : A → Ab → G, créant un mouvement très lisse vers la résolution.
              </p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700/40 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-400 mb-2">Bridge en Fa majeur</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Le bridge emprunte à <span className="text-white">Fa majeur</span> via Gm7–C7 (II–V/IV),
                puis reste sur Fmaj7 pendant 4 mesures — une respiration harmonique avant le retour en Do.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* ── Fixed player bar ── */}
      {hasScore && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-gray-700 z-50 px-4 py-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-mono w-10 shrink-0">{fmt(currentMs)}</span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] text-gray-500 font-mono w-10 text-right shrink-0">{fmt(totalMs)}</span>
            {totalBars > 0 && (
              <span className="text-[10px] text-gray-600 font-mono shrink-0">{currentBar}/{totalBars}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={stop}
              className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center text-sm">⏹</button>
            <button onClick={togglePlay}
              className={`w-10 h-8 rounded-lg font-bold text-sm flex items-center justify-center transition-colors ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'
              }`}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div className="w-px h-5 bg-gray-700 mx-1 shrink-0" />
            <button onClick={toggleLoop} className={togBtn(looping)}>🔁 Boucle</button>
            <div className="w-px h-5 bg-gray-700 mx-1 shrink-0" />
            <span className="text-[10px] text-gray-500 shrink-0">🔊</span>
            <input type="range" min={0} max={100} value={volume}
              onChange={e => changeVolume(+e.target.value)}
              className="w-20 accent-orange-500 shrink-0" />
            <span className="text-[10px] text-gray-500 w-6 shrink-0">{volume}</span>
            <span className="text-[10px] text-gray-500 shrink-0">⚡</span>
            <input type="range" min={25} max={200} value={tempo}
              onChange={e => changeTempo(+e.target.value)}
              className="w-20 accent-orange-500 shrink-0" />
            <span className="text-[10px] text-gray-500 w-8 shrink-0">{tempo}%</span>
          </div>
        </div>
      )}
    </>
  );
}
