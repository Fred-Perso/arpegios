'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'ready' | 'playing' | 'paused';

interface ScoreInfo { title: string; artist: string; album: string; tempo: number }
interface TrackInfo { name: string; index: number; muted: boolean; solo: boolean; volume: number }

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}

export default function GuitarProPage() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const apiRef        = useRef<any>(null);
  const fileInputRef  = useRef<HTMLInputElement>(null);

  const [status,       setStatus]      = useState<Status>('idle');
  const [scoreInfo,    setScoreInfo]   = useState<ScoreInfo | null>(null);
  const [tracks,       setTracks]      = useState<TrackInfo[]>([]);
  const [currentBar,   setCurrentBar]  = useState(0);
  const [totalBars,    setTotalBars]   = useState(0);
  const [currentMs,    setCurrentMs]   = useState(0);
  const [totalMs,      setTotalMs]     = useState(0);
  const [initError,    setInitError]   = useState<string | null>(null);

  // Player controls state
  const [volume,       setVolume]      = useState(100);
  const [tempoRatio,   setTempoRatio]  = useState(100);
  const [metronome,    setMetronome]   = useState(false);
  const [countIn,      setCountIn]     = useState(false);
  const [looping,      setLooping]     = useState(false);
  const [zoom,         setZoom]        = useState(1.0);
  const [layout,       setLayout]      = useState<'page'|'horizontal'>('page');
  const [stave,        setStave]       = useState<'score-tab'|'tab'|'score'>('score-tab');
  const [showTracks,   setShowTracks]  = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let api: any;

    (async () => {
      try {
        const alphaTab = await import('@coderline/alphatab');
        const base = window.location.origin;

        const settings = new alphaTab.Settings();
        settings.core.scriptFile             = `${base}/alphatab/alphaTab.js`;
        settings.core.fontDirectory          = `${base}/alphatab/font/`;
        settings.player.enablePlayer          = true;
        settings.player.enableCursor          = true;
        settings.player.enableUserInteraction = true;
        settings.player.soundFont             = `${base}/alphatab/soundfont/sonivox.sf2`;
        settings.display.scale                = 1.0;

        api = new alphaTab.AlphaTabApi(containerRef.current!, settings);
        apiRef.current = api;

        api.scoreLoaded.on((score: any) => {
          setScoreInfo({ title: score.title||'Sans titre', artist: score.artist||'', album: score.album||'', tempo: score.tempo??120 });
          setTracks(score.tracks.map((t: any, i: number) => ({ name: t.name||`Piste ${i+1}`, index: i, muted: false, solo: false, volume: 100 })));
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
          setInitError(`Erreur : ${e?.message ?? String(e)}`);
          setStatus('idle');
        });
      } catch (e: any) {
        setInitError(`Init impossible : ${e?.message ?? String(e)}`);
      }
    })();

    return () => { try { api?.destroy(); } catch {} };
  }, []);

  // ── File loading ─────────────────────────────────────────────────────────────
  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !apiRef.current) return;
    setStatus('loading'); setScoreInfo(null); setTracks([]);
    setCurrentBar(0); setCurrentMs(0); setTotalMs(0);
    const reader = new FileReader();
    reader.onload = evt => apiRef.current.load(evt.target?.result as ArrayBuffer);
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  }, []);

  // ── Transport ─────────────────────────────────────────────────────────────────
  const togglePlay = () => apiRef.current?.playPause();
  const stop       = () => { apiRef.current?.stop(); setStatus('ready'); setCurrentBar(0); setCurrentMs(0); };

  // ── Volume ───────────────────────────────────────────────────────────────────
  function changeVolume(v: number) {
    setVolume(v);
    if (apiRef.current) apiRef.current.masterVolume = v / 100;
  }

  // ── Tempo ────────────────────────────────────────────────────────────────────
  function changeTempo(v: number) {
    setTempoRatio(v);
    if (apiRef.current) apiRef.current.playbackSpeed = v / 100;
  }

  // ── Metronome ────────────────────────────────────────────────────────────────
  function toggleMetronome() {
    const next = !metronome;
    setMetronome(next);
    if (apiRef.current) apiRef.current.metronomeVolume = next ? 1 : 0;
  }

  // ── Count-in ─────────────────────────────────────────────────────────────────
  function toggleCountIn() {
    const next = !countIn;
    setCountIn(next);
    if (apiRef.current) apiRef.current.countInVolume = next ? 1 : 0;
  }

  // ── Loop ─────────────────────────────────────────────────────────────────────
  function toggleLoop() {
    const next = !looping;
    setLooping(next);
    if (apiRef.current) apiRef.current.isLooping = next;
  }

  // ── Zoom ─────────────────────────────────────────────────────────────────────
  function changeZoom(delta: number) {
    const next = Math.min(2, Math.max(0.5, +(zoom + delta).toFixed(1)));
    setZoom(next);
    if (!apiRef.current) return;
    apiRef.current.settings.display.scale = next;
    apiRef.current.updateSettings();
    apiRef.current.render();
  }

  // ── Layout ───────────────────────────────────────────────────────────────────
  function changeLayout(l: 'page'|'horizontal') {
    setLayout(l);
    if (!apiRef.current) return;
    const { LayoutMode } = apiRef.current.settings.display.constructor
      ? { LayoutMode: { Page: 0, Horizontal: 1 } }
      : { LayoutMode: { Page: 0, Horizontal: 1 } };
    apiRef.current.settings.display.layoutMode = l === 'page' ? 0 : 1;
    apiRef.current.updateSettings();
    apiRef.current.render();
  }

  // ── Stave profile ─────────────────────────────────────────────────────────────
  function changeStave(s: 'score-tab'|'tab'|'score') {
    setStave(s);
    if (!apiRef.current) return;
    // StaveProfile: 0=ScoreTab, 1=Score, 2=Tab
    const map: Record<string, number> = { 'score-tab': 0, 'score': 1, 'tab': 2 };
    apiRef.current.settings.display.staveProfile = map[s];
    apiRef.current.updateSettings();
    apiRef.current.render();
  }

  // ── Track controls ───────────────────────────────────────────────────────────
  function toggleMute(idx: number) {
    setTracks(prev => {
      const next = prev.map((t, i) => i === idx ? { ...t, muted: !t.muted } : t);
      if (apiRef.current) apiRef.current.changeTrackMute([apiRef.current.score.tracks[idx]], next[idx].muted);
      return next;
    });
  }

  function toggleSolo(idx: number) {
    setTracks(prev => {
      const next = prev.map((t, i) => i === idx ? { ...t, solo: !t.solo } : t);
      if (apiRef.current) apiRef.current.changeTrackSolo([apiRef.current.score.tracks[idx]], next[idx].solo);
      return next;
    });
  }

  function changeTrackVolume(idx: number, v: number) {
    setTracks(prev => {
      const next = prev.map((t, i) => i === idx ? { ...t, volume: v } : t);
      if (apiRef.current) apiRef.current.changeTrackVolume([apiRef.current.score.tracks[idx]], v / 100);
      return next;
    });
  }

  function renderTrack(idx: number) {
    if (!apiRef.current) return;
    apiRef.current.renderTracks([apiRef.current.score.tracks[idx]]);
  }

  const isPlaying = status === 'playing';
  const hasScore  = status === 'ready' || status === 'playing' || status === 'paused';
  const progress  = totalMs > 0 ? (currentMs / totalMs) * 100 : 0;

  const togBtn = (active: boolean) =>
    `px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
      active ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white'
    }`;

  return (
    <>
    <style>{`
      .at-cursor-bar    { background: rgba(249,115,22,.12) !important; }
      .at-cursor-beat   { background: rgba(249,115,22,.80) !important; width: 3px !important; }
      .at-highlight *   { fill: #f97316 !important; stroke: #f97316 !important; }
      .at-selection div { background: rgba(249,115,22,.20) !important; }
    `}</style>

    <main className="bg-gray-900 text-white flex flex-col" style={{ minHeight: '100dvh' }}>

      {/* ── Top bar ── */}
      <div className="shrink-0 px-4 pt-4 pb-2 space-y-3">
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm shrink-0">← Retour</Link>
          <h1 className="text-lg font-bold">Lecteur Guitar Pro</h1>
          <span className="text-gray-600 text-xs">.gp · .gp3 · .gp4 · .gp5 · .gpx</span>

          <button onClick={() => fileInputRef.current?.click()}
            className="ml-auto px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl text-sm transition-colors shrink-0">
            📂 Ouvrir…
          </button>
          <input ref={fileInputRef} type="file" accept=".gp,.gp3,.gp4,.gp5,.gpx" onChange={handleFile} className="hidden" />
        </div>

        {/* Score meta */}
        {scoreInfo && (
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-white text-sm">{scoreInfo.title}</p>
              {(scoreInfo.artist || scoreInfo.album) && (
                <p className="text-xs text-gray-400">{[scoreInfo.artist, scoreInfo.album].filter(Boolean).join(' — ')}</p>
              )}
            </div>
            {scoreInfo.tempo > 0 && <span className="text-xs text-gray-500 font-mono">♩ = {scoreInfo.tempo}</span>}

            {/* Display controls */}
            <div className="flex items-center gap-1 ml-auto flex-wrap">
              {/* Zoom */}
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1">
                <button onClick={() => changeZoom(-0.1)} className="text-gray-400 hover:text-white text-sm font-bold w-5">−</button>
                <span className="text-[10px] text-gray-400 w-8 text-center">{Math.round(zoom*100)}%</span>
                <button onClick={() => changeZoom(+0.1)} className="text-gray-400 hover:text-white text-sm font-bold w-5">+</button>
              </div>
              {/* Layout */}
              <button onClick={() => changeLayout(layout === 'page' ? 'horizontal' : 'page')}
                className="px-2 py-1 rounded-lg text-[10px] bg-gray-800 border border-gray-600 text-gray-400 hover:text-white transition-all">
                {layout === 'page' ? '↔ Défilé' : '↕ Pages'}
              </button>
              {/* Stave */}
              {(['score-tab','tab','score'] as const).map(s => (
                <button key={s} onClick={() => changeStave(s)}
                  className={`px-2 py-1 rounded-lg text-[10px] border transition-all ${stave === s ? 'bg-orange-700 border-orange-500 text-white' : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white'}`}>
                  {s === 'score-tab' ? '𝄞+Tab' : s === 'tab' ? 'Tab' : '𝄞'}
                </button>
              ))}
              {/* Tracks toggle */}
              {tracks.length > 0 && (
                <button onClick={() => setShowTracks(v => !v)}
                  className={togBtn(showTracks)}>
                  Pistes {showTracks ? '▲' : '▼'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Track panel */}
        {showTracks && tracks.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-3 space-y-2">
            {tracks.map(t => (
              <div key={t.index} className="flex items-center gap-2 flex-wrap">
                <button onClick={() => renderTrack(t.index)}
                  className="text-xs text-gray-300 hover:text-white font-medium min-w-[80px] text-left truncate">{t.name}</button>
                <button onClick={() => toggleMute(t.index)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${t.muted ? 'bg-red-700 border-red-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400 hover:text-white'}`}>M</button>
                <button onClick={() => toggleSolo(t.index)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${t.solo ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400 hover:text-white'}`}>S</button>
                <input type="range" min={0} max={100} value={t.volume}
                  onChange={e => changeTrackVolume(t.index, +e.target.value)}
                  className="flex-1 min-w-[80px] accent-orange-500" />
                <span className="text-[10px] text-gray-500 w-6 text-right">{t.volume}</span>
              </div>
            ))}
          </div>
        )}

        {initError && <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">{initError}</p>}
        {status === 'loading' && <p className="text-sm text-gray-400 animate-pulse">⏳ Chargement de la partition…</p>}
      </div>

      {/* ── Score area ── */}
      <div className="flex-1 overflow-auto px-4" style={{ paddingBottom: hasScore ? 120 : 16 }}>
        {status === 'idle' && !initError && (
          <div className="text-center py-24 text-gray-600 space-y-2">
            <p className="text-5xl">🎸</p>
            <p className="text-sm">Ouvre un fichier Guitar Pro pour afficher la partition</p>
          </div>
        )}
        <div ref={containerRef} className="rounded-2xl overflow-hidden bg-white"
          style={{ minHeight: hasScore ? 400 : 0 }} />
      </div>

      {/* ── Fixed player bar ── */}
      {hasScore && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur border-t border-gray-700 z-50 px-4 py-2 space-y-1.5">

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-mono w-10 shrink-0">{fmt(currentMs)}</span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full transition-all"
                style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[10px] text-gray-500 font-mono w-10 text-right shrink-0">{fmt(totalMs)}</span>
            {totalBars > 0 && (
              <span className="text-[10px] text-gray-600 font-mono shrink-0 w-16 text-right">
                {currentBar}/{totalBars}
              </span>
            )}
          </div>

          {/* Transport + all controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Transport */}
            <button onClick={stop}
              className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center text-sm transition-colors">⏹</button>
            <button onClick={togglePlay}
              className={`w-10 h-8 rounded-lg font-bold text-sm transition-colors flex items-center justify-center ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'
              }`}>
              {isPlaying ? '⏸' : '▶'}
            </button>

            <div className="w-px h-5 bg-gray-700 mx-1 shrink-0" />

            {/* Toggles */}
            <button onClick={toggleLoop}     className={togBtn(looping)}>🔁 Boucle</button>
            <button onClick={toggleMetronome} className={togBtn(metronome)}>♩ Métro</button>
            <button onClick={toggleCountIn}  className={togBtn(countIn)}>123</button>

            <div className="w-px h-5 bg-gray-700 mx-1 shrink-0" />

            {/* Volume */}
            <span className="text-[10px] text-gray-500 shrink-0">🔊</span>
            <input type="range" min={0} max={100} value={volume}
              onChange={e => changeVolume(+e.target.value)}
              className="w-20 accent-orange-500 shrink-0" />
            <span className="text-[10px] text-gray-500 w-6 shrink-0">{volume}</span>

            {/* Tempo */}
            <span className="text-[10px] text-gray-500 shrink-0">⚡</span>
            <input type="range" min={25} max={200} value={tempoRatio}
              onChange={e => changeTempo(+e.target.value)}
              className="w-20 accent-orange-500 shrink-0" />
            <span className="text-[10px] text-gray-500 w-8 shrink-0">{tempoRatio}%</span>
          </div>
        </div>
      )}

    </main>
    </>
  );
}
