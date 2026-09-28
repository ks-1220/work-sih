"use client";

import { useTranslation } from "react-i18next";
import { discountPct, formatINR, productCover } from "../../data/products";
import PhotoCredit from "../shared/PhotoCredit";

/** Product card: photo tile, rating, price/MRP/discount, external Buy Now. */
export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const off = discountPct(product);
  const img = productCover(product);
  return (
    <article className="store-card">
      <div className="store-art" style={{ background: `linear-gradient(135deg, ${product.color}, #2d1b4e)` }}>
        <img className="store-art-img" src={img.src} alt="" aria-hidden="true" loading="lazy" />
        <span className="store-shade" aria-hidden="true" />
        <i className={product.icon} aria-hidden="true"></i>
        <PhotoCredit
          photo={img}
          style={{ position: "absolute", top: 6, left: 8, zIndex: 2, fontSize: "0.58rem", color: "#fff", background: "rgba(0,0,0,0.35)", padding: "1px 7px", borderRadius: 999 }}
        />
        {off > 0 && <span className="store-off">-{off}%</span>}
      </div>
      <div className="store-body">
        <span className="store-brand">{product.brand}</span>
        <h3>{product.name}</h3>
        <span className="store-rating">
          <i className="fa-solid fa-star" aria-hidden="true"></i>
          {product.rating.toFixed(1)} ({product.reviews.toLocaleString("en-IN")})
        </span>
        <div className="store-price">
          <strong>{formatINR(product.price)}</strong>
          {product.mrp > product.price && <s>{formatINR(product.mrp)}</s>}
        </div>
        <a className="store-buy" href={product.url} target="_blank" rel="noopener noreferrer">
          {t("store.buyNow")} <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        </a>
      </div>
    </article>
  );
}
