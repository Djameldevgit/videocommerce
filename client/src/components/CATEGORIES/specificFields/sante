import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SanteBeauteFields = ({ fieldName, postData, handleChangeInput, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  // Definir qué campos muestra cada subcategoría
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'cosmetiques_beaute': ['typeProduit', 'marque', 'contenance', 'typeCosmetique', 'utilisation', 'typePeau', 'spf', 'composition', 'conservation', 'ouvert'],
      'parfums_deodorants_femme': ['typeParfum', 'familleOlfactive', 'typeDeodorant', 'marque', 'contenance', 'genre', 'conservation', 'ouvert'],
      'parfums_deodorants_homme': ['typeParfum', 'familleOlfactive', 'typeDeodorant', 'marque', 'contenance', 'genre', 'conservation', 'ouvert'],
      'parapharmacie_sante': ['typeProduit', 'marque', 'contenance', 'typeComplement', 'datePeremption', 'conservation', 'composition', 'ouvert']
    };
    
    return specificFields[subCategory] || [];
  };
  
  // Funciones auxiliares para contenidos específicos
  const getMarquesForCategory = (category) => {
    const marques = {
      cosmetiques_beaute: [
        { value: 'chanel', label: '👑 Chanel' },
        { value: 'dior', label: '💎 Dior' },
        { value: 'lancome', label: '🌹 Lancôme' },
        { value: 'ysl', label: '💄 Yves Saint Laurent' },
        { value: 'estee_lauder', label: '👩‍🦳 Estée Lauder' },
        { value: 'guerlain', label: '🌸 Guerlain' },
        { value: 'loreal', label: '💇 L\'Oréal' },
        { value: 'maybelline', label: '💋 Maybelline' },
        { value: 'nyx', label: '🎨 NYX Professional' },
        { value: 'mac', label: '💄 MAC Cosmetics' },
        { value: 'urban_decay', label: '🎨 Urban Decay' },
        { value: 'too_faced', label: '🍑 Too Faced' },
        { value: 'fenty', label: '✨ Fenty Beauty' },
        { value: 'huda_beauty', label: '👁️ Huda Beauty' }
      ],
      parfums_deodorants_femme: [
        { value: 'chanel', label: '👑 Chanel' },
        { value: 'dior', label: '💎 Dior' },
        { value: 'ysl', label: '💄 Yves Saint Laurent' },
        { value: 'gucci', label: '👜 Gucci' },
        { value: 'prada', label: '🎭 Prada' },
        { value: 'versace', label: '👑 Versace' },
        { value: 'lancome', label: '🌹 Lancôme' },
        { value: 'jean_paul_gaultier', label: '🚢 Jean Paul Gaultier' },
        { value: 'mugler', label: '🔮 Mugler' },
        { value: 'victorias_secret', label: '👙 Victoria\'s Secret' },
        { value: 'dolce_gabbana', label: '🍋 Dolce & Gabbana' },
        { value: 'carolina_herrera', label: '🌺 Carolina Herrera' },
        { value: 'nivea', label: '🔵 Nivea' },
        { value: 'rexona', label: '🛡️ Rexona' },
        { value: 'dove', label: '🕊️ Dove' }
      ],
      parfums_deodorants_homme: [
        { value: 'dior', label: '💎 Dior Sauvage' },
        { value: 'chanel', label: '👑 Chanel Bleu' },
        { value: 'ysl', label: '💄 Yves Saint Laurent' },
        { value: 'gucci', label: '👜 Gucci Guilty' },
        { value: 'prada', label: '🎭 Prada Luna Rossa' },
        { value: 'versace', label: '👑 Versace Eros' },
        { value: 'jean_paul_gaultier', label: '🚢 Jean Paul Gaultier' },
        { value: 'hugo_boss', label: '👔 Hugo Boss' },
        { value: 'pacorabanne', label: '✨ Paco Rabanne' },
        { value: 'armani', label: '🎩 Giorgio Armani' },
        { value: 'creed', label: '👑 Creed' },
        { value: 'tom_ford', label: '🕶️ Tom Ford' },
        { value: 'nivea', label: '🔵 Nivea Men' },
        { value: 'rexona', label: '🛡️ Rexona Men' },
        { value: 'axe', label: '🔥 Axe/Lynx' }
      ],
      parapharmacie_sante: [
        { value: 'la_roche_posay', label: '🔬 La Roche-Posay' },
        { value: 'vichy', label: '💧 Vichy' },
        { value: 'avene', label: '🏔️ Avène' },
        { value: 'bioderma', label: '🧪 Bioderma' },
        { value: 'nuxe', label: '🍃 Nuxe' },
        { value: 'caudalie', label: '🍇 Caudalie' },
        { value: 'garnier', label: '🍃 Garnier' },
        { value: 'neutrogena', label: '🧴 Neutrogena' },
        { value: 'cerave', label: '💧 CeraVe' },
        { value: 'the_ordinary', label: '🧪 The Ordinary' },
        { value: 'mustela', label: '👶 Mustela' },
        { value: 'weleda', label: '🌿 Weleda' },
        { value: 'sanofi', label: '💊 Sanofi' },
        { value: 'pfizer', label: '💊 Pfizer' },
        { value: 'bayer', label: '💊 Bayer' },
        { value: 'solgar', label: '🌱 Solgar' },
        { value: 'arkopharma', label: '🌿 Arkopharma' }
      ]
    };
    
    return marques[category] || [];
  };
  
  const getTypeProduitOptions = (category) => {
    const options = {
      cosmetiques_beaute: [
        { value: 'maquillage_visage', label: '🎨 Maquillage visage' },
        { value: 'maquillage_yeux', label: '👁️ Maquillage yeux' },
        { value: 'maquillage_levres', label: '👄 Maquillage lèvres' },
        { value: 'soin_visage', label: '🧴 Soin visage' },
        { value: 'soin_corps', label: '🛁 Soin corps' },
        { value: 'soin_cheveux', label: '💇 Soin cheveux' },
        { value: 'soin_mains_ongles', label: '💅 Soin mains & ongles' },
        { value: 'parfum_eau', label: '🌸 Parfum & eau de toilette' },
        { value: 'hygiene_intime', label: '🌸 Hygiène intime' },
        { value: 'solaire', label: '☀️ Produit solaire' },
        { value: 'masque_visage', label: '🧖 Masque visage' },
        { value: 'serum_traitement', label: '💧 Sérum & traitement' }
      ],
      parapharmacie_sante: [
        { value: 'medicament_sans_ordonnance', label: '💊 Médicament sans ordonnance' },
        { value: 'complement_alimentaire', label: '🥗 Complément alimentaire' },
        { value: 'vitamines_mineraux', label: '💊 Vitamines & minéraux' },
        { value: 'probiotiques', label: '🦠 Probiotiques' },
        { value: 'homeopathie', label: '🌿 Homéopathie' },
        { value: 'phytotherapie', label: '🌱 Phytothérapie' },
        { value: 'soin_medicaux', label: '🏥 Soins médicaux' },
        { value: 'materiel_medical', label: '🩺 Matériel médical' },
        { value: 'hygiene_buccale', label: '🦷 Hygiène bucco-dentaire' },
        { value: 'contraception', label: '📅 Contraception' },
        { value: 'maternite_bebe', label: '👶 Maternité & bébé' },
        { value: 'sport_nutrition', label: '💪 Sport & nutrition' }
      ]
    };
    
    return options[category] || [];
  };
  
  // Definición de todos los campos
  const fields = {
    // 1. TYPE PRODUIT (para cosméticos y parapharmacie)
    'typeProduit': (
      <Form.Group key="typeProduit">
        <Form.Label>📦 {t('product_type', 'Type de produit')}</Form.Label>
        <Form.Select
          name="typeProduit"
          value={postData.typeProduit || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_product_type', 'Sélectionnez type')}</option>
          {getTypeProduitOptions(subCategory).map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    ),
    
    // 2. MARQUE (con marcas específicas por categoría)
    'marque': (
      <Form.Group key="marque">
        <Form.Label>🏷️ {t('brand', 'Marque')}</Form.Label>
        <Form.Select
          name="marque"
          value={postData.marque || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_brand', 'Sélectionnez marque')}</option>
          {getMarquesForCategory(subCategory).map(marque => (
            <option key={marque.value} value={marque.value}>
              {marque.label}
            </option>
          ))}
          <option value="autre_marque">🆕 Autre marque</option>
          <option value="sans_marque">🚫 Sans marque/Générique</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // 3. CONTENANCE (capacidad)
    'contenance': (
      <Form.Group key="contenance">
        <Form.Label>🧴 {t('capacity', 'Contenance')}</Form.Label>
        <Row className="g-2">
          <Col xs={8}>
            <Form.Control
              type="number"
              name="contenance"
              value={postData.contenance || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 50"
              min="0"
              step="0.01"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </Col>
          <Col xs={4}>
            <Form.Select
              name="contenanceUnite"
              value={postData.contenanceUnite || 'ml'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="ml">ml</option>
              <option value="cl">cl</option>
              <option value="l">L</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="mg">mg</option>
              <option value="comp">💊 Comprimés</option>
              <option value="gel">💊 Gélules</option>
              <option value="amp">💉 Ampoules</option>
              <option value="sachet">📦 Sachets</option>
              <option value="unites">📦 Unités</option>
              <option value="paires">👓 Paires (lunettes)</option>
            </Form.Select>
          </Col>
        </Row>
        <Form.Text className="text-muted">
          💡 Ex: 50 ml, 30 comprimés, 100 g
        </Form.Text>
      </Form.Group>
    ),
    
    // 4. TYPE COSMETIQUE (solo para cosméticos)
    'typeCosmetique': (
      <Form.Group key="typeCosmetique">
        <Form.Label>💄 {t('cosmetic_type', 'Type de cosmétique')}</Form.Label>
        <Form.Select
          name="typeCosmetique"
          value={postData.typeCosmetique || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_cosmetic_type', 'Sélectionnez type')}</option>
          <optgroup label="🎨 Maquillage Visage">
            <option value="fond_teint_liquide">🧴 Fond de teint liquide</option>
            <option value="fond_teint_creme">🧴 Fond de teint crème</option>
            <option value="fond_teint_poudre">🎨 Fond de teint poudre</option>
            <option value="anti_cernes">👁️ Anti-cernes/correcteur</option>
            <option value="poudre_libre">🎨 Poudre libre</option>
            <option value="poudre_compacte">🎨 Poudre compacte</option>
            <option value="blush_creme">🎨 Blush crème</option>
            <option value="blush_poudre">🎨 Blush poudre</option>
            <option value="highlighter">✨ Highlighter/illuminateur</option>
            <option value="bronzer">☀️ Bronzer/contouring</option>
            <option value="primer">🎨 Primer/base de maquillage</option>
            <option value="fixateur">🔒 Fixateur/fixing spray</option>
          </optgroup>
          <optgroup label="👁️ Maquillage Yeux">
            <option value="fard_paupieres_palette">🎨 Palette de fards</option>
            <option value="fard_paupieres_unitaire">🎨 Fard à paupières unitaire</option>
            <option value="mascara">👁️ Mascara</option>
            <option value="eyeliner_liquide">✏️ Eyeliner liquide</option>
            <option value="eyeliner_crayon">✏️ Eyeliner crayon</option>
            <option value="eyeliner_glitter">✨ Eyeliner pailleté</option>
            <option value="crayon_sourcils">✏️ Crayon à sourcils</option>
            <option value="gel_sourcils">🧴 Gel à sourcils</option>
            <option value="pommade_sourcils">🧴 Pommade à sourcils</option>
            <option value="ombre_a_paupieres">👁️ Ombre à paupières</option>
            <option value="faux_cils">👁️ Faux cils</option>
            <option value="colle_faux_cils">🧴 Colle pour faux cils</option>
          </optgroup>
          <optgroup label="👄 Maquillage Lèvres">
            <option value="rouge_levres_liquide">💄 Rouge à lèvres liquide</option>
            <option value="rouge_levres_creme">💄 Rouge à lèvres crème</option>
            <option value="rouge_levres_matte">💄 Rouge à lèvres mat</option>
            <option value="gloss">✨ Gloss/brillant à lèvres</option>
            <option value="crayon_levres">✏️ Crayon à lèvres</option>
            <option value="baume_levres">🧴 Baume à lèvres</option>
            <option value="stylo_levres">🖊️ Stylo à lèvres</option>
            <option value="lip_gloss">✨ Lip gloss</option>
            <option value="stain_levres">💄 Lip stain/tatoo</option>
            <option value="primer_levres">🎨 Primer pour lèvres</option>
          </optgroup>
          <optgroup label="🧴 Soins Visage">
            <option value="demaquillant">🧴 Démaquillant</option>
            <option value="nettoyant_visage">🧼 Nettoyant visage</option>
            <option value="tonique_lotion">💧 Tonique/lotion</option>
            <option value="creme_hydratante">🧴 Crème hydratante</option>
            <option value="serum_visage">💧 Sérum visage</option>
            <option value="contour_yeux">👁️ Crème contour des yeux</option>
            <option value="masque_visage">🧖 Masque visage</option>
            <option value="gommage_exfoliant">🧽 Gommage/exfoliant</option>
            <option value="soin_nuit">🌙 Soin nuit</option>
            <option value="soin_jour">☀️ Soin jour</option>
            <option value="bb_cc_cream">🎨 BB/CC cream</option>
            <option value="creme_main">🤲 Crème pour les mains</option>
          </optgroup>
          <optgroup label="💇 Soins Cheveux">
            <option value="shampoing">🧴 Shampoing</option>
            <option value="apres_shampoing">🧴 Après-shampoing</option>
            <option value="masque_cheveux">🧖 Masque cheveux</option>
            <option value="soin_cheveux">🧴 Soin cheveux (sérum, huile)</option>
            <option value="coiffant">💇 Produit coiffant (gel, laque)</option>
            <option value="colorant_cheveux">🎨 Colorant cheveux</option>
            <option value="decolorant">⚪ Décolorant</option>
            <option value="soin_barbe">🧔 Soin barbe</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 5. TYPE PARFUM (solo para perfumes)
    'typeParfum': (
      <Form.Group key="typeParfum">
        <Form.Label>🌸 {t('perfume_type', 'Type de parfum')}</Form.Label>
        <Form.Select
          name="typeParfum"
          value={postData.typeParfum || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_perfume_type', 'Sélectionnez type')}</option>
          <optgroup label="💎 Concentrations">
            <option value="extrait_parfum">💎 Extrait de parfum (25-40%)</option>
            <option value="parfum">🌸 Parfum (15-25%)</option>
            <option value="eau_parfum">💦 Eau de parfum (8-15%)</option>
            <option value="eau_toilette">🚿 Eau de toilette (4-8%)</option>
            <option value="eau_cologne">🍋 Eau de Cologne (2-5%)</option>
            <option value="fraicheur">💧 Fraîcheur/body spray (1-3%)</option>
          </optgroup>
          <optgroup label="🧴 Formats">
            <option value="vaporisateur">💨 Vaporisateur</option>
            <option value="pompe">🧴 Pommade/pompe</option>
            <option value="roll_on">🔵 Roll-on</option>
            <option value="stick">🛁 Stick</option>
            <option value="creme">🧴 Crème parfumée</option>
            <option value="huile">💧 Huile parfumée</option>
            <option value="solide">🧼 Parfum solide</option>
            <option value="atomiseur">💨 Atomiseur rechargeable</option>
          </optgroup>
          <optgroup label="🎁 Sets & Coffrets">
            <option value="coffret_decouverte">🎁 Coffret découverte</option>
            <option value="duo_parfum">🎭 Duo de parfums</option>
            <option value="set_voyage">🧳 Set de voyage</option>
            <option value="avec_soin">🎀 Parfum + soin associé</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 6. FAMILLE OLFACTIVE (solo para perfumes)
    'familleOlfactive': (
      <Form.Group key="familleOlfactive">
        <Form.Label>👃 {t('olfactive_family', 'Famille olfactive')}</Form.Label>
        <Form.Select
          name="familleOlfactive"
          value={postData.familleOlfactive || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_family', 'Sélectionnez famille')}</option>
          <optgroup label="🌹 Florales">
            <option value="florale_fraiche">🌹 Florale fraîche</option>
            <option value="florale_boisee">🌲 Florale boisée</option>
            <option value="florale_fruitee">🍎 Florale fruitée</option>
            <option value="florale_aldehydique">✨ Florale aldéhydique</option>
            <option value="florale_verte">🍃 Florale verte</option>
            <option value="florale_poudree">🌸 Florale poudrée</option>
            <option value="florale_solaire">☀️ Florale solaire</option>
          </optgroup>
          <optgroup label="🌲 Orientales & Boisées">
            <option value="boisee_seche">🌲 Boisée sèche</option>
            <option value="boisee_aromatiqe">🌿 Boisée aromatique</option>
            <option value="orientale_vanillee">🍦 Orientale vanillée</option>
            <option value="orientale_epicee">🌶️ Orientale épicée</option>
            <option value="orientale_ambre">🟠 Orientale ambrée</option>
            <option value="orientale_florale">🌸 Orientale florale</option>
            <option value="boisee_mossy">🍃 Boisée mousseuse</option>
          </optgroup>
          <optgroup label="🍎 Fruitées & Gourmandes">
            <option value="fruitee_citrus">🍋 Fruitée citrus</option>
            <option value="fruitee_rouge">🍓 Fruitée fruits rouges</option>
            <option value="fruitee_tropicale">🍍 Fruitée tropicale</option>
            <option value="gourmande_chocolat">🍫 Gourmande chocolat</option>
            <option value="gourmande_caramel">🍮 Gourmande caramel</option>
            <option value="gourmande_fruit">🍰 Gourmande fruitée</option>
            <option value="gourmande_lait">🥛 Gourmande laiteuse</option>
          </optgroup>
          <optgroup label="💦 Fraîches & Aquatiques">
            <option value="aquatique_frais">💦 Aquatique frais</option>
            <option value="aquatique_marin">🌊 Aquatique marin</option>
            <option value="ozonique">🌪️ Ozonique/frais</option>
            <option value="vert_herbace">🌿 Vert/herbacé</option>
            <option value="citrus_frais">🍋 Citrus frais</option>
            <option value="menthe">🌱 Menthe/rafraîchissant</option>
          </optgroup>
          <optgroup label="👔 Classiques & Spéciaux">
            <option value="chypre">🌲 Chypre</option>
            <option value="fougere">🌿 Fougère</option>
            <option value="cuir">🐄 Cuir</option>
            <option value="tabac">🚬 Tabac</option>
            <option value="musc">🦌 Musc</option>
            <option value="patchouli">🍃 Patchouli</option>
            <option value="vetiver">🌿 Vétiver</option>
            <option value="santal">🪵 Santal</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 7. TYPE DEODORANT
    'typeDeodorant': (
      <Form.Group key="typeDeodorant">
        <Form.Label>🛁 {t('deodorant_type', 'Type de déodorant')}</Form.Label>
        <Form.Select
          name="typeDeodorant"
          value={postData.typeDeodorant || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_deodorant_type', 'Sélectionnez type')}</option>
          <optgroup label="💨 Formes">
            <option value="spray_aerosol">💨 Spray aérosol</option>
            <option value="spray_vaporisateur">💨 Spray vaporisateur</option>
            <option value="roll_on_bille">🔵 Roll-on/bille</option>
            <option value="stick">🧼 Stick</option>
            <option value="creme">🧴 Crème</option>
            <option value="baume">🧴 Baume</option>
            <option value="poudre">🎨 Poudre</option>
            <option value="cristal">💎 Cristal de pierre d'alun</option>
            <option value="huile">💧 Huile</option>
          </optgroup>
          <optgroup label="🎯 Actions">
            <option value="anti_transpirant">💧 Anti-transpirant</option>
            <option value="deodorant">🌸 Déodorant (sans anti-transpirant)</option>
            <option value="naturel">🌿 Naturel/bio</option>
            <option value="sans_aluminium">🚫 Sans sels d'aluminium</option>
            <option value="sans_alcool">🚫 Sans alcool</option>
            <option value="sensible_peau">⚠️ Pour peaux sensibles</option>
            <option value="forte_protection">🛡️ Protection renforcée</option>
            <option value="actif_sport">🏃 Actif sport</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 8. GENRE (radio buttons mejorados)
    'genre': (
      <Form.Group key="genre">
        <Form.Label>👤 {t('gender', 'Genre')}</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          <Form.Check
            type="radio"
            name="genre"
            id="genre_femme"
            label={<><span className="fs-5">👩</span> {t('female', 'Femme')}</>}
            value="femme"
            checked={postData.genre === 'femme'}
            onChange={handleChangeInput}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            name="genre"
            id="genre_homme"
            label={<><span className="fs-5">👨</span> {t('male', 'Homme')}</>}
            value="homme"
            checked={postData.genre === 'homme'}
            onChange={handleChangeInput}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            name="genre"
            id="genre_mixte"
            label={<><span className="fs-5">👫</span> {t('unisex', 'Mixte/Unisexe')}</>}
            value="mixte"
            checked={postData.genre === 'mixte'}
            onChange={handleChangeInput}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            name="genre"
            id="genre_enfant"
            label={<><span className="fs-5">👶</span> {t('children', 'Enfant')}</>}
            value="enfant"
            checked={postData.genre === 'enfant'}
            onChange={handleChangeInput}
            className="mb-2"
          />
        </div>
      </Form.Group>
    ),
    
    // 9. TYPE COMPLEMENT (para parapharmacie)
    'typeComplement': (
      <Form.Group key="typeComplement">
        <Form.Label>🥗 {t('supplement_type', 'Type de complément')}</Form.Label>
        <Form.Select
          name="typeComplement"
          value={postData.typeComplement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_supplement', 'Sélectionnez type')}</option>
          <optgroup label="💊 Vitamines">
            <option value="vitamine_c">🍊 Vitamine C</option>
            <option value="vitamine_d">☀️ Vitamine D</option>
            <option value="vitamine_b">⚡ Complexe vitamine B</option>
            <option value="vitamine_a">🥕 Vitamine A</option>
            <option value="vitamine_e">🌰 Vitamine E</option>
            <option value="vitamine_k">🌿 Vitamine K</option>
            <option value="multivitamines">💊 Multivitamines</option>
          </optgroup>
          <optgroup label="🧪 Minéraux & Oligo-éléments">
            <option value="magnesium">🧲 Magnésium</option>
            <option value="fer">🧲 Fer</option>
            <option value="zinc">⚡ Zinc</option>
            <option value="calcium">🦴 Calcium</option>
            <option value="potassium">🍌 Potassium</option>
            <option value="selenium">⚡ Sélénium</option>
            <option value="iode">🧂 Iode</option>
            <option value="chrome">⚡ Chrome</option>
          </optgroup>
          <optgroup label="💪 Protéines & Sport">
            <option value="proteine_whey">🥛 Protéine Whey</option>
            <option value="proteine_vegetale">🌱 Protéine végétale</option>
            <option value="bcaa">💪 BCAA</option>
            <option value="creatine">💪 Créatine</option>
            <option value="pre_workout">🏋️ Pré-workout</option>
            <option value="bruleur_graisse">🔥 Brûleur de graisse</option>
            <option value="boisson_energetique">⚡ Boisson énergétique</option>
            <option value="barre_proteinee">🍫 Barre protéinée</option>
          </optgroup>
          <optgroup label="🌿 Plantes & Naturels">
            <option value="plantes_medicinales">🌿 Plantes médicinales</option>
            <option value="extraits_plantes">🌱 Extraits de plantes</option>
            <option value="huiles_essentielles">💧 Huiles essentielles</option>
            <option value="ginseng">🌿 Ginseng</option>
            <option value="gelule_plante">🌿 Gélules de plantes</option>
            <option value="tisane_infusion">🍵 Tisane/infusion</option>
            <option value="poudre_plante">🌿 Poudre de plante</option>
          </optgroup>
          <optgroup label="🦠 Santé Digestive">
            <option value="probiotiques">🦠 Probiotiques</option>
            <option value="prebiotiques">🌿 Prébioptiques</option>
            <option value="enzymes">🧪 Enzymes digestives</option>
            <option value="fibres">🌾 Fibres</option>
            <option value="charbon_active">⚫ Charbon activé</option>
            <option value="detox">🍃 Détox/drainage</option>
          </optgroup>
          <optgroup label="🎯 Santé Spécifique">
            <option value="articulations">🦵 Articulations (glucosamine)</option>
            <option value="sommeil">😴 Sommeil (mélatonine)</option>
            <option value="stress">😌 Stress/relaxation</option>
            <option value="memoire">🧠 Mémoire/concentration</option>
            <option value="immunite">🛡️ Immunité</option>
            <option value="coeur">❤️ Santé cardiovasculaire</option>
            <option value="vision">👁️ Vision (lutéine)</option>
            <option value="peau_cheveux_ongles">💅 Peau, cheveux & ongles</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 10. UTILISATION (para cosméticos)
    'utilisation': (
      <Form.Group key="utilisation">
        <Form.Label>🎯 {t('use', 'Utilisation')}</Form.Label>
        <Form.Select
          name="utilisation"
          value={postData.utilisation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_use', 'Sélectionnez utilisation')}</option>
          <optgroup label="😊 Visage">
            <option value="visage_complet">😊 Visage complet</option>
            <option value="contour_yeux">👁️ Contour des yeux</option>
            <option value="levres">👄 Lèvres</option>
            <option value="cernes_poches">👁️ Cernes & poches</option>
            <option value="taches">🎨 Taches pigmentaires</option>
            <option value="boutons_acne">🔴 Boutons & acné</option>
            <option value="rides">👵 Rides & ridules</option>
            <option value="pores">🔍 Pores dilatés</option>
          </optgroup>
          <optgroup label="💪 Corps">
            <option value="corps_complet">💪 Corps complet</option>
            <option value="mains">🤲 Mains</option>
            <option value="pieds">🦶 Pieds</option>
            <option value="cou">👔 Cou/décolleté</option>
            <option value="jambes">🦵 Jambes</option>
            <option value="bras">💪 Bras</option>
            <option value="ventre">🤰 Ventre</option>
            <option value="dos">🏋️ Dos</option>
          </optgroup>
          <optgroup label="💇 Cheveux & Cuir chevelu">
            <option value="cheveux_complets">💇 Cheveux complets</option>
            <option value="cuir_chevelu">💆 Cuir chevelu</option>
            <option value="pointes">✂️ Pointes fourchues</option>
            <option value="racines">🌱 Racines</option>
            <option value="cheveux_gras">💧 Cheveux gras</option>
            <option value="cheveux_secs">🍂 Cheveux secs</option>
            <option value="cheveux_colores">🎨 Cheveux colorés</option>
            <option value="cheveux_fins">💇 Cheveux fins</option>
            <option value="cheveux_epais">💇 Cheveux épais</option>
          </optgroup>
          <optgroup label="🛁 Spécialisés">
            <option value="douche_bain">🚿 Douche & bain</option>
            <option value="apres_rasage">🪒 Après-rasage</option>
            <option value="apres_soleil">🌞 Après-soleil</option>
            <option value="massage">💆 Massage</option>
            <option value="grossesse">🤰 Grossesse/vergetures</option>
            <option value="bebe">👶 Bébé</option>
            <option value="intime">🌸 Intime</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 11. TYPE PEAU (para cosméticos)
    'typePeau': (
      <Form.Group key="typePeau">
        <Form.Label>🧴 {t('skin_type', 'Type de peau')}</Form.Label>
        <Form.Select
          name="typePeau"
          value={postData.typePeau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_skin_type', 'Sélectionnez type')}</option>
          <optgroup label="🎯 Types de base">
            <option value="normale">😊 Normale</option>
            <option value="seche">🍂 Sèche</option>
            <option value="grasse">💧 Grasse</option>
            <option value="mixte">🔄 Mixte</option>
          </optgroup>
          <optgroup label="⚠️ Peaux sensibles & réactives">
            <option value="sensible">⚠️ Sensible</option>
            <option value="reactives">🔥 Réactive</option>
            <option value="intolerante">🚫 Intolérante</option>
            <option value="atopique">🔴 Atopique</option>
          </optgroup>
          <optgroup label="🎨 Problèmes spécifiques">
            <option value="acneique">🔴 Acnéique</option>
            <option value="imperfections">🎨 À imperfections</option>
            <option value="couperose">🔴 Couperose/rosacée</option>
            <option value="dartres">🎨 Dartres</option>
            <option value="eczema">🔴 Eczéma</option>
            <option value="psoriasis">🎨 Psoriasis</option>
            <option value="deshydratee">💧 Déshydratée</option>
            <option value="terne">🌑 Terne/fatiguée</option>
          </optgroup>
          <optgroup label="👵 Âge & Prévention">
            <option value="jeune">👶 Jeune</option>
            <option value="mature">👩 Mature</option>
            <option value="rides">👵 À rides</option>
            <option value="prevention">🛡️ Prévention vieillissement</option>
            <option value="fermete">💪 Fermeté/élasticité</option>
          </optgroup>
          <optgroup label="🌞 Exposition & Teint">
            <option value="claire">⚪ Claire</option>
            <option value="mate">🟤 Mate</option>
            <option value="foncee">🟤 Foncée</option>
            <option value="sensible_soleil">☀️ Sensible au soleil</option>
            <option value="taches_solaires">🌞 Taches solaires</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 12. SPF (protection solaire)
    'spf': (
      <Form.Group key="spf">
        <Form.Label>☀️ {t('spf', 'Indice de protection solaire (SPF)')}</Form.Label>
        <Form.Select
          name="spf"
          value={postData.spf || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_spf', 'Sélectionnez SPF')}</option>
          <optgroup label="🚫 Sans protection">
            <option value="0">0 ({t('none', 'Aucune protection')})</option>
          </optgroup>
          <optgroup label="🌤️ Protection faible">
            <option value="6">SPF 6</option>
            <option value="10">SPF 10</option>
            <option value="15">SPF 15</option>
          </optgroup>
          <optgroup label="🌞 Protection moyenne">
            <option value="20">SPF 20</option>
            <option value="25">SPF 25</option>
            <option value="30">SPF 30</option>
          </optgroup>
          <optgroup label="🏖️ Haute protection">
            <option value="50">SPF 50</option>
            <option value="50+">SPF 50+</option>
          </optgroup>
          <optgroup label="🛡️ Très haute protection">
            <option value="100">SPF 100</option>
          </optgroup>
          <optgroup label="🎯 Spécialisés">
            <option value="kids">👶 Enfants/bébé</option>
            <option value="sport">🏊 Sport/résistant à l'eau</option>
            <option value="sensibilite">⚠️ Peaux sensibles</option>
            <option value="anti_taches">🎨 Anti-taches</option>
            <option value="teinte">🎨 Teintée</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 13. DATE PEREMPTION (fecha de caducidad)
    'datePeremption': (
      <Form.Group key="datePeremption">
        <Form.Label>📅 {t('expiry_date', 'Date de péremption')}</Form.Label>
        <Row className="g-2">
          <Col>
            <Form.Control
              type="date"
              name="datePeremption"
              value={postData.datePeremption || ''}
              onChange={handleChangeInput}
              min={new Date().toISOString().split('T')[0]}
            />
          </Col>
          <Col>
            <Form.Select
              name="periodeApresOuverture"
              value={postData.periodeApresOuverture || ''}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="">PAO (période après ouverture)</option>
              <option value="6M">6 mois ⏰</option>
              <option value="12M">12 mois 📅</option>
              <option value="18M">18 mois ⏳</option>
              <option value="24M">24 mois 📆</option>
              <option value="36M">36 mois 🗓️</option>
              <option value="indefini">Indéfini ♾️</option>
            </Form.Select>
          </Col>
        </Row>
        <Form.Text className="text-muted d-block mt-1">
          ⚠️ {t('expiry_warning', 'Les produits périmés ne peuvent être vendus')}
          {postData.datePeremption && (
            <span className="ms-2">
              📅 Expire le: {new Date(postData.datePeremption).toLocaleDateString()}
            </span>
          )}
        </Form.Text>
      </Form.Group>
    ),
    
    // 14. OUVERT (producto abierto)
    'ouvert': (
      <Form.Group key="ouvert">
        <Form.Label>🔓 {t('opened', 'État du produit')}</Form.Label>
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Form.Check
            type="radio"
            name="ouvert"
            id="ouvert_neuf"
            label={<><span className="fs-5">🆕</span> Neuf scellé</>}
            value="neuf_scelle"
            checked={postData.ouvert === 'neuf_scelle'}
            onChange={handleChangeInput}
          />
          <Form.Check
            type="radio"
            name="ouvert"
            id="ouvert_entame"
            label={<><span className="fs-5">🔓</span> Entamé/testé</>}
            value="entame"
            checked={postData.ouvert === 'entame'}
            onChange={handleChangeInput}
          />
          <Form.Check
            type="radio"
            name="ouvert"
            id="ouvert_usage"
            label={<><span className="fs-5">💄</span> Usage personnel</>}
            value="usage_personnel"
            checked={postData.ouvert === 'usage_personnel'}
            onChange={handleChangeInput}
          />
        </div>
        
        {(postData.ouvert === 'entame' || postData.ouvert === 'usage_personnel') && (
          <div className="mt-3">
            <Form.Label>📅 {t('opening_date', 'Date d\'ouverture approximative')}</Form.Label>
            <Form.Control
              type="date"
              name="dateOuverture"
              value={postData.dateOuverture || ''}
              onChange={handleChangeInput}
              max={new Date().toISOString().split('T')[0]}
            />
            <Form.Text className="text-muted">
              💡 Indiquez approximativement quand le produit a été ouvert
            </Form.Text>
          </div>
        )}
        
        <div className="mt-3">
          <Form.Label>📏 {t('remaining_quantity', 'Quantité restante')}</Form.Label>
          <Row className="g-2">
            <Col xs={8}>
              <Form.Control
                type="number"
                name="quantiteRestante"
                value={postData.quantiteRestante || ''}
                onChange={handleChangeInput}
                placeholder="Ex: 75"
                min="0"
                max="100"
                step="1"
              />
            </Col>
            <Col xs={4}>
              <div className="input-group">
                <Form.Control
                  type="text"
                  value={`${postData.quantiteRestante || 0}%`}
                  readOnly
                  className="text-center"
                />
                <span className="input-group-text">%</span>
              </div>
            </Col>
          </Row>
          <Form.Text className="text-muted">
            💡 Pourcentage approximatif de produit restant
          </Form.Text>
        </div>
      </Form.Group>
    ),
    
    // 15. CONSERVATION (almacenamiento)
    'conservation': (
      <Form.Group key="conservation">
        <Form.Label>🌡️ {t('storage', 'Conditions de conservation')}</Form.Label>
        <Form.Select
          name="conservation"
          value={postData.conservation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_storage', 'Sélectionnez')}</option>
          <optgroup label="🏠 Température ambiante">
            <option value="ambiante_seche">🏜️ Endroit sec</option>
            <option value="ambiante_frais">🌬️ Endroit frais</option>
            <option value="hors_soleil">🌑 À l'abri du soleil</option>
            <option value="hors_humidite">🏜️ À l'abri de l'humidité</option>
            <option value="hors_chaleur">🌡️ À l'abri de la chaleur</option>
          </optgroup>
          <optgroup label="🧊 Réfrigération">
            <option value="refrigerateur">🧊 Réfrigérateur (2-8°C)</option>
            <option value="refrigerateur_porte">🚪 Porte du réfrigérateur</option>
            <option value="congelateur">🧊 Congélateur (-18°C)</option>
          </optgroup>
          <optgroup label="🎯 Spécial">
            <option value="pharmacie">💊 Conservation en pharmacie</option>
            <option value="sterile">🦠 Stérile/protégé</option>
            <option value="origine_emballage">📦 Dans son emballage d'origine</option>
            <option value="vertical">⬆️ Position verticale</option>
            <option value="horizontal">➡️ Position horizontale</option>
          </optgroup>
        </Form.Select>
      </Form.Group>
    ),
    
    // 16. COMPOSITION (composición)
    'composition': (
      <Form.Group key="composition">
        <Form.Label>🧪 {t('composition', 'Composition & Caractéristiques')}</Form.Label>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {['bio', 'naturel', 'vegan', 'cruelty_free', 'hypoallergenique', 'sans_paraben', 'sans_sulfate', 'sans_parfum', 'sans_alcool', 'sans_colorant'].map(tag => (
            <Form.Check
              key={tag}
              type="checkbox"
              id={`comp_${tag}`}
              name="compositionTags"
              value={tag}
              checked={postData.compositionTags?.includes(tag) || false}
              onChange={(e) => {
                const newTags = postData.compositionTags || [];
                if (e.target.checked) {
                  handleChangeInput({
                    target: {
                      name: 'compositionTags',
                      value: [...newTags, tag]
                    }
                  });
                } else {
                  handleChangeInput({
                    target: {
                      name: 'compositionTags',
                      value: newTags.filter(t => t !== tag)
                    }
                  });
                }
              }}
              label={
                tag === 'bio' ? '🌿 Bio' :
                tag === 'naturel' ? '🍃 Naturel' :
                tag === 'vegan' ? '🌱 Végan' :
                tag === 'cruelty_free' ? '🐇 Cruelty-free' :
                tag === 'hypoallergenique' ? '⚠️ Hypoallergénique' :
                tag === 'sans_paraben' ? '🚫 Sans parabène' :
                tag === 'sans_sulfate' ? '🚫 Sans sulfate' :
                tag === 'sans_parfum' ? '🚫 Sans parfum' :
                tag === 'sans_alcool' ? '🚫 Sans alcool' :
                '🚫 Sans colorant'
              }
              className="mb-1"
            />
          ))}
        </div>
        
        <Form.Control
          as="textarea"
          name="compositionDetail"
          value={postData.compositionDetail || ''}
          onChange={handleChangeInput}
          placeholder={t('composition_details', 'Détails sur la composition, ingrédients actifs...')}
          rows={3}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <Form.Text className="text-muted">
          💡 Liste des ingrédients principaux ou particularités
        </Form.Text>
      </Form.Group>
    )
  };
  
  // Lógica de renderizado
  const subCategoryFields = getSubCategorySpecificFields();
  
  console.log('💄 SanteBeauteFields - Renderizando:', {
    subCategory,
    fieldName,
    fieldsCount: subCategoryFields.length,
    fields: subCategoryFields
  });
  
  // Si se solicita un campo específico
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    if (!fieldComponent) {
      console.error(`❌ Campo '${fieldName}' no encontrado en SanteBeauteFields`);
      return (
        <div className="alert alert-danger">
          <strong>Error:</strong> Campo '{fieldName}' no está definido para santé & beauté.
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
        <strong>💄 Información:</strong> Selecciona una subcategoría de santé & beauté para ver los campos específicos.
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

export default SanteBeauteFields;