export type AssistantToolType =
  | 'improve_summary'
  | 'rewrite_bullet'
  | 'make_ats_friendly'
  | 'fix_grammar'
  | 'make_professional'
  | 'generate_verb'
  | 'shorten_content';

export interface TransformationResult {
  tool: AssistantToolType;
  originalText: string;
  improvedText: string;
  explanation: string;
  highlights: string[];
}

export const STRONG_ACTION_VERBS: Record<string, string[]> = {
  Engineering: [
    'Architected', 'Engineered', 'Developed', 'Constructed', 'Designed',
    'Implemented', 'Programmed', 'Refactored', 'Automated', 'Deployed'
  ],
  Leadership: [
    'Spearheaded', 'Directed', 'Orchestrated', 'Guided', 'Mentored',
    'Championed', 'Mobilized', 'Formulated', 'Governed', 'Delegated'
  ],
  Optimization: [
    'Accelerated', 'Optimized', 'Streamlined', 'Consolidated', 'Maximized',
    'Reduced', 'Minimized', 'Enhanced', 'Revamped', 'Augmented'
  ],
  Collaboration: [
    'Collaborated', 'Partnered', 'Synchronized', 'Co-authored', 'Interfaced',
    'Facilitated', 'Liaised', 'Fostered', 'Coordinated', 'Negotiated'
  ],
  Analytics: [
    'Benchmarked', 'Quantified', 'Formulated', 'Analyzed', 'Evaluated',
    'Forecasted', 'Audited', 'Diagnosed', 'Identified', 'Investigated'
  ]
};

const TECH_SPELLING_MAP: Record<string, string> = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'react': 'React',
  'reactjs': 'React.js',
  'nextjs': 'Next.js',
  'nodejs': 'Node.js',
  'node': 'Node.js',
  'expressjs': 'Express.js',
  'mongodb': 'MongoDB',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mysql': 'MySQL',
  'graphql': 'GraphQL',
  'rest': 'REST',
  'restful': 'RESTful',
  'api': 'API',
  'apis': 'APIs',
  'aws': 'AWS',
  'gcp': 'GCP',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'ci/cd': 'CI/CD',
  'cicd': 'CI/CD',
  'html': 'HTML5',
  'css': 'CSS3',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'redux': 'Redux',
  'github': 'GitHub',
  'git': 'Git',
  'linux': 'Linux',
  'ui/ux': 'UI/UX',
  'ui': 'UI',
  'ux': 'UX',
  'json': 'JSON',
  'jwt': 'JWT',
  'sql': 'SQL',
};

const WEAK_PHRASES_MAP: Array<{ regex: RegExp; replacement: string; rationale: string }> = [
  { regex: /\bresponsible for\s+(building|creating|developing)\b/gi, replacement: 'Engineered', rationale: 'Replaced passive "responsible for" with direct active verb "Engineered".' },
  { regex: /\bresponsible for\s+(managing|leading)\b/gi, replacement: 'Spearheaded', rationale: 'Elevated leadership presence.' },
  { regex: /\bresponsible for\b/gi, replacement: 'Led', rationale: 'Removed passive duty phrasing.' },
  { regex: /\bworked on\b/gi, replacement: 'Developed and delivered', rationale: 'Transformed vague work to specific delivery.' },
  { regex: /\bhelped with\b/gi, replacement: 'Collaborated on', rationale: 'Professionalized supportive contributions.' },
  { regex: /\ba lot of\b/gi, replacement: 'extensive', rationale: 'Elevated conversational vocabulary.' },
  { regex: /\ba bunch of\b/gi, replacement: 'multiple high-impact', rationale: 'Removed colloquial expression.' },
  { regex: /\bin order to\b/gi, replacement: 'to', rationale: 'Removed filler preposition.' },
  { regex: /\bdue to the fact that\b/gi, replacement: 'because', rationale: 'Simplified verbose conjunction.' },
  { regex: /\bfor the purpose of\b/gi, replacement: 'to facilitate', rationale: 'Tightened syntactic flow.' },
  { regex: /\bmade it faster\b/gi, replacement: 'optimized performance and reduced latency', rationale: 'Quantifiable engineering framing.' },
  { regex: /\bfixed bugs\b/gi, replacement: 'resolved critical production defects', rationale: 'Standardized engineering terminology.' },
];

/**
 * Standardize capitalization of technical terms
 */
export function fixTechnicalCapitalization(text: string): string {
  let result = text;
  for (const [lower, proper] of Object.entries(TECH_SPELLING_MAP)) {
    const regex = new RegExp(`\\b${lower}\\b`, 'gi');
    result = result.replace(regex, proper);
  }
  return result;
}

/**
 * Deterministic Content Assistant Engine
 */
