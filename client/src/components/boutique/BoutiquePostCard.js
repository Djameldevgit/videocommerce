// components/boutique/BoutiqueCard.jsx
// ─── CSS integrado directamente ─────────────────────────────────────────────

import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaStore, FaCheckCircle, FaMapMarkerAlt, FaTag, FaEye,
  FaBoxes, FaClock, FaCrown, FaFlag, FaStar, FaRegStar,
  FaHeart, FaRegHeart, FaShare, FaBookmark, FaRegBookmark
} from 'react-icons/fa';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

/* ═══════════════════════════════════════════════════════════════
   ESTILOS INTEGRADOS
   ═══════════════════════════════════════════════════════════════ */
const CARD_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .bc-root {
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    --bc-t: all 0.26s cubic-bezier(0.4,0,0.2,1);
    height: 100%;
  }

  /* ── Card wrapper ─────────────────────────────────────── */
  .bc-card {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    box-shadow: 0 4px 16px rgba(0,0,0,0.07);
    cursor: pointer;
    transition: var(--bc-t);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .bc-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.13);
    border-color: transparent;
  }

  .bc-card--inactive { opacity: 0.55; filter: grayscale(40%); }

  /* ── Header / banner ──────────────────────────────────── */
  .bc-banner {
    position: relative;
    height: 110px;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  }

  .bc-banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.48) 100%);
  }

  /* Badges superiores */
  .bc-badges-tl {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 5px;
    z-index: 3;
  }

  .bc-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 50px;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.25);
    backdrop-filter: blur(6px);
  }

  .bc-badge--verified {
    background: rgba(16,185,129,0.88);
    color: #fff;
  }

  .bc-badge--plan-premium {
    background: rgba(245,158,11,0.92);
    color: #fff;
  }

  .bc-badge--plan-basique {
    background: rgba(59,130,246,0.88);
    color: #fff;
  }

  .bc-badge--plan-gratuit {
    background: rgba(107,114,128,0.80);
    color: #fff;
  }

  .bc-badge-tr {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
  }

  /* ── Logo ─────────────────────────────────────────────── */
  .bc-logo-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: -46px;
    margin-bottom: 0;
    z-index: 4;
    flex-shrink: 0;
  }

  .bc-logo {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #fff;
    outline: 3px solid rgba(255,255,255,0.5);
    outline-offset: 2px;
    box-shadow: 0 6px 22px rgba(0,0,0,0.18), 0 0 0 5px rgba(255,255,255,0.55);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--bc-t);
    flex-shrink: 0;
  }

  .bc-card:hover .bc-logo { transform: scale(1.06); }

  .bc-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .bc-logo-dot {
    position: absolute;
    bottom: 4px;
    right: calc(50% - 46px);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2.5px solid #fff;
    background: #10b981;
  }

  .bc-logo-dot--inactive { background: #9ca3af; }

  /* ── Body ─────────────────────────────────────────────── */
  .bc-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 16px 14px;
    flex: 1;
    min-height: 0;
  }

  .bc-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.08rem;
    font-weight: 800;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 4px;
    line-height: 1.25;
    /* degradado con el color temático */
    background: linear-gradient(135deg, var(--bc-color, #2563eb), var(--bc-color-dark, #1e40af));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bc-slogan {
    font-size: 0.76rem;
    color: #9ca3af;
    font-style: italic;
    text-align: center;
    margin: 0 0 10px;
    line-height: 1.4;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .bc-category-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 13px;
    border-radius: 50px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: 1.5px solid transparent;
    margin-bottom: 6px;
    flex-shrink: 0;
  }

  /* ── Estrellas ────────────────────────────────────────── */
  .bc-stars {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-bottom: 4px;
  }

  .bc-reviews {
    font-size: 0.70rem;
    color: #9ca3af;
    font-weight: 600;
  }

  /* ── Footer stats ─────────────────────────────────────── */
  .bc-footer {
    border-top: 1px solid #f1f5f9;
    background: #fafbfc;
    padding: 10px 14px;
    flex-shrink: 0;
  }

  .bc-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
  }

  .bc-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 4px;
    border-radius: 10px;
    transition: var(--bc-t);
  }

  .bc-stat:hover { background: #f1f5f9; }

  .bc-stat-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1px;
  }

  .bc-stat-value {
    font-size: 0.80rem;
    font-weight: 800;
    color: #111827;
    line-height: 1;
  }

  .bc-stat-label {
    font-size: 0.62rem;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 600;
  }

  /* ── Acciones hover (like / save / share / report) ────── */
  .bc-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    padding: 8px 14px 10px;
    border-top: 1px solid #f1f5f9;
    background: #fff;
    flex-shrink: 0;
  }

  .bc-act-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 50px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    color: #6b7280;
    font-size: 0.74rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--bc-t);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .bc-act-btn:hover { background: #f3f4f6; transform: translateY(-1px); }

  .bc-act-btn--liked {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #ef4444;
  }

  .bc-act-btn--saved {
    border-color: #fbbf24;
    color: #d97706;
    background: #fffbeb;
  }

  .bc-act-btn--report {
    border-color: transparent;
    background: transparent;
    color: #d1d5db;
    padding: 5px 8px;
  }

  .bc-act-btn--report:hover { color: #ef4444; background: #fef2f2; border-color: #fca5a5; }

  /* ── Share tooltip ────────────────────────────────────── */
  .bc-share-tooltip {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #111827;
    color: #fff;
    padding: 8px 18px;
    border-radius: 50px;
    font-size: 0.80rem;
    font-weight: 600;
    z-index: 9999;
    pointer-events: none;
    animation: bcToastIn 0.2s ease, bcToastOut 0.3s ease 1.7s forwards;
  }

  @keyframes bcToastIn  { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
  @keyframes bcToastOut { from { opacity:1; } to { opacity:0; } }

  /* ── Animación entrada card ───────────────────────────── */
  .bc-card { animation: bcFadeUp 0.3s ease both; }

  @keyframes bcFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Mobile ───────────────────────────────────────────── */
  @media (max-width: 480px) {
    .bc-banner  { height: 90px; }
    .bc-logo    { width: 78px; height: 78px; }
    .bc-logo-wrap { margin-top: -40px; }
    .bc-name    { font-size: 0.96rem; }
    .bc-body    { padding: 8px 12px 10px; }
    .bc-stats   { grid-template-columns: repeat(4, 1fr); gap: 2px; }
    .bc-stat-icon { width: 24px; height: 24px; border-radius: 6px; }
    .bc-stat-value { font-size: 0.74rem; }
  }
`;

/* ─── helpers ──────────────────────────────────────────────── */
const adjustColor = (hex, pct) => {
  try {
    const n = parseInt(hex.replace('#', ''), 16), a = Math.round(2.55 * pct);
    const r = Math.min(255, Math.max(0, (n >> 16) + a));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + a));
    const b = Math.min(255, Math.max(0, (n & 0xff) + a));
    return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
  } catch { return hex; }
};

const fmt = (n) => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'k' : String(n || 0);

const CATEGORY_COLORS = {
  automobiles: '#f97316', véhicules: '#f97316',
  informatique: '#06b6d4', téléphonie: '#06b6d4',
  maison: '#f59e0b', meubles: '#f59e0b',
  mode: '#ec4899', vêtements: '#ec4899',
  santé: '#10b981', beauté: '#10b981',
  immobilier: '#8b5cf6', alimentaire: '#f97316',
  sport: '#3b82f6', services: '#6366f1',
};

/* ─── Estrellas ─────────────────────────────────────────────── */
const Stars = ({ rating = 0 }) => {
  const stars = [];
  const r = Math.round(rating * 2) / 2;
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(r)) stars.push(<FaStar key={i} color="#f59e0b" size={11} />);
    else if (i === Math.ceil(r) && r % 1) stars.push(
      <span key={i} style={{ position:'relative', display:'inline-block', width:11, height:11 }}>
        <FaRegStar color="#d1d5db" size={11} />
        <FaStar color="#f59e0b" size={11} style={{ position:'absolute', top:0, left:0, clipPath:'inset(0 50% 0 0)' }} />
      </span>
    );
    else stars.push(<FaRegStar key={i} color="#d1d5db" size={11} />);
  }
  return <>{stars}</>;
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
const BoutiquePostCard = ({ boutique, showActions = true }) => {
  const history  = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(s => s);

  const [imageError,       setImageError]       = useState(false);
  const [showReportModal,  setShowReportModal]   = useState(false);
  const [isLiked,          setIsLiked]           = useState(false);
  const [isSaved,          setIsSaved]           = useState(false);
  const [showShareTooltip, setShowShareTooltip]  = useState(false);

  /* ── datos ── */
  const logo        = boutique.images?.[0]?.url || boutique.images?.[0] || null;
  const banner      = (!imageError && boutique.header_images?.[0]?.url) || (!imageError && boutique.header_images?.[0]) || null;
  const theme       = boutique.couleur_theme || CATEGORY_COLORS[(boutique.categorie || '').toLowerCase()] || '#2563eb';
  const themeDark   = adjustColor(theme, -20);

  const planLabel   = { premium:'Premium', basique:'Basique', gratuit:'Gratuit' }[boutique.plan] || 'Pro';
  const planClass   = `bc-badge--plan-${boutique.plan || 'gratuit'}`;

  /* ── handlers ── */
  const handleClick = (e) => {
    if (e.target.closest('.bc-act-btn')) return;
    history.push(`/boutique/${boutique._id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + `/boutique/${boutique._id}`);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const submitReport = () => {
    setShowReportModal(false);
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Boutique signalée. Merci!' } });
  };

  return (
    <>
      <style>{CARD_STYLES}</style>

      <div
        className={`bc-root`}
        style={{ '--bc-color': theme, '--bc-color-dark': themeDark }}
      >
        <div
          className={`bc-card ${!boutique.isActive ? 'bc-card--inactive' : ''}`}
          onClick={handleClick}
        >

          {/* ══ BANNER ══════════════════════════════════════ */}
          <div
            className="bc-banner"
            style={banner
              ? { backgroundImage: `url(${banner})` }
              : { background: `linear-gradient(135deg, ${theme} 0%, ${adjustColor(theme, 28)} 100%)` }
            }
          >
            {banner && <div className="bc-banner-overlay" />}

            {/* badge verificado */}
            <div className="bc-badges-tl">
              {boutique.isVerified && (
                <span className="bc-badge bc-badge--verified">
                  <FaCheckCircle size={9} />Vérifié
                </span>
              )}
            </div>

            {/* badge plan */}
            <div className="bc-badge-tr">
              <span className={`bc-badge ${planClass}`}>
                {boutique.plan === 'premium' && <FaCrown size={9} />}
                {planLabel}
              </span>
            </div>
          </div>

          {/* ══ LOGO ════════════════════════════════════════ */}
          <div className="bc-logo-wrap">
            <div className="bc-logo" style={{ borderColor: theme, outlineColor: `${theme}40` }}>
              {logo
                ? <img src={logo} alt={boutique.nom_boutique} onError={e => e.target.style.display='none'} />
                : <FaStore size={34} color={theme} />
              }
            </div>
            <div className={`bc-logo-dot ${!boutique.isActive ? 'bc-logo-dot--inactive' : ''}`} />
          </div>

          {/* ══ BODY ════════════════════════════════════════ */}
          <div className="bc-body">
            <h6 className="bc-name">{boutique.nom_boutique}</h6>

            {boutique.slogan_boutique && (
              <p className="bc-slogan">"{boutique.slogan_boutique}"</p>
            )}

            <span
              className="bc-category-pill"
              style={{
                background: `${theme}12`,
                color: theme,
                borderColor: `${theme}28`,
              }}
            >
              <FaTag size={9} />
              {boutique.categorie || 'Boutique'}
            </span>

            {boutique.stats?.notes > 0 && (
              <div className="bc-stars">
                <Stars rating={boutique.stats.notes} />
                <span className="bc-reviews ms-1">({boutique.stats.avis || 0})</span>
              </div>
            )}
          </div>

          {/* ══ STATS ═══════════════════════════════════════ */}
          <div className="bc-footer">
            <div className="bc-stats">
              {/* Produits */}
              <div className="bc-stat">
                <div className="bc-stat-icon" style={{ background:`${theme}14` }}>
                  <FaBoxes size={13} color={theme} />
                </div>
                <span className="bc-stat-value">{fmt(boutique.stats?.produits)}</span>
                <span className="bc-stat-label">Produits</span>
              </div>
              {/* Vues */}
              <div className="bc-stat">
                <div className="bc-stat-icon" style={{ background:'#e0f2fe' }}>
                  <FaEye size={13} color="#0ea5e9" />
                </div>
                <span className="bc-stat-value">{fmt(boutique.stats?.vues)}</span>
                <span className="bc-stat-label">Vues</span>
              </div>
              {/* Wilaya */}
              <div className="bc-stat">
                <div className="bc-stat-icon" style={{ background:'#fce7f3' }}>
                  <FaMapMarkerAlt size={12} color="#ec4899" />
                </div>
                <span className="bc-stat-value" style={{ fontSize:'0.65rem', textAlign:'center', lineHeight:1.2 }}>
                  {boutique.proprietaire?.wilaya || 'DZ'}
                </span>
                <span className="bc-stat-label">Ville</span>
              </div>
              {/* Date */}
              <div className="bc-stat">
                <div className="bc-stat-icon" style={{ background:'#f5f3ff' }}>
                  <FaClock size={12} color="#8b5cf6" />
                </div>
                <span className="bc-stat-value" style={{ fontSize:'0.65rem', textAlign:'center', lineHeight:1.2 }}>
                  {new Date(boutique.createdAt).toLocaleDateString('fr-FR', { month:'short', year:'2-digit' })}
                </span>
                <span className="bc-stat-label">Depuis</span>
              </div>
            </div>
          </div>

          {/* ══ ACTIONS ═════════════════════════════════════ */}
          {showActions && (
            <div className="bc-actions">
              <button
                className={`bc-act-btn ${isLiked ? 'bc-act-btn--liked' : ''}`}
                onClick={e => { e.stopPropagation(); setIsLiked(p => !p); }}
              >
                {isLiked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                J'aime
              </button>

              <button
                className={`bc-act-btn ${isSaved ? 'bc-act-btn--saved' : ''}`}
                onClick={e => { e.stopPropagation(); setIsSaved(p => !p); }}
              >
                {isSaved ? <FaBookmark size={12} /> : <FaRegBookmark size={12} />}
                Sauver
              </button>

              <button className="bc-act-btn" onClick={handleShare}>
                <FaShare size={11} />
                Partager
              </button>

              <button
                className="bc-act-btn bc-act-btn--report"
                onClick={e => { e.stopPropagation(); setShowReportModal(true); }}
                title="Signaler"
              >
                <FaFlag size={12} />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── Toast copié ─────────────────────────────────── */}
      {showShareTooltip && (
        <div className="bc-share-tooltip">✓ Lien copié !</div>
      )}

      {/* ── Modal signalement ───────────────────────────── */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom:'1px solid #f1f5f9', background:'#fafbfc' }}>
          <Modal.Title style={{ fontSize:'1rem', fontWeight:'800', fontFamily:'DM Sans,sans-serif' }}>
            Signaler la boutique
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding:'20px 24px' }}>
          <p style={{ fontSize:'0.88rem', color:'#4b5563', marginBottom:'14px' }}>
            Voulez-vous signaler <strong>{boutique.nom_boutique}</strong> ?
          </p>
          <Form.Group>
            <Form.Label style={{ fontSize:'0.82rem', fontWeight:'600', color:'#374151' }}>
              Raison du signalement
            </Form.Label>
            <Form.Select
              id="reportReason"
              style={{ borderRadius:'10px', border:'1.5px solid #e5e7eb', fontSize:'0.84rem', fontFamily:'DM Sans,sans-serif' }}
            >
              <option>Contenu inapproprié</option>
              <option>Boutique frauduleuse</option>
              <option>Spam ou publicité</option>
              <option>Autre raison</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ border:'none', background:'#fafbfc', padding:'12px 24px', gap:'8px' }}>
          <Button variant="light" onClick={() => setShowReportModal(false)}
            style={{ borderRadius:'10px', fontFamily:'DM Sans,sans-serif', fontWeight:'600', fontSize:'0.84rem' }}>
            Annuler
          </Button>
          <Button onClick={submitReport}
            style={{ borderRadius:'10px', background: theme, border:'none',
              fontFamily:'DM Sans,sans-serif', fontWeight:'700', fontSize:'0.84rem' }}>
            Signaler
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BoutiquePostCard;
