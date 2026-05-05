import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import CouleurField from '../camposComun/CouleurField';
import MarqueField from '../camposComun/MarqueField';
import TailleField from '../camposComun/TailleField';

const VetementsFields = ({ fieldName, postData, handleChangeInput,mainCategory, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'vetements_homme': ['typeVetement', 'taille', 'couleur', 'marque', 'matiere', 'etat'],
      'vetements_femme': ['typeVetement', 'taille', 'couleur', 'marque', 'matiere', 'etat'],
      'chaussures_homme': ['typeChaussure', 'pointure', 'couleur', 'marque', 'matiere', 'etat'],
      'chaussures_femme': ['typeChaussure', 'pointure', 'couleur', 'marque', 'hauteurTalon', 'etat'],
      'garcons': ['typeVetement', 'taille', 'couleur', 'ageCible', 'etat'],
      'filles': ['typeVetement', 'taille', 'couleur', 'ageCible', 'etat'],
      'bebe': ['typeVetement', 'taille', 'couleur', 'ageMois', 'etat'],
      'tenues_pro': ['typeTenue', 'taille', 'couleur', 'etat'],
      'sacs': ['typeSac', 'couleur', 'marque', 'matiere', 'etat'],
      'montres': ['marque', 'couleur', 'materielBracelet', 'etat'],
      'lunettes': ['couleurMonture', 'marque', 'etat'],
      'bijoux': ['typeBijou', 'couleur', 'pierre', 'matiere', 'etat']
    };
    
    return specificFields[subCategory] || [];
  };
  
  // FUNCIONES AUXILIARES
  const getColorsForCategory = (category) => {
    const colorOptions = {
      base: [
        { value: 'noir', label: '⚫ Noir', emoji: '⚫' },
        { value: 'blanc', label: '⚪ Blanc', emoji: '⚪' },
        { value: 'gris', label: '⚪ Gris', emoji: '⚪' },
        { value: 'beige', label: '🟤 Beige', emoji: '🟤' },
        { value: 'marron', label: '🟤 Marron', emoji: '🟤' },
        { value: 'bleu', label: '🔵 Bleu', emoji: '🔵' },
        { value: 'bleu_fonce', label: '🔵 Bleu foncé', emoji: '🔵' },
        { value: 'bleu_ciel', label: '🔵 Bleu ciel', emoji: '🔵' },
        { value: 'vert', label: '🟢 Vert', emoji: '🟢' },
        { value: 'rouge', label: '🔴 Rouge', emoji: '🔴' },
        { value: 'rose', label: '🌸 Rose', emoji: '🌸' },
        { value: 'violet', label: '🟣 Violet', emoji: '🟣' },
        { value: 'jaune', label: '🟡 Jaune', emoji: '🟡' },
        { value: 'orange', label: '🟠 Orange', emoji: '🟠' },
        { value: 'multicolore', label: '🌈 Multicolore', emoji: '🌈' }
      ],
      homme: [
        { value: 'noir', label: '⚫ Noir' },
        { value: 'bleu_fonce', label: '🔵 Bleu foncé' },
        { value: 'gris', label: '⚪ Gris' },
        { value: 'marron', label: '🟤 Marron' },
        { value: 'vert_fonce', label: '🟢 Vert foncé' },
        { value: 'blanc', label: '⚪ Blanc' },
        { value: 'beige', label: '🟤 Beige' },
        { value: 'bleu_marine', label: '🔵 Bleu marine' },
        { value: 'kaki', label: '🟢 Kaki' }
      ],
      femme: [
        { value: 'noir', label: '⚫ Noir' },
        { value: 'blanc', label: '⚪ Blanc' },
        { value: 'rose', label: '🌸 Rose' },
        { value: 'rouge', label: '🔴 Rouge' },
        { value: 'bleu_ciel', label: '🔵 Bleu ciel' },
        { value: 'violet', label: '🟣 Violet' },
        { value: 'vert_menthe', label: '🟢 Vert menthe' },
        { value: 'jaune', label: '🟡 Jaune' },
        { value: 'corail', label: '🟠 Corail' },
        { value: 'lavande', label: '🟣 Lavande' }
      ],
      chaussures: [
        { value: 'noir', label: '⚫ Noir' },
        { value: 'blanc', label: '⚪ Blanc' },
        { value: 'marron', label: '🟤 Marron' },
        { value: 'bleu', label: '🔵 Bleu' },
        { value: 'gris', label: '⚪ Gris' },
        { value: 'rouge', label: '🔴 Rouge' },
        { value: 'multicolore', label: '🌈 Multicolore' },
        { value: 'metal', label: '⚙️ Métallisé' },
        { value: 'beige', label: '🟤 Beige' },
        { value: 'vert', label: '🟢 Vert' }
      ],
      bijoux: [
        { value: 'or_jaune', label: '💰 Or jaune' },
        { value: 'or_blanc', label: '⚪ Or blanc' },
        { value: 'or_rose', label: '🌸 Or rose' },
        { value: 'argent_925', label: '💿 Argent 925' },
        { value: 'platine', label: '⚪ Platine' },
        { value: 'acier_inox', label: '⚙️ Acier inoxydable' },
        { value: 'titanium', label: '🛡️ Titane' },
        { value: 'palladium', label: '🔬 Palladium' }
      ],
      sacs: [
        { value: 'noir', label: '⚫ Noir' },
        { value: 'marron', label: '🟤 Marron' },
        { value: 'beige', label: '🟤 Beige' },
        { value: 'rouge', label: '🔴 Rouge' },
        { value: 'bleu', label: '🔵 Bleu' },
        { value: 'vert', label: '🟢 Vert' },
        { value: 'multicolore', label: '🌈 Multicolore' },
        { value: 'imprime', label: '🎨 Imprimé' },
        { value: 'metalise', label: '✨ Métallisé' }
      ],
      lunettes: [
        { value: 'noir', label: '⚫ Noir' },
        { value: 'marron', label: '🟤 Marron/Tortue' },
        { value: 'or', label: '💰 Or' },
        { value: 'argent', label: '💿 Argent' },
        { value: 'rose', label: '🌸 Rose' },
        { value: 'bleu', label: '🔵 Bleu' },
        { value: 'transparent', label: '🔍 Transparent' },
        { value: 'rouge', label: '🔴 Rouge' },
        { value: 'vert', label: '🟢 Vert' }
      ]
    };
    
    if (category?.includes('homme')) return colorOptions.homme;
    if (category?.includes('femme') && !category?.includes('chaussures')) return colorOptions.femme;
    if (category?.includes('chaussures')) return colorOptions.chaussures;
    if (category?.includes('bijoux') || category?.includes('montres')) return colorOptions.bijoux;
    if (category?.includes('sacs')) return colorOptions.sacs;
    if (category?.includes('lunettes')) return colorOptions.lunettes;
    return colorOptions.base;
  };
  
  const getTailleOptions = (category) => {
    if (category?.includes('bebe')) {
      return [
        { value: 'premature', label: '👶 Prématuré' },
        { value: '0-3mois', label: '👶 0-3 mois' },
        { value: '3-6mois', label: '👶 3-6 mois' },
        { value: '6-9mois', label: '👶 6-9 mois' },
        { value: '9-12mois', label: '👶 9-12 mois' },
        { value: '12-18mois', label: '👶 12-18 mois' },
        { value: '18-24mois', label: '👶 18-24 mois' },
        { value: '2T', label: '👶 2 ans' }
      ];
    }
    
    if (category?.includes('garcons')) {
      return [
        { value: '2-3ans', label: '👦 2-3 ans' },
        { value: '4-5ans', label: '👦 4-5 ans' },
        { value: '6-7ans', label: '👦 6-7 ans' },
        { value: '8-9ans', label: '👧 8-9 ans' },
        { value: '10-11ans', label: '🧒 10-11 ans' },
        { value: '12-13ans', label: '🧒 12-13 ans' },
        { value: '14-15ans', label: '🧑 14-15 ans' },
        { value: '16ans+', label: '🧑 16 ans et plus' }
      ];
    }
    
    if (category?.includes('filles')) {
      return [
        { value: '2-3ans', label: '👧 2-3 ans' },
        { value: '4-5ans', label: '👧 4-5 ans' },
        { value: '6-7ans', label: '👧 6-7 ans' },
        { value: '8-9ans', label: '👧 8-9 ans' },
        { value: '10-11ans', label: '👧 10-11 ans' },
        { value: '12-13ans', label: '👧 12-13 ans' },
        { value: '14-15ans', label: '👩 14-15 ans' },
        { value: '16ans+', label: '👩 16 ans et plus' }
      ];
    }
    
    // Tailles adultes standard
    return [
      { value: 'XS', label: 'XS (Extra Small)' },
      { value: 'S', label: 'S (Small)' },
      { value: 'M', label: 'M (Medium)' },
      { value: 'L', label: 'L (Large)' },
      { value: 'XL', label: 'XL (Extra Large)' },
      { value: 'XXL', label: 'XXL (Double Extra Large)' },
      { value: '3XL', label: '3XL (Triple Extra Large)' },
      { value: '4XL', label: '4XL' },
      { value: '5XL', label: '5XL' },
      { value: 'sur_mesure', label: '✂️ Sur mesure/Taille spéciale' }
    ];
  };
  
  const fields = {
    // 1. ETAT (común a todos)
    'etat': (
      <Form.Group key="etat">
        <Form.Label>🏷️ {t('condition', 'État')}</Form.Label>
        <Form.Select
          name="etat"
          value={postData.etat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez l\'état')}</option>
          <option value="neuf_etiquette">🆕 Neuf avec étiquettes</option>
          <option value="neuf_sans_etiquette">🆕 Neuf sans étiquettes</option>
          <option value="tres_bon_etat">👍 Très bon état (presque neuf)</option>
          <option value="bon_etat">✅ Bon état (quelques signes d\'usure légers)</option>
          <option value="etat_moyen">🔄 État moyen (signes d\'usure visibles)</option>
          <option value="a_retoucher">🪡 À retoucher/réparer</option>
          <option value="vintage">🕰️ Vintage/Collection</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // 2. TAILLE
    'taille': (
       <TailleField
       key={`taille_${subCategory}`}
       selectedCategory={mainCategory}        // ✅ Usar la categoría que viene del padre
       selectedSubCategory={subCategory}      // ✅ La subcategoría actual
       postData={postData}
       handleChangeInput={handleChangeInput}
       isRTL={isRTL}
       t={t}
       name="taille"
       label="taille"
       
       
       
       />



        
    ),
    'couleur': (
      <CouleurField
        key={`couleur_${subCategory}`}
        selectedCategory={mainCategory}        // ✅ Usar la categoría que viene del padre
        selectedSubCategory={subCategory}      // ✅ La subcategoría actual
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
        name="couleur"
        label="couleur"
      />
    ),
    // 3. COULEUR CON MEJORAS
    
    // 4. MARQUE
    'marque': (
      <MarqueField
        key={`marque_${subCategory}`}
        selectedCategory={mainCategory}        // ✅ Usar la categoría que viene del padre
        selectedSubCategory={subCategory}      // ✅ La subcategoría actual
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
        name="marque"
        label="Marque"
      />
    ),
    
    // 5. MATIERE
    'matiere': (
      <Form.Group key="matiere">
        <Form.Label>🧵 {t('material', 'Matière')}</Form.Label>
        <Form.Select
          name="matiere"
          value={postData.matiere || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_material', 'Sélectionnez matière')}</option>
          
          <optgroup label="🌿 Naturelles">
            <option value="coton">🧵 Coton</option>
            <option value="lin">🌿 Lin</option>
            <option value="chanvre">🌿 Chanvre</option>
            <option value="soie">🦋 Soie</option>
            <option value="cachemire">🧶 Cachemire</option>
            <option value="laine_mouton">🐑 Laine de mouton</option>
            <option value="laine_mohair">🐐 Mohair</option>
            <option value="laine_angora">🐰 Angora</option>
            <option value="alpaga">🦙 Alpaga</option>
            <option value="cuir_vrai">🐄 Cuir véritable</option>
            <option value="cuir_daim">🦌 Daim/Nubuck</option>
          </optgroup>
          
          <optgroup label="🧪 Synthétiques">
            <option value="polyester">🧪 Polyester</option>
            <option value="nylon">🎽 Nylon</option>
            <option value="acrylique">🔬 Acrylique</option>
            <option value="viscose">🌳 Viscose/Rayon</option>
            <option value="elasthanne">🌀 Elasthanne/Spandex</option>
            <option value="polyamide">🔬 Polyamide</option>
            <option value="cuir_synthetique">🧪 Cuir synthétique</option>
            <option value="microfibre">🔬 Microfibre</option>
          </optgroup>
          
          <optgroup label="🎨 Tissus spéciaux">
            <option value="jean_denim">👖 Jean/Denim</option>
            <option value="velours_cotele">🟤 Velours côtelé</option>
            <option value="velours_chemille">🟤 Velours chemille</option>
            <option value="satin">✨ Satin</option>
            <option value="dentelle">🧵 Dentelle</option>
            <option value="tulle">👰 Tulle</option>
            <option value="organza">✨ Organza</option>
            <option value="chiffon">💃 Chiffon</option>
            <option value="crepe">🌀 Crêpe</option>
            <option value="jersey">👕 Jersey</option>
            <option value="tweed">🧵 Tweed</option>
            <option value="velours_coupe">🟤 Velours coupé</option>
          </optgroup>
          
          {(subCategory?.includes('sacs')) && (
            <optgroup label="👜 Matières sacs">
              <option value="cuir_pleine_fleur">🐄 Cuir pleine fleur</option>
              <option value="cuir_vege">🌿 Cuir végétal</option>
              <option value="toile_enduite">🎒 Toile enduite</option>
              <option value="nylon_renforce">🛡️ Nylon renforcé</option>
              <option value="polyester_ripstop">✂️ Polyester ripstop</option>
              <option value="paille">🌾 Paille/Rotin</option>
              <option value="tissu_technique">🔬 Tissu technique</option>
            </optgroup>
          )}
          
          <option value="mixte">🔄 Mixte (plusieurs matières)</option>
          <option value="inconnue">❓ Matière inconnue</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // 6. TYPE VETEMENT (ya está completo)
    'typeVetement': (
      <Form.Group key="typeVetement">
        <Form.Label>👕 {t('clothing_type', 'Type de vêtement')}</Form.Label>
        <Form.Select
          name="typeVetement"
          value={postData.typeVetement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_type', 'Sélectionnez type')}</option>
          
          {subCategory?.includes('homme') && (
            <optgroup label="👔 Vêtements Homme">
              <option value="costume_2p">👔 Costume 2 pièces</option>
              <option value="costume_3p">👔 Costume 3 pièces</option>
              <option value="veste_costume">👔 Veste de costume</option>
              <option value="pantalon_costume">👖 Pantalon de costume</option>
              <option value="chemise_formelle">👔 Chemise formelle</option>
              <option value="chemise_casual">👕 Chemise casual</option>
              <option value="chemise_manches_courtes">👕 Chemise manches courtes</option>
              <option value="t_shirt_basique">👕 T-shirt basique</option>
              <option value="t_shirt_graphique">🎨 T-shirt graphique</option>
              <option value="polo">👕 Polo</option>
              <option value="sweat_shirt">🧥 Sweat-shirt</option>
              <option value="pull_over">🧶 Pull-over</option>
              <option value="pull_col_roule">🧶 Pull col roulé</option>
              <option value="gilet">🧥 Gilet</option>
              <option value="blouson_cuir">🧥 Blouson cuir</option>
              <option value="blouson_bomber">🧥 Blouson bomber</option>
              <option value="veste_doudoune">🧥 Veste doudoune</option>
              <option value="manteau">🧥 Manteau</option>
              <option value="trench_coat">🧥 Trench coat</option>
              <option value="pantalon_jean">👖 Jeans</option>
              <option value="pantalon_chino">👖 Chino/Pantalon casual</option>
              <option value="pantalon_jogging">🩳 Pantalon jogging</option>
              <option value="short_casual">🩳 Short casual</option>
              <option value="short_bain">🩳 Short de bain</option>
              <option value="maillot_bain">🩳 Maillot de bain</option>
              <option value="calecon">🩲 Caleçon</option>
              <option value="boxer">🩲 Boxer</option>
              <option value="pyjama_homme">🌙 Pyjama</option>
              <option value="robe_chambre">🛏️ Robe de chambre</option>
              <option value="combinaison_travail">👷 Combinaison de travail</option>
            </optgroup>
          )}
          
          {subCategory?.includes('femme') && (
            <optgroup label="👗 Vêtements Femme">
              <option value="robe_soiree">👗 Robe de soirée</option>
              <option value="robe_cocktail">👗 Robe cocktail</option>
              <option value="robe_ete">👗 Robe d'été</option>
              <option value="robe_midi">👗 Robe midi</option>
              <option value="robe_maxi">👗 Robe maxi</option>
              <option value="robe_tunique">👗 Robe tunique</option>
              <option value="robe_grossesse">🤰 Robe de grossesse</option>
              <option value="jupe_courte">👗 Jupe courte</option>
              <option value="jupe_longue">👗 Jupe longue</option>
              <option value="jupe_plissee">👗 Jupe plissée</option>
              <option value="jupe_culotte">👗 Jupe-culotte</option>
              <option value="blouse_sophistiquee">👚 Blouse sophistiquée</option>
              <option value="chemisier">👚 Chemisier</option>
              <option value="top_débardeur">👚 Top/Débardeur</option>
              <option value="crop_top">👚 Crop top</option>
              <option value="t_shirt_femme">👕 T-shirt femme</option>
              <option value="tunique">👚 Tunique</option>
              <option value="pantalon_femme">👖 Pantalon femme</option>
              <option value="jean_femme">👖 Jeans femme</option>
              <option value="jean_skinny">👖 Jeans skinny</option>
              <option value="jean_large">👖 Jeans large</option>
              <option value="legging">👖 Legging</option>
              <option value="short_femme">🩳 Short femme</option>
              <option value="short_denim">🩳 Short en jean</option>
              <option value="ensemble_jogging">👕 Ensemble jogging</option>
              <option value="combinaison">👖 Combinaison</option>
              <option value="salopette">👖 Salopette</option>
              <option value="veste_femme">🧥 Veste femme</option>
              <option value="blazer">🧥 Blazer</option>
              <option value="cardigan">🧥 Cardigan</option>
              <option value="gilet_femme">🧥 Gilet femme</option>
              <option value="manteau_femme">🧥 Manteau femme</option>
              <option value="doudoune_femme">🧥 Doudoune femme</option>
              <option value="maillot_1_piece">👙 Maillot 1 pièce</option>
              <option value="maillot_2_pieces">👙 Maillot 2 pièces</option>
              <option value="paréo">🏖️ Paréo</option>
              <option value="culotte">🩲 Culotte</option>
              <option value="string">🩲 String</option>
              <option value="soutien_gorge">👙 Soutien-gorge</option>
              <option value="pyjama_femme">🌙 Pyjama femme</option>
              <option value="chemise_nuit">🌙 Chemise de nuit</option>
              <option value="robe_maison">🛏️ Robe de maison</option>
            </optgroup>
          )}
          
          {(subCategory?.includes('garcons') || subCategory?.includes('filles')) && (
            <optgroup label="👶 Vêtements Enfants">
              <option value="ensemble_pantalon">👕 Ensemble pantalon</option>
              <option value="ensemble_short">👕 Ensemble short</option>
              <option value="ensemble_jogging">👕 Ensemble jogging</option>
              <option value="robe_fillette">👗 Robe fillette</option>
              <option value="robe_soiree_enfant">👗 Robe de soirée enfant</option>
              <option value="jupe_fillette">👗 Jupe fillette</option>
              <option value="chemise_garcon">👔 Chemise garçon</option>
              <option value="polo_enfant">👕 Polo enfant</option>
              <option value="t_shirt_enfant">👕 T-shirt enfant</option>
              <option value="sweat_enfant">🧥 Sweat enfant</option>
              <option value="pull_enfant">🧶 Pull enfant</option>
              <option value="gilet_enfant">🧥 Gilet enfant</option>
              <option value="veste_enfant">🧥 Veste enfant</option>
              <option value="manteau_enfant">🧥 Manteau enfant</option>
              <option value="doudoune_enfant">🧥 Doudoune enfant</option>
              <option value="pantalon_jean_enfant">👖 Jeans enfant</option>
              <option value="pantalon_taille_enfant">👖 Pantalon enfant</option>
              <option value="short_enfant">🩳 Short enfant</option>
              <option value="legging_enfant">👖 Legging enfant</option>
              <option value="maillot_bain_enfant">🩳 Maillot de bain enfant</option>
              <option value="pyjama_enfant">🌙 Pyjama enfant</option>
              <option value="robe_chambre_enfant">🛏️ Robe de chambre enfant</option>
              <option value="costume_garcon">👔 Costume garçon</option>
              <option value="uniforme_scolaire">🎒 Uniforme scolaire</option>
              <option value="tablier_ecole">🎨 Tablier d'école</option>
            </optgroup>
          )}
          
          {subCategory?.includes('bebe') && (
            <optgroup label="🍼 Vêtements Bébé">
              <option value="body_manches_courtes">👶 Body manches courtes</option>
              <option value="body_manches_longues">👶 Body manches longues</option>
              <option value="pyjama_bebe">🌙 Pyjama bébé</option>
              <option value="grenouillere">🐸 Grenouillère</option>
              <option value="combinaison_pilote">👶 Combinaison pilote</option>
              <option value="robe_bebe">👗 Robe bébé</option>
              <option value="ensemble_bebe">👕 Ensemble bébé</option>
              <option value="t_shirt_bebe">👕 T-shirt bébé</option>
              <option value="pantalon_bebe">👖 Pantalon bébé</option>
              <option value="legging_bebe">👖 Legging bébé</option>
              <option value="short_bebe">🩳 Short bébé</option>
              <option value="chaussons_bebe">👣 Chaussons bébé</option>
              <option value="bonnet_bebe">🧢 Bonnet bébé</option>
              <option value="gants_bebe">🧤 Gants bébé</option>
              <option value="cache_oreilles">👂 Cache-oreilles</option>
              <option value="bavoir">👶 Bavoir</option>
              <option value="turbulette">🛏️ Turbulette</option>
              <option value="cape_bain">🛁 Cape de bain</option>
            </optgroup>
          )}
        </Form.Select>
      </Form.Group>
    ),
    
    // 7. TYPE CHAUSSURE (COMPLETO)
    'typeChaussure': (
      <Form.Group key="typeChaussure">
        <Form.Label>👟 {t('shoe_type', 'Type de chaussure')}</Form.Label>
        <Form.Select
          name="typeChaussure"
          value={postData.typeChaussure || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_shoe_type', 'Sélectionnez type')}</option>
          
          {/* Opciones para hombres */}
          {subCategory?.includes('homme') && (
            <optgroup label="👞 Chaussures Homme">
              <option value="derbies">👞 Derbies</option>
              <option value="richelieu">👞 Richelieu</option>
              <option value="brogues">👞 Brogues</option>
              <option value="mocassins">👞 Mocassins</option>
              <option value="bottines">👢 Bottines</option>
              <option value="bottes">👢 Bottes</option>
              <option value="baskets_classiques">👟 Baskets classiques</option>
              <option value="baskets_sport">👟 Baskets de sport</option>
              <option value="running">👟 Running</option>
              <option value="training">👟 Training/Fitness</option>
              <option value="football">⚽ Chaussures de football</option>
              <option value="basketball">🏀 Chaussures de basketball</option>
              <option value="randonnee">🥾 Chaussures de randonnée</option>
              <option value="sandales_homme">👡 Sandales homme</option>
              <option value="tongs">🩴 Tongs</option>
              <option value="pantoufles">🛏️ Pantoufles</option>
              <option value="chaussons">👣 Chaussons d'intérieur</option>
              <option value="chaussures_travail">👷 Chaussures de travail</option>
              <option value="chaussures_securite">🛡️ Chaussures de sécurité</option>
            </optgroup>
          )}
          
          {/* Opciones para mujeres */}
          {subCategory?.includes('femme') && (
            <optgroup label="👠 Chaussures Femme">
              <option value="escarpins">👠 Escarpins classiques</option>
              <option value="escarpins_aiguille">👠 Escarpins à aiguille</option>
              <option value="talons_blocs">👠 Talons blocs</option>
              <option value="talons_combinés">👠 Talons combinés</option>
              <option value="sandales_talons">👡 Sandales à talons</option>
              <option value="sandales_plates">👡 Sandales plates</option>
              <option value="mules">👡 Mules</option>
              <option value="ballerines">🥿 Ballerines</option>
              <option value="bottines_femme">👢 Bottines femme</option>
              <option value="bottes_femme">👢 Bottes femme</option>
              <option value="bottes_talons">👢 Bottes à talons</option>
              <option value="baskets_femme">👟 Baskets femme</option>
              <option value="baskets_mode">👟 Baskets mode</option>
              <option value="running_femme">👟 Running femme</option>
              <option value="training_femme">👟 Training femme</option>
              <option value="chaussures_danse">💃 Chaussures de danse</option>
              <option value="sandales_plage">🏖️ Sandales de plage</option>
              <option value="tongs_femme">🩴 Tongs femme</option>
              <option value="pantoufles_femme">🛏️ Pantoufles femme</option>
              <option value="chaussons_femme">👣 Chaussons femme</option>
              <option value="chaussures_soiree">✨ Chaussures de soirée</option>
              <option value="chaussures_mariage">👰 Chaussures de mariage</option>
            </optgroup>
          )}
          
          {/* Opciones para niños */}
          {(subCategory?.includes('garcons') || subCategory?.includes('filles')) && (
            <optgroup label="👟 Chaussures Enfants">
              <option value="baskets_enfant">👟 Baskets enfant</option>
              <option value="running_enfant">👟 Running enfant</option>
              <option value="sandales_enfant">👡 Sandales enfant</option>
              <option value="bottes_enfant">👢 Bottes enfant</option>
              <option value="bottines_enfant">👢 Bottines enfant</option>
              <option value="ballerines_fillette">🥿 Ballerines fillette</option>
              <option value="richelieu_garcon">👞 Richelieu garçon</option>
              <option value="chaussures_ecole">🎒 Chaussures d'école</option>
              <option value="chaussures_fete">🎉 Chaussures de fête</option>
              <option value="chaussons_enfant">👣 Chaussons enfant</option>
              <option value="pantoufles_enfant">🛏️ Pantoufles enfant</option>
              <option value="chaussures_pluie">🌧️ Chaussures de pluie</option>
              <option value="chaussures_neige">❄️ Chaussures de neige</option>
            </optgroup>
          )}
          
          {/* Opciones para bebés */}
          {subCategory?.includes('bebe') && (
            <optgroup label="👣 Chaussures Bébé">
              <option value="chaussons_premiers_pas">👣 Chaussons premiers pas</option>
              <option value="chaussures_bebe">👟 Chaussures bébé</option>
              <option value="sandales_bebe">👡 Sandales bébé</option>
              <option value="bottes_bebe">👢 Bottes bébé</option>
              <option value="chaussons_douillets">🛏️ Chaussons douillets</option>
              <option value="chaussures_pluie_bebe">🌧️ Chaussures de pluie bébé</option>
            </optgroup>
          )}
        </Form.Select>
      </Form.Group>
    ),
    
    // 8. POINTURE (ya está completo)
    'pointure': (
      <Form.Group key="pointure">
        <Form.Label>👟 {t('shoe_size', 'Pointure')}</Form.Label>
        <Form.Select
          name="pointure"
          value={postData.pointure || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_shoe_size', 'Sélectionnez pointure')}</option>
          
          {/* Hombre */}
          {subCategory?.includes('homme') && (
            <optgroup label="👞 Pointures Homme">
              {Array.from({length: 18}, (_, i) => 38 + i).map(size => (
                <option key={`h_${size}`} value={`H${size}`}>
                  {size} (Homme)
                </option>
              ))}
              <option value="H56+">56+ (Très grande pointure)</option>
            </optgroup>
          )}
          
          {/* Mujer */}
          {subCategory?.includes('femme') && (
            <optgroup label="👠 Pointures Femme">
              {Array.from({length: 15}, (_, i) => 35 + i).map(size => (
                <option key={`f_${size}`} value={`F${size}`}>
                  {size} (Femme)
                </option>
              ))}
              <option value="F50+">50+ (Grande pointure femme)</option>
            </optgroup>
          )}
          
          {/* Niños */}
          {(subCategory?.includes('garcons') || subCategory?.includes('filles')) && (
            <optgroup label="👟 Pointures Enfants">
              {Array.from({length: 12}, (_, i) => 25 + i).map(size => (
                <option key={`e_${size}`} value={`E${size}`}>
                  {size} (Enfant)
                </option>
              ))}
            </optgroup>
          )}
          
          {/* Bebés */}
          {subCategory?.includes('bebe') && (
            <optgroup label="👣 Pointures Bébé">
              {Array.from({length: 10}, (_, i) => 16 + i).map(size => (
                <option key={`b_${size}`} value={`B${size}`}>
                  {size} (Bébé)
                </option>
              ))}
              <option value="B26+">26+ (Grand bébé)</option>
            </optgroup>
          )}
          
          <option value="sur_mesure">✂️ Sur mesure/Pointure spéciale</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // 9. HAUTEUR TALON (solo para chaussures_femme)
    'hauteurTalon': (
      <Form.Group key="hauteurTalon">
        <Form.Label>📏 {t('heel_height', 'Hauteur du talon')} (cm)</Form.Label>
        <Form.Select
          name="hauteurTalon"
          value={postData.hauteurTalon || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_height', 'Sélectionnez hauteur')}</option>
          <option value="0">🥿 Plat (0 cm)</option>
          <option value="2">👡 Très bas (2 cm)</option>
          <option value="4">👡 Bas (4 cm)</option>
          <option value="6">👠 Moyen (6 cm)</option>
          <option value="8">👠 Haut (8 cm)</option>
          <option value="10">👠 Très haut (10 cm)</option>
          <option value="12">👠 Extra haut (12 cm)</option>
          <option value="15">👠 Ultra haut (15+ cm)</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // 10. AGE CIBLE (para niños)
    'ageCible': (
      <Form.Group key="ageCible">
        <Form.Label>👶 {t('target_age', 'Âge cible')}</Form.Label>
        <Form.Select
          name="ageCible"
          value={postData.ageCible || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_age', 'Sélectionnez âge')}</option>
          <option value="0-12mois">👶 0-12 mois</option>
          <option value="1-2ans">👶 1-2 ans</option>
          <option value="2-3ans">👦 2-3 ans</option>
          <option value="3-4ans">👦 3-4 ans</option>
          <option value="4-5ans">👦 4-5 ans</option>
          <option value="5-6ans">👧 5-6 ans</option>
          <option value="6-7ans">👧 6-7 ans</option>
          <option value="7-8ans">👧 7-8 ans</option>
          <option value="8-9ans">👧 8-9 ans</option>
          <option value="9-10ans">🧒 9-10 ans</option>
          <option value="10-11ans">🧒 10-11 ans</option>
          <option value="11-12ans">🧒 11-12 ans</option>
          <option value="12-13ans">🧑 12-13 ans (pré-ado)</option>
          <option value="13-14ans">🧑 13-14 ans (ado)</option>
          <option value="14-15ans">🧑 14-15 ans (ado)</option>
          <option value="15-16ans">🧑 15-16 ans (jeune adulte)</option>
          <option value="16ans+">🧑 16 ans et plus</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // 11. AGE MOIS (para bebés)
    'ageMois': (
      <Form.Group key="ageMois">
        <Form.Label>👶 {t('age_months', 'Âge en mois')}</Form.Label>
        <Form.Select
          name="ageMois"
          value={postData.ageMois || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_months', 'Sélectionnez mois')}</option>
          {Array.from({length: 24}, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>{month} mois</option>
          ))}
          <option value="24-30">24-30 mois</option>
          <option value="30-36">30-36 mois</option>
          <option value="36+">36+ mois (3 ans+)</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // 12. TYPE TENUE (tenues profesionales)
    'typeTenue': (
      <Form.Group key="typeTenue">
        <Form.Label>👔 {t('outfit_type', 'Type de tenue')}</Form.Label>
        <Form.Select
          name="typeTenue"
          value={postData.typeTenue || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_outfit', 'Sélectionnez type')}</option>
          <option value="costume_affaires">👔 Costume d'affaires</option>
          <option value="uniforme_entreprise">🏢 Uniforme d'entreprise</option>
          <option value="tenue_restauration">👨‍🍳 Tenue de restauration</option>
          <option value="tenue_cuisine">👨‍🍳 Tenue de cuisine (chef)</option>
          <option value="tenue_serveur">🍽️ Tenue de serveur/serveuse</option>
          <option value="uniforme_medical">🥼 Uniforme médical</option>
          <option value="blouse_medecin">👨‍⚕️ Blouse de médecin</option>
          <option value="uniforme_infirmier">👩‍⚕️ Uniforme d'infirmier(e)</option>
          <option value="tenue_paramedical">🏥 Tenue paramédicale</option>
          <option value="uniforme_securite">👮 Uniforme de sécurité</option>
          <option value="tenue_agent_securite">🛡️ Tenue d'agent de sécurité</option>
          <option value="uniforme_policier">👮 Uniforme de police</option>
          <option value="tenue_militaire">🎖️ Tenue militaire</option>
          <option value="uniforme_ecole">🏫 Uniforme scolaire</option>
          <option value="tenue_professeur">👨‍🏫 Tenue de professeur</option>
          <option value="uniforme_hotel">🏨 Uniforme d'hôtel</option>
          <option value="tenue_receptionniste">💼 Tenue de réceptionniste</option>
          <option value="uniforme_steward">✈️ Uniforme de steward/hôtesse</option>
          <option value="tenue_pilote">✈️ Tenue de pilote</option>
          <option value="combinaison_travail">👷 Combinaison de travail</option>
          <option value="tenue_ouvrier">🔧 Tenue d'ouvrier</option>
          <option value="tenue_technicien">🔬 Tenue de technicien</option>
          <option value="blouse_laboratoire">🧪 Blouse de laboratoire</option>
          <option value="tenue_coiffeur">💇 Tenue de coiffeur</option>
          <option value="uniforme_estetique">💄 Uniforme d'esthéticienne</option>
          <option value="tenue_vendeur">🛍️ Tenue de vendeur/vendeuse</option>
          <option value="uniforme_sport">⚽ Uniforme sportif</option>
          <option value="tenue_entraineur">🏃 Tenue d'entraîneur</option>
          <option value="costume_scenique">🎭 Costume scénique</option>
          <option value="uniforme_orchestre">🎻 Uniforme d'orchestre</option>
          <option value="tenue_religieuse">⛪ Tenue religieuse</option>
          <option value="uniforme_ceremonie">🎖️ Uniforme de cérémonie</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // 13. TYPE SAC (bolsos y maletas)
    'typeSac': (
      <Form.Group key="typeSac">
        <Form.Label>👜 {t('bag_type', 'Type de sac')}</Form.Label>
        <Form.Select
          name="typeSac"
          value={postData.typeSac || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_bag', 'Sélectionnez type')}</option>
          <optgroup label="👜 Sacs à main">
            <option value="sac_main_classique">👜 Sac à main classique</option>
            <option value="sac_main_cabas">🛍️ Cabas/Sac shopping</option>
            <option value="sac_trapeze">👜 Sac trapèze</option>
            <option value="sac_bandouliere">👝 Sac bandoulière</option>
            <option value="sac_epaule">👜 Sac à l'épaule</option>
            <option value="sac_sacoche">💼 Sacoche</option>
            <option value="sac_besace">🎒 Besace</option>
            <option value="sac_panneire">🧺 Panier/Sac panier</option>
            <option value="sac_tote">🛍️ Tote bag</option>
          </optgroup>
          <optgroup label="💼 Professionnels & Voyage">
            <option value="sac_porte_documents">💼 Porte-documents</option>
            <option value="sac_ordinateur">💻 Sac pour ordinateur</option>
            <option value="sac_voyage">🧳 Sac de voyage</option>
            <option value="valise_cabine">🧳 Valise cabine</option>
            <option value="valise_grande">🧳 Grande valise</option>
            <option value="sac_weekend">🎒 Sac week-end</option>
            <option value="sac_sport">🎽 Sac de sport</option>
            <option value="sac_gym">🏋️ Sac de gym</option>
            <option value="sac_rando">🥾 Sac de randonnée</option>
          </optgroup>
          <optgroup label="🎒 Sacs à dos">
            <option value="sac_dos_classique">🎒 Sac à dos classique</option>
            <option value="sac_dos_ecole">🎒 Sac d'école</option>
            <option value="sac_dos_voyage">🎒 Sac à dos de voyage</option>
            <option value="sac_dos_rando">🥾 Sac à dos de randonnée</option>
            <option value="sac_dos_laptop">💻 Sac à dos pour laptop</option>
            <option value="sac_dos_mode">🎒 Sac à dos mode</option>
            <option value="sac_dos_enfant">🎒 Sac à dos enfant</option>
          </optgroup>
          <optgroup label="👛 Petits sacs">
            <option value="pochette_soiree">👛 Pochette de soirée</option>
            <option value="pochette_clutch">👛 Clutch</option>
            <option value="porte_monnaie">💰 Porte-monnaie</option>
            <option value="porte_cartes">💳 Porte-cartes</option>
            <option value="trousses">💄 Trousse de toilette/maquillage</option>
            <option value="sac_maquillage">💄 Sac à maquillage</option>
            <option value="etui_lunettes">👓 Étui à lunettes</option>
            <option value="sac_telephone">📱 Sac pour téléphone</option>
          </optgroup>
          <optgroup label="👜 Sacs spéciaux">
            <option value="sac_bebe">🍼 Sac à langer</option>
            <option value="sac_pique_nique">🧺 Sac pique-nique</option>
            <option value="sac_plage">🏖️ Sac de plage</option>
            <option value="sac_ski">🎿 Sac de ski</option>
            <option value="sac_velo">🚲 Sac pour vélo</option>
            <option value="sac_camera">📷 Sac pour appareil photo</option>
            <option value="sac_instruments">🎷 Sac pour instruments</option>
            <option value="sac_medical">🏥 Sac médical</option>
            <option value="sac_messager">🚴 Sac messager</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 14. MATERIEL BRACELET (para relojes)
    'materielBracelet': (
      <Form.Group key="materielBracelet">
        <Form.Label>⛓️ {t('strap_material', 'Matériau bracelet')}</Form.Label>
        <Form.Select
          name="materielBracelet"
          value={postData.materielBracelet || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_material', 'Sélectionnez matériau')}</option>
          <optgroup label="💰 Métaux précieux">
            <option value="or_jaune_18k">💰 Or jaune 18K</option>
            <option value="or_blanc_18k">⚪ Or blanc 18K</option>
            <option value="or_rose_18k">🌸 Or rose 18K</option>
            <option value="argent_925">💿 Argent 925</option>
            <option value="platine">⚪ Platine</option>
            <option value="palladium">🔬 Palladium</option>
            <option value="or_plaqué">💰 Or plaqué</option>
          </optgroup>
          <optgroup label="⚙️ Métaux industriels">
            <option value="acier_inox">⚙️ Acier inoxydable</option>
            <option value="titane">🛡️ Titane</option>
            <option value="aluminium">✈️ Aluminium</option>
            <option value="laiton">🔶 Laiton</option>
            <option value="bronze">🔶 Bronze</option>
            <option value="acier_ceramique">🔬 Acier céramique</option>
            <option value="metal_plaqué">✨ Métal plaqué or/argent</option>
          </optgroup>
          <optgroup label="🧵 Cuir & Tissu">
            <option value="cuir_vache">🐄 Cuir de vache</option>
            <option value="cuir_crocodile">🐊 Cuir crocodile/alligator</option>
            <option value="cuir_autruche">🐦 Cuir autruche</option>
            <option value="cuir_synthetique">🧪 Cuir synthétique</option>
            <option value="caoutchouc">🧪 Caoutchouc</option>
            <option value="silicone">🔬 Silicone</option>
            <option value="tissu_nylon">🎽 Nylon</option>
            <option value="tissu_canvas">🎨 Canvas/Toile</option>
            <option value="velours">🟤 Velours</option>
            <option value="suede">🦌 Suède</option>
          </optgroup>
          <optgroup label="💎 Matériaux spéciaux">
            <option value="perles">⚪ Perles</option>
            <option value="pierre_naturelle">💎 Pierre naturelle</option>
            <option value="nacre">🐚 Nacre</option>
            <option value="bois">🌳 Bois</option>
            <option value="email">🎨 Émail</option>
            <option value="resine">🧪 Résine</option>
            <option value="plastique">🧪 Plastique</option>
            <option value="caoutchouc_sport">🏃 Caoutchouc sport</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 15. COULEUR MONTURE (para gafas)
    'couleurMonture': (
      <Form.Group key="couleurMonture">
        <Form.Label>🕶️ {t('frame_color', 'Couleur monture')}</Form.Label>
        <Form.Select
          name="couleurMonture"
          value={postData.couleurMonture || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_color', 'Sélectionnez couleur')}</option>
          <optgroup label="⚫ Couleurs classiques">
            <option value="noir_mat">⚫ Noir mat</option>
            <option value="noir_brillant">⚫ Noir brillant</option>
            <option value="noir_translucide">⚫ Noir translucide</option>
            <option value="marron_tortue">🐢 Marron tortue</option>
            <option value="marron_fonce">🟤 Marron foncé</option>
            <option value="marron_clair">🟤 Marron clair</option>
            <option value="gris_anthracite">⚪ Gris anthracite</option>
            <option value="gris_acier">⚪ Gris acier</option>
            <option value="gris_souris">⚪ Gris souris</option>
          </optgroup>
          <optgroup label="💰 Métalliques">
            <option value="or_jaune">💰 Or jaune</option>
            <option value="or_rose">🌸 Or rose</option>
            <option value="or_blanc">⚪ Or blanc</option>
            <option value="argent_chrome">💿 Argent/chrome</option>
            <option value="bronze">🔶 Bronze</option>
            <option value="cuivre">🔶 Cuivre</option>
            <option value="titane">🛡️ Titane naturel</option>
            <option value="metal_brushed">✨ Métal brossé</option>
            <option value="metal_polished">✨ Métal poli</option>
          </optgroup>
          <optgroup label="🎨 Couleurs vives">
            <option value="rouge_vif">🔴 Rouge vif</option>
            <option value="bleu_marine">🔵 Bleu marine</option>
            <option value="bleu_ciel">🔵 Bleu ciel</option>
            <option value="vert_foret">🟢 Vert forêt</option>
            <option value="vert_menthe">🟢 Vert menthe</option>
            <option value="violet">🟣 Violet</option>
            <option value="rose_pale">🌸 Rose pâle</option>
            <option value="rose_vif">🌸 Rose vif</option>
            <option value="corail">🟠 Corail</option>
            <option value="orange">🟠 Orange</option>
            <option value="jaune">🟡 Jaune</option>
            <option value="turquoise">🟢 Turquoise</option>
            <option value="bordeaux">🍷 Bordeaux</option>
          </optgroup>
          <optgroup label="🔍 Transparents & Spéciaux">
            <option value="transparent">🔍 Transparent</option>
            <option value="blanc_translucide">⚪ Blanc translucide</option>
            <option value="fume">🚬 Fumé</option>
            <option value="degrade">🌈 Dégradé</option>
            <option value="nacre">🐚 Nacré</option>
            <option value="perle">⚪ Perle</option>
            <option value="cristal">💎 Cristal</option>
            <option value="camouflage">🎖️ Camouflage</option>
            <option value="imprime">🎨 Imprimé/motif</option>
            <option value="paille">🌾 Paille/tressé</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 16. TYPE BIJOU (joyería)
    'typeBijou': (
      <Form.Group key="typeBijou">
        <Form.Label>💎 {t('jewelry_type', 'Type de bijou')}</Form.Label>
        <Form.Select
          name="typeBijou"
          value={postData.typeBijou || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_jewelry', 'Sélectionnez type')}</option>
          <optgroup label="📿 Colliers & Pendentifs">
            <option value="collier_chainette">📿 Collier chainette</option>
            <option value="collier_sautoir">📿 Sautoir (long collier)</option>
            <option value="collier_ras_du_cou">📿 Ras du cou</option>
            <option value="collier_choker">📿 Choker</option>
            <option value="pendentif_simple">📿 Pendentif simple</option>
            <option value="pendentif_pierre">💎 Pendentif avec pierre</option>
            <option value="medaillon">📿 Médaillon</option>
            <option value="collier_perles">⚪ Collier de perles</option>
            <option value="collier_pierre">💎 Collier de pierres</option>
            <option value="collier_charm">📿 Collier à charms</option>
          </optgroup>
          <optgroup label="📿 Bracelets">
            <option value="bracelet_chainette">📿 Bracelet chainette</option>
            <option value="bracelet_manchette">📿 Bracelet manchette</option>
            <option value="bracelet_charm">📿 Bracelet à charms</option>
            <option value="bracelet_perles">⚪ Bracelet de perles</option>
            <option value="bracelet_pierre">💎 Bracelet de pierres</option>
            <option value="bracelet_cuir">🐄 Bracelet en cuir</option>
            <option value="bracelet_tissu">🧵 Bracelet en tissu</option>
            <option value="bracelet_elastic">🌀 Bracelet élastique</option>
            <option value="bracelet_cheville">📿 Bracelet de cheville</option>
            <option value="gourmette">📿 Gourmette</option>
          </optgroup>
          <optgroup label="💍 Bagues">
            <option value="bague_solitaire">💍 Bague solitaire</option>
            <option value="bague_fiancailles">💍 Bague de fiançailles</option>
            <option value="bague_alliance">💍 Alliance</option>
            <option value="bague_pierre">💎 Bague avec pierre(s)</option>
            <option value="bague_sertie">💎 Bague serti pierres</option>
            <option value="bague_cocktail">💍 Bague cocktail</option>
            <option value="bague_chevaliere">💍 Chevalière</option>
            <option value="bague_joint">💍 Bague de jointure</option>
            <option value="bague_multiple">💍 Bague multi-doigts</option>
            <option value="bague_ajustable">🌀 Bague ajustable</option>
          </optgroup>
          <optgroup label="📿 Boucles d'oreilles">
            <option value="boucles_creoles">📿 Créoles</option>
            <option value="boucles_pendentifs">📿 Boucles pendantes</option>
            <option value="boucles_clous">📿 Clous d'oreilles</option>
            <option value="boucles_studs">📿 Studs/Clous de diamant</option>
            <option value="boucles_agrafe">📿 Boucles à agrafe</option>
            <option value="boucles_huggies">📿 Huggies</option>
            <option value="boucles_cerceaux">📿 Cerceaux</option>
            <option value="boucles_chandelier">📿 Chandeliers</option>
            <option value="boucles_gouttes">💧 Gouttes</option>
            <option value="boucles_clusters">📿 Clusters/Bouquets</option>
          </optgroup>
          <optgroup label="💎 Bijoux spéciaux">
            <option value="broche">📌 Broche</option>
            <option value="epingle_cravate">👔 Épingle de cravate</option>
            <option value="bouton_manchette">👔 Boutons de manchette</option>
            <option value="barrette">💇 Barrette/broche cheveux</option>
            <option value="diademe">👑 Diadème/tiare</option>
            <option value="piercing_corporel">📿 Piercing corporel</option>
            <option value="bijoux_nez">👃 Bijoux de nez</option>
            <option value="bijoux_nombril">📿 Bijoux de nombril</option>
            <option value="bijoux_langue">👅 Bijoux de langue</option>
            <option value="bijoux_sourcil">👁️ Bijoux de sourcil</option>
          </optgroup>
          <optgroup label="📿 Montres & Bijoux fonctionnels">
            <option value="montre_bijou">⌚ Montre bijou</option>
            <option value="bracelet_montre">⌚ Bracelet de montre</option>
            <option value="pendentif_montre">⌚ Pendentif montre</option>
            <option value="bague_montre">⌚ Bague montre</option>
            <option value="bijoux_connectes">📱 Bijoux connectés</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 17. PIERRE (para joyería)
    'pierre': (
      <Form.Group key="pierre">
        <Form.Label>💎 {t('stone', 'Pierre')}</Form.Label>
        <Form.Select
          name="pierre"
          value={postData.pierre || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_stone', 'Sélectionnez pierre')}</option>
          <optgroup label="💎 Pierres précieuses">
            <option value="diamant">💎 Diamant</option>
            <option value="rubis">🔴 Rubis</option>
            <option value="saphir">🔵 Saphir</option>
            <option value="emeraude">🟢 Émeraude</option>
            <option value="alexandrite">🟣 Alexandrite</option>
            <option value="tanzanite">🔵 Tanzanite</option>
          </optgroup>
          <optgroup label="✨ Pierres semi-précieuses">
            <option value="amethyste">🟣 Améthyste</option>
            <option value="topaze">🟡 Topaze</option>
            <option value="citrine">🟡 Citrine</option>
            <option value="grenat">🔴 Grenat</option>
            <option value="peridot">🟢 Péridot</option>
            <option value="tourmaline">🌈 Tourmaline</option>
            <option value="opale">✨ Opale</option>
            <option value="quartz_rose">🌸 Quartz rose</option>
            <option value="quartz_fume">🚬 Quartz fumé</option>
            <option value="aventurine">🟢 Aventurine</option>
            <option value="oeil_de_tigre">🐅 Œil de tigre</option>
            <option value="labradorite">🔵 Labradorite</option>
            <option value="malachite">🟢 Malachite</option>
            <option value="lapis_lazuli">🔵 Lapis-lazuli</option>
            <option value="turquoise">🟢 Turquoise</option>
            <option value="cornaline">🟠 Cornaline</option>
            <option value="jaspe">🟤 Jaspe</option>
            <option value="onyx">⚫ Onyx</option>
            <option value="obsidienne">⚫ Obsidienne</option>
          </optgroup>
          <optgroup label="⚪ Perles & Organiques">
            <option value="perle_cultivee">⚪ Perle cultivée</option>
            <option value="perle_deau_douce">⚪ Perle d'eau douce</option>
            <option value="perle_south_sea">🌊 Perle South Sea</option>
            <option value="perle_tahiti">🌴 Perle de Tahiti</option>
            <option value="corail">🪸 Corail</option>
            <option value="ambre">🟠 Ambre</option>
            <option value="nacre">🐚 Nacre</option>
            <option value="ivoire">🐘 Ivoire (vintage)</option>
            <option value="os">🦴 Os</option>
            <option value="coquillage">🐚 Coquillage</option>
          </optgroup>
          <optgroup label="🧪 Pierres synthétiques & Traitées">
            <option value="cz_cubic_zirconia">💎 Cubic Zirconia (CZ)</option>
            <option value="moissanite">💎 Moissanite</option>
            <option value="pierre_lab">🔬 Pierre de laboratoire</option>
            <option value="verre">🔍 Verre/cristal</option>
            <option value="resine">🧪 Résine/acrylique</option>
            <option value="email">🎨 Émail</option>
          </optgroup>
          <option value="aucune">🚫 Aucune pierre</option>
          <option value="pierres_multiple">🌈 Plusieurs pierres</option>
          <option value="inconnue">❓ Pierre inconnue</option>
        </Form.Select>
      </Form.Group>
    )
  };
  
  // Lógica de renderizado FINAL
  const subCategoryFields = getSubCategorySpecificFields();
  
  console.log('👕 VetementsFields - Renderizando:', {
    subCategory,
    fieldName,
    fieldsCount: subCategoryFields.length,
    fields: subCategoryFields
  });
  
  // Si se solicita un campo específico
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    if (!fieldComponent) {
      console.error(`❌ Campo '${fieldName}' no encontrado en VetementsFields`);
      return (
        <div className="alert alert-danger">
          <strong>Error:</strong> Campo '{fieldName}' no está definido para esta categoría.
        </div>
      );
    }
    return fieldComponent;
  }
  
  // Si hay subcategoría, renderizar todos sus campos
  if (subCategory && subCategoryFields.length > 0) {
    return (
      <div className="row g-3">
        {subCategoryFields.map(fieldKey => {
          const fieldComponent = fields[fieldKey];
          
          if (!fieldComponent) {
            console.error(`❌ Campo '${fieldKey}' no definido para ${subCategory}`);
            return (
              <div key={fieldKey} className="col-12">
                <div className="alert alert-warning">
                  <strong>Advertencia:</strong> Campo '{fieldKey}' no disponible.
                </div>
              </div>
            );
          }
          
          return (
            <div key={fieldKey} className="col-12 col-md-6">
              {fieldComponent}
            </div>
          );
        })}
      </div>
    );
  }
  
  // Si no hay subcategoría seleccionada
  if (!subCategory) {
    return (
      <div className="alert alert-info">
        <strong>👕 Información:</strong> Selecciona una subcategoría de vestimenta para ver los campos específicos.
      </div>
    );
  }
  
  // Si la subcategoría no tiene campos definidos
  return (
    <div className="alert alert-warning">
      <strong>⚠️ Advertencia:</strong> La subcategoría '{subCategory}' no tiene campos definidos.
    </div>
  );
};

export default VetementsFields;