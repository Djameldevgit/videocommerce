// src/components/CategorySlider.jsx
import React, { useState } from 'react';
import './CategorySlider.css';

const CategorySlider = ({ categories = [], onCategoryClick }) => {
  const [activeId,     setActiveId]     = useState(null); // null = "Tout"
  const [failedImages, setFailedImages] = useState({});

  /* ── Lógica original sin cambios ─────────────────── */
  const handleImageError = (categoryId, imageUrl) => {
    setFailedImages(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), imageUrl],
    }));
  };

  const getImageUrl = (category) => {
    if (!category) return null;

    const defaultUrl =
      category.imageUrl ||
      (category.slug ? `/categories/${category.slug}/${category.slug}.png` : null);

    if (defaultUrl && failedImages[category._id]?.includes(defaultUrl)) {
      return null;
    }
    if (category.imageUrl && !failedImages[category._id]?.includes(category.imageUrl)) {
      return category.imageUrl;
    }
    if (category.slug) {
      const slugUrl = `/categories/${category.slug}/${category.slug}.png`;
      if (!failedImages[category._id]?.includes(slugUrl)) return slugUrl;
    }
    return null;
  };
  /* ─────────────────────────────────────────────────── */

  const handleClick = (cat) => {
    setActiveId(cat ? cat._id : null);
    onCategoryClick?.(cat);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div
      className="catslider-row"
      role="navigation"
      aria-label="Filtrer par catégorie"
    >
      {/* Chip "Tout" */}
      <button
        className={`catslider-item${activeId === null ? ' active' : ''}`}
        onClick={() => handleClick(null)}
        aria-pressed={activeId === null}
      >
        <div className="catslider-ring">
          <div className="catslider-inner catslider-inner--all">
            <span className="catslider-initial">✦</span>
          </div>
          <span className="catslider-dot" aria-hidden="true" />
        </div>
        <span className="catslider-label">Tout</span>
      </button>

      {/* Categorías */}
      {categories.map((cat) => {
        const imageUrl = getImageUrl(cat);
        const hasImage = imageUrl !== null;
        const isActive = activeId === cat._id;
        const initial  = cat.name?.charAt(0).toUpperCase() || '?';

        return (
          <button
            key={cat._id}
            className={`catslider-item${isActive ? ' active' : ''}`}
            onClick={() => handleClick(cat)}
            aria-pressed={isActive}
          >
            <div className="catslider-ring">
              <div className="catslider-inner">
                {hasImage ? (
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    onError={() => handleImageError(cat._id, imageUrl)}
                  />
                ) : (
                  <span className="catslider-initial">{initial}</span>
                )}
              </div>
              <span className="catslider-dot" aria-hidden="true" />
            </div>
            <span className="catslider-label">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategorySlider;