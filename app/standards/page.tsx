import Link from 'next/link';

const STANDARDS = [
  {
    href: '/standards/all-of-me',
    title: 'All of Me',
    artist: 'Gerald Marks · Seymour Simons · 1931',
    key: 'Do majeur',
    form: '32 mesures · AABB',
    desc: 'Chaîne de dominantes secondaires. La mélodie suit un cercle de quintes compressé en 16 mesures.',
    color: 'from-amber-900/40 to-amber-800/10',
    border: 'border-amber-800/40',
    badge: 'bg-amber-600',
    accent: '#f59e0b',
    tags: ['Dom. secondaires', 'Emprunt modal'],
  },
  {
    href: '/standards/satin-doll',
    title: 'Satin Doll',
    artist: 'Duke Ellington · Billy Strayhorn · 1953',
    key: 'Do majeur',
    form: '32 mesures · AABA',
    desc: 'II–V enchaînés par tons entiers, substitution tritonique Ab7, bridge en Fa majeur.',
    color: 'from-blue-900/40 to-blue-800/10',
    border: 'border-blue-800/40',
    badge: 'bg-blue-600',
    accent: '#6366f1',
    tags: ['II–V par tons', 'Sub. tritonique', 'alphaTex'],
  },
];

export default function StandardsPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <section className="px-4 pt-14 pb-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-orange-300 uppercase tracking-widest mb-4">
            Analyse de standards
          </div>
          <h1 className="text-3xl font-black text-white">Standards Jazz</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-sm leading-relaxed">
            Partition interactive avec AlphaTab, grille harmonique annotée et analyse fonctionnelle.
          </p>
        </div>

        <div className="space-y-4">
          {STANDARDS.map(s => (
            <Link key={s.href} href={s.href}
              className={`group block rounded-3xl border bg-gradient-to-br p-6 transition-all hover:scale-[1.02] hover:shadow-2xl ${s.color} ${s.border}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-black text-white">{s.title}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{s.artist}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`${s.badge} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                    {s.key}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">{s.form}</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-3">{s.desc}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {s.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 group-hover:text-white transition-colors shrink-0 ml-3">
                  Ouvrir →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
