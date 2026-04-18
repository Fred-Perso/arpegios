import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

const MODES = [
  {
    num: 'I', name: 'Ionien', aka: '= Gamme majeure', root: 'C',
    formula: '1T 1T ½T 1T 1T 1T ½T', notes: 'C D E F G A B',
    chord: 'C△7', intervals: [2,2,1,2,2,2,1],
    color: 'text-amber-300', bg: 'bg-amber-900/20 border-amber-800',
    character: 'Lumineux, stable, "do ré mi". Le point de départ de tout.',
    usage: 'Accords Maj7. La couleur "majeure" pure.',
    jazzContext: 'Sur le I△7 d\'une cadence majeure.',
  },
  {
    num: 'II', name: 'Dorien', aka: '', root: 'D',
    formula: '1T ½T 1T 1T 1T ½T 1T', notes: 'D E F G A B C',
    chord: 'Dm7', intervals: [2,1,2,2,2,1,2],
    color: 'text-blue-300', bg: 'bg-blue-900/20 border-blue-800',
    character: 'Mineur mais moins sombre que l\'éolien grâce à sa 6e majeure.',
    usage: 'Accords m7. Le mode mineur jazz par excellence.',
    jazzContext: 'Sur le IIm7 du II–V–I. Miles Davis, So What.',
  },
  {
    num: 'III', name: 'Phrygien', aka: '', root: 'E',
    formula: '½T 1T 1T 1T ½T 1T 1T', notes: 'E F G A B C D',
    chord: 'Em7', intervals: [1,2,2,2,1,2,2],
    color: 'text-green-300', bg: 'bg-green-900/20 border-green-800',
    character: 'Très sombre, couleur espagnole/flamenca, b2 caractéristique.',
    usage: 'Rarement utilisé en jazz. Plus courant dans la musique espagnole et métal.',
    jazzContext: 'IIIm7, peu utilisé isolément en jazz standard.',
  },
  {
    num: 'IV', name: 'Lydien', aka: '', root: 'F',
    formula: '1T 1T 1T ½T 1T 1T ½T', notes: 'F G A B C D E',
    chord: 'F△7', intervals: [2,2,2,1,2,2,1],
    color: 'text-amber-200', bg: 'bg-amber-900/20 border-amber-700',
    character: 'Majeur avec un #4 (triton). Son "flottant", onirique, films de John Williams.',
    usage: 'Accords Maj7#11. Très apprécié en jazz modal.',
    jazzContext: 'Sur les accords Maj7 "non résolutifs" (ex: IVMaj7).',
  },
  {
    num: 'V', name: 'Mixolydien', aka: '', root: 'G',
    formula: '1T 1T ½T 1T 1T ½T 1T', notes: 'G A B C D E F',
    chord: 'G7', intervals: [2,2,1,2,2,1,2],
    color: 'text-red-300', bg: 'bg-red-900/20 border-red-800',
    character: 'Majeur avec une 7e mineure. Rock, blues, jazz. Son de l\'accord de dominante.',
    usage: 'Accords Dom7. C\'est LA gamme du V7.',
    jazzContext: 'Sur le V7 de toute cadence. Blues en Sol = Sol mixolydien.',
  },
  {
    num: 'VI', name: 'Éolien', aka: '= Mineure naturelle', root: 'A',
    formula: '1T ½T 1T 1T ½T 1T 1T', notes: 'A B C D E F G',
    chord: 'Am7', intervals: [2,1,2,2,1,2,2],
    color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700',
    character: 'Mineur classique, mélancolique. La "gamme mineure" que tout le monde connaît.',
    usage: 'Accords m7. Relatif mineur de la majeure.',
    jazzContext: 'Moins utilisé en jazz que le dorien (à cause du b6).',
  },
  {
    num: 'VII', name: 'Locrien', aka: '', root: 'B',
    formula: '½T 1T 1T ½T 1T 1T 1T', notes: 'B C D E F G A',
    chord: 'Bø7', intervals: [1,2,2,1,2,2,2],
    color: 'text-purple-300', bg: 'bg-purple-900/20 border-purple-800',
    character: 'Le plus instable — b2 ET b5. Sonnerie d\'alarme musicale.',
    usage: 'Accords m7b5 (demi-diminué). Utilisé sur le VIIø7.',
    jazzContext: 'Sur le IIø7 dans une cadence mineure (IIø–V7–Im).',
  },
];

