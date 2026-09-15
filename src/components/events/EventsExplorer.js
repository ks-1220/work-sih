"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ACCESS_TAGS,
  AGE_GROUPS,
  CITIES,
  EVENTS,
  EVENT_TYPES,
  daysBetween,
  formatDate,
  formatPrice,
  isPast,
  lowestPrice,
  spotsLeft,
} from '../../data/fitnessEvents';
import { photo } from '../../data/fitnessPhotos';
import useToday from '../../lib/useToday';
import SampleDataBadge from '../shared/SampleDataBadge';
import styles from './Events.module.css';

const WHEN = [
  ['upcoming', 'Upcoming'],
  ['week', 'Next 7 days'],
  ['month', 'Next 30 days'],
  ['quarter', 'Next 3 months'],
  ['past', 'Past events'],
  ['all', 'All dates'],
];

const SORTS = [
  ['soonest', 'Soonest first'],
  ['latest', 'Latest first'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['popular', 'Most popular'],
];

const LEVELS = ['All levels', 'Beginner', 'Intermediate', 'Advanced'];

const initialFilters = {
  query: '',
  when: 'upcoming',
  price: 'all',
  types: [],
  ages: [],
  level: 'any',
  access: [],
  openOnly: false,
};

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function eventStatus(event, today) {
  if (!today) return null;
  if (isPast(event, today)) return { label: 'Past event', tone: 'muted' };
  if (spotsLeft(event) === 0) return { label: 'Sold out', tone: 'danger' };
  const closesIn = daysBetween(today, event.registrationCloses);
  if (closesIn < 0) return { label: 'Registration closed', tone: 'muted' };
  if (closesIn <= 7) return { label: closesIn === 0 ? 'Closes today' : `Closes in ${closesIn}d`, tone: 'warning' };
  if (spotsLeft(event) / event.capacity < 0.15) return { label: 'Filling fast', tone: 'warning' };
  return null;
}

export default function EventsExplorer({ citySlug = null }) {
  const router = useRouter();
  const today = useToday();
  const city = CITIES.find((c) => c.slug === citySlug) || null;

  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState('soonest');
  const [showFilters, setShowFilters] = useState(false);

  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));

  const pool = useMemo(() => (city ? EVENTS.filter((e) => e.city === city.slug) : EVENTS), [city]);

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const list = pool.filter((e) => {
      if (q && !`${e.title} ${e.organiser} ${e.venue} ${e.address}`.toLowerCase().includes(q)) return false;
      // Until the browser's date is known, date filters are not applied.
      if (today && filters.when !== 'all') {
        const past = isPast(e, today);
        if (filters.when === 'past') {
          if (!past) return false;
        } else {
          if (past) return false;
          const horizon = { week: 7, month: 30, quarter: 92 }[filters.when];
          if (horizon && daysBetween(today, e.date) > horizon) return false;
        }
      }
      if (filters.price === 'free' && !e.price.free) return false;
      if (filters.price === 'paid' && e.price.free) return false;
      if (filters.types.length && !filters.types.includes(e.type)) return false;
      if (filters.ages.length && !filters.ages.some((a) => e.ageGroups.includes(a))) return false;
      if (filters.level !== 'any' && e.level !== filters.level) return false;
      if (filters.access.some((a) => !e.access.includes(a))) return false;
      if (filters.openOnly && spotsLeft(e) === 0) return false;
      return true;
    });

    const sorters = {
      soonest: (a, b) => a.date.localeCompare(b.date),
      latest: (a, b) => b.date.localeCompare(a.date),
      'price-asc': (a, b) => lowestPrice(a) - lowestPrice(b),
      'price-desc': (a, b) => lowestPrice(b) - lowestPrice(a),
      popular: (a, b) => b.registered - a.registered,
    };
    return [...list].sort(sorters[sort]);
  }, [pool, filters, sort, today]);

  const activeCount =
    (filters.query ? 1 : 0) +
    (filters.when !== 'upcoming' ? 1 : 0) +
    (filters.price !== 'all' ? 1 : 0) +
    filters.types.length +
    filters.ages.length +
    (filters.level !== 'any' ? 1 : 0) +
    filters.access.length +
    (filters.openOnly ? 1 : 0);

  const heading = city ? `Fitness events in ${city.name}` : 'Fitness events across India';

  return (
    <div className={styles.page}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        {city ? <Link href="/events">Events</Link> : <span>Events</span>}
        {city && (
          <>
            <span aria-hidden="true">/</span>
            <span>{city.name}</span>
          </>
        )}
      </nav>

      <header className={styles.header}>
        <div>
          <h1 className={styles.h1}>{heading}</h1>
          <p className={styles.sub}>
            Runs, HYROX, rides, yoga, treks and adaptive sport, filtered for your age, budget and access needs.{' '}
            <SampleDataBadge label="Illustrative listings" />
          </p>
        </div>
        <label className={styles.cityPicker}>
          <i className="fa-solid fa-location-dot" aria-hidden="true" />
          <select
            value={city ? city.slug : ''}
            onChange={(e) => router.push(e.target.value ? `/events/${e.target.value}` : '/events')}
            aria-label="Choose city"
          >
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className={styles.layout}>
        <aside className={`${styles.filters} ${showFilters ? styles.filtersOpen : ''}`} aria-label="Filters">
          <div className={styles.filterHead}>
            <strong>Filters</strong>
            {activeCount > 0 && (
              <button className={styles.linkBtn} onClick={() => setFilters(initialFilters)}>
                Reset ({activeCount})
              </button>
            )}
          </div>

          <fieldset className={styles.fieldset}>
            <legend>When</legend>
            {WHEN.map(([id, label]) => (
              <label key={id} className={styles.radio}>
                <input type="radio" name="when" checked={filters.when === id} onChange={() => set({ when: id })} />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Price</legend>
            <div className={styles.segment}>
              {[
                ['all', 'All'],
                ['free', 'Free'],
                ['paid', 'Paid'],
              ].map(([id, label]) => (
                <button key={id} aria-pressed={filters.price === id} className={filters.price === id ? styles.segOn : ''} onClick={() => set({ price: id })}>
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Type of event</legend>
            <div className={styles.chipWrap}>
              {Object.entries(EVENT_TYPES).map(([id, t]) => (
                <button
                  key={id}
                  className={`${styles.chip} ${filters.types.includes(id) ? styles.chipOn : ''}`}
                  aria-pressed={filters.types.includes(id)}
                  onClick={() => set({ types: toggle(filters.types, id) })}
                >
                  <i className={t.icon} aria-hidden="true" /> {t.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Age group</legend>
            {Object.entries(AGE_GROUPS).map(([id, label]) => (
              <label key={id} className={styles.radio}>
                <input type="checkbox" checked={filters.ages.includes(id)} onChange={() => set({ ages: toggle(filters.ages, id) })} />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Level</legend>
            <select className={styles.select} value={filters.level} onChange={(e) => set({ level: e.target.value })}>
              <option value="any">Any level</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </fieldset>

          <fieldset className={styles.fieldset}>
            <legend>Accessibility & inclusion</legend>
            {Object.entries(ACCESS_TAGS).map(([id, tag]) => (
              <label key={id} className={styles.radio}>
                <input type="checkbox" checked={filters.access.includes(id)} onChange={() => set({ access: toggle(filters.access, id) })} />
                <i className={tag.icon} aria-hidden="true" /> {tag.label}
              </label>
            ))}
          </fieldset>

          <label className={`${styles.radio} ${styles.switchRow}`}>
            <input type="checkbox" checked={filters.openOnly} onChange={() => set({ openOnly: !filters.openOnly })} />
            Hide sold-out events
          </label>

          <button className={`${styles.primaryBtn} ${styles.applyBtn}`} onClick={() => setShowFilters(false)}>
            Show {results.length} events
          </button>
        </aside>

        <section className={styles.results}>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search events, organisers, venues"
                value={filters.query}
                onChange={(e) => set({ query: e.target.value })}
              />
            </label>
            <button className={styles.filterToggle} onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}>
              <i className="fa-solid fa-filter" aria-hidden="true" /> Filters{activeCount ? ` (${activeCount})` : ''}
            </button>
            <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort events">
              {SORTS.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <p className={styles.count} aria-live="polite">
            {results.length} {results.length === 1 ? 'event' : 'events'}
          </p>

          {results.length === 0 ? (
            <div className={styles.empty}>
              <i className="fa-regular fa-calendar-xmark" aria-hidden="true" />
              <p>No events match these filters{city ? ` in ${city.name}` : ''}.</p>
              <div className={styles.emptyActions}>
                <button className={styles.primaryBtn} onClick={() => setFilters(initialFilters)}>
                  Reset filters
                </button>
                {city && (
                  <Link className={styles.ghostBtn} href="/events">
                    See all cities
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <ul className={styles.list}>
              {results.map((e) => (
                <EventCard key={e.id} event={e} today={today} showCity={!city} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function EventCard({ event, today, showCity }) {
  const img = photo(event.photo);
  const type = EVENT_TYPES[event.type];
  const status = eventStatus(event, today);
  const cityName = CITIES.find((c) => c.slug === event.city)?.name;
  const [, month, day] = event.date.split('-');
  const monthLabel = formatDate(event.date, { month: 'short' });
  const fill = Math.min(100, Math.round((event.registered / event.capacity) * 100));
  const href = `/events/${event.city}/${event.id}`;

  return (
    <li className={styles.card}>
      <Link href={href} className={styles.cardImgWrap} tabIndex={-1} aria-hidden="true">
        <img src={img.src} alt="" loading="lazy" />
        <span className={styles.dateBlock}>
          <strong>{Number(day)}</strong>
          <small>{monthLabel || month}</small>
        </span>
      </Link>
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <span className={styles.typeChip}>
            <i className={type.icon} aria-hidden="true" /> {type.label}
          </span>
          <span className={styles.level}>{event.level}</span>
          {status && <span className={`${styles.status} ${styles[status.tone]}`}>{status.label}</span>}
        </div>
        <h2 className={styles.cardTitle}>
          <Link href={href}>{event.title}</Link>
        </h2>
        <p className={styles.meta}>
          <span><i className="fa-regular fa-calendar" aria-hidden="true" /> {formatDate(event.date)}{event.endDate ? ` – ${formatDate(event.endDate, { day: 'numeric', month: 'short' })}` : ''} · {event.time}</span>
          <span><i className="fa-solid fa-location-dot" aria-hidden="true" /> {event.venue}{showCity && cityName ? `, ${cityName}` : ''}</span>
        </p>
        <p className={styles.ages}>
          <i className="fa-solid fa-user-group" aria-hidden="true" /> {event.ageGroups.map((a) => AGE_GROUPS[a].split(' (')[0]).join(' · ')}
        </p>
        <div className={styles.cardFoot}>
          <span className={`${styles.price} ${event.price.free ? styles.freePrice : ''}`}>{formatPrice(event)}</span>
          <span className={styles.access}>
            {event.access.map((a) => (
              <i key={a} className={ACCESS_TAGS[a].icon} title={ACCESS_TAGS[a].label} aria-label={ACCESS_TAGS[a].label} />
            ))}
          </span>
          <span className={styles.capacity} title={`${event.registered.toLocaleString('en-IN')} of ${event.capacity.toLocaleString('en-IN')} registered`}>
            <span className={styles.bar}><span style={{ width: `${fill}%` }} /></span>
            {spotsLeft(event) > 0 ? `${spotsLeft(event).toLocaleString('en-IN')} spots left` : 'Full'}
          </span>
          <Link href={href} className={styles.detailsLink}>
            Details <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </li>
  );
}
