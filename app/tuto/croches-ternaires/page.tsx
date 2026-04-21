'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// ── AlphaTex helpers ─────────────────────────────────────────────────────────
// String numbering: 1=high e (E4), 2=B3, 3=G3, 4=D3, 5=A2, 6=E2
const SW = '\\tf 2 ';

interface Example {
  id: string;
  label: string;
  emoji: string;
  swing: boolean;
  description: string;
  tip: string;
  tex: string;
}

const EXAMPLES: Example[] = [
  {
    id: 'straight',
    label: 'Croches binaires',
    emoji: '📏',
    swing: false,
    description: 'Les croches sont égales : chaque croche dure exactement la moitié d\'un temps. On dit "one and two and three and four and".',
    tip: 'Sonnance : mécanique, grosse caisse / techno',
    tex: '\\tempo 80\n.\n:8 0.1 3.1 5.1 7.1 7.1 5.1 3.1 0.1',
  },
  {
    id: 'swing',
    label: 'Croches ternaires',
    emoji: '🎷',
    swing: true,
    description: 'Les mêmes notes, mais inégales : la 1ère croche dure ⅔ du temps, la 2ème ⅓. Le "and" arrive tard, sur le dernier tiers du temps.',
    tip: 'Sonnance : jazz, blues, groove',
    tex: `\\tempo 80\n.\n${SW}:8 0.1 3.1 5.1 7.1 7.1 5.1 3.1 0.1`,
  },
  {
    id: 'penta-swing',
    label: 'Pentatonique Am swing',
    emoji: '🎸',
    swing: true,
    description: 'La gamme pentatonique Am jouée en croches ternaires. C\'est le feeling blues classique. Remarque comment ça se balance naturellement.',
    tip: 'Exercice : chante "trip-let trip-let" en jouant',
    tex: `\\tempo 100\n.\n${SW}:8 2.3 5.3 7.3 0.1 3.1 5.1 r r | ${SW}:8 5.1 3.1 0.1 7.3 5.3 2.3 r r`,
  },
  {
    id: '251-swing',
    label: 'Lick II–V–I swing',
    emoji: '⚡',
    swing: true,
    description: 'Une phrase jazz simple sur Dm7 → G7 → CMaj7 jouée en croches ternaires. Écoute comment les notes "rebondissent" naturellement sur les temps forts.',
    tip: 'Les temps forts (1, 2, 3, 4) tombent toujours sur les longues',
    tex: `\\tempo 120\n.\n${SW}:8 3.2 6.2 5.1 8.1 5.1 6.2 3.2 1.2 | ${SW}:8 0.2 3.2 4.3 5.4 3.4 4.3 3.2 0.2 | ${SW}:1 1.2`,
  },
  {
    id: 'walking-swing',
    label: 'Walking bass + mélodie',
    emoji: '🚶',
    swing: true,
    description: 'Une ligne qui monte en croches ternaires, comme un bassiste qui "marche". Le swing donne cette sensation de locomotion en avant.',
    tip: 'La régularité du swing crée un "train" rythmique',
    tex: `\\tempo 110\n.\n${SW}:8 3.5 5.5 7.5 8.5 10.5 0.4 2.4 3.4 | ${SW}:8 5.4 7.4 8.4 10.4 0.3 2.3 4.3 5.3 | ${SW}:1 5.3`,
  },
];

// ── SVG Diagrams ──────────────────────────────────────────────────────────────

function StraightDiagram() {
  return (
    <svg viewBox="0 0 320 80" className="w-full">
      <text x="10" y="14" fontSize="10" fill="#9ca3af" fontFamily="monospace">Temps 1</text>
      <text x="170" y="14" fontSize="10" fill="#9ca3af" fontFamily="monospace">Temps 2</text>

      {/* Beat 1 : 2 equal eighths */}
      <rect x="10" y="22" width="72" height="32" rx="4" fill="#3b82f6" opacity="0.8"/>
      <text x="46" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">1</text>
      <rect x="88" y="22" width="72" height="32" rx="4" fill="#60a5fa" opacity="0.6"/>
      <text x="124" y="42" textAnchor="middle" fontSize="11" fill="white">+</text>

      {/* Beat 2 : 2 equal eighths */}
      <rect x="170" y="22" width="72" height="32" rx="4" fill="#3b82f6" opacity="0.8"/>
      <text x="206" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">2</text>
      <rect x="248" y="22" width="72" height="32" rx="4" fill="#60a5fa" opacity="0.6"/>
      <text x="284" y="42" textAnchor="middle" fontSize="11" fill="white">+</text>

      {/* Labels */}
      <text x="10" y="72" fontSize="9" fill="#6b7280">50%</text>
      <text x="88" y="72" fontSize="9" fill="#6b7280">50%</text>
      <text x="170" y="72" fontSize="9" fill="#6b7280">50%</text>
      <text x="248" y="72" fontSize="9" fill="#6b7280">50%</text>
    </svg>
  );
}

