export type AssistantToolType =
  | 'improve_summary'
  | 'rewrite_bullet'
  | 'make_ats_friendly'
  | 'fix_grammar'
  | 'make_professional'
  | 'generate_verb'
  | 'shorten_content'
  | 'refine_skills';

export interface TransformationResult {
  tool: AssistantToolType;
  originalText: string;
  improvedText: string;
  explanation: string;
  highlights: string[];
  guidanceNote?: string;
}

export const STRONG_ACTION_VERBS: Record<string, string[]> = {
  Engineering: [
    'Architected', 'Engineered', 'Developed', 'Constructed', 'Designed',
    'Implemented', 'Programmed', 'Refactored', 'Automated', 'Deployed'
  ],
  Leadership: [
    'Spearheaded', 'Directed', 'Orchestrated', 'Guided', 'Mentored',
    'Championed', 'Mobilized', 'Formulated', 'Governed', 'Coordinated'
  ],
  Optimization: [
    'Accelerated', 'Optimized', 'Streamlined', 'Consolidated', 'Improved',
    'Reduced', 'Minimized', 'Enhanced', 'Revamped', 'Scaled'
  ],
  Collaboration: [
    'Collaborated', 'Partnered', 'Synchronized', 'Co-authored', 'Interfaced',
    'Facilitated', 'Aligned', 'Fostered', 'Coordinated', 'Delivered'
  ],
  Analytics: [
    'Benchmarked', 'Analyzed', 'Evaluated', 'Audited', 'Diagnosed',
    'Identified', 'Investigated', 'Measured', 'Profiled', 'Verified'
  ]
};

const TECH_SPELLING_MAP: Record<string, string> = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'react': 'React',
  'reactjs': 'React.js',
  'nextjs': 'Next.js',
  'nodejs': 'Node.js',
  'express': 'Express',
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
  'html5': 'HTML5',
  'html': 'HTML5',
  'css3': 'CSS3',
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
  'python': 'Python',
};

const WEAK_PHRASES_MAP: Array<{ regex: RegExp; replacement: string; rationale: string }> = [
  { regex: /\bresponsible for\s+(building|creating|developing)\b/gi, replacement: 'Engineered', rationale: 'Replaced passive "responsible for" with active verb "Engineered".' },
  { regex: /\bresponsible for\s+(managing|leading)\b/gi, replacement: 'Led', rationale: 'Replaced passive phrasing with "Led".' },
  { regex: /\bresponsible for\b/gi, replacement: 'Managed', rationale: 'Removed passive duty phrasing.' },
  { regex: /\bworked on\b/gi, replacement: 'Developed and maintained', rationale: 'Replaced vague "worked on" with specific delivery wording.' },
  { regex: /\bhelped with\b/gi, replacement: 'Contributed to', rationale: 'Professionalized supportive contributions without exaggerating scope.' },
  { regex: /\ba lot of\b/gi, replacement: 'multiple', rationale: 'Elevated conversational phrasing.' },
  { regex: /\ba bunch of\b/gi, replacement: 'several', rationale: 'Removed colloquial expression.' },
  { regex: /\bin order to\b/gi, replacement: 'to', rationale: 'Removed filler preposition.' },
  { regex: /\bdue to the fact that\b/gi, replacement: 'because', rationale: 'Simplified verbose conjunction.' },
  { regex: /\bfor the purpose of\b/gi, replacement: 'to', rationale: 'Tightened syntactic flow.' },
  { regex: /\bmade it faster\b/gi, replacement: 'improved execution speed and responsiveness', rationale: 'Used clear engineering phrasing without inventing numbers.' },
  { regex: /\bfixed bugs\b/gi, replacement: 'diagnosed and resolved software defects', rationale: 'Standardized engineering terminology.' },
];

export function fixTechnicalCapitalization(text: string): string {
  let result = text;
  for (const [lower, proper] of Object.entries(TECH_SPELLING_MAP)) {
    const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    result = result.replace(regex, proper);
  }
  return result;
}

