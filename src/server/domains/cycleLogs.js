/**
 * Menstrual cycle logging.
 *
 * A private, owner-scoped log of period start/end dates, optional symptoms
 * and an optional private note - nothing more. This deliberately does not
 * predict anything: no fixed cycle-length assumption, no ovulation window,
 * no "safe days", no diagnosis. The only derived values are arithmetic over
 * the owner's own logged history (a count, and an average of gaps between
 * logged start dates when there is enough history to average).
 *
 * Uses the same in-memory, owner-scoped repository pattern as checkIns.js
 * and habits.js - see src/server/repositories/memory.js for the caveat that
 * this is not durable storage.
 */

import { ApiError } from '../http/errors.js';
import { field, validateBody } from '../http/validate.js';
import { getRepositories } from '../repositories/index.js';
import { SYMPTOM_OPTIONS } from '../../utils/symptomOptions.js';

function isSymptomList(value) {
  if (value === undefined || value === null) return null;
  if (!Array.isArray(value)) return 'must be an array';
  if (value.length > SYMPTOM_OPTIONS.length) return 'must not repeat or exceed the known symptom list';
  for (const item of value) {
    if (typeof item !== 'string' || !SYMPTOM_OPTIONS.includes(item)) {
      return `must only contain: ${SYMPTOM_OPTIONS.join(', ')}`;
    }
  }
  if (new Set(value).size !== value.length) return 'must not contain duplicates';
  return null;
}

const cycleLogSchema = {
  startDate: field.isoDate({ required: true }),
  endDate: field.isoDate(),
  symptoms: isSymptomList,
  note: field.string({ max: 500 }),
};

export async function logCycle(ownerId, body) {
  const input = validateBody(body, cycleLogSchema);

  if (input.endDate && input.endDate < input.startDate) {
    throw ApiError.validationFailed({ endDate: 'must not be before startDate' });
  }

  const repositories = getRepositories();
  const created = await repositories.cycleLogs.append(ownerId, {
    startDate: input.startDate,
    endDate: input.endDate ?? null,
    symptoms: input.symptoms ?? [],
    note: input.note ?? '',
  });

  const { ownerId: _owner, ...presented } = created;
  return presented;
}

/**
 * The owner's logged cycles plus simple, honest derived stats.
 *
 * averageCycleLengthDays is the mean gap between consecutive logged start
 * dates - a description of the history the person has actually recorded,
 * not a forecast of what comes next. It is null until at least two cycles
 * are logged, and it is never used to predict a future date.
 */
export async function getCycleSummary(ownerId) {
  const repositories = getRepositories();
  const records = await repositories.cycleLogs.listAll(ownerId);

  const entries = records
    .map(({ ownerId: _owner, ...presented }) => presented)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));

  let averageCycleLengthDays = null;
  if (entries.length >= 2) {
    const gaps = [];
    for (let i = 1; i < entries.length; i += 1) {
      const previous = new Date(`${entries[i - 1].startDate}T00:00:00Z`);
      const current = new Date(`${entries[i].startDate}T00:00:00Z`);
      const days = Math.round((current - previous) / (1000 * 60 * 60 * 24));
      if (days > 0) gaps.push(days);
    }
    if (gaps.length > 0) {
      averageCycleLengthDays = Math.round(gaps.reduce((sum, g) => sum + g, 0) / gaps.length);
    }
  }

  return {
    entries,
    cycleCount: entries.length,
    averageCycleLengthDays,
  };
}