function SwingDiagram() {
  return (
    <svg viewBox="0 0 320 80" className="w-full">
      <text x="10" y="14" fontSize="10" fill="#9ca3af" fontFamily="monospace">Temps 1</text>
      <text x="170" y="14" fontSize="10" fill="#9ca3af" fontFamily="monospace">Temps 2</text>

      {/* Beat 1 : long (2/3) + short (1/3) */}
      <rect x="10" y="22" width="96" height="32" rx="4" fill="#f97316" opacity="0.9"/>
      <text x="58" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">1</text>
      <rect x="112" y="22" width="48" height="32" rx="4" fill="#fb923c" opacity="0.6"/>
      <text x="136" y="42" textAnchor="middle" fontSize="11" fill="white">+</text>

      {/* Beat 2 : long (2/3) + short (1/3) */}
      <rect x="170" y="22" width="96" height="32" rx="4" fill="#f97316" opacity="0.9"/>
      <text x="218" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">2</text>
      <rect x="272" y="22" width="48" height="32" rx="4" fill="#fb923c" opacity="0.6"/>
      <text x="296" y="42" textAnchor="middle" fontSize="11" fill="white">+</text>

      {/* Labels */}
      <text x="10" y="72" fontSize="9" fill="#f97316">≈ 67%</text>
      <text x="112" y="72" fontSize="9" fill="#9ca3af">≈ 33%</text>
      <text x="170" y="72" fontSize="9" fill="#f97316">≈ 67%</text>
      <text x="272" y="72" fontSize="9" fill="#9ca3af">≈ 33%</text>
    </svg>
  );
}

function TripletExplainer() {
  // Shows: 4 subdivisions per beat, swing = skip middle
  return (
    <svg viewBox="0 0 320 100" className="w-full">
      <text x="0" y="12" fontSize="10" fill="#9ca3af">Un temps = 3 sous-divisions égales (triolets de croches)</text>

      {/* Triplets for beat 1 */}
      <rect x="0"  y="20" width="98" height="28" rx="3" fill="#7c3aed" opacity="0.8"/>
      <rect x="102" y="20" width="98" height="28" rx="3" fill="#7c3aed" opacity="0.5"/>
      <rect x="206" y="20" width="98" height="28" rx="3" fill="#7c3aed" opacity="0.5"/>
      <text x="49"  y="38" textAnchor="middle" fontSize="10" fill="white">trip</text>
      <text x="151" y="38" textAnchor="middle" fontSize="10" fill="white" opacity="0.6">—</text>
      <text x="255" y="38" textAnchor="middle" fontSize="10" fill="white">let</text>

      <text x="0"   y="62" fontSize="9" fill="#9ca3af">Croche 1 (longue)</text>
      <text x="151" y="62" fontSize="9" fill="#9ca3af" textAnchor="middle">fusionnées !</text>
      <text x="206" y="62" fontSize="9" fill="#9ca3af">Croche 2 (courte)</text>

      {/* Arrow */}
      <line x1="49" y1="48" x2="49" y2="70" stroke="#f97316" strokeWidth="1.5"/>
      <line x1="255" y1="48" x2="255" y2="70" stroke="#f97316" strokeWidth="1.5"/>

      <rect x="0"   y="72" width="198" height="22" rx="3" fill="#f97316" opacity="0.85"/>
      <rect x="204" y="72" width="100" height="22" rx="3" fill="#fb923c" opacity="0.6"/>
      <text x="99"  y="87" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">LONG (2/3)</text>
      <text x="254" y="87" textAnchor="middle" fontSize="10" fill="white">COURT (1/3)</text>
    </svg>
  );
}

