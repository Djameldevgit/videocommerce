// components/boutique/BoutiqueFooter.jsx
// ─── CSS integrado ───────────────────────────────────────────────────────────

import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaGlobe,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaStore, FaCheckCircle,
  FaCrown, FaBoxes, FaEye, FaUsers, FaCalendarAlt, FaTag,
  FaChevronRight, FaArrowUp, FaHeart
} from 'react-icons/fa';

/* ═══════════════════════════════════════════════════════════════
   ESTILOS INTEGRADOS
   ═══════════════════════════════════════════════════════════════ */
const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .bf-root {
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    --bf-t: all 0.26s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
  }

  /* ── Fondo oscuro con textura sutil ─────────────────────── */
  .bf-main {
    background: #0f172a;
    position: relative;
    padding: 56px 0 0;
  }

  /* decoración: diagonal de color temático en la parte superior */
  .bf-main::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--bf-color, #2563eb), var(--bf-color-light, #60a5fa), var(--bf-color, #2563eb));
    background-size: 200% 100%;
    animation: bfShimmer 3s linear infinite;
  }

  /* patrón puntitos sutiles */
  .bf-main::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  @keyframes bfShimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .bf-inner {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* ── Grid principal ─────────────────────────────────────── */
  .bf-grid {
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr 1.2fr;
    gap: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  @media (max-width: 1024px) {
    .bf-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
  }

  @media (max-width: 600px) {
    .bf-grid { grid-template-columns: 1fr; gap: 28px; }
  }

  /* ── Col 1: identidad ───────────────────────────────────── */
  .bf-brand-logo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    border: 2.5px solid rgba(255,255,255,0.15);
    outline: 2.5px solid var(--bf-color, #2563eb);
    outline-offset: 3px;
    box-shadow: 0 0 0 6px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1e293b;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .bf-brand-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .bf-brand-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.35rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 4px;
    background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.65));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .bf-brand-slogan {
    font-size: 0.80rem;
    color: rgba(255,255,255,0.45);
    font-style: italic;
    margin: 0 0 14px;
  }

  .bf-brand-desc {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.55);
    line-height: 1.7;
    margin: 0 0 20px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Badges inline */
  .bf-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 20px;
  }

  .bf-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    border-radius: 50px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .bf-badge--verified {
    background: rgba(16,185,129,0.18);
    color: #34d399;
    border: 1px solid rgba(16,185,129,0.25);
  }

  .bf-badge--plan {
    background: rgba(245,158,11,0.15);
    color: #fbbf24;
    border: 1px solid rgba(245,158,11,0.22);
  }

  .bf-badge--active {
    background: rgba(99,102,241,0.15);
    color: #a5b4fc;
    border: 1px solid rgba(99,102,241,0.22);
  }

  /* ── Redes sociales ─────────────────────────────────────── */
  .bf-socials {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .bf-social-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.65);
    cursor: pointer;
    text-decoration: none;
    transition: var(--bf-t);
    font-size: 16px;
  }

  .bf-social-btn:hover {
    transform: translateY(-3px) scale(1.08);
    color: #fff;
    border-color: rgba(255,255,255,0.25);
  }

  .bf-social-btn--facebook:hover  { background: #1877f2; border-color: #1877f2; }
  .bf-social-btn--instagram:hover { background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); border-color: transparent; }
  .bf-social-btn--tiktok:hover    { background: #010101; border-color: #69c9d0; box-shadow: 0 0 12px rgba(105,201,208,0.4); }
  .bf-social-btn--whatsapp:hover  { background: #25d366; border-color: #25d366; }
  .bf-social-btn--website:hover   { background: var(--bf-color, #2563eb); border-color: var(--bf-color, #2563eb); }

  /* ── Columnas info / nav ────────────────────────────────── */
  .bf-col-title {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    margin: 0 0 18px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  /* ── Información de contacto ─────────────────────────────── */
  .bf-info-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bf-info-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: rgba(255,255,255,0.58);
    font-size: 0.83rem;
    line-height: 1.5;
  }

  .bf-info-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .bf-info-label {
    font-size: 0.67rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.28);
    font-weight: 700;
    display: block;
    margin-bottom: 1px;
  }

  .bf-info-value {
    color: rgba(255,255,255,0.75);
    font-weight: 500;
    word-break: break-word;
  }

  /* ── Stats grid ─────────────────────────────────────────── */
  .bf-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .bf-stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: var(--bf-t);
  }

  .bf-stat-card:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.12);
    transform: translateY(-2px);
  }

  .bf-stat-icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
  }

  .bf-stat-value {
    font-size: 1.15rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }

  .bf-stat-label {
    font-size: 0.67rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: rgba(255,255,255,0.38);
    font-weight: 700;
  }

  /* ── Barra de copyright ─────────────────────────────────── */
  .bf-bottom {
    background: rgba(0,0,0,0.3);
    position: relative;
    z-index: 2;
  }

  .bf-bottom-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .bf-copyright {
    font-size: 0.76rem;
    color: rgba(255,255,255,0.32);
    font-weight: 500;
  }

  .bf-copyright strong {
    color: rgba(255,255,255,0.55);
  }

  .bf-copyright .bf-heart {
    color: #ef4444;
    display: inline-block;
    animation: bfHeartbeat 1.6s ease-in-out infinite;
  }

  @keyframes bfHeartbeat {
    0%,100% { transform: scale(1); }
    14%      { transform: scale(1.25); }
    28%      { transform: scale(1); }
    42%      { transform: scale(1.15); }
    56%      { transform: scale(1); }
  }

  .bf-bottom-meta {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .bf-domain-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 50px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.70rem;
    color: rgba(255,255,255,0.45);
    font-weight: 600;
    font-family: 'Courier New', monospace;
  }

  .bf-scroll-top {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--bf-t);
  }

  .bf-scroll-top:hover {
    background: var(--bf-color, #2563eb);
    border-color: var(--bf-color, #2563eb);
    color: #fff;
    transform: translateY(-2px);
  }

  /* ── Divider con gradiente ──────────────────────────────── */
  .bf-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent);
    margin: 0 24px;
    position: relative;
    z-index: 2;
  }

  /* ── Responsive ajustes ─────────────────────────────────── */
  @media (max-width: 600px) {
    .bf-main { padding: 40px 0 0; }
    .bf-brand-name { font-size: 1.15rem; }
    .bf-stats-grid { grid-template-columns: 1fr 1fr; }
    .bf-bottom-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .bf-bottom-meta { width: 100%; justify-content: space-between; }
    .bf-socials { gap: 8px; }
    .bf-social-btn { width: 36px; height: 36px; border-radius: 10px; }
  }
