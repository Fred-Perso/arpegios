'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'ready' | 'playing' | 'paused';

// ── AlphaTex helpers ─────────────────────────────────────────────────────────
// String numbering: 1=high e (E4), 2=B3, 3=G3, 4=D3, 5=A2, 6=E2
// TripletFeel.Triplet8th = 2 dans AlphaTab 1.8.x  → \tf 2 par mesure = croches ternaires (swing)
// \tf 2 = TripletFeel.Triplet8th (swing 8ths) — directive de mesure dans AlphaTab 1.8.x
const SW = '\\tf 2 ';
const tex = (bpm: number, b1: string, b2: string, b3: string) =>
  `\\tempo ${bpm}\n.\n${SW}:8 ${b1} | ${SW}:8 ${b2} | ${SW}:1 ${b3}`;

// ── Types ────────────────────────────────────────────────────────────────────
interface Phrase {
  num: number;
  title: string;
  description: string;
  techniques: string[];
  harmonyNotes: string;
  tex: string;
}
interface Guitarist {
  id: string;
  name: string;
  years: string;
  style: string;
  level: string;
  tempo: number;
  color: string;
  border: string;
  accent: string;
  badge: string;
  listening: string;
  phrases: Phrase[];
}

// ── Data: 5 guitarists × 5 phrases ──────────────────────────────────────────
// Tonalité: Dm7 (mes.1) → G7 (mes.2) → CMaj7 (mes.3, note de résolution)
// Cordage: 1=E4·2=B3·3=G3·4=D3·5=A2·6=E2
const GUITARISTS: Guitarist[] = [
  {
    id: 'joe-pass',
    name: 'Joe Pass',
    years: '1929–1994',
    style: 'Bebop lyrique · guide tones',
    level: 'Intermédiaire',
    tempo: 160,
    color: 'bg-orange-900/20',
    border: 'border-orange-700/50',
    accent: 'text-orange-400',
    badge: 'bg-orange-600',
    listening: 'Virtuoso (1973) · For Django (1964)',
    phrases: [
      {
        num: 1, title: 'Guide tones — descente G7',
        description: "Ligne la plus caractéristique de Joe Pass : montée de l'arpège Dm7 avec un Bb chromatique de passage, puis descente du G7 en ciblant successivement la 3ce (B3) et la 7e (F3) — les deux guide tones essentiels.",
        techniques: ['Arpège Dm7 + Bb chromatique', 'Guide tone B3 (3ce G7)', 'Guide tone F3 (7e G7)', 'Résolution sur C4'],
        harmonyNotes: 'Dm7: F–A–C (arpège) · G7: E–D–B–G–F (guide tones) · CMaj7: C',
        tex: tex(160,
          '6.2 5.1 8.1 6.1 5.1 3.1 0.1 6.2',   // F4 A4 C5 Bb4 A4 G4 E4 F4
          '0.1 3.2 4.3 5.4 3.4 2.3 4.3 3.2',   // E4 D4 B3 G3 F3 A3 B3 D4
          '5.3'),                                // C4
      },
      {
        num: 2, title: 'Arpège D→C5 + descente Bb–G',
        description: "Montée jusqu'au C5 sur le Dm7 — le plus haut point de la phrase — puis belle descente chromatique sur G7 de F4 jusqu'à G3, avec le Bb3 comme note de passage avant de rebondir sur B3 (guide tone). Très Joe Pass dans les années 70.",
        techniques: ['Montée D4→B4→C5 (peak)', 'Bb3 chromatique (passage)', 'Descente guide tone G7', 'B3 final (3ce G7) → résolution'],
        harmonyNotes: 'Dm7: D–F–A–B–C (arpège étendu) · G7: F–D–C–B–Bb–A–G–B · CMaj7: C',
        tex: tex(160,
          '3.2 6.2 5.1 7.1 8.1 5.1 3.1 0.1',   // D4 F4 A4 B4 C5 A4 G4 E4
          '6.2 3.2 5.3 4.3 8.4 7.4 5.4 4.3',   // F4 D4 C4 B3 Bb3 A3 G3 B3
          '5.3'),                                // C4
      },
      {
        num: 3, title: 'Descente chromatique G7 basse',
        description: "Phrase qui explore le registre grave : après une ascension classique Dm7, le G7 descend par demi-tons (Ab3 chromatique) jusqu'à B2, et résout sur le grave C3. Très typique des phrases Joe Pass en solo.",
        techniques: ['Ascension diatonique Dm7', 'Ab3 chromatique (b13 de G7)', 'Descente par demi-tons', 'Résolution C3 grave'],
        harmonyNotes: 'Dm7: C–D–F–A (guide tones + gamme) · G7: D–B–Ab–G–F–E–D–B (chromatic) · CMaj7: C3',
        tex: tex(160,
          '5.3 7.3 6.2 5.1 3.1 0.1 3.2 6.2',   // C4 D4 F4 A4 G4 E4 D4 F4
          '3.2 4.3 6.4 5.4 3.4 2.4 0.4 2.5',   // D4 B3 Ab3 G3 F3 E3 D3 B2
          '3.5'),                                // C3
      },
      {
        num: 4, title: 'Encadrement B3 avec Ab3',
        description: "Phrase de style 'turnaround' : le Dm7 descend de F4 jusqu'à D4 puis remonte par B3–C4 (anticipation de G7). Le G7 utilise un encadrement Ab3–G3 avant de remonter sur B3 — la 3ce, guide tone central.",
        techniques: ['Encadrement B3 sur Dm7 (anticipation)', 'Ab3 approche chromatique de G3', 'Encadrement G3–B3 (root→3ce G7)', 'Résolution directe C4'],
        harmonyNotes: 'Dm7: F–E–D–C–A (descente) + B–C–D (retour) · G7: B–C–A–G–F–Ab–G–B · CMaj7: C',
        tex: tex(160,
          '6.2 5.2 3.2 5.3 2.3 4.3 5.3 7.3',   // F4 E4 D4 C4 A3 B3 C4 D4
          '4.3 5.3 2.3 5.4 3.4 6.4 5.4 4.3',   // B3 C4 A3 G3 F3 Ab3 G3 B3
          '5.3'),                                // C4
      },
      {
        num: 5, title: 'Sommet A4→C5 + Eb4 couleur',
        description: "Phrase en arc : le Dm7 monte vers A4–C5 (sommet expressif), puis redescend élégamment. Sur le G7, la 13e bémol (Eb4) donne une couleur altered/extérieure caractéristique, avant une belle résolution grave sur C3.",
        techniques: ['Arc ascendant A4→C5 sur Dm7', 'Eb4 = b13 de G7 (altered)', 'Descente vers registre grave', 'Résolution C3 (basse)'],
        harmonyNotes: 'Dm7: A–C–B–A–F–E–D–F · G7: A–G–F–Eb (b13)–D–B–G–D · CMaj7: C3',
        tex: tex(160,
          '5.1 8.1 7.1 5.1 6.2 5.2 3.2 6.2',   // A4 C5 B4 A4 F4 E4 D4 F4
          '5.1 3.1 6.2 4.2 3.2 4.3 5.4 5.5',   // A4 G4 F4 Eb4 D4 B3 G3 D3
          '3.5'),                                // C3
      },
    ],
  },
  {
    id: 'wes-montgomery',
    name: 'Wes Montgomery',
    years: '1923–1968',
    style: 'Bebop chantant · arpèges larges',
    level: 'Intermédiaire',
    tempo: 176,
    color: 'bg-blue-900/20',
    border: 'border-blue-700/50',
    accent: 'text-blue-400',
    badge: 'bg-blue-600',
    listening: 'Full House (1962) · Smokin\' at the Half Note (1965)',
    phrases: [
      {
        num: 1, title: 'Arpège Dm7 complet + Ab chromatique',
        description: "La ligne la plus représentative de Wes : arpège complet D–F–A–C joué en montée puis retour, et sur G7 le chromatisme Ab→G est sa signature. La résolution C4 est directe et confiante.",
        techniques: ['Arpège Dm7 D–F–A–C–A–F', 'Eb4/E4 couleur descendante', 'Ab4 chromatique sur V7', 'Résolution 3ce→R (D→C)'],
        harmonyNotes: 'Dm7: D–F–A–C (arpège) · G7: B–D–F–A–Ab–G–E–D · CMaj7: C',
        tex: tex(176,
          '3.2 6.2 5.1 8.1 5.1 6.2 5.2 3.2',   // D4 F4 A4 C5 A4 F4 E4 D4
          '4.3 3.2 6.2 5.1 4.1 3.1 0.1 3.2',   // B3 D4 F4 A4 Ab4 G4 E4 D4
          '5.3'),                                // C4
      },
      {
        num: 2, title: 'Registre médium, arc lyrique',
        description: "Phrase dans le registre médium, très vocale. Le Dm7 monte doucement puis retourne, et sur G7, Wes monte vers G4 (quinte) puis redescend en ciblant B3–C4 (encadrement de la résolution). La résolution sur G3 (quinte de CMaj7) est caractéristique.",
        techniques: ['Arc Dm7 médium (A3→F4→A3)', 'Montée sur G7 vers G4', 'Encadrement B3–C4 de la résolution', 'Résolution 5te (G3)'],
        harmonyNotes: 'Dm7: A–C–D–F–D–C–A–G · G7: B–D–G–F–E–D–B–C · CMaj7: G3 (5te)',
        tex: tex(176,
          '2.3 5.3 7.3 6.2 7.3 5.3 2.3 5.4',   // A3 C4 D4 F4 D4 C4 A3 G3
          '4.3 3.2 3.1 6.2 5.2 3.2 4.3 5.3',   // B3 D4 G4 F4 E4 D4 B3 C4
          '5.4'),                                // G3
      },
      {
        num: 3, title: 'Grand saut D3→A4 (registre large)',
        description: "Phrase avec un grand saut expressif de D3 (grave) directement à A3, puis montée jusqu'à A4 — l'intervalle large que Wes adorait. Sur G7, un Ab3 chromatique apporte de la couleur avant les notes de résolution.",
        techniques: ['Grand saut D3→A3 (septième)','Montée jusqu\'à A4 (large ambitus)', 'Ab3 = b13 de G7', 'Résolution directe C4'],
        harmonyNotes: 'Dm7: D3 (saut)–A3–D4–F4–A4–F4–E4–D4 · G7: B3–Ab3–G3–D4–B3–G3–F3–B3 · CMaj7: C',
        tex: tex(176,
          '5.5 2.3 3.2 6.2 5.1 6.2 5.2 3.2',   // D3 A3 D4 F4 A4 F4 E4 D4
          '4.3 6.4 5.4 3.2 4.3 5.4 3.4 4.3',   // B3 Ab3 G3 D4 B3 G3 F3 B3
          '5.3'),                                // C4
      },
      {
        num: 4, title: 'Descente Eb4 blues + Bb3',
        description: "Phrase avec une inflexion blues sur Dm7 : l'Eb4 donne une couleur plaintive avant de monter. Sur G7, le Bb3 (tierce bémol de G) crée une tension avant la résolution sur G3 puis C4.",
        techniques: ['Eb4 blues (b3 de C)', 'Montée vers C5 (pic de phrase)', 'Bb3 chromatique sur G7', 'Résolution via F3–G3–C4'],
        harmonyNotes: 'Dm7: F–Eb–D–C–A–B–C–E · G7: D–B–C–A–Bb–G–F–G · CMaj7: C',
        tex: tex(176,
          '6.2 4.2 3.2 5.3 2.3 4.3 5.3 0.1',   // F4 Eb4 D4 C4 A3 B3 C4 E4
          '3.2 4.3 5.3 2.3 8.4 5.4 3.4 5.4',   // D4 B3 C4 A3 Bb3 G3 F3 G3
          '5.3'),                                // C4
      },
      {
        num: 5, title: 'Arc descendant C5→G3 + remontée G7',
        description: "Belle phrase en forme de 'U' inversé : le Dm7 descend de C5 jusqu'à G3 progressivement, puis le G7 remonte vers F4 avant de redescendre sur B3 — la 3ce, guide tone final. Résolution élégante sur C4.",
        techniques: ['Descente C5→G3 sur Dm7', 'Remontée F3→A3→B3→D4→F4 sur G7', 'Cible B3 (3ce G7) à la résolution', 'Forme en U inversé'],
        harmonyNotes: 'Dm7: C5–A4–F4–D4–C4–B3–A3–G3 · G7: F3–A3–B3–D4–F4–E4–D4–B3 · CMaj7: C',
        tex: tex(176,
          '8.1 5.1 6.2 3.2 5.3 4.3 2.3 5.4',   // C5 A4 F4 D4 C4 B3 A3 G3
          '3.4 7.4 4.3 3.2 6.2 0.1 3.2 4.3',   // F3 A3 B3 D4 F4 E4 D4 B3
          '5.3'),                                // C4
      },
    ],
  },
  {
    id: 'pat-martino',
    name: 'Pat Martino',
    years: '1944–2021',
    style: 'Bebop chromatique · encadrements',
    level: 'Avancé',
    tempo: 200,
    color: 'bg-purple-900/20',
    border: 'border-purple-700/50',
    accent: 'text-purple-400',
    badge: 'bg-purple-600',
    listening: 'East! (1968) · El Hombre (1967)',
    phrases: [
      {
        num: 1, title: 'Encadrement C#→D + descente chromatique G7',
        description: "Ligne bebop dure : l'encadrement C#4→D4 attaque la fondamentale du Dm7, le G#4 est une note de passage vers A4, puis le G7 descend chromatiquement A4–Ab–G–F–E–Eb–D jusqu'au B3, guide tone de résolution.",
        techniques: ['Encadrement chromatique C#→D', 'G#4 passage (chromatique entre G et A)', 'Gamme bebop dominante descendante', 'Cible B3 (3ce G7)'],
        harmonyNotes: 'Dm7: C#–D–F–G#–A–C–B–Bb · G7: A–Ab–G–F–E–Eb–D–B (bebop scale) · CMaj7: C',
        tex: tex(200,
          '2.2 3.2 6.2 4.1 5.1 8.1 7.1 6.1',   // C#4 D4 F4 Ab4 A4 C5 B4 Bb4
          '5.1 4.1 3.1 6.2 0.1 4.2 3.2 4.3',   // A4 Ab4 G4 F4 E4 Eb4 D4 B3
          '5.3'),                                // C4
      },
      {
        num: 2, title: 'Arpège dim7 sur G7 (Bdim7)',
        description: "Technique martino : sur le G7, utiliser l'arpège de Bdim7 (B–D–F–Ab) qui est l'arpège de G7 sans la fondamentale. Monte jusqu'à D5 (altissimo) puis redescend. Pat Martino adorait les arpeggios de diminués pour couvrir les dominantes.",
        techniques: ['Arpège Dm7 étendu (D→D5)', 'Arpège Bdim7 sur G7 (= G7 sans R)', 'Registre altissimo D5', 'Résolution haute C5'],
        harmonyNotes: 'Dm7: D–F–A–C–D5 (arpège étendu) · G7: B–D–F–Ab–B–Ab–G–F (Bdim7) · CMaj7: C5',
        tex: tex(200,
          '3.2 6.2 5.1 8.1 10.1 8.1 6.1 5.1',  // D4 F4 A4 C5 D5 C5 Bb4 A4
          '4.3 3.2 6.2 4.1 7.1 4.1 3.1 6.2',   // B3 D4 F4 Ab4 B4 Ab4 G4 F4
          '8.1'),                                // C5
      },
      {
        num: 3, title: 'Substitution tritonique Db7 sur G7',
        description: "Ligne très avancée : sur le G7, Martino joue l'arpège de Db7 (C#–F–Ab–B) — la substitution tritonique. Le F et le B sont les guide tones partagés. La montée Db–F–Ab–B sonne 'outside' puis résout 'inside' sur G3–C.",
        techniques: ['Descente Dm7 vers Bb3', 'Arpège Db7 sur G7 (triton sub)', 'C#–F–Ab–B : guide tones partagés', 'Résolution inside via G3'],
        harmonyNotes: 'Dm7: A–G–F–D–C–Bb–A–C · G7: Db(C#)–F–Ab–B–F–Db–B–G (Db7 arpège) · CMaj7: C',
        tex: tex(200,
          '5.1 3.1 6.2 3.2 5.3 8.4 2.3 5.3',   // A4 G4 F4 D4 C4 Bb3 A3 C4
          '2.2 6.2 4.1 7.1 6.2 2.2 4.3 5.4',   // C#4 F4 Ab4 B4 F4 C#4 B3 G3
          '5.3'),                                // C4
      },
      {
        num: 4, title: 'Gamme bebop ascendante + descente G7',
        description: "Ligne bebop pure : montée complète E–F–G–A–Bb–C–D sur Dm7, atteignant D5, puis descente chromatique rapide sur G7 de B4 jusqu'à B3 — une cascade bebop dense caractéristique de Pat Martino à tempo élevé.",
        techniques: ['Gamme ascendante sur Dm7 (E→D5)', 'Bb4 comme note de passage (b13 de C)', 'Descente B4–A–Ab–G–F–E–D–B (bebop)', 'Ligne continue, pas de respiration'],
        harmonyNotes: 'Dm7: E–F–G–A–Bb–C–D5 (gamme + passage) · G7: B4–A–Ab–G–F–E–D–B3 · CMaj7: C',
        tex: tex(200,
          '5.2 6.2 3.1 5.1 6.1 8.1 10.1 8.1',  // E4 F4 G4 A4 Bb4 C5 D5 C5
          '7.1 5.1 4.1 3.1 6.2 5.2 3.2 4.3',   // B4 A4 Ab4 G4 F4 E4 D4 B3
          '5.3'),                                // C4
      },
      {
        num: 5, title: 'Encadrement C→D + Ab3–G3 cordes graves',
        description: "Phrase utilisant les cordes graves : encadrement C–C#–D sur Dm7 (approche chromatique de D), puis descente jusqu'à la corde de sol à vide (G3), et sur G7 remontée chromatique Ab–G–F3 avant D4–F4 final.",
        techniques: ['Encadrement C–C#–D (approche par le bas)', 'Ab3 sur G3 (cordes graves)', 'G3 à vide (corde 3)', 'Remontée chromatique G7 vers F4'],
        harmonyNotes: 'Dm7: C–C#–D–F–C–B–A–Bb · G7: A–Ab–G3–F3–C4–B3–D4–F4 · CMaj7: C',
        tex: tex(200,
          '5.3 6.3 7.3 6.2 5.3 4.3 2.3 3.3',   // C4 C#4 D4 F4 C4 B3 A3 Bb3
          '2.3 1.3 0.3 3.4 5.3 4.3 7.3 6.2',   // A3 Ab3 G3 F3 C4 B3 D4 F4
          '5.3'),                                // C4
      },
    ],
  },
  {
    id: 'john-scofield',
    name: 'John Scofield',
    years: '1951–',
    style: 'Jazz-blues moderne · dehors/dedans',
    level: 'Avancé',
    tempo: 138,
    color: 'bg-green-900/20',
    border: 'border-green-700/50',
    accent: 'text-green-400',
    badge: 'bg-green-600',
    listening: 'Pick Hits Live (1990) · Hand Jive (1994)',
    phrases: [
      {
        num: 1, title: 'Blue note Eb + résolution grave',
        description: "Sco intègre le blues dans son bebop. L'Eb4 (tierce blues) sur Dm7 crée une tension plaintive, et la résolution arrive en registre grave (C3). La descente stepwise du G7 jusqu'à B2 est typique de son style 'épuré qui balance'.",
        techniques: ['Eb4 = blue note (b3 de C)', 'Montée vers C5 (pic)', 'Descente stepwise G7 registre grave', 'Résolution C3 (basse)'],
        harmonyNotes: 'Dm7: F–A–G–F–Eb (blue)–F–A–C · G7: B–C–A–G–F–E–D–B2 · CMaj7: C3',
        tex: tex(138,
          '6.2 5.1 3.1 6.2 4.2 6.2 5.1 8.1',   // F4 A4 G4 F4 Eb4 F4 A4 C5
          '4.3 5.3 2.3 5.4 3.4 2.4 0.4 2.5',   // B3 C4 A3 G3 F3 E3 D3 B2
          '3.5'),                                // C3
      },
      {
        num: 2, title: '"Outside" chromatique — F→Ab→A',
        description: "Phrase 'outside/inside' typique de Scofield : sur Dm7, il glisse chromatiquement de F4 vers Ab4 puis A4 (outside→inside). Sur G7, Eb4 (note très extérieure sur G7) avant la résolution guide tone B3–C4 (inside). Tension délibérée.",
        techniques: ['Glissade chromatique F→Ab→A (outside)', 'Eb4 = b6 de G7 (très outside)', 'Résolution guide tone B3 (inside)', 'Dynamique dehors/dedans'],
        harmonyNotes: 'Dm7: F–G–Ab–A (chrom.)–G–F–Eb–D · G7: F–E–Eb–D–B3–C4–B3–G3 · CMaj7: C',
        tex: tex(138,
          '6.2 3.1 4.1 5.1 3.1 6.2 4.2 3.2',   // F4 G4 Ab4 A4 G4 F4 Eb4 D4
          '6.2 5.2 4.2 3.2 4.3 5.3 4.3 5.4',   // F4 E4 Eb4 D4 B3 C4 B3 G3
          '5.3'),                                // C4
      },
      {
        num: 3, title: 'Gamme + Bb4 couleur modale',
        description: "Phrase modale/jazz-rock : montée diatonique C–D–E–F–G–A–Bb–A sur Dm7 (le Bb4 donne une couleur mixolydienne), puis descente G–F–E–D–C–B–Bb–G sur G7. Scofield influencé par Miles Davis et la fusion.",
        techniques: ['Gamme ascendante avec Bb4 (modal)', 'Bb4 = 7e de C (couleur fusion)', 'Descente diatonique G7', 'Bb3 sur G7 (b3 de G)'],
        harmonyNotes: 'Dm7: C–D–E–F–G–A–Bb–A · G7: G–F–E–D–C–B–Bb–G3 · CMaj7: C',
        tex: tex(138,
          '5.3 7.3 0.1 6.2 3.1 5.1 6.1 5.1',   // C4 D4 E4 F4 G4 A4 Bb4 A4
          '3.1 6.2 0.1 3.2 5.3 4.3 8.4 5.4',   // G4 F4 E4 D4 C4 B3 Bb3 G3
          '5.3'),                                // C4
      },
      {
        num: 4, title: 'Pentatonique + approche chromatique',
        description: "Scofield est un grand utilisateur de la pentatonique. Ici, phrase pentatonique A–G–F–D sur Dm7, puis sur G7 une ligne D–F–E–D–B–Bb–A–G3 qui mélange pentatonique et chromatisme (Bb = approche de A ou couleur blues).",
        techniques: ['Pentatonique mineure sur Dm7', 'Mélange penta + chromatique G7', 'Bb3 = blue note G7 (b3)', 'Résolution C3 grave'],
        harmonyNotes: 'Dm7: A4–G–F–D–A3–C–D–F · G7: D–F–E–D–B–Bb–A–G3 · CMaj7: C3',
        tex: tex(138,
          '5.1 3.1 6.2 3.2 2.3 5.3 7.3 6.2',   // A4 G4 F4 D4 A3 C4 D4 F4
          '3.2 6.2 5.2 3.2 4.3 8.4 2.3 5.4',   // D4 F4 E4 D4 B3 Bb3 A3 G3
          '3.5'),                                // C3
      },
      {
        num: 5, title: 'Montée Bb4 + long descente modale',
        description: "Ligne ample : montée jusqu'à Bb4 sur Dm7 (note de tension), puis longue descente G7 de F4 jusqu'à E3 par mouvement conjoint. La résolution grave sur C3 donne un sentiment d'accomplissement. Style caractéristique de Scofield à tempo modéré.",
        techniques: ['Montée jusqu\'à Bb4 (couleur mixte)', 'Longue descente conjointe G7', 'Ambitus large F4→E3', 'Résolution grave C3'],
        harmonyNotes: 'Dm7: D–F–G–A–C–Bb–A–G · G7: F–E–D–B–C–A–G–E3 · CMaj7: C3',
        tex: tex(138,
          '3.2 6.2 3.1 5.1 8.1 6.1 5.1 3.1',   // D4 F4 G4 A4 C5 Bb4 A4 G4
          '6.2 0.1 3.2 4.3 5.3 2.3 5.4 7.5',   // F4 E4 D4 B3 C4 A3 G3 E3
          '3.5'),                                // C3
      },
    ],
  },
  {
    id: 'grant-green',
    name: 'Grant Green',
    years: '1935–1979',
    style: 'Bebop épuré · guide tones purs',
    level: 'Intermédiaire',
    tempo: 152,
    color: 'bg-teal-900/20',
    border: 'border-teal-700/50',
    accent: 'text-teal-400',
    badge: 'bg-teal-600',
    listening: 'Idle Moments (1963) · Grant\'s First Stand (1961)',
    phrases: [
      {
        num: 1, title: 'Arpège Dm7 depuis la 5te',
        description: "Grant Green construisait toujours ses lignes sur les arpeggios. Ici, le Dm7 est joué depuis la 5te (A3) — pas la fondamentale — pour une sonorité plus ouverte. Sur G7, les guide tones B3 et F3 sont ciblés sans détour.",
        techniques: ['Dm7 depuis la 5te (A3)', 'Ascension A3→C4→D→F→A→G→F', 'Cible B3 (3ce G7) puis F3 (7e)', 'Descente diatonique propre'],
        harmonyNotes: 'Dm7: A3–C–D–F–A–G–F–E · G7: D–B (3ce)–C–A–G–F (7e)–E–D3 · CMaj7: C3',
        tex: tex(152,
          '2.3 5.3 7.3 6.2 5.1 3.1 6.2 5.2',   // A3 C4 D4 F4 A4 G4 F4 E4
          '3.2 4.3 5.3 2.3 5.4 3.4 2.4 0.4',   // D4 B3 C4 A3 G3 F3 E3 D3
          '3.5'),                                // C3
      },
      {
        num: 2, title: 'Dm7 registre grave + guide tones G7',
        description: "Phrase dans les graves : le Dm7 est joué en position basse (D3 sur la corde A), arpège D–F–A–D montant, puis retour. Sur G7, guide tones purs : B3–G3–D4–B3–G3–F3–G3 — Grant Green ciblait toujours B et F sur les dominantes.",
        techniques: ['Dm7 en position grave (D3)', 'Large arpège D3→D4', 'Guide tones B3–G3 sur G7', 'Répétition B3 (insistance sur guide tone)'],
        harmonyNotes: 'Dm7: D3–F3–A3–D4–F4–A4–F4–D4 · G7: B3–G3–D4–B3–G3–F3–G3–B3 · CMaj7: C',
        tex: tex(152,
          '5.5 8.5 7.4 3.2 6.2 5.1 6.2 3.2',   // D3 F3 A3 D4 F4 A4 F4 D4
          '4.3 5.4 3.2 4.3 5.4 3.4 5.4 4.3',   // B3 G3 D4 B3 G3 F3 G3 B3
          '5.3'),                                // C4
      },
      {
        num: 3, title: 'Ligne bebop descendante propre',
        description: "Phrase bebop 'textbook' de Grant Green : C5 en ouverture comme note de tension, descend régulièrement sur Dm7, puis G7 descend par les degrés de la gamme de Do jusqu'à D3. Pas de chromatisme — que du bebop pur et propre.",
        techniques: ['Ouverture sur C5 (tension)', 'Descente diatonique Dm7', 'G7 par les degrés de gamme', 'Long descente G7 jusqu\'au grave'],
        harmonyNotes: 'Dm7: C5–A–F–D–E–F–A–C5 · G7: B4–G–F–D–B3–G–F–D3 · CMaj7: C',
        tex: tex(152,
          '8.1 5.1 6.2 3.2 0.1 6.2 5.1 8.1',   // C5 A4 F4 D4 E4 F4 A4 C5
          '7.1 3.1 6.2 3.2 4.3 5.4 3.4 5.5',   // B4 G4 F4 D4 B3 G3 F3 D3
          '5.3'),                                // C4
      },
      {
        num: 4, title: 'Arpège Dm7 large + G7 arpège',
        description: "Grant Green adorait les arpeggios larges. Ici, Dm7 en arpège large F4–D4–A3–F3 (descendant) puis remontée, et G7 joué comme un arpège de Gmaj (G3–B3–D4–F4) puis redescente. Sonne très 'classique jazz'.",
        techniques: ['Dm7 arpège large descendant F4→F3', 'Retour arpège ascendant', 'G7 arpège G3→B3→D4→F4', 'Résolution directe C4'],
        harmonyNotes: 'Dm7: F4–D4–A3–F3–A3–C4–D4–F4 · G7: G3–B3–D4–F4–D4–B3–G3–F3 · CMaj7: C',
        tex: tex(152,
          '6.2 3.2 2.3 8.5 2.3 5.3 7.3 6.2',   // F4 D4 A3 F3 A3 C4 D4 F4
          '5.4 4.3 3.2 6.2 3.2 4.3 5.4 3.4',   // G3 B3 D4 F4 D4 B3 G3 F3
          '5.3'),                                // C4
      },
      {
        num: 5, title: 'Gamme ascendante + descente totale G7',
        description: "Phrase pédagogique par excellence : montée complète E–F–G–A–Bb–A–G–F sur Dm7 avec Bb4 chromatique, puis descente totale et conjointe du G7 de E4 jusqu'à E3 — exactement une octave. Très Grant Green, très lisible.",
        techniques: ['Montée gamme mixolydienne (Bb4 passage)', 'Descente complète G7 sur une octave', 'Mouvement conjoint pur', 'Résolution C3'],
        harmonyNotes: 'Dm7: E–F–G–A–Bb–A–G–F · G7: E4–D–C–B–A–G–F–E3 · CMaj7: C3',
        tex: tex(152,
          '0.1 6.2 3.1 5.1 6.1 5.1 3.1 6.2',   // E4 F4 G4 A4 Bb4 A4 G4 F4
          '0.1 3.2 5.3 4.3 2.3 5.4 3.4 2.4',   // E4 D4 C4 B3 A3 G3 F3 E3
          '3.5'),                                // C3
      },
    ],
  },
];

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function LicksPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef       = useRef<any>(null);

  const [guitaristId, setGuitaristId] = useState(GUITARISTS[0].id);
  const [phraseNum,   setPhraseNum]   = useState(1);
  const [status,      setStatus]      = useState<Status>('idle');
  const [currentMs,   setCurrentMs]   = useState(0);
  const [totalMs,     setTotalMs]     = useState(0);
  const [volume,      setVolume]      = useState(85);
  const [speed,       setSpeed]       = useState(100);
  const [looping,     setLooping]     = useState(false);
  const [stave,       setStave]       = useState<'score-tab' | 'tab' | 'score'>('score-tab');
  const [showInfo,    setShowInfo]    = useState(true);
  const [initError,   setInitError]   = useState<string | null>(null);

  const guitarist = GUITARISTS.find(g => g.id === guitaristId)!;
  const phrase    = guitarist.phrases.find(p => p.num === phraseNum)!;
  const hasScore  = status === 'ready' || status === 'playing' || status === 'paused';
  const progress  = totalMs > 0 ? (currentMs / totalMs) * 100 : 0;

  // ── AlphaTab init ──────────────────────────────────────────────────────────
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
        settings.display.scale                = 0.9;
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
          if (mounted) { setInitError(`AlphaTab : ${e?.message ?? String(e)}`); }
        });

        setStatus('loading');
        api.tex(GUITARISTS[0].phrases[0].tex);
      } catch (e: any) {
        if (mounted) setInitError(`Init : ${e?.message ?? String(e)}`);
      }
    })();

    return () => { mounted = false; try { api?.destroy(); } catch {} };
  }, []);

  // ── Load lick ─────────────────────────────────────────────────────────────
  function loadLick(gId: string, pNum: number) {
    const g = GUITARISTS.find(x => x.id === gId)!;
    const p = g.phrases.find(x => x.num === pNum)!;
    setGuitaristId(gId);
    setPhraseNum(pNum);
    if (!apiRef.current) return;
    try { apiRef.current.stop(); } catch {}
    setStatus('loading');
    setCurrentMs(0);
    setTotalMs(0);
    apiRef.current.tex(p.tex);
  }

  // ── Transport ─────────────────────────────────────────────────────────────
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
  function changeStave(s: typeof stave) {
    setStave(s);
    if (!apiRef.current) return;
    const map: Record<string, number> = { 'score-tab': 0, 'score': 1, 'tab': 2 };
    apiRef.current.settings.display.staveProfile = map[s];
    apiRef.current.updateSettings();
    apiRef.current.render();
  }

  const isPlaying = status === 'playing';
  const togBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
      active
        ? 'bg-orange-600 border-orange-500 text-white'
        : 'bg-gray-800 border-gray-600 text-gray-400 hover:text-white'
    }`;

  return (
    <>
      <style>{`
        .at-cursor-bar  { background: rgba(249,115,22,.12) !important; }
        .at-cursor-beat { background: rgba(249,115,22,.80) !important; width: 3px !important; }
        .at-highlight * { fill: #f97316 !important; stroke: #f97316 !important; }
        .at-selection div { background: rgba(249,115,22,.20) !important; }
      `}</style>

      <main className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5 space-y-4">

          {/* ── Header ── */}
          <div>
            <Link href="/tuto" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">← Théorie</Link>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <h1 className="text-2xl font-black">Licks II–V–I · Jazz Guitar</h1>
              <span className="text-[10px] bg-purple-700 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Avancé</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              5 guitaristes · 5 phrases chacun · tonalité de Do (Dm7→G7→CMaj7) ·
              <strong className="text-orange-400 font-semibold"> croches ternaires (swing)</strong> · notation + tablature
            </p>
            {initError && (
              <p className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2 mt-2">{initError}</p>
            )}
          </div>

          {/* ── Guitarist selector ── */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {GUITARISTS.map(g => (
              <button key={g.id} onClick={() => loadLick(g.id, 1)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  guitaristId === g.id
                    ? `${g.color} ${g.border} ring-1 ring-white/15`
                    : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                }`}>
                <p className={`font-bold text-sm ${guitaristId === g.id ? g.accent : 'text-white'}`}>
                  {g.name}
                </p>
                <p className="text-[10px] text-gray-600 font-mono mt-0.5">{g.years}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${g.badge}`}>{g.level}</span>
                  <span className="text-[10px] text-gray-600 font-mono">♩={g.tempo}</span>
                </div>
              </button>
            ))}
          </div>

          {/* ── Phrase selector ── */}
          <div className="grid grid-cols-5 gap-2">
            {guitarist.phrases.map(p => (
              <button key={p.num} onClick={() => loadLick(guitaristId, p.num)}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  phraseNum === p.num
                    ? `${guitarist.color} ${guitarist.border}`
                    : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                }`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-sm font-black ${phraseNum === p.num ? guitarist.accent : 'text-gray-500'}`}>
                    {p.num}
                  </span>
                  {phraseNum === p.num && status === 'playing' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shrink-0"/>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">{p.title}</p>
              </button>
            ))}
          </div>

          {/* ── Score ── */}
          <div className="bg-white rounded-2xl overflow-x-auto" style={{ minHeight: 180 }}>
            {status === 'idle' && !initError && (
              <div className="text-center py-12 text-gray-400 text-sm animate-pulse">⏳ Chargement…</div>
            )}
            {status === 'loading' && (
              <div className="text-center py-12 text-gray-400 text-sm animate-pulse">⏳ Rendu de la partition…</div>
            )}
            <div ref={containerRef}/>
          </div>

          {/* ── Controls ── */}
          {hasScore && (
            <div className="bg-gray-800 rounded-2xl px-4 py-3 space-y-2">
              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-mono w-10 shrink-0">{fmt(currentMs)}</span>
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }}/>
                </div>
                <span className="text-[10px] text-gray-500 font-mono w-10 text-right shrink-0">{fmt(totalMs)}</span>
              </div>

              {/* Transport */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={stop}
                  className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center transition-colors">⏹</button>
                <button onClick={togglePlay}
                  className={`w-10 h-8 rounded-lg font-bold text-sm transition-colors flex items-center justify-center ${
                    isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'
                  }`}>
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <div className="w-px h-5 bg-gray-700 mx-1 shrink-0"/>

                <button onClick={toggleLoop} className={togBtn(looping)}>🔁 Boucle</button>

                {(['score-tab', 'tab', 'score'] as const).map(s => (
                  <button key={s} onClick={() => changeStave(s)} className={togBtn(stave === s)}>
                    {s === 'score-tab' ? '𝄞+Tab' : s === 'tab' ? 'Tab' : '𝄞'}
                  </button>
                ))}

                <div className="w-px h-5 bg-gray-700 mx-1 shrink-0"/>

                <span className="text-[11px] text-gray-500 shrink-0">🔊</span>
                <input type="range" min={0} max={100} value={volume}
                  onChange={e => changeVolume(+e.target.value)}
                  className="w-16 accent-orange-500 shrink-0"/>

                <span className="text-[11px] text-gray-500 shrink-0">⚡</span>
                <input type="range" min={25} max={120} value={speed}
                  onChange={e => changeSpeed(+e.target.value)}
                  className="w-20 accent-orange-500 shrink-0"/>
                <span className="text-[11px] text-gray-400 w-10 shrink-0">{speed}%</span>

                <button onClick={() => setShowInfo(v => !v)}
                  className={`ml-auto ${togBtn(showInfo)}`}>
                  Info {showInfo ? '▲' : '▼'}
                </button>
              </div>
            </div>
          )}

          {/* ── Info panel ── */}
          {showInfo && (
            <div className={`${guitarist.color} ${guitarist.border} border rounded-2xl p-5 space-y-4`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`font-black text-lg ${guitarist.accent}`}>{guitarist.name}</h2>
                    <span className="text-xs text-gray-500 font-mono">{guitarist.years}</span>
                    <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded-full ${guitarist.badge}`}>{guitarist.level}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 italic">{guitarist.style} · ♩ = {guitarist.tempo} · Phrase {phrase.num} : {phrase.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">À écouter</p>
                  <p className="text-xs text-gray-400 mt-0.5">{guitarist.listening}</p>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">{phrase.description}</p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/30">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Techniques</p>
                  <ul className="space-y-1">
                    {phrase.techniques.map(t => (
                      <li key={t} className="flex items-start gap-1.5 text-xs text-gray-300">
                        <span className="text-orange-400 shrink-0 mt-0.5">·</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-700/30">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Analyse harmonique</p>
                  <p className="text-xs text-gray-400 leading-relaxed font-mono">{phrase.harmonyNotes}</p>
                </div>
              </div>

              <div className="bg-orange-900/20 border border-orange-800/40 rounded-xl p-3 flex items-start gap-2">
                <span className="text-base shrink-0">💡</span>
                <p className="text-xs text-orange-300 leading-relaxed">
                  Joue à <strong>50%</strong> avec 🔁, écoute chaque note, puis remonte progressivement jusqu'à 100%.
                  Ensuite <strong>transpose dans les 12 tonalités</strong> — c'est ainsi que les maîtres ont appris.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
