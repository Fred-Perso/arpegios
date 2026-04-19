'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'ready' | 'playing' | 'paused';

interface ScoreInfo {
  title: string;
  artist: string;
  album: string;
  tempo: number;
}

interface TrackInfo {
  name: string;
  index: number;
}

export default function GuitarProPage() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const apiRef         = useRef<any>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  const [status,        setStatus]       = useState<Status>('idle');
  const [scoreInfo,     setScoreInfo]    = useState<ScoreInfo | null>(null);
  const [tracks,        setTracks]       = useState<TrackInfo[]>([]);
  const [activeTrack,   setActiveTrack]  = useState(0);
  const [currentBar,    setCurrentBar]   = useState(0);
  const [totalBars,     setTotalBars]    = useState(0);
  const [masterVolume,  setMasterVolume] = useState(100);
  const [initError,     setInitError]    = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let api: any;

    (async () => {
      try {
        const alphaTab = await import('@coderline/alphatab');

        const settings = new alphaTab.Settings();
        // Point to public assets (worker + fonts + soundfont)
        settings.core.scriptFile     = '/alphatab/alphaTab.worker.mjs';
        settings.core.fontDirectory  = '/alphatab/font/';
        settings.player.enablePlayer          = true;
        settings.player.enableCursor          = true;
        settings.player.enableUserInteraction = true;
        settings.player.soundFont             = '/alphatab/soundfont/sonivox.sf2';

        api = new alphaTab.AlphaTabApi(containerRef.current!, settings);
        apiRef.current = api;

        api.scoreLoaded.on((score: any) => {
          setScoreInfo({
            title:  score.title  || 'Sans titre',
            artist: score.artist || '',
            album:  score.album  || '',
            tempo:  score.tempo  ?? 120,
          });
          setTracks(score.tracks.map((t: any, i: number) => ({
            name:  t.name || `Piste ${i + 1}`,
            index: i,
          })));
          setTotalBars(score.masterBars?.length ?? 0);
          setStatus('ready');
        });

        api.playerStateChanged.on((args: any) => {
          // PlayerState enum: 0 = Paused, 1 = Playing
          setStatus(args.state === 1 ? 'playing' : 'paused');
        });

        api.playerPositionChanged.on((args: any) => {
          setCurrentBar((args.currentBeat?.masterBarIndex ?? 0) + 1);
        });

        api.error.on((e: any) => {
          console.error('alphaTab error', e);
          setInitError(`Erreur : ${e?.message ?? String(e)}`);
          setStatus('idle');
        });
      } catch (e: any) {
        setInitError(`Impossible d'initialiser le lecteur : ${e?.message ?? String(e)}`);
      }
    })();

    return () => { try { api?.destroy(); } catch {} };
  }, []);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !apiRef.current) return;
    setStatus('loading');
    setScoreInfo(null);
    setTracks([]);
    setCurrentBar(0);
    setActiveTrack(0);
    const reader = new FileReader();
    reader.onload = evt => {
      apiRef.current.load(evt.target?.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(file);
    // Reset input so the same file can be re-opened
    e.target.value = '';
  }, []);

  function togglePlay() {
    apiRef.current?.playPause();
  }

  function stop() {
    apiRef.current?.stop();
    setStatus('ready');
    setCurrentBar(0);
  }

  function changeTrack(idx: number) {
    if (!apiRef.current) return;
    setActiveTrack(idx);
    apiRef.current.renderTracks([apiRef.current.score.tracks[idx]]);
  }

  function changeMasterVolume(v: number) {
    setMasterVolume(v);
    if (apiRef.current) apiRef.current.masterVolume = v / 100;
  }

  const isPlaying = status === 'playing';
  const hasScore  = status === 'ready' || status === 'playing' || status === 'paused';

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-6 pb-12">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* Header */}
        <div>
          <Link href="/" className="text-orange-400 hover:text-orange-300 text-sm">← Retour</Link>
          <h1 className="text-2xl font-bold mt-2">Lecteur Guitar Pro</h1>
          <p className="text-gray-500 text-xs mt-1">Formats : .gp · .gp3 · .gp4 · .gp5 · .gpx</p>
        </div>

        {/* Controls panel */}
        <div className="bg-gray-800 rounded-2xl p-4 space-y-4">

          {/* Open file row */}
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl text-sm transition-colors shrink-0">
              📂 Ouvrir…
            </button>
            <input ref={fileInputRef} type="file"
              accept=".gp,.gp3,.gp4,.gp5,.gpx"
              onChange={handleFile} className="hidden" />

            {status === 'loading' && (
              <span className="text-sm text-gray-400 animate-pulse">⏳ Chargement…</span>
            )}

            {scoreInfo && (
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{scoreInfo.title}</p>
                <p className="text-xs text-gray-400 truncate">
                  {[scoreInfo.artist, scoreInfo.album].filter(Boolean).join(' — ')}
                  {scoreInfo.tempo > 0 && (
                    <span className="ml-2 text-gray-500">♩ = {scoreInfo.tempo}</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Playback controls */}
          {hasScore && (
            <>
              <div className="flex items-center gap-2 flex-wrap border-t border-gray-700 pt-3">
                <button onClick={togglePlay}
                  className={`px-6 py-2 rounded-xl font-bold text-sm transition-colors min-w-[110px] ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-green-600 hover:bg-green-500 text-white'
                  }`}>
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>

                <button onClick={stop}
                  className="px-4 py-2 rounded-xl font-bold text-sm bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                  ⏹
                </button>

                {totalBars > 0 && (
                  <span className="text-xs text-gray-500 font-mono ml-auto">
                    Mesure <span className="text-white font-bold">{currentBar}</span> / {totalBars}
                  </span>
                )}
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider shrink-0 w-14">Volume</span>
                <input type="range" min={0} max={100} value={masterVolume}
                  onChange={e => changeMasterVolume(+e.target.value)}
                  className="flex-1 max-w-48 accent-orange-500" />
                <span className="text-xs text-gray-500 w-7 text-right">{masterVolume}</span>
              </div>

              {/* Track selector */}
              {tracks.length > 1 && (
                <div className="flex gap-1.5 flex-wrap items-center border-t border-gray-700 pt-3">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider shrink-0 mr-1">Piste</span>
                  {tracks.map(t => (
                    <button key={t.index} onClick={() => changeTrack(t.index)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                        activeTrack === t.index
                          ? 'bg-orange-600 border-orange-500 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {initError && (
            <p className="text-xs text-red-400 border border-red-800 bg-red-900/20 rounded-lg px-3 py-2">
              {initError}
            </p>
          )}
        </div>

        {/* Score display area */}
        {status === 'idle' && !initError && (
          <div className="text-center py-20 text-gray-600 space-y-2">
            <p className="text-5xl">🎸</p>
            <p className="text-sm">Ouvre un fichier Guitar Pro pour afficher la partition</p>
          </div>
        )}

        {/* alphaTab renders here — always in DOM for API init */}
        <div
          ref={containerRef}
          className={`rounded-2xl overflow-hidden bg-white ${status === 'idle' ? 'hidden' : ''}`}
          style={{ minHeight: hasScore ? '400px' : '0' }}
        />

      </div>
    </main>
  );
}
