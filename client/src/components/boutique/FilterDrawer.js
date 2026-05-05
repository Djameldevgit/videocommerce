 
import React, { useState } from 'react';
import { Form, Button, Badge } from 'react-bootstrap';
import {
  FaTimes, FaSearch, FaFilter, FaChevronDown, FaChevronUp,
  FaStore, FaTag, FaMoneyBillWave, FaStar, FaMapMarkerAlt,
  FaBoxOpen, FaCheck
} from 'react-icons/fa';

/* ═══════════════════════════════════════════════════════════════
   ESTILOS INTEGRADOS
   ═══════════════════════════════════════════════════════════════ */
const DRAWER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  .fd-root {
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
    --fd-transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Búsqueda ─────────────────────────────────────────── */
  .fd-search-wrap {
    position: relative;
    margin-bottom: 20px;
  }

  .fd-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
    font-size: 13px;
  }

  .fd-search-input {
    width: 100%;
    height: 40px;
    border-radius: 12px;
    border: 1.5px solid #e5e7eb;
    background: #f9fafb;
    padding: 0 14px 0 38px;
    font-size: 0.83rem;
    font-family: 'DM Sans', sans-serif;
    color: #374151;
    outline: none;
    transition: var(--fd-transition);
  }

  .fd-search-input:focus {
    background: #fff;
    border-color: var(--fd-theme, #2563eb);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--fd-theme, #2563eb) 15%, transparent);
  }

  .fd-search-input::placeholder { color: #c1c7d0; }

  /* ── Sección de filtro con acordeón ───────────────────── */
  .fd-section {
    border-bottom: 1px solid #f1f5f9;
    overflow: hidden;
  }

  .fd-section:last-of-type { border-bottom: none; }

  .fd-section-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #111827;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    transition: var(--fd-transition);
    text-align: left;
  }

  .fd-section-header:hover { color: var(--fd-theme, #2563eb); }

  .fd-section-header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .fd-section-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
    transition: var(--fd-transition);
  }

  .fd-section-body {
    padding-bottom: 14px;
    animation: fdSlideDown 0.2s ease;
  }

  @keyframes fdSlideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Category card (boutique) ────────────────────────── */
  .fd-category-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1.5px solid transparent;
    transition: var(--fd-transition);
  }

  .fd-category-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .fd-category-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  .fd-category-hint {
    font-size: 0.72rem;
    color: #9ca3af;
    margin: 2px 0 0;
  }

  /* ── Checkboxes personalizados ────────────────────────── */
  .fd-check-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .fd-check-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: var(--fd-transition);
    border: 1.5px solid transparent;
  }

  .fd-check-item:hover { background: #f9fafb; }

  .fd-check-item--active {
    border-color: color-mix(in srgb, var(--fd-theme, #2563eb) 25%, transparent) !important;
    background: color-mix(in srgb, var(--fd-theme, #2563eb) 6%, transparent) !important;
  }

  .fd-checkbox {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--fd-transition);
    background: #fff;
  }

  .fd-checkbox--checked {
    border-color: var(--fd-theme, #2563eb);
    background: var(--fd-theme, #2563eb);
  }

  .fd-radio {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--fd-transition);
    background: #fff;
  }

  .fd-radio--checked {
    border-color: var(--fd-theme, #2563eb);
  }

  .fd-radio-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--fd-theme, #2563eb);
    transform: scale(0);
    transition: transform 0.18s ease;
  }

  .fd-radio--checked .fd-radio-dot { transform: scale(1); }

  .fd-check-label {
    font-size: 0.84rem;
    font-weight: 500;
    color: #374151;
    flex: 1;
  }

  .fd-check-count {
    font-size: 0.70rem;
    color: #9ca3af;
    background: #f3f4f6;
    padding: 1px 7px;
    border-radius: 20px;
    font-weight: 600;
  }

  /* ── Rango de precio ──────────────────────────────────── */
  .fd-price-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
  }

  .fd-price-input {
    height: 38px;
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    background: #f9fafb;
    padding: 0 12px;
    font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
    color: #374151;
    outline: none;
    width: 100%;
    transition: var(--fd-transition);
  }

  .fd-price-input:focus {
    background: #fff;
    border-color: var(--fd-theme, #2563eb);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--fd-theme, #2563eb) 12%, transparent);
  }

  .fd-price-sep { font-size: 0.75rem; color: #9ca3af; text-align: center; }

  /* ── Select wilaya ────────────────────────────────────── */
  .fd-select {
    width: 100%;
    height: 40px;
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    background: #f9fafb;
    padding: 0 12px;
    font-size: 0.83rem;
    font-family: 'DM Sans', sans-serif;
    color: #374151;
    outline: none;
    cursor: pointer;
    transition: var(--fd-transition);
    appearance: none;
  }

  .fd-select:focus {
    background: #fff;
    border-color: var(--fd-theme, #2563eb);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--fd-theme, #2563eb) 12%, transparent);
  }

  /* ── Estado chips (filtros activos) ───────────────────── */
  .fd-active-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
  }

  .fd-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px 4px 10px;
    border-radius: 50px;
    font-size: 0.73rem;
    font-weight: 600;
    background: color-mix(in srgb, var(--fd-theme, #2563eb) 10%, transparent);
    color: var(--fd-theme, #2563eb);
    border: 1px solid color-mix(in srgb, var(--fd-theme, #2563eb) 22%, transparent);
    cursor: pointer;
    transition: var(--fd-transition);
  }

  .fd-chip:hover { background: color-mix(in srgb, var(--fd-theme, #2563eb) 18%, transparent); }

  .fd-chip-x { font-size: 10px; opacity: 0.7; }

  /* ── Footer con acciones ──────────────────────────────── */
  .fd-footer {
    display: flex;
    gap: 10px;
    padding-top: 18px;
    border-top: 1px solid #f1f5f9;
    margin-top: 8px;
  }

  .fd-btn-clear {
    flex: 1;
    height: 40px;
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    color: #6b7280;
    font-size: 0.83rem;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: var(--fd-transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
  }

  .fd-btn-clear:hover { background: #fef2f2; color: #ef4444; border-color: #fca5a5; }

  .fd-btn-apply {
    flex: 1;
    height: 40px;
    border-radius: 10px;
    border: none;
    color: #fff;
    font-size: 0.83rem;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: var(--fd-transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    box-shadow: 0 3px 10px color-mix(in srgb, var(--fd-theme, #2563eb) 35%, transparent);
  }

  .fd-btn-apply:hover { filter: brightness(1.08); transform: translateY(-1px); }
`;

/* ─── Datos constantes ─────────────────────────────────────── */
const ETAT_OPTIONS = [
  { value: 'neuf',       label: 'Neuf' },
  { value: 'comme-neuf', label: 'Comme neuf' },
  { value: 'bon-etat',   label: 'Bon état' },
  { value: 'correct',    label: 'Correct' },
];

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
  'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane',
];

/* ─── Sub-componente: sección plegable ──────────────────────── */
const Section = ({ icon, iconBg, label, badge, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fd-section">
      <button className="fd-section-header" onClick={() => setOpen(p => !p)}>
        <span className="fd-section-header-left">
          <span className="fd-section-icon" style={{ background: iconBg || '#f3f4f6', color: icon ? '#6b7280' : undefined }}>
            {icon}
          </span>
          {label}
          {badge != null && badge > 0 && (
            <span style={{
              background:'var(--fd-theme,#2563eb)', color:'#fff',
              borderRadius:'50%', width:'18px', height:'18px',
              fontSize:'0.65rem', fontWeight:'800',
              display:'inline-flex', alignItems:'center', justifyContent:'center'
            }}>{badge}</span>
          )}
        </span>
        {open ? <FaChevronUp size={11} color="#9ca3af" /> : <FaChevronDown size={11} color="#9ca3af" />}
      </button>
      {open && <div className="fd-section-body">{children}</div>}
    </div>
  );
};

/* ─── Sub-componente: ítem checkbox ────────────────────────── */
const CheckItem = ({ label, count, checked, onChange, radio }) => (
  <div className={`fd-check-item ${checked ? 'fd-check-item--active' : ''}`} onClick={onChange}>
    {radio ? (
      <div className={`fd-radio ${checked ? 'fd-radio--checked' : ''}`}>
        <div className="fd-radio-dot" />
      </div>
    ) : (
      <div className={`fd-checkbox ${checked ? 'fd-checkbox--checked' : ''}`}>
        {checked && <FaCheck size={9} color="#fff" />}
      </div>
    )}
    <span className="fd-check-label">{label}</span>
    {count != null && <span className="fd-check-count">{count}</span>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════════════════════════════════════════════════ */
const FilterDrawer = ({
  isDesktop,
  isMobile,
  onHide,
  filters = {},
  onFilterChange,
  subCategories = [],
  articleTypes  = [],
  activeFiltersCount = 0,
  onClearFilters,
  boutiqueTheme = '#2563eb',
  boutique,
  boutiqueCategory,
}) => {

  const theme = boutiqueTheme;

  /* chips de filtros activos (para visualizar selecciones) */
  const activeChips = [];
  if (filters.search) activeChips.push({ key: 'search', label: `"${filters.search}"`, clear: () => onFilterChange('search', '') });
  if (filters.articleType && filters.articleType !== 'all') {
    const t = articleTypes.find(x => x.value === filters.articleType);
    activeChips.push({ key: 'type', label: t?.label || filters.articleType, clear: () => onFilterChange('articleType', 'all') });
  }
  filters.etat?.forEach(e => {
    const opt = ETAT_OPTIONS.find(o => o.value === e);
    activeChips.push({ key: `etat-${e}`, label: opt?.label || e, clear: () => onFilterChange('etat', e) });
  });
  if (filters.minPrice || filters.maxPrice) {
    activeChips.push({ key:'price', label: `${filters.minPrice||'0'} – ${filters.maxPrice||'∞'} DA`, clear: () => onFilterChange('price', { minPrice:'', maxPrice:'' }) });
  }
  if (filters.wilaya) {
    activeChips.push({ key:'wilaya', label: filters.wilaya, clear: () => onFilterChange('wilaya', '') });
  }

  const content = (
    <div className="fd-root" style={{ '--fd-theme': theme }}>
      <style>{DRAWER_STYLES}</style>

      {/* ── Búsqueda ────────────────────────────────────── */}
      <div className="fd-search-wrap">
        <FaSearch className="fd-search-icon" />
        <input
          type="text"
          className="fd-search-input"
          placeholder={`Rechercher dans ${boutique?.nom_boutique || 'la boutique'}...`}
          value={filters.search || ''}
          onChange={e => onFilterChange('search', e.target.value)}
        />
      </div>

      {/* ── Chips filtros activos ──────────────────────── */}
      {activeChips.length > 0 && (
        <div className="fd-active-chips">
          {activeChips.map(chip => (
            <span key={chip.key} className="fd-chip" onClick={chip.clear}>
              {chip.label}
              <FaTimes className="fd-chip-x" />
            </span>
          ))}
        </div>
      )}

      {/* ── Categoría de la boutique (info fija) ──────── */}
      {boutiqueCategory && (
        <Section
          icon={<FaStore size={12} />}
          iconBg={`${theme}18`}
          label="Catégorie"
          defaultOpen
        >
          <div className="fd-category-card" style={{
            background: `${theme}08`,
            borderColor: `${theme}25`,
          }}>
            <div className="fd-category-icon-wrap" style={{ background: theme }}>
              <FaStore size={18} />
            </div>
            <div>
              <p className="fd-category-name">{boutiqueCategory.name}</p>
              <p className="fd-category-hint">Catégorie principale</p>
            </div>
          </div>
        </Section>
      )}

      {/* ── Sous-catégories ───────────────────────────── */}
      {subCategories.length > 0 && (
        <Section
          icon={<FaTag size={11} />}
          iconBg="#f0fdf4"
          label="Sous-catégories"
          badge={filters.subCategories?.length}
        >
          <div className="fd-check-list">
            {subCategories.map(sub => (
              <CheckItem
                key={sub._id}
                label={sub.name}
                count={sub.count}
                checked={filters.subCategories?.includes(sub._id)}
                onChange={() => onFilterChange('subCategories', sub._id)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* ── Type d'article ────────────────────────────── */}
      {articleTypes.length > 1 && (
        <Section
          icon={<FaBoxOpen size={11} />}
          iconBg="#fffbeb"
          label="Type d'article"
          badge={filters.articleType !== 'all' ? 1 : 0}
        >
          <div className="fd-check-list">
            <CheckItem
              label="Tous les types"
              checked={filters.articleType === 'all'}
              onChange={() => onFilterChange('articleType', 'all')}
              radio
            />
            {articleTypes.map(t => (
              <CheckItem
                key={t.value}
                label={t.label}
                checked={filters.articleType === t.value}
                onChange={() => onFilterChange('articleType', t.value)}
                radio
              />
            ))}
          </div>
        </Section>
      )}

      {/* ── Prix ──────────────────────────────────────── */}
      <Section
        icon={<FaMoneyBillWave size={11} />}
        iconBg="#f0fdf4"
        label="Prix (DA)"
        badge={(filters.minPrice || filters.maxPrice) ? 1 : 0}
      >
        <div className="fd-price-row">
          <input
            type="number"
            className="fd-price-input"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={e => onFilterChange('price', { minPrice: e.target.value, maxPrice: filters.maxPrice })}
          />
          <span className="fd-price-sep">–</span>
          <input
            type="number"
            className="fd-price-input"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={e => onFilterChange('price', { minPrice: filters.minPrice, maxPrice: e.target.value })}
          />
        </div>
      </Section>

      {/* ── État ──────────────────────────────────────── */}
      <Section
        icon={<FaStar size={11} />}
        iconBg="#fefce8"
        label="État"
        badge={filters.etat?.length}
      >
        <div className="fd-check-list">
          {ETAT_OPTIONS.map(opt => (
            <CheckItem
              key={opt.value}
              label={opt.label}
              checked={filters.etat?.includes(opt.value)}
              onChange={() => onFilterChange('etat', opt.value)}
            />
          ))}
        </div>
      </Section>

      {/* ── Wilaya ────────────────────────────────────── */}
      <Section
        icon={<FaMapMarkerAlt size={11} />}
        iconBg="#fdf2f8"
        label="Wilaya"
        badge={filters.wilaya ? 1 : 0}
        defaultOpen={false}
      >
        <div style={{ position:'relative' }}>
          <select
            className="fd-select"
            value={filters.wilaya || ''}
            onChange={e => onFilterChange('wilaya', e.target.value)}
          >
            <option value="">Toutes les wilayas</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <FaChevronDown size={11} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', color:'#9ca3af', pointerEvents:'none' }} />
        </div>
      </Section>

      {/* ── Footer ────────────────────────────────────── */}
      <div className="fd-footer">
        <button className="fd-btn-clear" onClick={onClearFilters}>
          <FaTimes size={12} />
          Effacer
        </button>
        {!isDesktop && (
          <button
            className="fd-btn-apply"
            style={{ background: theme }}
            onClick={onHide}
          >
            <FaSearch size={12} />
            Voir {activeFiltersCount > 0 ? activeFiltersCount : 'les'} résultat{activeFiltersCount > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );

  return content;
};

export default FilterDrawer;
