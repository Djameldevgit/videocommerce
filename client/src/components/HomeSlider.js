import React, { useState, useMemo, useCallback } from 'react';
import './HomeSlider.css';
const HomeSlider = ({
  categories = [],
  onCategoryClick,
  activeCategoryId = null
}) => {
  const [internalActiveId, setInternalActiveId] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  const activeId =
    activeCategoryId ?? internalActiveId;

  // ===============================
  // IMAGE RESOLVER OPTIMIZADO
  // ===============================
  const getImageUrl = useCallback(
    (category) => {
      if (!category) return null;

      const slugUrl = `/categories/${category.slug}/${category.slug}.png`;

      return category.imageUrl || slugUrl;
    },
    []
  );

  // ===============================
  // CLICK OPTIMIZADO
  // ===============================
  const handleClick = useCallback(
    (cat) => {
      setInternalActiveId(cat._id);
      onCategoryClick?.(cat);
    },
    [onCategoryClick]
  );

  // ===============================
  // ERROR IMAGES OPTIMIZADO
  // ===============================
  const handleImageError = useCallback(
    (id, url) => {
      setFailedImages(prev => ({
        ...prev,
        [id]: true
      }));
    },
    []
  );

  // ===============================
  // MEMO CATEGORIES (CRÍTICO)
  // ===============================
  const renderedCategories = useMemo(
    () =>
      categories.map(cat => {
        const imageUrl = getImageUrl(cat);
        const isActive = activeId === cat._id;
        const initial = cat.name?.[0] || '?';

        return (
          <button
            key={cat._id}
            className={`catslider-item ${isActive ? 'active' : ''}`}
            onClick={() => handleClick(cat)}
          >
            <div className="catslider-ring">
              <div className="catslider-inner">

                {imageUrl && !failedImages[cat._id] ? (
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    loading="lazy"
                    onError={() =>
                      handleImageError(cat._id, imageUrl)
                    }
                  />
                ) : (
                  <span className="catslider-initial">
                    {initial}
                  </span>
                )}
              </div>

              <span className="catslider-dot" />
            </div>

            <span className="catslider-label">
              {cat.name}
            </span>
          </button>
        );
      }),
    [
      categories,
      activeId,
      failedImages,
      handleClick,
      getImageUrl,
      handleImageError
    ]
  );

  if (!categories?.length) return null;

  return (
    <div className="catslider-row">
      {renderedCategories}
    </div>
  );
};

export default React.memo(HomeSlider);