`;

/* ─── helper ────────────────────────────────────────────────── */
const fmt = (n) => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'k' : String(n || 0);

const adjustColor = (hex, pct) => {
  try {
    const n = parseInt(hex.replace('#',''), 16), a = Math.round(2.55*pct);
    const r = Math.min(255,Math.max(0,(n>>16)+a));
    const g = Math.min(255,Math.max(0,((n>>8)&0xff)+a));
    const b = Math.min(255,Math.max(0,(n&0xff)+a));
    return `#${(0x1000000+r*0x10000+g*0x100+b).toString(16).slice(1)}`;
  } catch { return hex; }
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE
   ═══════════════════════════════════════════════════════════════ */
const BoutiqueFooter = ({ boutique }) => {
  if (!boutique) return null;

  const {
    nom_boutique, slogan_boutique, description_boutique,
    images = [], domaine_boutique, categorie, subCategory,
    plan, isVerified, isActive, couleur_theme = '#2563eb',
    proprietaire = {}, reseaux_sociaux = {},
    stats = {}, views = 0, followers = [], likes = [],
    createdAt
  } = boutique;

  const theme     = couleur_theme;
  const themeLight = adjustColor(theme, 40);
  const logo      = images[0]?.url || images[0] || null;

  const planLabel = { gratuit:'Gratuit', basique:'Basique', premium:'Premium', entreprise:'Entreprise' }[plan] || plan;

  const socials = [
    { key:'facebook',  Icon: FaFacebook,  href: reseaux_sociaux.facebook,  label:'Facebook'  },
    { key:'instagram', Icon: FaInstagram, href: reseaux_sociaux.instagram, label:'Instagram' },
    { key:'tiktok',    Icon: FaTiktok,    href: reseaux_sociaux.tiktok,    label:'TikTok'    },
    { key:'whatsapp',  Icon: FaWhatsapp,  href: reseaux_sociaux.whatsapp ? `https://wa.me/${reseaux_sociaux.whatsapp.replace(/\D/g,'')}` : null, label:'WhatsApp' },
    { key:'website',   Icon: FaGlobe,     href: reseaux_sociaux.website,   label:'Site web'  },
  ].filter(s => s.href);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const year = new Date().getFullYear();
  const since = createdAt ? new Date(createdAt).getFullYear() : year;

  return (
    <>
      <style>{FOOTER_STYLES}</style>

      <footer
        className="bf-root"
        style={{ '--bf-color': theme, '--bf-color-light': themeLight }}
      >
        {/* ══ MAIN ══════════════════════════════════════════ */}
        <div className="bf-main">
          <div className="bf-inner">
            <div className="bf-grid">

              {/* ── Col 1 : Identité ────────────────────── */}
              <div>
                {/* Logo */}
                <div className="bf-brand-logo">
                  {logo
                    ? <img src={logo} alt={nom_boutique} />
                    : <FaStore size={28} color={theme} />
                  }
                </div>

                {/* Nom + slogan */}
                <h2 className="bf-brand-name">{nom_boutique}</h2>
                {slogan_boutique && (
                  <p className="bf-brand-slogan">"{slogan_boutique}"</p>
                )}

                {/* Description */}
                {description_boutique && (
                  <p className="bf-brand-desc">{description_boutique}</p>
                )}

                {/* Badges */}
                <div className="bf-badges">
                  {isVerified && (
                    <span className="bf-badge bf-badge--verified">
                      <FaCheckCircle size={9} />Vérifiée
                    </span>
                  )}
                  {plan && plan !== 'gratuit' && (
                    <span className="bf-badge bf-badge--plan">
                      <FaCrown size={9} />{planLabel}
                    </span>
                  )}
                  {isActive && (
                    <span className="bf-badge bf-badge--active">
                      <span style={{ width:6, height:6, borderRadius:'50%', background:'#818cf8', display:'inline-block' }} />
                      Ouverte
                    </span>
                  )}
                </div>

                {/* Réseaux sociaux */}
                {socials.length > 0 && (
                  <div className="bf-socials">
                    {socials.map(({ key, Icon, href, label }) => (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bf-social-btn bf-social-btn--${key}`}
                        title={label}
                        onClick={e => e.stopPropagation()}
                      >
                        <Icon />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Col 2 : Contact ─────────────────────── */}
              <div>
                <p className="bf-col-title">Contact</p>
                <ul className="bf-info-list">

                  {proprietaire.wilaya && (
                    <li className="bf-info-item">
                      <div className="bf-info-icon" style={{ background:'rgba(239,68,68,0.15)' }}>
                        <FaMapMarkerAlt size={13} color="#f87171" />
                      </div>
                      <div>
                        <span className="bf-info-label">Adresse</span>
                        <span className="bf-info-value">
                          {proprietaire.adresse ? `${proprietaire.adresse}, ` : ''}{proprietaire.wilaya}
                        </span>
                      </div>
                    </li>
                  )}

                  {proprietaire.telephone && (
                    <li className="bf-info-item">
                      <div className="bf-info-icon" style={{ background:'rgba(16,185,129,0.15)' }}>
                        <FaPhone size={12} color="#34d399" />
                      </div>
                      <div>
                        <span className="bf-info-label">Téléphone</span>
                        <a
                          href={`tel:${proprietaire.telephone}`}
                          className="bf-info-value"
                          style={{ color:'rgba(255,255,255,0.75)', textDecoration:'none' }}
                          onClick={e => e.stopPropagation()}
                        >
                          {proprietaire.telephone}
                        </a>
                      </div>
                    </li>
                  )}

                  {proprietaire.email && (
                    <li className="bf-info-item">
                      <div className="bf-info-icon" style={{ background:`rgba(${parseInt(theme.slice(1,3),16)},${parseInt(theme.slice(3,5),16)},${parseInt(theme.slice(5,7),16)},0.18)` }}>
                        <FaEnvelope size={12} color={theme} />
                      </div>
                      <div>
                        <span className="bf-info-label">Email</span>
                        <a
                          href={`mailto:${proprietaire.email}`}
                          className="bf-info-value"
                          style={{ color:'rgba(255,255,255,0.75)', textDecoration:'none' }}
                          onClick={e => e.stopPropagation()}
                        >
                          {proprietaire.email}
                        </a>
                      </div>
                    </li>
                  )}

                  {(categorie || subCategory) && (
                    <li className="bf-info-item">
                      <div className="bf-info-icon" style={{ background:'rgba(245,158,11,0.15)' }}>
                        <FaTag size={12} color="#fbbf24" />
                      </div>
                      <div>
                        <span className="bf-info-label">Catégorie</span>
                        <span className="bf-info-value">
                          {categorie}{subCategory ? ` › ${subCategory}` : ''}
                        </span>
                      </div>
                    </li>
                  )}

                  <li className="bf-info-item">
                    <div className="bf-info-icon" style={{ background:'rgba(139,92,246,0.15)' }}>
                      <FaCalendarAlt size={12} color="#a78bfa" />
                    </div>
                    <div>
                      <span className="bf-info-label">Membre depuis</span>
                      <span className="bf-info-value">
                        {createdAt
                          ? new Date(createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })
                          : '—'}
                      </span>
                    </div>
                  </li>

                  {reseaux_sociaux.website && (
                    <li className="bf-info-item">
                      <div className="bf-info-icon" style={{ background:'rgba(99,102,241,0.15)' }}>
                        <FaGlobe size={12} color="#818cf8" />
                      </div>
                      <div>
                        <span className="bf-info-label">Site web</span>
                        <a
                          href={reseaux_sociaux.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bf-info-value"
                          style={{ color:'rgba(255,255,255,0.75)', textDecoration:'none', wordBreak:'break-all' }}
                          onClick={e => e.stopPropagation()}
                        >
                          {reseaux_sociaux.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* ── Col 3 : Propriétaire ────────────────── */}
              <div>
                <p className="bf-col-title">Propriétaire</p>
                <ul className="bf-info-list">
                  {proprietaire.nom && (
                    <li className="bf-info-item">
                      <div className="bf-info-icon" style={{ background:`rgba(${parseInt(theme.slice(1,3),16)},${parseInt(theme.slice(3,5),16)},${parseInt(theme.slice(5,7),16)},0.15)` }}>
                        <FaStore size={12} color={theme} />
                      </div>
                      <div>
                        <span className="bf-info-label">Gérant</span>
                        <span className="bf-info-value">{proprietaire.nom}</span>
                      </div>
                    </li>
                  )}

                  {domaine_boutique && (
                    <li className="bf-info-item">
                      <div className="bf-info-icon" style={{ background:'rgba(99,102,241,0.15)' }}>
                        <FaGlobe size={12} color="#818cf8" />
                      </div>
                      <div>
                        <span className="bf-info-label">Domaine</span>
                        <span className="bf-info-value" style={{ fontFamily:'Courier New, monospace', fontSize:'0.78rem' }}>
                          {domaine_boutique}
                        </span>
                      </div>
                    </li>
                  )}

                  {/* Lien signalement */}
                  <li style={{ marginTop:'8px' }}>
                    <a
                      href="#report"
                      style={{
                        display:'inline-flex', alignItems:'center', gap:'6px',
                        fontSize:'0.74rem', color:'rgba(255,255,255,0.28)',
                        textDecoration:'none', transition:'color 0.2s'
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <FaChevronRight size={9} />
                      Signaler la boutique
                    </a>
                  </li>
                </ul>
              </div>

              {/* ── Col 4 : Stats ────────────────────────── */}
              <div>
                <p className="bf-col-title">En chiffres</p>
                <div className="bf-stats-grid">

                  <div className="bf-stat-card">
                    <div className="bf-stat-icon" style={{ background:`${theme}22` }}>
                      <FaBoxes size={14} color={theme} />
                    </div>
                    <span className="bf-stat-value">{fmt(stats.produits)}</span>
                    <span className="bf-stat-label">Produits</span>
                  </div>

                  <div className="bf-stat-card">
                    <div className="bf-stat-icon" style={{ background:'rgba(14,165,233,0.18)' }}>
                      <FaEye size={14} color="#38bdf8" />
                    </div>
                    <span className="bf-stat-value">{fmt(views)}</span>
                    <span className="bf-stat-label">Vues</span>
                  </div>

                  <div className="bf-stat-card">
                    <div className="bf-stat-icon" style={{ background:'rgba(139,92,246,0.18)' }}>
                      <FaUsers size={14} color="#a78bfa" />
                    </div>
                    <span className="bf-stat-value">{fmt(followers?.length)}</span>
                    <span className="bf-stat-label">Followers</span>
                  </div>

                  <div className="bf-stat-card">
                    <div className="bf-stat-icon" style={{ background:'rgba(239,68,68,0.16)' }}>
                      <FaHeart size={14} color="#f87171" />
                    </div>
                    <span className="bf-stat-value">{fmt(likes?.length)}</span>
                    <span className="bf-stat-label">J'aime</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ══ DIVIDER ═══════════════════════════════════════ */}
        <div className="bf-divider" />

        {/* ══ BOTTOM BAR ════════════════════════════════════ */}
        <div className="bf-bottom">
          <div className="bf-bottom-inner">
            <p className="bf-copyright">
              © {since !== year ? `${since} – ${year}` : year}{' '}
              <strong>{nom_boutique}</strong>. Fait avec{' '}
              <FaHeart className="bf-heart" size={11} style={{ verticalAlign:'middle' }} />{' '}
              en Algérie.
            </p>

            <div className="bf-bottom-meta">
              {domaine_boutique && (
                <span className="bf-domain-pill">
                  <FaGlobe size={9} />
                  {domaine_boutique}
                </span>
              )}
              <button className="bf-scroll-top" onClick={scrollTop} title="Retour en haut">
                <FaArrowUp size={13} />
              </button>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default BoutiqueFooter;