/**
 * Deterministic Content Assistant Engine
 * Rules: Refines clarity, grammar, active voice, and capitalization ONLY from user-provided content.
 * NEVER invents fake metrics, percentages, dollar figures, qualifications, or experience.
 */
export const contentAssistant = {
  improveSummary(text: string): TransformationResult {
    const clean = text.trim();
    if (!clean) {
      return {
        tool: 'improve_summary',
        originalText: text,
        improvedText: '',
        explanation: 'Enter your draft summary above first so the assistant can refine your real experience without inventing details.',
        highlights: ['No fabrication'],
      };
    }

    let improved = clean.replace(/\s+/g, ' ');
    for (const item of WEAK_PHRASES_MAP) {
      improved = improved.replace(item.regex, item.replacement);
    }
    improved = fixTechnicalCapitalization(improved);
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    if (!/[.!?]$/.test(improved)) {
      improved += '.';
    }

    return {
      tool: 'improve_summary',
      originalText: text,
      improvedText: improved,
      explanation: 'Refined active voice, tightened filler wording, and standardized technical term capitalization while preserving your original facts.',
      highlights: ['Active voice', 'Technical casing', 'Facts preserved'],
    };
  },

  rewriteBullet(text: string): TransformationResult {
    const clean = text.trim().replace(/^[-•*]\s*/, '');
    if (!clean) {
      return {
        tool: 'rewrite_bullet',
        originalText: text,
        improvedText: '',
        explanation: 'Enter an experience or project bullet above to refine its phrasing while keeping your true accomplishments intact.',
        highlights: ['No fabrication'],
      };
    }

    let improved = clean.replace(/\s+/g, ' ');
    let rationale = 'Strengthened opening action phrasing and standardized technical terms.';

    for (const item of WEAK_PHRASES_MAP) {
      improved = improved.replace(item.regex, item.replacement);
    }

    improved = fixTechnicalCapitalization(improved);
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    const firstWord = improved.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
    const isVerb = Object.values(STRONG_ACTION_VERBS).flat().some((v) => v.toLowerCase() === firstWord);

    if (!isVerb && !/^(built|created|managed|contributed|designed|implemented|developed|resolved|delivered)/i.test(firstWord)) {
      improved = `Developed ${improved.charAt(0).toLowerCase() + improved.slice(1)}`;
      rationale = 'Led with direct action verb "Developed" while keeping your exact work description.';
    }

    const hasMetric = /(\d+%|\$\d+|\b\d+\s*(?:users|requests|ms|seconds|minutes|hours|projects|engineers|clients|x|times)\b)/i.test(improved);
    const guidanceNote = hasMetric
      ? undefined
      : 'Tip: If you measured an outcome (such as latency, team size, or scale), edit the draft below to add your real figure.';

    improved = improved.replace(/[.,;]+$/, '') + '.';

    return {
      tool: 'rewrite_bullet',
      originalText: text,
      improvedText: improved,
      explanation: rationale,
      highlights: ['Active action verb', 'Eliminated passive phrasing', 'No invented metrics'],
      guidanceNote,
    };
  },

  refineSkills(text: string): TransformationResult {
    const clean = text.trim();
    if (!clean) {
      return {
        tool: 'refine_skills',
        originalText: text,
        improvedText: '',
        explanation: 'Enter your comma-separated skills list above to deduplicate and standardize casing.',
        highlights: ['No fabrication'],
      };
    }

    const rawItems = clean
      .split(/[,|\n•;]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const seen = new Set<string>();
    const normalized: string[] = [];

    for (const item of rawItems) {
      const fixed = fixTechnicalCapitalization(item).replace(/\s+/g, ' ').trim();
      const key = fixed.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        normalized.push(fixed);
      }
    }

    return {
      tool: 'refine_skills',
      originalText: text,
      improvedText: normalized.join(', '),
      explanation: `Removed duplicates (${rawItems.length - normalized.length} duplicate(s)) and standardized technical capitalization across ${normalized.length} skills.`,
      highlights: ['Deduplicated', 'Standardized casing', 'ATS comma format'],
    };
  },

  makeATSFriendly(text: string): TransformationResult {
    if (!text.trim()) {
      return {
        tool: 'make_ats_friendly',
        originalText: text,
        improvedText: '',
        explanation: 'Enter text to normalize Unicode punctuation and technical formatting for ATS parsers.',
        highlights: ['ATS-safe'],
      };
    }

    let improved = text
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[—–]/g, '-')
      .replace(/[★✔✓▶►▪◦●]/g, '-')
      .replace(/\t/g, ' ')
      .replace(/ {2,}/g, ' ');

    improved = fixTechnicalCapitalization(improved);

    return {
      tool: 'make_ats_friendly',
      originalText: text,
      improvedText: improved.trim(),
      explanation: 'Replaced decorative symbols/curly quotes with clean standard characters and normalized technical casing.',
      highlights: ['ASCII standardized', 'ATS-safe punctuation', 'Corrected tech casing'],
    };
  },

  fixGrammar(text: string): TransformationResult {
    if (!text.trim()) {
      return {
        tool: 'fix_grammar',
        originalText: text,
        improvedText: '',
        explanation: 'Enter text to fix spacing, punctuation, and sentence capitalization.',
        highlights: ['Grammar'],
      };
    }

    let improved = text
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?:;])/g, '$1')
      .replace(/([.,!?:;])([a-zA-Z])/g, '$1 $2')
      .trim();

    improved = improved.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
    improved = fixTechnicalCapitalization(improved);

    return {
      tool: 'fix_grammar',
      originalText: text,
      improvedText: improved,
      explanation: 'Corrected spacing, sentence capitalization, punctuation adjacency, and technical term casing.',
      highlights: ['Sentence capitalization', 'Punctuation spacing', 'Technical term styling'],
    };
  },

  makeMoreProfessional(text: string): TransformationResult {
    if (!text.trim()) {
      return {
        tool: 'make_professional',
        originalText: text,
        improvedText: '',
        explanation: 'Enter text to replace informal phrasing with concise professional wording.',
        highlights: ['Professional tone'],
      };
    }

    let improved = text.trim().replace(/\s+/g, ' ');
    for (const item of WEAK_PHRASES_MAP) {
      improved = improved.replace(item.regex, item.replacement);
    }

    improved = fixTechnicalCapitalization(improved);
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    return {
      tool: 'make_professional',
      originalText: text,
      improvedText: improved,
      explanation: 'Replaced passive or conversational phrasing with clear, direct wording while preserving your original meaning.',
      highlights: ['Professional tone', 'Direct phrasing', 'No fabricated claims'],
    };
  },

  shortenContent(text: string): TransformationResult {
    if (!text.trim()) {
      return {
        tool: 'shorten_content',
        originalText: text,
        improvedText: '',
        explanation: 'Enter text to remove filler phrases and tighten word count.',
        highlights: ['Concise'],
      };
    }

    let improved = text
      .replace(/\bin order to\b/gi, 'to')
      .replace(/\bas well as\b/gi, 'and')
      .replace(/\bresponsible for (?:the )?\b/gi, 'managed ')
      .replace(/\bdue to the fact that\b/gi, 'because')
      .replace(/\bfor the purpose of\b/gi, 'for')
      .replace(/\bvarious different\b/gi, 'various')
      .replace(/\bat the present time\b/gi, 'currently')
      .replace(/\bwith regard to\b/gi, 'regarding')
      .replace(/\s{2,}/g, ' ')
      .trim();

    improved = fixTechnicalCapitalization(improved);

    return {
      tool: 'shorten_content',
      originalText: text,
      improvedText: improved,
      explanation: 'Removed redundant prepositions and filler words for tighter scannability.',
      highlights: ['Reduced word count', 'Tight phrasing'],
    };
  },
};