// ── Player ────────────────────────────────────────────────────────────────────
type ATStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused';

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function CrochesTernairesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef       = useRef<any>(null);

  const [status,    setStatus]    = useState<ATStatus>('idle');
  const [initError, setInitError] = useState<string | null>(null);
  const [activeEx,  setActiveEx]  = useState<string>('straight');
  const [looping,   setLooping]   = useState(false);
  const [volume,    setVolume]    = useState(80);
  const [speed,     setSpeed]     = useState(100);
  const [currentMs, setCurrentMs] = useState(0);
  const [totalMs,   setTotalMs]   = useState(0);

  const hasScore = status === 'ready' || status === 'playing' || status === 'paused';
  const progress = totalMs > 0 ? (currentMs / totalMs) * 100 : 0;
  const currentExample = EXAMPLES.find(e => e.id === activeEx)!;

  // ── AlphaTab init ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    let api: any;
    let mounted = true;

    (async () => {
      try {
        const alphaTab = await import('@coderline/alphatab');
        if (!mounted || !containerRef.current) return;

        const base = window.location.origin;
        const settings = new alphaTab.Settings();
        settings.core.scriptFile              = `${base}/alphatab/alphaTab.js`;
        settings.core.fontDirectory           = `${base}/alphatab/font/`;
        settings.player.enablePlayer          = true;
        settings.player.enableCursor          = true;
        settings.player.enableUserInteraction = true;
        settings.player.soundFont             = `${base}/alphatab/soundfont/sonivox.sf2`;
        settings.display.scale                = 0.95;
        settings.display.layoutMode           = 1; // horizontal

        api = new alphaTab.AlphaTabApi(containerRef.current!, settings);
        apiRef.current = api;

        api.scoreLoaded.on(() => { if (mounted) setStatus('ready'); });
        api.playerStateChanged.on((args: any) => {
          if (mounted) setStatus(args.state === 1 ? 'playing' : 'paused');
        });
        api.playerPositionChanged.on((args: any) => {
          if (mounted) {
            setCurrentMs(args.currentTime ?? 0);
            setTotalMs(args.endTime ?? 0);
          }
        });
        api.playerFinished.on(() => {
          if (mounted) { setStatus('ready'); setCurrentMs(0); }
        });
        api.error.on((e: any) => {
          if (mounted) setInitError(`AlphaTab : ${e?.message ?? String(e)}`);
        });

        setStatus('loading');
        api.tex(EXAMPLES[0].tex);
      } catch (e: any) {
        if (mounted) setInitError(`Init : ${e?.message ?? String(e)}`);
      }
    })();

    return () => { mounted = false; try { api?.destroy(); } catch {} };
  }, []);

  // ── Load example ─────────────────────────────────────────────────────────
  function loadExample(id: string) {
    const ex = EXAMPLES.find(e => e.id === id)!;
    setActiveEx(id);
    if (!apiRef.current) return;
    try { apiRef.current.stop(); } catch {}
    setStatus('loading');
    setCurrentMs(0);
    setTotalMs(0);
    apiRef.current.tex(ex.tex);
  }

  const togglePlay = () => apiRef.current?.playPause();
  const stop = () => {
    apiRef.current?.stop();
    setStatus('ready');
    setCurrentMs(0);
  };
  function changeVolume(v: number) {
    setVolume(v);
    if (apiRef.current) apiRef.current.masterVolume = v / 100;
  }
  function changeSpeed(v: number) {
    setSpeed(v);
    if (apiRef.current) apiRef.current.playbackSpeed = v / 100;
  }
  function toggleLoop() {
    const next = !looping;
    setLooping(next);
    if (apiRef.current) apiRef.current.isLooping = next;
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div>
          <Link href="/tuto" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">← Retour au parcours</Link>
          <h1 className="text-3xl font-bold mt-2">🎷 Les croches ternaires pour les nuls</h1>
          <p className="text-gray-400 mt-2 leading-relaxed">
            Le secret qui sépare le jazz du reste. Une fois que tu l'entends, tu ne l'oublies plus jamais.
          </p>
        </div>

        {/* ── Intro ── */}
        <div className="bg-orange-900/20 border border-orange-700/40 rounded-2xl p-5">
          <p className="text-orange-300 font-semibold mb-2">🤔 Le problème de la partition</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            En jazz, une partition écrit des croches normales, mais on ne les joue <em>pas</em> normales.
            Les musiciens savent intuitivement les rendre <strong className="text-white">inégales</strong>.
            C'est ça, le swing. Cette page t'explique exactement comment ça fonctionne.
          </p>
        </div>

        {/* ── Section 1 : La différence visuelle ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">1. La différence visuelle</h2>
          <p className="text-gray-400 text-sm">Un même temps de 4 temps divisé en deux façons :</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-800/60 border border-blue-700/40 rounded-2xl p-4">
              <p className="text-blue-400 font-bold text-sm mb-3">📏 Binaire (straight)</p>
              <StraightDiagram />
              <p className="text-gray-500 text-xs mt-2">Chaque croche = ½ temps. Divisions égales.</p>
            </div>
            <div className="bg-gray-800/60 border border-orange-700/40 rounded-2xl p-4">
              <p className="text-orange-400 font-bold text-sm mb-3">🎷 Ternaire (swing)</p>
              <SwingDiagram />
              <p className="text-gray-500 text-xs mt-2">Croche 1 = ⅔ du temps · Croche 2 = ⅓ du temps.</p>
            </div>
          </div>
        </section>

        {/* ── Section 2 : D'où ça vient ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">2. Le secret : les triolets</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Un temps peut se diviser en <strong className="text-white">3 parties égales</strong> — c'est le triolet de croches.
            Dans le swing, on joue les 1er et 3ème tiers (on "fusionne" les deux premiers) :
          </p>

          <div className="bg-gray-800/60 border border-purple-700/40 rounded-2xl p-4">
            <TripletExplainer />
          </div>

          <div className="bg-gray-800 rounded-2xl p-4 space-y-2 text-sm">
            <p className="text-white font-semibold">🗣️ Comment compter :</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-400 text-xs font-bold mb-1">Binaire</p>
                <p className="text-gray-300 font-mono text-xs">"ONE-and TWO-and THREE-and FOUR-and"</p>
                <p className="text-gray-500 text-xs mt-1">Le "and" arrive à 50%</p>
              </div>
              <div>
                <p className="text-orange-400 text-xs font-bold mb-1">Ternaire</p>
                <p className="text-gray-300 font-mono text-xs">"ONE-trip-let TWO-trip-let…"</p>
                <p className="text-gray-500 text-xs mt-1">Le "and" arrive à 67%</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3 : Lecteur audio ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">3. Écoute la différence</h2>
          <p className="text-gray-400 text-sm">Commence par comparer les deux premiers exemples — mêmes notes, feeling totalement différent.</p>

          {/* Example selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {EXAMPLES.map(ex => (
              <button
                key={ex.id}
                onClick={() => loadExample(ex.id)}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                  activeEx === ex.id
                    ? ex.swing
                      ? 'border-orange-500/70 bg-orange-900/30 ring-1 ring-orange-500/40'
                      : 'border-blue-500/70 bg-blue-900/30 ring-1 ring-blue-500/40'
                    : 'border-gray-700 bg-gray-800/40 hover:bg-gray-800/70'
                }`}>
                <span className="text-base">{ex.emoji}</span>
                <span className="text-xs font-semibold text-white leading-tight">{ex.label}</span>
                {!ex.swing && (
                  <span className="text-[9px] bg-blue-700/60 text-blue-300 rounded px-1.5 py-0.5">Binaire</span>
                )}
                {ex.swing && (
                  <span className="text-[9px] bg-orange-700/60 text-orange-300 rounded px-1.5 py-0.5">Swing</span>
                )}
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="bg-gray-800/50 rounded-xl p-4 space-y-1">
            <p className="text-sm text-gray-200">{currentExample.description}</p>
            <p className="text-xs text-gray-500 italic">{currentExample.tip}</p>
          </div>

          {/* Error */}
          {initError && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-2 text-xs text-red-300">{initError}</div>
          )}

          {/* Score */}
          <div className="bg-white rounded-2xl overflow-x-auto" style={{ minHeight: 160 }}>
            {(status === 'idle' || status === 'loading') && !initError && (
              <div className="text-center py-10 text-gray-400 text-sm animate-pulse">⏳ Chargement…</div>
            )}
            <div ref={containerRef} />
          </div>

          {/* Controls */}
          {hasScore && (
            <div className="bg-gray-800 rounded-2xl px-4 py-3 space-y-3">
              {/* Progress */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-mono w-10 shrink-0">{fmt(currentMs)}</span>
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }}/>
                </div>
                <span className="text-[10px] text-gray-500 font-mono w-10 text-right">{fmt(totalMs)}</span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-400 flex items-center justify-center text-white text-lg transition-colors">
                  {status === 'playing' ? '⏸' : '▶'}
                </button>
                <button onClick={stop} className="w-10 h-10 rounded-xl bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors">
                  ⏹
                </button>
                <button
                  onClick={toggleLoop}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-colors ${looping ? 'bg-orange-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-400'}`}>
                  🔁
                </button>

                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[10px] text-gray-500">🔊</span>
                  <input type="range" min={0} max={100} value={volume}
                    onChange={e => changeVolume(+e.target.value)}
                    className="w-20 accent-orange-500"/>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500">Vitesse</span>
                  <input type="range" min={50} max={100} value={speed}
                    onChange={e => changeSpeed(+e.target.value)}
                    className="w-20 accent-orange-500"/>
                  <span className="text-[10px] text-gray-500 w-8">{speed}%</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Section 4 : Comment l'acquérir ── */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">4. Comment l'acquérir</h2>

          <div className="space-y-3">
            {[
              {
                step: '1',
                title: 'Chante d\'abord',
                color: 'bg-orange-700',
                desc: 'Avant même de toucher ta guitare, chante "trip-let, trip-let, trip-let…" en tapant du pied. Le swing se ressent avant de se jouer.',
              },
              {
                step: '2',
                title: 'Écoute 20 minutes de jazz par jour',
                color: 'bg-red-700',
                desc: 'Miles Davis "Kind of Blue", Coltrane "Blue Train", Wes Montgomery "Full House". Ton cerveau intègre naturellement le feel par imprégnation.',
              },
              {
                step: '3',
                title: 'Joue à tempo très lent',
                color: 'bg-amber-700',
                desc: 'À 60 BPM, exagère l\'inégalité. La 1ère croche très longue, la 2ème très courte. Ton oreille doit entendre clairement la différence.',
              },
              {
                step: '4',
                title: 'Ne sur-pense pas',
                color: 'bg-teal-700',
                desc: 'Au bout d\'un moment, le swing se joue sans réfléchir. Comme un accent régional — on ne pense pas à comment parler, ça vient naturellement.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 bg-gray-800/40 rounded-xl p-4">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${item.color}`}>
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-white text-sm">{item.title}</p>
                  <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5 : Contexte ── */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Où on l'utilise</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { icon: '✅', label: 'Swing / Bebop', desc: 'Toujours ternaire. C\'est la base.', color: 'border-orange-700/50' },
              { icon: '✅', label: 'Blues jazz', desc: 'Ternaire, plus ou moins exagéré.', color: 'border-orange-700/50' },
              { icon: '⚠️', label: 'Bossa nova', desc: 'Straight ! Les croches sont binaires.', color: 'border-yellow-700/50' },
              { icon: '⚠️', label: 'Jazz fusion', desc: 'Souvent straight, parfois mixte.', color: 'border-yellow-700/50' },
              { icon: '❌', label: 'Jazz modal (Miles)', desc: 'Souvent straight ou flottant.', color: 'border-gray-700/50' },
              { icon: '❌', label: 'Jazz manouche', desc: 'Straight, mais avec pompe propre.', color: 'border-gray-700/50' },
            ].map((item, i) => (
              <div key={i} className={`bg-gray-800/40 border rounded-xl p-3 ${item.color}`}>
                <p className="font-semibold text-white">{item.icon} {item.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs">
            💡 La partition jazz note rarement si c'est swing ou straight. C'est une convention culturelle que tu dois connaître.
          </p>
        </section>

        {/* ── Nav ── */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <Link href="/tuto/deux-cinq-un"
            className="block bg-gray-800 hover:bg-gray-700 rounded-2xl p-4 transition-colors">
            <p className="text-xs text-gray-500 mb-1">← Précédent</p>
            <p className="font-bold text-white text-sm">⚡ Le II–V–I pour les nuls</p>
          </Link>
          <Link href="/tuto/licks-2-5-1"
            className="block bg-orange-900/20 border border-orange-700/40 hover:bg-orange-900/30 rounded-2xl p-4 transition-colors">
            <p className="text-xs text-orange-400 mb-1">Suivant →</p>
            <p className="font-bold text-white text-sm">🎸 Licks II–V–I — guitaristes célèbres</p>
          </Link>
        </div>

      </div>
    </main>
  );
}