function ModeBar({ intervals }: { intervals: number[] }) {
  let pos = 0;
  const steps: { pos: number; size: number }[] = [];
  for (const iv of intervals) {
    steps.push({ pos, size: iv });
    pos += iv;
  }
  const total = 12;
  return (
    <div className="flex gap-0.5 w-full h-7">
      {steps.map((s, i) => (
        <div key={i}
          style={{ width: `${(s.size / total) * 100}%` }}
          className={`rounded flex items-center justify-center text-[9px] font-bold ${s.size === 1 ? 'bg-red-800 text-red-200' : 'bg-blue-800 text-blue-200'}`}>
          {s.size === 1 ? '½T' : '1T'}
        </div>
      ))}
    </div>
  );
}

export default function ModesPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link href="/tuto" className="text-orange-400 hover:text-orange-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">Les 7 modes de la gamme majeure</h1>
          <p className="text-gray-400 mt-1">Une seule gamme, 7 couleurs — comprendre les modes une bonne fois pour toutes</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">Le principe fondamental</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Les modes ne sont pas 7 gammes différentes à mémoriser séparément.
            Ce sont les <strong className="text-white">7 façons de démarrer une gamme majeure depuis chacune de ses 7 notes</strong>.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 text-sm space-y-2">
            <p className="text-gray-400">La gamme de <span className="text-white font-bold">Do majeur</span> : <span className="font-mono text-orange-300">C D E F G A B</span></p>
            <div className="space-y-1">
              {MODES.map(m => (
                <div key={m.num} className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-gray-500 w-6">{m.num}</span>
                  <span className={`w-20 font-bold ${m.color}`}>{m.name}</span>
                  <span className="text-gray-400">démarrer sur <strong className="text-white">{m.root}</strong></span>
                  <span className="text-gray-600">→ {m.notes}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 pt-2 border-t border-gray-800 text-xs">
              Même réservoir de notes — mais le point de départ change tout : les intervalles se réorganisent, créant une couleur différente.
            </p>
          </div>
        </Box>

        {MODES.map(m => (
          <Box key={m.num} color={`bg-gray-800 border ${m.bg}`}>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-gray-500 font-bold text-lg">{m.num}</span>
              <span className={`text-2xl font-bold ${m.color}`}>{m.name}</span>
              {m.aka && <span className="text-xs text-gray-500 italic">{m.aka}</span>}
              <span className={`ml-auto font-mono font-bold text-lg ${m.color}`}>{m.chord}</span>
            </div>

            <ModeBar intervals={m.intervals} />

            <div className="font-mono text-sm text-gray-300">
              <span className="text-gray-500 text-xs mr-2">Notes (depuis C) :</span>{m.notes}
            </div>
            <div className="font-mono text-xs text-gray-500">
              <span className="mr-2">Intervalles :</span>{m.formula}
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-sm pt-1">
              <div className="bg-gray-900/60 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Caractère</p>
                <p className="text-gray-300 text-xs leading-relaxed">{m.character}</p>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Type d'accord</p>
                <p className="text-gray-300 text-xs leading-relaxed">{m.usage}</p>
              </div>
              <div className="bg-gray-900/60 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">En jazz</p>
                <p className="text-gray-300 text-xs leading-relaxed">{m.jazzContext}</p>
              </div>
            </div>
          </Box>
        ))}

        <Box color="bg-orange-900/20 border border-orange-800">
          <h2 className="text-xl font-bold text-orange-200">Résumé pratique pour l'impro</h2>
          <div className="space-y-2 text-sm">
            {[
              { chord: 'Accord Maj7', mode: 'Ionien (I) ou Lydien (IV)', tip: 'Lydien si tu veux une couleur plus ouverte', color: 'text-amber-300' },
              { chord: 'Accord m7', mode: 'Dorien (II)', tip: 'C\'est le mode mineur jazz par défaut', color: 'text-blue-300' },
              { chord: 'Accord Dom7', mode: 'Mixolydien (V)', tip: 'Pense blues / Rock — ou gamme altérée pour + de tension', color: 'text-red-300' },
              { chord: 'Accord m7b5', mode: 'Locrien (VII)', tip: 'Sur le IIø dans une cadence mineure', color: 'text-purple-300' },
            ].map(r => (
              <div key={r.chord} className="bg-gray-900 rounded-xl p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
                <span className={`font-bold w-32 shrink-0 ${r.color}`}>{r.chord}</span>
                <span className="text-white text-sm flex-1">{r.mode}</span>
                <span className="text-gray-500 text-xs sm:w-52">{r.tip}</span>
              </div>
            ))}
          </div>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Cours suivant : Harmonie majeure →
          </Link>
          <Link href="/tuto/pentatonique"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            La pentatonique →
          </Link>
          <Link href="/"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Ouvrir le visualiseur
          </Link>
        </div>
      </div>
    </main>
  );
}
