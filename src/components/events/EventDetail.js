"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ACCESS_TAGS,
  AGE_GROUPS,
  EVENT_TYPES,
  daysBetween,
  eventsForCity,
  formatDate,
  getCity,
  isPast,
  spotsLeft,
} from '../../data/fitnessEvents';
import { photo } from '../../data/fitnessPhotos';
import useStoredList from '../../lib/useStoredList';
import useToday from '../../lib/useToday';
import PhotoCredit from '../shared/PhotoCredit';
import SampleDataBadge from '../shared/SampleDataBadge';
import { eventStatus } from './EventsExplorer';
import styles from './Events.module.css';

const SAVED_KEY = 'swasth.savedEvents.v1';

function icsFor(event, city) {
  const stamp = (iso, time) => `${iso.replace(/-/g, '')}T${(time || '00:00').replace(':', '')}00`;
  const end = event.endDate || event.date;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Swasth Infinity//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@swasth`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;TZID=Asia/Kolkata:${stamp(event.date, event.time)}`,
    `DTEND;TZID=Asia/Kolkata:${stamp(end, event.time.replace(/^(\d\d)/, (h) => String(Math.min(23, Number(h) + 3)).padStart(2, '0')))}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}, ${event.address}`,
    `DESCRIPTION:${event.description.replace(/\n/g, ' ')} (Organiser: ${event.organiser}. ${city?.name || ''})`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

export default function EventDetail({ event }) {
  const today = useToday();
  const city = getCity(event.city);
  const type = EVENT_TYPES[event.type];
  const hero = photo(event.photo);
  const status = eventStatus(event, today);
  const left = spotsLeft(event);
  const fill = Math.min(100, Math.round((event.registered / event.capacity) * 100));
  const closesIn = today ? daysBetween(today, event.registrationCloses) : null;
  const canRegister = today && !isPast(event, today) && left > 0 && closesIn >= 0;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.address}`)}`;

  const savedEvents = useStoredList(SAVED_KEY);
  const saved = savedEvents.has(event.id);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleSave = () => {
    const nowSaved = savedEvents.toggle(event.id);
    setToast(nowSaved ? 'Saved to your events on this device' : 'Removed from saved events');
  };

  const addToCalendar = () => {
    const blob = new Blob([icsFor(event, city)], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Calendar file downloaded');
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text: `${event.title} on ${formatDate(event.date)}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast('Link copied');
      }
    } catch {
      // The user dismissed the share sheet.
    }
  };

  const more = eventsForCity(event.city)
    .filter((e) => e.id !== event.id && (!today || !isPast(e, today)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div className={styles.page}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/events">Events</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/events/${event.city}`}>{city?.name}</Link>
      </nav>

      <section className={styles.detailHero}>
        <img src={hero.src} alt="" />
        <div className={styles.detailShade} />
        <div className={styles.detailHeroBody}>
          <div className={styles.cardTop}>
            <span className={styles.typeChipLight}><i className={type.icon} aria-hidden="true" /> {type.label}</span>
            <span className={styles.typeChipLight}>{event.level}</span>
            {status && <span className={`${styles.status} ${styles[status.tone]}`}>{status.label}</span>}
          </div>
          <h1 className={styles.detailTitle}>{event.title}</h1>
          <p className={styles.detailSub}>
            by {event.organiser} · {formatDate(event.date)}{event.endDate ? ` – ${formatDate(event.endDate)}` : ''} · {city?.name}
          </p>
        </div>
        <PhotoCredit photo={hero} style={{ position: 'absolute', right: 12, bottom: 8, color: '#fff' }} />
      </section>

      <div className={styles.detailLayout}>
        <article className={styles.detailMain}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <i className="fa-regular fa-calendar" aria-hidden="true" />
              <div>
                <small>Date & start time</small>
                <strong>{formatDate(event.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                <span>{event.endDate ? `Until ${formatDate(event.endDate)} · ` : ''}Starts {event.time} IST</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <i className="fa-solid fa-location-dot" aria-hidden="true" />
              <div>
                <small>Venue</small>
                <strong>{event.venue}</strong>
                <span>{event.address}</span>
                <a href={mapLink} target="_blank" rel="noopener noreferrer">Open in Maps</a>
              </div>
            </div>
            <div className={styles.infoItem}>
              <i className="fa-solid fa-user-group" aria-hidden="true" />
              <div>
                <small>Age groups</small>
                <strong>{event.ageGroups.map((a) => AGE_GROUPS[a]).join(', ')}</strong>
              </div>
            </div>
            <div className={styles.infoItem}>
              <i className="fa-regular fa-hourglass-half" aria-hidden="true" />
              <div>
                <small>Registration closes</small>
                <strong>{formatDate(event.registrationCloses)}</strong>
                {closesIn !== null && closesIn >= 0 && <span>{closesIn === 0 ? 'Today' : `In ${closesIn} days`}</span>}
              </div>
            </div>
          </div>

          <section className={styles.block}>
            <h2>About this event</h2>
            <p>{event.description}</p>
          </section>

          <section className={styles.block}>
            <h2>Categories & format</h2>
            <div className={styles.chipWrap}>
              {event.formats.map((f) => (
                <span key={f} className={styles.formatChip}>{f}</span>
              ))}
            </div>
          </section>

          <section className={styles.block}>
            <h2>Accessibility & inclusion</h2>
            {event.access.length ? (
              <ul className={styles.accessList}>
                {event.access.map((a) => (
                  <li key={a}><i className={ACCESS_TAGS[a].icon} aria-hidden="true" /> {ACCESS_TAGS[a].label}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.muted}>The organiser has not listed specific access provisions. Contact them before registering if you have access needs.</p>
            )}
          </section>

          <div className={styles.twoCol}>
            <section className={styles.block}>
              <h2>Highlights</h2>
              <ul className={styles.tickList}>
                {event.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </section>
            <section className={styles.block}>
              <h2>What&rsquo;s included</h2>
              <ul className={styles.tickList}>
                {event.includes.map((h) => <li key={h}>{h}</li>)}
              </ul>
              <h2 className={styles.mt}>What to bring</h2>
              <ul className={styles.tickList}>
                {event.bring.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </section>
          </div>

          <p className={styles.muted}>
            <SampleDataBadge label="Illustrative listing" /> Dates, prices and availability are sample data for this demo. Always confirm with the organiser before paying.
          </p>
        </article>

        <aside className={styles.ticketCard}>
          <h2>Tickets</h2>
          <ul className={styles.tiers}>
            {event.price.tiers.map((t) => (
              <li key={t.label}>
                <span>{t.label}</span>
                <strong>{t.amount === 0 ? 'Free' : `₹${t.amount.toLocaleString('en-IN')}`}</strong>
              </li>
            ))}
          </ul>
          <div className={styles.capacityBig}>
            <span className={styles.bar}><span style={{ width: `${fill}%` }} /></span>
            <small>
              {event.registered.toLocaleString('en-IN')} registered · {left > 0 ? `${left.toLocaleString('en-IN')} spots left` : 'Sold out'}
            </small>
          </div>

          {event.website ? (
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.primaryBtn} ${styles.block100} ${canRegister ? '' : styles.disabled}`}
              aria-disabled={!canRegister}
            >
              Register on organiser site <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            </a>
          ) : (
            <button className={`${styles.primaryBtn} ${styles.block100}`} onClick={toggleSave} disabled={!canRegister && !saved}>
              {saved ? <><i className="fa-solid fa-check" aria-hidden="true" /> Interested</> : 'I’m interested'}
            </button>
          )}

          <div className={styles.actionRow}>
            <button className={styles.ghostBtn} onClick={toggleSave} aria-pressed={saved}>
              <i className={saved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'} aria-hidden="true" /> {saved ? 'Saved' : 'Save'}
            </button>
            <button className={styles.ghostBtn} onClick={addToCalendar}>
              <i className="fa-regular fa-calendar-plus" aria-hidden="true" /> Calendar
            </button>
            <button className={styles.ghostBtn} onClick={share}>
              <i className="fa-solid fa-share-nodes" aria-hidden="true" /> Share
            </button>
          </div>
          <p className={styles.organiser}>
            <i className="fa-solid fa-building-flag" aria-hidden="true" /> Organised by <strong>{event.organiser}</strong>
          </p>
        </aside>
      </div>

      {more.length > 0 && (
        <section className={styles.more}>
          <h2>More in {city?.name}</h2>
          <div className={styles.moreGrid}>
            {more.map((e) => (
              <Link key={e.id} href={`/events/${e.city}/${e.id}`} className={styles.moreCard}>
                <img src={photo(e.photo).src} alt="" loading="lazy" />
                <span>
                  <small>{formatDate(e.date)}</small>
                  <strong>{e.title}</strong>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {toast && <div className={styles.toast} role="status">{toast}</div>}
    </div>
  );
}
