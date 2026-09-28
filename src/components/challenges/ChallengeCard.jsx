"use client";

import { useTranslation } from "react-i18next";
import { CATEGORY_META, daysRemaining, formatParticipants } from "../../data/challenges";
import { photo } from "../../data/fitnessPhotos";
import PhotoCredit from "../shared/PhotoCredit";

/** One challenge card: photo cover, meta, Join → Joined ✓. */
export default function ChallengeCard({ challenge, joined, onJoin }) {
  const { t } = useTranslation();
  const meta = CATEGORY_META[challenge.category];
  const img = photo(meta.photo);
  const left = daysRemaining(challenge);
  return (
    <article className="chal-card">
      <div className="chal-cover" style={{ background: `linear-gradient(135deg, ${meta.color}, #493971)` }}>
        <img className="chal-cover-img" src={img.src} alt="" aria-hidden="true" loading="lazy" />
        <span className="chal-shade" aria-hidden="true" />
        <span className="chal-cover-art" aria-hidden="true">
          <i className={meta.icon}></i>
        </span>
        <PhotoCredit
          photo={img}
          style={{ position: "absolute", top: 6, left: 8, zIndex: 2, fontSize: "0.58rem", color: "#fff", background: "rgba(0,0,0,0.35)", padding: "1px 7px", borderRadius: 999 }}
        />
        <span className="chal-cat">{t(meta.labelKey)}</span>
      </div>
      <div className="chal-body">
        <h3>{challenge.title}</h3>
        <p>{challenge.description}</p>
        <div className="chal-meta">
          <span><i className="fa-regular fa-calendar" aria-hidden="true"></i>{t("chal.daysLeft", { n: left })}</span>
          <span><i className="fa-solid fa-users" aria-hidden="true"></i>{formatParticipants(challenge.participants + (joined ? 1 : 0))}</span>
        </div>
        <span className="chal-xp">+{challenge.xp} XP</span>
        <button
          type="button"
          className={`chal-join ${joined ? "chal-joined" : ""}`}
          onClick={onJoin}
          disabled={joined}
          aria-pressed={joined}
        >
          {joined ? t("chal.joined") : t("chal.join")}
        </button>
      </div>
    </article>
  );
}