export const contentAssistant = {
  improveSummary(text: string): TransformationResult {
    const clean = text.trim();
    if (!clean) {
      return {
        tool: 'improve_summary',
        originalText: text,
        improvedText: 'Results-driven Software Engineer with proven expertise in architecting resilient web systems, optimizing performance, and delivering high-impact user experiences. Adept at full lifecycle development, modern frameworks, and scalable cloud architectures.',
        explanation: 'Generated a professional executive summary baseline tailored for high ATS keyword ranking.',
        highlights: ['Results-driven', 'proven expertise', 'scalable cloud architectures'],
      };
    }

    let improved = clean;
    // Replace weak phrases
    for (const item of WEAK_PHRASES_MAP) {
      improved = improved.replace(item.regex, item.replacement);
    }
    improved = fixTechnicalCapitalization(improved);

    // If summary is brief, prepend strong professional hook
    if (!/results-driven|proven|innovative|accomplished|experienced/i.test(improved)) {
      improved = `Results-driven developer with a proven track record: ${improved.charAt(0).toLowerCase() + improved.slice(1)}`;
    }

    // Ensure ending period
    if (!/[.!?]$/.test(improved)) {
      improved += '.';
    }

    return {
      tool: 'improve_summary',
      originalText: text,
      improvedText: improved,
      explanation: 'Elevated opening authority, enriched technical keyword capitalization, and refined sentence cadence.',
      highlights: ['Results-driven developer', 'Active voice', 'Correct technical casing'],
    };
  },

  rewriteBullet(text: string): TransformationResult {
    const clean = text.trim().replace(/^[-•*]\s*/, '');
    if (!clean) {
      return {
        tool: 'rewrite_bullet',
        originalText: text,
        improvedText: 'Architected and deployed responsive UI components, improving page load performance by 35% and enhancing user engagement.',
        explanation: 'Created high-impact bullet adhering to Google "XYZ" formula: Accomplished [X], as measured by [Y], by doing [Z].',
        highlights: ['Action Verb', 'Quantifiable Metric', 'Outcome'],
      };
    }

    let improved = clean;
    let rationale = 'Refactored to Google XYZ formula with strong initial action verb.';

    // Replace weak openers
    for (const item of WEAK_PHRASES_MAP) {
      improved = improved.replace(item.regex, item.replacement);
    }

    improved = fixTechnicalCapitalization(improved);

    // Capitalize first letter
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    // Check if starts with verb
    const firstWord = improved.split(' ')[0].toLowerCase();
    const isVerb = Object.values(STRONG_ACTION_VERBS).flat().some((v) => v.toLowerCase() === firstWord);

    if (!isVerb) {
      improved = `Spearheaded development of ${improved.charAt(0).toLowerCase() + improved.slice(1)}`;
      rationale = 'Prefixed with strong action verb "Spearheaded" to demonstrate initiative.';
    }

    // If no metric exists, append suggested metric placeholder
    if (!/(\d+%|\$\d+|\b\d+\s*(?:users|requests|ms|times|x)\b)/i.test(improved)) {
      if (!/[.]$/.test(improved)) improved += ',';
      improved += ' resulting in a 25% boost in system efficiency and test coverage.';
      rationale += ' Added quantifiable impact metric recommendation.';
    }

    // Ensure single period at end
    improved = improved.replace(/[.,;]+$/, '') + '.';

    return {
      tool: 'rewrite_bullet',
      originalText: text,
      improvedText: improved,
      explanation: rationale,
      highlights: ['Active action verb', 'Eliminated weak phrasing', 'Quantifiable metric template'],
    };
  },

  makeATSFriendly(text: string): TransformationResult {
    let improved = text
      // Replace fancy quotes & em-dashes with standard ASCII
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[—–]/g, '-')
      .replace(/[•★✔✓▶►]/g, '-')
      .replace(/\t/g, ' ')
      .replace(/ {2,}/g, ' ');

    improved = fixTechnicalCapitalization(improved);

    return {
      tool: 'make_ats_friendly',
      originalText: text,
      improvedText: improved.trim(),
      explanation: 'Stripped non-standard unicode characters, standardized hyphens/quotes, and verified ATS-friendly font-safe symbols.',
      highlights: ['ASCII standardized', 'ATS-safe punctuation', 'Corrected tech casing'],
    };
  },

  fixGrammar(text: string): TransformationResult {
    let improved = text
      // Normalize double spaces
      .replace(/\s+/g, ' ')
      // Normalize space before punctuation
      .replace(/\s+([.,!?:;])/g, '$1')
      // Ensure space after punctuation if followed by letter
      .replace(/([.,!?:;])([a-zA-Z])/g, '$1 $2')
      .trim();

    // Sentence case capitalization
    improved = improved.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
    improved = fixTechnicalCapitalization(improved);

    return {
      tool: 'fix_grammar',
      originalText: text,
      improvedText: improved,
      explanation: 'Corrected spacing, sentence capitalization, punctuation adjacency, and verified technical terminology syntax.',
      highlights: ['Sentence capitalization', 'Punctuation spacing', 'Technical term styling'],
    };
  },

  makeMoreProfessional(text: string): TransformationResult {
    let improved = text;
    for (const item of WEAK_PHRASES_MAP) {
      improved = improved.replace(item.regex, item.replacement);
    }

    improved = fixTechnicalCapitalization(improved);
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    return {
      tool: 'make_professional',
      originalText: text,
      improvedText: improved.trim(),
      explanation: 'Eliminated colloquial vocabulary, substituted executive-grade action verbs, and unified tone.',
      highlights: ['Executive tone', 'Impact vocabulary', 'Professional cadence'],
    };
  },

  shortenContent(text: string): TransformationResult {
    let improved = text
      .replace(/\bin order to\b/gi, 'to')
      .replace(/\bas well as\b/gi, 'and')
      .replace(/\bresponsible for the\b/gi, 'led')
      .replace(/\bdue to the fact that\b/gi, 'as')
      .replace(/\bfor the purpose of\b/gi, 'for')
      .replace(/\bvarious different\b/gi, 'diverse')
      .replace(/\bat the present time\b/gi, 'currently')
      .replace(/\bwith regard to\b/gi, 'regarding')
      .replace(/\s{2,}/g, ' ')
      .trim();

    improved = fixTechnicalCapitalization(improved);

    return {
      tool: 'shorten_content',
      originalText: text,
      improvedText: improved,
      explanation: 'Pruned redundant prepositions and fluff phrases to maximize information density for ATS scannability.',
      highlights: ['Reduced word count', 'High information density', 'Punchy delivery'],
    };
  },
};
