import { toTitleCase } from '@/lib/titleCase';

/** Slug value for selects; label is persisted/displayed (title case). */
export const VISIT_TYPE_OPTIONS: { slug: string; label: string }[] = [
  { slug: 'initial assessment', label: 'Initial Assessment' },
  { slug: 'routine follow-up', label: 'Routine Follow-Up' },
  { slug: 'reintegration assessment', label: 'Reintegration Assessment' },
  { slug: 'post-placement monitoring', label: 'Post-Placement Monitoring' },
  { slug: 'emergency', label: 'Emergency' },
];

export const COOPERATION_LEVEL_OPTIONS: { slug: string; label: string }[] = [
  { slug: 'high', label: 'High' },
  { slug: 'moderate', label: 'Moderate' },
  { slug: 'low', label: 'Low' },
];

export const VISIT_OUTCOME_OPTIONS: { slug: string; label: string }[] = [
  { slug: 'completed', label: 'Completed' },
  { slug: 'follow-up required', label: 'Follow-Up Required' },
  { slug: 'escalated', label: 'Escalated' },
];

export function slugForVisitType(stored: string): string {
  const n = stored.trim().toLowerCase();
  if (!n) return '';
  const bySlug = VISIT_TYPE_OPTIONS.find((o) => o.slug === n);
  if (bySlug) return bySlug.slug;
  const byLabel = VISIT_TYPE_OPTIONS.find((o) => o.label.toLowerCase() === n);
  if (byLabel) return byLabel.slug;
  return 'other';
}

export function labelFromVisitTypeSlug(slug: string, otherRaw: string): string {
  if (!slug.trim()) return '';
  if (slug === 'other') return toTitleCase(otherRaw);
  return VISIT_TYPE_OPTIONS.find((o) => o.slug === slug)?.label ?? toTitleCase(slug);
}

export function slugForCooperation(stored: string): string {
  const n = (stored || '').trim().toLowerCase();
  if (!n) return '';
  const bySlug = COOPERATION_LEVEL_OPTIONS.find((o) => o.slug === n);
  if (bySlug) return bySlug.slug;
  const byLabel = COOPERATION_LEVEL_OPTIONS.find((o) => o.label.toLowerCase() === n);
  if (byLabel) return byLabel.slug;
  return 'other';
}

export function labelFromCooperationSlug(slug: string, otherRaw: string): string {
  if (!slug.trim()) return '';
  if (slug === 'other') return toTitleCase(otherRaw);
  return COOPERATION_LEVEL_OPTIONS.find((o) => o.slug === slug)?.label ?? toTitleCase(slug);
}

export function slugForVisitOutcome(stored: string): string {
  const n = (stored || '').trim().toLowerCase();
  if (!n) return '';
  const bySlug = VISIT_OUTCOME_OPTIONS.find((o) => o.slug === n);
  if (bySlug) return bySlug.slug;
  const byLabel = VISIT_OUTCOME_OPTIONS.find((o) => o.label.toLowerCase() === n);
  if (byLabel) return byLabel.slug;
  return 'other';
}

export function labelFromVisitOutcomeSlug(slug: string, otherRaw: string): string {
  if (!slug.trim()) return '';
  if (slug === 'other') return toTitleCase(otherRaw);
  return VISIT_OUTCOME_OPTIONS.find((o) => o.slug === slug)?.label ?? toTitleCase(slug);
}

export const SESSION_DURATION_PRESETS = [30, 45, 60, 90, 120] as const;

export const EMOTIONAL_STATE_SEEDS = [
  'Calm',
  'Anxious',
  'Withdrawn',
  'Agitated',
  'Tearful',
  'Cooperative',
  'Resistant',
  'Neutral',
  'Hopeful',
  'Distressed',
  'Engaged',
  'Fatigued',
] as const;

export const PLAN_STATUS_LABELS: Record<'pending' | 'in-progress' | 'completed' | 'on-hold', string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
  'on-hold': 'On Hold',
};

export const DEFAULT_PLAN_CATEGORY_SLUGS = ['caring', 'healing', 'teaching'] as const;

export function planCategoryLabel(slug: string): string {
  const map: Record<string, string> = {
    caring: 'Caring',
    healing: 'Healing',
    teaching: 'Teaching',
  };
  return map[slug.toLowerCase()] ?? toTitleCase(slug);
}

/** Dedupe case-insensitively, alphabetize, store display as title case. */
export function mergeDistinctOptions(fromData: readonly string[], seeds: readonly string[] = []): string[] {
  const map = new Map<string, string>();
  for (const s of [...seeds, ...fromData]) {
    const t = s.trim();
    if (!t) continue;
    const k = t.toLowerCase();
    if (!map.has(k)) map.set(k, toTitleCase(t));
  }
  return [...map.values()].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}
