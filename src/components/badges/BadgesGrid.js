"use client";

import { useTranslation } from "react-i18next";
import { BADGE_DEFS, getBadges, levelFor } from "../../utils/badges";
import "./Badges.css";

/** Profile/showcase grid: earned badges in color, locked ones greyed. */
export default function BadgesGrid({ user, fresh = [] }) {
  const { t } = useTranslation();
  const owned = new Set(getBadges(user));
  const freshSet = new Set(fresh);
  const level = levelFor(owned.size);

  return (
    <div className="badges-block">
      <div className="badges-head">
        <h3>
          <i className="fa-solid fa-trophy"></i> {t("badges.title")}
        </h3>
        <span className={`badges-level badges-level-${level}`}>
          {t(`badges.level_${level}`)}
        </span>
      </div>
      {fresh.length > 0 && (
        <div className="badges-toast" role="status">
          🎉 {t("badges.newUnlocked")}:{" "}
          {fresh.map((id) => t(BADGE_DEFS[id]?.nameKey || "")).join(", ")}
        </div>
      )}
      <div className="badges-grid">
        {Object.entries(BADGE_DEFS).map(([id, def]) => {
          const has = owned.has(id);
          return (
            <div
              key={id}
              className={`badge-card ${has ? "badge-earned" : "badge-locked"} ${freshSet.has(id) ? "badge-fresh" : ""}`}
              title={t(def.descKey)}
            >
              <span className="badge-icon" style={has ? { background: def.color } : undefined}>
                <i className={has ? def.icon : "fa-solid fa-lock"}></i>
              </span>
              <strong>{t(def.nameKey)}</strong>
              <small>{t(def.descKey)}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
