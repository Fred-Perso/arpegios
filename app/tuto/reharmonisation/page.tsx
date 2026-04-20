import Link from 'next/link';

function Box({ children, color = 'bg-gray-800' }: { children: React.ReactNode; color?: string }) {
  return <div className={`${color} rounded-2xl p-6 space-y-4`}>{children}</div>;
}

function ChordRow({ chords, label }: { chords: { sym: string; color: string; sub?: string }[]; label: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex gap-1.5">
        {chords.map((c, i) => (
          <div key={i} className="flex-1 rounded-lg border text-center py-2 px-1"
            style={{ borderColor: c.color, backgroundColor: c.color + '18' }}>
            <p className="font-mono font-bold text-xs text-white leading-tight">{c.sym}</p>
            {c.sub && <p className="text-[9px] mt-0.5" style={{ color: c.color }}>{c.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

const GRAY = '#6b7280';
const BLUE = '#3b82f6';
const RED  = '#ef4444';
const ORG  = '#f97316';
const IND  = '#6366f1';
const AMB  = '#f59e0b';
const PUR  = '#a855f7';
const GRN  = '#10b981';

export default function ReharmonisationPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <Link href="/tuto" className="text-amber-400 hover:text-amber-300 text-sm">← Retour théorie</Link>
          <h1 className="text-3xl font-bold mt-2">La réharmonisation</h1>
          <p className="text-gray-400 mt-1">Remplacer, enrichir ou transformer les accords d'une grille existante</p>
        </div>

        <Box>
          <h2 className="text-xl font-bold">Qu'est-ce que la réharmonisation ?</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            La réharmonisation consiste à <strong className="text-white">remplacer les accords d'un morceau</strong> par d'autres
            accords qui harmonisent la même mélodie différemment. La mélodie reste identique —
            c'est l'harmonie dessous qui change, modifiant la couleur, la tension, l'émotion.
          </p>
          <div className="bg-gray-900 rounded-xl p-4 text-sm text-gray-400">
            <p className="text-white font-semibold mb-2">Contrainte fondamentale :</p>
            <p>
              Les notes de la mélodie doivent rester compatibles avec le nouvel accord
              (elles doivent être chord tones ou tensions disponibles).
              Si la mélodie tient un C sur un accord, cet accord doit avoir C en fond., 3ce, 5te, 7e ou tension disponible.
            </p>
          </div>
        </Box>

        {/* Technique 1 */}
        <Box color="bg-red-900/15 border border-red-800/30">
          <h2 className="text-xl font-bold">Technique 1 — Substitutions tritoniques</h2>
          <p className="text-gray-300 text-sm">
            Remplacer un V7 par le V7 situé un triton plus bas. Crée un mouvement de basse chromatique.
            (Voir le cours dédié pour le détail.)
          </p>
          <div className="space-y-2">
            <ChordRow label="Original" chords={[
              { sym:'Dm7', color: BLUE },
              { sym:'G7',  color: RED, sub:'V7/I' },
              { sym:'C△7', color: ORG },
            ]}/>
            <ChordRow label="Avec triton sub" chords={[
              { sym:'Dm7', color: BLUE },
              { sym:'Db7', color: IND, sub:'TritSub' },
              { sym:'C△7', color: ORG },
            ]}/>
          </div>
          <p className="text-xs text-gray-500">Basse : D → Db → C (descente chromatique)</p>
        </Box>

        {/* Technique 2 */}
        <Box color="bg-amber-900/15 border border-amber-800/30">
          <h2 className="text-xl font-bold">Technique 2 — Insertion de dominantes secondaires</h2>
          <p className="text-gray-300 text-sm">
            Ajouter un V7/x juste avant n'importe quel accord diatonique pour renforcer son arrivée.
          </p>
          <div className="space-y-2">
            <ChordRow label="Original (4 accords)" chords={[
              { sym:'C△7',  color: ORG },
              { sym:'Am7',  color: BLUE },
              { sym:'Dm7',  color: BLUE },
              { sym:'G7',   color: RED },
            ]}/>
            <ChordRow label="Avec dominantes secondaires (8 accords)" chords={[
              { sym:'C△7',  color: ORG },
              { sym:'E7',   color: RED,  sub:'V7/VI' },
              { sym:'Am7',  color: BLUE },
              { sym:'A7',   color: RED,  sub:'V7/II' },
              { sym:'Dm7',  color: BLUE },
              { sym:'D7',   color: RED,  sub:'V7/V' },
              { sym:'G7',   color: RED },
              { sym:'C△7',  color: ORG },
            ]}/>
          </div>
        </Box>

        {/* Technique 3 */}
        <Box color="bg-purple-900/15 border border-purple-800/30">
          <h2 className="text-xl font-bold">Technique 3 — Substitution diatonique</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Remplacer un accord par un autre accord de la gamme qui partage au moins 2 notes en commun.
            Les substitutions diatoniques classiques :
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-700">
                  <th className="text-left py-2 pr-4">Accord original</th>
                  <th className="text-left py-2 pr-4">Substitut</th>
                  <th className="text-left py-2">Notes communes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300 text-xs">
                {[
                  ['C△7 (I)',  'Em7 (III)',  'E–G–B (3 notes sur 4)'],
                  ['C△7 (I)',  'Am7 (VI)',   'E–G–A (3 notes sur 4)'],
                  ['G7  (V)',  'Bø7 (VII)',  'B–D–F (3 notes sur 4)'],
                  ['Dm7 (II)', 'Fmaj7 (IV)', 'F–A–C (3 notes sur 4)'],
                ].map(([orig, sub, notes]) => (
                  <tr key={orig}>
                    <td className="py-2 pr-4 font-bold text-white">{orig}</td>
                    <td className="py-2 pr-4 text-purple-300 font-bold">{sub}</td>
                    <td className="py-2 text-gray-400">{notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>

        {/* Technique 4 */}
        <Box color="bg-green-900/15 border border-green-800/30">
          <h2 className="text-xl font-bold">Technique 4 — Passing chords (accords de passage)</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Insérer un accord étranger à la tonalité pour créer un mouvement chromatique entre deux accords.
            Ces accords ne durent généralement qu'un ou deux temps.
          </p>
          <div className="space-y-2">
            <ChordRow label="Original" chords={[
              { sym:'C△7', color: ORG },
              { sym:'Am7', color: BLUE },
            ]}/>
            <ChordRow label="Approche chromatique diatonique" chords={[
              { sym:'C△7', color: ORG },
              { sym:'Bm7', color: GRN, sub:'+1/2T' },
              { sym:'Am7', color: BLUE },
            ]}/>
            <ChordRow label="Approche chromatique par dessus" chords={[
              { sym:'C△7', color: ORG },
              { sym:'Bb7', color: AMB, sub:'-1/2T' },
              { sym:'Am7', color: BLUE },
            ]}/>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 text-xs text-gray-400">
            <p className="text-white font-semibold mb-1">Règle de base :</p>
            <p>Un passing chord peut s'approcher de sa cible par demi-ton (chromatique) ou par quinte (diatonique).
            Il peut précéder l'accord cible d'un seul temps — juste assez pour "attirer" l'oreille.</p>
          </div>
        </Box>

        {/* Technique 5 */}
        <Box>
          <h2 className="text-xl font-bold">Technique 5 — Le turnaround</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Le turnaround (ou "oreille") est une séquence qui <strong className="text-white">ramène vers le début du chorus</strong>.
            Il remplace souvent les 2 derniers accords du cycle de 8 ou 32 mesures.
          </p>
          <div className="space-y-2">
            <ChordRow label="Turnaround basique I–VI–II–V" chords={[
              { sym:'C△7', color: ORG,  sub:'I'   },
              { sym:'Am7', color: BLUE, sub:'VI'  },
              { sym:'Dm7', color: BLUE, sub:'II'  },
              { sym:'G7',  color: RED,  sub:'V'   },
            ]}/>
            <ChordRow label="Avec accords secondaires" chords={[
              { sym:'C△7', color: ORG,  sub:'I'       },
              { sym:'E7',  color: RED,  sub:'V7/VI'   },
              { sym:'Am7', color: BLUE, sub:'VI'      },
              { sym:'D7',  color: RED,  sub:'V7/V'    },
              { sym:'G7',  color: RED,  sub:'V'       },
            ]}/>
            <ChordRow label="Turnaround tritonique" chords={[
              { sym:'C△7', color: ORG  },
              { sym:'Eb7', color: IND, sub:'TritVI' },
              { sym:'Dm7', color: BLUE },
              { sym:'Db7', color: IND, sub:'TritV'  },
            ]}/>
          </div>
        </Box>

        {/* Technique 6 */}
        <Box color="bg-indigo-900/15 border border-indigo-800/30">
          <h2 className="text-xl font-bold">Technique 6 — Back-cycling</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Précéder n'importe quel accord d'une chaîne de II–V–I "rétrograde" — on remonte la chaîne
            des quintes vers l'arrière, ajoutant des mini II–V avant l'accord cible.
          </p>
          <div className="space-y-2">
            <ChordRow label="Original : juste C△7" chords={[
              { sym:'C△7', color: ORG },
            ]}/>
            <ChordRow label="Back-cycle 1 cran (II–V ajouté)" chords={[
              { sym:'Dm7', color: BLUE, sub:'II' },
              { sym:'G7',  color: RED,  sub:'V'  },
              { sym:'C△7', color: ORG,  sub:'I'  },
            ]}/>
            <ChordRow label="Back-cycle 2 crans" chords={[
              { sym:'Am7', color: BLUE },
              { sym:'D7',  color: RED  },
              { sym:'Dm7', color: BLUE },
              { sym:'G7',  color: RED  },
              { sym:'C△7', color: ORG  },
            ]}/>
            <ChordRow label="Back-cycle 3 crans" chords={[
              { sym:'Em7', color: BLUE },
              { sym:'A7',  color: RED  },
              { sym:'Am7', color: BLUE },
              { sym:'D7',  color: RED  },
              { sym:'Dm7', color: BLUE },
              { sym:'G7',  color: RED  },
              { sym:'C△7', color: ORG  },
            ]}/>
          </div>
          <p className="text-xs text-gray-500">
            Chaque cran remonte d'une quinte. Coltrane utilise ce principe de façon extrême dans "Giant Steps".
          </p>
        </Box>

        {/* Exemple complet */}
        <Box color="bg-amber-900/20 border border-amber-700/40">
          <h2 className="text-xl font-bold text-amber-200">Exemple complet : réharmoniser Autumn Leaves</h2>
          <p className="text-gray-400 text-xs mb-3">8 premières mesures, tonalité de Sol majeur</p>
          <div className="space-y-3">
            <ChordRow label="Version originale" chords={[
              { sym:'Cm7',  color: BLUE },
              { sym:'F7',   color: RED  },
              { sym:'Bb△7', color: ORG  },
              { sym:'Eb△7', color: ORG  },
              { sym:'Am7b5',color: PUR  },
              { sym:'D7',   color: RED  },
              { sym:'Gm7',  color: BLUE },
              { sym:'—',    color: GRAY },
            ]}/>
            <ChordRow label="+ Triton subs sur les V7" chords={[
              { sym:'Cm7',  color: BLUE },
              { sym:'B7',   color: IND, sub:'trit' },
              { sym:'Bb△7', color: ORG  },
              { sym:'Eb△7', color: ORG  },
              { sym:'Am7b5',color: PUR  },
              { sym:'Ab7',  color: IND, sub:'trit' },
              { sym:'Gm7',  color: BLUE },
              { sym:'—',    color: GRAY },
            ]}/>
            <ChordRow label="+ Passing chord + dominante secondaire" chords={[
              { sym:'Cm9',  color: BLUE },
              { sym:'B7',   color: IND  },
              { sym:'Bb△9', color: ORG  },
              { sym:'A7',   color: RED, sub:'V7/IV' },
              { sym:'Eb△7', color: ORG  },
              { sym:'Am7b5',color: PUR  },
              { sym:'Ab7',  color: IND  },
              { sym:'Gm9',  color: BLUE },
            ]}/>
          </div>
          <p className="text-gray-400 text-xs">
            Comparer les basses : G→F→Bb→Eb vs G→F#→Bb→A→Eb — la version réharmonisée crée plus de mouvement chromatique.
          </p>
        </Box>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link href="/tuto/analyse-standards"
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            Suivant : Analyse de standards →
          </Link>
          <Link href="/tuto/emprunts-modaux"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
            ← Emprunts modaux
          </Link>
        </div>
      </div>
    </main>
  );
}
